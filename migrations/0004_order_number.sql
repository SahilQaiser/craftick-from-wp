-- Migration to add order_number to orders table
ALTER TABLE orders ADD COLUMN order_number TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_orders_order_number ON orders(order_number);
