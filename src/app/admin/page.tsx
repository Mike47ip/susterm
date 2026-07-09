import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteQuestionButton from "@/components/DeleteQuestionButton";

export default async function AdminPage() {
  const [questions, attempts] = await Promise.all([
    prisma.question.findMany({ orderBy: { createdAt: "desc" } }),
    prisma.attempt.findMany({ orderBy: { createdAt: "desc" }, take: 10 }),
  ]);

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="tabnum text-sm text-accent">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">Questions</h1>
        </div>
        <Link
          href="/admin/questions/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
        >
          + New question
        </Link>
      </div>

      {questions.length === 0 ? (
        <p className="mt-8 text-sm text-muted">
          No questions yet. Add one to get the quiz started.
        </p>
      ) : (
        <ul className="mt-8 flex flex-col gap-3">
          {questions.map((q, i) => (
            <li
              key={q.id}
              className="rounded-lg border border-line bg-surface p-4"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-sm text-foreground">
                    <span className="tabnum text-muted">Q{i + 1}.</span> {q.text}
                  </p>
                  <p className="tabnum mt-1 text-xs text-muted">
                    Correct: {q.correctOption}
                  </p>
                </div>
                <div className="flex shrink-0 gap-4">
                  <Link
                    href={`/admin/questions/${q.id}/edit`}
                    className="text-sm font-medium text-accent hover:opacity-80"
                  >
                    Edit
                  </Link>
                  <DeleteQuestionButton id={q.id} />
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-14">
        <h2 className="text-xl font-semibold text-foreground">Recent attempts</h2>
        {attempts.length === 0 ? (
          <p className="mt-3 text-sm text-muted">No one has taken the quiz yet.</p>
        ) : (
          <div className="mt-4 overflow-hidden rounded-lg border border-line bg-surface">
            <table className="w-full text-left text-sm">
              <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
                <tr>
                  <th className="px-4 py-3 font-medium">Taker</th>
                  <th className="px-4 py-3 font-medium">Score</th>
                  <th className="px-4 py-3 font-medium">Date</th>
                  <th className="px-4 py-3 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {attempts.map((a) => (
                  <tr key={a.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 text-foreground">{a.takerName || "Anonymous"}</td>
                    <td className="tabnum px-4 py-3 text-foreground">
                      {a.score}/{a.total}
                    </td>
                    <td className="tabnum px-4 py-3 text-muted">
                      {a.createdAt.toLocaleString()}
                    </td>
                    <td className="px-4 py-3">
                      <Link
                        href={`/quiz/result/${a.id}`}
                        className="font-medium text-accent hover:opacity-80"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
