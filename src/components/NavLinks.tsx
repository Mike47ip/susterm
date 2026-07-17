"use client";

// FILE LOCATION: src/components/NavLinks.tsx (new file)

import { useState } from "react";
import Link from "next/link";
import LogoutButton from "@/components/LogoutButton";

type SessionUser = {
  id: string;
  name: string;
  email: string;
  role: "USER" | "SUPER_ADMIN";
} | null;

function NavLinkList({
  user,
  onNavigate,
  className = "",
}: {
  user: SessionUser;
  onNavigate?: () => void;
  className?: string;
}) {
  return (
    <div className={className}>
      <Link href="/quiz" onClick={onNavigate} className="hover:text-accent transition-colors">
        Take Quiz
      </Link>
      <Link href="/leaderboard" onClick={onNavigate} className="hover:text-accent transition-colors">
        Leaderboard
      </Link>
      {user?.role === "SUPER_ADMIN" && (
        <Link href="/admin" onClick={onNavigate} className="hover:text-accent transition-colors">
          Admin
        </Link>
      )}
    </div>
  );
}

function AuthLinks({
  user,
  onNavigate,
  className = "",
}: {
  user: SessionUser;
  onNavigate?: () => void;
  className?: string;
}) {
  if (user) {
    return (
      <div className={className}>
        <span className="text-foreground">{user.name}</span>
        <LogoutButton />
      </div>
    );
  }
  return (
    <div className={className}>
      <Link href="/login" onClick={onNavigate} className="hover:text-accent transition-colors">
        Log in
      </Link>
      <Link
        href="/signup"
        onClick={onNavigate}
        className="rounded-md bg-accent px-3 py-1.5 text-sm font-medium text-accent-ink hover:opacity-90"
      >
        Sign up
      </Link>
    </div>
  );
}

export default function NavLinks({ user }: { user: SessionUser }) {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* Desktop: full horizontal nav */}
      <nav className="hidden items-center gap-6 text-sm font-medium text-muted sm:flex">
        <NavLinkList user={user} className="flex items-center gap-6" />
        <AuthLinks user={user} className="flex items-center gap-4 border-l border-line pl-6" />
      </nav>

      {/* Mobile: hamburger toggle */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? "Close menu" : "Open menu"}
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md text-foreground sm:hidden"
      >
        {open ? (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path d="M5 5l14 14M19 5L5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" width="22" height="22" fill="none">
            <path d="M4 7h16M4 12h16M4 17h16" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </button>

      {/* Mobile: dropdown panel */}
      {open && (
        <div className="absolute inset-x-0 top-full border-b border-line bg-surface px-6 py-4 shadow-lg sm:hidden">
          <NavLinkList
            user={user}
            onNavigate={() => setOpen(false)}
            className="flex flex-col gap-4 text-base font-medium text-muted"
          />
          <div className="mt-4 border-t border-line pt-4">
            <AuthLinks
              user={user}
              onNavigate={() => setOpen(false)}
              className="flex flex-col items-start gap-3 text-base"
            />
          </div>
        </div>
      )}
    </>
  );
}