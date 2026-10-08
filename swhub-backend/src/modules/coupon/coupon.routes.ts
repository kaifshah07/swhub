import { Router } from "express";
import { CouponController } from "./coupon.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

// Customer / Public coupon validation
router.post("/apply", CouponController.validateAndApply);

router.post("/", authenticateAdmin, CouponController.create);

router.get("/", authenticateAdmin, CouponController.getAll);

router.get("/:id", authenticateAdmin, CouponController.getById);

router.put("/:id", authenticateAdmin, CouponController.update);

router.patch("/:id/activate", authenticateAdmin, CouponController.activate);

router.patch("/:id/deactivate", authenticateAdmin, CouponController.deactivate);

router.delete("/:id", authenticateAdmin, CouponController.delete);

export default router;