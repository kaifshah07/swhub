import { z } from "zod";

export const registerCustomerSchema = z.object({
  body: z.object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters"),

    email: z
      .string()
      .trim()
      .email("Invalid email"),

    phone: z
      .string()
      .trim()
      .length(10, "Phone number must be 10 digits"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),
});

export const loginCustomerSchema = z.object({
  body: z.object({
    email: z
      .string()
      .trim()
      .email("Invalid email"),

    password: z
      .string()
      .min(6, "Password must be at least 6 characters"),
  }),
});

export const verifyOtpSchema = z.object({
  body: z.object({
    customerId: z.coerce.number().int().positive(),

    otp: z
      .string()
      .trim()
      .length(6, "OTP must be 6 digits"),
  }),
});

export const resendOtpSchema = z.object({
  body: z.object({
    customerId: z.coerce.number().int().positive(),
  }),
});