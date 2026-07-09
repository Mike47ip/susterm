import Link from "next/link";
import { prisma } from "@/lib/prisma";
import QuizRunner from "@/components/QuizRunner";

export default async function QuizPage() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      text: true,
      optionA: true,
      optionB: true,
      optionC: true,
      optionD: true,
      // correctOption intentionally omitted — never sent to the client
    },
  });

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">No questions yet</h1>
        <p className="mt-2 text-muted">
          Add some questions in the admin panel before taking the quiz.
        </p>
        <Link
          href="/admin/questions/new"
          className="mt-6 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90"
        >
          Add a question
        </Link>
      </div>
    );
  }

  return <QuizRunner questions={questions} />;
}
