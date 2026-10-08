import { Request, Response } from "express";
import { DashboardService } from "./dashboard.service";

export class DashboardController {

  static async getDashboard(
    req: Request,
    res: Response
  ) {

    try {

      const dashboard =
        await DashboardService.getDashboard();

      return res.json({

        success: true,

        dashboard

      });

    } catch (error: any) {

      return res.status(500).json({

        success: false,

        message: error.message

      });

    }

  }

}