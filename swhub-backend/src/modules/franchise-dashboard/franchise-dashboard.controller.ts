import { Request, Response } from "express";
import { FranchiseDashboardService } from "./franchise-dashboard.service";

export class FranchiseDashboardController {
  static async getStats(req: Request, res: Response): Promise<void> {
    try {
      const franchiseId = (req as any).user.id;
      const data = await FranchiseDashboardService.getDashboardStats(franchiseId);
      res.json({ success: true, data });
    } catch (error: any) {
      res.status(500).json({ success: false, message: error.message });
    }
  }
}
