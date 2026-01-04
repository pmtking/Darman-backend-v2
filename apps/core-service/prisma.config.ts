// prisma.config.ts
import "dotenv/config";
import { defineConfig } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
    // اضافه کردن این بخش برای اجرای Seed
    seed: "npx tsx prisma/seed.ts", 
  },
  datasource: {
    url: process.env["DATABASE_URL"],
  },
});