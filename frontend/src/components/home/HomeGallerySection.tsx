'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePortfolio } from '@/lib/hooks';
import Link from 'next/link';
import { ArrowRight, Play, X } from 'lucide-react';

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

function getThumb(item: PortfolioItem): string {
  if (item.thumbnail_url) return item.thumbnail_url;
  if (item.youtube_url) {
    const m = item.youtube_url.match(/^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/);
    return m && m[2].length === 11 ? `https://img.youtube.com/vi/${m[2]}/hqdefault.jpg` : '';
  }
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

const FALLBACK: PortfolioItem[] = [
  { id: 'fb1',  title: 'Corporate Gala',      category: 'Corporate', item_type: 'image', media_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop' },
  { id: 'fb2',  title: 'Grand Wedding',        category: 'Wedding',   item_type: 'image', media_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop' },
  { id: 'fb3',  title: 'Concert Night',        category: 'Concert',   item_type: 'image', media_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop' },
  { id: 'fb4',  title: 'Festival Lights',      category: 'Festival',  item_type: 'image', media_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop' },
  { id: 'fb5',  title: 'Private Party',        category: 'Private',   item_type: 'image', media_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop' },
  { id: 'fb6',  title: 'Award Show',           category: 'Awards',    item_type: 'image', media_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop' },
  { id: 'fb7',  title: 'Live Stage',           category: 'Live',      item_type: 'image', media_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800&auto=format&fit=crop' },
  { id: 'fb8',  title: 'Cultural Night',       category: 'Cultural',  item_type: 'image', media_url: 'https://images.unsplash.com/photo-1504680177321-2e6a879aac86?w=800&auto=format&fit=crop' },
  { id: 'fb9',  title: 'Mehendi Celebration',  category: 'Wedding',   item_type: 'image', media_url: 'https://images.unsplash.com/photo-1577086664693-894d8405334a?w=800&auto=format&fit=crop' },
  { id: 'fb10', title: 'DJ Night',             category: 'Party',     item_type: 'image', media_url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?w=800&auto=format&fit=crop' },
];

// ─── Individual shape frame ──────────────────────────────────────────────────
function ShapeFrame({
  items,
  clipStyle,
  sizeClass,
  cycleMs = 4200,
  startDelay = 0,
  floatDuration = 7,
  floatDelay = 0,
}: {
  items: PortfolioItem[];
  clipStyle: React.CSSProperties;
  sizeClass: string;
  cycleMs?: number;
  startDelay?: number;
  floatDuration?: number;
  floatDelay?: number;
}) {
  const [activeIdx, setActiveIdx] = useState(0);
  const [ready, setReady] = useState(false);
  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setReady(true), startDelay);
    return () => clearTimeout(t);
  }, [startDelay]);

  // Pause cycling while video is playing
  useEffect(() => {
    if (!ready || playing || items.length <= 1) return;
    const id = setInterval(() => setActiveIdx(i => (i + 1) % items.length), cycleMs);
    return () => clearInterval(id);
  }, [ready, playing, items.length, cycleMs]);

  if (!items.length) return null;

  const activeItem = items[activeIdx];
  const isVideo = getKind(activeItem) !== 'image';
  const kind = getKind(activeItem);

  return (
    // Outer: float animation — paused while video plays so the frame stays steady
    <div
      className="flex-shrink-0"
      style={{
        animation: playing
          ? 'none'
          : `galleryFloat ${floatDuration}s ease-in-out infinite ${floatDelay}s`,
      }}
    >
      {/* Inner: shape clip + size */}
      <div
        className={`relative ${sizeClass}`}
        style={{ ...clipStyle, overflow: 'hidden' }}
      >
        {playing ? (
          /* ── Inline video inside the shaped frame ── */
          <div className="absolute inset-0 bg-black">
            {kind === 'youtube' ? (
              <iframe
                src={ytEmbed(activeItem.youtube_url || activeItem.media_url)}
                title={activeItem.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 w-full h-full border-0"
              />
            ) : (
              <video
                src={activeItem.media_url}
                autoPlay
                controls
                className="absolute inset-0 w-full h-full object-contain"
              />
            )}
            {/* Close — centred at top so it stays inside any clip shape */}
            <button
              onClick={() => setPlaying(false)}
              className="absolute top-2 left-1/2 -translate-x-1/2 z-30 w-7 h-7 rounded-full bg-black/80 hover:bg-black border border-white/30 hover:border-white/60 flex items-center justify-center transition-all shadow-lg"
              aria-label="Stop video"
            >
              <X className="w-3 h-3 text-white" />
            </button>
          </div>
        ) : (
          /* ── Cycling thumbnails ── */
          <>
            {items.map((item, i) => (
              <img
                key={i}
                src={getThumb(item)}
                alt=""
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover"
                style={{
                  opacity: i === activeIdx ? 1 : 0,
                  transition: 'opacity 1s ease-in-out',
                  zIndex: i === activeIdx ? 1 : 0,
                }}
              />
            ))}

            {/* Vignette */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'radial-gradient(ellipse at center, transparent 55%, rgba(0,0,0,0.4) 100%)',
                zIndex: 2,
              }}
            />

            {/* Play button — only when active item is a video */}
            {isVideo && (
              <button
                onClick={() => setPlaying(true)}
                className="absolute inset-0 z-10 flex items-center justify-center hover:scale-110 transition-transform duration-300"
                aria-label={`Play ${activeItem.title}`}
              >
                <div className="w-11 h-11 rounded-full bg-black/50 border-2 border-white/70 flex items-center justify-center shadow-xl backdrop-blur-sm hover:bg-orange-500 hover:border-orange-400 transition-colors duration-300">
                  <Play className="w-4 h-4 text-white fill-white ml-0.5" />
                </div>
              </button>
            )}
          </>
        )}
      </div>
    </div>
  );
}

// ─── Main section ────────────────────────────────────────────────────────────
export default function HomeGallerySection() {
  const { data: raw, isLoading } = usePortfolio();

  const allItems = useMemo<PortfolioItem[]>(() => {
    const source = (raw && (raw as PortfolioItem[]).length > 0)
      ? (raw as PortfolioItem[])
      : FALLBACK;
    return shuffle(source);
  }, [raw]);

  // Each of 7 frames gets an independent rotating slice of the item pool
  const frameItems = useMemo(() => {
    if (!allItems.length) return Array(7).fill([]) as PortfolioItem[][];
    const pool = allItems.length;
    return Array.from({ length: 7 }, (_, fi) =>
      Array.from({ length: Math.max(3, Math.ceil(pool / 4)) }, (_, j) =>
        allItems[(fi * 3 + j) % pool]
      )
    );
  }, [allItems]);

  if (isLoading) return null;

  return (
    <section className="w-full py-20 lg:py-28 bg-[#0a0a0b] relative overflow-hidden">
      <style>{`
        @keyframes galleryFloat {
          0%, 100% { transform: translateY(0px);   }
          50%       { transform: translateY(-10px); }
        }
      `}</style>

      {/* Ambient glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/4 w-[500px] h-[500px] bg-orange-600/5 rounded-full blur-[130px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[400px] h-[400px] bg-pink-600/5 rounded-full blur-[110px]" />
      </div>

      <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">

        {/* Heading */}
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
          </p>
        </div>

        {/*
          Row 1 (items-end): tall oval pill | large circle | pointed arch | diamond
          Bottom-aligned so differing heights form a stage silhouette
        */}
        <div className="flex items-end justify-center gap-3 sm:gap-5 lg:gap-7 flex-wrap">

          <ShapeFrame
            items={frameItems[0]}
            clipStyle={{ borderRadius: '999px' }}
            sizeClass="w-28 h-52 sm:w-36 sm:h-64 lg:w-44 lg:h-80"
            cycleMs={4200} startDelay={0} floatDuration={7} floatDelay={0}
          />

          <ShapeFrame
            items={frameItems[1]}
            clipStyle={{ borderRadius: '50%' }}
            sizeClass="w-44 h-44 sm:w-52 sm:h-52 lg:w-60 lg:h-60"
            cycleMs={4600} startDelay={500} floatDuration={8.5} floatDelay={1.2}
          />

          {/* Doorway arch (smooth round top, flat bottom) */}
          <ShapeFrame
            items={frameItems[2]}
            clipStyle={{ borderRadius: '999px 999px 20px 20px' }}
            sizeClass="w-32 h-52 sm:w-40 sm:h-64 lg:w-48 lg:h-80"
            cycleMs={5000} startDelay={1000} floatDuration={7.5} floatDelay={2.4}
          />

          {/* Rounded square — hidden on xs */}
          <ShapeFrame
            items={frameItems[3]}
            clipStyle={{ borderRadius: '24px' }}
            sizeClass="hidden sm:block w-36 h-36 lg:w-48 lg:h-48"
            cycleMs={5400} startDelay={1500} floatDuration={6.5} floatDelay={3.6}
          />
        </div>

        {/*
          Row 2 (items-center): left parallelogram | hexagon | right parallelogram
        */}
        <div className="flex items-center justify-center gap-3 sm:gap-5 lg:gap-7 flex-wrap mt-4 lg:mt-5">

          {/* Wide arch — round top, flat bottom */}
          <ShapeFrame
            items={frameItems[4]}
            clipStyle={{ borderRadius: '999px 999px 16px 16px' }}
            sizeClass="w-44 h-32 sm:w-60 sm:h-40 lg:w-72 lg:h-48"
            cycleMs={4400} startDelay={300} floatDuration={9} floatDelay={0.6}
          />

          {/* Circle */}
          <ShapeFrame
            items={frameItems[5]}
            clipStyle={{ borderRadius: '50%' }}
            sizeClass="w-36 h-36 sm:w-48 sm:h-48 lg:w-56 lg:h-56"
            cycleMs={4800} startDelay={900} floatDuration={7.2} floatDelay={1.8}
          />

          {/* Inverted arch — flat top, round bottom */}
          <ShapeFrame
            items={frameItems[6]}
            clipStyle={{ borderRadius: '16px 16px 999px 999px' }}
            sizeClass="w-44 h-32 sm:w-60 sm:h-40 lg:w-72 lg:h-48"
            cycleMs={5200} startDelay={1400} floatDuration={8} floatDelay={3}
          />
        </div>

        {/* CTA */}
        <div className="flex items-center justify-center mt-14">
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
