'use client';

import { useState, useEffect, useMemo, useRef } from 'react';
import { usePortfolio } from '@/lib/hooks';
import Link from 'next/link';
import { ArrowRight, Play, Film, X } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category?: string;
  media_type?: string;
  item_type?: string;
  media_url?: string;
  youtube_url?: string;
  thumbnail_url?: string;
}

type ItemKind = 'image' | 'youtube' | 'video';

function getKind(item: PortfolioItem): ItemKind {
  if (item.youtube_url) return 'youtube';
  const url = item.media_url || '';
  if (url.includes('youtu')) return 'youtube';
  const type = item.item_type || item.media_type || '';
  if (type === 'video' || type === 'youtube') return 'youtube';
  return 'image';
}

function ytEmbed(url?: string): string {
  if (!url) return '';
  if (url.includes('/embed/')) return url.includes('autoplay') ? url : `${url}?autoplay=1&rel=0`;
  const m = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
  return m && m[2].length === 11
    ? `https://www.youtube.com/embed/${m[2]}?autoplay=1&rel=0&modestbranding=1`
    : url;
}

function ytThumb(url?: string): string {
  if (!url) return '';
  const m = url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
  return m && m[2].length === 11
    ? `https://img.youtube.com/vi/${m[2]}/hqdefault.jpg`
    : '';
}

