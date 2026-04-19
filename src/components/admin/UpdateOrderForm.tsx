"use client";

import { useState } from "react";
import type { Order, OrderStatus } from "@/lib/db";

const STATUS_OPTIONS: { value: OrderStatus; label: string }[] = [
  { value: "paid", label: "Paid" },
  { value: "processing", label: "Processing" },
  { value: "shipped", label: "Shipped" },
  { value: "delivered", label: "Delivered" },
  { value: "cancelled", label: "Cancelled" },
  { value: "refunded", label: "Refunded" },
];

export default function UpdateOrderForm({ order }: { order: Order }) {
  const [status, setStatus] = useState<OrderStatus>(order.status);
  const [trackingNumber, setTrackingNumber] = useState(order.trackingNumber ?? "");
  const [trackingUrl, setTrackingUrl] = useState(order.trackingUrl ?? "");
  const [adminNotes, setAdminNotes] = useState(order.adminNotes ?? "");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  async function handleSave() {
    setSaving(true);
    setSaved(false);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${order.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status,
          trackingNumber: trackingNumber.trim() || null,
          trackingUrl: trackingUrl.trim() || null,
          adminNotes: adminNotes.trim() || null,
        }),
      });
      if (!res.ok) throw new Error("Failed to save");
      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch {
      setError("Failed to save changes.");
    } finally {
      setSaving(false);
    }
  }

  const showTracking = status === "shipped" || status === "delivered";

  return (
    <div className="bg-white border border-[#E8E3DC] p-6 space-y-5">
      <h2 className="text-base font-semibold text-[#1C1C1C]">Update Order</h2>

      {/* Status */}
      <div>
        <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium mb-1.5">
          Status
        </label>
        <select
          value={status}
          onChange={(e) => setStatus(e.target.value as OrderStatus)}
          className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] bg-[#F8F5F0] focus:outline-none focus:border-[#B5903A] transition-colors"
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* Tracking — only visible for shipped/delivered */}
      {showTracking && (
        <>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium mb-1.5">
              Tracking Number
            </label>
            <input
              type="text"
              value={trackingNumber}
              onChange={(e) => setTrackingNumber(e.target.value)}
              placeholder="e.g. EF123456789IN"
              className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] bg-[#F8F5F0] focus:outline-none focus:border-[#B5903A] transition-colors"
            />
          </div>
          <div>
            <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium mb-1.5">
              Tracking URL
            </label>
            <input
              type="url"
              value={trackingUrl}
              onChange={(e) => setTrackingUrl(e.target.value)}
              placeholder="https://www.indiapost.gov.in/..."
              className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] bg-[#F8F5F0] focus:outline-none focus:border-[#B5903A] transition-colors"
            />
          </div>
        </>
      )}

      {/* Admin notes */}
      <div>
        <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium mb-1.5">
          Internal Notes
        </label>
        <textarea
          value={adminNotes}
          onChange={(e) => setAdminNotes(e.target.value)}
          rows={3}
          placeholder="Notes visible only to admins..."
          className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] bg-[#F8F5F0] focus:outline-none focus:border-[#B5903A] transition-colors resize-none"
        />
      </div>

      {error && <p className="text-xs text-red-600">{error}</p>}

      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-6 py-3 font-medium hover:bg-[#B5903A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {saving ? "Saving..." : saved ? "Saved ✓" : "Save Changes"}
      </button>
    </div>
  );
}
