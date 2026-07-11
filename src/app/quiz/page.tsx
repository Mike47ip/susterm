import Link from "next/link";
import { prisma } from "@/lib/prisma";

const BATCH_SIZE_LABEL = "~15 questions";

export default async function QuizSelectPage() {
  const questions = await prisma.question.findMany({
    select: { level: true, batch: true },
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

  const groups: Record<"EASY" | "DIFFICULT", Record<number, number>> = {
    EASY: {},
    DIFFICULT: {},
  };
  for (const q of questions) {
    const level = q.level as "EASY" | "DIFFICULT";
    groups[level][q.batch] = (groups[level][q.batch] ?? 0) + 1;
  }

  const sections: { level: "EASY" | "DIFFICULT"; label: string; blurb: string }[] = [
    {
      level: "EASY",
      label: "Easy",
      blurb: "Foundational terms — a good place to start.",
    },
    {
      level: "DIFFICULT",
      label: "Difficult",
      blurb: "Denser, more technical terms — once the basics feel solid.",
    },
  ];

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="tabnum text-sm text-accent">Choose a set</p>
      <h1 className="mt-1 text-3xl font-semibold text-foreground">Pick a difficulty and a set</h1>
      <p className="mt-2 max-w-xl text-muted">
        Each set is broken into short batches ({BATCH_SIZE_LABEL}) instead of one long
        run, so you can fit a round in whenever you&apos;ve got a few minutes.
      </p>

      <div className="mt-10 flex flex-col gap-10">
        {sections.map((section) => {
          const batches = Object.entries(groups[section.level])
            .map(([batch, count]) => ({ batch: Number(batch), count }))
            .sort((a, b) => a.batch - b.batch);

          if (batches.length === 0) return null;

          return (
            <div key={section.level}>
              <div className="flex items-baseline gap-3">
                <h2 className="text-lg font-semibold text-foreground">{section.label}</h2>
                <span className="text-sm text-muted">{section.blurb}</span>
              </div>
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
                {batches.map(({ batch, count }) => (
                  <Link
                    key={batch}
                    href={`/quiz/play?level=${section.level}&batch=${batch}`}
                    className="rounded-lg border border-line bg-surface px-4 py-4 text-center transition-colors hover:border-accent"
                  >
                    <span className="block text-sm font-semibold text-foreground">
                      Set {batch}
                    </span>
                    <span className="tabnum mt-1 block text-xs text-muted">
                      {count} question{count === 1 ? "" : "s"}
                    </span>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
