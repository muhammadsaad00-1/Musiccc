'use client';

import { useEffect, useState, useCallback, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight } from 'lucide-react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api';

interface ArtistTestimonial {
  id: string | number;
  name: string;
  role: string;
  location: string;
  emoji: string;
  photo_url?: string | null;
  rating: number;
  review: string;
  event?: string;
}

const MOCK: ArtistTestimonial[] = [
  { id: 'm1', name: 'Ali Zafar Qawwal',  role: 'Qawwal & Sufi Artist', location: 'Lahore',     emoji: '🎵', rating: 5, event: 'Corporate Annual Gala',    review: 'Artist Factory transformed my career. Within a month of joining I had three corporate bookings. The platform makes it incredibly easy to connect with serious clients who value real artistry.' },
  { id: 'm2', name: 'Fatima Khan',       role: 'Classical Dancer',     location: 'Karachi',    emoji: '💃', rating: 5, event: 'Cultural Heritage Festival', review: "Finally a platform that takes artists seriously. Payments are secure, clients are genuine. I've performed at some of Pakistan's most prestigious events through Artist Factory." },
  { id: 'm3', name: 'DJ Raza',           role: 'Professional DJ',      location: 'Islamabad',  emoji: '🎧', rating: 5, event: 'New Year Eve Celebration',   review: 'I joined Artist Factory two years ago and it has been an absolute game changer. My booking calendar is always full and the support team handles everything from negotiations to logistics.' },
  { id: 'm4', name: 'Nazia & the Band',  role: 'Live Band',            location: 'Faisalabad', emoji: '🎸', rating: 5, event: 'Grand Wedding Reception',    review: "We've performed at over 80 weddings booked through Artist Factory. The clients are well-informed and truly appreciate live music. TAF is the best platform for serious performers in Pakistan." },
  { id: 'm5', name: 'Ustad Hamid Ali',   role: 'Classical Vocalist',   location: 'Multan',     emoji: '🎼', rating: 5, event: 'Intimate Sufi Night',        review: "As a classical artist I needed the right audience. Artist Factory caters exclusively to premium events — and that's exactly where I belong. I highly recommend it to every serious artist." },
  { id: 'm6', name: 'Meher Naz',         role: 'Folk Singer',          location: 'Peshawar',   emoji: '🪕', rating: 5, event: 'Regional Folk Music Fest',   review: "The platform gave me exposure I never had before. Corporate clients, TV channels, private events — Artist Factory opens every door. It is an absolute must for every Pakistani artist." },
];

export default function ArtistReviewsCarousel({ className }: { className?: string }) {
  const [items, setItems]     = useState<ArtistTestimonial[]>(MOCK);
  const [index, setIndex]     = useState(0);
  const [visible, setVisible] = useState(true);
  const [paused, setPaused]   = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/artist-testimonials`);
        if (res.ok) {
          const data: ArtistTestimonial[] = await res.json();
          if (Array.isArray(data) && data.length > 0) {
            setItems(prev => {
              const ids = new Set(prev.map(t => t.id));
              return [...prev, ...data.filter(t => !ids.has(t.id))];
            });
          }
        }
      } catch { /* use fallback */ }
    };
    load();
  }, []);

  const goTo = useCallback((next: number) => {
    setVisible(false);
    setTimeout(() => { setIndex(next); setVisible(true); }, 320);
  }, []);

  const prev = useCallback(() => goTo((index - 1 + items.length) % items.length), [index, items.length, goTo]);
  const next = useCallback(() => goTo((index + 1) % items.length), [index, items.length, goTo]);

  useEffect(() => {
    if (paused || items.length < 2) return;
    timerRef.current = setInterval(next, 5000);
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [next, paused, items.length]);

  const current = items[index];

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

        {/* Event tag */}
        {current.event && (
          <p className="text-[10px] uppercase tracking-[3px] text-orange-400/60 font-semibold mb-5">
            {current.event}
          </p>
        )}

        {/* Quote */}
        <p className="font-playfair italic text-gray-100 leading-relaxed mb-9 text-xl sm:text-2xl md:text-[1.65rem]">
          {current.review}
        </p>

        {/* Author */}
        <div className="flex items-center justify-center gap-3">
          {current.photo_url ? (
            <Image
              src={current.photo_url}
              alt={current.name}
              width={40}
              height={40}
              className="w-10 h-10 rounded-full object-cover border border-white/10 flex-shrink-0"
            />
          ) : (
            <div className="w-10 h-10 rounded-full bg-[#1e1e22] border border-white/10 flex items-center justify-center text-lg flex-shrink-0">
              {current.emoji}
            </div>
          )}
          <div className="text-left">
            <p className="text-white text-sm font-semibold leading-tight">{current.name}</p>
            <p className="text-gray-600 text-[10px] uppercase tracking-[3px] mt-0.5">
              {current.role} · {current.location}
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      {items.length > 1 && (
        <div className="flex items-center justify-center gap-5 mt-12">
          <button
            onClick={prev}
            aria-label="Previous"
            className="w-9 h-9 rounded-full border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.08] hover:border-white/20 text-gray-400 hover:text-white flex items-center justify-center transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>

          <div className="flex gap-1.5">
            {items.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Testimonial ${i + 1}`}
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
