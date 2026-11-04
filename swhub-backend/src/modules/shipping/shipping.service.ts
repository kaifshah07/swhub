import { Prisma } from "@prisma/client";
import { prisma } from "../../config/database";
import { env } from "../../config/env";
import { ShiprocketAuthService } from "./shiprocket.auth.service";
import { ShiprocketClient } from "./shiprocket.client";
import {
  PackageDimensions,
  ParsedAddress,
  ShiprocketAssignAwbResponse,
  ShiprocketCreateOrderRequest,
  ShiprocketCreateOrderResponse,
  ShiprocketGenerateLabelResponse,
  ShiprocketPickupResponse,
  ShiprocketServiceabilityResponse,
  ShiprocketTrackingResponse,
  ShiprocketWebhookPayload,
} from "./shiprocket.types";

export class ShippingService {
  /**
   * Default package dimensions if not provided by admin
   */
  public static readonly DEFAULT_DIMENSIONS: PackageDimensions = {
    weight: 0.5, // 500 grams default
    length: 15,  // 15 cm
    breadth: 12, // 12 cm
    height: 8,   // 8 cm
  };

  /**
   * Parses customer address string into structured Shiprocket fields.
   * Address format: "Street Address, City, State - 123456"
   */
  public static parseAddress(addressString: string, customer?: any): ParsedAddress {
    const raw = (addressString || "").trim();

    // 1. Extract 6-digit Indian PIN code
    const pinMatch = raw.match(/\b([1-9][0-9]{5})\b/);
    const pincode = pinMatch ? pinMatch[1] : "110001";

    // 2. Remove the pincode and trailing dashes/spaces
    let cleaned = raw.replace(new RegExp(`[-–\\s]*${pincode}\\b`), "").trim();

    // 3. Extract parts split by commas
    const parts = cleaned.split(",").map((p) => p.trim()).filter(Boolean);

    let city = "New Delhi";
    let state = "Delhi";
    let addressLine1 = cleaned;
    let addressLine2 = "";

    if (parts.length >= 3) {
      state = parts[parts.length - 1];
      city = parts[parts.length - 2];
      addressLine1 = parts.slice(0, parts.length - 2).join(", ");
    } else if (parts.length === 2) {
      city = parts[parts.length - 1];
      addressLine1 = parts[0];
    }

    if (!addressLine1 || addressLine1.length < 5) {
      addressLine1 = raw.length > 5 ? raw : "Main Street, Landmark";
    }

    // Customer details
    const fullName = customer?.name || "Customer";
    let phone = (customer?.phone || "").replace(/\D/g, "");
    if (phone.length > 10 && phone.startsWith("91")) {
      phone = phone.substring(2);
    }
    if (!phone || phone.length < 10) {
      phone = "9876543210";
    }

    const email = customer?.email || "customer@swhub.com";

    return {
      fullName,
      addressLine1,
      addressLine2,
      city,
      state,
      pincode,
      phone,
      email,
    };
  }

