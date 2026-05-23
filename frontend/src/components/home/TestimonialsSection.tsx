'use client';

import { useState } from 'react';
import { Users, Mic2, Star } from 'lucide-react';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import ArtistReviewsCarousel from '@/components/home/ArtistReviewsCarousel';

interface TestimonialsSectionProps {
  bgClass?: string;
}

export default function TestimonialsSection({ bgClass = 'bg-[#0a0a0b]' }: TestimonialsSectionProps) {
  const [activeTab, setActiveTab] = useState<'clients' | 'artists'>('clients');

  return (
    <section className={`py-20 lg:py-28 ${bgClass} relative overflow-hidden`}>
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {/* Left — orange bloom */}
        <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-orange-500/20 rounded-full blur-[120px]" />
        {/* Right — pink/purple bloom */}
        <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[480px] h-[480px] bg-pink-600/15 rounded-full blur-[120px]" />
        {/* Top-left accent */}
        <div className="absolute -top-20 left-1/4 w-[300px] h-[300px] bg-orange-600/10 rounded-full blur-[100px]" />
        {/* Bottom-right accent */}
        <div className="absolute -bottom-20 right-1/4 w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Header */}
        <div className="text-center mb-14">
          <div className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[4px] uppercase text-orange-400 mb-5">
            <span className="w-8 h-[1px] bg-orange-500/50" />
            Testimonials
            <span className="w-8 h-[1px] bg-orange-500/50" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
            What People{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
              Are Saying
            </span>
          </h2>
          <p className="text-gray-500 text-base max-w-xl mx-auto leading-relaxed mb-6">
            Real words from the clients who book and the artists who perform through Artist Factory.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/[0.06] rounded-full">
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-3 h-3 fill-orange-400 text-orange-400" />
              ))}
            </div>
            <span className="text-white text-xs font-semibold">5.0</span>
            <span className="text-gray-700 text-xs">·</span>
            <span className="text-gray-500 text-xs">500+ verified reviews</span>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-12">
          <div className="flex gap-1 p-1 bg-[#141416] rounded-xl border border-white/[0.06]">
            <button
              onClick={() => setActiveTab('clients')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'clients'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Client Reviews
            </button>
            <button
              onClick={() => setActiveTab('artists')}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${
                activeTab === 'artists'
                  ? 'bg-white/[0.08] text-white'
                  : 'text-gray-500 hover:text-gray-300'
              }`}
            >
              <Mic2 className="w-3.5 h-3.5" />
              Artist Experience
            </button>
          </div>
        </div>

        {activeTab === 'clients' ? <ReviewsCarousel /> : <ArtistReviewsCarousel />}

      </div>
    </section>
  );
}
