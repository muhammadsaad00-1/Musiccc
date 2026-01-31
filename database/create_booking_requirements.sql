-- ============================================
-- BOOKING REQUIREMENTS TABLE
-- ============================================
-- Run this SQL in your Supabase SQL Editor
-- (Dashboard > SQL Editor > New Query)

-- Create the booking_requirements table
CREATE TABLE IF NOT EXISTS booking_requirements (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    event_type VARCHAR(100) NOT NULL,
    event_date DATE NOT NULL,
    event_location VARCHAR(100) NOT NULL,
    budget VARCHAR(50),
    artist_type VARCHAR(50) NOT NULL,
    customer_name VARCHAR(100) NOT NULL,
    customer_email VARCHAR(100) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    message TEXT,
    status VARCHAR(20) DEFAULT 'pending',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Add an index on status for faster filtering
CREATE INDEX IF NOT EXISTS idx_booking_requirements_status 
ON booking_requirements(status);

-- Add an index on created_at for sorting
CREATE INDEX IF NOT EXISTS idx_booking_requirements_created_at 
ON booking_requirements(created_at DESC);

-- Enable Row Level Security (optional, for production)
-- ALTER TABLE booking_requirements ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow all operations (for development)
-- For production, you should set up proper authentication
-- CREATE POLICY "Allow all" ON booking_requirements FOR ALL USING (true);

-- ============================================
-- SAMPLE DATA (Optional - for testing)
-- ============================================
-- Uncomment and run this to add sample data

/*
INSERT INTO booking_requirements (event_type, event_date, event_location, budget, artist_type, customer_name, customer_email, customer_phone, message, status)
VALUES 
('Wedding', '2024-03-15', 'Karachi', '300k-500k', 'singer', 'Ahmed Khan', 'ahmed@example.com', '03001234567', 'Looking for a classical singer for the mehndi night.', 'pending'),
('Corporate Event', '2024-04-01', 'Lahore', '100k-300k', 'dj', 'Sara Ali', 'sara@company.com', '03119876543', 'Need a DJ for our annual corporate event.', 'contacted'),
('Birthday Party', '2024-02-20', 'Islamabad', '50k-100k', 'musician', 'Bilal Ahmed', 'bilal@email.com', '03201112233', 'Want a live band for my 30th birthday celebration.', 'pending');
*/
