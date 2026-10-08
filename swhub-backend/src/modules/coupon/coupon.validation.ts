import { z } from "zod";

export const couponSchema = z.object({

  code: z.string().min(3),

  description: z.string().optional(),

  discountType: z.enum([
    "PERCENTAGE",
    "FIXED",
  ]),

  discountValue: z.number().positive(),

  minOrderAmount: z.number().optional(),

  maxDiscount: z.number().optional(),

  usageLimit: z.number().optional(),

  expiresAt: z.string().optional(),

});