'use client';

import { useState, useEffect, useCallback } from 'react';
import { usePortfolio } from '@/lib/hooks';
import { Play, Maximize2, X, ChevronLeft, ChevronRight, Video } from 'lucide-react';

interface PortfolioItem {
  id: string;
  title: string;
  category?: string; // from DB
  media_type: 'image' | 'video' | 'youtube';
  media_url?: string;
  youtube_url?: string;
  location?: string;
  date?: string;
}

const defaultItems: PortfolioItem[] = []; // Define outside to avoid reference changes

export default function GalleryComponent() {
  const { data: portfolioItems, isLoading } = usePortfolio();
  
  const [filter, setFilter] = useState('all');
  const [filteredItems, setFilteredItems] = useState<PortfolioItem[]>([]);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);

  const items: PortfolioItem[] = (portfolioItems && portfolioItems.length > 0) ? portfolioItems : defaultItems;

  // Extract unique categories dynamically
  const uniqueCategories = Array.from(
    new Set(items.map(item => item.category?.toLowerCase() || 'other').filter(Boolean))
  );

  const allCategories = [
    { id: 'all', label: 'All Events' },
    ...uniqueCategories.map(cat => ({
      id: cat,
      label: cat === 'other' ? 'Other' : cat.charAt(0).toUpperCase() + cat.slice(1)
    }))
  ];

  useEffect(() => {
    if (filter === 'all') {
      setFilteredItems(items);
    } else {
      setFilteredItems(items.filter(item => 
        (item.category?.toLowerCase() || 'other') === filter.toLowerCase()
      ));
    }
  }, [filter, items]);

  const openLightbox = (index: number) => {
    setLightboxIndex(index);
    document.body.style.overflow = 'hidden';
  };

  const closeLightbox = () => {
    setLightboxIndex(null);
    document.body.style.overflow = 'auto';
  };

  const navigateLightbox = useCallback((direction: number) => {
    if (lightboxIndex === null || filteredItems.length === 0) return;
    const newIndex = (lightboxIndex + direction + filteredItems.length) % filteredItems.length;
    setLightboxIndex(newIndex);
  }, [lightboxIndex, filteredItems.length]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === 'Escape') closeLightbox();
      if (e.key === 'ArrowRight') navigateLightbox(1);
      if (e.key === 'ArrowLeft') navigateLightbox(-1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lightboxIndex, navigateLightbox]);

  const getYoutubeEmbedUrl = (url?: string) => {
    if (!url) return '';
    if (url.includes('embed/')) return url;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11)
      ? `https://www.youtube.com/embed/${match[2]}?autoplay=1`
      : url;
  };

  const isYouTubeVideo = (item: PortfolioItem) => {
    return item.media_type === 'youtube' || 
           !!item.youtube_url || 
           (item.media_url && (item.media_url.includes('youtube.com') || item.media_url.includes('youtu.be')));
  };

  return (
    <div className="w-full bg-[#0a0a0b] text-[#F2EDE8] font-outfit pb-20">
      {/* HERO SECTION */}
      <section className="relative flex flex-col items-center justify-center min-h-[58vh] pt-24 pb-12 text-center overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute inset-0 pointer-events-none" style={{
          background: `
            radial-gradient(ellipse 60% 55% at 50% 100%, rgba(249,115,22,0.1) 0%, transparent 70%),
            radial-gradient(ellipse 80% 80% at 50% 50%, rgba(236,72,153,0.03) 0%, transparent 100%)
          `
        }}></div>
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{
          backgroundImage: 'repeating-linear-gradient(-45deg, #f97316 0, #f97316 1px, transparent 0, transparent 50%)',
          backgroundSize: '12px 12px'
        }}></div>
        
        <div className="relative z-10 animate-revealUp" style={{ animationDelay: '0.3s' }}>
          <div className="flex items-center gap-3 text-[11px] font-semibold tracking-[4px] uppercase text-orange-400 mb-6 justify-center">
            <span className="w-8 h-[1px] bg-orange-500/50"></span>
            Our Portfolio
            <span className="w-8 h-[1px] bg-orange-500/50"></span>
          </div>
          
          <h1 className="font-playfair text-5xl md:text-7xl lg:text-8xl font-black leading-[0.88] tracking-tight mb-6 animate-revealUp" style={{ animationDelay: '0.45s' }}>
            Events That<br />
            <span className="block italic font-normal text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 pb-2">Live Forever</span>
          </h1>
          
          <p className="mt-7 text-sm font-light text-[#BFB9B2] tracking-wide max-w-[420px] mx-auto leading-relaxed animate-revealUp px-4" style={{ animationDelay: '0.6s' }}>
            From grand weddings to electrifying concerts — every frame tells the story of an unforgettable moment.
          </p>
          
          <div className="w-[1px] h-12 bg-gradient-to-b from-orange-500/80 to-transparent mx-auto mt-8 animate-revealUp" style={{ animationDelay: '0.8s' }}></div>
        </div>
      </section>

      {/* FILTER SECTION */}
      <div className="border-b border-[#242424] px-4 sm:px-14 pt-12 pb-10 flex items-center overflow-x-auto no-scrollbar animate-revealUp" style={{ animationDelay: '1s' }}>
        <div className="flex">
          {allCategories.map((cat, idx) => (
            <button
              key={cat.id}
              onClick={() => setFilter(cat.id)}
              className={`
                flex-shrink-0 px-7 py-2.5 font-outfit text-[11px] font-semibold tracking-[2px] uppercase transition-all duration-300 border
                ${idx === 0 ? '' : '-ml-[1px]'}
                ${filter === cat.id 
                  ? 'bg-gradient-to-r from-orange-500 to-pink-600 border-transparent text-white z-10 shadow-lg shadow-orange-500/20' 
                  : 'bg-transparent border-[#2E2E2E] text-[#6E6A66] hover:text-orange-400 hover:border-orange-500/50 hover:z-10'
                }
              `}
            >
              {cat.label}
            </button>
          ))}
        </div>
        <span className="text-[10px] text-[#6E6A66] ml-auto tracking-[1px] pl-6 whitespace-nowrap hidden sm:block">
          Showing {filteredItems.length} {filter === 'all' ? 'events' : filter + ' events'}
        </span>
      </div>

      {/* GALLERY GRID (MASONRY) */}
      <div className="px-4 sm:px-10 py-10 pb-20 min-h-[40vh]">
        {isLoading ? (
          <div className="flex justify-center items-center h-64 text-orange-500">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-current"></div>
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center text-[#6E6A66] py-20 font-light flex flex-col items-center">
            <Video className="w-12 h-12 opacity-20 mb-4" />
            <p className="tracking-wide">No items found for this category yet.</p>
          </div>
        ) : (
          <div className="columns-1 sm:columns-2 lg:columns-3 gap-3 space-y-3">
            {filteredItems.map((item, index) => (
              <div 
                key={item.id}
                onClick={() => openLightbox(index)}
                className="group relative break-inside-avoid overflow-hidden cursor-pointer bg-[#1A1A1A] animate-revealUp rounded-sm"
                style={{ animationDelay: `${0.05 * (index % 10)}s` }}
              >
                <div className="w-full relative">
                  {isYouTubeVideo(item) ? (
                    <div className="w-full aspect-video bg-[#242424] flex items-center justify-center relative overflow-hidden transition-transform duration-700 group-hover:scale-105">
                      <img 
                        src={item.thumbnail_url || item.media_url || `https://img.youtube.com/vi/${getYoutubeEmbedUrl(item.youtube_url || item.media_url).split('embed/')[1]?.split('?')[0]}/maxresdefault.jpg`}
                        alt={item.title}
                        className="w-full h-full object-cover opacity-60"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://images.unsplash.com/photo-1493225457124-a1a2a5f5f4a7?q=80&w=800&auto=format&fit=crop';
                        }}
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-2 border-white/20 backdrop-blur-sm bg-black/30 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-600 transition-all duration-300 group-hover:scale-110 group-hover:border-transparent">
                          <Play className="text-white fill-white ml-1 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ) : item.media_type === 'video' ? (
                    <div className="w-full aspect-video bg-[#242424] flex items-center justify-center relative overflow-hidden transition-transform duration-700 group-hover:scale-105">
                      {/* Native HTML5 Preview - muted, non-autoplay */}
                      <video 
                        src={item.media_url} 
                        muted 
                        playsInline
                        className="w-full h-full object-cover opacity-70"
                      />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full border-2 border-white/20 backdrop-blur-sm bg-black/30 flex items-center justify-center group-hover:bg-gradient-to-r group-hover:from-orange-500 group-hover:to-pink-600 transition-all duration-300 group-hover:scale-110 group-hover:border-transparent">
                          <Play className="text-white fill-white ml-1 w-5 h-5" />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <img 
                      src={item.media_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=800&auto=format&fit=crop'} 
                      alt={item.title}
                      className="w-full object-cover transition-transform duration-700 group-hover:scale-105 min-h-[200px]"
                      loading="lazy"
                    />
                  )}
                </div>

                {/* Video Badge */}
                {(isYouTubeVideo(item) || item.media_type === 'video') && (
                  <div className="absolute top-3 right-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-[8px] font-bold tracking-[1.5px] uppercase px-2 py-1 flex items-center gap-1.5 z-10 shadow-lg rounded">
                    <Video size={10} className="fill-white" />
                    VIDEO
                  </div>
                )}

                {/* Expand Icon */}
                <div className="absolute top-3 left-3 w-8 h-8 border border-white/30 bg-black/40 backdrop-blur-sm flex items-center justify-center text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10 rounded">
                  <Maximize2 size={13} />
                </div>

                {/* Info Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#0C0C0C]/95 via-[#0C0C0C]/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-400 flex flex-col justify-end p-5">
                  <span className="text-[9px] font-semibold tracking-[2.5px] uppercase text-orange-400 mb-1">
                    {item.category || 'Other'}
                  </span>
                  <p className="font-playfair text-lg font-semibold text-[#F2EDE8] leading-tight drop-shadow-md">
                    {item.title}
                  </p>
                  <p className="text-[11px] text-[#BFB9B2] mt-1 opacity-80 max-h-[30px] overflow-hidden">
                    {item.description || item.location}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* LIGHTBOX */}
      {lightboxIndex !== null && filteredItems[lightboxIndex] && (
        <div 
          className="fixed inset-0 z-[500] bg-[#080808]/95 backdrop-blur-md flex items-center justify-center animate-fadeIn"
          onClick={(e) => {
            if (e.target === e.currentTarget) closeLightbox();
          }}
        >
          <div className="w-full max-w-5xl px-4 relative flex flex-col animate-scaleIn">
            <button 
              onClick={closeLightbox}
              className="absolute -top-12 right-4 bg-transparent border border-[#2E2E2E] text-[#BFB9B2] text-[13px] font-normal tracking-[2px] uppercase px-4 py-1.5 transition-colors duration-200 hover:border-orange-500 hover:text-orange-400 flex items-center gap-2 rounded"
            >
              <X size={14} /> Close
            </button>

            <div className="w-full bg-[#1A1A1A] flex items-center justify-center relative shadow-2xl overflow-hidden aspect-video md:aspect-auto md:min-h-[500px] rounded-lg">
              {isYouTubeVideo(filteredItems[lightboxIndex]) ? (
                <iframe 
                  src={getYoutubeEmbedUrl(filteredItems[lightboxIndex].youtube_url || filteredItems[lightboxIndex].media_url)}
                  title={filteredItems[lightboxIndex].title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="absolute inset-0 w-full h-full border-0"
                ></iframe>
              ) : filteredItems[lightboxIndex].media_type === 'video' ? (
                <video 
                  src={filteredItems[lightboxIndex].media_url}
                  controls
                  autoPlay
                  className="absolute inset-0 w-full h-full bg-black outline-none"
                />
              ) : (
                <img 
                  src={filteredItems[lightboxIndex].media_url}
                  alt={filteredItems[lightboxIndex].title}
                  className="max-w-full max-h-[75vh] object-contain"
                />
              )}
            </div>

            <div className="mt-5 flex items-center justify-between gap-4">
              <div>
                <span className="text-[10px] font-semibold tracking-[2px] uppercase text-orange-400 block mb-1">
                  {filteredItems[lightboxIndex].category || 'Other'}
                </span>
                <h3 className="font-playfair text-xl md:text-2xl text-[#F2EDE8]">
                  {filteredItems[lightboxIndex].title}
                </h3>
              </div>
              
              <div className="flex gap-2">
                <button 
                  onClick={() => navigateLightbox(-1)}
                  className="w-10 h-10 rounded border border-[#2E2E2E] bg-transparent text-[#BFB9B2] flex items-center justify-center transition-colors hover:border-orange-500 hover:text-orange-400"
                >
                  <ChevronLeft size={20} />
                </button>
                <button 
                  onClick={() => navigateLightbox(1)}
                  className="w-10 h-10 rounded border border-[#2E2E2E] bg-transparent text-[#BFB9B2] flex items-center justify-center transition-colors hover:border-orange-500 hover:text-orange-400"
                >
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM STYLES */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes revealUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-revealUp {
          opacity: 0;
          animation: revealUp 0.7s cubic-bezier(0.23, 1, 0.32, 1) forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.98); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-scaleIn {
          animation: scaleIn 0.35s cubic-bezier(0.25, 1, 0.5, 1) forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}} />
    </div>
  );
}
