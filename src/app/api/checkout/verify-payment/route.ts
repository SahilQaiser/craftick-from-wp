import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { updateOrderStatus, getProductById, updateProduct } from "@/lib/db";
import type { CartItem } from "@/contexts/CartContext";

type RequestBody = {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
  items: CartItem[];
};

async function verifyRazorpaySignature(
  orderId: string,
  paymentId: string,
  signature: string,
  keySecret: string
): Promise<boolean> {
  const message = `${orderId}|${paymentId}`;
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(keySecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sigBytes = await crypto.subtle.sign("HMAC", key, enc.encode(message));
  const expected = Array.from(new Uint8Array(sigBytes))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
  return expected === signature;
}

export async function POST(request: NextRequest) {
  const keySecret = process.env.RAZORPAY_KEY_SECRET;
  if (!keySecret) {
    return NextResponse.json({ error: "Payment service not configured" }, { status: 503 });
  }

  const body = (await request.json()) as RequestBody;
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature, items } = body;

  if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
    return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
  }

  const valid = await verifyRazorpaySignature(
    razorpay_order_id,
    razorpay_payment_id,
    razorpay_signature,
    keySecret
  );

  if (!valid) {
    return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });

  const order = await updateOrderStatus(env.DB, razorpay_order_id, "paid", razorpay_payment_id);
  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  // Inventory was already decremented atomically in create-order.
  // Just auto-mark products as out_of_stock if their inventory has reached 0.
  const cartItems: CartItem[] = items?.length ? items : order.items;
  await Promise.all(
    cartItems.map(async (item) => {
      const product = await getProductById(env.DB, item.productId);
      if (product && product.inventory === 0 && !product.outOfStock) {
        await updateProduct(env.DB, item.productId, { outOfStock: true });
      }
    })
  );

  return NextResponse.json({ success: true, orderId: order.id });
}
