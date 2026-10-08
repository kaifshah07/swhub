import { Router } from "express";
import { FranchiseEnquiryController } from "./franchise-enquiry.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

// Public
router.post(
  "/",
  FranchiseEnquiryController.create
);

// Admin
router.get(
  "/",
  authenticateAdmin,
  FranchiseEnquiryController.getAll
);

router.get(
  "/:id",
  authenticateAdmin,
  FranchiseEnquiryController.getById
);

router.patch(
  "/:id/status",
  authenticateAdmin,
  FranchiseEnquiryController.updateStatus
);

export default router;