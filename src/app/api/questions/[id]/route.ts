import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const VALID_OPTIONS = ["A", "B", "C", "D"] as const;

function validateQuestionBody(body: unknown) {
  if (typeof body !== "object" || body === null) {
    return "Request body must be a JSON object.";
  }
  const b = body as Record<string, unknown>;
  const required = ["text", "optionA", "optionB", "optionC", "optionD", "correctOption"];
  for (const field of required) {
    if (typeof b[field] !== "string" || (b[field] as string).trim() === "") {
      return `Field "${field}" is required.`;
    }
  }
  if (!VALID_OPTIONS.includes(b.correctOption as (typeof VALID_OPTIONS)[number])) {
    return `Field "correctOption" must be one of A, B, C, D.`;
  }
  return null;
}

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  const question = await prisma.question.findUnique({ where: { id } });
  if (!question) {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }
  return NextResponse.json(question);
}

export async function PUT(req: NextRequest, { params }: Params) {
  const { id } = await params;
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const error = validateQuestionBody(body);
  if (error) {
    return NextResponse.json({ error }, { status: 400 });
  }
  const b = body as Record<string, string>;

  try {
    const question = await prisma.question.update({
      where: { id },
      data: {
        text: b.text.trim(),
        optionA: b.optionA.trim(),
        optionB: b.optionB.trim(),
        optionC: b.optionC.trim(),
        optionD: b.optionD.trim(),
        correctOption: b.correctOption as Prisma.QuestionUpdateInput["correctOption"],
      },
    });
    return NextResponse.json(question);
  } catch {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }
}

export async function DELETE(_req: NextRequest, { params }: Params) {
  const { id } = await params;
  try {
    await prisma.question.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: "Question not found." }, { status: 404 });
  }
}
