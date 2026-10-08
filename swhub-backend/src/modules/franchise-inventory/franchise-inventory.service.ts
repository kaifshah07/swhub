import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FranchiseInventoryService {
  static async getFranchiseStock(franchiseId: number) {
    return prisma.franchiseStock.findMany({
      where: { franchiseId },
      include: {
        product: true,
      },
      orderBy: { quantity: "asc" }
    });
  }

  static async adjustStock(franchiseId: number, productId: number, delta: number) {
    return prisma.franchiseStock.upsert({
      where: {
        franchiseId_productId: {
          franchiseId,
          productId
        }
      },
      update: { quantity: { increment: delta } },
      create: {
        franchiseId,
        productId,
        quantity: delta
      }
    });
  }
}
