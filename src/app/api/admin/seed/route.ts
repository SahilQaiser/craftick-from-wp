import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { verifySession, COOKIE_NAME } from "@/lib/auth";
import { products } from "@/lib/products-static";

export async function POST(request: NextRequest) {
  const cookie = request.cookies.get(COOKIE_NAME)?.value;
  if (!cookie) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const session = await verifySession(cookie, process.env.AUTH_SECRET ?? "");
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { env } = await getCloudflareContext({ async: true });

  const stmts = products.map((p) =>
    env.DB.prepare(
      `INSERT OR IGNORE INTO products (id, slug, title, subtitle, description, price, image, category, featured, out_of_stock, inventory)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
    ).bind(
      p.id,
      p.slug,
      p.title,
      p.subtitle,
      p.description,
      p.price,
      p.image,
      p.category,
      p.featured ? 1 : 0,
      p.outOfStock ? 1 : 0,
      p.inventory ?? 0
    )
  );

  await env.DB.batch(stmts);

  return NextResponse.json({ seeded: products.length });
}
