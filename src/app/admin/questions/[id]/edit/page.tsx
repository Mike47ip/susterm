// FILE LOCATION: src/app/admin/questions/[id]/edit/page.tsx

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
    <div className="mx-auto max-w-2xl">
      <h2 className="text-xl font-semibold text-foreground">Edit question</h2>
      <div className="mt-6 rounded-lg border border-line bg-surface p-6">
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
            level: question.level,
            batch: question.batch,
          }}
        />
      </div>
    </div>
  );
}