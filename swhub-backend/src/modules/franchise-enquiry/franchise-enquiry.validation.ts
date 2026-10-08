import { z } from "zod";

export const createFranchiseEnquirySchema = z.object({
  body: z.object({
    fullName: z
      .string()
      .trim()
      .min(2, "Full name is required"),

    mobile: z
      .string()
      .trim()
      .regex(/^[6-9]\d{9}$/, "Invalid Indian mobile number"),

    email: z
      .string()
      .trim()
      .email("Invalid email address"),

    city: z
      .string()
      .trim()
      .min(2, "City is required"),

    state: z
      .string()
      .trim()
      .min(2, "State is required"),

    ownsBusiness: z.boolean(),

    currentBusinessName: z
      .string()
      .trim()
      .optional(),

    currentBusinessType: z
      .string()
      .trim()
      .optional(),

    businessExperience: z
      .string()
      .trim()
      .optional(),

    preferredLocation: z
      .string()
      .trim()
      .min(2, "Preferred location is required"),

    preferredCity: z
      .string()
      .trim()
      .min(2, "Preferred city is required"),

    preferredArea: z
      .string()
      .trim()
      .optional(),

    investmentCapacity: z
      .string()
      .trim()
      .min(1, "Investment capacity is required"),

    storeType: z
      .string()
      .trim()
      .min(1, "Store type is required"),

    startTimeline: z
      .string()
      .trim()
      .min(1, "Start timeline is required"),

    message: z
      .string()
      .trim()
      .optional(),
  }),
});