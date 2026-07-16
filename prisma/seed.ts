import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";
import { susTermEasyQuestions } from "./susterm-easy";
import { susTermDifficultQuestions } from "./susterm-difficult";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function seedSuperAdmin() {
  const email = process.env.SUPER_ADMIN_EMAIL;
  const password = process.env.SUPER_ADMIN_PASSWORD;
  const name = process.env.SUPER_ADMIN_NAME || "Admin";

  if (!email || !password) {
    console.log(
      "Skipping super admin setup — SUPER_ADMIN_EMAIL / SUPER_ADMIN_PASSWORD not set in .env."
    );
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);

  await prisma.user.upsert({
    where: { email: email.toLowerCase() },
    update: { passwordHash, role: "SUPER_ADMIN", name },
    create: {
      email: email.toLowerCase(),
      passwordHash,
      role: "SUPER_ADMIN",
      name,
    },
  });

  console.log(`Super admin ready: ${email}`);
}

async function main() {
  await seedSuperAdmin();

  console.log("Clearing existing questions (and their attempts/answers)...");
  await prisma.answer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();

  console.log("Seeding easy set...");
  for (const q of susTermEasyQuestions) {
    await prisma.question.create({ data: q });
  }

  console.log("Seeding difficult set...");
  for (const q of susTermDifficultQuestions) {
    await prisma.question.create({ data: q });
  }

  const total = susTermEasyQuestions.length + susTermDifficultQuestions.length;
  console.log(
    `Seeded ${total} questions (${susTermEasyQuestions.length} easy, ${susTermDifficultQuestions.length} difficult).`
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
