import { Router } from "express";
import { VendorEnquiryController } from "./vendor-enquiry.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

// Public
router.post(
  "/",
  VendorEnquiryController.create
);

// Admin
router.get(
  "/",
  authenticateAdmin,
  VendorEnquiryController.getAll
);

router.get(
  "/:id",
  authenticateAdmin,
  VendorEnquiryController.getById
);

router.patch(
  "/:id/status",
  authenticateAdmin,
  VendorEnquiryController.updateStatus
);

router.delete(
  "/:id",
  authenticateAdmin,
  VendorEnquiryController.delete
);

export default router;