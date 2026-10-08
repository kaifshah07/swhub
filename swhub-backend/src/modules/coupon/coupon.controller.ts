import { Request, Response } from "express";
import { CouponService } from "./coupon.service";

export class CouponController {

  static async create(req: Request, res: Response) {
    try {

      const coupon =
        await CouponService.create(req.body);

      return res.status(201).json({
        success: true,
        message: "Coupon created successfully",
        data: coupon,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }

  static async getAll(req: Request, res: Response) {

    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = String(req.query.search || "");

    const data =
      await CouponService.getAll(
        page,
        limit,
        search
      );

    return res.json({
      success: true,
      ...data,
    });

  }

  static async getById(req: Request, res: Response) {

    const coupon =
      await CouponService.getById(
        Number(req.params.id)
      );

    return res.json({
      success: true,
      data: coupon,
    });

  }

  static async update(req: Request, res: Response) {

    const coupon =
      await CouponService.update(
        Number(req.params.id),
        req.body
      );

    return res.json({
      success: true,
      message: "Coupon updated successfully",
      data: coupon,
    });

  }

  static async activate(req: Request, res: Response) {

    const coupon =
      await CouponService.activate(
        Number(req.params.id)
      );

    return res.json({
      success: true,
      message: "Coupon activated",
      data: coupon,
    });

  }

  static async deactivate(req: Request, res: Response) {

    const coupon =
      await CouponService.deactivate(
        Number(req.params.id)
      );

    return res.json({
      success: true,
      message: "Coupon deactivated",
      data: coupon,
    });

  }

  static async delete(req: Request, res: Response) {

    await CouponService.delete(
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: "Coupon deleted successfully",
    });

  }

  static async validateAndApply(req: Request, res: Response) {
    try {
      const { code, orderAmount } = req.body;
      const result = await CouponService.validateAndApply(code, Number(orderAmount));

      return res.json({
        success: true,
        message: "Coupon applied successfully",
        data: result,
      });
    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message || "Failed to apply coupon",
      });
    }
  }

}