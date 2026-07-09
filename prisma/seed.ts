import "dotenv/config";
import { PrismaClient, Option } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const questions: {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: Option;
}[] = [
  {
    text: "What does HTML stand for?",
    optionA: "Hyper Trainer Marking Language",
    optionB: "Hyper Text Markup Language",
    optionC: "Hyper Text Marketing Language",
    optionD: "Hyper Text Markup Leveling",
    correctOption: "B",
  },
  {
    text: "Which company created the Next.js framework?",
    optionA: "Meta",
    optionB: "Google",
    optionC: "Vercel",
    optionD: "Netlify",
    correctOption: "C",
  },
  {
    text: "In JavaScript, which keyword declares a block-scoped variable?",
    optionA: "var",
    optionB: "let",
    optionC: "def",
    optionD: "static",
    correctOption: "B",
  },
  {
    text: "What does ORM stand for, as in what Prisma provides?",
    optionA: "Object Relational Mapping",
    optionB: "Ordered Record Model",
    optionC: "Object Runtime Manager",
    optionD: "Online Resource Mapping",
    correctOption: "A",
  },
  {
    text: "Which CSS utility framework uses classes like `flex` and `px-4`?",
    optionA: "Bootstrap",
    optionB: "Bulma",
    optionC: "Tailwind CSS",
    optionD: "Foundation",
    correctOption: "C",
  },
];

async function main() {
  console.log("Seeding database...");
  for (const q of questions) {
    await prisma.question.create({ data: q });
  }
  console.log(`Seeded ${questions.length} questions.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
