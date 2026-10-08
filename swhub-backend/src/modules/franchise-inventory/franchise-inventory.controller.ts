import { Request, Response } from "express";
import { FranchiseInventoryService } from "./franchise-inventory.service";

export class FranchiseInventoryController {
  static async getMyStock(req: Request, res: Response): Promise<void> {
    try {
      const franchiseId = (req as any).user.id;
      const stock = await FranchiseInventoryService.getFranchiseStock(franchiseId);
      res.json({ success: true, data: stock });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }

  static async adjustStock(req: Request, res: Response): Promise<void> {
    try {
      const franchiseId = (req as any).user.id;
      const { productId, delta } = req.body;
      const result = await FranchiseInventoryService.adjustStock(franchiseId, productId, delta);
      res.json({ success: true, data: result });
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
