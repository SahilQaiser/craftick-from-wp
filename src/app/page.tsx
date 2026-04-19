import Image from "next/image";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getFeaturedProducts } from "@/lib/db";
import { categories } from "@/lib/categories";
import { formatPrice } from "@/lib/products-static";

export const dynamic = "force-dynamic";

const craftStories = [
  {
    title: "Tilla Embroidery",
    description:
      "Tilla work uses fine metallic gold or silver threads to create intricate patterns on Pashmina. Originating in Central Asia, it was perfected by Kashmiri artisans over centuries.",
    icon: "✦",
  },
  {
    title: "Sozni Work",
    description:
      "Sozni is Kashmir's finest needle embroidery, done with a single needle and thread. It takes months to complete one shawl, making each piece a labour of love.",
    icon: "✧",
  },
  {
    title: "Pure Pashmina",
    description:
      "Sourced from the underbelly of Changthangi goats in the high Himalayas, Pashmina is finer than human hair and extraordinarily warm.",
    icon: "◇",
  },
];

export default async function Home() {
  const { env } = await getCloudflareContext({ async: true });
  const featured = await getFeaturedProducts(env.DB);

  return (
    <>
      <Header />
      <main>
        {/* Hero Section */}
        <section className="relative min-h-screen flex items-end pb-16 md:pb-24 pt-20 overflow-hidden bg-[#2C2420]">
          {/* Background image */}
          <div className="absolute inset-0">
            <Image
              src="/images/products/13.jpg"
              alt="Kashmiri Pashmina Shawl"
              fill
              className="object-cover object-top opacity-60"
              priority
              sizes="100vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1C1410]/90 via-[#1C1410]/30 to-transparent" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-2xl">
              <p className="text-[#D4AF6A] text-xs tracking-[0.3em] uppercase mb-4 font-[family-name:var(--font-body)] font-medium">
                Handcrafted in Kashmir
              </p>
              <h1 className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl text-white font-light leading-[1.05] mb-6">
                The Art of{" "}
                <em className="italic">Kashmiri</em>{" "}
                Craft
              </h1>
              <p className="text-[#C8C3BC] text-base md:text-lg leading-relaxed mb-10 max-w-lg font-[family-name:var(--font-body)] font-light">
                Each shawl is a canvas — woven from the finest Pashmina and
                embroidered by hand over months of dedicated artisanal work.
              </p>
              <div className="flex flex-wrap gap-4">
                <Link
                  href="/shop"
                  className="inline-block bg-[#B5903A] text-white text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-[#9A7A2E] transition-colors font-[family-name:var(--font-body)]"
                >
                  Explore Collection
                </Link>
                <Link
                  href="/about"
                  className="inline-block border border-white/40 text-white text-xs tracking-widest uppercase px-8 py-4 font-medium hover:bg-white/10 transition-colors font-[family-name:var(--font-body)]"
                >
                  Our Story
                </Link>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          <div className="absolute bottom-8 right-8 hidden md:flex flex-col items-center gap-2 text-white/40">
            <span className="text-[10px] tracking-widest uppercase rotate-90 origin-center font-[family-name:var(--font-body)]">Scroll</span>
            <div className="w-px h-12 bg-white/20 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-full bg-white/60 animate-scroll-indicator" />
            </div>
          </div>
        </section>

        {/* Categories Section */}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Pashmina Shawls */}
              <Link
                href="/shop?category=pashmina-shawls"
                className="group relative overflow-hidden aspect-[3/4] bg-[#EDE8E1]"
              >
                <Image
                  src="/images/products/16.jpg"
                  alt="Pashmina Shawls"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl text-white font-light mb-1">
                    Pashmina Shawls
                  </h3>
                  <p className="text-white/70 text-xs tracking-widest uppercase font-[family-name:var(--font-body)]">
                    12 Products
                  </p>
                </div>
              </Link>

              {/* Stoles & Scarves */}
              <Link
                href="/shop?category=stoles-and-scarves"
                className="group relative overflow-hidden aspect-[3/4] bg-[#EDE8E1]"
              >
                <Image
                  src="/images/products/emerald-green-tilla.jpg"
                  alt="Stoles & Scarves"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl text-white font-light mb-1">
                    Stoles &amp; Scarves
                  </h3>
                  <p className="text-white/70 text-xs tracking-widest uppercase font-[family-name:var(--font-body)]">
                    6 Products
                  </p>
                </div>
              </Link>

              {/* Sarees */}
              <Link
                href="/shop?category=sarees"
                className="group relative overflow-hidden aspect-[3/4] bg-[#EDE8E1]"
              >
                <Image
                  src="/images/products/blue-saree.jpg"
                  alt="Sarees"
                  fill
                  className="object-cover object-top transition-transform duration-700 group-hover:scale-105"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl text-white font-light mb-1">
                    Sarees
                  </h3>
                  <p className="text-white/70 text-xs tracking-widest uppercase font-[family-name:var(--font-body)]">
                    1 Product
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </section>

        {/* Featured Products Section */}
        <section className="py-20 md:py-28 bg-white">
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

        {/* Heritage Banner */}
        <section className="relative overflow-hidden bg-[#1C1C1C] py-24 md:py-32">
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

        {/* Craft Stories */}
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

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12">
              {craftStories.map((story) => (
                <div key={story.title} className="text-center">
                  <div className="text-2xl text-[#B5903A] mb-5">{story.icon}</div>
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

        {/* Second Product Row */}
        <section className="py-20 md:py-28 bg-white">
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

            {/* Split layout: large image + 2 products */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Large featured */}
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

              {/* Two stacked products */}
              <div className="grid grid-cols-1 gap-6">
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

        {/* CTA / Newsletter */}
        <section className="py-20 bg-[#F8F5F0] border-t border-[#E8E3DC]">
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
