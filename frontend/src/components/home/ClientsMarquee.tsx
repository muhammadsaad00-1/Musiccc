'use client';

// Brand logos as simple SVG icons
const brands = [
  {
    name: 'Google', icon: (
      <svg viewBox="0 0 24 24" className="w-24 h-8 fill-current">
        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
      </svg>
    )
  },
  {
    name: 'Microsoft', icon: (
      <svg viewBox="0 0 24 24" className="w-24 h-8 fill-current">
        <path d="M0 0h11.377v11.377H0zm12.623 0H24v11.377H12.623zM0 12.623h11.377V24H0zm12.623 0H24V24H12.623z" />
      </svg>
    )
  },
  {
    name: 'Amazon', icon: (
      <svg viewBox="0 0 24 24" className="w-24 h-8 fill-current">
        <path d="M.045 18.02c.072-.116.187-.124.348-.022 3.636 2.11 7.594 3.166 11.87 3.166 2.852 0 5.668-.533 8.447-1.595l.315-.14c.138-.06.234-.1.293-.13.226-.088.39-.046.493.13.116.196.088.39-.084.58-.988.946-2.09 1.712-3.312 2.296-1.222.584-2.5 1.03-3.832 1.343-1.332.312-2.7.468-4.102.468-1.62 0-3.2-.196-4.742-.587-1.54-.392-3.007-.952-4.4-1.685-.166-.088-.253-.186-.262-.293a.382.382 0 01.1-.27c.056-.06.138-.108.247-.144zm5.93-2.818c-.116-.198-.043-.422.22-.52.262-.098.536-.044.82.16 2.186 1.27 4.6 1.906 7.24 1.906 1.53 0 3.21-.186 5.04-.56.23-.048.38.01.454.174.073.164.014.36-.176.584-.19.228-.463.42-.812.58-1.79.82-3.62 1.23-5.488 1.23-2.69 0-5.118-.647-7.284-1.94-.294-.176-.372-.39-.234-.642zm10.5-2.368c.186-.072.4-.064.644.024.244.088.394.198.45.33.028.067.03.124.01.174-.022.05-.068.1-.14.15-.294.2-.634.297-1.02.297-.39 0-.61-.15-.66-.45-.05-.303.1-.48.45-.525h.268z" />
      </svg>
    )
  },
  {
    name: 'Meta', icon: (
      <svg viewBox="0 0 24 24" className="w-24 h-8 fill-current">
        <path d="M12 2.04c-5.5 0-10 4.49-10 10.02 0 5 3.66 9.15 8.44 9.9v-7H7.9v-2.9h2.54V9.85c0-2.51 1.49-3.89 3.78-3.89 1.09 0 2.23.19 2.23.19v2.47h-1.26c-1.24 0-1.63.77-1.63 1.56v1.88h2.78l-.45 2.9h-2.33v7a10 10 0 008.44-9.9c0-5.53-4.5-10.02-10-10.02z" />
      </svg>
    )
  },
  {
    name: 'Netflix', icon: (
      <svg viewBox="0 0 24 24" className="w-24 h-8 fill-current">
        <path d="M5.398 0v.006c3.028 8.556 5.37 15.175 8.348 23.596 2.344.058 4.85.398 4.854.398-2.8-7.924-5.923-16.747-8.487-24zm8.489 0v9.63L18.6 22.951c-.043-7.86-.004-15.913.002-22.95zM5.398 1.05V24c1.873-.225 2.81-.313 4.715-.398v-9.22z" />
      </svg>
    )
  },
  {
    name: 'Spotify', icon: (
      <svg viewBox="0 0 24 24" className="w-24 h-8 fill-current">
        <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z" />
      </svg>
    )
  },
  {
    name: 'Nike', icon: (
      <svg viewBox="0 0 24 24" className="w-24 h-8 fill-current">
        <path d="M24 7.8L6.442 15.276c-1.456.616-2.679.925-3.668.925-1.12 0-1.933-.392-2.437-1.177-.317-.494-.474-1.09-.474-1.788 0-.9.263-1.87.788-2.912.525-1.04 1.26-1.988 2.204-2.843.945-.856 2.01-1.543 3.2-2.064 1.188-.52 2.41-.78 3.668-.78.69 0 1.32.087 1.888.262.568.175.998.39 1.288.645.29.256.512.538.666.848.155.31.232.618.232.922 0 .506-.156.982-.468 1.428-.312.447-.722.82-1.23 1.12-.51.299-1.065.522-1.668.668-.604.146-1.2.22-1.788.22-.336 0-.694-.038-1.072-.112-.378-.075-.73-.193-1.056-.354l-.096.384L24 7.8z" />
      </svg>
    )
  },
  {
    name: 'Samsung', icon: (
      <svg viewBox="0 0 24 24" className="w-24 h-8 fill-current">
        <path d="M5.729 6.47v.003c-.317.005-.63.046-.926.138-.66.205-1.098.617-1.17 1.263-.048.428.047.863.29 1.2.304.42.78.7 1.343.87.38.12.783.18 1.22.23l.46.05c.28.03.54.07.758.15.14.05.26.12.32.23a.45.45 0 01.04.26c-.02.22-.19.4-.45.52-.32.15-.7.19-1.12.16-.42-.02-.81-.14-1.13-.35-.26-.17-.44-.4-.5-.67l-.02-.08h-1.1v.07c.02.38.13.72.37 1.03.27.36.67.64 1.15.83.6.24 1.29.32 2.01.27.65-.04 1.22-.2 1.68-.48.53-.33.87-.85.9-1.48.02-.36-.07-.7-.28-1-.27-.38-.7-.64-1.17-.8-.41-.14-.87-.22-1.35-.27l-.35-.04c-.33-.03-.65-.08-.93-.17-.18-.06-.33-.14-.42-.25a.4.4 0 01-.06-.24c.01-.16.1-.3.27-.41.22-.15.54-.22.88-.22.46 0 .87.1 1.2.32.2.14.36.33.42.55l.02.08h1.1v-.07c-.02-.36-.15-.68-.4-.95-.29-.32-.7-.55-1.17-.7-.53-.17-1.12-.23-1.73-.22zm3.34.09v4.87h1.1v-1.67h1.5v-.95h-1.5V7.5h1.67v-.93zm3.32 0l1.55 4.87h1.14l1.55-4.87h-1.14l-.97 3.44-.96-3.44zm4.43 0v4.87h1.1v-1.67h1.5v-.95h-1.5V7.5h1.66v-.93zm3.89 0l-1.53 4.87h1.13l.27-.95h1.53l.27.95h1.13l-1.54-4.87zm.77.88l.54 2.03h-1.07z" />
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
          Trusted by Leading Brands
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
              className="flex-shrink-0 mx-6 px-10 py-6 bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl border border-gray-800 hover:border-orange-500/50 transition-all duration-300 flex items-center justify-center group"
            >
              <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
                {brand.icon}
              </div>
            </div>
          ))}
        </div>

        {/* Second Row - Right to Left */}
        <div className="flex animate-marquee-reverse">
          {[...allBrands].reverse().map((brand, index) => (
            <div
              key={`row2-${index}`}
              className="flex-shrink-0 mx-6 px-10 py-6 bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-2xl border border-gray-800 hover:border-pink-500/50 transition-all duration-300 flex items-center justify-center group"
            >
              <div className="text-gray-500 group-hover:text-gray-300 transition-colors">
                {brand.icon}
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
          animation: marquee 40s linear infinite;
        }
        .animate-marquee-reverse {
          animation: marquee-reverse 40s linear infinite;
        }
      `}</style>
    </section>
  );
}
