import { Suspense } from "react";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import { getProducts, getCategories } from "@/lib/db";

interface ShopPageProps {
  searchParams: Promise<{ category?: string; q?: string }>;
}

export const metadata = {
  title: "Shop — Craftick",
  description:
    "Browse our collection of authentic Kashmiri handcrafted pashmina shawls, stoles, scarves and sarees.",
};

async function ShopContent({ categorySlug, query }: { categorySlug?: string; query?: string }) {
  const { env } = await getCloudflareContext({ async: true });
  const [allProducts, categories] = await Promise.all([
    getProducts(env.DB),
    getCategories(env.DB),
  ]);
  let filtered = allProducts;

  if (categorySlug) {
    filtered = filtered.filter((p) => p.category === categorySlug);
  }

  if (query) {
    const q = query.toLowerCase();
    filtered = filtered.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.subtitle.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q)
    );
  }

  const activeCategory = categories.find((c) => c.slug === categorySlug);

  return (
    <div className="min-h-screen bg-[#F8F5F0]">
      {/* Page header */}
      <div className="bg-[#F8F5F0] border-b border-[#E8E3DC] pt-36 md:pt-44 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-[#B5903A] text-[10px] tracking-[0.35em] uppercase font-medium font-[family-name:var(--font-body)] mb-3">
            {activeCategory ? "Category" : "All Products"}
          </p>
          <h1 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-[#1C1C1C] font-light">
            {activeCategory ? activeCategory.name : "Shop All"}
          </h1>
          {/* Gold underline accent */}
          <div className="w-12 h-0.5 bg-[#B5903A] mt-4" />
          {activeCategory && (
            <p className="text-[#6B6560] text-sm mt-4 font-[family-name:var(--font-body)]">
              {activeCategory.description}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Filter bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8 pb-6 border-b border-[#E8E3DC]">
          <div className="flex flex-wrap gap-2">
            <a
              href="/shop"
              className={`text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-200 font-[family-name:var(--font-body)] font-medium ${
                !categorySlug
                  ? "border-[#1C1C1C] bg-[#1C1C1C] text-white"
                  : "border-[#E8E3DC] text-[#4A4440] hover:border-[#1C1C1C]"
              }`}
            >
              All
            </a>
            {categories.map((cat) => (
              <a
                key={cat.slug}
                href={`/shop?category=${cat.slug}`}
                className={`text-xs tracking-widest uppercase px-4 py-2 border transition-all duration-200 font-[family-name:var(--font-body)] font-medium ${
                  categorySlug === cat.slug
                    ? "border-[#1C1C1C] bg-[#1C1C1C] text-white"
                    : "border-[#E8E3DC] text-[#4A4440] hover:border-[#1C1C1C]"
                }`}
              >
                {cat.name}
              </a>
            ))}
          </div>

          <p className="text-xs text-[#8C8680] font-[family-name:var(--font-body)]">
            {filtered.length} {filtered.length === 1 ? "product" : "products"}
          </p>
        </div>

        {/* Products grid */}
        {filtered.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14">
            {filtered.map((product, i) => (
              <ProductCard key={product.id} product={product} priority={i < 4} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="font-[family-name:var(--font-heading)] text-2xl text-[#6B6560] font-light">
              No products found
            </p>
            <a
              href="/shop"
              className="inline-block mt-6 text-xs tracking-widest uppercase text-[#B5903A] hover:underline font-medium font-[family-name:var(--font-body)]"
            >
              View all products
            </a>
          </div>
        )}
      </div>
    </div>
  );
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;

  return (
    <>
      <Header />
      <main>
        <Suspense>
          <ShopContent categorySlug={params.category} query={params.q} />
        </Suspense>
      </main>
      <Footer />
    </>
  );
}
