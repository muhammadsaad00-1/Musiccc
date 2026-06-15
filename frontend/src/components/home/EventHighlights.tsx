'use client';

import { useEffect, useMemo, useState } from 'react';
import Image from 'next/image';
import { CalendarDays, Clapperboard, PlayCircle, Sparkles } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  item_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string;
  display_order: number;
  created_at?: string;
}

const fallbackEventImages: PortfolioItem[] = [
  {
    id: 'fallback-img-1',
    title: 'Mehendi Night in Lahore',
    description: 'Traditional colors, dhol beats, and joyful dance performances.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=80',
    display_order: 1,
  },
  {
    id: 'fallback-img-2',
    title: 'Qawwali Evening Setup',
    description: 'Soulful live qawwali ambience for family and corporate gatherings.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1200&q=80',
    display_order: 2,
  },
  {
    id: 'fallback-img-3',
    title: 'Pakistani Wedding Reception',
    description: 'Grand event design with artist-led stage experiences.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1200&q=80',
    display_order: 3,
  },
  {
    id: 'fallback-img-4',
    title: 'Sufi Music Gathering',
    description: 'Elegant set with live vocals and curated cultural production.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1200&q=80',
    display_order: 4,
  },
  {
    id: 'fallback-img-5',
    title: 'Corporate Event in Karachi',
    description: 'Premium entertainment integrated with brand storytelling.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=1200&q=80',
    display_order: 5,
  },
  {
    id: 'fallback-img-6',
    title: 'Dhol and Folk Performance',
    description: 'High-energy Punjabi folk moments for destination events.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?auto=format&fit=crop&w=1200&q=80',
    display_order: 6,
  },
  {
    id: 'fallback-img-7',
    title: 'Cultural Artist Showcase',
    description: 'Live act curation for weddings and private soirées.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1506157786151-b8491531f063?auto=format&fit=crop&w=1200&q=80',
    display_order: 7,
  },
  {
    id: 'fallback-img-8',
    title: 'Destination Celebration',
    description: 'Luxury event atmosphere with stage-led performances.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1469371670807-013ccf25f16a?auto=format&fit=crop&w=1200&q=80',
    display_order: 8,
  },
  {
    id: 'fallback-img-9',
    title: 'Past Event Memory Board',
    description: 'Historic event moments from our curated productions.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1507874457470-272b3c8d8ee2?auto=format&fit=crop&w=1200&q=80',
    display_order: 9,
  },
];

const fallbackEventVideos: PortfolioItem[] = [
  {
    id: 'fallback-video-1',
    title: 'Event Highlight Reel',
    description: 'Sample performance highlight while your real uploads are being added.',
    item_type: 'video',
    media_url: 'https://youtu.be/eM1hpbgcmH0?si=w2LLPozuT0T1DQn0',
    thumbnail_url: 'https://img.youtube.com/vi/eM1hpbgcmH0/mqdefault.jpg',
    display_order: 1,
  },
];

function getYoutubeId(url: string): string | null {
  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/);
  return match ? match[1] : null;
}

