import { z } from "zod";

export const createVendorEnquirySchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Name must be at least 2 characters"),

  mobile: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

  email: z
    .string()
    .trim()
    .email("Invalid email")
    .optional()
    .or(z.literal("")),

  city: z
    .string()
    .trim()
    .min(2, "City is required"),

  state: z
    .string()
    .trim()
    .min(2, "State is required"),

  currentBusiness: z
    .string()
    .trim()
    .optional(),

  investmentCapacity: z
    .string()
    .trim()
    .optional(),

  preferredLocation: z
    .string()
    .trim()
    .optional(),

  message: z
    .string()
    .trim()
    .optional(),
});