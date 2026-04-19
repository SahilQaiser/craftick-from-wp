import { notFound } from "next/navigation";
import Link from "next/link";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductImageGallery from "@/components/ProductImageGallery";
import { getProductBySlug, getProductsByCategory } from "@/lib/db";
import { categories } from "@/lib/categories";
import { formatPrice } from "@/lib/products-static";
import AddToCartButton from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps) {
  const { slug } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const product = await getProductBySlug(env.DB, slug);
  if (!product) return {};
  return {
    title: `${product.title} — Craftick`,
    description: product.description,
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const product = await getProductBySlug(env.DB, slug);

  if (!product) notFound();

  const category = categories.find((c) => c.slug === product.category);
  const related = (await getProductsByCategory(env.DB, product.category))
    .filter((p) => p.id !== product.id)
    .slice(0, 4);

  return (
    <>
      <Header />
      <main className="min-h-screen bg-[#F8F5F0]">
        {/* Breadcrumb */}
        <div className="pt-36 pb-4 bg-white border-b border-[#E8E3DC]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex items-center gap-2 text-xs text-[#8C8680] font-[family-name:var(--font-body)]">
              <Link href="/" className="hover:text-[#B5903A] transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/shop" className="hover:text-[#B5903A] transition-colors">
                Shop
              </Link>
              {category && (
                <>
                  <span>/</span>
                  <Link
                    href={`/shop?category=${category.slug}`}
                    className="hover:text-[#B5903A] transition-colors"
                  >
                    {category.name}
                  </Link>
                </>
              )}
              <span>/</span>
              <span className="text-[#4A4440]">{product.title}</span>
            </nav>
          </div>
        </div>

        {/* Product detail */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
            {/* Images gallery */}
            <ProductImageGallery
              images={product.images?.length ? product.images : product.image ? [product.image] : []}
              title={product.title}
              featured={product.featured}
            />

            {/* Info */}
            <div className="flex flex-col justify-start lg:py-4">
              {category && (
                <Link
                  href={`/shop?category=${category.slug}`}
                  className="text-[#B5903A] text-[10px] tracking-[0.3em] uppercase font-medium font-[family-name:var(--font-body)] hover:underline mb-3 inline-block"
                >
                  {category.name}
                </Link>
              )}

              <h1 className="font-[family-name:var(--font-heading)] text-3xl md:text-4xl lg:text-5xl text-[#1C1C1C] font-light leading-tight mb-2">
                {product.title}
              </h1>
              <p className="text-[#6B6560] text-base font-[family-name:var(--font-heading)] italic mb-6">
                {product.subtitle}
              </p>

              <div className="flex items-baseline gap-3 mb-8">
                <span className="font-[family-name:var(--font-heading)] text-3xl text-[#1C1C1C] font-medium">
                  {formatPrice(product.price)}
                </span>
                <span className="text-xs text-[#8C8680] font-[family-name:var(--font-body)]">
                  Inclusive of all taxes
                </span>
              </div>

              <div className="h-px bg-[#E8E3DC] mb-8" />

              <p className="text-[#4A4440] text-sm leading-relaxed font-[family-name:var(--font-body)] mb-8">
                {product.description}
              </p>

              {/* Features */}
              <div className="grid grid-cols-2 gap-4 mb-8">
                {[
                  { label: "Origin", value: "Kashmir, India" },
                  { label: "Craft", value: product.subtitle },
                  { label: "Authenticity", value: "100% Genuine" },
                  { label: "Shipping", value: "Worldwide" },
                ].map((feat) => (
                  <div key={feat.label} className="bg-white p-4 border border-[#E8E3DC]">
                    <p className="text-[10px] tracking-widest uppercase text-[#B5903A] font-medium font-[family-name:var(--font-body)] mb-1">
                      {feat.label}
                    </p>
                    <p className="text-sm text-[#1C1C1C] font-[family-name:var(--font-body)]">
                      {feat.value}
                    </p>
                  </div>
                ))}
              </div>

              {/* CTA */}
              <div className="flex flex-col sm:flex-row gap-3">
                <AddToCartButton product={product} />
                <Link
                  href="/shop"
                  className="flex-1 border border-[#E8E3DC] text-[#4A4440] text-xs tracking-widest uppercase px-8 py-4 font-medium hover:border-[#1C1C1C] hover:text-[#1C1C1C] transition-colors text-center font-[family-name:var(--font-body)]"
                >
                  Continue Shopping
                </Link>
              </div>

              <div className="h-px bg-[#E8E3DC] mt-8 mb-6" />

              {/* Trust badges */}
              <div className="flex flex-wrap gap-6">
                {[
                  { icon: "✦", text: "Handcrafted by artisans" },
                  { icon: "◇", text: "Authenticity certified" },
                  { icon: "✧", text: "Worldwide shipping" },
                ].map((badge) => (
                  <div key={badge.text} className="flex items-center gap-2 text-xs text-[#6B6560] font-[family-name:var(--font-body)]">
                    <span className="text-[#B5903A]">{badge.icon}</span>
                    {badge.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Related products */}
        {related.length > 0 && (
          <div className="bg-white py-16 md:py-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-end justify-between mb-10">
                <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[#1C1C1C] font-light">
                  You May Also Like
                </h2>
                <Link
                  href={`/shop?category=${product.category}`}
                  className="text-xs tracking-widest uppercase text-[#4A4440] hover:text-[#B5903A] transition-colors font-medium font-[family-name:var(--font-body)]"
                >
                  View All
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
                {related.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
