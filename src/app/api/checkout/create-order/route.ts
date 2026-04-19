import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createOrder } from "@/lib/db";
import type { CartItem } from "@/contexts/CartContext";

type RequestBody = {
  items: CartItem[];
  customer: {
    name: string;
    email: string;
    phone: string;
    address: string;
  };
};

export async function POST(request: NextRequest) {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    return NextResponse.json(
      { error: "Payment service not configured" },
      { status: 503 }
    );
  }

  const body = (await request.json()) as RequestBody;
  const { items, customer } = body;

  if (!items?.length || !customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const amountINR = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const amountPaise = amountINR * 100;

  // Create Razorpay order via REST API (no SDK — Cloudflare Workers compatible)
  const credentials = btoa(`${keyId}:${keySecret}`);
  const rzpResponse = await fetch("https://api.razorpay.com/v1/orders", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Basic ${credentials}`,
    },
    body: JSON.stringify({
      amount: amountPaise,
      currency: "INR",
      receipt: `craftick_${Date.now()}`,
    }),
  });

  if (!rzpResponse.ok) {
    const err = await rzpResponse.text();
    console.error("Razorpay create order failed:", err);
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 502 });
  }

  const rzpOrder = (await rzpResponse.json()) as { id: string };

  const { env } = await getCloudflareContext({ async: true });
  await createOrder(env.DB, {
    razorpayOrderId: rzpOrder.id,
    customerName: customer.name,
    customerEmail: customer.email,
    customerPhone: customer.phone,
    customerAddress: customer.address,
    items,
    amount: amountINR,
  });

  return NextResponse.json({
    razorpayOrderId: rzpOrder.id,
    amount: amountPaise,
    currency: "INR",
    keyId,
  });
}
