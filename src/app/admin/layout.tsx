// FILE LOCATION: src/app/admin/layout.tsx

import { requireSuperAdmin } from "@/lib/auth";
import AdminTabs from "@/components/AdminTabs";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const user = await requireSuperAdmin();

  return (
    <div className="min-h-[calc(100vh-65px)] bg-[color-mix(in_srgb,var(--accent)_3%,var(--background))]">
      <div className="border-b border-line bg-surface">
        <div className="mx-auto max-w-5xl px-6 pt-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="tabnum text-xs text-accent">Admin</p>
              <h1 className="mt-0.5 text-2xl font-semibold text-foreground">Console</h1>
            </div>
            <p className="text-sm text-muted">
              Signed in as <span className="font-medium text-foreground">{user.name}</span>
            </p>
          </div>
          <AdminTabs />
        </div>
      </div>
      <div className="mx-auto max-w-5xl px-6 py-10">{children}</div>
    </div>
  );
}