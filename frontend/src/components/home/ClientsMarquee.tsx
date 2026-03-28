'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api';

interface ClientLogo {
  id?: string;
  name: string;
  logo_url?: string;
  is_active?: boolean;
}

export default function ClientsMarquee() {
  const [logos, setLogos] = useState<ClientLogo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchLogos = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/api/client-logos`);
        if (response.ok) {
          const data = await response.json();
          setLogos(data.filter((l: any) => l.is_active));
        }
      } catch (error) {
        console.error('Error fetching client logos:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchLogos();
  }, []);

  if (loading || logos.length === 0) return null;

  // Split logos into two rows
  const midPoint = Math.ceil(logos.length / 2);
  const row1 = logos.slice(0, midPoint);
  const row2 = logos.slice(midPoint);

  // Triple the logos for seamless scroll
  const scrollRow1 = [...row1, ...row1, ...row1];
  const scrollRow2 = [...row2, ...row2, ...row2];

  return (
    <section className="py-24 bg-[#0a0a0b] overflow-hidden relative border-y border-white/5">
      <div className="max-w-7xl mx-auto px-4 mb-16">
        <div className="flex flex-col items-center">
            <span className="text-[10px] uppercase tracking-[0.4em] text-orange-500 font-bold mb-4 drop-shadow-sm">Trusted Partnership</span>
            <h2 className="text-4xl md:text-6xl font-black text-white text-center leading-tight tracking-tighter uppercase">
                OUR PRESTIGIOUS <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600">CLIENTS</span>
            </h2>
        </div>
      </div>

      <div className="flex flex-col gap-8 md:gap-12">
        {/* Row 1 - Original Direction */}
        <div className="relative w-full overflow-hidden flex items-center h-48 md:h-56">
            <div className="absolute inset-y-0 left-0 w-32 md:w-64 z-20 pointer-events-none bg-gradient-to-r from-[#0a0a0b] to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 md:w-64 z-20 pointer-events-none bg-gradient-to-l from-[#0a0a0b] to-transparent" />
            
            <div className="flex animate-marquee-row1 hover:pause whitespace-nowrap gap-16 md:gap-32 px-16 items-center">
            {scrollRow1.map((brand, idx) => (
                <div key={`row1-${brand.id}-${idx}`} className="flex flex-col items-center gap-4 group transition-all duration-300">
                {brand.logo_url ? (
                    <div className="relative w-32 h-16 md:w-44 md:h-24 flex-shrink-0">
                        <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        fill
                        className="object-contain opacity-100 transition-all duration-500 group-hover:scale-125 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        sizes="(max-width: 768px) 128px, 176px"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-16 md:w-44 md:h-24 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-orange-500/50 transition-colors">
                    <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest px-4 text-center">{brand.name}</span>
                    </div>
                )}
                <span className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest group-hover:text-orange-400 transition-colors duration-300">
                    {brand.name}
                </span>
                </div>
            ))}
            </div>
        </div>

        {/* Row 2 - Opposite/Slower Direction */}
        <div className="relative w-full overflow-hidden flex items-center h-48 md:h-56">
            <div className="absolute inset-y-0 left-0 w-32 md:w-64 z-20 pointer-events-none bg-gradient-to-r from-[#0a0a0b] to-transparent" />
            <div className="absolute inset-y-0 right-0 w-32 md:w-64 z-20 pointer-events-none bg-gradient-to-l from-[#0a0a0b] to-transparent" />
            
            <div className="flex animate-marquee-row2 hover:pause whitespace-nowrap gap-16 md:gap-32 px-16 items-center">
            {scrollRow2.map((brand, idx) => (
                <div key={`row2-${brand.id}-${idx}`} className="flex flex-col items-center gap-4 group transition-all duration-300">
                {brand.logo_url ? (
                    <div className="relative w-32 h-16 md:w-44 md:h-24 flex-shrink-0">
                        <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        fill
                        className="object-contain opacity-100 transition-all duration-500 group-hover:scale-125 filter drop-shadow-[0_0_8px_rgba(255,255,255,0.1)] group-hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)]"
                        sizes="(max-width: 768px) 128px, 176px"
                        />
                    </div>
                ) : (
                    <div className="w-32 h-16 md:w-44 md:h-24 flex items-center justify-center bg-white/5 rounded-xl border border-white/10 group-hover:border-orange-500/50 transition-colors">
                    <span className="text-xs font-bold text-gray-500 group-hover:text-white transition-colors uppercase tracking-widest px-4 text-center">{brand.name}</span>
                    </div>
                )}
                <span className="text-[10px] md:text-xs font-bold text-gray-600 uppercase tracking-widest group-hover:text-orange-400 transition-colors duration-300">
                    {brand.name}
                </span>
                </div>
            ))}
            </div>
        </div>
      </div>

      <style jsx>{`
        .animate-marquee-row1 {
          display: flex;
          width: fit-content;
          animation: marquee-scroll-r1 18s linear infinite;
          will-change: transform;
        }

        .animate-marquee-row2 {
          display: flex;
          width: fit-content;
          animation: marquee-scroll-r2 22s linear infinite;
          will-change: transform;
        }
        
        .hover\:pause:hover {
          animation-play-state: paused;
        }

        @keyframes marquee-scroll-r1 {
          0% { transform: translateX(0); }
          100% { transform: translateX(-33.333%); }
        }

        @keyframes marquee-scroll-r2 {
          0% { transform: translateX(-33.333%); }
          100% { transform: translateX(0); }
        }

        @media (max-width: 768px) {
          .animate-marquee-row1 { animation-duration: 12s; }
          .animate-marquee-row2 { animation-duration: 15s; }
        }
      `}</style>
    </section>
  );
}
