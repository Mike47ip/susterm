import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { hashPassword, createSession } from "@/lib/auth";

export async function POST(req: NextRequest) {
  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body." }, { status: 400 });
  }

  const { name, email, password } = body as { name?: string; email?: string; password?: string };

  if (!name?.trim() || !email?.trim() || !password) {
    return NextResponse.json({ error: "Name, email, and password are all required." }, { status: 400 });
  }
  if (password.length < 8) {
    return NextResponse.json({ error: "Password must be at least 8 characters." }, { status: 400 });
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await prisma.user.findUnique({ where: { email: normalizedEmail } });
  if (existing) {
    return NextResponse.json({ error: "An account with that email already exists." }, { status: 409 });
  }

  const passwordHash = await hashPassword(password);

  const user = await prisma.user.create({
    data: {
      name: name.trim(),
      email: normalizedEmail,
      passwordHash,
      // role defaults to USER — SUPER_ADMIN is only ever set via the seed script,
      // never through public signup.
    },
  });

  await createSession({ id: user.id, name: user.name, email: user.email, role: user.role });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
}
