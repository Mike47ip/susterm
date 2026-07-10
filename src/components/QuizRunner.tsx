"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { playCorrectSound, playIncorrectSound } from "@/lib/sound";

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
const KEYBOARD_MAP: Record<string, OptionKey> = {
  a: "A",
  b: "B",
  c: "C",
  d: "D",
  "1": "A",
  "2": "B",
  "3": "C",
  "4": "D",
};

type Feedback = { correct: boolean; correctOption: OptionKey; definition: string | null };

const AUTO_ADVANCE_DELAY = 1400;

export default function QuizRunner({ questions }: { questions: QuizQuestion[] }) {
  const router = useRouter();
  const [index, setIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, OptionKey>>({});
  const [feedback, setFeedback] = useState<Record<string, Feedback>>({});
  const [checking, setChecking] = useState(false);
  const [takerName, setTakerName] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const advanceTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const current = questions[index];
  const isLast = index === questions.length - 1;
  const selected = answers[current.id];
  const currentFeedback = feedback[current.id];
  const answeredCount = Object.keys(feedback).length;

  const goNext = useCallback(() => {
    setIndex((i) => Math.min(questions.length - 1, i + 1));
  }, [questions.length]);

  const goBack = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const handleSubmit = useCallback(async () => {
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
  }, [answers, router, takerName]);

  const selectOption = useCallback(
    async (option: OptionKey) => {
      // Already answered (or mid-check) — locked, ignore further picks.
      if (feedback[current.id] || checking) return;

      setAnswers((prev) => ({ ...prev, [current.id]: option }));
      setChecking(true);
      setError(null);

      try {
        const res = await fetch(`/api/questions/${current.id}/check`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ selected: option }),
        });
        if (!res.ok) throw new Error("Failed to check answer.");
        const data = (await res.json()) as {
          correct: boolean;
          correctOption: OptionKey;
          definition: string | null;
        };

        setFeedback((prev) => ({ ...prev, [current.id]: data }));
        if (data.correct) {
          playCorrectSound();
        } else {
          playIncorrectSound();
        }

        // Only auto-advance on a correct answer. A wrong answer waits for the
        // user to hit Next manually, so they have time to read the definition.
        if (!isLast && data.correct) {
          if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
          advanceTimeout.current = setTimeout(() => {
            goNext();
          }, AUTO_ADVANCE_DELAY);
        }
      } catch {
        setError("Couldn't check that answer — check your connection and try again.");
        setAnswers((prev) => {
          const next = { ...prev };
          delete next[current.id];
          return next;
        });
      } finally {
        setChecking(false);
      }
    },
    [current.id, feedback, checking, isLast, goNext]
  );

  useEffect(() => {
    return () => {
      if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
    };
  }, []);

  // Keyboard shortcuts: A-D / 1-4 to answer, Enter to advance/submit, arrows to navigate.
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const target = e.target as HTMLElement | null;
      if (target && ["INPUT", "TEXTAREA"].includes(target.tagName)) return;

      const key = e.key.toLowerCase();
      if (key in KEYBOARD_MAP) {
        e.preventDefault();
        selectOption(KEYBOARD_MAP[key]);
        return;
      }
      if (key === "arrowright" || key === "enter") {
        e.preventDefault();
        if (isLast) {
          if (currentFeedback && !submitting) handleSubmit();
        } else if (currentFeedback) {
          if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
          goNext();
        }
        return;
      }
      if (key === "arrowleft" || key === "backspace") {
        e.preventDefault();
        if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
        goBack();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [currentFeedback, isLast, submitting, selectOption, goNext, goBack, handleSubmit]);

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

      <div key={current.id} className="question-enter">
        <h1 className="mt-8 text-xl font-medium text-foreground">{current.text}</h1>

        <div className="mt-6 flex flex-col gap-3">
          {OPTION_KEYS.map((key) => {
            const label = current[`option${key}` as `option${OptionKey}`];
            const isSelected = selected === key;
            const isCorrectOption = currentFeedback?.correctOption === key;
            const locked = !!currentFeedback;

            let stateClasses = "border-line bg-surface hover:border-accent/50 hover:bg-accent/[0.02]";
            let animClass = "";
            if (locked) {
              if (isSelected && currentFeedback!.correct) {
                stateClasses = "border-correct bg-correct/10";
                animClass = "correct-pulse";
              } else if (isSelected && !currentFeedback!.correct) {
                stateClasses = "border-incorrect bg-incorrect/10";
                animClass = "shake-once";
              } else if (isCorrectOption) {
                stateClasses = "border-correct bg-correct/5";
              } else {
                stateClasses = "border-line bg-surface opacity-60";
              }
            } else if (isSelected) {
              stateClasses = "border-accent bg-accent/5";
            }

            return (
              <button
                key={key}
                type="button"
                disabled={locked || checking}
                onClick={() => selectOption(key)}
                className={`flex items-center gap-3 rounded-lg border px-4 py-3 text-left transition-all duration-150 active:scale-[0.98] disabled:cursor-default ${stateClasses} ${animClass}`}
              >
                <span
                  className={`tabnum flex h-7 w-7 shrink-0 items-center justify-center rounded-full border text-xs font-semibold transition-colors ${
                    locked && isSelected
                      ? currentFeedback!.correct
                        ? "border-correct bg-correct text-white"
                        : "border-incorrect bg-incorrect text-white"
                      : locked && isCorrectOption
                      ? "border-correct text-correct"
                      : isSelected
                      ? "option-check border-accent bg-accent text-accent-ink"
                      : "border-line text-muted"
                  }`}
                >
                  {locked && isSelected ? (currentFeedback!.correct ? "✓" : "✕") : key}
                </span>
                <span className="text-foreground">{label}</span>
              </button>
            );
          })}
        </div>

        {currentFeedback && (
          <div
            className={`feedback-in mt-4 rounded-lg border px-4 py-3 text-sm ${
              currentFeedback.correct
                ? "border-correct/30 bg-correct/5 text-correct"
                : "border-incorrect/30 bg-incorrect/5 text-incorrect"
            }`}
          >
            {currentFeedback.correct ? (
              <span className="font-medium">Correct!</span>
            ) : (
              <div>
                <p>
                  <span className="font-medium">Not quite.</span> The correct answer is{" "}
                  <span className="font-semibold">
                    {currentFeedback.correctOption}){" "}
                    {current[`option${currentFeedback.correctOption}` as `option${OptionKey}`]}
                  </span>
                  .
                </p>
                {currentFeedback.definition && (
                  <p className="mt-2 leading-relaxed text-foreground">
                    {currentFeedback.definition}
                  </p>
                )}
                <p className="mt-2 text-xs text-muted">
                  Take your time — click <span className="font-semibold">Next</span> when you&apos;re
                  ready.
                </p>
              </div>
            )}
          </div>
        )}
      </div>

      {isLast && currentFeedback && (
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
          onClick={() => {
            if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
            goBack();
          }}
          className="rounded-md border border-line px-4 py-2 text-sm font-medium text-foreground transition-transform active:scale-95 disabled:opacity-40"
        >
          Back
        </button>

        <p className="hidden text-xs text-muted sm:block">
          Tip: press <span className="tabnum font-semibold">A–D</span> to answer,{" "}
          <span className="tabnum font-semibold">Enter</span> to continue
        </p>

        {isLast ? (
          <button
            type="button"
            disabled={submitting || !currentFeedback}
            onClick={handleSubmit}
            className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform hover:opacity-90 active:scale-95 disabled:opacity-40"
          >
            {submitting ? "Submitting…" : "Submit quiz"}
          </button>
        ) : (
          <button
            type="button"
            disabled={!currentFeedback}
            onClick={() => {
              if (advanceTimeout.current) clearTimeout(advanceTimeout.current);
              goNext();
            }}
            className={`rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink transition-transform hover:opacity-90 active:scale-95 disabled:opacity-40 ${
              currentFeedback && !currentFeedback.correct ? "animate-pulse" : ""
            }`}
          >
            Next
          </button>
        )}
      </div>
    </div>
  );
}
