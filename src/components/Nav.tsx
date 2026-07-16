// FILE LOCATION: src/components/Nav.tsx

import Link from "next/link";
import { getSessionUser } from "@/lib/auth";
import LogoutButton from "@/components/LogoutButton";

export default async function Nav() {
  const user = await getSessionUser();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-surface/90 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="tabnum rounded bg-foreground px-1.5 py-0.5 text-[10px] font-semibold text-white">
            Q&amp;A
          </span>
          <span className="text-lg font-semibold tracking-tight text-foreground">
            Susterm
          </span>
        </Link>
        <nav className="flex items-center gap-6 text-sm font-medium text-muted">
          <Link href="/quiz" className="hover:text-accent transition-colors">
            Take Quiz
          </Link>
          <Link href="/leaderboard" className="hover:text-accent transition-colors">
            Leaderboard
          </Link>
          {user?.role === "SUPER_ADMIN" && (
            <Link href="/admin" className="hover:text-accent transition-colors">
              Admin
            </Link>
          )}
          {user ? (
            <div className="flex items-center gap-4 border-l border-line pl-6">
              <span className="text-foreground">{user.name}</span>
              <LogoutButton />
            </div>
          ) : (
            <div className="flex items-center gap-4 border-l border-line pl-6">
              <Link href="/login" className="hover:text-accent transition-colors">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink hover:opacity-90"
              >
                Sign up
              </Link>
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}