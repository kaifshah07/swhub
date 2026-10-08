import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

export class FranchiseUserService {
  static async createFranchiseUser(data: any) {
    // Generate Franchise ID (e.g., BAL-FR-001)
    const count = await prisma.franchiseUser.count();
    const franchiseId = `BAL-FR-${String(count + 1).padStart(3, "0")}`;

    const hashedPassword = await bcrypt.hash(data.password, 10);

    return prisma.franchiseUser.create({
      data: {
        franchiseId,
        fullName: data.fullName,
        email: data.email,
        phone: data.phone,
        password: hashedPassword,
        roleTier: data.roleTier,
        gstNumber: data.gstNumber || null,
        parentId: data.parentId ? Number(data.parentId) : null,
        address: data.address,
        city: data.city,
        state: data.state,
        pincode: data.pincode,
        businessName: data.businessName,
        shopName: data.shopName,
        isActive: data.isActive !== undefined ? data.isActive : true,
      },
    });
  }

  static async getAllFranchiseUsers() {
    return prisma.franchiseUser.findMany({
      include: {
        parent: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  static async getFranchiseUserById(id: number) {
    return prisma.franchiseUser.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
      },
    });
  }

  static async updateFranchiseUser(id: number, data: any) {
    const updateData: any = { ...data };

    if (data.password) {
      updateData.password = await bcrypt.hash(data.password, 10);
    }
    
    if (data.parentId !== undefined) {
      updateData.parentId = data.parentId ? Number(data.parentId) : null;
    }

    return prisma.franchiseUser.update({
      where: { id },
      data: updateData,
    });
  }

  static async toggleStatus(id: number, isActive: boolean) {
    return prisma.franchiseUser.update({
      where: { id },
      data: { isActive },
    });
  }
}
