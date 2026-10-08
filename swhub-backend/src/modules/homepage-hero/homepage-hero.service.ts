import { prisma } from "../../config/database";

export class HomepageHeroService {

  static async getAll() {
    return prisma.homepageHero.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  static async getById(id: number) {
    return prisma.homepageHero.findUnique({
      where: { id },
    });
  }

  static async create(data: any) {
    return prisma.homepageHero.create({
      data,
    });
  }

  static async update(
    id: number,
    data: any
  ) {
    return prisma.homepageHero.update({
      where: { id },
      data,
    });
  }

  static async delete(id: number) {
    return prisma.homepageHero.delete({
      where: { id },
    });
  }
}