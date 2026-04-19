import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { adjustInventory } from "@/lib/db";

async function auth(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const session = await verifySession(cookie, process.env.AUTH_SECRET ?? "");
  return session !== null;
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as { delta?: unknown } | null;
  if (!body || typeof body.delta !== "number") {
    return NextResponse.json({ error: "delta (number) is required" }, { status: 400 });
  }

  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const product = await adjustInventory(env.DB, Number(id), body.delta);
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}
