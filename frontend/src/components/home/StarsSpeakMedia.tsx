'use client';

import { useEffect, useMemo, useState } from 'react';
import { Play, Image as ImageIcon } from 'lucide-react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api';

interface PortfolioItem {
  id: string;
  title: string;
  description?: string;
  item_type: 'image' | 'video';
  media_url: string;
  thumbnail_url?: string;
}

const fallbackStarsMedia: PortfolioItem[] = [
  {
    id: 'fallback-stars-video-1',
    title: 'Artist Short Testimonial',
    description: 'Sample short while testimonial videos are being uploaded.',
    item_type: 'video',
    media_url: 'https://www.youtube.com/shorts/LsM10e-hr0U',
    thumbnail_url: 'https://img.youtube.com/vi/LsM10e-hr0U/mqdefault.jpg',
  },
  {
    id: 'fallback-stars-img-1',
    title: 'Live Artist Moment',
    description: 'Performance captured during a cultural event night.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&w=1000&q=80',
  },
  {
    id: 'fallback-stars-img-2',
    title: 'Wedding Stage Story',
    description: 'A crafted showcase of lights, vocals, and celebration.',
    item_type: 'image',
    media_url: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&w=1000&q=80',
  },
];

function getYoutubeId(url: string): string | null {
  const shortsMatch = url.match(/youtube\.com\/shorts\/([^?&/\s]{11})/);
  if (shortsMatch) return shortsMatch[1];

  const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/);
  return match ? match[1] : null;
}

export default function StarsSpeakMedia() {
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
        console.error('Failed to load stars media', e);
      }
    };
    load();
  }, []);

  const mediaCards = useMemo(() => {
    if (items.length === 0) return fallbackStarsMedia;

    const hasVideo = items.some((item) => item.item_type === 'video');
    if (!hasVideo) {
      return [fallbackStarsMedia[0], ...items].slice(0, 12);
    }

    return items.slice(0, 12);
  }, [items]);

  return (
    <div className="mt-14">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <h3 className="text-2xl font-extrabold text-white">Look What Our Stars Have to Say</h3>
          </div>
      </div>

      <div className="overflow-x-auto pb-2 custom-scrollbar">
        <div className="flex gap-4 min-w-max">
          {mediaCards.map((item) => {
            const isVideo = item.item_type === 'video';
            const videoId = isVideo ? getYoutubeId(item.media_url) : null;
            const thumb = item.thumbnail_url || (videoId ? `https://img.youtube.com/vi/${videoId}/mqdefault.jpg` : item.media_url);

            const card = (
              <div className="relative w-72 rounded-2xl overflow-hidden border border-gray-800 bg-[#141417] group hover:border-orange-500/40 transition-all">
                <div className="relative h-44">
                  <Image src={thumb} alt={item.title} fill sizes="288px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/15 to-transparent" />
                  <div className="absolute top-2.5 left-2.5 inline-flex items-center gap-1.5 px-2 py-1 rounded-full text-[11px] font-semibold bg-black/60 text-white border border-white/10">
                    {isVideo ? <Play className="w-3 h-3" /> : <ImageIcon className="w-3 h-3" />}
                    {isVideo ? 'Video Story' : 'Photo Story'}
                  </div>
                </div>
                <div className="p-3.5">
                  <p className="text-white font-medium line-clamp-2">{item.title}</p>
                  {item.description && <p className="text-gray-400 text-xs mt-1 line-clamp-2">{item.description}</p>}
                </div>
              </div>
            );

            return isVideo ? (
              <a key={item.id} href={item.media_url} target="_blank" rel="noopener noreferrer" className="block">
                {card}
              </a>
            ) : (
              <button key={item.id} onClick={() => setSelectedImage(item.media_url)} className="block text-left">
                {card}
              </button>
            );
          })}

          {mediaCards.length === 0 && (
            <div className="w-full rounded-2xl border border-dashed border-gray-700 bg-[#131316] p-8 text-gray-500">
              Testimonial media stories are being prepared.
            </div>
          )}
        </div>
      </div>

      {selectedImage && (
        <div className="fixed inset-0 z-50 bg-black/95 flex items-center justify-center p-4" onClick={() => setSelectedImage(null)}>
          <div className="relative w-full h-full max-w-5xl max-h-[86vh]">
            <Image src={selectedImage} alt="Story image" fill sizes="(max-width: 1280px) 100vw, 1280px" className="object-contain" />
          </div>
        </div>
      )}

      <style jsx global>{`
        .custom-scrollbar::-webkit-scrollbar { height: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #131316; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #35353d; border-radius: 999px; }
      `}</style>
    </div>
  );
}
