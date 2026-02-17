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

export default function ReviewsCarousel({ artistId, className }: { artistId?: string; className?: string }) {
    const [reviews, setReviews] = useState<Review[]>([]);
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
                        setReviews(backendReviews);
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
            <div className="relative bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-3xl p-8 md:p-12 border border-gray-800 hover:border-orange-500/50 text-center transition-all duration-500 group">
                {/* Neon Glow Effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-orange-500/0 via-orange-500/5 to-pink-600/0 group-hover:from-orange-500/10 group-hover:via-orange-500/20 group-hover:to-pink-600/10 transition-all duration-500" />

                {/* Quote Icon */}
                <div className="absolute top-6 left-6 opacity-20 group-hover:opacity-40 transition-opacity">
                    <Quote className="w-16 h-16 text-orange-500" />
                </div>

                {/* Stars */}
                <div className="relative mb-6">
                    {renderStars(currentReview.rating)}
                </div>

                {/* Review Text */}
                <p className="relative text-xl md:text-2xl lg:text-3xl font-medium text-white leading-relaxed mb-8 max-w-3xl mx-auto group-hover:text-gray-100 transition-colors">
                    "<span className="text-orange-400/90">{currentReview.review.charAt(0)}</span>{currentReview.review.slice(1)}"
                </p>

                {/* User Info */}
                <div className="relative flex items-center justify-center gap-4">
                    <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white text-xl font-bold shadow-lg shadow-orange-500/30">
                        {currentReview.user_name.charAt(0).toUpperCase()}
                    </div>
                    <div className="text-left">
                        <p className="text-white font-semibold text-lg">{currentReview.user_name}</p>
                        <p className="text-orange-400/70 text-sm">Verified Customer ✓</p>
                    </div>
                </div>
            </div>

            {/* Navigation Arrows */}
            {reviews.length > 1 && (
                <>
                    <button
                        onClick={goToPrevious}
                        className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-6 w-12 h-12 bg-[#1a1a1a] border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 shadow-lg"
                        aria-label="Previous review"
                    >
                        <ChevronLeft className="w-6 h-6" />
                    </button>
                    <button
                        onClick={goToNext}
                        className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-6 w-12 h-12 bg-[#1a1a1a] border border-gray-700 rounded-full flex items-center justify-center text-gray-400 hover:text-white hover:border-orange-500 hover:bg-orange-500/10 transition-all duration-300 shadow-lg"
                        aria-label="Next review"
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
                            aria-label={`Go to review ${idx + 1}`}
                        />
                    ))}
                </div>
            )}

            {/* Auto-advance indicator */}
            <p className="text-center text-gray-600 text-xs mt-4">
                {isPaused ? 'Paused' : 'Auto-advancing'} • {currentIndex + 1} of {reviews.length}
            </p>
        </div>
    );
}
