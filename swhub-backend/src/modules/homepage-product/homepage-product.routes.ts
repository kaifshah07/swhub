import { Router } from "express";

import { HomepageProductController }
from "./homepage-product.controller";

import { authenticateAdmin }
from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  HomepageProductController.getProducts
);

router.get(
  "/:type",
  HomepageProductController.getProducts
);

router.put(
  "/",
  authenticateAdmin,
  HomepageProductController.updateProducts
);

router.put(
  "/:type",
  authenticateAdmin,
  HomepageProductController.updateProducts
);

export default router;