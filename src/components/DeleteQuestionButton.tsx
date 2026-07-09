"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteQuestionButton({ id }: { id: string }) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete() {
    if (!confirm("Delete this question? This cannot be undone.")) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/questions/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Failed to delete.");
      router.refresh();
    } catch {
      alert("Failed to delete the question. Please try again.");
      setDeleting(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={deleting}
      className="text-sm font-medium text-incorrect hover:opacity-80 disabled:opacity-40"
    >
      {deleting ? "Deleting…" : "Delete"}
    </button>
  );
}
