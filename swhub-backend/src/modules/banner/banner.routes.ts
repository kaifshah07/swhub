import { Router } from "express";

import { BannerController } from "./banner.controller";

import { upload } from "../../middleware/upload.middleware";

import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();



router.get(
  "/",
  BannerController.getAll
);

router.get(
  "/:id",
  BannerController.getById
);

router.post(
  "/",
  authenticateAdmin,
  upload.single("image"),
  BannerController.create
);

router.put(
  "/:id",
  authenticateAdmin,
  upload.single("image"),
  BannerController.update
);

router.delete(
  "/:id",
  authenticateAdmin,
  BannerController.delete
);

export default router;