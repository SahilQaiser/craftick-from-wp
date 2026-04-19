import { redirect } from "next/navigation";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { searchOrder } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Track Your Order — Craftick",
};

interface Props {
  searchParams: Promise<{ email?: string; order?: string }>;
}

export default async function TrackPage({ searchParams }: Props) {
  const { email, order: orderIdStr } = await searchParams;

  let notFound = false;

  if (email && orderIdStr) {
    const orderId = parseInt(orderIdStr, 10);
    if (!isNaN(orderId)) {
      const { env } = await getCloudflareContext({ async: true });
      const order = await searchOrder(env.DB, orderId, email);
      if (order) {
        redirect(`/track/${order.razorpayOrderId}`);
      }
    }
    notFound = true;
  }

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="pt-24 pb-4 bg-white border-b border-[#E8E3DC]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center gap-2 text-xs text-[#8C8680] font-[family-name:var(--font-body)]">
              <Link href="/" className="hover:text-[#B5903A] transition-colors">Home</Link>
              <span>/</span>
              <span className="text-[#4A4440]">Track Order</span>
            </nav>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-16">
          <div className="max-w-md mx-auto">
            <h1 className="font-[family-name:var(--font-heading)] text-4xl text-[#1C1C1C] font-light mb-2 text-center">
              Track Your Order
            </h1>
            <p className="text-sm text-[#8C8680] font-[family-name:var(--font-body)] text-center mb-10">
              Enter your order number and email to view your order status.
            </p>

            <form method="GET" action="/track" className="bg-white border border-[#E8E3DC] p-6 space-y-5">
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium font-[family-name:var(--font-body)] mb-1.5">
                  Order Number
                </label>
                <input
                  type="number"
                  name="order"
                  defaultValue={orderIdStr}
                  required
                  min={1}
                  placeholder="e.g. 42"
                  className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] bg-[#F8F5F0] focus:outline-none focus:border-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
                />
              </div>
              <div>
                <label className="block text-[10px] tracking-widest uppercase text-[#8C8680] font-medium font-[family-name:var(--font-body)] mb-1.5">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  defaultValue={email}
                  required
                  placeholder="you@example.com"
                  className="w-full border border-[#E8E3DC] px-3 py-2.5 text-sm text-[#1C1C1C] bg-[#F8F5F0] focus:outline-none focus:border-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
                />
              </div>

              {notFound && (
                <p className="text-xs text-red-600 font-[family-name:var(--font-body)]">
                  No order found with that number and email. Please check your details.
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-6 py-3.5 font-medium hover:bg-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
              >
                Track Order
              </button>
            </form>

            <p className="text-center text-xs text-[#8C8680] mt-6 font-[family-name:var(--font-body)]">
              Have a direct tracking link from your confirmation page?{" "}
              <Link href="/contact" className="text-[#B5903A] hover:underline">
                Contact us
              </Link>{" "}
              if you need help.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
