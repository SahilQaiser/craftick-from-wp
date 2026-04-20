import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSetting } from "@/lib/db";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const codSetting = await getSetting(env.DB, "enable_cod", "false");
    
    return NextResponse.json({
      enable_cod: codSetting === "true",
    });
  } catch (err) {
    console.error("Failed to fetch public config:", err);
    return NextResponse.json({ enable_cod: false });
  }
}
