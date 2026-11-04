import { Router, Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { ShippingController } from "./shipping.controller";
import { ShippingWebhookController } from "./shipping.webhook.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";
import { authenticateCustomer } from "../customer-auth/customer-auth.middleware";

const router = Router();

/**
 * Middleware allowing either authenticated Admin or Customer
 */
const authenticateCustomerOrAdmin = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({
      success: false,
      message: "Authorization token required",
    });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.substring(7) : authHeader;

  try {
    const decoded: any = jwt.verify(token, process.env.JWT_SECRET as string);

    if (decoded.role === "ADMIN" || decoded.role === "SUPER_ADMIN") {
      (req as any).admin = decoded;
      return next();
    }

    if (decoded.role === "CUSTOMER") {
      (req as any).customer = decoded;
      return next();
    }

    return res.status(403).json({
      success: false,
      message: "Access forbidden",
    });
  } catch (err) {
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

// ==========================================
// PUBLIC & WEBHOOK ENDPOINTS
// ==========================================
router.get("/status", ShippingController.getStatus);
router.post("/webhook", ShippingWebhookController.handleWebhook);

// ==========================================
// TRACKING & ORDER SHIPMENT (CUSTOMER / ADMIN)
// ==========================================
router.get("/track/:awbCode", authenticateCustomerOrAdmin, ShippingController.trackAwb);
router.get("/orders/:orderId", authenticateCustomerOrAdmin, ShippingController.getShipmentByOrder);

// ==========================================
// ADMIN SHIPMENT & COURIER ACTIONS
// ==========================================
router.post(
  "/orders/:orderId/serviceability",
  authenticateAdmin,
  ShippingController.checkServiceability
);

router.post(
  "/orders/:orderId/create",
  authenticateAdmin,
  ShippingController.createShipment
);

router.post(
  "/shipments/:shipmentId/assign-awb",
  authenticateAdmin,
  ShippingController.assignAwb
);

router.post(
  "/shipments/:shipmentId/label",
  authenticateAdmin,
  ShippingController.generateLabel
);

router.post(
  "/shipments/:shipmentId/pickup",
  authenticateAdmin,
  ShippingController.schedulePickup
);

export default router;
