import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const password = "Admin@123";

  const hashedPassword = await bcrypt.hash(password, 10);

  const admin = await prisma.admin.create({
    data: {
      username: "admin",
      password: hashedPassword,
      fullName: "Balmitra Admin",
      email: "admin@balmitra.com",
      role: "SUPER_ADMIN",
      isActive: true,
    },
  });

  console.log("✅ Admin created successfully");
  console.log("Username:", admin.username);
  console.log("Email:", admin.email);
  console.log("Password: Admin@123");
}

main()
  .catch((error) => {
    console.error("❌ Failed to create admin:", error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });