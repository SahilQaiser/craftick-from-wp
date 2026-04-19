import { NextRequest, NextResponse } from "next/server";
import { verifySession, COOKIE_NAME } from "@/lib/auth";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow login page through
  if (pathname === "/admin/login") return NextResponse.next();

  const secret = process.env.AUTH_SECRET;
  if (!secret) {
    // If no AUTH_SECRET is set, redirect to login for safety
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) {
    return NextResponse.redirect(new URL("/admin/login", request.url));
  }

  const session = await verifySession(cookie, secret);
  if (!session) {
    const response = NextResponse.redirect(new URL("/admin/login", request.url));
    response.cookies.delete(COOKIE_NAME);
    return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
