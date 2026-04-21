import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { updateCategory, deleteCategory } from "@/lib/db";

async function auth(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const secret = process.env.AUTH_SECRET ?? "";
  const session = await verifySession(cookie, secret);
  return session !== null;
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { env } = await getCloudflareContext({ async: true });
  try {
    const updated = await updateCategory(env.DB, slug, {
      ...(body.name !== undefined && { name: String(body.name).trim() }),
      ...(body.description !== undefined && { description: String(body.description).trim() }),
      ...(body.image !== undefined && { image: String(body.image).trim() }),
      ...(body.sortOrder !== undefined && { sortOrder: Number(body.sortOrder) }),
      ...(body.showInNav !== undefined && { showInNav: Boolean(body.showInNav) }),
      ...(body.slug !== undefined && { slug: String(body.slug).trim().toLowerCase().replace(/\s+/g, "-") }),
    });
    if (!updated) return NextResponse.json({ error: "Category not found" }, { status: 404 });
    return NextResponse.json(updated);
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "A category with that slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { slug } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const deleted = await deleteCategory(env.DB, slug);
  if (!deleted) return NextResponse.json({ error: "Category not found" }, { status: 404 });
  return NextResponse.json({ success: true });
}
