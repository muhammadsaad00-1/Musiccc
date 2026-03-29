'use client';

import { useState } from 'react';
import { Users, Mic2 } from 'lucide-react';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import ArtistReviewsCarousel from '@/components/home/ArtistReviewsCarousel';

interface TestimonialsSectionProps {
    bgClass?: string;
}

export default function TestimonialsSection({ bgClass = 'bg-[#0a0a0b]' }: TestimonialsSectionProps) {
    const [activeTab, setActiveTab] = useState<'clients' | 'artists'>('clients');

    return (
        <section className={`py-20 lg:py-32 ${bgClass} relative overflow-hidden`}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-pink-600/5 rounded-full blur-[140px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30 tracking-wide">
                        ⭐ Testimonials
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        What People Say
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Hear from both the artists who perform and the clients who book through Artist Factory.
                    </p>
                </div>

                {/* Tabs */}
                <div className="flex justify-center mb-12">
                    <div className="flex gap-2 p-1.5 bg-[#1a1a1a] rounded-xl border border-gray-800">
                        <button
                            onClick={() => setActiveTab('clients')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'clients'
                                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/20'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Users className="w-4 h-4" />
                            Client Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab('artists')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${activeTab === 'artists'
                                ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/20'
                                : 'text-gray-400 hover:text-white'
                                }`}
                        >
                            <Mic2 className="w-4 h-4" />
                            Artist Experience
                        </button>
                    </div>
                </div>

                {/* Tab content */}
                {activeTab === 'clients' ? <ReviewsCarousel /> : <ArtistReviewsCarousel />}

         
            </div>
        </section>
    );
}
