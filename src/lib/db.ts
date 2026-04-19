import type { Product } from "./products-static";

type D1Row = {
  id: number;
  slug: string;
  title: string;
  subtitle: string;
  description: string;
  price: number;
  image: string;
  category: string;
  featured: number;
  out_of_stock: number;
  inventory: number;
  created_at: string;
  updated_at: string;
};

function rowToProduct(row: D1Row): Product {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    price: row.price,
    image: row.image,
    category: row.category,
    featured: row.featured === 1,
    outOfStock: row.out_of_stock === 1,
    inventory: row.inventory,
  };
}

export async function getProducts(db: D1Database): Promise<Product[]> {
  const result = await db
    .prepare("SELECT * FROM products ORDER BY id ASC")
    .all<D1Row>();
  return (result.results ?? []).map(rowToProduct);
}

export async function getProductsByCategory(
  db: D1Database,
  category: string
): Promise<Product[]> {
  const result = await db
    .prepare("SELECT * FROM products WHERE category = ? ORDER BY id ASC")
    .bind(category)
    .all<D1Row>();
  return (result.results ?? []).map(rowToProduct);
}

export async function getFeaturedProducts(db: D1Database): Promise<Product[]> {
  const result = await db
    .prepare("SELECT * FROM products WHERE featured = 1 ORDER BY id ASC")
    .all<D1Row>();
  return (result.results ?? []).map(rowToProduct);
}

export async function getProductBySlug(
  db: D1Database,
  slug: string
): Promise<Product | undefined> {
  const row = await db
    .prepare("SELECT * FROM products WHERE slug = ?")
    .bind(slug)
    .first<D1Row>();
  return row ? rowToProduct(row) : undefined;
}

export async function getProductById(
  db: D1Database,
  id: number
): Promise<Product | undefined> {
  const row = await db
    .prepare("SELECT * FROM products WHERE id = ?")
    .bind(id)
    .first<D1Row>();
  return row ? rowToProduct(row) : undefined;
}

export async function createProduct(
  db: D1Database,
  data: Omit<Product, "id">
): Promise<Product> {
  const result = await db
    .prepare(
      `INSERT INTO products (slug, title, subtitle, description, price, image, category, featured, out_of_stock, inventory)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    )
    .bind(
      data.slug,
      data.title,
      data.subtitle,
      data.description,
      data.price,
      data.image,
      data.category,
      data.featured ? 1 : 0,
      data.outOfStock ? 1 : 0,
      data.inventory ?? 0
    )
    .first<D1Row>();
  if (!result) throw new Error("Failed to create product");
  return rowToProduct(result);
}

export async function updateProduct(
  db: D1Database,
  id: number,
  data: Partial<Omit<Product, "id">>
): Promise<Product | undefined> {
  const sets: string[] = [];
  const values: (string | number)[] = [];

  if (data.slug !== undefined) { sets.push("slug = ?"); values.push(data.slug); }
  if (data.title !== undefined) { sets.push("title = ?"); values.push(data.title); }
  if (data.subtitle !== undefined) { sets.push("subtitle = ?"); values.push(data.subtitle); }
  if (data.description !== undefined) { sets.push("description = ?"); values.push(data.description); }
  if (data.price !== undefined) { sets.push("price = ?"); values.push(data.price); }
  if (data.image !== undefined) { sets.push("image = ?"); values.push(data.image); }
  if (data.category !== undefined) { sets.push("category = ?"); values.push(data.category); }
  if (data.featured !== undefined) { sets.push("featured = ?"); values.push(data.featured ? 1 : 0); }
  if (data.outOfStock !== undefined) { sets.push("out_of_stock = ?"); values.push(data.outOfStock ? 1 : 0); }
  if (data.inventory !== undefined) { sets.push("inventory = ?"); values.push(data.inventory); }

  if (sets.length === 0) return getProductById(db, id);

  sets.push("updated_at = datetime('now')");
  values.push(id);

  const row = await db
    .prepare(`UPDATE products SET ${sets.join(", ")} WHERE id = ? RETURNING *`)
    .bind(...values)
    .first<D1Row>();
  return row ? rowToProduct(row) : undefined;
}

export async function deleteProduct(db: D1Database, id: number): Promise<boolean> {
  const result = await db
    .prepare("DELETE FROM products WHERE id = ?")
    .bind(id)
    .run();
  return (result.meta?.changes ?? 0) > 0;
}

export async function adjustInventory(
  db: D1Database,
  id: number,
  delta: number
): Promise<Product | undefined> {
  const row = await db
    .prepare(
      "UPDATE products SET inventory = MAX(0, inventory + ?), updated_at = datetime('now') WHERE id = ? RETURNING *"
    )
    .bind(delta, id)
    .first<D1Row>();
  return row ? rowToProduct(row) : undefined;
}
