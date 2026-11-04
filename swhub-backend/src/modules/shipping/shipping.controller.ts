import { Request, Response } from "express";
import { ShippingService } from "./shipping.service";
import { ShiprocketAuthService } from "./shiprocket.auth.service";
import { prisma } from "../../config/database";

export class ShippingController {
  /**
   * Diagnostic status of shipping provider
   */
  public static async getStatus(req: Request, res: Response) {
    const isConfigured = ShiprocketAuthService.isConfigured();
    return res.json({
      success: true,
      provider: "Shiprocket",
      isConfigured,
      mode: isConfigured ? "LIVE" : "TEST_OR_DORMANT",
      message: isConfigured
        ? "Shiprocket courier integration is active."
        : "Shiprocket integration is in test/dormant mode (disabled via feature flag).",
    });
  }

  /**
   * Checks courier serviceability and estimated freight rates for an order
   */
  public static async checkServiceability(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId || req.body.orderId);
      if (!orderId || isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Valid order ID is required",
        });
      }

      const dimensions = {
        weight: req.body.weight ? Number(req.body.weight) : undefined,
        length: req.body.length ? Number(req.body.length) : undefined,
        breadth: req.body.breadth ? Number(req.body.breadth) : undefined,
        height: req.body.height ? Number(req.body.height) : undefined,
      };

      const result = await ShippingService.checkServiceability(orderId, dimensions);

      return res.json({
        success: true,
        data: result,
      });
    } catch (error: any) {
      console.error("[ShippingController] Serviceability check error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to check courier serviceability",
      });
    }
  }

  /**
   * Creates a shipment for an order
   */
  public static async createShipment(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId || req.body.orderId);
      if (!orderId || isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Valid order ID is required",
        });
      }

      const dimensions = {
        weight: req.body.weight ? Number(req.body.weight) : undefined,
        length: req.body.length ? Number(req.body.length) : undefined,
        breadth: req.body.breadth ? Number(req.body.breadth) : undefined,
        height: req.body.height ? Number(req.body.height) : undefined,
      };

      const courierId = req.body.courierId ? Number(req.body.courierId) : undefined;
      const autoAssignAwb = req.body.autoAssignAwb !== false;

      const result = await ShippingService.createShipment(orderId, {
        dimensions,
        courierId,
        autoAssignAwb,
      });

      return res.json(result);
    } catch (error: any) {
      console.error("[ShippingController] Create shipment error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to create shipment",
      });
    }
  }

  /**
   * Assigns AWB tracking number via selected courier
   */
  public static async assignAwb(req: Request, res: Response) {
    try {
      const shipmentId = Number(req.params.shipmentId);
      const courierId = req.body.courierId ? Number(req.body.courierId) : undefined;

      if (!shipmentId || isNaN(shipmentId)) {
        return res.status(400).json({
          success: false,
          message: "Valid shipment ID is required",
        });
      }

      const result = await ShippingService.assignAwb(shipmentId, courierId);

      return res.json(result);
    } catch (error: any) {
      console.error("[ShippingController] Assign AWB error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to assign AWB",
      });
    }
  }

  /**
   * Generates shipping label
   */
  public static async generateLabel(req: Request, res: Response) {
    try {
      const shipmentId = Number(req.params.shipmentId);
      if (!shipmentId || isNaN(shipmentId)) {
        return res.status(400).json({
          success: false,
          message: "Valid shipment ID is required",
        });
      }

      const result = await ShippingService.generateLabel(shipmentId);
      return res.json(result);
    } catch (error: any) {
      console.error("[ShippingController] Generate label error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to generate shipping label",
      });
    }
  }

  /**
   * Schedules courier pickup
   */
  public static async schedulePickup(req: Request, res: Response) {
    try {
      const shipmentId = Number(req.params.shipmentId);
      const pickupDate = req.body.pickupDate;

      if (!shipmentId || isNaN(shipmentId)) {
        return res.status(400).json({
          success: false,
          message: "Valid shipment ID is required",
        });
      }

      const result = await ShippingService.schedulePickup(shipmentId, pickupDate);
      return res.json(result);
    } catch (error: any) {
      console.error("[ShippingController] Schedule pickup error:", error.message);
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to schedule courier pickup",
      });
    }
  }

  /**
   * Tracks shipment by AWB code (Admin or authenticated Customer with order verification)
   */
  public static async trackAwb(req: Request, res: Response) {
    try {
      const awbCode = String(req.params.awbCode || "").trim();
      if (!awbCode) {
        return res.status(400).json({
          success: false,
          message: "AWB tracking code is required",
        });
      }

      // Customer authorization check
      const customer = (req as any).customer;
      if (customer && customer.id) {
        const shipment = await prisma.shipment.findFirst({
          where: { awbCode },
          include: { order: true },
        });

        if (!shipment || shipment.order.customerId !== customer.id) {
          return res.status(403).json({
            success: false,
            message: "Unauthorized: You do not have permission to view tracking for this shipment.",
          });
        }
      }

      const result = await ShippingService.trackShipment(awbCode);
      return res.json(result);
    } catch (error: any) {
      console.error("[ShippingController] Track shipment error:", error.message);
      return res.status(404).json({
        success: false,
        message: error.message || "Tracking details unavailable",
      });
    }
  }

  /**
   * Gets shipment details for a specific order (with customer isolation)
   */
  public static async getShipmentByOrder(req: Request, res: Response) {
    try {
      const orderId = Number(req.params.orderId);
      if (!orderId || isNaN(orderId)) {
        return res.status(400).json({
          success: false,
          message: "Valid order ID is required",
        });
      }

      const customer = (req as any).customer;
      if (customer && customer.id) {
        const order = await prisma.order.findUnique({
          where: { id: orderId },
        });
        if (!order || order.customerId !== customer.id) {
          return res.status(403).json({
            success: false,
            message: "Unauthorized: Order does not belong to your account",
          });
        }
      }

      const shipment = await ShippingService.getShipmentByOrderId(orderId);
      if (!shipment) {
        return res.status(404).json({
          success: false,
          message: "No shipment record found for this order",
        });
      }

      return res.json({
        success: true,
        data: shipment,
      });
    } catch (error: any) {
      console.error("[ShippingController] Get shipment error:", error.message);
      return res.status(500).json({
        success: false,
        message: error.message || "Failed to retrieve shipment",
      });
    }
  }
}
