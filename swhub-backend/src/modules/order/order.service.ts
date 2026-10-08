import { prisma } from "../../config/database";
import { Prisma } from "@prisma/client";
import { CreateOrderDTO } from "./order.types";

export class OrderService {

  // =========================
  // CREATE ORDER
  // =========================

  static async create(data: CreateOrderDTO) {

    if (!data.customerId) {
      throw new Error("Customer ID is required");
    }

    if (!data.items || !data.items.length) {
      throw new Error("Order must contain at least one product");
    }

    return await prisma.$transaction(async (tx) => {

      let totalAmount = new Prisma.Decimal(0);

      const orderItems: {
        productId: number;
        quantity: number;
        price: Prisma.Decimal;
      }[] = [];


      // Validate products
      for (const item of data.items) {

        const product =
          await tx.product.findUnique({
            where: {
              id: Number(item.productId),
            },
          });

        if (!product) {
          throw new Error(
            `Product ${item.productId} not found`
          );
        }


        if (!product.isActive) {
          throw new Error(
            `${product.name} is currently unavailable`
          );
        }


        if (product.stock < item.quantity) {
          throw new Error(
            `${product.name} has only ${product.stock} items left`
          );
        }


        // Use discount price if available
        const finalPrice =
          product.discountPrice !== null
            ? product.discountPrice
            : product.price;


        totalAmount =
          totalAmount.plus(
            finalPrice.mul(item.quantity)
          );


        orderItems.push({
          productId: product.id,
          quantity: item.quantity,
          price: finalPrice,
        });

      }

      // Check and apply coupon if provided
      if (data.couponCode) {
        const coupon = await tx.coupon.findUnique({
          where: {
            code: data.couponCode.toUpperCase().trim(),
          },
        });

        if (coupon && coupon.isActive) {
          const currentTotal = Number(totalAmount);
          const isNotExpired = !coupon.expiresAt || new Date() <= coupon.expiresAt;
          const underUsageLimit = coupon.usageLimit === null || coupon.usedCount < coupon.usageLimit;
          const meetsMinOrder = coupon.minOrderAmount === null || currentTotal >= Number(coupon.minOrderAmount);

          if (isNotExpired && underUsageLimit && meetsMinOrder) {
            let discount = 0;
            if (coupon.discountType === "PERCENTAGE") {
              discount = (currentTotal * Number(coupon.discountValue)) / 100;
              if (coupon.maxDiscount !== null) {
                discount = Math.min(discount, Number(coupon.maxDiscount));
              }
            } else {
              discount = Number(coupon.discountValue);
              discount = Math.min(discount, currentTotal);
            }

            totalAmount = totalAmount.minus(new Prisma.Decimal(discount));
            await tx.coupon.update({
              where: { id: coupon.id },
              data: { usedCount: { increment: 1 } },
            });
          }
        }
      }

      // Generate order number
      const orderNumber =
        "ORD-" +
        Date.now()
          .toString()
          .slice(-8);

      // Create order
      const order =
        await tx.order.create({
          data: {
            orderNumber,
            customerId: Number(data.customerId),
            address: data.address,
            paymentMethod: data.paymentMethod,
            totalAmount,
            items: {
              create: orderItems,
            },
          },
          include: {
            customer: true,
            items: {
              include: {
                product: true,
              },
            },
          },
        });

      // If COD, create corresponding Payment record
      if (data.paymentMethod === "COD") {
        await tx.payment.create({
          data: {
            paymentId: `PAY-${Date.now()}-${order.id}`,
            orderId: order.id,
            amount: totalAmount,
            paymentMethod: "COD",
            paymentStatus: "PENDING",
          },
        });
      }

      // Reduce stock
      for (const item of orderItems) {

        await tx.product.update({

          where: {
            id: item.productId,
          },

          data: {

            stock: {
              decrement:
                item.quantity,
            },

          },

        });

      }


      return order;

    });

  }


  // =========================
  // CUSTOMER ORDERS
  // =========================

