CREATE TABLE IF NOT EXISTS products (
  id           INTEGER PRIMARY KEY AUTOINCREMENT,
  slug         TEXT    NOT NULL UNIQUE,
  title        TEXT    NOT NULL,
  subtitle     TEXT    NOT NULL DEFAULT '',
  description  TEXT    NOT NULL DEFAULT '',
  price        INTEGER NOT NULL,
  image        TEXT    NOT NULL DEFAULT '',
  category     TEXT    NOT NULL DEFAULT '',
  featured     INTEGER NOT NULL DEFAULT 0,
  out_of_stock INTEGER NOT NULL DEFAULT 0,
  inventory    INTEGER NOT NULL DEFAULT 0,
  created_at   TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at   TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_slug     ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_featured ON products(featured);
