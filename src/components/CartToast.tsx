"use client";

import Link from "next/link";
import { useCart } from "@/contexts/CartContext";

export default function CartToast() {
  const { toast } = useCart();

  return (
    <div
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-[9999] transition-all duration-300 ${
        toast ? "opacity-100 translate-y-0" : "opacity-0 translate-y-3 pointer-events-none"
      }`}
    >
      <div className="bg-[#1C1C1C] text-white shadow-lg flex items-center gap-4 px-5 py-3.5 min-w-[240px] max-w-[320px]">
        <span className="text-[#B5903A] text-lg shrink-0">✓</span>
        <div className="flex-1 min-w-0">
          <p className="text-[10px] tracking-widest uppercase font-medium font-[family-name:var(--font-body)] text-white/60 mb-0.5">
            Added to cart
          </p>
          <p className="text-sm font-[family-name:var(--font-heading)] text-white truncate leading-snug">
            {toast?.title}
          </p>
        </div>
        <Link
          href="/cart"
          className="text-[10px] tracking-widest uppercase font-medium text-[#B5903A] hover:text-white transition-colors shrink-0 font-[family-name:var(--font-body)]"
        >
          View
        </Link>
      </div>
    </div>
  );
}
