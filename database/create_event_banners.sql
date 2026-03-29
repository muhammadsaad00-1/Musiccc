-- ============================================================
-- Event Banners table (homepage banner carousel)
-- ============================================================
CREATE TABLE IF NOT EXISTS event_banners (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title               TEXT NOT NULL,
    bg_image_url        TEXT NOT NULL,
    whatsapp_message    TEXT NOT NULL,
    is_active           BOOLEAN NOT NULL DEFAULT TRUE,
    display_order       INTEGER NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

ALTER TABLE event_banners ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public read active event_banners"
    ON event_banners FOR SELECT USING (is_active = true);

CREATE POLICY "Service role full access event_banners"
    ON event_banners FOR ALL TO service_role USING (true) WITH CHECK (true);

CREATE INDEX IF NOT EXISTS idx_event_banners_active_order ON event_banners(display_order) WHERE is_active = true;
CREATE INDEX IF NOT EXISTS idx_event_banners_display_order ON event_banners(display_order);
CREATE INDEX IF NOT EXISTS idx_event_banners_updated_at ON event_banners(updated_at DESC);

-- Optional storage bucket for banner images
-- INSERT INTO storage.buckets (id, name, public)
-- VALUES ('event-banners', 'event-banners', TRUE)
-- ON CONFLICT DO NOTHING;