  /**
   * Checks courier serviceability and estimated freight rates.
   */
  public static async checkServiceability(
    orderId: number,
    customDimensions?: Partial<PackageDimensions>
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: { customer: true, items: { include: { product: true } } },
    });

    if (!order) {
      throw new Error(`Order #${orderId} not found`);
    }

    const parsedAddress = this.parseAddress(order.address, order.customer);
    const dimensions: PackageDimensions = {
      weight: Number(customDimensions?.weight) || this.DEFAULT_DIMENSIONS.weight,
      length: Number(customDimensions?.length) || this.DEFAULT_DIMENSIONS.length,
      breadth: Number(customDimensions?.breadth) || this.DEFAULT_DIMENSIONS.breadth,
      height: Number(customDimensions?.height) || this.DEFAULT_DIMENSIONS.height,
    };

    if (!ShiprocketAuthService.isConfigured()) {
      return {
        enabled: false,
        mode: "TEST_OR_DISABLED",
        message: "Shiprocket integration is disabled or credentials are not configured.",
        deliveryPincode: parsedAddress.pincode,
        dimensions,
        availableCouriers: [
          {
            courier_company_id: 1,
            courier_name: "Delhivery Surface (Simulated)",
            rate: 45.0,
            etd: "3-4 Days",
            estimated_delivery_days: 3,
            cod: 0,
            rating: 4.5,
          },
          {
            courier_company_id: 2,
            courier_name: "Bluedart Air (Simulated)",
            rate: 65.0,
            etd: "1-2 Days",
            estimated_delivery_days: 2,
            cod: 0,
            rating: 4.8,
          },
        ],
      };
    }

    try {
      const response = await ShiprocketClient.get<ShiprocketServiceabilityResponse>(
        "/courier/serviceability/",
        {
          pickup_postcode: env.SHIPROCKET_PICKUP_LOCATION,
          delivery_postcode: parsedAddress.pincode,
          weight: dimensions.weight,
          cod: 0, // All SW Hub orders are prepaid online
        }
      );

      const couriers = response?.data?.available_courier_companies || [];
      // Sort couriers by rate ascending
      couriers.sort((a, b) => Number(a.rate) - Number(b.rate));

      return {
        enabled: true,
        mode: "LIVE",
        deliveryPincode: parsedAddress.pincode,
        dimensions,
        recommendedCourierId: response?.data?.recommended_courier_company_id,
        availableCouriers: couriers,
      };
    } catch (error: any) {
      console.warn(
        `[ShippingService] Live serviceability check failed: ${error.message}. Returning fallback estimates.`
      );
      return {
        enabled: true,
        mode: "FALLBACK_ESTIMATE",
        message: `Courier serviceability check notice: ${error.message}`,
        deliveryPincode: parsedAddress.pincode,
        dimensions,
        availableCouriers: [
          {
            courier_company_id: 1,
            courier_name: "Standard Ground Delivery",
            rate: 50.0,
            etd: "3-5 Days",
            cod: 0,
          },
        ],
      };
    }
  }

  /**
   * Creates a Shiprocket order and registers local Shipment record.
   * STRICT GUARD: Rejects unpaid orders.
   */
  public static async createShipment(
    orderId: number,
    params: {
      dimensions?: Partial<PackageDimensions>;
      courierId?: number;
      autoAssignAwb?: boolean;
    } = {}
  ) {
    const order = await prisma.order.findUnique({
      where: { id: orderId },
      include: {
        customer: true,
        shipment: true,
        items: { include: { product: true } },
      },
    });

    if (!order) {
      throw new Error(`Order #${orderId} not found`);
    }

    // STRICT PREPAID VALIDATION GUARD
    if (order.paymentMethod === "ONLINE" && order.paymentStatus !== "PAID") {
      throw new Error(
        `Cannot create shipment for Order #${order.orderNumber}: Online payment is not confirmed (Status: ${order.paymentStatus}).`
      );
    }

    // IDEMPOTENCY GUARD: Do not duplicate shipments
    if (order.shipment) {
      return {
        success: true,
        message: "Shipment already exists for this order",
        shipment: order.shipment,
      };
    }

    const parsedAddress = this.parseAddress(order.address, order.customer);
    const dimensions: PackageDimensions = {
      weight: Number(params.dimensions?.weight) || this.DEFAULT_DIMENSIONS.weight,
      length: Number(params.dimensions?.length) || this.DEFAULT_DIMENSIONS.length,
      breadth: Number(params.dimensions?.breadth) || this.DEFAULT_DIMENSIONS.breadth,
      height: Number(params.dimensions?.height) || this.DEFAULT_DIMENSIONS.height,
    };

    // Format order date: YYYY-MM-DD HH:mm
    const now = new Date();
    const orderDateFormatted = now.toISOString().slice(0, 19).replace("T", " ");

    const orderItems = order.items.map((item) => ({
      name: item.product?.name || `Item #${item.productId}`,
      sku: item.product?.sku || `SKU-${item.productId}`,
      units: item.quantity,
      selling_price: Number(item.price),
      discount: 0,
      tax: 0,
    }));

    // If Shiprocket is disabled / mock mode
    if (!ShiprocketAuthService.isConfigured()) {
      const mockShipmentId = `MOCK-SR-${Date.now()}`;
      const mockAwb = `AWB-${order.orderNumber}`;

      const createdShipment = await prisma.$transaction(async (tx) => {
        const shipment = await tx.shipment.create({
          data: {
            orderId: order.id,
            shiprocketOrderId: mockShipmentId,
            shipmentId: mockShipmentId,
            awbCode: mockAwb,
            courierCompanyId: params.courierId || 1,
            courierName: "Delhivery (Simulation)",
            status: "AWB_ASSIGNED",
            statusDescription: "Simulated shipment created for test environment",
            weight: new Prisma.Decimal(dimensions.weight),
            length: new Prisma.Decimal(dimensions.length),
            breadth: new Prisma.Decimal(dimensions.breadth),
            height: new Prisma.Decimal(dimensions.height),
            shippingCost: new Prisma.Decimal(45.0),
            etd: "3-4 Days",
            trackingHistory: [
              {
                date: new Date().toISOString(),
                status: "AWB_ASSIGNED",
                activity: "Shipment manifested and AWB assigned (Test Mode)",
                location: "Warehouse",
              },
            ],
            lastTrackedAt: new Date(),
          },
        });

        // Advance order status to PACKED if it was CONFIRMED or PENDING
        if (order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED") {
          await tx.order.update({
            where: { id: order.id },
            data: { orderStatus: "PACKED" },
          });
        }

        return shipment;
      });

      return {
        success: true,
        mode: "TEST_MODE",
        message: "Simulated shipment and AWB created successfully (Shiprocket in Test Mode)",
        shipment: createdShipment,
      };
    }

    // LIVE SHIPROCKET DISPATCH
    const payload: ShiprocketCreateOrderRequest = {
      order_id: order.orderNumber,
      order_date: orderDateFormatted,
      pickup_location: env.SHIPROCKET_PICKUP_LOCATION,
      billing_customer_name: parsedAddress.fullName,
      billing_last_name: "",
      billing_address: parsedAddress.addressLine1,
      billing_address_2: parsedAddress.addressLine2 || "",
      billing_city: parsedAddress.city,
      billing_pincode: parsedAddress.pincode,
      billing_state: parsedAddress.state,
      billing_country: "India",
      billing_email: parsedAddress.email,
      billing_phone: parsedAddress.phone,
      shipping_is_billing: true,
      order_items: orderItems,
      payment_method: "Prepaid",
      sub_total: Number(order.totalAmount),
      length: dimensions.length,
      breadth: dimensions.breadth,
      height: dimensions.height,
      weight: dimensions.weight,
    };

    const response = await ShiprocketClient.post<ShiprocketCreateOrderResponse>(
      "/orders/create/adhoc",
      payload
    );

    const srOrderId = String(response.order_id);
    const srShipmentId = String(response.shipment_id);

    const savedShipment = await prisma.$transaction(async (tx) => {
      const shipment = await tx.shipment.create({
        data: {
          orderId: order.id,
          shiprocketOrderId: srOrderId,
          shipmentId: srShipmentId,
          status: "CREATED",
          statusDescription: response.status || "Shiprocket order created",
          weight: new Prisma.Decimal(dimensions.weight),
          length: new Prisma.Decimal(dimensions.length),
          breadth: new Prisma.Decimal(dimensions.breadth),
          height: new Prisma.Decimal(dimensions.height),
          trackingHistory: [
            {
              date: new Date().toISOString(),
              status: "CREATED",
              activity: "Order registered with Shiprocket",
              location: env.SHIPROCKET_PICKUP_LOCATION,
            },
          ],
          lastTrackedAt: new Date(),
        },
      });

      if (order.orderStatus === "PENDING" || order.orderStatus === "CONFIRMED") {
        await tx.order.update({
          where: { id: order.id },
          data: { orderStatus: "PACKED" },
        });
      }

      return shipment;
    });

    // If courierId specified or autoAssignAwb requested, assign AWB right away
    if (params.courierId || params.autoAssignAwb) {
      try {
        const awbResult = await this.assignAwb(savedShipment.id, params.courierId);
        return {
          success: true,
          mode: "LIVE",
          message: "Shiprocket shipment created and AWB assigned successfully",
          shipment: awbResult.shipment,
        };
      } catch (awbErr: any) {
        console.warn(`[ShippingService] AWB auto-assignment deferred: ${awbErr.message}`);
      }
    }

    return {
      success: true,
      mode: "LIVE",
      message: "Shiprocket shipment registered successfully",
      shipment: savedShipment,
    };
  }

  /**
   * Assigns a courier partner and generates AWB tracking number.
   */
  public static async assignAwb(shipmentRecordId: number, courierId?: number) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentRecordId },
      include: { order: true },
    });

    if (!shipment) {
      throw new Error(`Shipment record #${shipmentRecordId} not found`);
    }

    if (!ShiprocketAuthService.isConfigured()) {
      // Mock assignment
      const updated = await prisma.$transaction(async (tx) => {
        const res = await tx.shipment.update({
          where: { id: shipment.id },
          data: {
            awbCode: shipment.awbCode || `AWB-${Date.now()}`,
            courierName: shipment.courierName || "Delhivery Surface",
            courierCompanyId: courierId || shipment.courierCompanyId || 1,
            status: "AWB_ASSIGNED",
            labelUrl: "https://example.com/labels/mock-label.pdf",
          },
        });

        await tx.order.update({
          where: { id: shipment.orderId },
          data: { orderStatus: "SHIPPED" },
        });

        return res;
      });

      return {
        success: true,
        mode: "TEST_MODE",
        shipment: updated,
      };
    }

    const payload: any = {
      shipment_id: shipment.shipmentId,
    };
    if (courierId) {
      payload.courier_id = courierId;
    }

    const response = await ShiprocketClient.post<ShiprocketAssignAwbResponse>(
      "/courier/assign/awb",
      payload
    );

    const awbData = response?.response?.data;
    const awbCode = awbData?.awb_code;
    const courierName = awbData?.courier_name;
    const courierCompanyId = awbData?.courier_company_id;
    const routingCode = awbData?.routing_code;

    if (!awbCode) {
      throw new Error(
        response?.message || "Failed to retrieve AWB code from Shiprocket response"
      );
    }

    const updatedShipment = await prisma.$transaction(async (tx) => {
      const res = await tx.shipment.update({
        where: { id: shipment.id },
        data: {
          awbCode,
          courierName: courierName || shipment.courierName,
          courierCompanyId: courierCompanyId || shipment.courierCompanyId,
          routingCode: routingCode || shipment.routingCode,
          status: "AWB_ASSIGNED",
          statusDescription: "AWB Assigned by Shiprocket",
          updatedAt: new Date(),
        },
      });

      await tx.order.update({
        where: { id: shipment.orderId },
        data: { orderStatus: "SHIPPED" },
      });

      return res;
    });

    // Trigger label generation in background
    this.generateLabel(updatedShipment.id).catch((err) => {
      console.warn(`[ShippingService] Background label generation failed: ${err.message}`);
    });

    return {
      success: true,
      mode: "LIVE",
      message: `AWB #${awbCode} generated via ${courierName}`,
      shipment: updatedShipment,
    };
  }

  /**
   * Generates printable shipping label PDF.
   */
  public static async generateLabel(shipmentRecordId: number) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentRecordId },
    });

    if (!shipment || !shipment.shipmentId) {
      throw new Error("Shipment ID not found");
    }

    if (!ShiprocketAuthService.isConfigured()) {
      const mockLabel = "https://example.com/labels/mock-label.pdf";
      const updated = await prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          labelUrl: mockLabel,
          status: "LABEL_GENERATED",
        },
      });
      return { success: true, labelUrl: mockLabel, shipment: updated };
    }

    const response = await ShiprocketClient.post<ShiprocketGenerateLabelResponse>(
      "/courier/generate/label",
      {
        shipment_id: [shipment.shipmentId],
      }
    );

    const labelUrl = response?.label_url;
    if (!labelUrl) {
      throw new Error(response?.response || "Label generation URL not returned by Shiprocket");
    }

    const updated = await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        labelUrl,
        status: "LABEL_GENERATED",
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      labelUrl,
      shipment: updated,
    };
  }

  /**
   * Schedules courier pickup from warehouse.
   */
  public static async schedulePickup(shipmentRecordId: number, pickupDate?: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentRecordId },
    });

    if (!shipment || !shipment.shipmentId) {
      throw new Error("Valid shipment required to schedule pickup");
    }

    if (!ShiprocketAuthService.isConfigured()) {
      const mockToken = `TOKEN-${Date.now().toString().slice(-6)}`;
      const updated = await prisma.shipment.update({
        where: { id: shipment.id },
        data: {
          pickupTokenNumber: mockToken,
          pickupScheduledDate: pickupDate ? new Date(pickupDate) : new Date(),
          status: "PICKUP_SCHEDULED",
        },
      });
      return { success: true, pickupToken: mockToken, shipment: updated };
    }

    const payload: any = {
      shipment_id: [shipment.shipmentId],
    };
    if (pickupDate) {
      payload.pickup_date = [pickupDate];
    }

    const response = await ShiprocketClient.post<ShiprocketPickupResponse>(
      "/courier/generate/pickup",
      payload
    );

    const pickupToken =
      response?.response?.pickup_token_number ||
      response?.response?.data?.pickup_token_number;

    const updated = await prisma.shipment.update({
      where: { id: shipment.id },
      data: {
        pickupTokenNumber: pickupToken || null,
        pickupScheduledDate: pickupDate ? new Date(pickupDate) : new Date(),
        status: "PICKUP_SCHEDULED",
        statusDescription: response?.message || "Courier pickup scheduled",
        updatedAt: new Date(),
      },
    });

    return {
      success: true,
      pickupToken,
      message: response?.message || "Pickup scheduled successfully",
      shipment: updated,
    };
  }

  /**
   * Tracks live shipment by AWB code.
   */
  public static async trackShipment(awbCode: string) {
    if (!awbCode) {
      throw new Error("AWB code is required");
    }

    const shipment = await prisma.shipment.findFirst({
      where: { awbCode },
      include: { order: true },
    });

    if (!shipment) {
      throw new Error(`Shipment with AWB #${awbCode} not found`);
    }

    if (!ShiprocketAuthService.isConfigured()) {
      return {
        success: true,
        mode: "TEST_MODE",
        shipment,
        trackingData: {
          awb_code: awbCode,
          current_status: shipment.status,
          activities: shipment.trackingHistory || [],
        },
      };
    }

    const response = await ShiprocketClient.get<ShiprocketTrackingResponse>(
      `/courier/track/awb/${encodeURIComponent(awbCode)}`
    );

    const trackData = response?.tracking_data;
    const activities = trackData?.shipment_track_activities || [];
    const currentTrack = trackData?.shipment_track?.[0];
    const currentStatus = currentTrack?.current_status || shipment.status;

    // Map Shiprocket status string to internal ShipmentStatus and OrderStatus
    let internalStatus = shipment.status;
    let orderStatusUpdate: any = undefined;

    const statusUpper = currentStatus.toUpperCase();
    if (statusUpper.includes("DELIVERED")) {
      internalStatus = "DELIVERED";
      orderStatusUpdate = "DELIVERED";
    } else if (statusUpper.includes("OUT FOR DELIVERY")) {
      internalStatus = "OUT_FOR_DELIVERY";
    } else if (statusUpper.includes("IN TRANSIT") || statusUpper.includes("SHIPPED")) {
      internalStatus = "IN_TRANSIT";
      orderStatusUpdate = "SHIPPED";
    } else if (statusUpper.includes("PICKED UP")) {
      internalStatus = "PICKED_UP";
      orderStatusUpdate = "SHIPPED";
    } else if (statusUpper.includes("RTO")) {
      internalStatus = "RTO_INITIATED";
    }

    const updatedShipment = await prisma.$transaction(async (tx) => {
      const res = await tx.shipment.update({
        where: { id: shipment.id },
        data: {
          status: internalStatus,
          statusDescription: currentStatus,
          etd: currentTrack?.edd || shipment.etd,
          trackingHistory: activities.length ? (activities as any) : shipment.trackingHistory,
          lastTrackedAt: new Date(),
        },
      });

      if (orderStatusUpdate && shipment.order.orderStatus !== orderStatusUpdate) {
        await tx.order.update({
          where: { id: shipment.orderId },
          data: { orderStatus: orderStatusUpdate },
        });
      }

      return res;
    });

    return {
      success: true,
      mode: "LIVE",
      shipment: updatedShipment,
      trackingData: trackData,
    };
  }

  /**
   * Handles Shiprocket webhook payload and updates shipment milestones.
   */
  public static async handleWebhook(
    payload: ShiprocketWebhookPayload,
    apiKeyHeader?: string
  ) {
    // 1. Verify webhook security key if configured
    if (env.SHIPROCKET_WEBHOOK_TOKEN) {
      if (!apiKeyHeader || apiKeyHeader !== env.SHIPROCKET_WEBHOOK_TOKEN) {
        console.warn("[ShippingService] Unauthorized webhook attempt: invalid x-api-key");
        throw new Error("Unauthorized webhook token");
      }
    }

    const awb = payload.awb || payload.awb_code;
    const shipmentIdStr = payload.shipment_id ? String(payload.shipment_id) : undefined;
    const orderNumber = payload.order_id;

    if (!awb && !shipmentIdStr && !orderNumber) {
      throw new Error("Webhook payload missing identifier (awb/shipment_id/order_id)");
    }

    // Locate matching shipment
    const shipment = await prisma.shipment.findFirst({
      where: {
        OR: [
          ...(awb ? [{ awbCode: awb }] : []),
          ...(shipmentIdStr ? [{ shipmentId: shipmentIdStr }] : []),
          ...(orderNumber ? [{ order: { orderNumber } }] : []),
        ],
      },
      include: { order: true },
    });

    if (!shipment) {
      console.warn(`[ShippingService] Webhook received for untracked shipment/order: AWB=${awb}`);
      return { success: true, message: "Webhook acknowledged, shipment not present locally" };
    }

    const rawStatus = (payload.current_status || payload.status || "").toUpperCase();
    let mappedStatus = shipment.status;
    let orderStatusUpdate: any = undefined;

    if (rawStatus.includes("DELIVERED")) {
      mappedStatus = "DELIVERED";
      orderStatusUpdate = "DELIVERED";
    } else if (rawStatus.includes("OUT FOR DELIVERY")) {
      mappedStatus = "OUT_FOR_DELIVERY";
    } else if (rawStatus.includes("IN TRANSIT")) {
      mappedStatus = "IN_TRANSIT";
      orderStatusUpdate = "SHIPPED";
    } else if (rawStatus.includes("PICKED UP") || rawStatus.includes("PICKUP DONE")) {
      mappedStatus = "PICKED_UP";
      orderStatusUpdate = "SHIPPED";
    } else if (rawStatus.includes("RTO DELIVERED")) {
      mappedStatus = "RTO_DELIVERED";
    } else if (rawStatus.includes("RTO")) {
      mappedStatus = "RTO_INITIATED";
    }

    // Append scan if provided
    let updatedHistory: any = shipment.trackingHistory || [];
    if (Array.isArray(payload.scans) && payload.scans.length > 0) {
      updatedHistory = payload.scans;
    } else if (payload.current_status) {
      const newEntry = {
        date: payload.current_timestamp || new Date().toISOString(),
        status: mappedStatus,
        activity: payload.current_status,
        location: payload.location || "In Transit",
      };
      if (Array.isArray(updatedHistory)) {
        updatedHistory = [...updatedHistory, newEntry];
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.shipment.update({
        where: { id: shipment.id },
        data: {
          status: mappedStatus,
          statusDescription: payload.current_status || shipment.statusDescription,
          etd: payload.etd || shipment.etd,
          trackingHistory: updatedHistory,
          lastTrackedAt: new Date(),
        },
      });

      if (orderStatusUpdate && shipment.order.orderStatus !== orderStatusUpdate) {
        await tx.order.update({
          where: { id: shipment.orderId },
          data: { orderStatus: orderStatusUpdate },
        });
      }
    });

    return {
      success: true,
      message: `Shipment #${shipment.id} updated to ${mappedStatus}`,
    };
  }

  /**
   * Retrieves shipment by order ID.
   */
  public static async getShipmentByOrderId(orderId: number) {
    return prisma.shipment.findUnique({
      where: { orderId },
      include: { order: true },
    });
  }
}
