import { prisma } from "../../config/database";

export class HomepageSectionService {

  static async getAll() {
    return prisma.homepageSection.findMany();
  }

  static async getByKey(key: string) {
    return prisma.homepageSection.findUnique({
      where: {
        key,
      },
    });
  }

  static async update(
    key: string,
    data: any
  ) {
    return prisma.homepageSection.upsert({
      where: {
        key,
      },

      create: {
        key,
        ...data,
      },

      update: data,
    });
  }

}