import { NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSetting } from "@/lib/db";

export async function GET() {
  try {
    const { env } = await getCloudflareContext({ async: true });
    const [codSetting, waNumber, waMessage] = await Promise.all([
      getSetting(env.DB, "enable_cod", "false"),
      getSetting(env.DB, "whatsapp_number", "919149545438"),
      getSetting(env.DB, "whatsapp_message", "Hi! I'm interested in your Kashmiri handcrafted products."),
    ]);

    return NextResponse.json({
      enable_cod: codSetting === "true",
      whatsapp_number: waNumber,
      whatsapp_message: waMessage,
    });
  } catch (err) {
    console.error("Failed to fetch public config:", err);
    return NextResponse.json({
      enable_cod: false,
      whatsapp_number: "919149545438",
      whatsapp_message: "Hi! I'm interested in your Kashmiri handcrafted products.",
    });
  }
}
