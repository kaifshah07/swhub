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

      const result =
        await CustomerAuthService.register(
          req.body
        );

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

      const result =
        await CustomerAuthService.login(
          req.body.email,
          req.body.password
        );

      return res.json({
        success: true,
        message: "Login successful",
        data: result,
      });

    } catch (error: any) {

      return res.status(401).json({
        success: false,
        message: error.message,
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

      const customerId =
        (req as any).customer?.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Unauthorized",
        });
      }

      const customer =
        await CustomerAuthService.getProfile(
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
    const { customerId, otp } = req.body;

    if (!customerId || !otp) {
      return res.status(400).json({
        success: false,
        message: "Customer ID and OTP are required",
      });
    }

    const result =
      await CustomerAuthService.verifyOtp(
        Number(customerId),
        String(otp)
      );

    return res.status(200).json({
      success: true,
      message: "Email verified successfully",
      data: result,
    });

  } catch (error: any) {

    console.error(
      "Verify OTP Error:",
      error
    );

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
    const { customerId } = req.body;

    if (!customerId) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const result =
      await CustomerAuthService.resendOtp(
        Number(customerId)
      );

    return res.status(200).json({
      success: true,
      message: "Verification OTP resent",
      data: result,
    });

  } catch (error: any) {

    console.error(
      "Resend OTP Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}


}