  static async getCustomerOrders(
    customerId: number
  ) {

    return prisma.order.findMany({

      where: {
        customerId,
      },

      include: {

        items: {

          include: {
            product: true,
          },

        },

      },

      orderBy: {
        createdAt: "desc",
      },

    });

  }


  // =========================
  // CUSTOMER SINGLE ORDER
  // =========================

  static async getCustomerOrderById(
    orderId: number,
    customerId: number
  ) {

    return prisma.order.findFirst({

      where: {

        id: orderId,

        customerId,

      },

      include: {

        items: {

          include: {
            product: true,
          },

        },

      },

    });

  }


  // =========================
  // ADMIN GET ALL
  // =========================

  static async getAll(query: any) {

    const {
      page = 1,
      limit = 10,
      search = "",
      orderStatus,
      paymentStatus,
      sort = "desc",
    } = query;


    const skip =
      (Number(page) - 1) *
      Number(limit);


    const where: any = {};


    if (search) {

      where.OR = [

        {
          orderNumber: {
            contains: search,
          },
        },

        {
          customer: {
            name: {
              contains: search,
            },
          },
        },

        {
          customer: {
            email: {
              contains: search,
            },
          },
        },

      ];

    }


    if (orderStatus) {
      where.orderStatus =
        orderStatus;
    }


    if (paymentStatus) {
      where.paymentStatus =
        paymentStatus;
    }


    const [
      orders,
      total,
    ] = await Promise.all([

      prisma.order.findMany({

        where,

        skip,

        take:
          Number(limit),

        include: {

          customer: true,

          items: {

            include: {
              product: true,
            },

          },

        },

        orderBy: {

          createdAt:
            sort === "asc"
              ? "asc"
              : "desc",

        },

      }),


      prisma.order.count({
        where,
      }),

    ]);


    return {

      orders,

      pagination: {

        page:
          Number(page),

        limit:
          Number(limit),

        total,

        totalPages:
          Math.ceil(
            total /
            Number(limit)
          ),

      },

    };

  }


  // =========================
  // ADMIN GET BY ID
  // =========================

  static async getById(
    id: number
  ) {

    return prisma.order.findUnique({

      where: {
        id,
      },

      include: {

        customer: true,

        items: {

          include: {
            product: true,
          },

        },

      },

    });

  }


  // =========================
  // UPDATE STATUS
  // =========================

  static async updateStatus(
    id: number,
    orderStatus: any
  ) {

    return prisma.order.update({

      where: {
        id,
      },

      data: {
        orderStatus,
      },

    });

  }


  // =========================
  // UPDATE PAYMENT
  // =========================

  static async updatePaymentStatus(
    id: number,
    paymentStatus: any
  ) {

    return prisma.order.update({

      where: {
        id,
      },

      data: {
        paymentStatus,
      },

    });

  }


  // =========================
  // CANCEL ORDER
  // =========================

  static async cancelOrder(
    id: number
  ) {

    return prisma.$transaction(
      async (tx) => {

        const order =
          await tx.order.findUnique({

            where: {
              id,
            },

            include: {
              items: true,
            },

          });


        if (!order) {
          throw new Error(
            "Order not found"
          );
        }


        if (
          order.orderStatus ===
          "CANCELLED"
        ) {

          throw new Error(
            "Order is already cancelled"
          );

        }


        // Restore stock
        for (
          const item
          of order.items
        ) {

          await tx.product.update({

            where: {
              id:
                item.productId,
            },

            data: {

              stock: {

                increment:
                  item.quantity,

              },

            },

          });

        }


        return tx.order.update({

          where: {
            id,
          },

          data: {

            orderStatus:
              "CANCELLED",

          },

        });

      }
    );

  }


  // =========================
  // DELETE ORDER
  // =========================

  static async delete(
    id: number
  ) {

    return prisma.order.delete({

      where: {
        id,
      },

    });

  }

  static async getMyOrders(customerId: number) {
  return prisma.order.findMany({
    where: {
      customerId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}
}