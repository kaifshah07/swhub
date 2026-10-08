import { Request, Response } from "express";
import { HomepageProductService } from "./homepage-product.service";

export class HomepageProductController {

  static async getProducts(
    req: Request,
    res: Response
  ) {
    const type = String(req.params.type || req.query.type || "");

    const products =
      await HomepageProductService.getProducts(
        type
      );

    return res.json({
      success: true,
      data: products,
    });
  }

  static async updateProducts(
    req: Request,
    res: Response
  ) {
    const type = String(req.params.type || req.body.type || "");
    const productIds = Array.isArray(req.body.productIds) ? req.body.productIds.map(Number) : [];

    await HomepageProductService.updateProducts(
      type,
      productIds
    );

    return res.json({
      success: true,
      message: "Updated successfully",
    });
  }
}