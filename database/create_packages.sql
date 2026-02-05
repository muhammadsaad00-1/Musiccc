-- Packages System Database Schema
-- This file contains the SQL schema for the packages feature

-- Create packages table
CREATE TABLE IF NOT EXISTS packages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    description TEXT,
    event_type VARCHAR(100) NOT NULL,
    pricing NUMERIC NOT NULL,
    features TEXT[], -- Array of package features/inclusions
    is_active BOOLEAN DEFAULT true,
    duration VARCHAR(50), -- e.g., "4 hours", "Full day"
    max_guests INT,
    header_image_url TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create junction table for package-performer relationships
CREATE TABLE IF NOT EXISTS package_performers (
    package_id UUID REFERENCES packages(id) ON DELETE CASCADE,
    performer_id UUID REFERENCES performers(id) ON DELETE CASCADE,
    PRIMARY KEY (package_id, performer_id)
);

-- Add package tracking fields to booking_requirements table
ALTER TABLE booking_requirements 
ADD COLUMN IF NOT EXISTS package_id UUID REFERENCES packages(id),
ADD COLUMN IF NOT EXISTS package_name VARCHAR(255),
ADD COLUMN IF NOT EXISTS artist_id UUID,
ADD COLUMN IF NOT EXISTS artist_name VARCHAR(255);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_packages_event_type ON packages(event_type);
CREATE INDEX IF NOT EXISTS idx_packages_is_active ON packages(is_active);
CREATE INDEX IF NOT EXISTS idx_package_performers_package_id ON package_performers(package_id);
CREATE INDEX IF NOT EXISTS idx_package_performers_performer_id ON package_performers(performer_id);
CREATE INDEX IF NOT EXISTS idx_booking_requirements_package_id ON booking_requirements(package_id);

-- Add comments for documentation
COMMENT ON TABLE packages IS 'Stores pre-configured event packages with bundled services';
COMMENT ON TABLE package_performers IS 'Junction table linking packages to their included performers';
COMMENT ON COLUMN packages.features IS 'Array of text describing what is included in the package';
COMMENT ON COLUMN packages.is_active IS 'Whether the package is currently available for booking';
COMMENT ON COLUMN booking_requirements.package_id IS 'Reference to booked package if user selected one';
COMMENT ON COLUMN booking_requirements.package_name IS 'Name of the package at time of booking (for history)';
