import express from "express";
import cloudinary from "../config/cloudinary";

const router = express.Router();

router.get("/", async (_req, res) => {
  try {
    const result = await cloudinary.api.ping();

    return res.json({
      success: true,
      result,
    });
  } catch (error: any) {
    return res.status(500).json({
      success: false,
      error: error.message,
      full: error,
    });
  }
});

export default router;

