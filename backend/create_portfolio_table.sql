-- Run this SQL in your Supabase SQL Editor to create the portfolio table

CREATE TABLE IF NOT EXISTS portfolio (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type TEXT NOT NULL CHECK (type IN ('image', 'video')),
    url TEXT NOT NULL,
    title TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT now()
);

-- Enable Row Level Security (optional but recommended)
ALTER TABLE portfolio ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Public can read portfolio"
    ON portfolio FOR SELECT
    USING (true);

-- Only allow service role to insert/update/delete (admin only via backend)
