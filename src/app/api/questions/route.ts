import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

const VALID_OPTIONS = ["A", "B", "C", "D"] as const;
const VALID_LEVELS = ["EASY", "DIFFICULT"] as const;

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
  if (b.level !== undefined && !VALID_LEVELS.includes(b.level as (typeof VALID_LEVELS)[number])) {
    return `Field "level" must be either EASY or DIFFICULT.`;
  }
  if (b.batch !== undefined && (typeof b.batch !== "number" || b.batch < 1)) {
    return `Field "batch" must be a positive number.`;
  }
  return null;
}

export async function GET() {
  const questions = await prisma.question.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(questions);
}

export async function POST(req: NextRequest) {
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

  const b = body as Record<string, string> & { level?: "EASY" | "DIFFICULT"; batch?: number };

  try {
    const question = await prisma.question.create({
      data: {
        text: b.text.trim(),
        optionA: b.optionA.trim(),
        optionB: b.optionB.trim(),
        optionC: b.optionC.trim(),
        optionD: b.optionD.trim(),
        correctOption: b.correctOption as Prisma.QuestionCreateInput["correctOption"],
        definition: b.definition?.trim() || null,
        level: b.level ?? "EASY",
        batch: b.batch ?? 1,
      },
    });
    return NextResponse.json(question, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Failed to create question." }, { status: 500 });
  }
}
