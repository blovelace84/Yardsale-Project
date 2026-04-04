import { db } from "@/lib/db";
import { hashPassword } from "@/lib/password";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  const name = typeof body.name === "string" ? body.name.trim() : "";
  const email = typeof body.email === "string" ? body.email.trim().toLowerCase() : "";
  const password = typeof body.password === "string" ? body.password : "";

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required" },
      { status: 400 }
    );
  }

  const existingUser = await db.user.findUnique({
    where: { email },
  });

  if (existingUser) {
    return NextResponse.json(
      { error: "User already exists" },
      { status: 400 }
    );
  }

  const hashedPassword = await hashPassword(password);

  const user = await db.user.create({
    data: {
      email,
      name: name || null,
      password: hashedPassword,
    },
    select: {
      id: true,
      email: true,
      name: true,
    },
  });

  return NextResponse.json(user, { status: 201 });
}