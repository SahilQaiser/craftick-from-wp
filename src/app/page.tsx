import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getFeaturedProducts } from "@/lib/db";
import { formatPrice } from "@/lib/products-static";

export const dynamic = "force-dynamic";

const craftStories = [
  {
    title: "Tilla Embroidery",
    description:
      "Tilla work uses fine metallic gold or silver threads to create intricate patterns on Pashmina. Originating in Central Asia, it was perfected by Kashmiri artisans over centuries.",
  },
  {
    title: "Sozni Work",
    description:
      "Sozni is Kashmir's finest needle embroidery, done with a single needle and thread. It takes months to complete one shawl, making each piece a labour of love.",
  },
  {
    title: "Pure Pashmina",
    description:
      "Sourced from the underbelly of Changthangi goats in the high Himalayas, Pashmina is finer than human hair and extraordinarily warm.",
  },
];

// Replace these with actual media mentions, awards, and recognitions
const pressItems = [
  "National Craft Council",
  "Outlook Traveller",
  "India Today",
  "Kashmir Times",
  "GI Certified Artisans",
];

export default async function Home() {
  const { env } = await getCloudflareContext({ async: true });
  const featured = await getFeaturedProducts(env.DB);

  return (
    <>
      <Header />
      <main>

        {/* ── Hero: light editorial split ── */}
        <section className="flex flex-col lg:flex-row min-h-screen">
          {/* Left: text */}
          <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 xl:px-24 py-20 lg:py-0 lg:w-[42%] xl:w-[40%] bg-[#F8F5F0] order-2 lg:order-1 lg:pt-44">
            <div className="max-w-md">
              <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-5">
                Handcrafted in Kashmir
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-6xl lg:text-7xl text-[#1C1C1C] font-light leading-[1.05] mb-6">
                The Art of{" "}
                <em className="italic text-[#6B6560]">Kashmiri</em>{" "}
                Craft
              </h1>
              <p className="text-[#6B6560] text-base leading-relaxed mb-10 font-[family-name:var(--font-body)] font-light">
                Each shawl is a canvas — woven from the finest Pashmina and
                embroidered by hand over months of dedicated artisanal work.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-block bg-[#1C1C1C] text-white text-[11px] tracking-widest uppercase px-8 py-4 font-medium hover:bg-[#B5903A] transition-colors duration-300 font-[family-name:var(--font-body)]"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/about"
                  className="inline-block border border-[#C8C3BC] text-[#4A4440] text-[11px] tracking-widest uppercase px-8 py-4 font-medium hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors duration-300 font-[family-name:var(--font-body)]"
                >
                  Our Story
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-6 mt-12 pt-8 border-t border-[#E8E3DC]">
                {["Handcrafted", "Authentic", "Worldwide Shipping"].map((t) => (
                  <div key={t} className="flex items-center gap-1.5 text-[10px] tracking-[0.15em] uppercase text-[#8C8680] font-[family-name:var(--font-body)]">
                    <span className="text-[#B5903A]">✦</span>
                    {t}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: full-bleed editorial image */}
          <div className="relative overflow-hidden lg:w-[58%] xl:w-[60%] order-1 lg:order-2 h-[65vw] sm:h-[55vw] lg:h-auto">
            <Image
              src="/images/products/13.jpg"
              alt="Kashmiri Pashmina Shawl"
              fill
              className="object-cover object-top"
              priority
              sizes="(max-width: 1024px) 100vw, 60vw"
            />
          </div>
        </section>

        {/* ── Press / Awards Strip ── */}
        <section className="bg-white border-y border-[#E8E3DC] py-8">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-center gap-5 sm:gap-0">
              <p className="shrink-0 text-[10px] tracking-[0.3em] uppercase text-[#8C8680] font-[family-name:var(--font-body)] sm:pr-8 sm:border-r sm:border-[#E8E3DC]">
                As Featured In
              </p>
              <div className="flex flex-wrap justify-center sm:justify-start items-center sm:pl-8 w-full">
                {pressItems.map((item, i) => (
                  <span key={item} className="flex items-center">
                    <span className="text-[11px] tracking-[0.2em] uppercase font-medium text-[#4A4440] font-[family-name:var(--font-body)] px-4 py-1 whitespace-nowrap">
                      {item}
                    </span>
                    {i < pressItems.length - 1 && (
                      <span className="text-[#B5903A] text-xs select-none">·</span>
                    )}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Categories ── */}
        <section className="py-20 md:py-28 bg-[#F8F5F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-3">
                Collections
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[#1C1C1C] font-light">
                Shop by Category
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {[
                { label: "Pashmina Shawls", slug: "pashmina-shawls", img: "/images/products/16.jpg" },
                { label: "Stoles & Scarves", slug: "stoles-and-scarves", img: "/images/products/emerald-green-tilla.jpg" },
                { label: "Sarees", slug: "sarees", img: "/images/products/blue-saree.jpg" },
              ].map((cat) => (
                <Link
                  key={cat.slug}
                  href={`/shop?category=${cat.slug}`}
                  className="group relative overflow-hidden aspect-[3/4] bg-[#EDE8E1]"
                >
                  <Image
                    src={cat.img}
                    alt={cat.label}
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-2xl text-white font-light mb-1">
                      {cat.label}
                    </h3>
                    <span className="inline-flex items-center gap-1.5 text-white/60 text-[10px] tracking-widest uppercase font-[family-name:var(--font-body)] group-hover:text-[#D4AF6A] transition-colors">
                      Explore
                      <svg className="w-3 h-3 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* ── Featured Products ── */}
        <section className="py-20 md:py-28 bg-[#F8F5F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-3">
                  Handpicked
                </p>
                <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[#1C1C1C] font-light">
                  Featured Pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#4A4440] hover:text-[#B5903A] transition-colors font-medium font-[family-name:var(--font-body)]"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12">
              {featured.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 3} />
              ))}
            </div>

            <div className="text-center mt-12 md:hidden">
              <Link
                href="/shop"
                className="inline-block border border-[#1C1C1C] text-[#1C1C1C] text-xs tracking-widest uppercase px-8 py-3.5 hover:bg-[#1C1C1C] hover:text-white transition-colors font-medium font-[family-name:var(--font-body)]"
              >
                View All Products
              </Link>
            </div>
          </div>
        </section>

        {/* ── Heritage Banner ── */}
        <section className="relative overflow-hidden bg-[#1C1C1C] py-24 md:py-32 border-t border-[#2C2C2C]">
          <div className="absolute inset-0 opacity-20">
            <Image
              src="/images/products/39.jpg"
              alt="Kashmiri craftsmanship"
              fill
              className="object-cover object-center"
              sizes="100vw"
            />
          </div>
          <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-[#D4AF6A] text-[10px] tracking-[0.4em] uppercase font-medium font-[family-name:var(--font-body)] mb-6">
              Kashmir Heritage
            </p>
            <blockquote className="font-[family-name:var(--font-heading)] text-3xl md:text-5xl text-white font-light italic leading-relaxed mb-8">
              &ldquo;Each shawl tells a story — woven in silence, embroidered with patience, worn with pride.&rdquo;
            </blockquote>
            <p className="text-[#8C8680] text-sm font-[family-name:var(--font-body)] leading-relaxed max-w-xl mx-auto">
              Craftick was born from a deep reverence for Kashmiri textile traditions. We work directly with artisan families to bring you pieces that honour centuries of craftsmanship.
            </p>
            <Link
              href="/about"
              className="inline-block mt-8 text-[#D4AF6A] text-xs tracking-widest uppercase font-medium hover:text-white transition-colors font-[family-name:var(--font-body)] border-b border-[#D4AF6A]/50 hover:border-white pb-0.5"
            >
              Read Our Story
            </Link>
          </div>
        </section>

        {/* ── Craft Stories ── */}
        <section className="py-20 md:py-28 bg-[#F8F5F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-3">
                The Craft
              </p>
              <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[#1C1C1C] font-light">
                Traditions of Kashmir
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
              {craftStories.map((story) => (
                <div key={story.title} className="border border-[#E8E3DC] p-8 bg-white text-center">
                  <div className="w-8 h-px bg-[#B5903A] mx-auto mb-6" />
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[#1C1C1C] font-medium mb-4">
                    {story.title}
                  </h3>
                  <p className="text-[#6B6560] text-sm leading-relaxed font-[family-name:var(--font-body)]">
                    {story.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── New Arrivals ── */}
        <section className="py-20 md:py-28 bg-[#F8F5F0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-end justify-between mb-12">
              <div>
                <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-3">
                  New Arrivals
                </p>
                <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[#1C1C1C] font-light">
                  Latest Pieces
                </h2>
              </div>
              <Link
                href="/shop"
                className="hidden md:inline-flex items-center gap-2 text-xs tracking-widest uppercase text-[#4A4440] hover:text-[#B5903A] transition-colors font-medium font-[family-name:var(--font-body)]"
              >
                View All
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </Link>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
              <Link
                href="/shop/sozni-print-jamavaar-pashmina"
                className="group relative overflow-hidden aspect-[4/5] bg-[#EDE8E1]"
              >
                <Image
                  src="/images/products/sozni-jamavaar.jpg"
                  alt="Sozni Print Jamavaar Pashmina"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8">
                  <p className="text-[#D4AF6A] text-[10px] tracking-widest uppercase font-medium font-[family-name:var(--font-body)] mb-2">
                    Jamavaar Collection
                  </p>
                  <h3 className="font-[family-name:var(--font-heading)] text-3xl text-white font-light leading-snug mb-2">
                    Sozni Print Jamavaar Pashmina
                  </h3>
                  <p className="text-white/80 text-sm font-[family-name:var(--font-body)]">
                    {formatPrice(48500)}
                  </p>
                </div>
              </Link>

              <div className="grid grid-cols-1 gap-4 md:gap-6">
                <Link
                  href="/shop/butidar-pashmina-shawl-wrap"
                  className="group relative overflow-hidden aspect-[16/9] bg-[#EDE8E1]"
                >
                  <Image
                    src="/images/products/butidar-pashmina.jpg"
                    alt="Butidar Pashmina Shawl Wrap"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-2xl text-white font-light">
                      Butidar Pashmina Wrap
                    </h3>
                    <p className="text-white/70 text-sm font-[family-name:var(--font-body)]">
                      {formatPrice(23500)}
                    </p>
                  </div>
                </Link>

                <Link
                  href="/shop/paldar-sozni-pashmina"
                  className="group relative overflow-hidden aspect-[16/9] bg-[#EDE8E1]"
                >
                  <Image
                    src="/images/products/paldar-sozni-pashmina.jpg"
                    alt="Paldar Sozni Pashmina"
                    fill
                    className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/50 via-transparent to-transparent" />
                  <div className="absolute bottom-0 left-0 p-6">
                    <h3 className="font-[family-name:var(--font-heading)] text-2xl text-white font-light">
                      Paldar Sozni Pashmina
                    </h3>
                    <p className="text-white/70 text-sm font-[family-name:var(--font-body)]">
                      {formatPrice(24999)}
                    </p>
                  </div>
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="py-20 bg-white border-t border-[#E8E3DC]">
          <div className="max-w-2xl mx-auto px-4 sm:px-6 text-center">
            <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-3">
              Enquiries
            </p>
            <h2 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl text-[#1C1C1C] font-light mb-4">
              Interested in a Piece?
            </h2>
            <p className="text-[#6B6560] text-sm leading-relaxed font-[family-name:var(--font-body)] mb-8">
              Each Craftick piece is unique. Contact us to enquire about availability, custom orders, or to learn more about the craftsmanship behind any product.
            </p>
            <Link
              href="/contact"
              className="inline-block bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-10 py-4 font-medium hover:bg-[#B5903A] transition-colors font-[family-name:var(--font-body)]"
            >
              Get in Touch
            </Link>
          </div>
        </section>

      </main>
      <Footer />
    </>
  );
}
