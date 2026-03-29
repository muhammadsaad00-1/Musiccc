import os

from dotenv import load_dotenv
from supabase import Client, create_client

load_dotenv()

SUPABASE_URL = os.getenv("SUPABASE_URL")
SUPABASE_KEY = os.getenv("SUPABASE_KEY") or os.getenv("SUPABASE_SERVICE_ROLE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise RuntimeError(
        "Missing Supabase env vars. Set SUPABASE_URL and SUPABASE_KEY (or SUPABASE_SERVICE_ROLE_KEY)."
    )

supabase: Client = create_client(SUPABASE_URL, SUPABASE_KEY)
