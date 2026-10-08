import { prisma } from "../../config/database";

export class SubCategoryService {
  // Get all subcategories
  static async getAll() {
    return prisma.subcategory.findMany({
      include: {
        category: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }

  // Get subcategories by main category
  static async getByCategory(categoryId: number) {
    return prisma.subcategory.findMany({
      where: {
        categoryId,
        isActive: true,
      },
      orderBy: {
        displayOrder: "asc",
      },
    });
  }

  // Get single subcategory
  static async getById(id: number) {
    return prisma.subcategory.findUnique({
      where: {
        id,
      },
      include: {
        category: true,
      },
    });
  }

  // Create subcategory
  static async create(data: any) {
    const categoryId = Number(data.categoryId);

    if (!Number.isInteger(categoryId) || categoryId <= 0) {
      throw new Error("Please select a valid parent category");
    }

    const name = String(data.name || "").trim();
    if (name.length < 2) {
      throw new Error("Subcategory name must contain at least 2 characters");
    }

    // Make sure category exists
    const category = await prisma.category.findUnique({
      where: {
        id: categoryId,
      },
    });

    if (!category) {
      throw new Error("Category not found");
    }

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/\s+/g, "-");

    const existing = await prisma.subcategory.findFirst({
      where: {
        categoryId,
        OR: [{ name }, { slug }],
      },
    });

    if (existing) {
      throw new Error("This subcategory already exists in the selected category");
    }

    return prisma.subcategory.create({
      data: {
        name,
        slug,
        description: data.description || null,
        image: data.image || null,
        displayOrder: Number(data.displayOrder || 0),
        isActive:
          data.isActive === undefined
            ? true
            : data.isActive === true ||
              data.isActive === "true",
        categoryId,
      },
      include: {
        category: true,
      },
    });
  }

  // Update subcategory
  static async update(id: number, data: any) {
    const existing = await prisma.subcategory.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error("Subcategory not found");
    }

    const updateData: any = {};

    if (data.name !== undefined) {
      updateData.name = data.name;

      updateData.slug = data.name
        .toLowerCase()
        .trim()
        .replace(/\s+/g, "-");
    }

    if (data.description !== undefined) {
      updateData.description =
        data.description || null;
    }

    if (data.image !== undefined) {
      updateData.image =
        data.image || null;
    }

    if (data.displayOrder !== undefined) {
      updateData.displayOrder =
        Number(data.displayOrder);
    }

    if (data.isActive !== undefined) {
      updateData.isActive =
        data.isActive === true ||
        data.isActive === "true";
    }

    if (data.categoryId !== undefined) {
      const categoryId = Number(data.categoryId);

      const category = await prisma.category.findUnique({
        where: {
          id: categoryId,
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      updateData.categoryId = categoryId;
    }

    return prisma.subcategory.update({
      where: {
        id,
      },
      data: updateData,
      include: {
        category: true,
      },
    });
  }

  // Delete subcategory
  static async delete(id: number) {
    const existing = await prisma.subcategory.findUnique({
      where: {
        id,
      },
    });

    if (!existing) {
      throw new Error("Subcategory not found");
    }

    return prisma.subcategory.delete({
      where: {
        id,
      },
    });
  }
}
