'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface ClientLogo {
  id?: string;
  name: string;
  logo_url?: string;
  is_active?: boolean;
  display_order?: number;
}

export default function ClientsMarquee() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [rotation, setRotation] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [allBrands, setAllBrands] = useState<ClientLogo[]>([]);

  // Fetch backend client logos
  useEffect(() => {
    const fetchClientLogos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/client-logos`);
        if (response.ok) {
          const data: ClientLogo[] = await response.json();
          // Use only backend data
          setAllBrands(data);
        }
      } catch (error) {
        console.error('Error fetching client logos:', error);
      }
    };
    fetchClientLogos();
  }, []);

  const handlePrev = useCallback(() => {
    if (isAnimating || allBrands.length === 0) return;

    setIsAnimating(true);
    setRotation(prev => prev - 360); // Spin backwards

    // Change logo halfway through rotation
    setTimeout(() => {
      setCurrentIndex((prev) => (prev === 0 ? allBrands.length - 1 : prev - 1));
    }, 250);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [isAnimating, allBrands.length]);

  const handleNext = useCallback(() => {
    if (isAnimating || allBrands.length === 0) return;

    setIsAnimating(true);
    setRotation(prev => prev + 360);

    // Change logo halfway through rotation when it's moving fast/blurred
    setTimeout(() => {
      setCurrentIndex((prev) => (prev + 1) % allBrands.length);
    }, 250);

    setTimeout(() => {
      setIsAnimating(false);
    }, 500);
  }, [isAnimating, allBrands.length]);

  // Auto-rotation effect
  useEffect(() => {
    if (isPaused || allBrands.length === 0) return;

    const interval = setInterval(() => {
      handleNext();
    }, 5000); // Rotate every 5 seconds

    return () => clearInterval(interval);
  }, [handleNext, isPaused, allBrands.length]);

  const currentBrand = allBrands[currentIndex];

  if (!currentBrand) return null;

  return (
    <section className="py-24 bg-[#0a0a0b] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-16 relative">
          <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400 inline-block mb-4">
            Our Clients
          </h2>
          <div className="relative inline-block ml-4 align-top rotate-[-6deg]">
            <span className="font-handwriting text-2xl md:text-3xl text-pink-400 font-medium" style={{ fontFamily: 'cursive' }}>
              happy clients, Happy us
            </span>
            <svg className="absolute -bottom-6 -right-4 w-12 h-12 text-pink-400" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3">
              <path d="M10,10 Q50,50 80,80 M80,80 L60,80 M80,80 L80,60" />
            </svg>
          </div>
        </div>

        {/* The Rotating Disc Display */}
        <div className="relative flex flex-col items-center justify-center">

          {/* Background Glows */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-full blur-[100px] pointer-events-none" />

          {/* The Disc Container */}
          <div
            className="relative z-10 group"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
          >
            {/* Outer Ring / Record Grooves */}
            <div
              className="w-80 h-80 md:w-[500px] md:h-[500px] rounded-full bg-[#111] border-8 border-[#222] shadow-[0_20px_60px_-10px_rgba(0,0,0,0.8)] flex items-center justify-center transition-transform duration-500 ease-in-out"
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Vinyl Texture Lines */}
              <div className="absolute inset-0 rounded-full border border-white/5 m-4" />
              <div className="absolute inset-0 rounded-full border border-white/5 m-8" />
              <div className="absolute inset-0 rounded-full border border-white/5 m-12" />
              <div className="absolute inset-0 rounded-full border border-white/5 m-16" />
              <div className="absolute inset-0 rounded-full border border-white/5 m-20" />
              <div className="absolute inset-0 rounded-full border border-white/5 m-24" />

              {/* Center Label (The Brand Logo) */}
              {/* Counter-rotate the inner content so logos stay readable? 
                        Actually user asked for "rotate disc", implying the logo spins too. 
                        Let's spin the whole thing for the transition effect. */
              }
              <div className="w-52 h-52 md:w-[350px] md:h-[350px] rounded-full bg-gradient-to-br from-[#1a1a1a] to-black flex items-center justify-center border-4 border-[#333] shadow-inner relative overflow-hidden">

                {/* Logo Content */}
                <div
                  className={`transition-opacity duration-200 ${isAnimating ? 'opacity-50 blur-sm' : 'opacity-100'} flex items-center justify-center w-full h-full p-8`}
                >
                  {currentBrand.logo_url ? (
                    <div className="relative w-full h-full">
                      <Image
                        src={currentBrand.logo_url}
                        alt={currentBrand.name}
                        fill
                        className="object-contain group-hover:scale-110 transition-transform duration-300"
                        sizes="(max-width: 768px) 208px, 350px"
                        priority={currentIndex === 0}
                      />
                    </div>
                  ) : (
                    <div className="text-center">
                      <p className="text-2xl font-bold text-white">{currentBrand.name}</p>
                    </div>
                  )}
                </div>

                {/* Glossy Overlay */}
                <div className="absolute inset-0 bg-gradient-to-tr from-white/5 to-transparent pointer-events-none" />
              </div>
            </div>

            {/* "Previous" Button Overlaid */}
            <button
              onClick={handlePrev}
              className="absolute top-1/2 -left-8 md:-left-24 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-[#1a1a1a] border border-gray-700 rounded-full flex items-center justify-center hover:bg-orange-600 hover:border-orange-500 hover:text-white transition-all duration-300 shadow-xl group/btn active:scale-95 z-20"
              aria-label="Previous Client"
            >
              <ArrowLeft className="w-8 h-8 text-gray-400 group-hover/btn:text-white transition-colors" />
            </button>

            {/* "Play/Next" Button Overlaid or nearby */}
            <button
              onClick={handleNext}
              className="absolute top-1/2 -right-8 md:-right-24 -translate-y-1/2 w-16 h-16 md:w-20 md:h-20 bg-[#1a1a1a] border border-gray-700 rounded-full flex items-center justify-center hover:bg-orange-600 hover:border-orange-500 hover:text-white transition-all duration-300 shadow-xl group/btn active:scale-95 z-20"
              aria-label="Next Client"
            >
              <ArrowRight className="w-8 h-8 text-gray-400 group-hover/btn:text-white transition-colors" />
            </button>

            {/* Decorative Needle (Stylistic) */}
            <div className="absolute -top-10 -right-10 md:-right-20 w-32 h-64 pointer-events-none origin-top-right rotate-12 transition-transform duration-500 opacity-50 hidden md:block">
              <div className="w-2 h-40 bg-gray-700 absolute right-4 top-0 rotate-[20deg] origin-top rounded-b-lg shadow-lg" />
            </div>
          </div>

          {/* Current Client Name */}
          <div className="mt-12 text-center h-16">
            <h3 className="text-2xl font-bold text-white mb-2 tracking-wide animate-fade-in-up key">
              {currentBrand.name}
            </h3>
            <div className="flex justify-center gap-2">
              {allBrands.map((_, idx) => (
                <div
                  key={idx}
                  className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex ? 'bg-orange-500 w-6' : 'bg-gray-700'}`}
                />
              ))}
            </div>
          </div>

        </div>
      </div>

      <style jsx>{`
        @keyframes fade-in-up {
            0% { opacity: 0; transform: translateY(10px); }
            100% { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in-up {
            animation: fade-in-up 0.5s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
