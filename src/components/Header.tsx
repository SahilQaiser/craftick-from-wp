import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getCategories, getProducts } from "@/lib/db";
import HeaderClient from "@/components/HeaderClient";

export default async function Header() {
  let categories: Awaited<ReturnType<typeof getCategories>> = [];
  try {
    const { env } = await getCloudflareContext({ async: true });
    const [cats, products] = await Promise.all([
      getCategories(env.DB),
      getProducts(env.DB),
    ]);

    // For categories with no manually chosen image, fall back to the first product image
    categories = cats.map((cat) => {
      if (cat.image) return cat;
      const product = products.find((p) => p.category === cat.slug);
      const fallback = product?.images?.[0] ?? product?.image ?? "";
      return fallback ? { ...cat, image: fallback } : cat;
    });
  } catch {
    // DB unavailable at build time — HeaderClient renders with no categories
  }
  return <HeaderClient categories={categories} />;
}
