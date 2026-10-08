import { Router } from "express";
import { TrustFeatureController } from "./trust-feature.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

// Public route for frontend
router.get("/public", TrustFeatureController.getActive);

// Admin routes
router.get("/", authenticateAdmin, TrustFeatureController.getAll);
router.post("/", authenticateAdmin, TrustFeatureController.create);
router.put("/:id", authenticateAdmin, TrustFeatureController.update);
router.delete("/:id", authenticateAdmin, TrustFeatureController.delete);

export default router;
