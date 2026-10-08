import { prisma } from "../../config/database";
import { comparePassword } from "../../utils/password";
import { generateToken } from "../../config/jwt";

export class AdminService {
  static async login(username: string, password: string) {
    const admin = await prisma.admin.findUnique({
      where: { username },
    });

    if (!admin) {
      throw new Error("Invalid username or password");
    }

    if (!admin.isActive) {
      throw new Error("Admin account is inactive");
    }

    const isPasswordValid = await comparePassword(
      password,
      admin.password
    );

    if (!isPasswordValid) {
      throw new Error("Invalid username or password");
    }

    await prisma.admin.update({
      where: { id: admin.id },
      data: {
        lastLogin: new Date(),
      },
    });

    const token = generateToken({
      id: admin.id,
      username: admin.username,
      role: admin.role,
    });

    return {
      success: true,
      message: "Login successful",
      token,
      admin: {
        id: admin.id,
        username: admin.username,
        fullName: admin.fullName,
        email: admin.email,
        role: admin.role,
      },
    };
  }
}