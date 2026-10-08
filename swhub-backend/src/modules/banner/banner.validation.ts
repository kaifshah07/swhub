import { z } from "zod";

export const createBannerSchema = z.object({
  title: z.string().min(2),
  subtitle: z.string().optional(),
  redirectUrl: z.string().optional(),
  displayOrder: z.number().optional(),
});

export const updateBannerSchema =
  createBannerSchema.partial();