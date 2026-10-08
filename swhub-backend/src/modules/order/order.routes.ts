import { Router } from "express";
import { OrderController } from "./order.controller";
import {
  authenticateAdmin,
  requireAdmin,
} from "../../middleware/auth.middleware";
import { authenticateCustomer } from "../customer-auth/customer-auth.middleware";

const router = Router();

// =========================
// CUSTOMER ROUTES
// =========================

// Customer places order
router.post(
  "/",
  authenticateCustomer,
  OrderController.create
);

// Customer orders
router.get(
  "/my-orders",
  authenticateCustomer,
  OrderController.getMyOrders
);

// Customer single order
router.get(
  "/my-orders/:id",
  authenticateCustomer,
  OrderController.getMyOrderById
);

// =========================
// ADMIN ROUTES
// =========================

router.get(
  "/",
  authenticateAdmin,
  requireAdmin,
  OrderController.getAll
);

router.get(
  "/:id",
  authenticateAdmin,
  requireAdmin,
  OrderController.getById
);

router.patch(
  "/:id/status",
  authenticateAdmin,
  requireAdmin,
  OrderController.updateStatus
);

router.delete(
  "/:id",
  authenticateAdmin,
  requireAdmin,
  OrderController.delete
);

router.patch(
  "/:id/payment",
  authenticateAdmin,
  requireAdmin,
  OrderController.updatePaymentStatus
);

router.patch(
  "/:id/cancel",
  authenticateAdmin,
  requireAdmin,
  OrderController.cancelOrder
);

export default router;