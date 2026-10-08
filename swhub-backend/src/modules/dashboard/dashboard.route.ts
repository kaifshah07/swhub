import { Router } from "express";
import { DashboardController } from "./dashboard.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticateAdmin,
  DashboardController.getDashboard
);

export default router;