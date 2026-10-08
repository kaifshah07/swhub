import { Request, Response } from "express";
import { ProductService } from "./product.service";

export class ProductController {
  // =========================
  // CREATE PRODUCT
  // =========================
static async create(req: Request, res: Response) {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: "A product image is required. Select an image and try again.",
      });
    }

    const product = await ProductService.create({
      ...req.body,
      file: req.file,
    });

    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      data: product,
    });
  } catch (error: any) {
  console.error("========== PRODUCT ERROR ==========");
  console.error(error);
  console.error("MESSAGE:", error?.message);
  console.error("FULL RESPONSE:", error?.response);
  console.error("===================================");

  return res.status(400).json({
    success: false,
    message: error?.message || "Unknown error",
  });
}
}

  // =========================
  // GET ALL PRODUCTS
  // =========================

  static async getAll(
    req: Request,
    res: Response
  ) {
    try {
      const products =
        await ProductService.getAll();

      return res.json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =========================
  // GET PRODUCT BY ID
  // =========================

  static async getById(
    req: Request,
    res: Response
  ) {
    try {
      const product =
        await ProductService.getById(
          Number(req.params.id)
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =========================
  // UPDATE PRODUCT
  // =========================

  static async update(
    req: Request,
    res: Response
  ) {
    try {
      const product =
        await ProductService.update(
          Number(req.params.id),
          {
            ...req.body,
            imageFile: req.file,
          }
        );

      return res.json({
        success: true,
        message:
          "Product updated successfully",
        data: product,
      });
    } catch (error: any) {
      console.error(
        "Update Product Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Failed to update product",
      });
    }
  }

  // =========================
  // DELETE PRODUCT
  // =========================

  static async delete(
    req: Request,
    res: Response
  ) {
    try {
      await ProductService.delete(
        Number(req.params.id)
      );

      return res.json({
        success: true,
        message:
          "Product deleted successfully",
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =========================
  // PUBLIC PRODUCTS
  // =========================

  static async getPublicProducts(
    req: Request,
    res: Response
  ) {
    try {
      const products =
        await ProductService.getPublicProducts(req.query);

      return res.json({
        success: true,
        data: products,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =========================
  // PUBLIC PRODUCT BY ID
  // =========================

  static async getPublicProductById(
    req: Request,
    res: Response
  ) {
    try {
      const product =
        await ProductService.getPublicProductById(
          Number(req.params.id)
        );

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      return res.json({
        success: true,
        data: product,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}
