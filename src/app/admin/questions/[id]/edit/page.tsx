import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import QuestionForm from "@/components/QuestionForm";

export default async function EditQuestionPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) notFound();

  return (
    <div className="mx-auto max-w-2xl px-6 py-12">
      <p className="tabnum text-sm text-accent">Admin</p>
      <h1 className="mt-1 text-3xl font-semibold text-foreground">Edit question</h1>
      <div className="mt-8">
        <QuestionForm
          mode="edit"
          questionId={question.id}
          initialValues={{
            text: question.text,
            optionA: question.optionA,
            optionB: question.optionB,
            optionC: question.optionC,
            optionD: question.optionD,
            correctOption: question.correctOption,
            definition: question.definition ?? "",
          }}
        />
      </div>
    </div>
  );
}
