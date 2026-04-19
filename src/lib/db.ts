import type { Product } from "./products-static";
import type { CartItem } from "@/contexts/CartContext";

export type OrderStatus = "pending" | "paid" | "failed" | "cancelled";

export type Order = {
  id: number;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  amount: number;
  status: OrderStatus;
  createdAt: string;
};

type OrderRow = {
  id: number;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: string;
  amount: number;
  status: string;
  created_at: string;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    items: JSON.parse(row.items) as CartItem[],
    amount: row.amount,
    status: row.status as OrderStatus,
    createdAt: row.created_at,
  };
}

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

export async function getOrders(db: D1Database): Promise<Order[]> {
  const result = await db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all<OrderRow>();
  return (result.results ?? []).map(rowToOrder);
}

export async function createOrder(
  db: D1Database,
  data: {
    razorpayOrderId: string;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    customerAddress: string;
    items: CartItem[];
    amount: number;
  }
): Promise<Order> {
  const row = await db
    .prepare(
      `INSERT INTO orders (razorpay_order_id, customer_name, customer_email, customer_phone, customer_address, items, amount)
       VALUES (?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    )
    .bind(
      data.razorpayOrderId,
      data.customerName,
      data.customerEmail,
      data.customerPhone,
      data.customerAddress,
      JSON.stringify(data.items),
      data.amount
    )
    .first<OrderRow>();
  if (!row) throw new Error("Failed to create order");
  return rowToOrder(row);
}

export async function updateOrderStatus(
  db: D1Database,
  razorpayOrderId: string,
  status: OrderStatus,
  razorpayPaymentId?: string
): Promise<Order | undefined> {
  const row = await db
    .prepare(
      `UPDATE orders
       SET status = ?, razorpay_payment_id = COALESCE(?, razorpay_payment_id), updated_at = datetime('now')
       WHERE razorpay_order_id = ?
       RETURNING *`
    )
    .bind(status, razorpayPaymentId ?? null, razorpayOrderId)
    .first<OrderRow>();
  return row ? rowToOrder(row) : undefined;
}

export async function getOrderById(
  db: D1Database,
  id: number
): Promise<Order | undefined> {
  const row = await db
    .prepare("SELECT * FROM orders WHERE id = ?")
    .bind(id)
    .first<OrderRow>();
  return row ? rowToOrder(row) : undefined;
}

/**
 * Atomically decrements inventory by `quantity` only if stock is available.
 * Returns null (without throwing) if insufficient inventory — callers must handle this.
 */
export async function reserveInventory(
  db: D1Database,
  productId: number,
  quantity: number
): Promise<Product | null> {
  const row = await db
    .prepare(
      `UPDATE products
       SET inventory = inventory - ?, updated_at = datetime('now')
       WHERE id = ? AND inventory >= ? AND out_of_stock = 0
       RETURNING *`
    )
    .bind(quantity, productId, quantity)
    .first<D1Row>();
  return row ? rowToProduct(row) : null;
}

/**
 * Restores inventory — used when a pending order is cancelled before payment.
 */
export async function releaseInventory(
  db: D1Database,
  productId: number,
  quantity: number
): Promise<void> {
  await db
    .prepare(
      `UPDATE products
       SET inventory = inventory + ?,
           out_of_stock = CASE WHEN (inventory + ?) > 0 THEN 0 ELSE out_of_stock END,
           updated_at = datetime('now')
       WHERE id = ?`
    )
    .bind(quantity, quantity, productId)
    .run();
}

export async function cancelOrder(
  db: D1Database,
  razorpayOrderId: string
): Promise<Order | undefined> {
  const row = await db
    .prepare(
      `UPDATE orders
       SET status = 'cancelled', updated_at = datetime('now')
       WHERE razorpay_order_id = ? AND status = 'pending'
       RETURNING *`
    )
    .bind(razorpayOrderId)
    .first<OrderRow>();
  return row ? rowToOrder(row) : undefined;
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
