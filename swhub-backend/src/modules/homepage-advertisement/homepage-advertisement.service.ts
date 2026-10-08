import { prisma } from "../../config/database";

export class HomepageAdvertisementService {

  static async getAll() {
    return prisma.homepageAdvertisement.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  static async getById(id: number) {
    return prisma.homepageAdvertisement.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.homepageAdvertisement.create({
      data,
    });
  }

  static async update(
    id: number,
    data: any
  ) {
    return prisma.homepageAdvertisement.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.homepageAdvertisement.delete({
      where: { id },
    });
  }
}