import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export class FranchiseInvoiceService {
  static async generateInvoice(
    franchiseId: number, 
    data: {
      customerName?: string;
      customerPhone?: string;
      items: { productId: number; quantity: number }[];
      paymentMethod: string;
    }
  ) {
    let totalAmount = 0;
    let taxAmount = 0;
    const invoiceItems: any[] = [];

    // Calculate totals and deduct stock
    return prisma.$transaction(async (tx) => {
      for (const item of data.items) {
        const product = await tx.product.findUnique({ where: { id: item.productId } });
        if (!product) throw new Error(`Product ${item.productId} not found`);

        // Check Franchise Stock
        const stockRecord = await tx.franchiseStock.findUnique({
          where: { franchiseId_productId: { franchiseId, productId: item.productId } }
        });

        if (!stockRecord || stockRecord.quantity < item.quantity) {
          throw new Error(`Insufficient local stock for product: ${product.name}`);
        }

        const price = product.discountPrice || product.price;
        // Standard 18% GST (can be made dynamic)
        const taxRate = 18.0;
        
        const itemTotal = Number(price) * item.quantity;
        const itemTax = itemTotal * (taxRate / 100);

        totalAmount += itemTotal + itemTax;
        taxAmount += itemTax;

        invoiceItems.push({
          productId: item.productId,
          quantity: item.quantity,
          price: price,
          taxRate: taxRate
        });

        // Deduct Stock
        await tx.franchiseStock.update({
          where: { id: stockRecord.id },
          data: { quantity: { decrement: item.quantity } }
        });
      }

      const invoiceNumber = `INV-${Date.now()}`;

      const invoice = await tx.franchiseInvoice.create({
        data: {
          invoiceNumber,
          franchiseId,
          customerName: data.customerName,
          customerPhone: data.customerPhone,
          totalAmount,
          taxAmount,
          paymentMethod: data.paymentMethod as any,
          items: {
            create: invoiceItems
          }
        },
        include: { items: true }
      });

      return invoice;
    });
  }

  static async getMyInvoices(franchiseId: number) {
    return prisma.franchiseInvoice.findMany({
      where: { franchiseId },
      include: {
        items: {
          include: { product: true }
        }
      },
      orderBy: { createdAt: "desc" }
    });
  }
}
