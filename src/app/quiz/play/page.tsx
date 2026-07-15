import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSessionUser } from "@/lib/auth";
import QuizRunner from "@/components/QuizRunner";

const VALID_LEVELS = ["EASY", "DIFFICULT"] as const;

export default async function QuizPlayPage({
  searchParams,
}: {
  searchParams: Promise<{ level?: string; batch?: string }>;
}) {
  const params = await searchParams;
  const level = params.level?.toUpperCase();
  const batch = Number(params.batch);

  if (!level || !VALID_LEVELS.includes(level as (typeof VALID_LEVELS)[number]) || !batch || batch < 1) {
    notFound();
  }

  const [questions, sessionUser] = await Promise.all([
    prisma.question.findMany({
      where: { level: level as "EASY" | "DIFFICULT", batch },
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
    }),
    getSessionUser(),
  ]);

  if (questions.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-6 py-16 text-center">
        <h1 className="text-2xl font-semibold text-foreground">Set not found</h1>
        <p className="mt-2 text-muted">
          That question set doesn&apos;t have any questions yet.
        </p>
        <Link
          href="/quiz"
          className="mt-6 inline-block rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90"
        >
          Back to sets
        </Link>
      </div>
    );
  }

  return <QuizRunner questions={questions} loggedInName={sessionUser?.name} />;
}
