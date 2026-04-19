CREATE TABLE IF NOT EXISTS orders (
  id                  INTEGER PRIMARY KEY AUTOINCREMENT,
  razorpay_order_id   TEXT    NOT NULL UNIQUE,
  razorpay_payment_id TEXT,
  customer_name       TEXT    NOT NULL,
  customer_email      TEXT    NOT NULL,
  customer_phone      TEXT    NOT NULL,
  customer_address    TEXT    NOT NULL,
  items               TEXT    NOT NULL,  -- JSON array of cart items
  amount              INTEGER NOT NULL,  -- in INR
  status              TEXT    NOT NULL DEFAULT 'pending',
  created_at          TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at          TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_orders_razorpay_order_id ON orders(razorpay_order_id);
CREATE INDEX IF NOT EXISTS idx_orders_status            ON orders(status);
