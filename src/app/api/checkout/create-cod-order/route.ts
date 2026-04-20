import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { createOrder, reserveInventory, releaseInventory, getSetting } from "@/lib/db";
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
  const { env } = await getCloudflareContext({ async: true });
  
  // Verify COD is actually enabled globally before proceeding
  const codSetting = await getSetting(env.DB, "enable_cod", "false");
  if (codSetting !== "true") {
    return NextResponse.json({ error: "Cash on Delivery is currently disabled." }, { status: 403 });
  }

  const body = (await request.json()) as RequestBody;
  const { items, customer } = body;

  if (!items?.length || !customer?.name || !customer?.email || !customer?.phone || !customer?.address) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Reserve inventory for each item
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

  try {
    // We generate a dummy razorpayOrderId for COD orders to satisfy the UNIQUE constraint.
    const fakeRazorpayId = `COD_${Date.now()}_${Math.floor(Math.random() * 1000)}`;

    const order = await createOrder(env.DB, {
      razorpayOrderId: fakeRazorpayId,
      customerName: customer.name,
      customerEmail: customer.email,
      customerPhone: customer.phone,
      customerAddress: customer.address,
      items,
      amount: amountINR,
      paymentMethod: "cod"
    });

    // Since it's COD, we don't have a payment verification step.
    // We update the status immediately to 'processing'.
    // (We could also just change createOrder to take an initial status)
    await env.DB.prepare("UPDATE orders SET status = 'processing', updated_at = datetime('now') WHERE id = ?")
      .bind(order.id)
      .run();

    return NextResponse.json({
      success: true,
      orderId: order.orderNumber,
      trackingId: fakeRazorpayId,
    });
  } catch (error) {
    console.error("Failed to create COD order:", error);
    // Rollback inventory
    await Promise.all(
      reserved.map((r) => releaseInventory(env.DB, r.productId, r.quantity))
    );
    return NextResponse.json({ error: "Failed to place order. Please try again." }, { status: 500 });
  }
}
