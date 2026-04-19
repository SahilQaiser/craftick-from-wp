"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

interface Props {
  productId: number;
  productTitle: string;
}

export default function DeleteButton({ productId, productTitle }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/products/${productId}`, {
        method: "DELETE",
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setLoading(false);
      setConfirming(false);
    }
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-2">
        <span className="text-xs text-[#6B6560]">Delete &ldquo;{productTitle}&rdquo;?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs text-red-600 hover:underline font-medium disabled:opacity-50"
        >
          {loading ? "Deleting..." : "Yes, delete"}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs text-[#6B6560] hover:underline"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="text-xs text-red-500 hover:text-red-700 hover:underline transition-colors"
    >
      Delete
    </button>
  );
}
