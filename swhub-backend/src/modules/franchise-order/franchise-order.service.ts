import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FranchiseOrderService {
  static async createOrder(franchiseId: number, items: { productId: number; quantity: number }[]) {
    // Calculate total using franchisePrice
    let totalAmount = 0;
    const orderItems: any[] = [];

    for (const item of items) {
      const product = await prisma.product.findUnique({ where: { id: item.productId } });
      if (!product) throw new Error(`Product ${item.productId} not found`);

      // Use franchisePrice, fallback to regular price if not set
      const priceToUse = product.franchisePrice || product.discountPrice || product.price;
      const totalItemPrice = Number(priceToUse) * item.quantity;
      totalAmount += totalItemPrice;

      orderItems.push({
        productId: item.productId,
        quantity: item.quantity,
        price: priceToUse,
      });
    }

    const orderNumber = `F-ORD-${Date.now()}`;

    // Create order transaction
    return prisma.$transaction(async (tx) => {
      const order = await tx.franchiseOrder.create({
        data: {
          orderNumber,
          franchiseId,
          totalAmount,
          items: {
            create: orderItems,
          },
        },
        include: { items: true },
      });

      return order;
    });
  }

  static async getOrdersByFranchise(franchiseId: number) {
    return prisma.franchiseOrder.findMany({
      where: { franchiseId },
      include: {
        items: {
          include: { product: true },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async getAllOrders() {
    return prisma.franchiseOrder.findMany({
      include: {
        franchise: true,
        items: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  static async updateOrderStatus(orderId: number, status: string) {
    const validStatuses = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED"];
    if (!validStatuses.includes(status)) throw new Error("Invalid status");

    const order = await prisma.franchiseOrder.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) throw new Error("Order not found");

    return prisma.$transaction(async (tx) => {
      const updatedOrder = await tx.franchiseOrder.update({
        where: { id: orderId },
        data: { orderStatus: status as any },
      });

      // If Delivered, ADD to local Franchise Inventory and DEDUCT from Main Inventory
      if (status === "DELIVERED" && order.orderStatus !== "DELIVERED") {
        for (const item of order.items) {
          // Deduct from main stock
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: { decrement: item.quantity } },
          });

          // Add to local franchise stock
          await tx.franchiseStock.upsert({
            where: {
              franchiseId_productId: {
                franchiseId: order.franchiseId,
                productId: item.productId,
              },
            },
            update: { quantity: { increment: item.quantity } },
            create: {
              franchiseId: order.franchiseId,
              productId: item.productId,
              quantity: item.quantity,
            },
          });
        }
      }

      return updatedOrder;
    });
  }
}
