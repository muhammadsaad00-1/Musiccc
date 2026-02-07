'use client';

// Simple SVG logos for event/music industry companies
const brands = [
  {
    name: 'Coke Studio',
    logo: (
      <svg viewBox="0 0 120 40" className="w-28 h-10 fill-current">
        <text x="10" y="28" className="font-bold text-lg" style={{ fontFamily: 'system-ui' }}>COKE STUDIO</text>
      </svg>
    )
  },
  {
    name: 'Nescafe Basement',
    logo: (
      <svg viewBox="0 0 120 40" className="w-28 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '14px' }}>NESCAFÉ BASEMENT</text>
      </svg>
    )
  },
  {
    name: 'Patari',
    logo: (
      <svg viewBox="0 0 80 40" className="w-24 h-10 fill-current">
        <circle cx="20" cy="20" r="12" fill="currentColor" opacity="0.3" />
        <text x="18" y="26" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '16px' }}>PATARI</text>
      </svg>
    )
  },
  {
    name: 'Pepsi Battle of Bands',
    logo: (
      <svg viewBox="0 0 100 40" className="w-28 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '13px' }}>PEPSI BOB</text>
      </svg>
    )
  },
  {
    name: 'LSA',
    logo: (
      <svg viewBox="0 0 80 40" className="w-20 h-10 fill-current">
        <text x="10" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '18px' }}>LSA</text>
      </svg>
    )
  },
  {
    name: 'Hum Awards',
    logo: (
      <svg viewBox="0 0 100 40" className="w-28 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '14px' }}>HUM AWARDS</text>
      </svg>
    )
  },
  {
    name: 'Taazi',
    logo: (
      <svg viewBox="0 0 80 40" className="w-20 h-10 fill-current">
        <text x="10" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '18px' }}>TAAZI</text>
      </svg>
    )
  },
  {
    name: 'Y Studios',
    logo: (
      <svg viewBox="0 0 90 40" className="w-24 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '14px' }}>Y STUDIOS</text>
      </svg>
    )
  },
  {
    name: 'EMI Pakistan',
    logo: (
      <svg viewBox="0 0 100 40" className="w-28 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '14px' }}>EMI PAKISTAN</text>
      </svg>
    )
  },
  {
    name: 'Spotify Pakistan',
    logo: (
      <svg viewBox="0 0 80 40" className="w-24 h-10 fill-current">
        <circle cx="18" cy="20" r="14" fill="currentColor" opacity="0.2" />
        <path d="M12 16c5-1 10 0 14 2M11 20c5 0 11 1 15 3M12 24c4 0 9 1 13 2" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
        <text x="36" y="26" style={{ fontFamily: 'system-ui', fontSize: '11px' }}>SPOTIFY</text>
      </svg>
    )
  },
];

// Duplicate for seamless loop
const allBrands = [...brands, ...brands];

export default function ClientsMarquee() {
  return (
    <section className="py-16 bg-[#0f0f10] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-10">
        <h2 className="text-center text-lg text-gray-500 uppercase tracking-widest">
          Featured On & Partnered With
        </h2>
      </div>

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0f0f10] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0f0f10] to-transparent z-10" />

        {/* First Row - Left to Right */}
        <div className="flex animate-marquee mb-6">
          {allBrands.map((brand, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 mx-4 px-8 py-5 bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300 flex items-center justify-center group"
            >
              <div className="text-gray-500 group-hover:text-orange-400 transition-colors">
                {brand.logo}
              </div>
            </div>
          ))}
        </div>

        {/* Second Row - Right to Left */}
        <div className="flex animate-marquee-reverse">
          {[...allBrands].reverse().map((brand, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 mx-4 px-8 py-5 bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-all duration-300 flex items-center justify-center group"
            >
              <div className="text-gray-500 group-hover:text-pink-400 transition-colors">
                {brand.logo}
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        @keyframes marquee-reverse {
          0% {
            transform: translateX(-50%);
          }
          100% {
            transform: translateX(0);
          }
        }
        .animate-marquee {
          animation: marquee 45s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 45s linear infinite;
        }
      `}</style>
    </section>
  );
}
