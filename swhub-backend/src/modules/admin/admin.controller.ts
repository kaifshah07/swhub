import { Request, Response } from "express";
import { AdminService } from "./admin.service";

export class AdminController {
  static async login(req: Request, res: Response) {
    try {
      const { username, password } = req.body;

      const result = await AdminService.login(username, password);

      return res.status(200).json(result);
    } catch (error: any) {
      return res.status(401).json({
        success: false,
        message: error.message,
      });
    }
  }
}