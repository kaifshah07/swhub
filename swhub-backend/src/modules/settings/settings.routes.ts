import { Router } from "express";
import { SettingsController } from "./settings.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  authenticateAdmin,
  SettingsController.get
);

router.put(
  "/",
  authenticateAdmin,
  SettingsController.update
);

export default router;