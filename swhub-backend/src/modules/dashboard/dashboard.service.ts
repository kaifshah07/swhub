import { prisma } from "../../config/database";
import { Prisma } from "@prisma/client";

export class DashboardService {
  static async getDashboard() {

    const [
      totalProducts,
      totalCategories,
      totalOrders,
      pendingOrders,
      deliveredOrders,
      cancelledOrders
    ] = await Promise.all([

      prisma.product.count(),

      prisma.category.count(),

      prisma.order.count(),

      prisma.order.count({
        where: {
          orderStatus: "PENDING"
        }
      }),

      prisma.order.count({
        where: {
          orderStatus: "DELIVERED"
        }
      }),

      prisma.order.count({
        where: {
          orderStatus: "CANCELLED"
        }
      })

    ]);

    const revenue = await prisma.order.aggregate({

      _sum: {
        totalAmount: true
      },

      where: {
        paymentStatus: "PAID"
      }

    });

    const lowStockProducts =
      await prisma.product.findMany({

        where: {
          stock: {
            lte: 5
          }
        },

        orderBy: {
          stock: "asc"
        },

        take: 5

      });

    const recentOrders =
      await prisma.order.findMany({

        orderBy: {
          createdAt: "desc"
        },

        take: 10,

        include: {
          items: true
        }

      });

    return {

      overview: {

        totalProducts,

        totalCategories,

        totalOrders,

        pendingOrders,

        deliveredOrders,

        cancelledOrders,

        totalRevenue:
          revenue._sum.totalAmount ??
          new Prisma.Decimal(0)

      },

      lowStockProducts,

      recentOrders

    };

  }
}