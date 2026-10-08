import { Router } from "express";
import { SubCategoryController } from "./subcategory.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

// =====================================================
// PUBLIC
// =====================================================

// Get all active subcategories for a category
router.get(
  "/category/:categoryId",
  SubCategoryController.getByCategory
);

// Get single subcategory
router.get(
  "/:id",
  SubCategoryController.getById
);

// =====================================================
// ADMIN
// =====================================================

// Get all subcategories
router.get(
  "/",
  authenticateAdmin,
  SubCategoryController.getAll
);

// Create
router.post(
  "/",
  authenticateAdmin,
  SubCategoryController.create
);

// Update
router.put(
  "/:id",
  authenticateAdmin,
  SubCategoryController.update
);

// Delete
router.delete(
  "/:id",
  authenticateAdmin,
  SubCategoryController.delete
);

export default router;