import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getProducts, createProduct } from "@/lib/db";

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
  const products = await getProducts(env.DB);
  return NextResponse.json(products);
}

export async function POST(request: NextRequest) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  // Validate required fields
  if (!body.slug || !body.title || !body.price) {
    return NextResponse.json({ error: "slug, title and price are required" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  try {
    const images = Array.isArray(body.images) ? (body.images as string[]).map(String) : undefined;
    const product = await createProduct(env.DB, {
      slug: String(body.slug).trim(),
      title: String(body.title).trim(),
      subtitle: String(body.subtitle ?? "").trim(),
      description: String(body.description ?? "").trim(),
      price: Number(body.price),
      image: images?.[0] ?? String(body.image ?? "").trim(),
      images,
      category: String(body.category ?? "").trim(),
      featured: Boolean(body.featured),
      outOfStock: Boolean(body.outOfStock),
      inventory: Number(body.inventory ?? 0),
    });
    return NextResponse.json(product, { status: 201 });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Unknown error";
    if (msg.includes("UNIQUE")) {
      return NextResponse.json({ error: "A product with that slug already exists" }, { status: 409 });
    }
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
