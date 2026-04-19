import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { getProductById, updateProduct, deleteProduct } from "@/lib/db";

async function auth(request: NextRequest): Promise<boolean> {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return false;
  const session = await verifySession(cookie, process.env.AUTH_SECRET ?? "");
  return session !== null;
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const product = await getProductById(env.DB, Number(id));
  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const body = await request.json().catch(() => null) as Record<string, unknown> | null;
  if (!body) return NextResponse.json({ error: "Invalid body" }, { status: 400 });

  const { env } = await getCloudflareContext({ async: true });
  const images = Array.isArray(body.images) ? (body.images as string[]).map(String) : undefined;
  const product = await updateProduct(env.DB, Number(id), {
    slug: body.slug !== undefined ? String(body.slug).trim() : undefined,
    title: body.title !== undefined ? String(body.title).trim() : undefined,
    subtitle: body.subtitle !== undefined ? String(body.subtitle).trim() : undefined,
    description: body.description !== undefined ? String(body.description).trim() : undefined,
    price: body.price !== undefined ? Number(body.price) : undefined,
    images,
    image: images === undefined && body.image !== undefined ? String(body.image).trim() : undefined,
    category: body.category !== undefined ? String(body.category).trim() : undefined,
    featured: body.featured !== undefined ? Boolean(body.featured) : undefined,
    outOfStock: body.outOfStock !== undefined ? Boolean(body.outOfStock) : undefined,
    inventory: body.inventory !== undefined ? Number(body.inventory) : undefined,
  });

  if (!product) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json(product);
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await auth(request))) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const deleted = await deleteProduct(env.DB, Number(id));
  if (!deleted) return NextResponse.json({ error: "Not found" }, { status: 404 });
  return NextResponse.json({ ok: true });
}
