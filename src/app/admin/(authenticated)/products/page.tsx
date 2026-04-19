import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getProducts } from "@/lib/db";
import { categories } from "@/lib/categories";
import { formatPrice } from "@/lib/products-static";
import Link from "next/link";
import Image from "next/image";
import InventoryControl from "@/components/admin/InventoryControl";
import DeleteButton from "@/components/admin/DeleteButton";

export const dynamic = "force-dynamic";

interface Props {
  searchParams: Promise<{ category?: string }>;
}

export default async function AdminProductsPage({ searchParams }: Props) {
  const params = await searchParams;
  const { env } = await getCloudflareContext({ async: true });
  const allProducts = await getProducts(env.DB);

  const filtered = params.category
    ? allProducts.filter((p) => p.category === params.category)
    : allProducts;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-semibold text-[#1C1C1C]">Products</h1>
          <p className="text-sm text-[#6B6560] mt-1">{filtered.length} products</p>
        </div>
        <Link
          href="/admin/products/new"
          className="bg-[#1C1C1C] text-white text-xs tracking-widest uppercase px-5 py-2.5 font-medium hover:bg-[#B5903A] transition-colors"
        >
          + Add Product
        </Link>
      </div>

      {/* Category filter */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Link
          href="/admin/products"
          className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors font-medium ${
            !params.category
              ? "border-[#1C1C1C] bg-[#1C1C1C] text-white"
              : "border-[#E8E3DC] text-[#4A4440] hover:border-[#1C1C1C]"
          }`}
        >
          All
        </Link>
        {categories.map((cat) => (
          <Link
            key={cat.slug}
            href={`/admin/products?category=${cat.slug}`}
            className={`text-xs tracking-widest uppercase px-4 py-2 border transition-colors font-medium ${
              params.category === cat.slug
                ? "border-[#1C1C1C] bg-[#1C1C1C] text-white"
                : "border-[#E8E3DC] text-[#4A4440] hover:border-[#1C1C1C]"
            }`}
          >
            {cat.name}
          </Link>
        ))}
      </div>

      {/* Product table */}
      <div className="bg-white border border-[#E8E3DC] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-[#E8E3DC] bg-[#F8F5F0]">
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium w-14">
                  Image
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">
                  Product
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">
                  Category
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">
                  Price
                </th>
                <th className="text-center px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">
                  Inventory
                </th>
                <th className="text-left px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">
                  Status
                </th>
                <th className="text-right px-4 py-3 text-[10px] tracking-widest uppercase text-[#6B6560] font-medium">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E3DC]">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-[#8C8680]">
                    No products found.{" "}
                    <Link href="/admin/products/new" className="text-[#B5903A] hover:underline">
                      Add one
                    </Link>
                  </td>
                </tr>
              ) : (
                filtered.map((product) => (
                  <tr key={product.id} className="hover:bg-[#F8F5F0] transition-colors">
                    {/* Image */}
                    <td className="px-4 py-3">
                      <div className="relative w-10 h-12 overflow-hidden bg-[#EDE8E1] shrink-0">
                        {product.image ? (
                          <Image
                            src={product.image}
                            alt={product.title}
                            fill
                            className="object-cover object-top"
                            sizes="40px"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-[#C8C3BC] text-xs">
                            No img
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Title */}
                    <td className="px-4 py-3">
                      <p className="font-medium text-[#1C1C1C] leading-snug">{product.title}</p>
                      <p className="text-xs text-[#8C8680] mt-0.5 font-mono">{product.slug}</p>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="text-xs text-[#4A4440] capitalize">
                        {categories.find((c) => c.slug === product.category)?.name ?? product.category}
                      </span>
                    </td>

                    {/* Price */}
                    <td className="px-4 py-3 text-right font-medium text-[#1C1C1C]">
                      {formatPrice(product.price)}
                    </td>

                    {/* Inventory */}
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <InventoryControl
                          productId={product.id}
                          initialInventory={product.inventory ?? 0}
                        />
                      </div>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3">
                      <div className="flex flex-col gap-1">
                        {product.featured && (
                          <span className="inline-block text-[10px] bg-[#FFF8EC] border border-[#D4AF6A] text-[#B5903A] px-2 py-0.5 font-medium tracking-wide uppercase">
                            Featured
                          </span>
                        )}
                        {product.outOfStock && (
                          <span className="inline-block text-[10px] bg-red-50 border border-red-200 text-red-600 px-2 py-0.5 font-medium tracking-wide uppercase">
                            Out of Stock
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Actions */}
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-3">
                        <Link
                          href={`/admin/products/${product.id}`}
                          className="text-xs text-[#B5903A] hover:underline font-medium"
                        >
                          Edit
                        </Link>
                        <DeleteButton productId={product.id} productTitle={product.title} />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
