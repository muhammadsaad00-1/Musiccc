-- ============================================================
-- About Team table (team cards for About page)
-- ============================================================
CREATE TABLE IF NOT EXISTS about_team (
    id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name            TEXT NOT NULL,
    role            TEXT NOT NULL,
    bio             TEXT,
    emoji           TEXT DEFAULT '🎭',
    gradient        TEXT DEFAULT 'from-orange-500 to-pink-600',
    image_url       TEXT,
    display_order   INTEGER NOT NULL DEFAULT 0,
    created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE about_team ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read about_team"
    ON about_team FOR SELECT USING (true);

CREATE POLICY "Service role full access about_team"
    ON about_team FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_about_team_display_order ON about_team(display_order);
CREATE INDEX IF NOT EXISTS idx_about_team_updated_at ON about_team(updated_at DESC);

-- Optional storage bucket for team images
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('about-team', 'about-team', TRUE)
-- ON CONFLICT DO NOTHING;
