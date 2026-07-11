import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { susTermEasyQuestions } from "./susterm-easy";
import { susTermDifficultQuestions } from "./susterm-difficult";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
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
