import { Request, Response } from "express";
import { OrderService } from "./order.service";

export class OrderController {

  // =========================
  // CUSTOMER CREATE ORDER
  // =========================

  static async create(req: Request, res: Response) {
    try {

      const customerId =
        (req as any).customer?.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Customer authentication required",
        });
      }

      const order = await OrderService.create({
        ...req.body,
        customerId: Number(customerId),
      });

      return res.status(201).json({
        success: true,
        message: "Order created successfully",
        data: order,
      });

    } catch (error: any) {

      console.error(
        "Create Order Error:",
        error
      );

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }


  // =========================
  // CUSTOMER MY ORDERS
  // =========================

  static async getMyOrders(
    req: Request,
    res: Response
  ) {

    try {

      const customerId =
        (req as any).customer?.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Customer authentication required",
        });
      }

      const orders =
        await OrderService.getCustomerOrders(
          Number(customerId)
        );

      return res.json({
        success: true,
        data: orders,
      });

    } catch (error: any) {

      console.error(
        "Get Customer Orders Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }


  // =========================
  // CUSTOMER SINGLE ORDER
  // =========================

  static async getMyOrderById(
    req: Request,
    res: Response
  ) {

    try {

      const customerId =
        (req as any).customer?.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Customer authentication required",
        });
      }

      const order =
        await OrderService.getCustomerOrderById(
          Number(req.params.id),
          Number(customerId)
        );

      if (!order) {
        return res.status(404).json({
          success: false,
          message: "Order not found",
        });
      }

      return res.json({
        success: true,
        data: order,
      });

    } catch (error: any) {

      console.error(
        "Get Customer Order Error:",
        error
      );

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }


  // =========================
  // ADMIN
  // =========================

  static async getAll(
    req: Request,
    res: Response
  ) {

    try {

      const data =
        await OrderService.getAll(req.query);

      return res.status(200).json({
        success: true,
        ...data,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }


  static async getById(
    req: Request,
    res: Response
  ) {

    try {

      const order =
        await OrderService.getById(
          Number(req.params.id)
        );

      return res.json({
        success: true,
        data: order,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }
  }


  static async updateStatus(
    req: Request,
    res: Response
  ) {

    const order =
      await OrderService.updateStatus(
        Number(req.params.id),
        req.body.orderStatus
      );

    return res.json({
      success: true,
      message: "Order status updated",
      data: order,
    });
  }


  static async delete(
    req: Request,
    res: Response
  ) {

    await OrderService.delete(
      Number(req.params.id)
    );

    return res.json({
      success: true,
      message: "Order deleted successfully",
    });
  }


  static async updatePaymentStatus(
    req: Request,
    res: Response
  ) {

    try {

      const order =
        await OrderService.updatePaymentStatus(
          Number(req.params.id),
          req.body.paymentStatus
        );

      return res.json({
        success: true,
        message: "Payment status updated successfully",
        data: order,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }


  static async cancelOrder(
    req: Request,
    res: Response
  ) {

    try {

      const order =
        await OrderService.cancelOrder(
          Number(req.params.id)
        );

      return res.json({
        success: true,
        message: "Order cancelled successfully",
        data: order,
      });

    } catch (error: any) {

      return res.status(400).json({
        success: false,
        message: error.message,
      });

    }
  }
}