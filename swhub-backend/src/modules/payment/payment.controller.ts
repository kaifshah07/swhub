import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {
  // =====================================================
  // ADMIN — GET ALL PAYMENTS
  // =====================================================

  static async getAll(req: Request, res: Response) {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const search = String(req.query.search || "");
      const paymentStatus = String(req.query.paymentStatus || "");

      const result = await PaymentService.getAll(
        page,
        limit,
        search,
        paymentStatus
      );

      return res.json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error("Get All Payments Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // ADMIN — GET PAYMENT BY ID
  // =====================================================

  static async getById(req: Request, res: Response) {
    try {
      const payment = await PaymentService.getById(Number(req.params.id));

      if (!payment) {
        return res.status(404).json({
          success: false,
          message: "Payment record not found",
        });
      }

      return res.json({
        success: true,
        data: payment,
      });
    } catch (error: any) {
      console.error("Get Payment By ID Error:", error);
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // ADMIN — UPDATE PAYMENT STATUS
  // =====================================================

  static async updateStatus(req: Request, res: Response) {
    try {
      const payment = await PaymentService.updateStatus(
        String(req.params.id),
        req.body.paymentStatus
      );

      return res.json({
        success: true,
        message: "Payment status updated successfully",
        data: payment,
      });
    } catch (error: any) {
      console.error("Update Payment Status Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // ADMIN — REFUND PAYMENT
  // =====================================================

  static async refund(req: Request, res: Response) {
    try {
      const { amount } = req.body;
      const payment = await PaymentService.refund(
        Number(req.params.id),
        amount !== undefined ? Number(amount) : undefined
      );

      return res.json({
        success: true,
        message: "Refund processed successfully",
        data: payment,
      });
    } catch (error: any) {
      console.error("Refund Payment Error:", error);
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }
  }

  // =====================================================
  // CUSTOMER — CREATE PAYMENT
  // =====================================================

  static async create(req: Request, res: Response) {
    try {
      const customerId = (req as any).customer?.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Customer authentication required",
        });
      }

      const orderId = Number(req.body.orderId);

      if (!orderId) {
        return res.status(400).json({
          success: false,
          message: "Order ID is required",
        });
      }

      const payment = await PaymentService.createPayment(
        orderId,
        Number(customerId)
      );

      return res.status(201).json({
        success: true,
        message: "Payment initialized successfully",
        data: payment,
      });
    } catch (error: any) {
      console.error("Create Payment Error:", error);
      const message =
        error?.message ||
        error?.error?.description ||
        error?.description ||
        "Failed to initialize online payment";
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  // =====================================================
  // CUSTOMER — VERIFY PAYMENT
  // =====================================================

  static async verify(req: Request, res: Response) {
    try {
      const customerId = (req as any).customer?.id;

      if (!customerId) {
        return res.status(401).json({
          success: false,
          message: "Customer authentication required",
        });
      }

      const {
        paymentId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
      } = req.body;

      if (
        !paymentId ||
        !razorpayPaymentId ||
        !razorpayOrderId ||
        !razorpaySignature
      ) {
        return res.status(400).json({
          success: false,
          message: "Payment verification data is incomplete",
        });
      }

      const payment = await PaymentService.verifyPayment(
        paymentId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        Number(customerId)
      );

      return res.json({
        success: true,
        message: "Payment verified successfully",
        data: payment,
      });
    } catch (error: any) {
      console.error("Verify Payment Error:", error);
      const message =
        error?.message ||
        error?.error?.description ||
        error?.description ||
        "Payment verification failed";
      return res.status(400).json({
        success: false,
        message,
      });
    }
  }

  // =====================================================
  // WEBHOOK — RAZORPAY WEBHOOK HANDLER
  // =====================================================

  static async handleWebhook(req: Request, res: Response) {
    try {
      const signature =
        (req.headers["x-razorpay-signature"] as string) || "";
      const rawBody = (req as any).rawBody || JSON.stringify(req.body);

      const result = await PaymentService.handleWebhook(rawBody, signature);

      return res.status(200).json({
        success: true,
        ...result,
      });
    } catch (error: any) {
      console.error("Razorpay Webhook Error:", error?.message || error);
      return res.status(400).json({
        success: false,
        message: error?.message || "Webhook processing failed",
      });
    }
  }
}