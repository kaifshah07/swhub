import { z } from "zod";

export const createProductSchema = z.object({

  name: z.string().min(2),

  shortDescription: z.string().optional(),

  description: z.string().optional(),

  brand: z.string().optional(),

  ageGroup: z.string().optional(),

  price: z.number().positive(),

  discountPrice: z.number().optional(),

  stock: z.number().int().nonnegative(),

  categoryId: z.number(),

  thumbnail: z.string().optional(),

  isFeatured: z.boolean().optional(),

  isTrending: z.boolean().optional(),

  isNewArrival: z.boolean().optional(),

  metaTitle: z.string().optional(),

  metaDescription: z.string().optional()

});

export const updateProductSchema = createProductSchema.partial();   