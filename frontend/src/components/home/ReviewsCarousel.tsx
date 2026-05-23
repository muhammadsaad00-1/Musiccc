'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface Review {
  id: string;
  user_name: string;
  rating: number;
  review: string;
}

const MOCK: Review[] = [
  { id: 'r1',  user_name: 'Zainab Ahmed',   rating: 5, review: 'The Artist Factory made finding a Qawwal for our wedding so easy. The team was professional from start to finish — the performance was absolutely magical.' },
  { id: 'r2',  user_name: 'Omar Farooq',    rating: 5, review: 'Booked a live band for our corporate annual dinner. Seamless coordination and a fantastic performance. I will never use another platform for artist bookings.' },
  { id: 'r3',  user_name: 'Sarah Khan',     rating: 5, review: 'The verified profiles gave me real confidence. The process was completely transparent and the artist delivered beyond every single expectation.' },
  { id: 'r4',  user_name: 'Bilal Hassan',   rating: 5, review: 'We needed a last-minute MC replacement and Artist Factory came through with a top professional within hours. Absolutely unmatched reliability.' },
  { id: 'r5',  user_name: 'Ayesha Malik',   rating: 5, review: 'The variety of artists is unmatched — from traditional folk singers to modern DJs. Our mehndi night was a complete and unforgettable hit.' },
  { id: 'r6',  user_name: 'Usman Qureshi',  rating: 5, review: 'Great platform for finding local talent. The booking process was straightforward and the artist arrived perfectly on time and well-prepared.' },
  { id: 'r7',  user_name: 'Mariam Yusuf',   rating: 5, review: "I've used this platform twice now — once for a birthday and once for a corporate launch. Consistent quality and excellent customer support every time." },
  { id: 'r8',  user_name: 'Rizwan Ahmed',   rating: 5, review: "The Verified Artist badge really matters. You know you're getting a genuine professional. Our event was a massive success because of the talent we found here." },
];

export default function ReviewsCarousel({ artistId, className }: { artistId?: string; className?: string }) {
  const [reviews, setReviews] = useState<Review[]>(MOCK);
  const [index, setIndex]     = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const url = artistId
          ? `${API_BASE_URL}/api/reviews?artist_id=${artistId}`
          : `${API_BASE_URL}/api/reviews?limit=20`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          if (data?.length > 0) {
            setReviews(prev => {
              const ids = new Set(prev.map(r => r.id));
              return [...prev, ...data.filter((r: Review) => !ids.has(r.id))];
            });
          }
        }
      } catch { /* use fallback */ }
    };
    load();
  }, [artistId]);

  const goTo = useCallback((next: number) => {
    setVisible(false);
    setTimeout(() => { setIndex(next); setVisible(true); }, 320);
  }, []);

  const prev = useCallback(() => goTo((index - 1 + reviews.length) % reviews.length), [index, reviews.length, goTo]);
  const next = useCallback(() => goTo((index + 1) % reviews.length), [index, reviews.length, goTo]);

  // Auto-advance
  useEffect(() => {
    if (paused || reviews.length < 2) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused, reviews.length]);

  const current = reviews[index];
  const initials = current.user_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase();

  return (
    <div
      className={`max-w-3xl mx-auto text-center px-4 ${className ?? ''}`}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Decorative quote mark */}
      <div
        aria-hidden
        className="text-[96px] leading-none font-serif text-orange-400/10 select-none -mb-6"
      >
        &ldquo;
      </div>

      {/* Animated content */}
      <div
        style={{
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(10px)',
          transition: 'opacity 0.32s ease, transform 0.32s ease',
        }}
      >
        {/* Stars */}
        <div className="flex justify-center gap-1 mb-7">
          {[1,2,3,4,5].map(s => (
            <Star key={s} className={`w-4 h-4 ${s <= current.rating ? 'fill-orange-400 text-orange-400' : 'fill-gray-700 text-gray-700'}`} />
          ))}
        </div>

        {/* Quote */}
        <p className="font-playfair italic text-gray-100 leading-relaxed mb-9 text-xl sm:text-2xl md:text-[1.65rem]">
          {current.review}
        </p>

        {/* Author */}
        <div className="flex items-center justify-center gap-3">
          <div className="w-10 h-10 rounded-full bg-[#1e1e22] border border-white/10 flex items-center justify-center text-white text-[12px] font-semibold flex-shrink-0">
            {initials}
          </div>
          <div className="text-left">
            <p className="text-white text-sm font-semibold leading-tight">{current.user_name}</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-[3px] mt-0.5">Verified Client</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {reviews.length > 1 && (
        <div className="flex items-center justify-center gap-5 mt-12">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5">
            {reviews.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Review ${i + 1}`}
                className={`rounded-full transition-all duration-300 ${
                  i === index
                    ? 'w-5 h-1.5 bg-orange-400'
                    : 'w-1.5 h-1.5 bg-gray-700 hover:bg-gray-500'
                }`}
              />
            ))}
          </div>

          <button
            onClick={next}
            aria-label="Next"
            className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}
