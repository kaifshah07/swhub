import { Request, Response } from "express";
import { SubCategoryService } from "./subcategory.service";

export class SubCategoryController {
  // GET ALL
  static async getAll(req: Request, res: Response) {
    try {
      const subCategories =
        await SubCategoryService.getAll();

      return res.json({
        success: true,
        data: subCategories,
      });
    } catch (error: any) {
      console.error(
        "Get Subcategories Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to fetch subcategories",
      });
    }
  }

  // GET BY CATEGORY
  static async getByCategory(
    req: Request,
    res: Response
  ) {
    try {
      const categoryId = Number(
        req.params.categoryId
      );

      if (isNaN(categoryId)) {
        return res.status(400).json({
          success: false,
          message: "Invalid category ID",
        });
      }

      const subCategories =
        await SubCategoryService.getByCategory(
          categoryId
        );

      return res.json({
        success: true,
        data: subCategories,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message:
          error.message ||
          "Unable to fetch subcategories",
      });
    }
  }

  // GET BY ID
  static async getById(
    req: Request,
    res: Response
  ) {
    try {
      const id = Number(req.params.id);

      const subCategory =
        await SubCategoryService.getById(id);

      if (!subCategory) {
        return res.status(404).json({
          success: false,
          message: "Subcategory not found",
        });
      }

      return res.json({
        success: true,
        data: subCategory,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // CREATE
  static async create(
    req: Request,
    res: Response
  ) {
    try {
      const subCategory =
        await SubCategoryService.create(
          req.body
        );

      return res.status(201).json({
        success: true,
        message:
          "Subcategory created successfully",
        data: subCategory,
      });
    } catch (error: any) {
      console.error(
        "Create Subcategory Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Unable to create subcategory",
      });
    }
  }

  // UPDATE
  static async update(
    req: Request,
    res: Response
  ) {
    try {
      const id = Number(req.params.id);

      const subCategory =
        await SubCategoryService.update(
          id,
          req.body
        );

      return res.json({
        success: true,
        message:
          "Subcategory updated successfully",
        data: subCategory,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Unable to update subcategory",
      });
    }
  }

  // DELETE
  static async delete(
    req: Request,
    res: Response
  ) {
    try {
      const id = Number(req.params.id);

      await SubCategoryService.delete(id);

      return res.json({
        success: true,
        message:
          "Subcategory deleted successfully",
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message:
          error.message ||
          "Unable to delete subcategory",
      });
    }
  }
}