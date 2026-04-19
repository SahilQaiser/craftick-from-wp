import { NextRequest, NextResponse } from "next/server";
import { signSession, timingSafeEqual, COOKIE_NAME } from "@/lib/auth";

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null) as { username?: unknown; password?: unknown } | null;
  if (!body || typeof body.username !== "string" || typeof body.password !== "string") {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const envUsername = process.env.ADMIN_USERNAME ?? "";
  const envPassword = process.env.ADMIN_PASSWORD ?? "";
  const secret = process.env.AUTH_SECRET ?? "";

  const valid =
    timingSafeEqual(body.username, envUsername) &&
    timingSafeEqual(body.password, envPassword);

  if (!valid) {
    return NextResponse.json({ error: "Invalid credentials" }, { status: 401 });
  }

  const token = await signSession(body.username, secret);

  const response = NextResponse.json({ ok: true });
  response.cookies.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 86400, // 24 hours
  });
  return response;
}
