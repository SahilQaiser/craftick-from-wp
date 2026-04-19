import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Order Confirmed — Craftick",
};

export default function OrderSuccessPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0] flex items-center justify-center">
        <div className="max-w-lg mx-auto px-4 py-24 text-center">
          <div className="text-[#B5903A] text-5xl mb-6">✦</div>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[#1C1C1C] font-light mb-4">
            Thank You
          </h1>
          <p className="text-[#4A4440] text-base font-[family-name:var(--font-heading)] italic mb-2">
            Your order has been confirmed.
          </p>
          <p className="text-sm text-[#6B6560] font-[family-name:var(--font-body)] leading-relaxed mb-10">
            A confirmation will be sent to your email shortly. Our team will
            process your order and be in touch with shipping details.
          </p>
          <div className="h-px bg-[#E8E3DC] mb-10" />
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
        </div>
      </main>
      <Footer />
    </>
  );
}
