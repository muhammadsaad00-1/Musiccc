"""
One-off repair: fix truncated R2 image URLs in the `categories` table.

During the Supabase->R2 migration, category image_url values lost the 'dev'
host label, e.g.
    https://pub-...r2./categories/category_4.png   (broken)
should be
    https://pub-...r2.dev/categories/category_4.png  (correct)

Only the categories table is affected (performers and all other tables are clean).
Run once:  python fix_category_r2_urls.py

Idempotent: rows already containing '.r2.dev/' are left untouched.
"""
from supabase_conn import supabase

BAD = ".r2./"
GOOD = ".r2.dev/"


def main():
    rows = supabase.table("categories").select("id,name,image_url").execute().data or []
    fixed = 0
    for row in rows:
        url = row.get("image_url")
        if isinstance(url, str) and BAD in url:
            new_url = url.replace(BAD, GOOD)
            supabase.table("categories").update({"image_url": new_url}).eq("id", row["id"]).execute()
            print(f"  fixed [{row['id']}] {row.get('name')}: {url} -> {new_url}")
            fixed += 1
    print(f"\nDone. Repaired {fixed} of {len(rows)} category rows.")
    if fixed:
        print("Remember to clear the backend categories cache (redeploy or hit an")
        print("endpoint that calls invalidate_categories_cache) so the fix is served.")


if __name__ == "__main__":
    main()
