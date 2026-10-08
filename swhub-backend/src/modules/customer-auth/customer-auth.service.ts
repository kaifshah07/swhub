import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
    customerId: number,
    otp: string
  ) {

    const customer =
      await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.isVerified) {
      throw new Error(
        "Account is already verified"
      );
    }

    if (!customer.otpCode) {
      throw new Error(
        "No OTP found. Please request a new OTP"
      );
    }

    if (
      !customer.otpExpiresAt ||
      customer.otpExpiresAt < new Date()
    ) {
      throw new Error(
        "OTP has expired. Please request a new OTP"
      );
    }

    if (customer.otpCode !== otp) {
      throw new Error("Invalid OTP");
    }

    const updatedCustomer =
      await prisma.customer.update({
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
    customerId: number
  ) {

    const customer =
      await prisma.customer.findUnique({
        where: {
          id: customerId,
        },
      });

    if (!customer) {
      throw new Error("Customer not found");
    }

    if (customer.isVerified) {
      throw new Error(
        "Account is already verified"
      );
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

    const customer =
      await prisma.customer.findUnique({
        where: {
          email: email.toLowerCase().trim(),
        },
      });

    if (!customer) {
      throw new Error(
        "Invalid email or password"
      );
    }

    if (customer.isBlocked) {
      throw new Error(
        "Your account has been blocked"
      );
    }

    if (!customer.isVerified) {
      throw new Error(
        "Please verify your email before logging in"
      );
    }

    const passwordMatch =
      await bcrypt.compare(
        password,
        customer.password
      );

    if (!passwordMatch) {
      throw new Error(
        "Invalid email or password"
      );
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
