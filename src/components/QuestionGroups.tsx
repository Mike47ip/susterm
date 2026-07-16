"use client";

// FILE LOCATION: src/components/QuestionGroups.tsx
// This file must export a component called QuestionGroups (NOT QuestionForm).
// If your local file currently starts with "export default function
// QuestionForm", that is the wrong content — replace the whole file with this.

import { useMemo, useState } from "react";
import Link from "next/link";
import DeleteQuestionButton from "@/components/DeleteQuestionButton";

type QuestionRow = {
  id: string;
  text: string;
  correctOption: string;
  level: "EASY" | "DIFFICULT";
  batch: number;
};

function GroupSection({
  title,
  questions,
  defaultOpen,
}: {
  title: string;
  questions: QuestionRow[];
  defaultOpen: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="overflow-hidden rounded-lg border border-line bg-surface">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-foreground">{title}</span>
        <span className="flex items-center gap-3">
          <span className="tabnum text-xs text-muted">{questions.length} questions</span>
          <svg
            viewBox="0 0 24 24"
            width="16"
            height="16"
            fill="none"
            className={`text-muted transition-transform ${open ? "rotate-180" : ""}`}
          >
            <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </span>
      </button>
      {open && (
        <ul className="divide-y divide-line border-t border-line">
          {questions.map((q, i) => (
            <li key={q.id} className="flex items-start justify-between gap-4 px-4 py-3">
              <p className="text-sm text-foreground">
                <span className="tabnum text-muted">{i + 1}.</span> {q.text}
                <span className="tabnum ml-2 text-xs text-muted">({q.correctOption})</span>
              </p>
              <div className="flex shrink-0 gap-4">
                <Link
                  href={`/admin/questions/${q.id}/edit`}
                  className="text-sm font-medium text-accent hover:opacity-80"
                >
                  Edit
                </Link>
                <DeleteQuestionButton id={q.id} />
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function QuestionGroups({ questions }: { questions: QuestionRow[] }) {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    if (!query.trim()) return questions;
    const q = query.toLowerCase();
    return questions.filter((item) => item.text.toLowerCase().includes(q));
  }, [questions, query]);

  const groups = useMemo(() => {
    const map = new Map<string, QuestionRow[]>();
    for (const q of filtered) {
      const key = `${q.level}-${q.batch}`;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(q);
    }
    return Array.from(map.entries())
      .map(([key, items]) => {
        const [level, batch] = key.split("-");
        return { level: level as "EASY" | "DIFFICULT", batch: Number(batch), items };
      })
      .sort((a, b) => (a.level === b.level ? a.batch - b.batch : a.level === "EASY" ? -1 : 1));
  }, [filtered]);

  return (
    <div>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search questions…"
        className="w-full max-w-sm rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
      />

      {groups.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No questions match &quot;{query}&quot;.</p>
      ) : (
        <div className="mt-6 flex flex-col gap-3">
          {groups.map((g, idx) => (
            <GroupSection
              key={`${g.level}-${g.batch}`}
              title={`${g.level === "EASY" ? "Easy" : "Difficult"} — Set ${g.batch}`}
              questions={g.items}
              defaultOpen={idx === 0 && !!query}
            />
          ))}
        </div>
      )}
    </div>
  );
}