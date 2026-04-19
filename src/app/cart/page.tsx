"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useCart } from "@/contexts/CartContext";
import { formatPrice } from "@/lib/products-static";

declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CartPage() {
  const router = useRouter();
  const { items, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rzpReady, setRzpReady] = useState(false);

  // Load Razorpay checkout.js
  useEffect(() => {
    if (document.getElementById("razorpay-script")) {
      setRzpReady(true);
      return;
    }
    const script = document.createElement("script");
    script.id = "razorpay-script";
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => setRzpReady(true);
    document.body.appendChild(script);
  }, []);

  async function handleCheckout() {
    setError("");
    if (!name.trim() || !email.trim() || !phone.trim() || !address.trim()) {
      setError("Please fill in all customer details.");
      return;
    }
    if (!rzpReady) {
      setError("Payment is loading, please try again in a moment.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items,
          customer: { name, email, phone, address },
        }),
      });

      if (!res.ok) {
        const data = await res.json() as { error?: string };
        throw new Error(data.error ?? "Failed to initiate payment");
      }

      const order = await res.json() as {
        razorpayOrderId: string;
        amount: number;
        currency: string;
        keyId: string;
      };

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        order_id: order.razorpayOrderId,
        name: "Craftick",
        description: `Order for ${items.length} item${items.length > 1 ? "s" : ""}`,
        prefill: { name, email, contact: phone },
        theme: { color: "#B5903A" },
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              items,
            }),
          });

          if (verifyRes.ok) {
            const data = await verifyRes.json() as { orderId: number; razorpayOrderId: string };
            clearCart();
            router.push(`/order-success?id=${data.orderId}&track=${data.razorpayOrderId}`);
          } else {
            setError("Payment verification failed. Please contact us.");
          }
        },
        modal: {
          ondismiss: () => {
            // Release the reserved inventory so it becomes available again
            fetch("/api/checkout/cancel-order", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ razorpayOrderId: order.razorpayOrderId }),
            }).catch(() => {/* best-effort */});
            setLoading(false);
          },
        },
      });

      rzp.open();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
      setLoading(false);
    }
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0]">
        {/* Top bar */}
        <div className="pt-24 pb-4 bg-white border-b border-[#E8E3DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#8C8680] font-[family-name:var(--font-body)]">
              <Link href="/" className="hover:text-[#B5903A] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#4A4440]">Your Cart</span>
            </nav>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-[family-name:var(--font-heading)] text-4xl text-[#1C1C1C] font-light mb-10">
            Your Cart
          </h1>

          {items.length === 0 ? (
            <div className="text-center py-24">
              <p className="font-[family-name:var(--font-heading)] text-2xl text-[#4A4440] font-light mb-6">
                Your cart is empty
              </p>
              <Link
                href="/shop"
                className="inline-block bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-10 py-4 font-medium hover:bg-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
              >
                Continue Shopping
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
              {/* Cart items */}
              <div className="lg:col-span-2 space-y-0">
                <div className="hidden sm:grid grid-cols-[2fr_1fr_1fr_auto] gap-4 pb-3 border-b border-[#E8E3DC] text-[10px] tracking-widest uppercase text-[#8C8680] font-medium font-[family-name:var(--font-body)]">
                  <span>Product</span>
                  <span className="text-center">Quantity</span>
                  <span className="text-right">Total</span>
                  <span />
                </div>

                {items.map((item) => (
                  <div
                    key={item.productId}
                    className="grid grid-cols-1 sm:grid-cols-[2fr_1fr_1fr_auto] gap-4 items-center py-6 border-b border-[#E8E3DC]"
                  >
                    {/* Product info */}
                    <div className="flex items-center gap-4">
                      <div className="relative w-20 h-24 shrink-0 bg-[#EDE8E1] overflow-hidden">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          className="object-cover object-top"
                          sizes="80px"
                        />
                      </div>
                      <div>
                        <Link
                          href={`/shop/${item.slug}`}
                          className="font-[family-name:var(--font-heading)] text-base text-[#1C1C1C] hover:text-[#B5903A] transition-colors leading-snug block"
                        >
                          {item.title}
                        </Link>
                        <p className="text-xs text-[#8C8680] font-[family-name:var(--font-body)] italic mt-0.5">
                          {item.subtitle}
                        </p>
                        <p className="text-sm text-[#4A4440] font-[family-name:var(--font-body)] mt-1">
                          {formatPrice(item.price)}
                        </p>
                      </div>
                    </div>

                    {/* Quantity stepper */}
                    <div className="flex items-center justify-center sm:justify-center gap-2">
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                        className="w-8 h-8 border border-[#E8E3DC] text-[#4A4440] hover:border-[#1C1C1C] disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-medium"
                      >
                        −
                      </button>
                      <span className="w-8 text-center text-sm font-medium font-[family-name:var(--font-body)] text-[#1C1C1C]">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-8 h-8 border border-[#E8E3DC] text-[#4A4440] hover:border-[#1C1C1C] transition-colors text-sm font-medium"
                      >
                        +
                      </button>
                    </div>

                    {/* Line total */}
                    <div className="text-right font-[family-name:var(--font-heading)] text-base text-[#1C1C1C]">
                      {formatPrice(item.price * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.productId)}
                      aria-label="Remove item"
                      className="text-[#8C8680] hover:text-[#1C1C1C] transition-colors text-lg leading-none self-start sm:self-center"
                    >
                      ×
                    </button>
                  </div>
                ))}

                <div className="pt-4">
                  <Link
                    href="/shop"
                    className="text-xs tracking-widest uppercase text-[#4A4440] hover:text-[#B5903A] transition-colors font-medium font-[family-name:var(--font-body)]"
                  >
                    ← Continue Shopping
                  </Link>
                </div>
              </div>

              {/* Sidebar: summary + customer form */}
              <div className="space-y-6">
                {/* Order summary */}
                <div className="bg-white border border-[#E8E3DC] p-6">
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#1C1C1C] font-light mb-4">
                    Order Summary
                  </h2>
                  <div className="space-y-3 text-sm font-[family-name:var(--font-body)]">
                    <div className="flex justify-between text-[#4A4440]">
                      <span>Subtotal</span>
                      <span>{formatPrice(totalPrice)}</span>
                    </div>
                    <div className="flex justify-between text-[#8C8680]">
                      <span>Shipping</span>
                      <span className="text-xs">Calculated at checkout</span>
                    </div>
                    <div className="flex justify-between text-[#8C8680] text-xs">
                      <span>Taxes</span>
                      <span>Included</span>
                    </div>
                    <div className="h-px bg-[#E8E3DC] my-2" />
                    <div className="flex justify-between font-medium text-[#1C1C1C] text-base">
                      <span>Total</span>
                      <span className="font-[family-name:var(--font-heading)]">{formatPrice(totalPrice)}</span>
                    </div>
                  </div>
                </div>

                {/* Customer details form */}
                <div className="bg-white border border-[#E8E3DC] p-6">
                  <h2 className="font-[family-name:var(--font-heading)] text-xl text-[#1C1C1C] font-light mb-4">
                    Shipping Details
                  </h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium font-[family-name:var(--font-body)] mb-1.5">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] font-[family-name:var(--font-body)] focus:outline-none focus:border-[#B5903A] transition-colors bg-[#F8F5F0]"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium font-[family-name:var(--font-body)] mb-1.5">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] font-[family-name:var(--font-body)] focus:outline-none focus:border-[#B5903A] transition-colors bg-[#F8F5F0]"
                        placeholder="you@example.com"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium font-[family-name:var(--font-body)] mb-1.5">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] font-[family-name:var(--font-body)] focus:outline-none focus:border-[#B5903A] transition-colors bg-[#F8F5F0]"
                        placeholder="+91 98765 43210"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium font-[family-name:var(--font-body)] mb-1.5">
                        Shipping Address *
                      </label>
                      <textarea
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        rows={3}
                        className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] font-[family-name:var(--font-body)] focus:outline-none focus:border-[#B5903A] transition-colors bg-[#F8F5F0] resize-none"
                        placeholder="Street, City, State, PIN, Country"
                      />
                    </div>
                  </div>

                  {error && (
                    <p className="mt-4 text-xs text-red-600 font-[family-name:var(--font-body)]">
                      {error}
                    </p>
                  )}

                  <button
                    onClick={handleCheckout}
                    disabled={loading}
                    className="mt-6 w-full bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-[#B5903A] transition-colors disabled:opacity-60 disabled:cursor-not-allowed font-[family-name:var(--font-body)]"
                  >
                    {loading ? "Processing..." : "Proceed to Pay"}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
