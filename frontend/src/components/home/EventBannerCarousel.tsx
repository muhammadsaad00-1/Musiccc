'use client';

import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface EventBanner {
  id: string;
  title: string;
  bg_image_url: string;
  whatsapp_message: string;
  is_active: boolean;
  display_order: number;
}

// Provide your WhatsApp number here
const WHATSAPP_NUMBER = "923001234567"; // TODO: Replace with actual number

export default function EventBannerCarousel() {
  const [banners, setBanners] = useState<EventBanner[]>([]);
  const [activeIndex, setActiveIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch active banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/event-banners`);
        const result = await res.json();
        if (result.success && result.data.length > 0) {
          setBanners(result.data);
        }
      } catch (error) {
        console.error("Failed to fetch event banners:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchBanners();
  }, []);

  // Auto-cycle every 2.5 seconds
  useEffect(() => {
    if (banners.length <= 1) return;
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % banners.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [banners.length]);

  const handleBooking = (message: string) => {
    const encodedMessage = encodeURIComponent(
      `Hi The Artist Factory Team! I want to book an artist for ${message}. Could you please guide me about the available artists and pricing?`
    );
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  // Don't render if no banners or still loading
  if (loading || banners.length === 0) return null;

  return (
    <section className="w-full max-w-[1500px] mx-auto px-4 sm:px-8 lg:px-12 py-10 relative z-20">
      <div className="relative w-full rounded-3xl overflow-hidden shadow-2xl group border border-white/5 bg-[#111]"
           style={{ aspectRatio: '5 / 1', minHeight: '180px' }}>
        
        {/* Background Images */}
        {banners.map((banner, idx) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
              idx === activeIndex ? 'opacity-100 z-10' : 'opacity-0 z-0'
            }`}
          >
            {/* Dark overlays for text readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-black/30 z-10 pointer-events-none" />
            
            <img 
              src={banner.bg_image_url}
              alt={banner.title}
              className={`w-full h-full object-cover transition-transform duration-[4000ms] ease-linear ${
                idx === activeIndex ? 'scale-110' : 'scale-100'
              }`}
            />
          </div>
        ))}

        {/* Dynamic Content Overlay */}
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-4 pb-8 pt-4 text-center">
            
          {/* Title */}
          <h2 
            key={activeIndex}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-playfair font-bold text-white italic drop-shadow-xl mb-5 md:mb-6 max-w-4xl leading-tight animate-fadeIn"
          >
            {banners[activeIndex].title}
          </h2>

          {/* Booking Button */}
          <button 
            onClick={() => handleBooking(banners[activeIndex].whatsapp_message)}
            className="relative px-5 md:px-7 py-2.5 md:py-3 rounded-full z-30 cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95"
            style={{
              background: 'rgba(20, 20, 20, 0.85)',
              backdropFilter: 'blur(12px)',
            }}
          >
            {/* Gradient Border */}
            <div 
              className="absolute inset-0 rounded-full pointer-events-none"
              style={{
                padding: '1.5px',
                background: 'linear-gradient(135deg, #ec4899, #a855f7, #f97316)',
                WebkitMask: 'linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)',
                WebkitMaskComposite: 'xor',
                maskComposite: 'exclude',
              }}
            />
            
            <span className="text-[10px] sm:text-xs font-semibold tracking-[2px] uppercase text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-orange-400">
              Book Your Artist Now
            </span>
          </button>
        </div>

        {/* Dot Indicators */}
        {banners.length > 1 && (
          <div className="absolute bottom-3 inset-x-0 z-30 flex items-center justify-center gap-2 pointer-events-none">
            {banners.map((_, idx) => (
              <div 
                key={idx}
                className={`h-1 rounded-full transition-all duration-500 ${
                  idx === activeIndex ? 'w-7 bg-white/80' : 'w-1.5 bg-white/25'
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
