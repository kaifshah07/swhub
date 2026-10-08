import { prisma } from "../../config/database";
import { env } from "../../config/env";
import Razorpay from "razorpay";
import crypto from "crypto";

const razorpay = new Razorpay({
  key_id: env.RAZORPAY_KEY_ID,
  key_secret: env.RAZORPAY_KEY_SECRET,
});

export class PaymentService {
  // =====================================================
  // CUSTOMER — CREATE RAZORPAY PAYMENT
  // =====================================================

  static async createPayment(orderId: number, customerId: number) {

    console.log("RAZORPAY KEY:", env.RAZORPAY_KEY_ID);
  console.log(
    "RAZORPAY SECRET:",
    env.RAZORPAY_KEY_SECRET
      ? "FOUND"
      : "MISSING"
);
    const order = await prisma.order.findFirst({
      where: {
        id: orderId,
        customerId,
      },
      include: {
        payment: true,
      },
    });

    if (!order) {
      throw new Error("Order not found");
    }

    if (order.paymentStatus === "PAID") {
      throw new Error("Order is already paid");
    }

    // If payment already exists, return existing Razorpay order
    if (order.payment?.razorpayOrderId) {
      return {
        paymentId: order.payment.paymentId,
        razorpayOrderId: order.payment.razorpayOrderId,
        amount: Number(order.payment.amount),
        currency: "INR",
        key: env.RAZORPAY_KEY_ID,
      };
    }

    const amountInPaise = Math.round(
      Number(order.totalAmount) * 100
    );

    const razorpayOrder = await razorpay.orders.create({
      amount: amountInPaise,
      currency: "INR",
      receipt: order.orderNumber,
    });

    const paymentId = `PAY-${Date.now()}`;

    const payment = await prisma.payment.create({
      data: {
        paymentId,
        razorpayOrderId: razorpayOrder.id,
        orderId: order.id,
        amount: order.totalAmount,
        paymentMethod: "ONLINE",
        paymentStatus: "PENDING",
      },
    });

    return {
      paymentId: payment.paymentId,
      razorpayOrderId: razorpayOrder.id,
      amount: amountInPaise,
      currency: "INR",
      key: env.RAZORPAY_KEY_ID,
    };
  }

  // =====================================================
  // CUSTOMER — VERIFY RAZORPAY PAYMENT
  // =====================================================

  static async verifyPayment(
    paymentId: string,
    razorpayPaymentId: string,
    razorpayOrderId: string,
    razorpaySignature: string,
    customerId: number
  ) {
    const payment = await prisma.payment.findUnique({
      where: {
        paymentId,
      },
      include: {
        order: true,
      },
    });

    if (!payment) {
      throw new Error("Payment record not found");
    }

    if (payment.order.customerId !== customerId) {
      throw new Error("Unauthorized payment verification");
    }

    if (
      payment.razorpayOrderId !== razorpayOrderId
    ) {
      throw new Error("Invalid Razorpay order");
    }

    const body =
      razorpayOrderId +
      "|" +
      razorpayPaymentId;

    const expectedSignature =
      crypto
        .createHmac(
          "sha256",
          env.RAZORPAY_KEY_SECRET
        )
        .update(body)
        .digest("hex");

    if (
      expectedSignature !==
      razorpaySignature
    ) {
      throw new Error(
        "Invalid payment signature"
      );
    }

    const result = await prisma.$transaction(
      async (tx) => {
        const updatedPayment =
          await tx.payment.update({
            where: {
              paymentId,
            },
            data: {
              razorpayPaymentId,
              razorpaySignature,
              paymentStatus: "PAID",
              transactionId:
                razorpayPaymentId,
            },
          });

        await tx.order.update({
          where: {
            id: payment.orderId,
          },
          data: {
            paymentStatus: "PAID",
            orderStatus: "CONFIRMED",
          },
        });

        return updatedPayment;
      }
    );

    return result;
  }

  // =====================================================
  // ADMIN — GET ALL PAYMENTS
  // =====================================================

  static async getAll(
    page = 1,
    limit = 10,
    search = "",
    paymentStatus = ""
  ) {
    const skip = (page - 1) * limit;

    const where: any = {};

    if (search) {
      where.OR = [
        {
          paymentId: {
            contains: search,
          },
        },
        {
          razorpayPaymentId: {
            contains: search,
          },
        },
        {
          transactionId: {
            contains: search,
          },
        },
      ];
    }

    if (paymentStatus) {
      where.paymentStatus = paymentStatus;
    }

    const [payments, total] =
      await Promise.all([
        prisma.payment.findMany({
          where,
          skip,
          take: limit,
          include: {
            order: {
              include: {
                customer: true,
              },
            },
          },
          orderBy: {
            createdAt: "desc",
          },
        }),

        prisma.payment.count({
          where,
        }),
      ]);

    return {
      payments,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(
          total / limit
        ),
      },
    };
  }

  // =====================================================
  // ADMIN — GET PAYMENT BY ID
  // =====================================================

  static async getById(id: number) {
    return prisma.payment.findUnique({
      where: {
        id,
      },
      include: {
        order: {
          include: {
            customer: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        },
      },
    });
  }

  // =====================================================
  // ADMIN — REFUND
  // =====================================================

  static async refund(id: number) {
    return prisma.payment.update({
      where: {
        id,
      },
      data: {
        refunded: true,
        refundDate: new Date(),
        paymentStatus: "REFUNDED",
      },
    });
  }

  // =====================================================
  // ADMIN — UPDATE PAYMENT STATUS
  // =====================================================

  static async updateStatus(
    paymentId: string,
    status:
      | "PENDING"
      | "PAID"
      | "FAILED"
      | "REFUNDED"
  ) {
    const payment =
      await prisma.payment.findUnique({
        where: {
          paymentId,
        },
      });

    if (!payment) {
      throw new Error("Payment not found");
    }

    const updatedPayment =
      await prisma.payment.update({
        where: {
          paymentId,
        },
        data: {
          paymentStatus: status,
        },
      });

    await prisma.order.update({
      where: {
        id: payment.orderId,
      },
      data: {
        paymentStatus: status,
      },
    });

    return updatedPayment;
  }
}