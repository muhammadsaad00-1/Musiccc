-- ============================================================
-- User Testimonials table (User-submitted reviews)
-- ============================================================
CREATE TABLE IF NOT EXISTS testimonials (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name        TEXT NOT NULL,
    role        TEXT,
    location    TEXT,
    rating      SMALLINT NOT NULL DEFAULT 5 CHECK (rating BETWEEN 1 AND 5),
    review      TEXT NOT NULL,
    type        TEXT NOT NULL DEFAULT 'client' CHECK (type IN ('client', 'artist')),
    is_approved BOOLEAN NOT NULL DEFAULT FALSE,
    submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    approved_at TIMESTAMPTZ
);

-- Allow public insert (users can submit testimonials)
ALTER TABLE testimonials ENABLE ROW LEVEL SECURITY;

-- Users can submit testimonials
CREATE POLICY "Public can insert testimonials"
    ON testimonials FOR INSERT WITH CHECK (true);

-- Only approved testimonials are publicly readable
CREATE POLICY "Public read approved testimonials"
    ON testimonials FOR SELECT USING (is_approved = true);

-- Service role has full access
CREATE POLICY "Service role full access testimonials"
    ON testimonials FOR ALL TO service_role USING (true) WITH CHECK (true);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_testimonials_approved ON testimonials(is_approved);
CREATE INDEX IF NOT EXISTS idx_testimonials_type ON testimonials(type);
CREATE INDEX IF NOT EXISTS idx_testimonials_submitted_at ON testimonials(submitted_at DESC);
