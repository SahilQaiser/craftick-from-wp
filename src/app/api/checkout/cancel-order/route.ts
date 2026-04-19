import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { cancelOrder, releaseInventory } from "@/lib/db";

export async function POST(request: NextRequest) {
  const { razorpayOrderId } = (await request.json()) as { razorpayOrderId: string };

  if (!razorpayOrderId) {
    return NextResponse.json({ error: "Missing razorpayOrderId" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });

  // cancelOrder only updates rows with status = 'pending', so it's safe to call
  // even if the payment somehow succeeded before this fires.
  const order = await cancelOrder(env.DB, razorpayOrderId);

  if (order) {
    // Release the inventory that was reserved when the order was created
    await Promise.all(
      order.items.map((item) => releaseInventory(env.DB, item.productId, item.quantity))
    );
  }

  return NextResponse.json({ ok: true });
}
