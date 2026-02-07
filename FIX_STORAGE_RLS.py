"""
Fix Supabase Storage RLS Issue

The 403 Unauthorized error occurs because Supabase Storage has Row-Level Security (RLS) 
policies that block uploads even with the service_role key.

SOLUTION - Choose ONE of these options:
"""

# ============================================
# OPTION 1: Make Buckets Public (Recommended)
# ============================================
"""
1. Go to: https://supabase.com/dashboard/project/ubskhylblogbuhzxhadk/storage/buckets

2. For each bucket (performers, events, packages):
   - Click on the bucket name
   - Click "Edit bucket" (or the 3 dots menu)
   - Enable "Public bucket" toggle
   - Click "Save"

This makes the buckets publicly accessible and bypasses RLS for uploads.
"""

# ============================================
# OPTION 2: Add RLS Policies via SQL
# ============================================
"""
If you want to keep buckets private but allow service_role access:

1. Go to: https://supabase.com/dashboard/project/ubskhylblogbuhzxhadk/sql/new

2. Run this SQL:
"""

SQL_TO_RUN = """
-- Allow service_role to do everything on storage.objects
CREATE POLICY "Allow service_role full access to performers"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'performers');

CREATE POLICY "Allow service_role full access to events"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'events');

CREATE POLICY "Allow service_role full access to packages"
ON storage.objects FOR ALL
TO service_role
USING (bucket_id = 'packages');

-- Allow public read access (so images can be displayed)
CREATE POLICY "Public read access to performers"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'performers');

CREATE POLICY "Public read access to events"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'events');

CREATE POLICY "Public read access to packages"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'packages');
"""

print("="*60)
print("SUPABASE STORAGE FIX")
print("="*60)
print("\n📋 RECOMMENDED: Use Option 1 (Make buckets public)\n")
print("1. Go to: https://supabase.com/dashboard/project/ubskhylblogbuhzxhadk/storage/buckets")
print("\n2. For each bucket (performers, events, packages):")
print("   • Click the bucket name")
print("   • Click 'Edit bucket'")
print("   • Toggle 'Public bucket' to ON")
print("   • Click 'Save'")
print("\n" + "="*60)
print("\n📋 ALTERNATIVE: Use Option 2 (Add RLS Policies)")
print("\n1. Go to: https://supabase.com/dashboard/project/ubskhylblogbuhzxhadk/sql/new")
print("\n2. Copy and run this SQL:\n")
print(SQL_TO_RUN)
print("\n" + "="*60)
