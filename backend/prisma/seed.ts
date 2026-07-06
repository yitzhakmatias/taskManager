import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
const bcrypt = require("bcrypt");

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter } as any);

async function main() {
  // Create default role
  const role = await prisma.role.upsert({
    where: { name: "user" },
    update: {},
    create: { name: "user" },
  });

  const hash = (pwd: string) => bcrypt.hash(pwd, 10);

  // user1
  const user1 = await prisma.user.upsert({
    where: { email: "user1@test.com" },
    update: {},
    create: {
      name: "User One",
      email: "user1@test.com",
      password: await hash("password1"),
      roleId: role.id,
    },
  });

  // user2
  const user2 = await prisma.user.upsert({
    where: { email: "user2@test.com" },
    update: {},
    create: {
      name: "User Two",
      email: "user2@test.com",
      password: await hash("password2"),
      roleId: role.id,
    },
  });

  // Sample tasks for each user
  await prisma.task.createMany({
    data: [
      { text: "Tarea de user1 - estudiar React", completed: false, userId: user1.id },
      { text: "Tarea de user1 - revisar JWT", completed: true,  userId: user1.id },
      { text: "Tarea de user2 - leer sobre Prisma", completed: false, userId: user2.id },
      { text: "Tarea de user2 - deploy en Vercel", completed: false, userId: user2.id },
    ],
    skipDuplicates: true,
  });

  console.log("Seed completado:");
  console.log("  user1@test.com / password1");
  console.log("  user2@test.com / password2");
}

main()
  .catch((e) => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());
