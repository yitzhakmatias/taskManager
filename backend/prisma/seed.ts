import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Create default role if it doesn't exist
  const role = await prisma.role.upsert({
    where: { name: "admin" },
    update: {},
    create: { name: "admin" },
  });

  // Hash the password with bcrypt (10 salt rounds)
  const hashedPassword = await bcrypt.hash("123456", 10);

  // Create test user if it doesn't exist
  const user = await prisma.user.upsert({
    where: { email: "admin@test.com" },
    update: {},
    create: {
      name: "Admin User",
      email: "admin@test.com",
      password: hashedPassword,
      roleId: role.id,
    },
  });

  console.log("Seed completed:");
  console.log("  Role:", role.name);
  console.log("  User:", user.email, "(password hashed with bcrypt)");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
