import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Order Confirmed — Craftick",
};

interface Props {
  searchParams: Promise<{ id?: string; track?: string }>;
}

export default async function OrderSuccessPage({ searchParams }: Props) {
  const { id, track } = await searchParams;

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0] flex items-center justify-center pt-16">
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="text-[#B5903A] text-5xl mb-6">✦</div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[#1C1C1C] font-light mb-4">
            Thank You
          </h1>
          <p className="text-[#4A4440] text-base font-[family-name:var(--font-heading)] italic mb-2">
            Your order has been confirmed.
          </p>
          {id && (
            <p className="text-sm text-[#6B6560] font-[family-name:var(--font-body)] mb-1">
              Order <span className="font-semibold text-[#1C1C1C]">{id}</span>
            </p>
          )}
          <p className="text-sm text-[#6B6560] font-[family-name:var(--font-body)] leading-relaxed mb-10">
            Our team will process your order and be in touch with shipping details.
          </p>

          <div className="h-px bg-[#E8E3DC] mb-8" />

          {track && (
            <Link
              href={`/track/${track}`}
              className="inline-block w-full bg-[#B5903A] text-white text-xs tracking-widest uppercase px-10 py-4 font-medium hover:bg-[#1C1C1C] transition-colors font-[family-name:var(--font-body)] mb-3"
            >
              Track Your Order
            </Link>
          )}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href="/shop"
              className="bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-10 py-4 font-medium hover:bg-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
            >
              Continue Shopping
            </Link>
            <Link
              href="/contact"
              className="border border-[#E8E3DC] text-[#4A4440] text-xs tracking-widest uppercase px-10 py-4 font-medium hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors font-[family-name:var(--font-body)]"
            >
              Contact Us
            </Link>
          </div>

          {track && (
            <p className="text-[10px] text-[#8C8680] font-[family-name:var(--font-body)] mt-6">
              Bookmark your tracking link:{" "}
              <span className="font-mono text-[#6B6560]">/track/{track}</span>
            </p>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
