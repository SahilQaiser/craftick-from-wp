import { notFound } from "next/navigation";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getProductById } from "@/lib/db";
import ProductForm from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const { env } = await getCloudflareContext({ async: true });
  const product = await getProductById(env.DB, Number(id));

  if (!product) notFound();

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-semibold text-[#1C1C1C]">Edit Product</h1>
        <p className="text-sm text-[#6B6560] mt-1">{product.title}</p>
      </div>
      <div className="bg-white border border-[#E8E3DC] p-8">
        <ProductForm product={product} />
      </div>
    </div>
  );
}
