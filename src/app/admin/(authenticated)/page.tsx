import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getProducts } from "@/lib/db";
import { categories } from "@/lib/categories";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { env } = await getCloudflareContext({ async: true });
  const products = await getProducts(env.DB);

  const stats = {
    total: products.length,
    featured: products.filter((p) => p.featured).length,
    outOfStock: products.filter((p) => p.outOfStock).length,
    byCategory: categories.map((cat) => ({
      ...cat,
      count: products.filter((p) => p.category === cat.slug).length,
    })),
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">Dashboard</h1>
        <p className="text-sm text-[#6B6560] mt-1">Overview of your Craftick catalogue</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 mb-10">
        {[
          { label: "Total Products", value: stats.total, color: "text-[#1C1C1C]" },
          { label: "Featured", value: stats.featured, color: "text-[#B5903A]" },
          { label: "Out of Stock", value: stats.outOfStock, color: "text-red-600" },
        ].map((card) => (
          <div key={card.label} className="bg-white border border-[#E8E3DC] p-6 rounded-sm">
            <p className="text-xs tracking-widest uppercase text-[#6B6560] font-medium mb-2">
              {card.label}
            </p>
            <p className={`text-3xl font-semibold ${card.color}`}>{card.value}</p>
          </div>
        ))}
      </div>

      {/* Categories breakdown */}
      <div className="bg-white border border-[#E8E3DC] mb-8">
        <div className="px-6 py-4 border-b border-[#E8E3DC]">
          <h2 className="text-sm font-semibold text-[#1C1C1C]">Products by Category</h2>
        </div>
        <div className="divide-y divide-[#E8E3DC]">
          {stats.byCategory.map((cat) => (
            <div key={cat.slug} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm font-medium text-[#1C1C1C]">{cat.name}</p>
                <p className="text-xs text-[#8C8680]">{cat.description}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-xl font-semibold text-[#1C1C1C]">{cat.count}</span>
                <Link
                  href={`/admin/products?category=${cat.slug}`}
                  className="text-xs tracking-widest uppercase text-[#B5903A] hover:underline font-medium"
                >
                  View
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="flex gap-3">
        <Link
          href="/admin/products/new"
          className="inline-block bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-6 py-3 font-medium hover:bg-[#B5903A] transition-colors"
        >
          + Add Product
        </Link>
        <Link
          href="/admin/products"
          className="inline-block border border-[#E8E3DC] text-[#4A4440] text-xs tracking-widest uppercase px-6 py-3 font-medium hover:border-[#1C1C1C] transition-colors"
        >
          Manage Products
        </Link>
      </div>
    </div>
  );
}
