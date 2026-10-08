import { Router } from "express";
import { AdminController } from "./admin.controller";
import { DashboardController } from "./dashboard.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.post("/login", AdminController.login);

router.get(
  "/dashboard",
  authenticateAdmin,
  DashboardController.getDashboard
);

export default router;