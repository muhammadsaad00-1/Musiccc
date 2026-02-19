-- ============================================================
-- Client Logos table
-- ============================================================
CREATE TABLE IF NOT EXISTS client_logos (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    logo_url    TEXT,
    display_order INTEGER NOT NULL DEFAULT 0,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow public read access (used by the frontend)
ALTER TABLE client_logos ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read client_logos"
    ON client_logos FOR SELECT USING (true);
CREATE POLICY "Service role full access client_logos"
    ON client_logos FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================
-- Artist Testimonials table
-- ============================================================
CREATE TABLE IF NOT EXISTS artist_testimonials (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    role        TEXT NOT NULL,
    location    TEXT NOT NULL DEFAULT '',
    emoji       TEXT NOT NULL DEFAULT '🎵',
    photo_url   TEXT,
    rating      SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    review      TEXT NOT NULL,
    is_active   BOOLEAN NOT NULL DEFAULT TRUE,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Allow public read access (used by the frontend)
ALTER TABLE artist_testimonials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read artist_testimonials"
    ON artist_testimonials FOR SELECT USING (true);
CREATE POLICY "Service role full access artist_testimonials"
    ON artist_testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);


-- ============================================================
-- Storage buckets (run these in the Supabase SQL editor
-- OR create the buckets manually in the Storage dashboard)
-- ============================================================
-- INSERT INTO storage.buckets (id, name, public) VALUES ('client-logos', 'client-logos', TRUE) ON CONFLICT DO NOTHING;
-- INSERT INTO storage.buckets (id, name, public) VALUES ('artist-testimonials', 'artist-testimonials', TRUE) ON CONFLICT DO NOTHING;
