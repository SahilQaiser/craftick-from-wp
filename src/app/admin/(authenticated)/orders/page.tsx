import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getOrders } from "@/lib/db";
import { formatPrice } from "@/lib/products-static";

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

export default async function AdminOrdersPage() {
  const { env } = await getCloudflareContext({ async: true });
  const orders = await getOrders(env.DB);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">Orders</h1>
        <p className="text-sm text-[#6B6560] mt-1">{orders.length} orders</p>
      </div>

      <div className="bg-white border border-[#E8E3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F8F5F0]">
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">#</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Customer</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Items</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Amount</th>
                <th className="text-center px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Status</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Date</th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Razorpay ID</th>
                <th className="text-right px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {orders.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-12 text-[#8C8680]">
                    No orders yet.
                  </td>
                </tr>
              ) : (
                orders.map((order) => (
                  <tr key={order.id} className="hover:bg-[#F8F5F0] transition-colors">
                    <td className="px-4 py-3 text-[#4A4440] font-mono text-xs">#{order.id}</td>
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1C1C1C]">{order.customerName}</p>
                      <p className="text-xs text-[#8C8680] mt-0.5">{order.customerEmail}</p>
                      <p className="text-xs text-[#8C8680]">{order.customerPhone}</p>
                    </td>
                    <td className="px-4 py-3">
                      <ul className="space-y-0.5">
                        {order.items.map((item, i) => (
                          <li key={i} className="text-xs text-[#4A4440]">
                            {item.title}{" "}
                            <span className="text-[#8C8680]">× {item.quantity}</span>
                          </li>
                        ))}
                      </ul>
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-[#1C1C1C]">
                      {formatPrice(order.amount)}
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span
                        className={`inline-block text-[10px] border px-2 py-0.5 font-medium tracking-wide uppercase ${
                          STATUS_STYLES[order.status] ?? "bg-gray-50 border-gray-200 text-gray-600"
                        }`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs text-[#6B6560]">
                      {new Date(order.createdAt).toLocaleDateString("en-IN", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-[#8C8680] max-w-[140px] truncate">
                      {order.razorpayPaymentId ?? <span className="text-[#C8C3BC]">—</span>}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${order.id}`}
                        className="text-xs text-[#B5903A] hover:underline font-medium"
                      >
                        View
                      </Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
