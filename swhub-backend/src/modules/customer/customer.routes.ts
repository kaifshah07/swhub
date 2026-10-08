import { Router } from "express";
import { CustomerController } from "./customer.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";
import validateRequest from "../../middleware/validateRequest";
import {
  createCustomerSchema,
} from "./customer.validation";

const router = Router();

router.get(
  "/",
  authenticateAdmin,
  CustomerController.getAll
);


router.get(
  "/:id",
  authenticateAdmin,
  CustomerController.getById
);

router.put(
  "/:id",
  authenticateAdmin,
  CustomerController.update
);

router.patch(
  "/:id/block",
  authenticateAdmin,
  CustomerController.block
);

router.patch(
  "/:id/unblock",
  authenticateAdmin,
  CustomerController.unblock
);

router.delete(
  "/:id",
  authenticateAdmin,
  CustomerController.delete
);

router.post(
  "/",
  validateRequest(createCustomerSchema),
  CustomerController.create
);


export default router;