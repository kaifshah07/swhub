import { Router } from "express";

import { HomepageSectionController }
from "./homepage-section.controller";

import { authenticateAdmin }
from "../../middleware/auth.middleware";

const router = Router();

router.get(
  "/",
  HomepageSectionController.getAll
);

router.put(
  "/:key",
  authenticateAdmin,
  HomepageSectionController.update
);

export default router;