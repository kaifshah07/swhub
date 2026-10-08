import { Router } from "express";
import { FranchiseInventoryController } from "./franchise-inventory.controller";
import { authenticateFranchise } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticateFranchise);

router.get("/me", FranchiseInventoryController.getMyStock);
router.post("/adjust", FranchiseInventoryController.adjustStock);

export default router;
