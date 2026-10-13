import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "../../config/database";
import { sendOtpEmail } from "../../config/brevo";
import { env } from "../../config/env";

function generateOtp() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function generateOtpExpiry() {
  return new Date(Date.now() + 10 * 60 * 1000);
}

function generateToken(customer: {
  id: number;
  email: string;
}) {
  return jwt.sign(
    {
      id: customer.id,
      email: customer.email,
      role: "CUSTOMER",
    },
    env.JWT_SECRET,
    {
      expiresIn: "7d",
    }
  );
}

export class CustomerAuthService {

  // =========================
  // REGISTER
  // =========================

  static async register(data: {
    name: string;
    email: string;
    phone: string;
    password: string;
  }) {

    const email = data.email.toLowerCase().trim();

    const existingEmail =
      await prisma.customer.findUnique({
        where: {
          email,
        },
      });

    if (existingEmail) {

      if (!existingEmail.isVerified) {

        const otp = generateOtp();
        const otpExpiresAt = generateOtpExpiry();

        await prisma.customer.update({
          where: {
            id: existingEmail.id,
          },
          data: {
            otpCode: otp,
            otpExpiresAt,
          },
        });

        await sendOtpEmail(
          existingEmail.email,
          existingEmail.name,
          otp
        );

        return {
          requiresVerification: true,
          customerId: existingEmail.id,
          email: existingEmail.email,
          message: "Verification OTP sent",
        };
      }

      throw new Error("Email already registered");
    }

    const existingPhone =
      await prisma.customer.findUnique({
        where: {
          phone: data.phone,
        },
      });

    if (existingPhone) {
      throw new Error(
        "Phone number already registered"
      );
    }

    const hashedPassword =
      await bcrypt.hash(data.password, 10);

    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiry();

    const customer =
      await prisma.customer.create({
        data: {
          name: data.name,
          email,
          phone: data.phone,
          password: hashedPassword,

          isVerified: false,

          otpCode: otp,
          otpExpiresAt,
        },
      });

    await sendOtpEmail(
      customer.email,
      customer.name,
      otp
    );

    return {
      requiresVerification: true,
      customerId: customer.id,
      email: customer.email,
      message: "Verification OTP sent",
    };
  }

  // =========================
  // VERIFY OTP
  // =========================

  static async verifyOtp(
    identifier: { customerId?: number; email?: string },
    otp: string
  ) {
    const trimmedOtp = (otp || "").trim();

    const normalizedEmail = identifier.email
      ? identifier.email.toLowerCase().trim()
      : undefined;

    let customer = null;

    if (identifier.customerId && !isNaN(Number(identifier.customerId))) {
      customer = await prisma.customer.findUnique({
        where: { id: Number(identifier.customerId) },
      });
    } else if (normalizedEmail) {
      customer = await prisma.customer.findUnique({
        where: { email: normalizedEmail },
      });
    }

    if (!customer && normalizedEmail) {
      customer = await prisma.customer.findUnique({
        where: { email: normalizedEmail },
      });
    }

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.isVerified) {
      throw new Error("Account is already verified");
    }

    if (!customer.otpCode) {
      throw new Error("No OTP found. Please request a new OTP");
    }

    if (!customer.otpExpiresAt || customer.otpExpiresAt < new Date()) {
      throw new Error("OTP has expired. Please request a new OTP");
    }

    if (customer.otpCode !== trimmedOtp) {
      throw new Error("Invalid OTP");
    }

    const updatedCustomer = await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        isVerified: true,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    const token = generateToken({
      id: updatedCustomer.id,
      email: updatedCustomer.email,
    });

