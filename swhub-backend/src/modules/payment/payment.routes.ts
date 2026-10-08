import { Router } from "express";

import { PaymentController } from "./payment.controller";

import { authenticateAdmin } from "../../middleware/auth.middleware";

import { authenticateCustomer } from "../customer-auth/customer-auth.middleware";

const router = Router();

// =====================================================
// CUSTOMER PAYMENT APIs
// =====================================================

router.post(
  "/create",
  authenticateCustomer,
  PaymentController.create
);

router.post(
  "/verify",
  authenticateCustomer,
  PaymentController.verify
);

// =====================================================
// ADMIN PAYMENT APIs
// =====================================================

router.get(
  "/",
  authenticateAdmin,
  PaymentController.getAll
);

router.get(
  "/:id",
  authenticateAdmin,
  PaymentController.getById
);

router.patch(
  "/:id/status",
  authenticateAdmin,
  PaymentController.updateStatus
);

router.patch(
  "/:id/refund",
  authenticateAdmin,
  PaymentController.refund
);

export default router;