export default function EventHighlights() {
  const [items, setItems] = useState<PortfolioItem[]>([]);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/portfolio`);
        if (!res.ok) return;
        const data = await res.json();
        if (Array.isArray(data)) setItems(data);
      } catch (e) {
        console.error('Failed to load event highlights', e);
      }
    };
    load();
  }, []);

  const imageItems = useMemo(() => {
    const fromBackend = items.filter((i) => i.item_type === 'image');
    return fromBackend.length > 0 ? fromBackend : fallbackEventImages;
  }, [items]);

  const videoItems = useMemo(() => {
    const fromBackend = items.filter((i) => i.item_type === 'video');
    return fromBackend.length > 0 ? fromBackend : fallbackEventVideos;
  }, [items]);

  const recentHighlights = useMemo(() => imageItems.slice(0, 8), [imageItems]);
  const pastEvents = useMemo(() => imageItems.slice(8), [imageItems]);

  return (
    <section className="relative py-20 lg:py-28 bg-[#0f0f10] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-24 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
        <div className="absolute bottom-1/4 -right-24 w-72 h-72 bg-pink-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-orange-500/30 text-orange-400 bg-gradient-to-r from-orange-500/15 to-pink-500/15 text-sm font-medium mb-6">
            <Sparkles className="w-4 h-4" /> Event Highlights
          </span>
          <h2 className="text-4xl md:text-5xl font-extrabold text-white tracking-tight mb-4">
            Recent Moments and Past Event Stories
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            From fresh celebrations to legacy productions, explore our event gallery in a curated format.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 mb-14">
          <div className="lg:col-span-8">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <CalendarDays className="w-5 h-5 text-orange-400" />
              Recent Event Highlights
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {recentHighlights.map((item, index) => (
                <div
                  key={item.id}
                  onClick={() => setSelectedImage(item.media_url)}
                  className={`relative overflow-hidden rounded-2xl border border-gray-800 cursor-pointer group ${index === 0 ? 'sm:col-span-2 aspect-[16/9]' : 'aspect-[4/3]'}`}
                >
                  <Image src={item.media_url} alt={item.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold line-clamp-1">{item.title}</p>
                    {item.description && <p className="text-gray-300 text-sm line-clamp-2">{item.description}</p>}
                  </div>
                </div>
              ))}
              {recentHighlights.length === 0 && (
                <div className="sm:col-span-2 rounded-2xl border border-dashed border-gray-700 bg-[#141416] p-10 text-center text-gray-500">
                  Event highlights are being prepared.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-4">
            <div className="flex items-center gap-2 mb-4 text-white font-semibold">
              <Clapperboard className="w-5 h-5 text-red-400" />
              Video Highlights
            </div>
            <div className="space-y-3 max-h-[540px] overflow-y-auto pr-1 custom-scrollbar">
              {videoItems.map((video) => {
                const videoId = getYoutubeId(video.media_url);
                const thumb = video.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : '');
                return (
                  <a
                    key={video.id}
                    href={video.media_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center gap-3 bg-[#18181b] border border-gray-800 hover:border-red-500/40 rounded-xl p-2.5 transition-all"
                  >
                    <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0">
                      {thumb && <Image src={thumb} alt={video.title} fill sizes="112px" className="object-cover" />}
                      <div className="absolute inset-0 bg-black/25 flex items-center justify-center">
                        <PlayCircle className="w-7 h-7 text-white/90" />
                      </div>
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm text-white line-clamp-2 group-hover:text-red-300 transition-colors">{video.title}</p>
                    </div>
                  </a>
                );
              })}
              {videoItems.length === 0 && (
                <div className="rounded-xl border border-dashed border-gray-700 bg-[#141416] p-6 text-sm text-gray-500">
                  Video highlights are being prepared.
                </div>
              )}
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-white mb-5">Past Events Archive</h3>
          <div className="columns-2 md:columns-3 lg:columns-4 gap-4 [column-fill:_balance]">
            {pastEvents.map((item) => (
              <button
                key={item.id}
                onClick={() => setSelectedImage(item.media_url)}
                className="relative mb-4 w-full overflow-hidden rounded-xl border border-gray-800 break-inside-avoid group text-left"
              >
                <Image src={item.media_url} alt={item.title} width={0} height={0} sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw" className="w-full h-auto object-cover group-hover:scale-[1.03] transition-transform duration-500" />
                <div className="absolute inset-x-0 bottom-0 p-3 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white text-sm font-medium line-clamp-2">{item.title}</p>
                </div>
              </button>
            ))}
            {pastEvents.length === 0 && (
              <div className="rounded-xl border border-dashed border-gray-700 bg-[#141416] p-6 text-sm text-gray-500">
                More event history will appear here as you upload additional portfolio images.
              </div>
            )}
          </div>
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative w-full h-full max-w-6xl max-h-[88vh]">
            <Image src={selectedImage} alt="Selected highlight" fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-contain" />
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #121214; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #34343a; border-radius: 999px; }
      `}</style>
    </section>
  );
}
