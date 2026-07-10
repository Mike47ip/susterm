import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ScoreReveal from "@/components/ScoreReveal";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;

export default async function ResultPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const attempt = await prisma.attempt.findUnique({
    where: { id },
    include: {
      answers: {
        include: { question: true },
      },
    },
  });

  if (!attempt) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="tabnum text-sm text-accent">Result</p>
      <h1 className="mt-2 text-3xl font-semibold text-foreground">
        {attempt.takerName ? `Nice work, ${attempt.takerName}.` : "Quiz complete."}
      </h1>

      <div className="mt-6">
        <ScoreReveal score={attempt.score} total={attempt.total} />
      </div>

      <div className="mt-10 flex flex-col gap-4">
        {attempt.answers.map((a, i) => (
          <div
            key={a.id}
            className={`question-enter rounded-lg border p-4 ${
              a.isCorrect ? "border-correct/30 bg-correct/5" : "border-incorrect/30 bg-incorrect/5"
            }`}
            style={{ animationDelay: `${i * 60}ms`, animationFillMode: "backwards" }}
          >
            <p className="text-sm text-muted">
              <span className="tabnum">Q{i + 1}.</span> {a.question.text}
            </p>
            <div className="mt-3 flex flex-col gap-1.5 text-sm">
              {OPTION_KEYS.map((key) => {
                const label = a.question[`option${key}` as `option${typeof key}`];
                const isYourPick = a.selected === key;
                const isCorrectOpt = a.question.correctOption === key;
                return (
                  <div
                    key={key}
                    className={`flex items-center gap-2 rounded px-2 py-1 ${
                      isCorrectOpt
                        ? "font-medium text-correct"
                        : isYourPick
                        ? "text-incorrect"
                        : "text-muted"
                    }`}
                  >
                    <span className="tabnum text-xs">{key}</span>
                    <span>{label}</span>
                    {isYourPick && <span className="ml-auto text-xs">your answer</span>}
                    {isCorrectOpt && !isYourPick && (
                      <span className="ml-auto text-xs">correct</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="mt-10 flex gap-3">
        <Link
          href="/quiz"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90"
        >
          Retake quiz
        </Link>
        <Link
          href="/"
          className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-foreground hover:border-accent"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
