import type { Product } from "./products-static";
import type { CartItem } from "@/contexts/CartContext";

export type OrderStatus =
  | "pending"
  | "paid"
  | "processing"
  | "shipped"
  | "delivered"
  | "cancelled"
  | "refunded"
  | "failed";

export type Order = {
  id: number;
  orderNumber: string;
  razorpayOrderId: string;
  razorpayPaymentId: string | null;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: CartItem[];
  amount: number;
  status: OrderStatus;
  paymentMethod: "online" | "cod";
  trackingNumber: string | null;
  trackingUrl: string | null;
  adminNotes: string | null;
  createdAt: string;
  updatedAt: string;
};

type OrderRow = {
  id: number;
  order_number: string;
  razorpay_order_id: string;
  razorpay_payment_id: string | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  items: string;
  amount: number;
  status: string;
  payment_method: string;
  tracking_number: string | null;
  tracking_url: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
};

function rowToOrder(row: OrderRow): Order {
  return {
    id: row.id,
    orderNumber: row.order_number || `#${row.id}`,
    razorpayOrderId: row.razorpay_order_id,
    razorpayPaymentId: row.razorpay_payment_id,
    customerName: row.customer_name,
    customerEmail: row.customer_email,
    customerPhone: row.customer_phone,
    customerAddress: row.customer_address,
    items: JSON.parse(row.items) as CartItem[],
    amount: row.amount,
    status: row.status as OrderStatus,
    paymentMethod: (row.payment_method || "online") as "online" | "cod",
    trackingNumber: row.tracking_number ?? null,
    trackingUrl: row.tracking_url ?? null,
    adminNotes: row.admin_notes ?? null,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
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
  images: string;
  category: string;
  featured: number;
  out_of_stock: number;
  inventory: number;
  created_at: string;
  updated_at: string;
};

function rowToProduct(row: D1Row): Product {
  const images = JSON.parse(row.images || "[]") as string[];
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
    subtitle: row.subtitle,
    description: row.description,
    price: row.price,
    image: images[0] || row.image,
    images,
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
  const images = data.images ?? (data.image ? [data.image] : []);
  const image = images[0] ?? data.image ?? "";
  const result = await db
    .prepare(
      `INSERT INTO products (slug, title, subtitle, description, price, image, images, category, featured, out_of_stock, inventory)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    )
    .bind(
      data.slug,
      data.title,
      data.subtitle,
      data.description,
      data.price,
      image,
      JSON.stringify(images),
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
  if (data.images !== undefined) {
    const image = data.images[0] ?? "";
    sets.push("images = ?"); values.push(JSON.stringify(data.images));
    sets.push("image = ?"); values.push(image);
  } else if (data.image !== undefined) {
    sets.push("image = ?"); values.push(data.image);
  }
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

export async function getOrderByRazorpayId(
  db: D1Database,
  razorpayOrderId: string
): Promise<Order | undefined> {
  const row = await db
    .prepare("SELECT * FROM orders WHERE razorpay_order_id = ?")
    .bind(razorpayOrderId)
    .first<OrderRow>();
  return row ? rowToOrder(row) : undefined;
}

export async function searchOrder(
  db: D1Database,
  orderNumber: string,
  email: string
): Promise<Order | undefined> {
  const row = await db
    .prepare("SELECT * FROM orders WHERE (order_number = ? OR CAST(id AS TEXT) = ?) AND customer_email = ?")
    .bind(orderNumber, orderNumber, email.toLowerCase().trim())
    .first<OrderRow>();
  return row ? rowToOrder(row) : undefined;
}

export async function adminUpdateOrder(
  db: D1Database,
  id: number,
  data: {
    status?: OrderStatus;
    trackingNumber?: string | null;
    trackingUrl?: string | null;
    adminNotes?: string | null;
  }
): Promise<Order | undefined> {
  const sets: string[] = ["updated_at = datetime('now')"];
  const values: (string | number | null)[] = [];

  if (data.status !== undefined) { sets.push("status = ?"); values.push(data.status); }
  if (data.trackingNumber !== undefined) { sets.push("tracking_number = ?"); values.push(data.trackingNumber); }
  if (data.trackingUrl !== undefined) { sets.push("tracking_url = ?"); values.push(data.trackingUrl); }
  if (data.adminNotes !== undefined) { sets.push("admin_notes = ?"); values.push(data.adminNotes); }

  values.push(id);
  const row = await db
    .prepare(`UPDATE orders SET ${sets.join(", ")} WHERE id = ? RETURNING *`)
    .bind(...values)
    .first<OrderRow>();
  return row ? rowToOrder(row) : undefined;
}

export async function getOrders(db: D1Database): Promise<Order[]> {
  const result = await db
    .prepare("SELECT * FROM orders ORDER BY created_at DESC")
    .all<OrderRow>();
  return (result.results ?? []).map(rowToOrder);
}

function generateOrderNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789"; // Readable alphanumeric
  let result = "";
  for (let i = 0; i < 10; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return `CRFTK_${result}`;
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
    paymentMethod?: "online" | "cod";
  }
): Promise<Order> {
  const orderNumber = generateOrderNumber();
  const paymentMethod = data.paymentMethod || "online";
  const row = await db
    .prepare(
      `INSERT INTO orders (order_number, razorpay_order_id, customer_name, customer_email, customer_phone, customer_address, items, amount, payment_method)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
       RETURNING *`
    )
    .bind(
      orderNumber,
      data.razorpayOrderId,
      data.customerName,
      data.customerEmail,
      data.customerPhone,
      data.customerAddress,
      JSON.stringify(data.items),
      data.amount,
      paymentMethod
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

// --- Settings ---

export async function getSetting(
  db: D1Database,
  key: string,
  defaultValue: string = ""
): Promise<string> {
  const row = await db
    .prepare("SELECT value FROM settings WHERE key = ?")
    .bind(key)
    .first<{ value: string }>();
  return row ? row.value : defaultValue;
}

export async function setSetting(
  db: D1Database,
  key: string,
  value: string
): Promise<void> {
  await db
    .prepare(
      `INSERT INTO settings (key, value)
       VALUES (?, ?)
       ON CONFLICT(key) DO UPDATE SET value = excluded.value, updated_at = datetime('now')`
    )
    .bind(key, value)
    .run();
}
