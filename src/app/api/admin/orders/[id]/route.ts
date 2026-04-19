import { NextRequest, NextResponse } from "next/server";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { adminUpdateOrder } from "@/lib/db";
import type { OrderStatus } from "@/lib/db";

const VALID_STATUSES: OrderStatus[] = [
  "pending", "paid", "processing", "shipped", "delivered", "cancelled", "refunded", "failed",
];

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const orderId = parseInt(id, 10);
  if (isNaN(orderId)) {
    return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
  }

  const body = await request.json() as {
    status?: string;
    trackingNumber?: string;
    trackingUrl?: string;
    adminNotes?: string;
  };

  if (body.status && !VALID_STATUSES.includes(body.status as OrderStatus)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  const { env } = await getCloudflareContext({ async: true });
  const order = await adminUpdateOrder(env.DB, orderId, {
    status: body.status as OrderStatus | undefined,
    trackingNumber: body.trackingNumber ?? undefined,
    trackingUrl: body.trackingUrl ?? undefined,
    adminNotes: body.adminNotes ?? undefined,
  });

  if (!order) {
    return NextResponse.json({ error: "Order not found" }, { status: 404 });
  }

  return NextResponse.json(order);
}
