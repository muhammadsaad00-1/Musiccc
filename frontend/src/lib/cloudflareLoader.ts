// Custom next/image loader.
//
// Routes OUR content images through Cloudflare Image Resizing (/cdn-cgi/image),
// which serves resized, AVIF/WebP images from the edge with zero R2 egress.
// Anything that isn't one of our content hosts (local /public assets, Unsplash,
// YouTube, Spotify, Instagram, etc.) is returned untouched.
//
// IMPORTANT: This is a SAFE NO-OP until NEXT_PUBLIC_IMAGE_CDN is set. Before the
// R2/Cloudflare domain is live, every image is returned as-is (original URL),
// so the site behaves exactly as it did with `unoptimized: true`.
//
// Set NEXT_PUBLIC_IMAGE_CDN to the Cloudflare-proxied domain that has Image
// Resizing / Transformations enabled, e.g. https://images.theartistfactory.com
// (NOT the pub-xxxx.r2.dev dev domain — /cdn-cgi/image only works on a CF zone).

interface CloudflareLoaderArgs {
  src: string;
  width: number;
  quality?: number;
}

// Strip any trailing slash so we can safely concatenate.
const CDN = (process.env.NEXT_PUBLIC_IMAGE_CDN || '').replace(/\/+$/, '');

// Hosts whose images we own and want resized: the R2 public bucket (where images
// now live), the legacy Supabase Storage host, and the CDN host itself. Because
// all are listed, no code change is needed when a custom CDN domain is added.
const CONTENT_HOSTS = [
  'pub-1ef26e48a558434899ad9e1fe8a98b3f.r2.dev',
  'ubskhylblogbuhzxhadk.supabase.co',
];

function isOurContentImage(src: string): boolean {
  if (!CDN) return false; // no CDN configured yet -> pass everything through
  if (!/^https?:\/\//i.test(src)) return false; // local /public asset
  try {
    const host = new URL(src).hostname;
    const cdnHost = new URL(CDN).hostname;
    return host === cdnHost || CONTENT_HOSTS.includes(host);
  } catch {
    return false;
  }
}

export default function cloudflareLoader({ src, width, quality }: CloudflareLoaderArgs): string {
  if (!isOurContentImage(src)) return src;

  // fit=scale-down never upscales beyond the source; format=auto negotiates AVIF/WebP.
  const options = [`width=${width}`, `quality=${quality || 75}`, 'format=auto', 'fit=scale-down'].join(',');

  // Cloudflare resizes a remote source when you append the absolute URL.
  return `${CDN}/cdn-cgi/image/${options}/${src}`;
}
