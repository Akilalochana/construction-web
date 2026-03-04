import dotenv from "dotenv";
dotenv.config();

import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import pkg from "pg";
const { Pool } = pkg;
import bcrypt from "bcryptjs";

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL environment variable is not set!");
  process.exit(1);
}

console.log("DATABASE_URL is set, creating pool...");
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

const email = process.argv[2];
const password = process.argv[3];
const name = process.argv[4] ?? "Administrator";

if (!email || !password) {
  console.error("Usage: node prisma/seed-admin.mjs <email> <password> [name]");
  process.exit(1);
}

async function main() {
  const hashedPassword = await bcrypt.hash(password, 12);

  const admin = await prisma.admin.upsert({
    where: { email: email.toLowerCase() },
    update: {
      name,
      password: hashedPassword,
      isActive: true,
    },
    create: {
      email: email.toLowerCase(),
      name,
      password: hashedPassword,
      isActive: true,
    },
  });

  console.log(`Admin ready: ${admin.email}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
