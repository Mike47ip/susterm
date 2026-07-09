import QuestionForm from "@/components/QuestionForm";

export default function NewQuestionPage() {
  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="tabnum text-sm text-accent">Admin</p>
      <h1 className="mt-1 text-3xl font-semibold text-foreground">New question</h1>
      <div className="mt-8">
        <QuestionForm mode="create" />
      </div>
    </div>
  );
}
