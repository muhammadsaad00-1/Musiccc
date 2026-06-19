import type { NextConfig } from "next";


const nextConfig: NextConfig = {
  images: {
    // CURRENT SETUP: images are served straight from the R2 public bucket
    // (pub-*.r2.dev) with long Cache-Control headers + Cloudflare edge caching.
    // No on-the-fly resizing: r2.dev does NOT support Cloudflare Image
    // Transformations (/cdn-cgi/image returns 9524/403), so `unoptimized: true`
    // passes the original object URL through. next/image still gives us lazy
    // loading, fetchpriority, and width/height reservation (no layout shift).
    unoptimized: true,

    // ─── To enable edge resizing later (requires a custom domain) ────────────
    // 1. Bind a custom domain to the R2 bucket and proxy it through Cloudflare,
    //    then enable Speed → Optimization → Image Transformations on that zone.
    // 2. Set NEXT_PUBLIC_IMAGE_CDN=https://images.yourdomain.com
    // 3. Replace `unoptimized: true` above with the two lines below:
    //      loader: "custom",
    //      loaderFile: "./src/lib/cloudflareLoader.ts",
    //    (the loader is a no-op until NEXT_PUBLIC_IMAGE_CDN is set).
    // ─────────────────────────────────────────────────────────────────────────

    // remotePatterns is only enforced by Next's built-in optimizer (ignored
    // while `unoptimized` is on / a custom loader is used), but kept explicit
    // so sources are documented and future-proof.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '*.supabase.co',
      },
      {
        protocol: 'https',
        hostname: 'pub-1ef26e48a558434899ad9e1fe8a98b3f.r2.dev',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'i.ytimg.com',
      },
      {
        protocol: 'https',
        hostname: 'i.scdn.co',  // Spotify
      },
    ],
  },
};

export default nextConfig;
