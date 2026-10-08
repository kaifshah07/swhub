import { Router } from "express";
import adminRoutes from "../admin/admin.routes";

const router = Router();

router.get("/health", (req, res) => {
  res.json({
    success: true,
    message: "API is healthy",
  });
});

router.use("/admin", adminRoutes);

export default router;