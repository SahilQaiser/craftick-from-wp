import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createOrder, reserveInventory, releaseInventory } from "@/lib/db";
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

  const { env } = await getCloudflareContext({ async: true });

  // Atomically reserve inventory for each item before touching Razorpay.
  // This ensures two simultaneous orders for the last unit can't both succeed.
  const reserved: CartItem[] = [];
  for (const item of items) {
    const product = await reserveInventory(env.DB, item.productId, item.quantity);
    if (!product) {
      // Roll back reservations already made for earlier items in this order
      await Promise.all(
        reserved.map((r) => releaseInventory(env.DB, r.productId, r.quantity))
      );
      return NextResponse.json(
        { error: `"${item.title}" is out of stock or has insufficient inventory.` },
        { status: 409 }
      );
    }
    reserved.push(item);
  }

  const amountINR = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const amountPaise = amountINR * 100;

  // Create Razorpay order. If this fails, release all reservations.
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
    await Promise.all(
      reserved.map((r) => releaseInventory(env.DB, r.productId, r.quantity))
    );
    return NextResponse.json({ error: "Failed to create payment order" }, { status: 502 });
  }

  const rzpOrder = (await rzpResponse.json()) as { id: string };

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
