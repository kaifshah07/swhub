import { Router } from "express";
import { FranchiseUserController } from "./franchise-user.controller";
import { authenticateAdmin } from "../../middleware/auth.middleware";

const router = Router();

// These routes should be protected by Admin auth
router.use(authenticateAdmin);

router.post("/", FranchiseUserController.create);
router.get("/", FranchiseUserController.getAll);
router.get("/:id", FranchiseUserController.getById);
router.put("/:id", FranchiseUserController.update);
router.patch("/:id/status", FranchiseUserController.toggleStatus);

export default router;
