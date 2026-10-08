import { prisma } from "../../config/database";

export class TrustFeatureService {
  static async getAll() {
    const count = await prisma.trustFeature.count();
    if (count === 0) {
      const defaults = [
        { title: "Fast Delivery", description: "Dispatched within 24-48 hours", icon: "Truck", displayOrder: 1 },
        { title: "Secure Payments", description: "256-bit encrypted transactions", icon: "Lock", displayOrder: 2 },
        { title: "Easy Returns", description: "7-day doorstep replacement policy", icon: "RotateCcw", displayOrder: 3 },
        { title: "100% Genuine Products", description: "Direct from verified suppliers", icon: "Award", displayOrder: 4 },
        { title: "50,000+ Happy Parents", description: "Rated 4.8/5 on trusted review channels", icon: "HeartHandshake", displayOrder: 5 },
        { title: "Safe Materials for Kids", description: "BPA-free, non-toxic standards", icon: "ShieldCheck", displayOrder: 6 },
      ];
      await prisma.trustFeature.createMany({ data: defaults });
    }
    return prisma.trustFeature.findMany({
      orderBy: { displayOrder: "asc" },
    });
  }

  static async getActive() {
    const count = await prisma.trustFeature.count();
    if (count === 0) {
      const defaults = [
        { title: "Fast Delivery", description: "Dispatched within 24-48 hours", icon: "Truck", displayOrder: 1 },
        { title: "Secure Payments", description: "256-bit encrypted transactions", icon: "Lock", displayOrder: 2 },
        { title: "Easy Returns", description: "7-day doorstep replacement policy", icon: "RotateCcw", displayOrder: 3 },
        { title: "100% Genuine Products", description: "Direct from verified suppliers", icon: "Award", displayOrder: 4 },
        { title: "50,000+ Happy Parents", description: "Rated 4.8/5 on trusted review channels", icon: "HeartHandshake", displayOrder: 5 },
        { title: "Safe Materials for Kids", description: "BPA-free, non-toxic standards", icon: "ShieldCheck", displayOrder: 6 },
      ];
      await prisma.trustFeature.createMany({ data: defaults });
    }
    return prisma.trustFeature.findMany({
      where: { isActive: true },
      orderBy: { displayOrder: "asc" },
    });
  }

  static async create(data: any) {
    return prisma.trustFeature.create({
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        displayOrder: Number(data.displayOrder) || 0,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : true,
      },
    });
  }

  static async update(id: number, data: any) {
    return prisma.trustFeature.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        icon: data.icon,
        displayOrder: data.displayOrder !== undefined ? Number(data.displayOrder) : undefined,
        isActive: data.isActive !== undefined ? Boolean(data.isActive) : undefined,
      },
    });
  }

  static async delete(id: number) {
    return prisma.trustFeature.delete({
      where: { id },
    });
  }
}
