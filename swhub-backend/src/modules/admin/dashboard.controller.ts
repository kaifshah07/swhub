import { Response } from "express";
import { prisma } from "../../config/database";
import { AuthRequest } from "../../middleware/auth.middleware";

export class DashboardController {
  static async getDashboard(req: AuthRequest, res: Response) {
    try {
      // Dashboard Statistics
      const [
        totalProducts,
        totalCategories,
        totalOrders,
        totalCustomers,
        pendingOrders,
        completedOrders,
        paidOrders
      ] = await Promise.all([
        prisma.product.count({ where: { isDeleted: false } }),
        prisma.category.count(),
        prisma.order.count(),
        prisma.customer.count(),
        prisma.order.count({ where: { orderStatus: { in: ["PENDING", "CONFIRMED", "PACKED", "SHIPPED"] } } }),
        prisma.order.count({ where: { orderStatus: "DELIVERED" } }),
        prisma.order.findMany({
          where: { paymentStatus: "PAID" },
          select: { totalAmount: true }
        })
      ]);

      const totalRevenue = paidOrders.reduce((sum, order) => sum + Number(order.totalAmount), 0);

      // Recent Products
      const recentProducts = await prisma.product.findMany({
        take: 5,
        where: { isDeleted: false },
        orderBy: {
          createdAt: "desc",
        },
        include: {
          category: true,
        },
      });

      // Low Stock Products
      const lowStockProducts = await prisma.product.findMany({
        where: {
          isDeleted: false,
          stock: {
            lte: 10,
          },
        },
        orderBy: {
          stock: "asc",
        },
      });

      return res.status(200).json({
        success: true,
        message: "Dashboard loaded successfully",

        admin: req.admin,

        statistics: {
          totalProducts,
          totalCategories,
          totalOrders,
          totalCustomers,
          totalRevenue: totalRevenue.toFixed(2),
          pendingOrders,
          completedOrders,
        },

        recentProducts,

        lowStockProducts,
      });
    } catch (error: any) {
      return res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  }
}