import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getCategories } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";
export const metadata = { title: "Add Product — Admin" };

export default async function NewProductPage() {
  const { env } = await getCloudflareContext({ async: true });
  const categories = await getCategories(env.DB);

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">Add Product</h1>
        <p className="text-sm text-[#6B6560] mt-1">Add a new product to your catalogue</p>
      </div>
      <div className="bg-white border border-[#E8E3DC] p-8">
        <ProductForm categories={categories} />
      </div>
    </div>
  );
}
