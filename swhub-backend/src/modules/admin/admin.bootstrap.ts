import { AdminRole } from "@prisma/client";
import { env } from "../../config/env";
import { prisma } from "../../config/database";
import { hashPassword } from "../../utils/password";

export async function ensureInitialAdmin() {
  const { INITIAL_ADMIN_USERNAME, INITIAL_ADMIN_PASSWORD, INITIAL_ADMIN_EMAIL } = env;

  if (!INITIAL_ADMIN_USERNAME && !INITIAL_ADMIN_PASSWORD && !INITIAL_ADMIN_EMAIL) return;

  if (!INITIAL_ADMIN_USERNAME || !INITIAL_ADMIN_PASSWORD || !INITIAL_ADMIN_EMAIL) {
    throw new Error("INITIAL_ADMIN_USERNAME, INITIAL_ADMIN_PASSWORD, and INITIAL_ADMIN_EMAIL must all be set");
  }

  const existingAdmin = await prisma.admin.findUnique({
    where: { username: INITIAL_ADMIN_USERNAME },
  });

  if (existingAdmin) return;

  await prisma.admin.create({
    data: {
      username: INITIAL_ADMIN_USERNAME,
      password: await hashPassword(INITIAL_ADMIN_PASSWORD),
      fullName: "Initial Administrator",
      email: INITIAL_ADMIN_EMAIL.toLowerCase().trim(),
      role: AdminRole.SUPER_ADMIN,
      isActive: true,
    },
  });

  console.log("Initial administrator created.");
}
