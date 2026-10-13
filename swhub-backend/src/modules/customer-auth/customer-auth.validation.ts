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
  body: z
    .object({
      customerId: z.coerce.number().int().positive().optional(),
      email: z.string().trim().email("Invalid email format").optional(),
      otp: z
        .string()
        .trim()
        .length(6, "OTP must be 6 digits"),
    })
    .refine((data) => data.customerId !== undefined || (data.email !== undefined && data.email.length > 0), {
      message: "Customer ID or email is required",
      path: ["customerId"],
    }),
});

export const resendOtpSchema = z.object({
  body: z
    .object({
      customerId: z.coerce.number().int().positive().optional(),
      email: z.string().trim().email("Invalid email format").optional(),
    })
    .refine((data) => data.customerId !== undefined || (data.email !== undefined && data.email.length > 0), {
      message: "Customer ID or email is required",
      path: ["customerId"],
    }),
});

export const googleAuthSchema = z.object({
  body: z.object({
    idToken: z.string().trim().min(1, "Google ID token is required"),
  }),
});