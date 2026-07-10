// FILE LOCATION: src/app/page.tsx (replaces existing file)

import Link from "next/link";
import { prisma } from "@/lib/prisma";
import GrowthMark from "@/components/landing/GrowthMark";
import HeroPhoto from "@/components/landing/HeroPhoto";
import LandingBackdrop from "@/components/landing/LandingBackdrop";
import FloatingLeaves from "@/components/landing/FloatingLeaves";
import FeatureGrid from "@/components/landing/FeatureGrid";
import AnimatedNumber from "@/components/landing/AnimatedNumber";
import RevealOnScroll from "@/components/landing/RevealOnScroll";

export default async function Home() {
  const [questionCount, attemptCount] = await Promise.all([
    prisma.question.count(),
    prisma.attempt.count(),
  ]);

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <HeroPhoto />
        <LandingBackdrop />
        <FloatingLeaves />
        <div className="relative mx-auto grid max-w-5xl gap-10 px-6 py-16 sm:py-24 lg:grid-cols-2 lg:items-center lg:py-28">
          <div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-surface px-3 py-1 text-xs font-medium text-muted">
              <span className="h-1.5 w-1.5 rounded-full bg-accent" />
              Powered by the SusTerm Dictionary
            </span>

            <h1 className="mt-5 text-4xl font-semibold leading-tight tracking-tight text-foreground sm:text-5xl">
              Sustainability literacy,
              <br />
              <span className="text-accent">one term at a time.</span>
            </h1>

            <p className="mt-4 max-w-md text-muted">
              Real definitions, hidden inside real-world examples. Answer, learn
              what you missed, and watch your score grow — like the practice
              you&apos;re building.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/quiz"
                className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform hover:opacity-90 active:scale-95"
              >
                Take the quiz
              </Link>
              <Link
                href="/admin"
                className="rounded-md border border-line bg-surface px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-accent"
              >
                Manage questions
              </Link>
            </div>
          </div>

          <GrowthMark />
        </div>
      </section>

      {/* Stats */}
      <section className="mx-auto max-w-5xl px-6 pb-4">
        <RevealOnScroll>
          <dl className="grid grid-cols-2 gap-4 sm:w-96">
            <div className="rounded-lg border border-line bg-surface p-4">
              <dt className="text-xs uppercase tracking-wide text-muted">Questions</dt>
              <dd className="mt-1 text-2xl font-semibold text-foreground">
                <AnimatedNumber value={questionCount} />
              </dd>
            </div>
            <div className="rounded-lg border border-line bg-surface p-4">
              <dt className="text-xs uppercase tracking-wide text-muted">Attempts</dt>
              <dd className="mt-1 text-2xl font-semibold text-foreground">
                <AnimatedNumber value={attemptCount} />
              </dd>
            </div>
          </dl>
        </RevealOnScroll>

        {questionCount === 0 && (
          <p className="mt-6 text-sm text-muted">
            No questions yet.{" "}
            <Link href="/admin/questions/new" className="text-accent underline underline-offset-2">
              Add your first question
            </Link>{" "}
            to get started.
          </p>
        )}
      </section>

      {/* Why this exists */}
      <section className="mx-auto max-w-5xl px-6 py-16 sm:py-24">
        <RevealOnScroll>
          <p className="tabnum text-sm text-accent">Why SusTerm</p>
          <h2 className="mt-2 max-w-xl text-2xl font-semibold text-foreground sm:text-3xl">
            Sustainability language is everywhere. Understanding it shouldn&apos;t
            be optional.
          </h2>
        </RevealOnScroll>

        <div className="mt-10">
          <FeatureGrid />
        </div>
      </section>
    </div>
  );
}