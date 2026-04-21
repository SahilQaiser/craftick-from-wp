import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getCategories, createCategory } from "@/lib/db";

async function auth(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const secret = process.env.AUTH_SECRET ?? "";
  const session = await verifySession(cookie, secret);
  return session !== null;
}

export async function GET(request: NextRequest) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { env } = await getCloudflareContext({ async: true });
  const categories = await getCategories(env.DB);
  return NextResponse.json(categories);
}

export async function POST(request: NextRequest) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  if (!body.slug || !body.name) {
    return NextResponse.json({ error: "slug and name are required" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  try {
    const category = await createCategory(env.DB, {
      slug: String(body.slug).trim().toLowerCase().replace(/\s+/g, "-"),
      name: String(body.name).trim(),
      description: String(body.description ?? "").trim(),
      image: String(body.image ?? "").trim(),
      sortOrder: Number(body.sortOrder ?? 0),
      showInNav: body.showInNav !== false,
    });
    return NextResponse.json(category, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "A category with that slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
