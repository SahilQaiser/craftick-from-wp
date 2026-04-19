"use client";

import { useState } from "react";
import { useCart } from "@/contexts/CartContext";
import type { Product } from "@/lib/products-static";

export default function AddToCartButton({ product }: { product: Product }) {
  const { addToCart } = useCart();
  const [added, setAdded] = useState(false);

  if (product.outOfStock) {
    return (
      <button
        disabled
        className="flex-1 bg-[#E8E3DC] text-[#8C8680] text-xs tracking-widest uppercase px-8 py-4 font-medium cursor-not-allowed text-center font-[family-name:var(--font-body)]"
      >
        Sold Out
      </button>
    );
  }

  function handleClick() {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  }

  return (
    <button
      onClick={handleClick}
      className="flex-1 bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-[#B5903A] transition-colors text-center font-[family-name:var(--font-body)]"
    >
      {added ? "Added to Cart ✓" : "Add to Cart"}
    </button>
  );
}