    return {
      customer: {
        id: updatedCustomer.id,
        name: updatedCustomer.name,
        email: updatedCustomer.email,
        phone: updatedCustomer.phone,
        isBlocked: updatedCustomer.isBlocked,
        isVerified: updatedCustomer.isVerified,
      },
      token,
    };
  }

  // =========================
  // RESEND OTP
  // =========================

  static async resendOtp(
    identifier: { customerId?: number; email?: string }
  ) {
    const normalizedEmail = identifier.email
      ? identifier.email.toLowerCase().trim()
      : undefined;

    let customer = null;

    if (identifier.customerId && !isNaN(Number(identifier.customerId))) {
      customer = await prisma.customer.findUnique({
        where: { id: Number(identifier.customerId) },
      });
    } else if (normalizedEmail) {
      customer = await prisma.customer.findUnique({
        where: { email: normalizedEmail },
      });
    }

    if (!customer && normalizedEmail) {
      customer = await prisma.customer.findUnique({
        where: { email: normalizedEmail },
      });
    }

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.isVerified) {
      throw new Error("Account is already verified");
    }

    const otp = generateOtp();
    const otpExpiresAt = generateOtpExpiry();

    await prisma.customer.update({
      where: {
        id: customer.id,
      },
      data: {
        otpCode: otp,
        otpExpiresAt,
      },
    });

    await sendOtpEmail(
      customer.email,
      customer.name,
      otp
    );

    return {
      customerId: customer.id,
      email: customer.email,
      message: "New OTP sent",
    };
  }

  // =========================
  // LOGIN
  // =========================

  static async login(
    email: string,
    password: string
  ) {
    const normalizedEmail = (email || "").toLowerCase().trim();

    const customer = await prisma.customer.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!customer) {
      const error: any = new Error("No account found for this email. Please create an account to continue.");
      error.code = "ACCOUNT_NOT_FOUND";
      throw error;
    }

    if (customer.isBlocked) {
      const error: any = new Error("Your account has been blocked");
      error.code = "ACCOUNT_BLOCKED";
      throw error;
    }

    if (!customer.isVerified) {
      const error: any = new Error("Please verify your email before logging in");
      error.code = "UNVERIFIED_ACCOUNT";
      error.customerId = customer.id;
      error.email = customer.email;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(
      password,
      customer.password
    );

    if (!passwordMatch) {
      const error: any = new Error("Invalid email or password");
      error.code = "INVALID_CREDENTIALS";
      throw error;
    }

    const token = generateToken({
      id: customer.id,
      email: customer.email,
    });

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isBlocked: customer.isBlocked,
        isVerified: customer.isVerified,
      },
      token,
    };
  }

  // =========================
  // GOOGLE LOGIN / REGISTER
  // =========================

  static async googleLogin(idToken: string) {
    if (!idToken) {
      throw new Error("Google ID token is required");
    }

    // Call Google's official public tokeninfo endpoint
    const response = await fetch(
      `https://oauth2.googleapis.com/tokeninfo?id_token=${encodeURIComponent(idToken)}`
    );

    if (!response.ok) {
      throw new Error("Invalid or expired Google token");
    }

    const payload = (await response.json()) as {
      iss?: string;
      aud?: string;
      sub?: string;
      email?: string;
      email_verified?: string | boolean;
      name?: string;
      picture?: string;
    };

    // 1. Verify issuer
    const validIssuers = ["accounts.google.com", "https://accounts.google.com"];
    if (!payload.iss || !validIssuers.includes(payload.iss)) {
      throw new Error("Invalid token issuer");
    }

    // 2. Verify audience if configured
    if (env.GOOGLE_CLIENT_ID && payload.aud !== env.GOOGLE_CLIENT_ID) {
      throw new Error("Google token audience mismatch");
    }

    // 3. Verify email is verified by Google
    const isEmailVerified =
      payload.email_verified === "true" || payload.email_verified === true;
    if (!payload.email || !isEmailVerified) {
      throw new Error("Google account email is not verified");
    }

    const email = payload.email.toLowerCase().trim();
    const name = payload.name || email.split("@")[0] || "Google User";
    const googleSub = payload.sub || Date.now().toString();

    // Check if customer already exists
    let customer = await prisma.customer.findUnique({
      where: { email },
    });

    if (customer) {
      if (customer.isBlocked) {
        throw new Error("Your account has been blocked. Please contact support.");
      }

      // If existing account was unverified, mark verified since Google confirmed email ownership
      if (!customer.isVerified) {
        customer = await prisma.customer.update({
          where: { id: customer.id },
          data: { isVerified: true, otpCode: null, otpExpiresAt: null },
        });
      }
    } else {
      // Create new customer account with verified status
      const randomPassword = crypto.randomUUID() + "-" + Date.now();
      const hashedPassword = await bcrypt.hash(randomPassword, 10);
      const placeholderPhone = `g_${googleSub.slice(-8)}_${Math.floor(1000 + Math.random() * 9000)}`;

      customer = await prisma.customer.create({
        data: {
          name,
          email,
          phone: placeholderPhone,
          password: hashedPassword,
          isVerified: true,
          isBlocked: false,
        },
      });
    }

    const token = generateToken({
      id: customer.id,
      email: customer.email,
    });

    return {
      customer: {
        id: customer.id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        isBlocked: customer.isBlocked,
        isVerified: customer.isVerified,
      },
      token,
    };
  }

  // =========================
  // PROFILE
  // =========================

  static async getProfile(id: number) {

    const customer =
      await prisma.customer.findUnique({
        where: {
          id,
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          isBlocked: true,
          isVerified: true,
          createdAt: true,
        },
      });

    if (!customer) {
      throw new Error(
        "Customer not found"
      );
    }

    return customer;
  }
}
