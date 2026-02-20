-- ============================================================
-- Portfolio items table (images and video links)
-- ============================================================
CREATE TABLE IF NOT EXISTS portfolio_items (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title           TEXT NOT NULL,
    description     TEXT,
    item_type       TEXT NOT NULL CHECK (item_type IN ('image', 'video')),
    media_url       TEXT NOT NULL, -- Image URL from storage or YouTube link
    thumbnail_url   TEXT, -- Thumbnail for videos
    display_order   INTEGER NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow public read access
ALTER TABLE portfolio_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read portfolio_items"
    ON portfolio_items FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access portfolio_items"
    ON portfolio_items FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_portfolio_items_type ON portfolio_items(item_type);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_order ON portfolio_items(display_order);
CREATE INDEX IF NOT EXISTS idx_portfolio_items_active ON portfolio_items(is_active);


-- ============================================================
-- Hero images table (for homepage hero section)
-- ============================================================
CREATE TABLE IF NOT EXISTS hero_images (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    image_url       TEXT NOT NULL,
    title           TEXT,
    subtitle        TEXT,
    display_order   INTEGER NOT NULL DEFAULT 0,
    is_active       BOOLEAN NOT NULL DEFAULT TRUE,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow public read access
ALTER TABLE hero_images ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read hero_images"
    ON hero_images FOR SELECT USING (is_active = true);
CREATE POLICY "Service role full access hero_images"
    ON hero_images FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_hero_images_order ON hero_images(display_order);
CREATE INDEX IF NOT EXISTS idx_hero_images_active ON hero_images(is_active);


-- ============================================================
-- Storage buckets (run these in the Supabase SQL editor
-- OR create the buckets manually in the Storage dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('portfolio-images', 'portfolio-images', TRUE) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('hero-images', 'hero-images', TRUE) ON CONFLICT DO NOTHING;
