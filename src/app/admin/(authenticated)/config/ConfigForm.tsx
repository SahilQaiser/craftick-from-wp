"use client";

import { useState } from "react";

export default function ConfigForm({ initialCodEnabled }: { initialCodEnabled: boolean }) {
  const [codEnabled, setCodEnabled] = useState(initialCodEnabled);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  async function handleToggle(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setCodEnabled(checked);
    setSaving(true);
    setMessage("");

    try {
      const res = await fetch("/api/admin/config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key: "enable_cod", value: checked ? "true" : "false" }),
      });

      if (!res.ok) throw new Error("Failed to save");
      setMessage("Saved.");
      setTimeout(() => setMessage(""), 2000);
    } catch {
      setMessage("Error saving configuration.");
      setCodEnabled(!checked); // revert
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="bg-white border border-[#E8E3DC] p-6 max-w-2xl">
      <h2 className="text-sm font-semibold text-[#1C1C1C] mb-4">Checkout Options</h2>
      
      <div className="flex items-center justify-between border-b border-[#E8E3DC] pb-4">
        <div>
          <p className="text-sm font-medium text-[#1C1C1C]">Enable Cash on Delivery (COD)</p>
          <p className="text-xs text-[#8C8680] mt-1">
            Allow customers to choose COD at checkout.
          </p>
        </div>
        <label className="relative inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            className="sr-only peer"
            checked={codEnabled}
            onChange={handleToggle}
            disabled={saving}
          />
          <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#B5903A]"></div>
        </label>
      </div>

      {message && (
        <p className="mt-4 text-xs font-medium text-[#B5903A]">{message}</p>
      )}
    </div>
  );
}
