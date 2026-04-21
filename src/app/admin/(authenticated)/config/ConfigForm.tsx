"use client";

import { useState } from "react";

type Props = {
  initialCodEnabled: boolean;
  initialWaNumber: string;
  initialWaMessage: string;
};

async function saveSetting(key: string, value: string) {
  const res = await fetch("/api/admin/config", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ key, value }),
  });
  if (!res.ok) throw new Error("Failed to save");
}

export default function ConfigForm({ initialCodEnabled, initialWaNumber, initialWaMessage }: Props) {
  const [codEnabled, setCodEnabled] = useState(initialCodEnabled);
  const [waNumber, setWaNumber] = useState(initialWaNumber);
  const [waMessage, setWaMessage] = useState(initialWaMessage);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  function showSaved() {
    setMessage("Saved.");
    setTimeout(() => setMessage(""), 2000);
  }

  async function handleToggle(e: React.ChangeEvent<HTMLInputElement>) {
    const checked = e.target.checked;
    setCodEnabled(checked);
    setSaving(true);
    setMessage("");
    try {
      await saveSetting("enable_cod", checked ? "true" : "false");
      showSaved();
    } catch {
      setMessage("Error saving configuration.");
      setCodEnabled(!checked);
    } finally {
      setSaving(false);
    }
  }

  async function handleWaSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setMessage("");
    try {
      await Promise.all([
        saveSetting("whatsapp_number", waNumber.trim()),
        saveSetting("whatsapp_message", waMessage.trim()),
      ]);
      showSaved();
    } catch {
      setMessage("Error saving WhatsApp settings.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6 max-w-2xl">

      {/* Checkout */}
      <div className="bg-white border border-[#E8E3DC] p-6">
        <h2 className="text-sm font-semibold text-[#1C1C1C] mb-4">Checkout Options</h2>
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-[#1C1C1C]">Enable Cash on Delivery (COD)</p>
            <p className="text-xs text-[#8C8680] mt-1">Allow customers to choose COD at checkout.</p>
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
      </div>

      {/* WhatsApp */}
      <div className="bg-white border border-[#E8E3DC] p-6">
        <h2 className="text-sm font-semibold text-[#1C1C1C] mb-1">WhatsApp</h2>
        <p className="text-xs text-[#8C8680] mb-5">Configure the WhatsApp chat button shown on the storefront.</p>

        <form onSubmit={handleWaSave} className="space-y-4">
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#6B6560] font-medium mb-1.5">
              Phone Number <span className="text-[#8C8680] normal-case tracking-normal">(with country code, no + | e.g 919149545438)</span>
            </label>
            <input
              type="text"
              value={waNumber}
              onChange={(e) => setWaNumber(e.target.value)}
              placeholder="919149545438"
              className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] bg-[#F8F5F0] focus:outline-none focus:border-[#B5903A] transition-colors font-mono"
            />
          </div>

          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#6B6560] font-medium mb-1.5">
              Default Message
            </label>
            <textarea
              value={waMessage}
              onChange={(e) => setWaMessage(e.target.value)}
              rows={3}
              placeholder="Hi! I'm interested in your products."
              className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] bg-[#F8F5F0] focus:outline-none focus:border-[#B5903A] transition-colors resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-6 py-3 font-medium hover:bg-[#B5903A] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save WhatsApp Settings"}
          </button>
        </form>
      </div>

      {message && (
        <p className="text-xs font-medium text-[#B5903A]">{message}</p>
      )}
    </div>
  );
}
