import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import path from "path";

// Ensure .env is explicitly loaded from backend directory
dotenv.config({ path: path.resolve(__dirname, "../../.env") });
dotenv.config(); // fallback

const dbUrl = process.env.DATABASE_URL || process.env.DIRECT_URL;

export const prisma = new PrismaClient({
  log: ["warn", "error"],
  datasources: dbUrl ? { db: { url: dbUrl } } : undefined,
});

export const connectDatabase = async (retries = 3, delayMs = 2000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      await prisma.$connect();
      console.log("✅ PostgreSQL Database Connected Successfully");
      return;
    } catch (error: any) {
      console.warn(`⚠️ Database connection attempt ${attempt}/${retries} failed: ${error.message}`);
      if (attempt < retries) {
        await new Promise((r) => setTimeout(r, delayMs));
      } else {
        console.error("❌ Database Connection Failed after retries");
        console.error(error);
        process.exit(1);
      }
    }
  }
};