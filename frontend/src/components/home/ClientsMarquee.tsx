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
    name: 'HUM TV',
    logo: (
      <svg viewBox="0 0 80 40" className="w-20 h-10 fill-current">
        <text x="10" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '18px' }}>HUM TV</text>
      </svg>
    )
  },
  {
    name: 'ARY Digital',
    logo: (
      <svg viewBox="0 0 100 40" className="w-28 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '16px' }}>ARY DIGITAL</text>
      </svg>
    )
  },
  {
    name: 'Geo TV',
    logo: (
      <svg viewBox="0 0 80 40" className="w-20 h-10 fill-current">
        <text x="15" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '18px' }}>GEO</text>
      </svg>
    )
  },
  {
    name: 'Jazz',
    logo: (
      <svg viewBox="0 0 80 40" className="w-20 h-10 fill-current">
        <text x="20" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '18px' }}>JAZZ</text>
      </svg>
    )
  },
  {
    name: 'Telenor',
    logo: (
      <svg viewBox="0 0 100 40" className="w-24 h-10 fill-current">
        <text x="10" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '16px' }}>TELENOR</text>
      </svg>
    )
  },
  {
    name: 'Pepsi',
    logo: (
      <svg viewBox="0 0 80 40" className="w-20 h-10 fill-current">
        <text x="15" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '18px' }}>PEPSI</text>
      </svg>
    )
  },
  {
    name: 'Velo Sound Station',
    logo: (
      <svg viewBox="0 0 120 40" className="w-28 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '12px' }}>VELO SOUND STATION</text>
      </svg>
    )
  },
  {
    name: 'Strepsils Stereo',
    logo: (
      <svg viewBox="0 0 120 40" className="w-28 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '12px' }}>STREPSILS STEREO</text>
      </svg>
    )
  },
  {
    name: 'Cornetto Pop Rock',
    logo: (
      <svg viewBox="0 0 120 40" className="w-28 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '12px' }}>CORNETTO POP ROCK</text>
      </svg>
    )
  },
  {
    name: 'Bisconni Music',
    logo: (
      <svg viewBox="0 0 110 40" className="w-26 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '12px' }}>BISCONNI MUSIC</text>
      </svg>
    )
  },
  {
    name: 'Kashmir Beats',
    logo: (
      <svg viewBox="0 0 110 40" className="w-26 h-10 fill-current">
        <text x="5" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '12px' }}>KASHMIR BEATS</text>
      </svg>
    )
  },
  {
    name: 'Ufone',
    logo: (
      <svg viewBox="0 0 80 40" className="w-20 h-10 fill-current">
        <text x="15" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '18px' }}>UFONE</text>
      </svg>
    )
  },
  {
    name: 'Zong',
    logo: (
      <svg viewBox="0 0 80 40" className="w-20 h-10 fill-current">
        <text x="18" y="28" className="font-bold" style={{ fontFamily: 'system-ui', fontSize: '18px' }}>ZONG</text>
      </svg>
    )
  },
];

// Duplicate for seamless loop
const allBrands = [...brands, ...brands];

export default function ClientsMarquee() {
  return (
    <section className="py-20 bg-[#0a0a0b] overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center relative">
        <h2 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-500 to-orange-400 inline-block mb-3">
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

      {/* Marquee Container */}
      <div className="relative">
        {/* Gradient Masks */}
        <div className="absolute left-0 top-0 bottom-0 w-40 bg-gradient-to-r from-[#0a0a0b] to-transparent z-10" />
        <div className="absolute right-0 top-0 bottom-0 w-40 bg-gradient-to-l from-[#0a0a0b] to-transparent z-10" />

        {/* First Row - Left to Right */}
        <div className="flex animate-marquee mb-6">
          {allBrands.map((brand, index) => (
            <div
              key={`row1-${index}`}
              className="flex-shrink-0 mx-4 px-8 py-5 bg-[#141414] rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300 flex items-center justify-center group min-w-[160px]"
            >
              <div className="text-gray-500 group-hover:text-orange-400 transition-colors opacity-70 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-300">
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
              className="flex-shrink-0 mx-4 px-8 py-5 bg-[#141414] rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-all duration-300 flex items-center justify-center group min-w-[160px]"
            >
              <div className="text-gray-500 group-hover:text-pink-400 transition-colors opacity-70 group-hover:opacity-100 scale-90 group-hover:scale-100 duration-300">
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
          animation: marquee 60s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 60s linear infinite;
        }
      `}</style>
    </section>
  );
}
