import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireSuperAdmin } from "@/lib/auth";

export default async function AdminUsersPage() {
  await requireSuperAdmin();

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      attempts: { select: { score: true, total: true, createdAt: true } },
    },
  });

  return (
    <div className="mx-auto max-w-4xl px-6 py-12">
      <div className="flex items-center justify-between">
        <div>
          <p className="tabnum text-sm text-accent">Admin</p>
          <h1 className="mt-1 text-3xl font-semibold text-foreground">Users</h1>
        </div>
        <Link
          href="/admin"
          className="rounded-md border border-line px-4 py-2 text-sm font-medium text-foreground hover:border-accent"
        >
          Back to questions
        </Link>
      </div>

      {users.length === 0 ? (
        <p className="mt-8 text-sm text-muted">No one has signed up yet.</p>
      ) : (
        <div className="mt-8 overflow-hidden rounded-lg border border-line bg-surface">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-line text-xs uppercase tracking-wide text-muted">
              <tr>
                <th className="px-4 py-3 font-medium">Name</th>
                <th className="px-4 py-3 font-medium">Email</th>
                <th className="px-4 py-3 font-medium">Role</th>
                <th className="px-4 py-3 font-medium">Attempts</th>
                <th className="px-4 py-3 font-medium">Avg score</th>
                <th className="px-4 py-3 font-medium">Joined</th>
              </tr>
            </thead>
            <tbody>
              {users.map((u) => {
                const totalScore = u.attempts.reduce((sum, a) => sum + a.score, 0);
                const totalQuestions = u.attempts.reduce((sum, a) => sum + a.total, 0);
                const avgPercent = totalQuestions > 0 ? Math.round((totalScore / totalQuestions) * 100) : null;
                return (
                  <tr key={u.id} className="border-b border-line last:border-0">
                    <td className="px-4 py-3 font-medium text-foreground">{u.name}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`rounded px-1.5 py-0.5 text-xs ${
                          u.role === "SUPER_ADMIN"
                            ? "bg-accent/10 text-accent"
                            : "bg-line text-muted"
                        }`}
                      >
                        {u.role === "SUPER_ADMIN" ? "Super Admin" : "User"}
                      </span>
                    </td>
                    <td className="tabnum px-4 py-3 text-foreground">{u.attempts.length}</td>
                    <td className="tabnum px-4 py-3 text-foreground">
                      {avgPercent === null ? "—" : `${avgPercent}%`}
                    </td>
                    <td className="tabnum px-4 py-3 text-muted">
                      {u.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
