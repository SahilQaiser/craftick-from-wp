-- Migration to add settings table and payment_method column to orders

CREATE TABLE IF NOT EXISTS settings (
  key TEXT PRIMARY KEY,
  value TEXT NOT NULL,
  updated_at TEXT NOT NULL DEFAULT (datetime('now'))
);

ALTER TABLE orders ADD COLUMN payment_method TEXT NOT NULL DEFAULT 'online';
