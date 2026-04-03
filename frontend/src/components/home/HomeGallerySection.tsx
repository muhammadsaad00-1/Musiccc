'use client';

import { useState, useEffect, useMemo } from 'react';
import { usePortfolio } from '@/lib/hooks';
import Link from 'next/link';
import { ArrowRight, Play, ChevronRight } from 'lucide-react';

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

function getYoutubeEmbedUrl(url?: string) {
  if (!url) return '';
  if (url.includes('embed/')) return url;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://www.youtube.com/embed/${match[2]}`
    : url;
}

function getYoutubeThumbnail(url?: string) {
  if (!url) return '';
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11)
    ? `https://img.youtube.com/vi/${match[2]}/hqdefault.jpg`
    : '';
}

export default function HomeGallerySection() {
  const { data: portfolioItems, isLoading } = usePortfolio();

  // Split portfolio into images and videos
  const images = useMemo(() => {
    if (!portfolioItems) return [];
    return portfolioItems.filter((item: PortfolioItem) => {
      const type = item.item_type || item.media_type;
      return type === 'image';
    });
  }, [portfolioItems]);

  const videos = useMemo(() => {
    if (!portfolioItems) return [];
    return portfolioItems.filter((item: PortfolioItem) => {
      const type = item.item_type || item.media_type;
      return type === 'video' || type === 'youtube';
    });
  }, [portfolioItems]);

  // Image cycling state
  const IMAGES_PER_PAGE = 8;
  const [imagePage, setImagePage] = useState(0);

  useEffect(() => {
    if (images.length <= IMAGES_PER_PAGE) return;
    const interval = setInterval(() => {
      setImagePage(prev => {
        const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
        return (prev + 1) % totalPages;
      });
    }, 6000);
    return () => clearInterval(interval);
  }, [images.length]);

  const visibleImages = useMemo(() => {
    const start = imagePage * IMAGES_PER_PAGE;
    const slice = images.slice(start, start + IMAGES_PER_PAGE);
    // If we have fewer than IMAGES_PER_PAGE, just show what we have
    return slice;
  }, [images, imagePage]);

  const totalImagePages = Math.max(1, Math.ceil(images.length / IMAGES_PER_PAGE));

  // Video player state
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);

  const activeVideo: PortfolioItem | null = videos[activeVideoIndex] || null;

  if (isLoading) return null;
  const hasImages = images.length > 0;
  const hasVideos = videos.length > 0;
  if (!hasImages && !hasVideos) return null;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 1: IMAGE GALLERY - Bento Grid with Auto-Cycling  */}
      {/* ══════════════════════════════════════════════════════════ */}
      {hasImages && (
        <section className="w-full py-20 bg-[#0a0a0b] text-[#f2ede8] overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(circle at 30% 50%, rgba(249,115,22,0.06) 0%, transparent 50%)'
          }}></div>

          {/* Centered Heading */}
          <div className="text-center mb-14 relative z-10 px-4">
            <div className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[4px] uppercase text-orange-400 mb-5">
              <span className="w-8 h-[1px] bg-orange-500/50"></span>
              Our Portfolio
              <span className="w-8 h-[1px] bg-orange-500/50"></span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-black text-white leading-tight">
              Moments That Last
            </h2>
            <p className="mt-4 text-[#bfb9b2] font-outfit text-base tracking-wide max-w-lg mx-auto">
              A glimpse into some of our most electrifying, unforgettable events.
            </p>
          </div>

          {/* Bento-style Image Grid */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 auto-rows-[200px] sm:auto-rows-[240px] lg:auto-rows-[220px]">
              {visibleImages.map((item: PortfolioItem, idx: number) => {
                // Create varied sizes for a bento effect
                let spanClass = '';
                if (idx === 0) spanClass = 'col-span-2 row-span-2';
                else if (idx === 3) spanClass = 'sm:col-span-2';
                else if (idx === 5) spanClass = 'sm:row-span-2';
                else if (idx === 7) spanClass = 'sm:col-span-2';

                return (
                  <Link
                    href="/gallery"
                    key={item.id || `img-${idx}`}
                    className={`relative overflow-hidden rounded-2xl group cursor-pointer bg-[#1a1a1a] border border-white/5 ${spanClass}`}
                    style={{
                      animation: 'bentoFadeIn 0.6s ease-out both',
                      animationDelay: `${idx * 80}ms`
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/80 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-90 transition-opacity duration-500"></div>
                    <img
                      src={item.thumbnail_url || item.media_url}
                      alt={item.title || 'Portfolio Event'}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 left-4 right-4 z-20 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-400">
                      <span className="text-[10px] font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 block mb-1">
                        {item.category || 'Event'}
                      </span>
                      <h3 className="font-playfair text-lg text-white font-bold leading-tight drop-shadow-lg">
                        {item.title}
                      </h3>
                    </div>
                  </Link>
                );
              })}
            </div>

            {/* Page Indicators */}
            {totalImagePages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                {Array.from({ length: totalImagePages }).map((_, i) => (
                  <button
                    key={i}
                    onClick={() => setImagePage(i)}
                    className={`h-1.5 rounded-full transition-all duration-500 ${
                      i === imagePage
                        ? 'w-8 bg-gradient-to-r from-orange-500 to-pink-500'
                        : 'w-3 bg-[#333] hover:bg-[#555]'
                    }`}
                  />
                ))}
              </div>
            )}

            {/* View Full Gallery CTA */}
            <div className="flex justify-center mt-10">
              <Link
                href="/gallery"
                className="flex items-center gap-2 text-[12px] font-outfit font-semibold uppercase tracking-[3px] text-orange-500 hover:text-pink-500 transition-colors duration-300 border border-orange-500/30 hover:border-pink-500/50 px-8 py-3 rounded-full hover:translate-x-1"
              >
                View Full Gallery <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ══════════════════════════════════════════════════════════ */}
      {/* SECTION 2: VIDEO HIGHLIGHTS - Master/Detail Player       */}
      {/* ══════════════════════════════════════════════════════════ */}
      {hasVideos && (
        <section className="w-full py-20 bg-[#0c0c0d] text-[#f2ede8] overflow-hidden relative">
          <div className="absolute inset-0 pointer-events-none" style={{
            background: 'radial-gradient(circle at 70% 40%, rgba(236,72,153,0.05) 0%, transparent 50%)'
          }}></div>

          {/* Centered Heading */}
          <div className="text-center mb-14 relative z-10 px-4">
            <div className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[4px] uppercase text-orange-400 mb-5">
              <span className="w-8 h-[1px] bg-orange-500/50"></span>
              Featured Performances
              <span className="w-8 h-[1px] bg-orange-500/50"></span>
            </div>
            <h2 className="text-4xl sm:text-5xl md:text-6xl font-playfair font-black text-white leading-tight">
              Watch Our Best Moments
            </h2>
            <p className="mt-4 text-[#bfb9b2] font-outfit text-base tracking-wide max-w-lg mx-auto">
              Experience the energy and talent from our most memorable performances.
            </p>
          </div>

          {/* Video Player + Playlist */}
          <div className="max-w-[1400px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
            <div className="flex flex-col lg:flex-row gap-5">

              {/* LEFT: Large Video Player */}
              <div className="w-full lg:w-[65%] xl:w-[68%]">
                <div className="relative w-full aspect-video bg-[#111] rounded-2xl overflow-hidden border border-white/5 shadow-2xl shadow-black/50">
                  {activeVideo && (
                    <>
                      {(activeVideo.item_type === 'video' && activeVideo.media_url?.includes('youtube')) ||
                       activeVideo.youtube_url ||
                       activeVideo.media_url?.includes('youtu') ? (
                        <iframe
                          key={activeVideo.id}
                          src={getYoutubeEmbedUrl(activeVideo.youtube_url || activeVideo.media_url)}
                          title={activeVideo.title}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="absolute inset-0 w-full h-full border-0"
                        />
                      ) : (
                        <video
                          key={activeVideo.id}
                          src={activeVideo.media_url}
                          controls
                          autoPlay
                          className="absolute inset-0 w-full h-full object-contain"
                        />
                      )}
                    </>
                  )}
                </div>
                {/* Active video title */}
                {activeVideo && (
                  <div className="mt-4 px-1">
                    <span className="text-[10px] font-semibold tracking-widest uppercase text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 block mb-1.5">
                      {activeVideo.category || 'Performance'}
                    </span>
                    <h3 className="font-playfair text-xl sm:text-2xl text-white font-bold leading-tight">
                      {activeVideo.title}
                    </h3>
                  </div>
                )}
              </div>

              {/* RIGHT: Scrollable Playlist */}
              <div className="w-full lg:w-[35%] xl:w-[32%]">
                <div className="lg:max-h-[480px] overflow-y-auto overflow-x-hidden flex flex-col gap-3 pr-1 custom-scrollbar" data-lenis-prevent>
                  {videos.map((video: PortfolioItem, idx: number) => {
                    const isActive = idx === activeVideoIndex;
                    const thumbUrl =
                      video.thumbnail_url ||
                      getYoutubeThumbnail(video.youtube_url || video.media_url) ||
                      video.media_url;

                    return (
                      <button
                        key={video.id || `vid-${idx}`}
                        onClick={() => setActiveVideoIndex(idx)}
                        className={`flex items-center gap-4 w-full text-left rounded-xl p-3 transition-all duration-300 border group ${
                          isActive
                            ? 'bg-gradient-to-r from-orange-500/10 to-pink-500/10 border-orange-500/30 shadow-lg shadow-orange-500/5'
                            : 'bg-[#161618] border-white/5 hover:bg-[#1e1e22] hover:border-orange-500/20'
                        }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-24 sm:w-28 h-16 sm:h-[72px] rounded-lg overflow-hidden flex-shrink-0 bg-[#222]">
                          <img
                            src={thumbUrl}
                            alt={video.title}
                            className="w-full h-full object-cover"
                            loading="lazy"
                          />
                          <div className={`absolute inset-0 flex items-center justify-center transition-colors duration-300 ${
                            isActive ? 'bg-black/30' : 'bg-black/50 group-hover:bg-black/30'
                          }`}>
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                              isActive
                                ? 'bg-orange-500 border-orange-500 scale-110'
                                : 'bg-black/50 border-white/20 group-hover:border-orange-500/50 group-hover:bg-orange-500/20'
                            }`}>
                              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
                            </div>
                          </div>
                        </div>

                        {/* Title */}
                        <div className="flex-1 min-w-0">
                          <h4 className={`font-outfit text-sm font-medium leading-snug transition-colors duration-300 line-clamp-2 ${
                            isActive ? 'text-orange-400' : 'text-[#ccc] group-hover:text-white'
                          }`}>
                            {video.title}
                          </h4>
                          {video.category && (
                            <span className="text-[10px] text-[#777] tracking-wider uppercase mt-1 block">
                              {video.category}
                            </span>
                          )}
                        </div>

                        {/* Active indicator */}
                        {isActive && (
                          <ChevronRight className="w-4 h-4 text-orange-500 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </section>
      )}

      {/* Inline styles for animations and scrollbar */}
      <style dangerouslySetInnerHTML={{
        __html: `
          @keyframes bentoFadeIn {
            from { opacity: 0; transform: translateY(16px) scale(0.97); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-track {
            background: transparent;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb {
            background: #333;
            border-radius: 4px;
          }
          .custom-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #555;
          }
        `
      }} />
    </>
  );
}
