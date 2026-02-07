import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://ubskhylblogbuhzxhadk.supabase.co';
// You need to get the anon key from Supabase Dashboard > Project Settings > API > anon/public
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVic2toeWxibG9nYnVoenhoYWRrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzg5MjY3NTQsImV4cCI6MjA1NDUwMjc1NH0.YOUR_ACTUAL_ANON_KEY_HERE';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
