-- ===================================================================
-- PERFORMANCE OPTIMIZATION: Database Indexes
-- ===================================================================
-- Run this SQL in your Supabase SQL Editor to improve query performance
-- Based on actual schema structure and common query patterns

-- ===================================================================
-- PERFORMERS TABLE INDEXES
-- ===================================================================
-- GIN index for ARRAY category field (critical for category filtering with @> operator)
CREATE INDEX IF NOT EXISTS idx_performers_category ON performers USING GIN (category);

-- GIN index for genres ARRAY field
CREATE INDEX IF NOT EXISTS idx_performers_genres ON performers USING GIN (genres);

-- B-tree index for name search and sorting
CREATE INDEX IF NOT EXISTS idx_performers_name ON performers (name);

-- Index for created_at sorting (newest first)
CREATE INDEX IF NOT EXISTS idx_performers_created_at ON performers (created_at DESC);

-- ===================================================================
-- CATEGORIES TABLE INDEXES
-- ===================================================================
-- Index for slug lookups (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories (slug);

-- Index for name search
CREATE INDEX IF NOT EXISTS idx_categories_name ON categories (name);

-- ===================================================================
-- EVENTS TABLE INDEXES
-- ===================================================================
-- Index for name search
CREATE INDEX IF NOT EXISTS idx_events_name ON events (name);

-- Index for pricing filtering/sorting
CREATE INDEX IF NOT EXISTS idx_events_pricing ON events (pricing);

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_events_created_at ON events (created_at DESC);

-- ===================================================================
-- PACKAGES TABLE INDEXES
-- ===================================================================
-- Index for event_type filtering
CREATE INDEX IF NOT EXISTS idx_packages_event_type ON packages (event_type);

-- Index for is_active filtering
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages (is_active) WHERE is_active = true;

-- Index for pricing filtering/sorting
CREATE INDEX IF NOT EXISTS idx_packages_pricing ON packages (pricing);

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_packages_created_at ON packages (created_at DESC);

-- ===================================================================
-- JUNCTION TABLE INDEXES (Critical for Join Performance)
-- ===================================================================
-- Event-Performer relationships
CREATE INDEX IF NOT EXISTS idx_event_performers_event_id ON event_performers (event_id);
CREATE INDEX IF NOT EXISTS idx_event_performers_performer_id ON event_performers (performer_id);

-- Package-Performer relationships
CREATE INDEX IF NOT EXISTS idx_package_performers_package_id ON package_performers (package_id);
CREATE INDEX IF NOT EXISTS idx_package_performers_performer_id ON package_performers (performer_id);

-- ===================================================================
-- BLOGS TABLE INDEXES
-- ===================================================================
-- Slug already has UNIQUE constraint (automatic index), but adding explicit for clarity
-- CREATE INDEX IF NOT EXISTS idx_blogs_slug ON blogs (slug); -- Not needed, UNIQUE constraint creates index

-- Index for category filtering
CREATE INDEX IF NOT EXISTS idx_blogs_category ON blogs (category);

-- Index for is_published filtering
CREATE INDEX IF NOT EXISTS idx_blogs_is_published ON blogs (is_published) WHERE is_published = true;

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_blogs_created_at ON blogs (created_at DESC);

-- Composite index for common query: published blogs by category, sorted by date
CREATE INDEX IF NOT EXISTS idx_blogs_category_published_date ON blogs (category, created_at DESC) WHERE is_published = true;

-- ===================================================================
-- PORTFOLIO ITEMS TABLE INDEXES
-- ===================================================================
-- Index for item_type filtering
CREATE INDEX IF NOT EXISTS idx_portfolio_item_type ON portfolio_items (item_type);

-- Index for is_active filtering
CREATE INDEX IF NOT EXISTS idx_portfolio_is_active ON portfolio_items (is_active) WHERE is_active = true;

-- Index for display_order (for ordering)
CREATE INDEX IF NOT EXISTS idx_portfolio_display_order ON portfolio_items (display_order);

-- Composite index for active items ordered by display_order
CREATE INDEX IF NOT EXISTS idx_portfolio_active_order ON portfolio_items (display_order) WHERE is_active = true;

-- ===================================================================
-- TESTIMONIALS TABLE INDEXES
-- ===================================================================
-- Index for type filtering (client/artist)
CREATE INDEX IF NOT EXISTS idx_testimonials_type ON testimonials (type);

-- Index for is_approved filtering
CREATE INDEX IF NOT EXISTS idx_testimonials_is_approved ON testimonials (is_approved) WHERE is_approved = true;

-- Index for rating filtering/sorting
CREATE INDEX IF NOT EXISTS idx_testimonials_rating ON testimonials (rating DESC);

-- Index for submitted_at sorting
CREATE INDEX IF NOT EXISTS idx_testimonials_submitted_at ON testimonials (submitted_at DESC);

-- Composite index for approved testimonials by type
CREATE INDEX IF NOT EXISTS idx_testimonials_type_approved ON testimonials (type, submitted_at DESC) WHERE is_approved = true;

-- ===================================================================
-- ARTIST TESTIMONIALS TABLE INDEXES
-- ===================================================================
-- Index for is_active filtering
CREATE INDEX IF NOT EXISTS idx_artist_testimonials_is_active ON artist_testimonials (is_active) WHERE is_active = true;

-- Index for rating filtering/sorting
CREATE INDEX IF NOT EXISTS idx_artist_testimonials_rating ON artist_testimonials (rating DESC);

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_artist_testimonials_created_at ON artist_testimonials (created_at DESC);

-- ===================================================================
-- REVIEWS TABLE INDEXES
-- ===================================================================
-- Index for rating filtering/sorting
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews (rating DESC);

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_reviews_created_at ON reviews (created_at DESC);

-- ===================================================================
-- HERO IMAGES TABLE INDEXES
-- ===================================================================
-- Index for is_active filtering
CREATE INDEX IF NOT EXISTS idx_hero_images_is_active ON hero_images (is_active) WHERE is_active = true;

-- Index for display_order
CREATE INDEX IF NOT EXISTS idx_hero_images_display_order ON hero_images (display_order);

-- Composite index for active images ordered by display_order
CREATE INDEX IF NOT EXISTS idx_hero_images_active_order ON hero_images (display_order) WHERE is_active = true;

-- ===================================================================
-- CLIENT LOGOS TABLE INDEXES
-- ===================================================================
-- Index for is_active filtering
CREATE INDEX IF NOT EXISTS idx_client_logos_is_active ON client_logos (is_active) WHERE is_active = true;

-- Index for display_order
CREATE INDEX IF NOT EXISTS idx_client_logos_display_order ON client_logos (display_order);

-- Composite index for active logos ordered by display_order
CREATE INDEX IF NOT EXISTS idx_client_logos_active_order ON client_logos (display_order) WHERE is_active = true;

-- ===================================================================
-- REQUIREMENTS TABLE INDEXES
-- ===================================================================
-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_requirements_status ON requirements (status);

-- Index for event_type filtering
CREATE INDEX IF NOT EXISTS idx_requirements_event_type ON requirements (event_type);

-- Index for event_date filtering/sorting
CREATE INDEX IF NOT EXISTS idx_requirements_event_date ON requirements (event_date DESC);

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_requirements_created_at ON requirements (created_at DESC);

-- ===================================================================
-- BOOKING REQUIREMENTS TABLE INDEXES
-- ===================================================================
-- Index for status filtering
CREATE INDEX IF NOT EXISTS idx_booking_requirements_status ON booking_requirements (status);

-- Index for event_type filtering
CREATE INDEX IF NOT EXISTS idx_booking_requirements_event_type ON booking_requirements (event_type);

-- Index for event_date filtering/sorting
CREATE INDEX IF NOT EXISTS idx_booking_requirements_event_date ON booking_requirements (event_date DESC);

-- Index for created_at sorting
CREATE INDEX IF NOT EXISTS idx_booking_requirements_created_at ON booking_requirements (created_at DESC);

-- Index for package_id foreign key
CREATE INDEX IF NOT EXISTS idx_booking_requirements_package_id ON booking_requirements (package_id);

-- Index for artist_id
CREATE INDEX IF NOT EXISTS idx_booking_requirements_artist_id ON booking_requirements (artist_id);

-- ===================================================================
-- VERIFICATION & PERFORMANCE TESTING
-- ===================================================================

-- Verify all indexes were created successfully:
-- SELECT 
--   schemaname, 
--   tablename, 
--   indexname, 
--   indexdef 
-- FROM pg_indexes 
-- WHERE schemaname = 'public' 
-- ORDER BY tablename, indexname;

-- Test query performance (BEFORE and AFTER indexes):
-- EXPLAIN ANALYZE SELECT * FROM performers WHERE category @> ARRAY['Singer'];
-- EXPLAIN ANALYZE SELECT * FROM performers WHERE name ILIKE '%artist%';
-- EXPLAIN ANALYZE SELECT * FROM packages WHERE event_type = 'Wedding' AND is_active = true;
-- EXPLAIN ANALYZE SELECT * FROM blogs WHERE category = 'Tips' AND is_published = true ORDER BY created_at DESC;

-- Check index usage statistics:
-- SELECT 
--   schemaname, 
--   tablename, 
--   indexname, 
--   idx_scan as index_scans,
--   idx_tup_read as tuples_read,
--   idx_tup_fetch as tuples_fetched
-- FROM pg_stat_user_indexes 
-- WHERE schemaname = 'public'
-- ORDER BY idx_scan DESC;

-- ===================================================================
-- EXPECTED PERFORMANCE IMPROVEMENTS
-- ===================================================================
-- - Performer category queries: 5-10x faster with GIN index
-- - Junction table joins (events/packages): 3-5x faster
-- - Sorting by created_at/display_order: 2-4x faster
-- - Filtering by is_active/is_published: 3-10x faster (partial indexes)
-- - Overall API response time: 60-75% reduction (from 3-4s to <1.5s)
-- ===================================================================
