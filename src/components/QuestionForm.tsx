"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const OPTION_KEYS = ["A", "B", "C", "D"] as const;
type OptionKey = (typeof OPTION_KEYS)[number];

export type QuestionFormValues = {
  text: string;
  optionA: string;
  optionB: string;
  optionC: string;
  optionD: string;
  correctOption: OptionKey;
  definition: string;
  level: "EASY" | "DIFFICULT";
  batch: number;
};

const EMPTY: QuestionFormValues = {
  text: "",
  optionA: "",
  optionB: "",
  optionC: "",
  optionD: "",
  correctOption: "A",
  definition: "",
  level: "EASY",
  batch: 1,
};

export default function QuestionForm({
  mode,
  questionId,
  initialValues,
}: {
  mode: "create" | "edit";
  questionId?: string;
  initialValues?: QuestionFormValues;
}) {
  const router = useRouter();
  const [values, setValues] = useState<QuestionFormValues>(initialValues ?? EMPTY);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function setField<K extends keyof QuestionFormValues>(key: K, value: QuestionFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const url = mode === "create" ? "/api/questions" : `/api/questions/${questionId}`;
    const method = mode === "create" ? "POST" : "PUT";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to save question.");
      }
      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div>
        <label className="block text-sm font-medium text-muted" htmlFor="text">
          Question
        </label>
        <textarea
          id="text"
          required
          rows={3}
          value={values.text}
          onChange={(e) => setField("text", e.target.value)}
          className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          placeholder="e.g. What does HTML stand for?"
        />
      </div>

      <fieldset>
        <legend className="text-sm font-medium text-muted">Options</legend>
        <div className="mt-1.5 flex flex-col gap-3">
          {OPTION_KEYS.map((key) => (
            <div key={key} className="flex items-center gap-3">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="correctOption"
                  checked={values.correctOption === key}
                  onChange={() => setField("correctOption", key)}
                  className="h-4 w-4 accent-accent"
                />
                <span className="tabnum w-4 text-muted">{key}</span>
              </label>
              <input
                type="text"
                required
                value={values[`option${key}` as `option${OptionKey}`]}
                onChange={(e) => setField(`option${key}` as `option${OptionKey}`, e.target.value)}
                placeholder={`Option ${key}`}
                className="flex-1 rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
              />
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-muted">Select the radio button next to the correct option.</p>
      </fieldset>

      <div>
        <label className="block text-sm font-medium text-muted" htmlFor="definition">
          Definition <span className="font-normal">(shown to the user if they answer wrong)</span>
        </label>
        <textarea
          id="definition"
          rows={3}
          value={values.definition}
          onChange={(e) => setField("definition", e.target.value)}
          className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          placeholder="Optional — the full definition to display after a wrong answer"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-muted" htmlFor="level">
            Difficulty
          </label>
          <select
            id="level"
            value={values.level}
            onChange={(e) => setField("level", e.target.value as "EASY" | "DIFFICULT")}
            className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          >
            <option value="EASY">Easy</option>
            <option value="DIFFICULT">Difficult</option>
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-muted" htmlFor="batch">
            Set number
          </label>
          <input
            id="batch"
            type="number"
            min={1}
            required
            value={values.batch}
            onChange={(e) => setField("batch", Math.max(1, Number(e.target.value) || 1))}
            className="mt-1.5 w-full rounded-md border border-line bg-surface px-3 py-2 text-sm text-foreground outline-none focus:border-accent"
          />
        </div>
      </div>

      {error && <p className="text-sm text-incorrect">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-md bg-accent px-5 py-2.5 text-sm font-medium text-accent-ink hover:opacity-90 disabled:opacity-40"
        >
          {saving ? "Saving…" : mode === "create" ? "Add question" : "Save changes"}
        </button>
        <button
          type="button"
          onClick={() => router.push("/admin")}
          className="rounded-md border border-line px-5 py-2.5 text-sm font-medium text-foreground hover:border-accent"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
