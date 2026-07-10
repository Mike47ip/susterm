import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const VALID_OPTIONS = ["A", "B", "C", "D"] as const;

type Params = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, { params }: Params) {
  const { id } = await params;

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const selected = (body as { selected?: string }).selected;
  if (!selected || !VALID_OPTIONS.includes(selected as (typeof VALID_OPTIONS)[number])) {
    return NextResponse.json({ error: "A valid selected option (A-D) is required." }, { status: 400 });
  }

  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }

  return NextResponse.json({
    correct: question.correctOption === selected,
    correctOption: question.correctOption,
    definition: question.definition,
  });
}
