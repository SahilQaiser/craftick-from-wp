import { notFound } from "next/navigation";
import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getOrderById } from "@/lib/db";
import { formatPrice } from "@/lib/products-static";
import UpdateOrderForm from "@/components/admin/UpdateOrderForm";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  paid: "bg-blue-50 border-blue-200 text-blue-700",
  processing: "bg-purple-50 border-purple-200 text-purple-700",
  shipped: "bg-indigo-50 border-indigo-200 text-indigo-700",
  delivered: "bg-green-50 border-green-200 text-green-700",
  cancelled: "bg-red-50 border-red-200 text-red-600",
  refunded: "bg-gray-50 border-gray-200 text-gray-600",
  pending: "bg-yellow-50 border-yellow-200 text-yellow-700",
  failed: "bg-red-50 border-red-200 text-red-600",
};

interface Props {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderDetailPage({ params }: Props) {
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const order = await getOrderById(env.DB, parseInt(id, 10));
  if (!order) notFound();

  return (
    <div className="p-8 max-w-5xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-[#8C8680] mb-6">
        <Link href="/admin/orders" className="hover:text-[#B5903A] transition-colors">Orders</Link>
        <span>/</span>
        <span className="text-[#1C1C1C] font-medium">Order {order.orderNumber}</span>
      </div>

      <div className="flex items-start justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Order {order.orderNumber}</h1>
          <p className="text-sm text-[#6B6560] mt-1">
            {new Date(order.createdAt).toLocaleDateString("en-IN", {
              day: "numeric", month: "long", year: "numeric", hour: "2-digit", minute: "2-digit",
            })}
          </p>
        </div>
        <span className={`inline-block text-[10px] border px-3 py-1.5 font-medium tracking-widest uppercase ${STATUS_STYLES[order.status] ?? ""}`}>
          {order.status}
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: order details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Items */}
          <div className="bg-white border border-[#E8E3DC] overflow-hidden">
            <div className="px-5 py-3 border-b border-[#E8E3DC] bg-[#F8F5F0]">
              <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6560]">Items</h2>
            </div>
            <table className="w-full text-sm">
              <tbody className="divide-y divide-[#E8E3DC]">
                {order.items.map((item, i) => (
                  <tr key={i}>
                    <td className="px-5 py-3 text-[#1C1C1C] font-medium">{item.title}</td>
                    <td className="px-5 py-3 text-[#8C8680] text-center">× {item.quantity}</td>
                    <td className="px-5 py-3 text-right text-[#1C1C1C]">{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
                <tr className="bg-[#F8F5F0]">
                  <td className="px-5 py-3 font-semibold text-[#1C1C1C]" colSpan={2}>Total</td>
                  <td className="px-5 py-3 text-right font-semibold text-[#1C1C1C]">{formatPrice(order.amount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Customer */}
          <div className="bg-white border border-[#E8E3DC] p-5">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6560] mb-4">Customer</h2>
            <dl className="grid grid-cols-2 gap-x-6 gap-y-3 text-sm">
              {[
                ["Name", order.customerName],
                ["Email", order.customerEmail],
                ["Phone", order.customerPhone],
                ["Address", order.customerAddress],
              ].map(([label, value]) => (
                <div key={label} className={label === "Address" ? "col-span-2" : ""}>
                  <dt className="text-[10px] tracking-widest uppercase text-[#8C8680] font-medium mb-0.5">{label}</dt>
                  <dd className="text-[#1C1C1C] whitespace-pre-line">{value}</dd>
                </div>
              ))}
            </dl>
          </div>

          {/* Payment */}
          <div className="bg-white border border-[#E8E3DC] p-5">
            <h2 className="text-xs font-semibold tracking-widest uppercase text-[#6B6560] mb-4">Payment</h2>
            <dl className="space-y-2 text-sm">
              <div className="flex justify-between">
                <dt className="text-[#8C8680]">Razorpay Order ID</dt>
                <dd className="font-mono text-xs text-[#4A4440]">{order.razorpayOrderId}</dd>
              </div>
              {order.razorpayPaymentId && (
                <div className="flex justify-between">
                  <dt className="text-[#8C8680]">Payment ID</dt>
                  <dd className="font-mono text-xs text-[#4A4440]">{order.razorpayPaymentId}</dd>
                </div>
              )}
              {order.trackingNumber && (
                <div className="flex justify-between">
                  <dt className="text-[#8C8680]">Tracking</dt>
                  <dd className="font-mono text-xs text-[#4A4440]">{order.trackingNumber}</dd>
                </div>
              )}
            </dl>
          </div>

          {/* Public tracking link */}
          <div className="bg-[#F8F5F0] border border-[#E8E3DC] p-4 text-xs text-[#6B6560]">
            <span className="font-medium text-[#4A4440]">Customer tracking link: </span>
            <a
              href={`/track/${order.razorpayOrderId}`}
              target="_blank"
              rel="noopener"
              className="text-[#B5903A] hover:underline font-mono"
            >
              /track/{order.razorpayOrderId}
            </a>
          </div>
        </div>

        {/* Right: update form */}
        <div>
          <UpdateOrderForm order={order} />
        </div>
      </div>
    </div>
  );
}
