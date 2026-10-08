import { Router } from "express";
import { FranchiseAuthController } from "./franchise-auth.controller";

const router = Router();

router.post("/login", FranchiseAuthController.login);
router.post("/forgot-password", FranchiseAuthController.forgotPassword);
router.post("/reset-password", FranchiseAuthController.resetPassword);

export default router;
