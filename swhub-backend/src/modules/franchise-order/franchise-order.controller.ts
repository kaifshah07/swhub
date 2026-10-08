import { Request, Response } from "express";
import { FranchiseOrderService } from "./franchise-order.service";

export class FranchiseOrderController {
  static async create(req: Request, res: Response): Promise<void> {
    try {
      const franchiseId = (req as any).user.id;
      const { items } = req.body;
      const order = await FranchiseOrderService.createOrder(franchiseId, items);
      res.status(201).json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async getMyOrders(req: Request, res: Response): Promise<void> {
    try {
      const franchiseId = (req as any).user.id;
      const orders = await FranchiseOrderService.getOrdersByFranchise(franchiseId);
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async getAllForAdmin(req: Request, res: Response): Promise<void> {
    try {
      const orders = await FranchiseOrderService.getAllOrders();
      res.json({ success: true, data: orders });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async updateStatus(req: Request, res: Response): Promise<void> {
    try {
      const { status } = req.body;
      const order = await FranchiseOrderService.updateOrderStatus(Number(req.params.id), status);
      res.json({ success: true, data: order });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
