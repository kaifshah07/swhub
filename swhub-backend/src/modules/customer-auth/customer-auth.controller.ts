import { Request, Response } from "express";
import { CustomerAuthService } from "./customer-auth.service";

export class CustomerAuthController {

  // =========================
  // REGISTER
  // =========================

  static async register(
    req: Request,
    res: Response
  ) {
    try {
      const result = await CustomerAuthService.register(req.body);

      return res.status(201).json({
        success: true,
        message: result.message,
        data: result,
      });

    } catch (error: any) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }


  // =========================
  // LOGIN
  // =========================

  static async login(
    req: Request,
    res: Response
  ) {
    try {
      const result = await CustomerAuthService.login(
        req.body.email,
        req.body.password
      );

      return res.json({
        success: true,
        message: "Login successful",
        data: result,
      });

    } catch (error: any) {
      let status = 401;
      if (error.code === "ACCOUNT_NOT_FOUND") {
        status = 404;
      } else if (error.code === "UNVERIFIED_ACCOUNT" || error.code === "ACCOUNT_BLOCKED") {
        status = 403;
      }

      return res.status(status).json({
        success: false,
        message: error.message,
        code: error.code,
        customerId: error.customerId,
        email: error.email,
      });
    }
  }

  // =========================
  // GOOGLE LOGIN / REGISTER
  // =========================

  static async google(
    req: Request,
    res: Response
  ) {
    try {
      const { idToken } = req.body;

      if (!idToken) {
        return res.status(400).json({
          success: false,
          message: "Google ID token is required",
        });
      }

      const result = await CustomerAuthService.googleLogin(idToken);

      return res.status(200).json({
        success: true,
        message: "Google authentication successful",
        data: result,
      });
    } catch (error: any) {
      console.error("Google Auth Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message || "Google authentication failed",
      });
    }
  }

  // =========================
  // ME
  // =========================

  static async me(
    req: Request,
    res: Response
  ) {
    try {
      const customerId = (req as any).customer?.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const customer = await CustomerAuthService.getProfile(
        Number(customerId)
      );

      return res.json({
        success: true,
        data: {
          customer,
        },
      });

    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =========================
  // VERIFY OTP
  // =========================
  static async verifyOtp(
    req: Request,
    res: Response
  ) {
    try {
      const { customerId, email, otp } = req.body;

      if ((!customerId && !email) || !otp) {
        return res.status(400).json({
          success: false,
          message: "Customer identifier and OTP are required",
        });
      }

      const result = await CustomerAuthService.verifyOtp(
        {
          customerId: customerId ? Number(customerId) : undefined,
          email: email ? String(email) : undefined,
        },
        String(otp)
      );

      return res.status(200).json({
        success: true,
        message: "Email verified successfully",
        data: result,
      });

    } catch (error: any) {
      console.error("Verify OTP Error:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =========================
  // RESEND OTP
  // =========================
  static async resendOtp(
    req: Request,
    res: Response
  ) {
    try {
      const { customerId, email } = req.body;

      if (!customerId && !email) {
        return res.status(400).json({
          success: false,
          message: "Customer ID or email is required",
        });
      }

      const result = await CustomerAuthService.resendOtp({
        customerId: customerId ? Number(customerId) : undefined,
        email: email ? String(email) : undefined,
      });

      return res.status(200).json({
        success: true,
        message: "Verification OTP resent",
        data: result,
      });

    } catch (error: any) {
      console.error("Resend OTP Error:", error);

      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }
}