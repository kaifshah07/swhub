import { prisma } from "../../config/database";

function normalizeSectionType(type: string): string {
  const t = (type || "").toLowerCase().trim();
  if (t === "featured" || t === "featured-products") return "featured";
  if (t === "trending" || t === "trending-products") return "trending";
  if (t === "new-arrivals" || t === "new-arrival" || t === "newarrivals") return "new-arrivals";
  if (t === "best-sellers" || t === "best-seller" || t === "bestsellers") return "best-sellers";
  if (t === "flash-sale" || t === "flash-sales" || t === "flashsale") return "flash-sale";
  return t;
}

export class HomepageProductService {
  static async getProducts(type: string) {
    const normalized = normalizeSectionType(type);

    let baseWhere: any = { isActive: true, isDeleted: false };

    switch (normalized) {
      case "featured":
        baseWhere.isFeatured = true;
        break;
      case "trending":
        baseWhere.isTrending = true;
        break;
      case "new-arrivals":
        baseWhere.isNewArrival = true;
        break;
      case "best-sellers":
        baseWhere.isBestSeller = true;
        break;
      case "flash-sale":
        baseWhere.isFlashSale = true;
        break;
      default:
        return [];
    }

    return prisma.product.findMany({
      where: baseWhere,
      include: {
        category: true,
        subcategory: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
    });
  }

  static async updateProducts(type: string, productIds: number[]) {
    const normalized = normalizeSectionType(type);
    const validIds = (productIds || []).map(Number).filter((id) => !isNaN(id) && id > 0);

    // 1. Reset the current flag across all products
    switch (normalized) {
      case "featured":
        await prisma.product.updateMany({ data: { isFeatured: false } });
        break;
      case "trending":
        await prisma.product.updateMany({ data: { isTrending: false } });
        break;
      case "new-arrivals":
        await prisma.product.updateMany({ data: { isNewArrival: false } });
        break;
      case "best-sellers":
        await prisma.product.updateMany({ data: { isBestSeller: false } });
        break;
      case "flash-sale":
        await prisma.product.updateMany({ data: { isFlashSale: false } });
        break;
      default:
        throw new Error(`Unknown homepage section type: ${type}`);
    }

    if (validIds.length === 0) {
      return true;
    }

    // 2. Set the designated flag to true AND unset other section flags on these products
    // to strictly enforce mutual exclusivity across sections
    switch (normalized) {
      case "featured":
        await prisma.product.updateMany({
          where: { id: { in: validIds } },
          data: {
            isFeatured: true,
            isTrending: false,
            isNewArrival: false,
            isBestSeller: false,
            isFlashSale: false,
          },
        });
        break;
      case "trending":
        await prisma.product.updateMany({
          where: { id: { in: validIds } },
          data: {
            isTrending: true,
            isFeatured: false,
            isNewArrival: false,
            isBestSeller: false,
            isFlashSale: false,
          },
        });
        break;
      case "new-arrivals":
        await prisma.product.updateMany({
          where: { id: { in: validIds } },
          data: {
            isNewArrival: true,
            isFeatured: false,
            isTrending: false,
            isBestSeller: false,
            isFlashSale: false,
          },
        });
        break;
      case "best-sellers":
        await prisma.product.updateMany({
          where: { id: { in: validIds } },
          data: {
            isBestSeller: true,
            isFeatured: false,
            isTrending: false,
            isNewArrival: false,
            isFlashSale: false,
          },
        });
        break;
      case "flash-sale":
        await prisma.product.updateMany({
          where: { id: { in: validIds } },
          data: {
            isFlashSale: true,
            isFeatured: false,
            isTrending: false,
            isNewArrival: false,
            isBestSeller: false,
          },
        });
        break;
    }

    return true;
  }
}