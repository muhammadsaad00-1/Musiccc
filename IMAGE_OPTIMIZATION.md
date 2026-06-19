# Image Optimization & Caching

Documents the image-delivery changes and the **manual steps on Cloudflare/R2**.

## Current strategy (decided)
Images live in the **R2 public bucket** (`pub-1ef26e48a558434899ad9e1fe8a98b3f.r2.dev`)
and are served **directly with long cache headers + Cloudflare edge caching**.
**No on-the-fly resizing** — because `pub-*.r2.dev` does **not** support Cloudflare
Image Transformations (`/cdn-cgi/image` returns error 9524 / 403 there; it requires a
custom domain on a Cloudflare zone).

`next/image` is still used everywhere for **lazy loading, `fetchpriority`/preload on the
LCP image, and width/height reservation** (no layout shift) — it just passes the
original R2 URL through (`images.unoptimized: true`).

## What changed in code

### Frontend
- `frontend/next.config.ts` — `images.unoptimized: true` (passthrough), and the R2
  host added to `remotePatterns`. Contains an inline, 3-step upgrade path to switch
  to edge resizing once a custom domain exists.
- `frontend/src/lib/cloudflareLoader.ts` — **dormant** custom loader, kept for the
  future resizing path. No-op unless `NEXT_PUBLIC_IMAGE_CDN` is set AND wired in
  next.config. R2 + Supabase hosts are pre-listed so cutover needs no code change.
- Raw `<img>` → `next/image` across content + admin pages, with `sizes`, `priority`
  on the per-page LCP image, and `fill`/intrinsic sizing.
  - Intentionally left as `<img>`: `URL.createObjectURL` upload previews, and
    external images (YouTube, Unsplash, flagcdn, Spotify, Instagram).

### Backend
- `backend/main.py` — `storage_file_options()` applied to **all 27** Supabase Storage
  uploads: correct **`Content-Type`** (was defaulting to `text/plain`) + **`max-age=31536000`**.
  - ⚠️ The Supabase SDK only emits `Cache-Control: max-age=<n>` — it can't add
    `public`/`immutable`. Those belong on R2 objects / Cloudflare (below).
  - ⚠️ **Heads-up:** these uploads still write to **Supabase**, not R2. If reads now
    come from R2 but new uploads go to Supabase, new content URLs will be Supabase
    URLs. Decide whether to migrate the upload path to R2 (boto3) — see below.

## What YOU must do (current strategy)

### 1. Cache-Control on R2 objects
- **Backfill existing objects** (copy onto themselves with the header):
  ```bash
  aws s3 cp s3://BUCKET/ s3://BUCKET/ --recursive \
    --endpoint-url https://<ACCOUNT_ID>.r2.cloudflarestorage.com \
    --metadata-directive REPLACE \
    --cache-control "public, max-age=31536000, immutable" \
    --content-type image/jpeg
  ```
  (Run per content-type or script it; rclone `--header-upload` also works.)
- **New uploads** — if/when you move the upload path to R2 (boto3), set it directly:
  ```python
  s3.put_object(Bucket=BUCKET, Key=key, Body=data,
                ContentType=content_type,
                CacheControl="public, max-age=31536000, immutable")
  ```

### 2. (Optional) Front the bucket with a Cloudflare cache rule
If you put a Cloudflare-proxied domain in front of the bucket, add a Cache Rule:
`Hostname = your image domain` → Eligible for cache, **Edit Cache TTL + Browser TTL = a year**.
Filenames are unique, so objects are effectively immutable. The `r2.dev` domain
already serves with Cloudflare caching; the long object headers above drive browser caching.

## Future: enable edge resizing (AVIF/WebP + per-size srcset)
Requires a **custom domain** (r2.dev can't do it):
1. Bind a custom domain to the R2 bucket, proxy it through Cloudflare.
2. Cloudflare → Speed → Optimization → enable **Image Transformations** on that zone.
3. `NEXT_PUBLIC_IMAGE_CDN=https://images.yourdomain.com`
4. In `next.config.ts`, replace `unoptimized: true` with:
   `loader: "custom", loaderFile: "./src/lib/cloudflareLoader.ts"`.
   The loader + `sizes` attributes already in the JSX then start producing
   resized, format-negotiated `srcset`s automatically.

## Unrelated but important (flagged separately)
- A **service_role** Supabase key is hardcoded in `supabase_client.py` (full-access,
  in git history) and URL/anon key in `frontend/src/lib/supabase.ts`. **Rotate** the
  service_role key and move secrets to env vars.
