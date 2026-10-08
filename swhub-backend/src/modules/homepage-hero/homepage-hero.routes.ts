import { Router } from "express";
import { HomepageHeroController } from "./homepage-hero.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

router.get(
  "/",
  HomepageHeroController.getAll
);

router.post(
  "/",
  authenticateAdmin,
  upload.fields([
    {
      name: "desktopImage",
      maxCount: 1,
    },
    {
      name: "mobileImage",
      maxCount: 1,
    },
  ]),
  HomepageHeroController.create
);

router.put(
  "/:id",
  authenticateAdmin,
  upload.fields([
    {
      name: "desktopImage",
      maxCount: 1,
    },
    {
      name: "mobileImage",
      maxCount: 1,
    },
  ]),
  HomepageHeroController.update
);

router.delete(
  "/:id",
  authenticateAdmin,
  HomepageHeroController.delete
);

export default router;