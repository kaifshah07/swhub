import { Request, Response } from "express";
import { FranchiseAuthService } from "./franchise-auth.service";

export class FranchiseAuthController {
  static async login(req: Request, res: Response): Promise<void> {
    try {
      const { identifier, password } = req.body;
      const result = await FranchiseAuthService.login(identifier, password);
      res.json({ success: true, ...result });
    } catch (error: any) {
      res.status(401).json({ success: false, message: error.message });
    }
  }

  static async forgotPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email } = req.body;
      const result = await FranchiseAuthService.requestOtp(email);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }

  static async resetPassword(req: Request, res: Response): Promise<void> {
    try {
      const { email, otp, newPassword } = req.body;
      const result = await FranchiseAuthService.verifyOtpAndResetPassword(email, otp, newPassword);
      res.json(result);
    } catch (error: any) {
      res.status(400).json({ success: false, message: error.message });
    }
  }
}
