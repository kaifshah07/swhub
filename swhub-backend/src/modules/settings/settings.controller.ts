import { Request, Response } from "express";
import { SettingsService } from "./settings.service";

export class SettingsController {

  static async get(req: Request, res: Response) {

    try {

      const settings =
        await SettingsService.getSettings();

      return res.json({
        success: true,
        data: settings,
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

      const settings =
        await SettingsService.update(req.body);

      return res.json({
        success: true,
        message: "Settings updated successfully",
        data: settings,
      });

    } catch (error: any) {

      return res.status(500).json({
        success: false,
        message: error.message,
      });

    }

  }

}