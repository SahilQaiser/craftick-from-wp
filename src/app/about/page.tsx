import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata = {
  title: "About — Craftick",
  description:
    "Craftick brings authentic Kashmiri handcrafts to the world — connecting you with the artisans who craft each piece with centuries of tradition.",
};

export default function AboutPage() {
  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0]">
        {/* Hero */}
        <div className="relative h-[60vh] md:h-[70vh] overflow-hidden bg-[#2C2420]">
          <Image
            src="/images/products/41.jpg"
            alt="Kashmiri artisan at work"
            fill
            className="object-cover object-top opacity-50"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/80 to-transparent" />
          <div className="absolute inset-0 flex flex-col items-center justify-end pb-16 px-4 text-center">
            <p className="text-[#D4AF6A] text-[10px] tracking-[0.4em] uppercase font-medium font-[family-name:var(--font-body)] mb-4">
              Our Story
            </p>
            <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl text-white font-light">
              Craftick
            </h1>
            <p className="text-white/70 text-base font-[family-name:var(--font-heading)] italic mt-3">
              Handcrafted in Kashmir
            </p>
          </div>
        </div>

        {/* About content */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 py-16 md:py-24">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-20">
            <div className="md:col-span-3 space-y-6">
              <p className="font-[family-name:var(--font-heading)] text-2xl text-[#1C1C1C] font-light leading-relaxed">
                Craftick was born from a deep love for the handcrafted traditions of Kashmir — and a desire to share them with the world.
              </p>
              <p className="text-[#6B6560] text-sm leading-relaxed font-[family-name:var(--font-body)]">
                We operate as{" "}
                <a
                  href="https://craftick.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#B5903A] hover:underline"
                >
                  craftick.in
                </a>
                , bridging the gap between Kashmir&apos;s master artisans and connoisseurs of fine handcraft everywhere. Every piece we offer is the product of months of patient, skilled work — not a factory, not a machine, but a human being with a needle, a thread, and a tradition.
              </p>
              <p className="text-[#6B6560] text-sm leading-relaxed font-[family-name:var(--font-body)]">
                From the high-altitude Changthangi pastures where our Pashmina wool originates, to the workshops of Srinagar where Tilla and Sozni embroidery take shape — every step of our supply chain is rooted in authenticity and respect for the artisan.
              </p>
            </div>
            <div className="md:col-span-2 relative aspect-[3/4] overflow-hidden bg-[#EDE8E1]">
              <Image
                src="/images/products/37.jpg"
                alt="Craftick Pashmina"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 40vw"
              />
            </div>
          </div>

          {/* Craft section */}
          <div id="craft" className="border-t border-[#E8E3DC] pt-16 mb-16">
            <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-3">
              The Craft
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[#1C1C1C] font-light mb-10">
              Centuries of Tradition
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
              {[
                {
                  title: "Pashmina",
                  body: "Pashmina is derived from the undercoat of the Changthangi goat, native to the high-altitude Changthang plateau of Ladakh. At an altitude of 14,000 feet, these goats develop an incredibly fine undercoat to survive the harsh winters. This fibre — finer than human hair — is what gives Pashmina its legendary softness and warmth.",
                },
                {
                  title: "Tilla Embroidery",
                  body: "Tilla embroidery uses fine metallic threads — traditionally of gold or silver — to create intricate patterns on Pashmina and fine wool. Originating from Central Asia and Persia, the craft was adopted and perfected by Kashmiri artisans over centuries. Each motif is carefully stitched by hand with a needle, requiring immense skill and patience.",
                },
                {
                  title: "Sozni Work",
                  body: "Sozni is the most delicate and time-consuming of Kashmiri embroidery traditions. Done with a single needle (sozni means needle in Kashmiri), the work uses fine silk or wool threads to fill in intricate designs. A full Sozni shawl can take an artisan two to three years to complete — making each piece a genuine heirloom.",
                },
                {
                  title: "Jamavaar",
                  body: "Jamavaar is a centuries-old tapestry weaving tradition of Kashmir. The name comes from Persian: 'Jama' (robe) and 'waar' (yardage). Traditionally woven on handlooms with silk and wool threads, Jamavaar shawls feature elaborate all-over patterns and are among the most prized and expensive Kashmiri textiles.",
                },
              ].map((item) => (
                <div key={item.title}>
                  <h3 className="font-[family-name:var(--font-heading)] text-xl text-[#1C1C1C] font-medium mb-3">
                    {item.title}
                  </h3>
                  <p className="text-[#6B6560] text-sm leading-relaxed font-[family-name:var(--font-body)]">
                    {item.body}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center py-10 border-t border-[#E8E3DC]">
            <Link
              href="/shop"
              className="inline-block bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-10 py-4 font-medium hover:bg-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
            >
              Explore the Collection
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
