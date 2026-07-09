"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type QuizQuestion = {
  id: string;
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
};

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

export default function QuizRunner({ questions }: { questions: QuizQuestion[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [takerName, setTakerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const selected = answers[current.id];
  const answeredCount = Object.keys(answers).length;

  function selectOption(option: OptionKey) {
    setAnswers((prev) => ({ ...prev, [current.id]: option }));
  }

  async function handleSubmit() {
    setSubmitting(true);
    setError(null);
    try {
      const res = await fetch("/api/attempts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          takerName: takerName || undefined,
          answers: Object.entries(answers).map(([questionId, sel]) => ({
            questionId,
            selected: sel,
          })),
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to submit quiz.");
      }
      const data = await res.json();
      router.push(`/quiz/result/${data.id}`);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong.");
      setSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <div className="mb-6 flex items-center justify-between">
        <span className="tabnum text-sm text-muted">
          Question {index + 1} / {questions.length}
        </span>
        <span className="tabnum text-sm text-muted">{answeredCount} answered</span>
      </div>

      <div className="h-1.5 w-full overflow-hidden rounded-full bg-line">
        <div
          className="h-full bg-accent transition-all duration-300"
          style={{ width: `${((index + 1) / questions.length) * 100}%` }}
        />
      </div>

      <h1 className="mt-8 text-xl font-medium text-foreground">{current.text}</h1>

      <div className="mt-6 flex flex-col gap-3">
        {OPTION_KEYS.map((key) => {
          const label = current[`option${key}` as `option${OptionKey}`];
          const isSelected = selected === key;
          return (
            <button
              key={key}
              type="button"
              onClick={() => selectOption(key)}
              className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-colors ${
                isSelected
                  ? "border-accent bg-accent/5 text-foreground"
                  : "border-line bg-surface text-foreground hover:border-accent/50"
              }`}
            >
              <span
                className={`tabnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold ${
                  isSelected ? "border-accent bg-accent text-accent-ink" : "border-line text-muted"
                }`}
              >
                {key}
              </span>
              <span>{label}</span>
            </button>
          );
        })}
      </div>

      {isLast && (
        <div className="mt-8">
          <label className="block text-sm font-medium text-muted" htmlFor="takerName">
            Your name (optional)
          </label>
          <input
            id="takerName"
            type="text"
            value={takerName}
            onChange={(e) => setTakerName(e.target.value)}
            placeholder="Anonymous"
            className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>
      )}

      {error && <p className="mt-4 text-sm text-incorrect">{error}</p>}

      <div className="mt-8 flex items-center justify-between">
        <button
          type="button"
          disabled={index === 0}
          onClick={() => setIndex((i) => Math.max(0, i - 1))}
          className="rounded-md border border-line px-4 py-2 text-sm font-medium text-foreground disabled:opacity-40"
        >
          Back
        </button>

        {isLast ? (
          <button
            type="button"
            disabled={submitting || answeredCount === 0}
            onClick={handleSubmit}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-40"
          >
            {submitting ? "Submitting…" : "Submit quiz"}
          </button>
        ) : (
          <button
            type="button"
            disabled={!selected}
            onClick={() => setIndex((i) => Math.min(questions.length - 1, i + 1))}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-40"
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
