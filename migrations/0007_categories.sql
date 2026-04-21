CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  slug        TEXT    NOT NULL UNIQUE,
  name        TEXT    NOT NULL,
  description TEXT    NOT NULL DEFAULT '',
  image       TEXT    NOT NULL DEFAULT '',
  sort_order  INTEGER NOT NULL DEFAULT 0,
  created_at  TEXT    NOT NULL DEFAULT (datetime('now')),
  updated_at  TEXT    NOT NULL DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_categories_slug       ON categories(slug);
CREATE INDEX IF NOT EXISTS idx_categories_sort_order ON categories(sort_order);

-- Seed default categories (safe to re-run)
INSERT OR IGNORE INTO categories (slug, name, description, image, sort_order) VALUES
  ('pashmina-shawls',    'Pashmina Shawls',   'Luxurious hand-woven Pashmina shawls with intricate embroidery', '/images/products/16.jpg',                   1),
  ('stoles-and-scarves', 'Stoles & Scarves',  'Elegant wraps and stoles in fine wool and pashmina',            '/images/products/emerald-green-tilla.jpg',  2),
  ('sarees',             'Sarees',            'Silk and pashmina sarees with Kashmiri embroidery',             '/images/products/blue-saree.jpg',           3);
