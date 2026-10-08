import { Router } from "express";
import { ProductController } from "./product.controller";

const router = Router();

// Public: Get active products
router.get("/", ProductController.getPublicProducts);

// Public: Get single active product
router.get("/:id", ProductController.getPublicProductById);

export default router;