'use client';

import { useEffect, useState, useCallback } from 'react';
import { Star, Loader2, MessageSquare, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface Review {
    id: string;
    user_name: string;
    rating: number;
    review: string;
    created_at?: string;
}

// Mock data for initial display
const mockReviews: Review[] = [
    { id: 'mr1', user_name: 'Zainab Ahmed', rating: 5, review: 'The Artist Factory made finding a Qawwal for our wedding so easy. The team was professional and the performance was magical!' },
    { id: 'mr2', user_name: 'Omar Farooq', rating: 5, review: 'Booked a live band for our corporate annual dinner. Seamless coordination and a fantastic performance. Highly recommended.' },
    { id: 'mr3', user_name: 'Sarah Khan', rating: 5, review: 'I was worried about booking an artist online, but TAF verified profiles gave me confidence. The process was transparent and secure.' },
    { id: 'mr4', user_name: 'Bilal Hassan', rating: 5, review: 'Absolutely stellar service! We needed a last-minute replacement for our event host, and TAF came through with a professional MC within hours.' },
    { id: 'mr5', user_name: 'Ayesha Malik', rating: 5, review: 'The variety of artists available is unmatched. From traditional folk singers to modern DJs, they have it all. Our mehndi night was a hit!' },
    { id: 'mr6', user_name: 'Usman Qureshi', rating: 4, review: 'Great platform for finding local talent. The booking process was straightforward, and the artist arrived on time and well-prepared.' },
    { id: 'mr7', user_name: 'Hina Riaz', rating: 5, review: 'We hired a photographer through Artist Factory for a family reunion. The photos turned out beautiful, capturing every precious moment perfectly.' },
    { id: 'mr8', user_name: 'Saad Ali', rating: 5, review: 'Top-notch professionalism. The team at Artist Factory understood our specific requirements for a brand activation event and delivered exactly what we needed.' },
    { id: 'mr9', user_name: 'Mariam Yusuf', rating: 5, review: 'I’ve used this platform twice now, once for a birthday and once for a corporate launch. Consistent quality and excellent customer support every time.' },
    { id: 'mr10', user_name: 'Fahad Mustafa', rating: 5, review: 'Found an amazing Sufi group for our private gathering. The soulful performance left everyone mesmerizing. Thank you, TAF!' },
    { id: 'mr11', user_name: 'Nida Karim', rating: 4, review: 'Very user-friendly website. It was easy to compare different artists and read reviews before making a decision. Will definitely use again.' },
    { id: 'mr12', user_name: 'Rizwan Ahmed', rating: 5, review: 'The "Verified Artist" badge really helps. You know you are getting a genuine professional. Our event was a huge success thanks to the talented band we found here.' }
];

export default function ReviewsCarousel({ artistId, className }: { artistId?: string; className?: string }) {
    const [reviews, setReviews] = useState<Review[]>(mockReviews);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const url = artistId
                    ? `${API_BASE_URL}/api/reviews?artist_id=${artistId}`
                    : `${API_BASE_URL}/api/reviews?limit=20`;

                const response = await fetch(url);
                if (response.ok) {
                    const backendReviews = await response.json();
                    if (backendReviews && backendReviews.length > 0) {
                        // Merge mock and backend reviews
                        setReviews((prev) => {
                            // Avoid duplicates if any
                            const existingIds = new Set(prev.map(r => r.id));
                            const newReviews = backendReviews.filter((r: Review) => !existingIds.has(r.id));
                            return [...prev, ...newReviews];
                        });
                    }
                }
            } catch (error) {
                console.log('Could not load reviews');
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, [artistId]);

    // Auto-advance every 5 seconds
    useEffect(() => {
        if (reviews.length === 0 || isPaused) return;

        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % reviews.length);
        }, 2000); // 2 seconds per user request

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
                        className={`w-6 h-6 ${star <= rating
                            ? 'fill-orange-400 text-orange-400'
                            : 'text-gray-600'
                            }`}
                    />
                ))}
            </div>
        );
    };

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
                <span className="ml-2 text-gray-400">Loading reviews...</span>
            </div>
        );
    }

    if (reviews.length === 0) {
        return (
            <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-gray-800">
                <MessageSquare className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
                <p className="text-gray-400">Be the first to share your experience!</p>
            </div>
        );
    }

    const currentReview = reviews[currentIndex];

    return (
        <div
            className="relative max-w-4xl mx-auto"
            onMouseEnter={() => setIsPaused(true)}
            onMouseLeave={() => setIsPaused(false)}
        >
            {/* Main Review Card */}
            <div className="relative bg-[#0f0f10] rounded-3xl p-6 sm:p-10 md:p-14 border border-gray-800 hover:border-orange-500/30 text-center transition-all duration-500 group shadow-2xl">
                {/* Elegant glow */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-1/2 bg-gradient-to-b from-orange-500/10 to-transparent blur-3xl opacity-50 group-hover:opacity-80 transition-opacity duration-500" />

                {/* Quote Icon */}
                <div className="mb-5 md:mb-8">
                    <Quote className="w-8 h-8 md:w-12 md:h-12 text-orange-500/40 mx-auto" />
                </div>

                {/* Stars */}
                <div className="relative mb-5 md:mb-8">
                    {renderStars(currentReview.rating)}
                </div>

                {/* Review Text */}
                <p className="relative text-base sm:text-xl md:text-3xl font-serif italic text-gray-200 leading-relaxed mb-6 md:mb-10 max-w-4xl mx-auto">
                    "{currentReview.review}"
                </p>

                {/* User Info */}
                <div className="relative flex flex-col items-center justify-center gap-3 border-t border-gray-800/50 pt-8 max-w-xs mx-auto">
                    <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full flex items-center justify-center text-white text-lg font-bold border border-gray-700 shadow-inner">
                        {currentReview.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                        <p className="text-white font-medium text-lg tracking-wide">{currentReview.user_name}</p>
                        <p className="text-orange-400/80 text-xs uppercase tracking-widest font-semibold mt-1">Verified Client</p>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows — hidden on mobile, shown from sm+ */}
            {reviews.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="hidden sm:flex absolute left-0 top-1/2 -translate-y-1/2 -translate-x-5 md:-translate-x-6 w-11 h-11 bg-[#1a1a1a] border border-gray-700 rounded-full items-center justify-center text-gray-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 shadow-lg"
                        aria-label="Previous review"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="hidden sm:flex absolute right-0 top-1/2 -translate-y-1/2 translate-x-5 md:translate-x-6 w-11 h-11 bg-[#1a1a1a] border border-gray-700 rounded-full items-center justify-center text-gray-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 shadow-lg"
                        aria-label="Next review"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </>
            )}

            {/* Mobile prev/next row — replaces arrows that are hidden on mobile */}
            {reviews.length > 1 && (
                <div className="flex sm:hidden justify-center gap-3 mt-5">
                    <button onClick={goToPrevious} className="flex-1 max-w-[120px] py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 active:bg-orange-500/10 active:border-orange-500 transition-all">
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button onClick={goToNext} className="flex-1 max-w-[120px] py-3 bg-[#1a1a1a] border border-gray-700 rounded-xl flex items-center justify-center text-gray-400 active:bg-orange-500/10 active:border-orange-500 transition-all">
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            )}

            {/* Progress Dots */}
            {reviews.length > 1 && (
                <div className="flex justify-center gap-2 mt-5 md:mt-8 flex-wrap">
                    {reviews.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setCurrentIndex(idx)}
                            className={`h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                ? 'bg-gradient-to-r from-orange-500 to-pink-600 w-6 sm:w-8'
                                : 'bg-gray-600 hover:bg-gray-500 w-2'
                                }`}
                            aria-label={`Go to review ${idx + 1}`}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}
