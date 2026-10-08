import { Router } from "express";
import { CategoryController } from "./category.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";
import { upload } from "../../middleware/upload.middleware";

const router = Router();

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------
*/

router.get("/public", CategoryController.getAll);

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
*/

router.post("/", authenticateAdmin, upload.single("image"), CategoryController.create);

router.get("/", authenticateAdmin, CategoryController.getAll);

router.get("/:id", authenticateAdmin, CategoryController.getById);

router.put("/:id", authenticateAdmin, upload.single("image"), CategoryController.update);

router.delete("/:id", authenticateAdmin, CategoryController.delete);

export default router;
