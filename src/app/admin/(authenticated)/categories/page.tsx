import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getCategories, getProducts } from "@/lib/db";
import CategoryManager from "@/components/admin/CategoryManager";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const { env } = await getCloudflareContext({ async: true });
  const [categories, products] = await Promise.all([
    getCategories(env.DB),
    getProducts(env.DB),
  ]);

  const productCounts: Record<string, number> = {};
  const productImages: Record<string, { src: string; title: string }[]> = {};

  for (const p of products) {
    productCounts[p.category] = (productCounts[p.category] ?? 0) + 1;

    const imgs = p.images?.length ? p.images : (p.image ? [p.image] : []);
    if (!productImages[p.category]) productImages[p.category] = [];
    for (const src of imgs) {
      if (!productImages[p.category].some((i) => i.src === src)) {
        productImages[p.category].push({ src, title: p.title });
      }
    }
  }

  return (
    <div className="p-8">
      <CategoryManager
        initialCategories={categories}
        productCounts={productCounts}
        productImages={productImages}
      />
    </div>
  );
}
