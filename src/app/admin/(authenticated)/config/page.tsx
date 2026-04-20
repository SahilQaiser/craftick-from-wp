import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getSetting } from "@/lib/db";
import ConfigForm from "./ConfigForm";

export const dynamic = "force-dynamic";

export default async function AdminConfigPage() {
  const { env } = await getCloudflareContext({ async: true });
  const codSetting = await getSetting(env.DB, "enable_cod", "false");
  const initialCodEnabled = codSetting === "true";

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">Configuration</h1>
        <p className="text-sm text-[#6B6560] mt-1">Manage global site settings</p>
      </div>

      <ConfigForm initialCodEnabled={initialCodEnabled} />
    </div>
  );
}
