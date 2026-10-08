import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env";

const prisma = new PrismaClient();

export class FranchiseAuthService {
  static async login(emailOrPhone: string, passwordString: string) {
    const user = await prisma.franchiseUser.findFirst({
      where: {
        OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
      },
    });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    if (!user.isActive) {
      throw new Error("Your franchise account is deactivated.");
    }

    const isMatch = await bcrypt.compare(passwordString, user.password);
    if (!isMatch) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: "franchise", roleTier: user.roleTier },
      process.env.JWT_SECRET as string,
      { expiresIn: "7d" }
    );

    return {
      token,
      user: {
        id: user.id,
        franchiseId: user.franchiseId,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        roleTier: user.roleTier,
        businessName: user.businessName,
        shopName: user.shopName,
      },
    };
  }

  static async requestOtp(email: string) {
    // In a real app, generate OTP and send via email/SMS
    const user = await prisma.franchiseUser.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expires = new Date(Date.now() + 10 * 60000); // 10 mins

    await prisma.franchiseUser.update({
      where: { email },
      data: { otpCode: otp, otpExpiresAt: expires },
    });

    // Mock sending email
    console.log(`[Mock] OTP for ${email} is ${otp}`);
    return { success: true, message: "OTP sent successfully" };
  }

  static async verifyOtpAndResetPassword(email: string, otp: string, newPassword: string) {
    const user = await prisma.franchiseUser.findUnique({ where: { email } });
    if (!user) throw new Error("User not found");

    if (user.otpCode !== otp || !user.otpExpiresAt || user.otpExpiresAt < new Date()) {
      throw new Error("Invalid or expired OTP");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.franchiseUser.update({
      where: { email },
      data: {
        password: hashedPassword,
        otpCode: null,
        otpExpiresAt: null,
      },
    });

    return { success: true, message: "Password updated successfully" };
  }
}
