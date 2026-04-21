ALTER TABLE categories ADD COLUMN show_in_nav INTEGER NOT NULL DEFAULT 1;

CREATE INDEX IF NOT EXISTS idx_categories_show_in_nav ON categories(show_in_nav);
