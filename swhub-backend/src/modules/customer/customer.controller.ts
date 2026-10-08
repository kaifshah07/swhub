import { Request, Response } from "express";
import { CustomerService } from "./customer.service";

export class CustomerController {

  static async getAll(req: Request, res: Response) {
    try {

      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = String(req.query.search || "");

      const result = await CustomerService.getAll(
        page,
        limit,
        search
      );

      return res.json({
        success: true,
        ...result,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }

  static async getById(req: Request, res: Response) {

    try {

      const customer =
        await CustomerService.getById(
          Number(req.params.id)
        );

      if (!customer) {

        return res.status(404).json({
          success: false,
          message: "Customer not found",
        });

      }

      return res.json({
        success: true,
        data: customer,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }

  static async update(req: Request, res: Response) {

    try {

      const customer =
        await CustomerService.update(
          Number(req.params.id),
          req.body
        );

      return res.json({
        success: true,
        message: "Customer updated successfully",
        data: customer,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }

  static async block(req: Request, res: Response) {

    try {

      const customer =
        await CustomerService.block(
          Number(req.params.id)
        );

      return res.json({
        success: true,
        message: "Customer blocked successfully",
        data: customer,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }

  static async unblock(req: Request, res: Response) {

    try {

      const customer =
        await CustomerService.unblock(
          Number(req.params.id)
        );

      return res.json({
        success: true,
        message: "Customer unblocked successfully",
        data: customer,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }

  static async delete(req: Request, res: Response) {

    try {

      await CustomerService.delete(
        Number(req.params.id)
      );

      return res.json({
        success: true,
        message: "Customer deleted successfully",
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }

  static async create(req: Request, res: Response) {
  try {
    const result = await CustomerService.create(req.body);

    return res.status(201).json(result);
  } catch (error: any) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

}