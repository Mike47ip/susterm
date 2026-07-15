"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AuthForm({ mode }: { mode: "signup" | "login" }) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      const res = await fetch(`/api/auth/${mode}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(mode === "signup" ? { name, email, password } : { email, password }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(data.error || "Something went wrong.");
      }
      router.push("/");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-sm px-6 py-16">
      <h1 className="text-2xl font-semibold text-foreground">
        {mode === "signup" ? "Create an account" : "Log in"}
      </h1>
      <p className="mt-1.5 text-sm text-muted">
        {mode === "signup"
          ? "Track your scores and show up on the leaderboard."
          : "Welcome back."}
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        {mode === "signup" && (
          <div>
            <label className="block text-sm font-medium text-muted" htmlFor="name">
              Name
            </label>
            <input
              id="name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
            />
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-muted" htmlFor="email">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-muted" htmlFor="password">
            Password
          </label>
          <input
            id="password"
            type="password"
            required
            minLength={mode === "signup" ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
          {mode === "signup" && (
            <p className="mt-1 text-xs text-muted">At least 8 characters.</p>
          )}
        </div>

        {error && <p className="text-sm text-incorrect">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="mt-2 rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-40"
        >
          {submitting ? "Please wait…" : mode === "signup" ? "Sign up" : "Log in"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted">
        {mode === "signup" ? (
          <>
            Already have an account?{" "}
            <Link href="/login" className="text-accent underline underline-offset-2">
              Log in
            </Link>
          </>
        ) : (
          <>
            Need an account?{" "}
            <Link href="/signup" className="text-accent underline underline-offset-2">
              Sign up
            </Link>
          </>
        )}
      </p>
    </div>
  );
}
