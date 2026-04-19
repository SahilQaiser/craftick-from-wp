import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ key: string[] }> }
) {
  const { key } = await params;
  const fullKey = key.join("/");

  const { env } = await getCloudflareContext({ async: true });
  const obj = await env.PRODUCT_IMAGES.get(fullKey);

  if (!obj) {
    return new NextResponse("Not found", { status: 404 });
  }

  return new NextResponse(obj.body, {
    headers: {
      "Content-Type": obj.httpMetadata?.contentType ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
