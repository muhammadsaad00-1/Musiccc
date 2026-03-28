-- ============================================================
-- About Profile table (single founder/profile record)
-- ============================================================
CREATE TABLE IF NOT EXISTS about_profile (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    founder_name        TEXT NOT NULL,
    founder_title       TEXT,
    founder_bio         TEXT NOT NULL,
    image_url           TEXT,
    instagram_url       TEXT,
    primary_cta_text    TEXT,
    primary_cta_link    TEXT,
    secondary_cta_text  TEXT,
    secondary_cta_link  TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_profile ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read about_profile"
    ON about_profile FOR SELECT USING (true);

CREATE POLICY "Service role full access about_profile"
    ON about_profile FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_about_profile_updated_at ON about_profile(updated_at DESC);

-- Optional storage bucket for founder/profile image
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('about-profile', 'about-profile', TRUE)
-- ON CONFLICT DO NOTHING;
