import { notFound } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getOrderByRazorpayId } from "@/lib/db";
import { formatPrice } from "@/lib/products-static";
import type { OrderStatus } from "@/lib/db";
import WhatsAppOrderButton from "@/components/WhatsAppOrderButton";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ orderId: string }>;
}

const TIMELINE = [
  { status: "paid" as OrderStatus, label: "Payment Confirmed", desc: "Your payment was received." },
  { status: "processing" as OrderStatus, label: "Processing", desc: "We are preparing your order." },
  { status: "shipped" as OrderStatus, label: "Shipped", desc: "Your order is on its way." },
  { status: "delivered" as OrderStatus, label: "Delivered", desc: "Order delivered successfully." },
];

const STATUS_RANK: Record<string, number> = {
  pending: 0, paid: 1, processing: 2, shipped: 3, delivered: 4,
};

const TERMINAL_STATUS: Partial<Record<OrderStatus, { label: string; color: string }>> = {
  cancelled: { label: "Order Cancelled", color: "text-red-600" },
  refunded: { label: "Order Refunded", color: "text-gray-600" },
  failed: { label: "Payment Failed", color: "text-red-600" },
  pending: { label: "Awaiting Payment", color: "text-yellow-600" },
};

export async function generateMetadata({ params }: Props) {
  const { orderId } = await params;
  return { title: `Track Order — Craftick`, description: `Track your Craftick order ${orderId}` };
}

export default async function TrackDetailPage({ params }: Props) {
  const { orderId } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const order = await getOrderByRazorpayId(env.DB, orderId);
  if (!order) notFound();

  const currentRank = STATUS_RANK[order.status] ?? -1;
  const terminal = TERMINAL_STATUS[order.status];

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="pt-36 pb-4 bg-white border-b border-[#E8E3DC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-xs text-[#8C8680] font-[family-name:var(--font-body)]">
              <Link href="/" className="hover:text-[#B5903A] transition-colors">Home</Link>
              <span>/</span>
              <Link href="/track" className="hover:text-[#B5903A] transition-colors">Track Order</Link>
              <span>/</span>
              <span className="text-[#4A4440]">Order {order.orderNumber}</span>
            </nav>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12">
          {/* Header */}
          <div className="mb-8">
            <p className="text-[10px] tracking-widest uppercase text-[#B5903A] font-medium font-[family-name:var(--font-body)] mb-2">
              Order {order.orderNumber}
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[#1C1C1C] font-light mb-1">
              Order Status
            </h1>
            <p className="text-sm text-[#8C8680] font-[family-name:var(--font-body)]">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-IN", {
                day: "numeric", month: "long", year: "numeric",
              })}
            </p>
          </div>

          {/* Terminal status banner (cancelled / refunded / failed / pending) */}
          {terminal && (
            <div className="bg-white border border-[#E8E3DC] p-5 mb-6 flex items-center gap-3">
              <span className="text-2xl">{order.status === "cancelled" || order.status === "failed" ? "✕" : order.status === "refunded" ? "↩" : "⏳"}</span>
              <div>
                <p className={`font-semibold text-sm ${terminal.color} font-[family-name:var(--font-body)]`}>{terminal.label}</p>
                {order.status === "cancelled" && (
                  <p className="text-xs text-[#8C8680] mt-0.5 font-[family-name:var(--font-body)]">
                    If you paid, a refund will be processed within 5–7 business days.
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Timeline */}
          {!terminal && (
            <div className="bg-white border border-[#E8E3DC] p-6 mb-6">
              <div className="relative">
                {TIMELINE.map((step, i) => {
                  const rank = STATUS_RANK[step.status] ?? 0;
                  const isComplete = rank <= currentRank;
                  const isCurrent = rank === currentRank;
                  const isLast = i === TIMELINE.length - 1;

                  return (
                    <div key={step.status} className="flex gap-4">
                      {/* Connector column */}
                      <div className="flex flex-col items-center">
                        <div
                          className={`w-8 h-8 rounded-full border-2 flex items-center justify-center shrink-0 ${
                            isComplete
                              ? "bg-[#B5903A] border-[#B5903A] text-white"
                              : "bg-white border-[#E8E3DC] text-[#C8C3BC]"
                          }`}
                        >
                          {isComplete ? (
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            </svg>
                          ) : (
                            <span className="text-xs font-bold">{i + 1}</span>
                          )}
                        </div>
                        {!isLast && (
                          <div className={`w-0.5 flex-1 my-1 ${isComplete && rank < currentRank ? "bg-[#B5903A]" : "bg-[#E8E3DC]"}`} style={{ minHeight: "2rem" }} />
                        )}
                      </div>

                      {/* Content */}
                      <div className={`pb-6 flex-1 ${isLast ? "pb-0" : ""}`}>
                        <p className={`text-sm font-semibold font-[family-name:var(--font-body)] ${isComplete ? "text-[#1C1C1C]" : "text-[#C8C3BC]"}`}>
                          {step.label}
                          {isCurrent && (
                            <span className="ml-2 text-[10px] tracking-widest uppercase bg-[#B5903A] text-white px-2 py-0.5 font-medium">
                              Current
                            </span>
                          )}
                        </p>
                        <p className={`text-xs mt-0.5 font-[family-name:var(--font-body)] ${isComplete ? "text-[#6B6560]" : "text-[#C8C3BC]"}`}>
                          {step.desc}
                        </p>
                        {/* Tracking info on Shipped step */}
                        {step.status === "shipped" && isComplete && order.trackingNumber && (
                          <div className="mt-2 bg-[#F8F5F0] border border-[#E8E3DC] p-3 inline-flex items-center gap-3">
                            <span className="text-xs text-[#8C8680] font-[family-name:var(--font-body)]">Tracking:</span>
                            <span className="font-mono text-xs text-[#1C1C1C] font-medium">{order.trackingNumber}</span>
                            {order.trackingUrl && (
                              <a
                                href={order.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] tracking-widest uppercase text-[#B5903A] hover:underline font-medium font-[family-name:var(--font-body)]"
                              >
                                Track →
                              </a>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Order items */}
          <div className="bg-white border border-[#E8E3DC] mb-6">
            <div className="px-5 py-3 border-b border-[#E8E3DC] bg-[#F8F5F0]">
              <h2 className="text-[10px] tracking-widest uppercase text-[#6B6560] font-semibold font-[family-name:var(--font-body)]">
                Items Ordered
              </h2>
            </div>
            <ul className="divide-y divide-[#E8E3DC]">
              {order.items.map((item, i) => (
                <li key={i} className="flex items-center justify-between px-5 py-3 text-sm">
                  <div>
                    <p className="font-medium text-[#1C1C1C] font-[family-name:var(--font-body)]">{item.title}</p>
                    <p className="text-xs text-[#8C8680] font-[family-name:var(--font-body)]">{item.subtitle} · Qty {item.quantity}</p>
                  </div>
                  <span className="text-[#1C1C1C] font-[family-name:var(--font-heading)]">
                    {formatPrice(item.price * item.quantity)}
                  </span>
                </li>
              ))}
            </ul>
            <div className="flex justify-between px-5 py-3 border-t border-[#E8E3DC] bg-[#F8F5F0] text-sm font-medium">
              <span className="text-[#4A4440] font-[family-name:var(--font-body)]">Total</span>
              <span className="text-[#1C1C1C] font-[family-name:var(--font-heading)]">{formatPrice(order.amount)}</span>
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Link
              href="/shop"
              className="bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-8 py-3.5 font-medium hover:bg-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
            >
              Continue Shopping
            </Link>
            <WhatsAppOrderButton orderNumber={order.orderNumber} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
