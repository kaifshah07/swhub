import { Router } from "express";
import { ProductController } from "./product.controller";
import {
  authenticateAdmin,
  requireAdmin,
} from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

// CREATE
router.post(
  "/",
  authenticateAdmin,
  requireAdmin,
  upload.single("thumbnail"),
  ProductController.create
);

// GET ALL
router.get(
  "/",
  authenticateAdmin,
  requireAdmin,
  ProductController.getAll
);

// GET ONE
router.get(
  "/:id",
  authenticateAdmin,
  requireAdmin,
  ProductController.getById
);

// UPDATE
router.put(
  "/:id",
  authenticateAdmin,
  requireAdmin,
  upload.single("thumbnail"),
  ProductController.update
);

// DELETE
router.delete(
  "/:id",
  authenticateAdmin,
  requireAdmin,
  ProductController.delete
);

export default router;