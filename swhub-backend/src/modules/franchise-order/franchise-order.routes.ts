import { Router } from "express";
import { FranchiseOrderController } from "./franchise-order.controller";
import { authenticateAdmin, authenticateFranchise } from "../../middleware/auth.middleware";

const router = Router();

// Used by Franchise Panel
router.post("/", authenticateFranchise, FranchiseOrderController.create);
router.get("/me", authenticateFranchise, FranchiseOrderController.getMyOrders);

// Used by Admin Panel
router.get("/admin", authenticateAdmin, FranchiseOrderController.getAllForAdmin);
router.patch("/:id/status", authenticateAdmin, FranchiseOrderController.updateStatus);

export default router;
