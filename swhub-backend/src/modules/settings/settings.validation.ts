import { z } from "zod";

export const settingsSchema = z.object({

  websiteName: z.string().optional(),

  logo: z.string().optional(),

  favicon: z.string().optional(),

  email: z.string().email().optional(),

  phone: z.string().optional(),

  address: z.string().optional(),

  facebook: z.string().optional(),

  instagram: z.string().optional(),

  youtube: z.string().optional(),

  linkedin: z.string().optional(),

  footerText: z.string().optional(),

  seoTitle: z.string().optional(),

  seoDescription: z.string().optional(),

  smtpHost: z.string().optional(),

  smtpPort: z.number().optional(),

  smtpUser: z.string().optional(),

  smtpPassword: z.string().optional(),

});