-- Repair truncated R2 image URLs in the categories table.
-- '...r2./categories/x.png'  ->  '...r2.dev/categories/x.png'
-- Run in the Supabase SQL editor. Idempotent (WHERE skips already-correct rows).

UPDATE categories
SET image_url = REPLACE(image_url, '.r2./', '.r2.dev/')
WHERE image_url LIKE '%.r2./%';

-- Verify (should return 0 rows after the update):
-- SELECT id, name, image_url FROM categories WHERE image_url LIKE '%.r2./%';
