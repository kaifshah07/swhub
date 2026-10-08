import { prisma } from "../../config/database";

export class CouponService {

  static async create(data: any) {

    const coupon = await prisma.coupon.create({
      data: {
        code: data.code.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt)
          : null,
      },
    });

    return coupon;
  }

  static async getAll(page = 1, limit = 10, search = "") {

    const skip = (page - 1) * limit;

    const where = search
      ? {
          code: {
            contains: search,
          },
        }
      : {};

    const [coupons, total] = await Promise.all([

      prisma.coupon.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),

      prisma.coupon.count({
        where,
      }),

    ]);

    return {
      coupons,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  static async getById(id: number) {

    return prisma.coupon.findUnique({
      where: {
        id,
      },
    });

  }

  static async update(id: number, data: any) {

    return prisma.coupon.update({
      where: {
        id,
      },
      data: {
        code: data.code?.toUpperCase(),
        description: data.description,
        discountType: data.discountType,
        discountValue: data.discountValue,
        minOrderAmount: data.minOrderAmount,
        maxDiscount: data.maxDiscount,
        usageLimit: data.usageLimit,
        expiresAt: data.expiresAt
          ? new Date(data.expiresAt)
          : undefined,
      },
    });

  }

  static async activate(id: number) {

    return prisma.coupon.update({
      where: {
        id,
      },
      data: {
        isActive: true,
      },
    });

  }

  static async deactivate(id: number) {

    return prisma.coupon.update({
      where: {
        id,
      },
      data: {
        isActive: false,
      },
    });

  }

  static async delete(id: number) {

    return prisma.coupon.delete({
      where: {
        id,
      },
    });

  }

  static async validateAndApply(code: string, orderAmount: number) {
    if (!code) {
      throw new Error("Coupon code is required");
    }

    const coupon = await prisma.coupon.findUnique({
      where: {
        code: code.toUpperCase().trim(),
      },
    });

    if (!coupon || !coupon.isActive) {
      throw new Error("Invalid or inactive coupon code");
    }

    if (coupon.expiresAt && new Date() > coupon.expiresAt) {
      throw new Error("Coupon has expired");
    }

    if (coupon.usageLimit !== null && coupon.usedCount >= coupon.usageLimit) {
      throw new Error("Coupon usage limit has been reached");
    }

    const amount = Number(orderAmount) || 0;

    if (coupon.minOrderAmount !== null && amount < Number(coupon.minOrderAmount)) {
      throw new Error(`Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`);
    }

    let discount = 0;
    if (coupon.discountType === "PERCENTAGE") {
      discount = (amount * Number(coupon.discountValue)) / 100;
      if (coupon.maxDiscount !== null) {
        discount = Math.min(discount, Number(coupon.maxDiscount));
      }
    } else {
      discount = Number(coupon.discountValue);
      discount = Math.min(discount, amount);
    }

    discount = Math.round(discount * 100) / 100;
    const finalAmount = Math.max(0, Math.round((amount - discount) * 100) / 100);

    return {
      valid: true,
      couponId: coupon.id,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: Number(coupon.discountValue),
      discount,
      finalAmount,
    };
  }

}