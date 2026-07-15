import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { email, password } = body as { email?: string; password?: string };

  if (!email?.trim() || !password) {
    return NextResponse.json({ error: "Email and password are both required." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const user = await prisma.user.findUnique({ where: { email: normalizedEmail } });

  // Same generic error whether the email doesn't exist or the password is wrong —
  // avoids leaking which emails are registered.
  const invalid = () => NextResponse.json({ error: "Invalid email or password." }, { status: 401 });

  if (!user) return invalid();

  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return invalid();

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role });
}
