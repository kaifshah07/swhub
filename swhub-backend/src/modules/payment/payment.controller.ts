import { Request, Response } from "express";
import { PaymentService } from "./payment.service";

export class PaymentController {

  static async getAll(
    req: Request,
    res: Response
  ) {

    const page = Number(req.query.page) || 1;

    const limit = Number(req.query.limit) || 10;

    const search = String(req.query.search || "");

    const result =
      await PaymentService.getAll(
        page,
        limit,
        search
      );

    return res.json({

      success: true,

      ...result,

    });

  }

  static async getById(
    req: Request,
    res: Response
  ) {

    const payment =
      await PaymentService.getById(
        Number(req.params.id)
      );

    return res.json({

      success: true,

      data: payment,

    });

  }

  static async updateStatus(
    req: Request,
    res: Response
  ) {

    
    const payment =
  await PaymentService.updateStatus(
    String(req.params.id),
    req.body.paymentStatus
  );

    return res.json({

      success: true,

      message: "Payment Updated",

      data: payment,

    });

  }

  static async refund(
    req: Request,
    res: Response
  ) {

    const payment =
      await PaymentService.refund(
        Number(req.params.id)
      );

    return res.json({

      success: true,

      message: "Refund Successful",

      data: payment,

    });

  }

  static async create(
  req: Request,
  res: Response
) {
  try {
    const customerId =
      (req as any).customer?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message:
          "Customer authentication required",
      });
    }

    const orderId = Number(
      req.body.orderId
    );

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    const payment =
      await PaymentService.createPayment(
        orderId,
        Number(customerId)
      );

    return res.status(201).json({
      success: true,
      message:
        "Payment created successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error(
      "Create Payment Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}

static async verify(
  req: Request,
  res: Response
) {
  try {
    const customerId =
      (req as any).customer?.id;

    if (!customerId) {
      return res.status(401).json({
        success: false,
        message:
          "Customer authentication required",
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
        message:
          "Payment verification data is incomplete",
      });
    }

    const payment =
      await PaymentService.verifyPayment(
        paymentId,
        razorpayPaymentId,
        razorpayOrderId,
        razorpaySignature,
        Number(customerId)
      );

    return res.json({
      success: true,
      message:
        "Payment verified successfully",
      data: payment,
    });
  } catch (error: any) {
    console.error(
      "Verify Payment Error:",
      error
    );

    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
}
}