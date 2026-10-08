import { Router } from "express";
import { HomepageAdvertisementController }
from "./homepage-advertisement.controller";
import { authenticateAdmin }
from "../../middleware/auth.middleware";
import { upload }
from "../../middleware/upload.middleware";

const router = Router();

router.get(
  "/",
  HomepageAdvertisementController.getAll
);

router.get(
  "/:id",
  HomepageAdvertisementController.getById
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
  HomepageAdvertisementController.create
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
  HomepageAdvertisementController.update
);

router.delete(
  "/:id",
  authenticateAdmin,
  HomepageAdvertisementController.delete
);

export default router;