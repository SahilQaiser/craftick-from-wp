"use client";

import { useState } from "react";

export default function SeedPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSeed() {
    setStatus("loading");
    setMessage("");
    try {
      const res = await fetch("/api/admin/seed", { method: "POST" });
      const data = await res.json() as { seeded?: number; error?: string };
      if (res.ok) {
        setStatus("done");
        setMessage(`${data.seeded} products seeded successfully.`);
      } else {
        setStatus("error");
        setMessage(data.error ?? "Seeding failed.");
      }
    } catch {
      setStatus("error");
      setMessage("An error occurred.");
    }
  }

  return (
    <div className="p-8 max-w-lg">
      <h1 className="text-2xl font-semibold text-[#1C1C1C] mb-2">Seed Products</h1>
      <p className="text-sm text-[#6B6560] mb-8">
        Inserts the static product list into the database. Existing products (matched by ID) are skipped.
      </p>

      <button
        onClick={handleSeed}
        disabled={status === "loading" || status === "done"}
        className="bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-8 py-3 font-medium hover:bg-[#B5903A] transition-colors disabled:opacity-50"
      >
        {status === "loading" ? "Seeding…" : status === "done" ? "Done" : "Seed Products"}
      </button>

      {message && (
        <p className={`mt-4 text-sm ${status === "error" ? "text-red-600" : "text-green-700"}`}>
          {message}
        </p>
      )}
    </div>
  );
}
