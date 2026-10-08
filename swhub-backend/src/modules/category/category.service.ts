import { prisma } from "../../config/database";

export class CategoryService {
  static async create(data: {
    name: string;
    description?: string;
    image?: string;
    displayOrder?: number;
    isActive?: boolean | string;
  }) {
    const slug = data.name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const existing = await prisma.category.findFirst({
      where: {
        OR: [
          { name: data.name },
          { slug }
        ]
      }
    });

    if (existing) {
      throw new Error("Category already exists");
    }

    return prisma.category.create({
      data: {
        ...data,
        slug,
        displayOrder: Number(data.displayOrder || 0),
        isActive:
          data.isActive === undefined
            ? true
            : data.isActive === true || data.isActive === "true",
      },
    });
  }

  static async getAll() {
    return prisma.category.findMany({
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  static async getById(id: number) {
    return prisma.category.findUnique({
      where: { id },
    });
  }

  static async update(id: number, data: any) {
    const updateData = {
      ...data,
      ...(data.displayOrder !== undefined && {
        displayOrder: Number(data.displayOrder || 0),
      }),
      ...(data.isActive !== undefined && {
        isActive: data.isActive === true || data.isActive === "true",
      }),
    };

    return prisma.category.update({
      where: { id },
      data: updateData,
    });
  }

  static async delete(id: number) {
    return prisma.category.delete({
      where: { id },
    });
  }

  static async getBySlug(slug: string) {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        subcategories: {
          where: { isActive: true },
          orderBy: { displayOrder: "asc" },
        },
        products: {
          where: { isActive: true },
          orderBy: { createdAt: "desc" },
        },
      },
    });
  }
}
