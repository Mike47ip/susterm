import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { susTermQuestions } from "./susterm-questions";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log("Clearing existing questions (and their attempts/answers)...");
  // Answer rows cascade-delete automatically via the schema's onDelete: Cascade,
  // and Attempt rows are cleared too since they'd otherwise reference deleted questions.
  await prisma.answer.deleteMany();
  await prisma.attempt.deleteMany();
  await prisma.question.deleteMany();

  console.log("Seeding database...");
  for (const q of susTermQuestions) {
    await prisma.question.create({ data: q });
  }
  console.log(`Seeded ${susTermQuestions.length} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
