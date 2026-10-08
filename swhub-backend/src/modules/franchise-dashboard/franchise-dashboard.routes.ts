import { Router } from "express";
import { FranchiseDashboardController } from "./franchise-dashboard.controller";
import { authenticateFranchise } from "../../middleware/auth.middleware";

const router = Router();

router.use(authenticateFranchise);
router.get("/", FranchiseDashboardController.getStats);

export default router;
