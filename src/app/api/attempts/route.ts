import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Option } from "@prisma/client";
import { getSessionUser } from "@/lib/auth";

const VALID_OPTIONS = ["A", "B", "C", "D"] as const;

type SubmittedAnswer = { questionId: string; selected: string };

export async function GET() {
  const attempts = await prisma.attempt.findMany({
    orderBy: { createdAt: "desc" },
    take: 50,
  });
  return NextResponse.json(attempts);
}

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const b = body as { takerName?: string; answers?: SubmittedAnswer[] };

  if (!Array.isArray(b.answers) || b.answers.length === 0) {
    return NextResponse.json({ error: "At least one answer is required." }, { status: 400 });
  }

  for (const a of b.answers) {
    if (
      typeof a.questionId !== "string" ||
      !VALID_OPTIONS.includes(a.selected as (typeof VALID_OPTIONS)[number])
    ) {
      return NextResponse.json({ error: "Each answer needs a valid questionId and selected option." }, { status: 400 });
    }
  }

  const questionIds = b.answers.map((a) => a.questionId);
  const questions = await prisma.question.findMany({
    where: { id: { in: questionIds } },
  });
  const questionMap = new Map(questions.map((q) => [q.id, q]));

  let score = 0;
  const answerRows: { questionId: string; selected: Option; isCorrect: boolean }[] = [];

  for (const a of b.answers) {
    const question = questionMap.get(a.questionId);
    if (!question) continue;
    const isCorrect = question.correctOption === a.selected;
    if (isCorrect) score += 1;
    answerRows.push({
      questionId: a.questionId,
      selected: a.selected as Option,
      isCorrect,
    });
  }

  if (answerRows.length === 0) {
    return NextResponse.json({ error: "None of the submitted questions were found." }, { status: 400 });
  }

  // If the person is logged in, attach the attempt to their account (this is what
  // feeds the leaderboard) — but anonymous play still works fine, it just won't
  // show up there.
  const sessionUser = await getSessionUser();

  const attempt = await prisma.attempt.create({
    data: {
      takerName: sessionUser?.name || b.takerName?.trim() || null,
      userId: sessionUser?.id,
      score,
      total: answerRows.length,
      answers: {
        create: answerRows,
      },
    },
  });

  return NextResponse.json({ id: attempt.id, score, total: answerRows.length }, { status: 201 });
}
