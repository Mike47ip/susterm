import { prisma } from "@/lib/prisma";

type Row = {
  userId: string;
  name: string;
  attempts: number;
  totalScore: number;
  totalQuestions: number;
  bestPercent: number;
};

export default async function LeaderboardPage() {
  const attempts = await prisma.attempt.findMany({
    where: { userId: { not: null } },
    include: { user: { select: { name: true } } },
  });

  const byUser = new Map<string, Row>();
  for (const a of attempts) {
    if (!a.userId || !a.user) continue;
    const percent = a.total > 0 ? (a.score / a.total) * 100 : 0;
    const existing = byUser.get(a.userId);
    if (existing) {
      existing.attempts += 1;
      existing.totalScore += a.score;
      existing.totalQuestions += a.total;
      existing.bestPercent = Math.max(existing.bestPercent, percent);
    } else {
      byUser.set(a.userId, {
        userId: a.userId,
        name: a.user.name,
        attempts: 1,
        totalScore: a.score,
        totalQuestions: a.total,
        bestPercent: percent,
      });
    }
  }

  const rows = Array.from(byUser.values())
    .map((r) => ({
      ...r,
      avgPercent: r.totalQuestions > 0 ? (r.totalScore / r.totalQuestions) * 100 : 0,
    }))
    .sort((a, b) => b.avgPercent - a.avgPercent || b.attempts - a.attempts);

  return (
    <div className="mx-auto max-w-3xl px-6 py-12">
      <p className="tabnum text-sm text-accent">Rankings</p>
      <h1 className="mt-1 text-3xl font-semibold text-foreground">Leaderboard</h1>
      <p className="mt-2 max-w-xl text-muted">
        Ranked by average score across every set you&apos;ve taken.{" "}
        <a href="/login" className="text-accent underline underline-offset-2">
          Log in
        </a>{" "}
        before taking a quiz to show up here.
      </p>

      {rows.length === 0 ? (
        <p className="mt-10 text-sm text-muted">
          No ranked attempts yet — be the first to log in and take a quiz.
        </p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">#</th>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Avg score</th>
                <th className="px-4 py-3 font-medium">Best score</th>
                <th className="px-4 py-3 font-medium">Attempts</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r, i) => (
                <tr key={r.userId} className="border-b border-line last:border-0">
                  <td className="tabnum px-4 py-3 text-muted">{i + 1}</td>
                  <td className="px-4 py-3 font-medium text-foreground">{r.name}</td>
                  <td className="tabnum px-4 py-3 text-foreground">{Math.round(r.avgPercent)}%</td>
                  <td className="tabnum px-4 py-3 text-muted">{Math.round(r.bestPercent)}%</td>
                  <td className="tabnum px-4 py-3 text-muted">{r.attempts}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
