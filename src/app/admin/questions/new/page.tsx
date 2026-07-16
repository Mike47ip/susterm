// FILE LOCATION: src/app/admin/questions/new/page.tsx

import QuestionForm from "@/components/QuestionForm";

export default function NewQuestionPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <h2 className="text-xl font-semibold text-foreground">New question</h2>
      <div className="mt-6 rounded-lg border border-line bg-surface p-6">
        <QuestionForm mode="create" />
      </div>
    </div>
  );
}