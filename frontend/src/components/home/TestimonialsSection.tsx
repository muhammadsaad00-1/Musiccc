'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { Star, Quote, Users, Mic2 } from 'lucide-react';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
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
}

// Mock fallback data — shown while API loads or has no entries yet
const mockArtistTestimonials: ArtistTestimonial[] = [
    { id: 'm1', name: 'Ali Zafar Qawwal',    role: 'Qawwal & Sufi Artist',          location: 'Lahore',     emoji: '🎵', photo_url: null, rating: 5, review: 'Artist Factory transformed my career. Within a month of joining I had three corporate event bookings. The platform makes it incredibly easy to showcase my work and connect with serious clients.' },
    { id: 'm2', name: 'Fatima Khan',           role: 'Classical Dancer',               location: 'Karachi',    emoji: '💃', photo_url: null, rating: 5, review: "Finally a platform that takes artists seriously. The team is professional, payments are secure, and the clients are genuine. I've performed at some of Pakistan's most prestigious events through TAF." },
    { id: 'm3', name: 'DJ Raza',               role: 'Professional DJ',                location: 'Islamabad',  emoji: '🎧', photo_url: null, rating: 5, review: 'I joined Artist Factory two years ago and it has been a game changer. My booking calendar is always full. The support team helps with everything from negotiations to logistics.' },
    { id: 'm4', name: 'Nazia & the Band',      role: 'Live Band – Wedding Specialists', location: 'Faisalabad', emoji: '🎸', photo_url: null, rating: 5, review: "We've performed at 80+ weddings booked through Artist Factory. The clients are well-informed and appreciate live music. TAF is the best platform for serious performers in Pakistan." },
    { id: 'm5', name: 'Ustad Hamid Ali',       role: 'Classical Vocalist',             location: 'Multan',     emoji: '🎼', photo_url: null, rating: 5, review: "As a classical artist, I was worried about the right audience. Artist Factory specifically caters to premium events and that's exactly where I belong. Highly recommend it to all artists." },
    { id: 'm6', name: 'Meher Naz',             role: 'Folk Singer',                    location: 'Peshawar',   emoji: '🪕', photo_url: null, rating: 5, review: "The platform gave me exposure I never had before. Corporate clients, TV channels, and private events – Artist Factory opens all doors. It's a must for every Pakistani artist." },
];

function ArtistTestimonialsGrid() {
    const [testimonials, setTestimonials] = useState<ArtistTestimonial[]>(mockArtistTestimonials);
    const [expanded, setExpanded] = useState<string | number | null>(null);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/artist-testimonials`);
                if (res.ok) {
                    const data: ArtistTestimonial[] = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setTestimonials(data);
                    }
                }
            } catch {
                // Keep mock data on error
            }
        };
        fetchTestimonials();
    }, []);

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {testimonials.map((t) => {
                const isExpanded = expanded === t.id;
                const longText = t.review.length > 130;
                return (
                    <div
                        key={t.id}
                        className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-6 flex flex-col gap-4 hover:border-orange-500/30 transition-all duration-300 group"
                    >
                        {/* Quote icon */}
                        <Quote className="w-7 h-7 text-orange-500/30 absolute top-5 right-5 group-hover:text-orange-500/50 transition-colors" />

                        {/* Stars */}
                        <div className="flex gap-1">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star
                                    key={s}
                                    className={`w-4 h-4 ${s <= t.rating ? 'fill-orange-400 text-orange-400' : 'text-gray-700'}`}
                                />
                            ))}
                        </div>

                        {/* Review text */}
                        <p className="text-gray-400 text-sm leading-relaxed">
                            {longText && !isExpanded ? `${t.review.slice(0, 130)}...` : t.review}
                            {longText && (
                                <button
                                    onClick={() => setExpanded(isExpanded ? null : t.id)}
                                    className="ml-1 text-orange-400 hover:text-orange-300 text-xs font-medium"
                                >
                                    {isExpanded ? 'less' : 'more'}
                                </button>
                            )}
                        </p>

                        {/* Author */}
                        <div className="flex items-center gap-3 mt-auto pt-4 border-t border-gray-800/60">
                            {t.photo_url ? (
                                <Image
                                    src={t.photo_url}
                                    alt={t.name}
                                    width={40}
                                    height={40}
                                    className="w-10 h-10 rounded-full object-cover ring-2 ring-orange-500/20"
                                />
                            ) : (
                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center text-lg flex-shrink-0">
                                    {t.emoji || '🎵'}
                                </div>
                            )}
                            <div>
                                <p className="text-white font-semibold text-sm">{t.name}</p>
                                <p className="text-gray-500 text-xs">{t.role} · {t.location}</p>
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

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
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'clients'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/20'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Users className="w-4 h-4" />
                            Client Reviews
                        </button>
                        <button
                            onClick={() => setActiveTab('artists')}
                            className={`flex items-center gap-2 px-6 py-2.5 rounded-lg text-sm font-semibold transition-all duration-300 ${
                                activeTab === 'artists'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-lg shadow-orange-500/20'
                                    : 'text-gray-400 hover:text-white'
                            }`}
                        >
                            <Mic2 className="w-4 h-4" />
                            Artist Testimonials
                        </button>
                    </div>
                </div>

                {/* Tab content */}
                {activeTab === 'clients' ? <ReviewsCarousel /> : <ArtistTestimonialsGrid />}
            </div>
        </section>
    );
}
