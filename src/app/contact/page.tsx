import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "Contact — Craftick",
  description:
    "Get in touch with Craftick for enquiries about our handcrafted Kashmiri pieces.",
};

export default function ContactPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0]">
        <div className="pt-28 pb-20 px-4 sm:px-6">
          <div className="max-w-2xl mx-auto">
            <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-3">
              Get in Touch
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[#1C1C1C] font-light mb-4">
              Contact Us
            </h1>
            <p className="text-[#6B6560] text-sm leading-relaxed font-[family-name:var(--font-body)] mb-12">
              Whether you have a question about a specific piece, want to place a custom order, or simply want to know more about our craft — we&apos;d love to hear from you.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
              <div className="bg-white p-6 border border-[#E8E3DC]">
                <h3 className="font-[family-name:var(--font-heading)] text-lg text-[#1C1C1C] font-medium mb-2">
                  Website
                </h3>
                <a
                  href="https://craftick.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-[#B5903A] hover:underline font-[family-name:var(--font-body)]"
                >
                  www.craftick.in
                </a>
              </div>
              <div className="bg-white p-6 border border-[#E8E3DC]">
                <h3 className="font-[family-name:var(--font-heading)] text-lg text-[#1C1C1C] font-medium mb-2">
                  Location
                </h3>
                <p className="text-sm text-[#6B6560] font-[family-name:var(--font-body)]">
                  Kashmir, India
                </p>
              </div>
            </div>

            {/* Contact form */}
            <div className="bg-white border border-[#E8E3DC] p-8">
              <h2 className="font-[family-name:var(--font-heading)] text-2xl text-[#1C1C1C] font-light mb-6">
                Send a Message
              </h2>
              <form className="space-y-5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#6B6560] font-medium font-[family-name:var(--font-body)] mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="w-full border border-[#E8E3DC] bg-[#F8F5F0] px-4 py-3 text-sm text-[#1C1C1C] placeholder-[#A09890] focus:outline-none focus:border-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
                      placeholder="Your name"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] tracking-widest uppercase text-[#6B6560] font-medium font-[family-name:var(--font-body)] mb-2">
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="w-full border border-[#E8E3DC] bg-[#F8F5F0] px-4 py-3 text-sm text-[#1C1C1C] placeholder-[#A09890] focus:outline-none focus:border-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
                      placeholder="your@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#6B6560] font-medium font-[family-name:var(--font-body)] mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    className="w-full border border-[#E8E3DC] bg-[#F8F5F0] px-4 py-3 text-sm text-[#1C1C1C] placeholder-[#A09890] focus:outline-none focus:border-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
                    placeholder="Product enquiry, custom order..."
                  />
                </div>
                <div>
                  <label className="block text-[10px] tracking-widest uppercase text-[#6B6560] font-medium font-[family-name:var(--font-body)] mb-2">
                    Message
                  </label>
                  <textarea
                    name="message"
                    rows={5}
                    className="w-full border border-[#E8E3DC] bg-[#F8F5F0] px-4 py-3 text-sm text-[#1C1C1C] placeholder-[#A09890] focus:outline-none focus:border-[#B5903A] transition-colors resize-none font-[family-name:var(--font-body)]"
                    placeholder="Tell us about your enquiry..."
                  />
                </div>
                <button
                  type="submit"
                  className="w-full bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
                >
                  Send Message
                </button>
              </form>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