function getThumb(item: PortfolioItem): string {
  if (item.thumbnail_url) return item.thumbnail_url;
  const kind = getKind(item);
  if (kind === 'youtube') return ytThumb(item.youtube_url || item.media_url);
  return item.media_url || '';
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Fallback items shown when API returns nothing
const FALLBACK: PortfolioItem[] = [
  { id: 'fb1', title: 'Corporate Gala', category: 'Corporate', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop' },
  { id: 'fb2', title: 'Grand Wedding', category: 'Wedding', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop' },
  { id: 'fb3', title: 'Concert Night', category: 'Concert', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop' },
  { id: 'fb4', title: 'Festival Lights', category: 'Festival', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop' },
  { id: 'fb5', title: 'Private Party', category: 'Private', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop' },
  { id: 'fb6', title: 'Award Show', category: 'Awards', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop' },
  { id: 'fb7', title: 'Live Stage', category: 'Live', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop' },
  { id: 'fb8', title: 'Cultural Night', category: 'Cultural', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800&auto=format&fit=crop' },
  { id: 'fb9', title: 'Mehendi Celebration', category: 'Wedding', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1577086664693-894d8405334a?w=800&auto=format&fit=crop' },
  { id: 'fb10', title: 'DJ Night', category: 'Party', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop' },
];

// 8 grid slots: slot 0 = 2×2 large, slots 1–6 = 1×1, slot 7 = 2×1 wide
const GRID_SLOTS = 8;
const SWAP_MS = 3800;

// CSS classes per slot [colSpan, rowSpan]
const SLOT_CLASSES = [
  'col-span-2 row-span-2',   // 0 – featured large
  'col-span-1 row-span-1',   // 1
  'col-span-1 row-span-1',   // 2
  'col-span-1 row-span-1',   // 3
  'col-span-1 row-span-1',   // 4
  'col-span-1 row-span-1',   // 5
  'col-span-1 row-span-1',   // 6
  'col-span-2 row-span-1',   // 7 – wide bottom
];

export default function HomeGallerySection() {
  const { data: raw, isLoading } = usePortfolio();

  const allItems = useMemo<PortfolioItem[]>(() => {
    const source = (raw && (raw as PortfolioItem[]).length > 0)
      ? (raw as PortfolioItem[])
      : FALLBACK;
    return shuffle(source);
  }, [raw]);

  // Indices into allItems for each grid slot
  const [gridIdx, setGridIdx] = useState<number[]>([]);
  const poolPtr = useRef(0);

  // Which slot is currently playing a video
  const [playingSlot, setPlayingSlot] = useState<number | null>(null);

  // Which slots are fading out (for swap animation)
  const [fading, setFading] = useState<Set<number>>(new Set());

  // Init grid
  useEffect(() => {
    if (!allItems.length) return;
    const count = Math.min(GRID_SLOTS, allItems.length);
    setGridIdx(Array.from({ length: count }, (_, i) => i));
    poolPtr.current = count % allItems.length;
    setPlayingSlot(null);
  }, [allItems]);

  // Auto-cycle: swap one random non-playing slot
  useEffect(() => {
    if (allItems.length <= GRID_SLOTS) return;

    const id = setInterval(() => {
      const candidates = Array.from({ length: GRID_SLOTS }, (_, i) => i)
        .filter(s => s !== playingSlot);
      if (!candidates.length) return;

      const slot = candidates[Math.floor(Math.random() * candidates.length)];

      // Fade out the slot
      setFading(prev => new Set([...prev, slot]));

      setTimeout(() => {
        setGridIdx(prev => {
          const next = [...prev];
          next[slot] = poolPtr.current;
          poolPtr.current = (poolPtr.current + 1) % allItems.length;
          return next;
        });
        setFading(prev => { const s = new Set(prev); s.delete(slot); return s; });
      }, 420);
    }, SWAP_MS);

    return () => clearInterval(id);
  }, [allItems.length, playingSlot]);

  if (isLoading) return null;

  const items = gridIdx.map(i => allItems[i]).filter(Boolean);

  return (
    <section className="w-full py-20 lg:py-28 bg-[#0a0a0b] relative overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* ── Heading ── */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[4px] uppercase text-orange-400 mb-5">
            <span className="w-8 h-[1px] bg-orange-500/50" />
            Portfolio &amp; Performances
            <span className="w-8 h-[1px] bg-orange-500/50" />
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-white leading-tight tracking-tight">
            Moments That{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Last Forever
            </span>
          </h2>
          <p className="mt-4 text-gray-400 text-base max-w-lg mx-auto leading-relaxed">
            Browse event photos and watch live performances — all in one place.
            Click any video to play it right here.
          </p>
        </div>

        {/* ── Unified Grid ── */}
        <div
          className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 lg:gap-3"
          style={{ gridAutoRows: 'clamp(150px, 22vw, 220px)' }}
        >
          {items.map((item, slot) => {
            const spanClass = SLOT_CLASSES[slot] ?? 'col-span-1 row-span-1';
            const kind = getKind(item);
            const isVideo = kind !== 'image';
            const thumb = getThumb(item);
            const isFading = fading.has(slot);
            const isPlaying = playingSlot === slot;

            return (
              <div
                key={`${slot}-${item.id}`}
                className={`relative overflow-hidden rounded-2xl bg-[#111] border group transition-all duration-300 ${spanClass} ${
                  isPlaying
                    ? 'border-orange-500/50 ring-2 ring-orange-500/20 z-10 shadow-2xl shadow-orange-500/10'
                    : 'border-white/5 hover:border-white/15'
                }`}
                style={{ opacity: isFading ? 0 : 1, transition: 'opacity 0.42s ease, border-color 0.3s' }}
              >
                {isPlaying ? (
                  /* ── Inline video player ── */
                  <div className="absolute inset-0 bg-black">
                    {kind === 'youtube' ? (
                      <iframe
                        src={ytEmbed(item.youtube_url || item.media_url)}
                        title={item.title}
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                        allowFullScreen
                        className="absolute inset-0 w-full h-full border-0"
                      />
                    ) : (
                      <video
                        src={item.media_url}
                        autoPlay
                        controls
                        className="absolute inset-0 w-full h-full object-contain"
                      />
                    )}
                    {/* Close button */}
                    <button
                      onClick={() => setPlayingSlot(null)}
                      className="absolute top-2.5 right-2.5 z-30 w-8 h-8 rounded-full bg-black/80 hover:bg-black flex items-center justify-center border border-white/20 hover:border-white/40 transition-all shadow-lg"
                      aria-label="Stop video"
                    >
                      <X className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  /* ── Thumbnail card ── */
                  <>
                    {/* Image */}
                    <img
                      src={thumb}
                      alt={item.title || 'Event moment'}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Gradient */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/10 to-transparent opacity-50 group-hover:opacity-80 transition-opacity duration-300" />

                    {/* Video badge */}
                    {isVideo && (
                      <div className="absolute top-3 left-3 z-10 flex items-center gap-1.5 px-2 py-1 bg-black/60 backdrop-blur-md rounded-full border border-red-500/40">
                        <Film className="w-3 h-3 text-red-400" />
                        <span className="text-[9px] font-bold text-red-400 tracking-widest uppercase">Video</span>
                      </div>
                    )}

                    {/* Play button overlay for videos */}
                    {isVideo && (
                      <button
                        onClick={() => setPlayingSlot(slot)}
                        className="absolute inset-0 z-10 flex items-center justify-center"
                        aria-label={`Play ${item.title}`}
                      >
                        <div className="w-14 h-14 rounded-full bg-black/40 border-2 border-white/50 backdrop-blur-sm flex items-center justify-center group-hover:scale-110 group-hover:bg-orange-500 group-hover:border-orange-400 transition-all duration-300 shadow-2xl">
                          <Play className="w-6 h-6 text-white fill-white ml-0.5" />
                        </div>
                      </button>
                    )}

                    {/* Hover caption */}
                    <div className="absolute bottom-0 left-0 right-0 p-3.5 z-10 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                      {item.category && (
                        <span className="block text-[9px] font-bold tracking-[3px] uppercase text-orange-400 mb-1">
                          {item.category}
                        </span>
                      )}
                      {item.title && (
                        <p className="text-sm font-semibold text-white leading-snug line-clamp-2">
                          {item.title}
                        </p>
                      )}
                    </div>

                    {/* Clickable area for images → gallery page */}
                    {!isVideo && (
                      <Link
                        href="/gallery"
                        className="absolute inset-0 z-10"
                        aria-label={item.title}
                      />
                    )}
                  </>
                )}
              </div>
            );
          })}
        </div>

        {/* ── CTA ── */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-12">
          <Link
            href="/gallery"
            className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[3px] text-orange-500 hover:text-white transition-colors duration-300 border border-orange-500/30 hover:border-orange-500 hover:bg-orange-500/10 px-8 py-3.5 rounded-full"
          >
            View Full Gallery <ArrowRight size={15} />
          </Link>
        </div>
      </div>
    </section>
  );
}
