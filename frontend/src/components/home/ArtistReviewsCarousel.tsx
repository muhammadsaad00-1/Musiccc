'use client';

import { useEffect, useState, useCallback } from 'react';
import { Star, Loader2, MessageSquare, ChevronLeft, ChevronRight, Quote, Mic2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import Image from 'next/image';

interface ArtistTestimonial {
    id: string | number;
    name: string;
    role: string;
    location: string;
    emoji: string;
    photo_url?: string | null;
    rating: number;
    review: string;
    event?: string; // New field for context
}

// Mock fallback data with specific event context
const mockArtistTestimonials: ArtistTestimonial[] = [
    { id: 'm1', name: 'Ali Zafar Qawwal', role: 'Qawwal & Sufi Artist', location: 'Lahore', emoji: '🎵', rating: 5, event: 'Corporate Annual Gala 2024', review: 'Artist Factory transformed my career. Within a month of joining I had three corporate event bookings. The platform makes it incredibly easy to showcase my work and connect with serious clients.' },
    { id: 'm2', name: 'Fatima Khan', role: 'Classical Dancer', location: 'Karachi', emoji: '💃', rating: 5, event: 'Cultural Heritage Festival', review: "Finally a platform that takes artists seriously. The team is professional, payments are secure, and the clients are genuine. I've performed at some of Pakistan's most prestigious events through TAF." },
    { id: 'm3', name: 'DJ Raza', role: 'Professional DJ', location: 'Islamabad', emoji: '🎧', rating: 5, event: 'New Year Eve Celebration', review: 'I joined Artist Factory two years ago and it has been a game changer. My booking calendar is always full. The support team helps with everything from negotiations to logistics.' },
    { id: 'm4', name: 'Nazia & the Band', role: 'Live Band', location: 'Faisalabad', emoji: '🎸', rating: 5, event: 'Grand Wedding Reception', review: "We've performed at 80+ weddings booked through Artist Factory. The clients are well-informed and appreciate live music. TAF is the best platform for serious performers in Pakistan." },
    { id: 'm5', name: 'Ustad Hamid Ali', role: 'Classical Vocalist', location: 'Multan', emoji: '🎼', rating: 5, event: 'Intimate Sufi Night', review: "As a classical artist, I was worried about the right audience. Artist Factory specifically caters to premium events and that's exactly where I belong. Highly recommend it to all artists." },
    { id: 'm6', name: 'Meher Naz', role: 'Folk Singer', location: 'Peshawar', emoji: '🪕', rating: 5, event: 'Regional Folk Music Fest', review: "The platform gave me exposure I never had before. Corporate clients, TV channels, and private events – Artist Factory opens all doors. It's a must for every Pakistani artist." },
];

export default function ArtistReviewsCarousel({ className }: { className?: string }) {
    const [reviews, setReviews] = useState<ArtistTestimonial[]>(mockArtistTestimonials);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchTestimonials = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/artist-testimonials`);
                if (res.ok) {
                    const data: ArtistTestimonial[] = await res.json();
                    if (Array.isArray(data) && data.length > 0) {
                        setReviews(prev => {
                            const existingIds = new Set(prev.map(t => t.id));
                            const newTestimonials = data.filter(t => !existingIds.has(t.id));
                            return [...prev, ...newTestimonials];
                        });
                    }
                }
            } catch {
                console.log('Could not load artist testimonials');
            } finally {
                setIsLoading(false);
            }
        };
        fetchTestimonials();
    }, []);

    // Auto-advance
    useEffect(() => {
        if (reviews.length === 0 || isPaused) return;
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 3000);
        return () => clearInterval(timer);
    }, [reviews.length, isPaused]);

    const goToPrevious = useCallback(() => {
        setCurrentIndex((prev) => (prev - 1 + reviews.length) % reviews.length);
    }, [reviews.length]);

    const goToNext = useCallback(() => {
        setCurrentIndex((prev) => (prev + 1) % reviews.length);
    }, [reviews.length]);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-6 h-6 ${star <= rating ? 'fill-orange-400 text-orange-400' : 'text-gray-600'}`}
                    />
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-400">Loading artist stories...</span>
            </div>
        );
    }

    if (reviews.length === 0) return null;

    const currentReview = reviews[currentIndex];

    return (
        <div
            className={`relative max-w-4xl mx-auto ${className}`}
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Main Review Card */}
            <div className="relative bg-[#0f0f10] rounded-3xl p-10 md:p-14 border border-gray-800 hover:border-orange-500/30 text-center transition-all duration-500 group shadow-2xl">
                {/* Elegant glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-gradient-to-b from-orange-500/10 to-transparent blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Quote Icon */}
                <div className="mb-6">
                    <Quote className="w-12 h-12 text-orange-500/40 mx-auto" />
                </div>

                {/* Event Context Tag - Minimalist */}
                {currentReview.event && (
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-[10px] font-bold tracking-widest text-orange-400 uppercase mb-8">
                        <span>Managed Event</span>
                        <span className="w-1 h-1 rounded-full bg-orange-500/50" />
                        <span className="text-gray-300">{currentReview.event}</span>
                    </div>
                )}

                {/* Review Text */}
                <p className="relative text-xl md:text-3xl font-serif italic text-gray-200 leading-relaxed mb-10 max-w-4xl mx-auto">
                    "{currentReview.review}"
                </p>

                {/* Stars (Moved below text for editorial feel) */}
                <div className="mb-8 opacity-80">
                    {renderStars(currentReview.rating)}
                </div>

                {/* Artist Info */}
                <div className="relative flex flex-col items-center justify-center gap-3 border-t border-gray-800/50 pt-8 max-w-xs mx-auto">
                    {currentReview.photo_url ? (
                        <Image
                            src={currentReview.photo_url}
                            alt={currentReview.name}
                            width={56}
                            height={56}
                            className="w-14 h-14 rounded-full object-cover ring-2 ring-gray-800 grayscale group-hover:grayscale-0 transition-all duration-500"
                        />
                    ) : (
                        <div className="w-14 h-14 bg-gray-900 rounded-full flex items-center justify-center text-white text-2xl border border-gray-800">
                            {currentReview.emoji || '🎵'}
                        </div>
                    )}

                    <div>
                        <p className="text-white font-medium text-lg tracking-wide">{currentReview.name}</p>
                        <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">{currentReview.role} • {currentReview.location}</p>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {reviews.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-[#1a1a1a] border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 shadow-lg"
                        aria-label="Previous story"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-[#1a1a1a] border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 shadow-lg"
                        aria-label="Next story"
                    >
                        <ChevronRight className="w-6 h-6" />
                    </button>
                </>
            )}

            {/* Progress Dots */}
            {reviews.length > 1 && (
                <div className="flex justify-center gap-2 mt-8">
                    {reviews.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'bg-gradient-to-r from-orange-500 to-pink-600 w-8'
                                : 'bg-gray-600 hover:bg-gray-500 w-2'
                                }`}
                            aria-label={`Go to story ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
