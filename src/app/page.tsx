import Link from "next/link";
import { prisma } from "@/lib/prisma";

export default async function Home() {
  const [questionCount, attemptCount] = await Promise.all([
    prisma.question.count(),
    prisma.attempt.count(),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-16">
      <p className="tabnum text-sm text-accent mb-3">01 / setup · 02 / quiz · 03 / results</p>
      <h1 className="text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
        Build a quiz. Take it. See the score.
      </h1>
      <p className="mt-4 max-w-xl text-muted">
        Add multiple-choice questions with options A–D in the admin panel, then
        send the link to anyone. Every attempt is scored and saved automatically.
      </p>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/quiz"
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90 transition-opacity"
        >
          Take the quiz
        </Link>
        <Link
          href="/admin"
          className="rounded-md border border-line bg-surface px-5 py-2.5 text-sm font-medium text-foreground hover:border-accent transition-colors"
        >
          Manage questions
        </Link>
      </div>

      <dl className="mt-12 grid grid-cols-2 gap-4 sm:w-96">
        <div className="rounded-lg border border-line bg-surface p-4">
          <dt className="text-xs uppercase tracking-wide text-muted">Questions</dt>
          <dd className="tabnum mt-1 text-2xl font-semibold text-foreground">
            {questionCount}
          </dd>
        </div>
        <div className="rounded-lg border border-line bg-surface p-4">
          <dt className="text-xs uppercase tracking-wide text-muted">Attempts</dt>
          <dd className="tabnum mt-1 text-2xl font-semibold text-foreground">
            {attemptCount}
          </dd>
        </div>
      </dl>

      {questionCount === 0 && (
        <p className="mt-8 text-sm text-muted">
          No questions yet.{" "}
          <Link href="/admin/questions/new" className="text-accent underline underline-offset-2">
            Add your first question
          </Link>{" "}
          to get started.
        </p>
      )}
    </div>
  );
}
