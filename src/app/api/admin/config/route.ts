import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { setSetting } from "@/lib/db";

export async function POST(request: NextRequest) {
  try {
    const { key, value } = await request.json();
    if (!key || typeof value !== "string") {
      return NextResponse.json({ error: "Invalid data" }, { status: 400 });
    }

    const { env } = await getCloudflareContext({ async: true });
    await setSetting(env.DB, key, value);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to update config:", err);
    return NextResponse.json({ error: "Failed to update config" }, { status: 500 });
  }
}
