"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  productId: number;
  initialInventory: number;
}

export default function InventoryControl({ productId, initialInventory }: Props) {
  const router = useRouter();
  const [inventory, setInventory] = useState(initialInventory);
  const [loading, setLoading] = useState(false);

  async function adjust(delta: number) {
    if (loading) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}/inventory`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ delta }),
      });
      if (res.ok) {
        const updated = await res.json() as { inventory?: number };
        setInventory(updated.inventory ?? 0);
        router.refresh();
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => adjust(-1)}
        disabled={loading || inventory <= 0}
        className="w-6 h-6 flex items-center justify-center border border-[#E8E3DC] text-[#4A4440] hover:bg-[#F8F5F0] disabled:opacity-40 text-sm font-bold transition-colors"
        aria-label="Decrease inventory"
      >
        −
      </button>
      <span className="w-10 text-center text-sm font-medium text-[#1C1C1C]">{inventory}</span>
      <button
        onClick={() => adjust(1)}
        disabled={loading}
        className="w-6 h-6 flex items-center justify-center border border-[#E8E3DC] text-[#4A4440] hover:bg-[#F8F5F0] disabled:opacity-40 text-sm font-bold transition-colors"
        aria-label="Increase inventory"
      >
        +
      </button>
    </div>
  );
}
