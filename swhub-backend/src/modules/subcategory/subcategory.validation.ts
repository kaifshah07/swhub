import { z } from "zod";

export const createSubCategorySchema =
  z.object({
    body: z.object({
      name: z
        .string()
        .trim()
        .min(
          2,
          "Subcategory name is required"
        ),

      categoryId: z.coerce
        .number()
        .int()
        .positive(
          "Category is required"
        ),

      description: z
        .string()
        .trim()
        .optional(),

      image: z
        .string()
        .trim()
        .optional(),

      displayOrder: z.coerce
        .number()
        .int()
        .min(0)
        .optional(),

      isActive: z
        .boolean()
        .optional(),
    }),
  });