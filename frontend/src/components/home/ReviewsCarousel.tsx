'use client';

import { useEffect, useState } from 'react';
import { Star } from 'lucide-react';

interface Review {
    id: string;
    user_name: string;
    rating: number;
    review: string;
    created_at?: string;
}

// Dummy reviews to supplement backend data
const dummyReviews: Review[] = [
    {
        id: 'dummy-1',
        user_name: 'Ahmed Khan',
        rating: 5,
        review: 'Booked a singer for our wedding reception and the experience was phenomenal! The platform made it so easy to find the perfect artist. Highly recommend Artist Factory!',
    },
    {
        id: 'dummy-2',
        user_name: 'Fatima Ali',
        rating: 5,
        review: 'Amazing service! Found a fantastic DJ for our corporate event in Karachi. The booking process was smooth and the artist was professional.',
    },
    {
        id: 'dummy-3',
        user_name: 'Hassan Raza',
        rating: 4,
        review: 'Great platform with a wide variety of talented artists. Helped us organize an incredible mehndi event. Will definitely use again!',
    },
    {
        id: 'dummy-4',
        user_name: 'Ayesha Malik',
        rating: 5,
        review: 'The best platform for finding artists in Pakistan! Booked a qawwal for our event and everyone was mesmerized. Thank you Artist Factory!',
    },
    {
        id: 'dummy-5',
        user_name: 'Bilal Ahmed',
        rating: 5,
        review: 'Professional service from start to finish. The photographers we booked captured every moment beautifully. Couldn\'t be happier!',
    },
    {
        id: 'dummy-6',
        user_name: 'Sana Tariq',
        rating: 4,
        review: 'Found amazing comedians for our family gathering. Everyone had a great time. The platform is user-friendly and reliable.',
    },
];

export default function ReviewsCarousel() {
    const [reviews, setReviews] = useState<Review[]>(dummyReviews);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        // Fetch reviews from backend
        const fetchReviews = async () => {
            try {
                const response = await fetch('http://localhost:8000/api/reviews?limit=20');
                if (response.ok) {
                    const backendReviews = await response.json();
                    // Merge backend reviews with dummy data
                    setReviews([...backendReviews, ...dummyReviews]);
                }
            } catch (error) {
                console.log('Using dummy data only');
                // Keep dummy reviews as fallback
            } finally {
                setIsLoading(false);
            }
        };

        fetchReviews();
    }, []);

    // Auto-advance carousel
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentIndex((prev) => (prev + 1) % Math.ceil(reviews.length / 3));
        }, 5000);
        return () => clearInterval(timer);
    }, [reviews.length]);

    const renderStars = (rating: number) => {
        return (
            <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                    <Star
                        key={star}
                        className={`w-5 h-5 ${
                            star <= rating
                                ? 'fill-orange-400 text-orange-400'
                                : 'text-gray-600'
                        }`}
                    />
                ))}
            </div>
        );
    };

    const visibleReviews = reviews.slice(currentIndex * 3, currentIndex * 3 + 3);

    if (isLoading) {
        return (
            <div className="flex justify-center items-center py-20">
                <div className="text-gray-400">Loading reviews...</div>
            </div>
        );
    }

    return (
        <div className="relative">
            {/* Reviews Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                {visibleReviews.map((review, idx) => (
                    <div
                        key={review.id}
                        className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 transform transition-all duration-500 hover:scale-105"
                        style={{
                            animation: `fadeIn 0.5s ease-in ${idx * 0.1}s both`,
                        }}
                    >
                        {/* Stars */}
                        <div className="mb-4">{renderStars(review.rating)}</div>

                        {/* Review Text */}
                        <p className="text-gray-300 mb-6 line-clamp-4 min-h-[100px]">
                            "{review.review}"
                        </p>

                        {/* User Name */}
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-semibold">
                                {review.user_name.charAt(0).toUpperCase()}
                            </div>
                            <div>
                                <p className="text-white font-medium">{review.user_name}</p>
                                <p className="text-gray-500 text-sm">Verified Customer</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Navigation Dots */}
            <div className="flex justify-center gap-2 mt-8">
                {Array.from({ length: Math.ceil(reviews.length / 3) }).map((_, idx) => (
                    <button
                        key={idx}
                        onClick={() => setCurrentIndex(idx)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            idx === currentIndex
                                ? 'bg-orange-500 w-8'
                                : 'bg-gray-600 hover:bg-gray-500'
                        }`}
                        aria-label={`Go to slide ${idx + 1}`}
                    />
                ))}
            </div>

            <style jsx>{`
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: translateY(20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }
            `}</style>
        </div>
    );
}
