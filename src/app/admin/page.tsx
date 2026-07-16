// FILE LOCATION: src/app/admin/page.tsx

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import StatCard from "@/components/StatCard";
import QuestionGroups from "@/components/QuestionGroups";

export default async function AdminPage() {
  const [questions, attemptCount, userCount, easyCount, difficultCount, recentAttempts] =
    await Promise.all([
      prisma.question.findMany({
        select: { id: true, text: true, correctOption: true, level: true, batch: true },
        orderBy: [{ level: "asc" }, { batch: "asc" }, { createdAt: "asc" }],
      }),
      prisma.attempt.count(),
      prisma.user.count(),
      prisma.question.count({ where: { level: "EASY" } }),
      prisma.question.count({ where: { level: "DIFFICULT" } }),
      prisma.attempt.findMany({ orderBy: { createdAt: "desc" }, take: 8 }),
    ]);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-foreground">Questions</h2>
        <Link
          href="/admin/questions/new"
          className="rounded-md bg-accent px-4 py-2 text-sm font-medium text-accent-ink hover:opacity-90"
        >
          + New question
        </Link>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Total questions" value={questions.length} accent />
        <StatCard label="Easy" value={easyCount} />
        <StatCard label="Difficult" value={difficultCount} />
        <StatCard label="Total attempts" value={attemptCount} />
      </div>

      <div className="mt-8">
        {questions.length === 0 ? (
          <p className="text-sm text-muted">No questions yet. Add one to get the quiz started.</p>
        ) : (
          <QuestionGroups questions={questions} />
        )}
      </div>

      <div className="mt-14">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-foreground">Recent attempts</h2>
          <span className="tabnum text-xs text-muted">{userCount} registered users</span>
        </div>
        {recentAttempts.length === 0 ? (
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
                {recentAttempts.map((a) => (
                  <tr key={a.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 text-foreground">{a.takerName || "Anonymous"}</td>
                    <td className="tabnum px-4 py-3 text-foreground">
                      {a.score}/{a.total}
                    </td>
                    <td className="tabnum px-4 py-3 text-muted">{a.createdAt.toLocaleString()}</td>
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