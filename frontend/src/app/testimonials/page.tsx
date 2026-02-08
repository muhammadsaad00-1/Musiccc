"use client";

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Quote, ArrowRight, Loader2, CheckCircle, User, ArrowLeft } from 'lucide-react';
import FAQSection from '@/components/ui/FAQSection';

export default function TestimonialsPage() {
    const [name, setName] = useState('');
    const [rating, setRating] = useState(5);
    const [review, setReview] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [submitError, setSubmitError] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [reviews, setReviews] = useState<any[]>([]);
    const [loadingReviews, setLoadingReviews] = useState(true);

    // Fetch reviews from API
    useEffect(() => {
        async function fetchReviews() {
            try {
                const response = await fetch('http://localhost:8000/api/reviews');
                if (response.ok) {
                    const data = await response.json();
                    setReviews(data.reviews || data || []);
                }
            } catch (error) {
                console.error('Error fetching reviews:', error);
            } finally {
                setLoadingReviews(false);
            }
        }
        fetchReviews();
    }, [submitSuccess]);

    const submitReview = async (event: React.FormEvent) => {
        event.preventDefault();
        if (!name.trim()) {
            setSubmitError('Please enter your name.');
            return;
        }

        if (!review.trim()) {
            setSubmitError('Please add your review.');
            return;
        }

        setSubmitting(true);
        setSubmitError('');
        setSubmitSuccess(false);

        try {
            const formData = new FormData();
            formData.append('user_name', name.trim());
            formData.append('rating', String(rating));
            formData.append('review', review.trim());

            const response = await fetch('http://localhost:8000/api/reviews', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data?.success) {
                throw new Error(data?.message || 'Failed to submit review');
            }

            setSubmitSuccess(true);
            setName('');
            setRating(5);
            setReview('');
        } catch (error) {
            setSubmitError(error instanceof Error ? error.message : 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Success
                            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"> Stories</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            See how we've helped make events unforgettable across Pakistan
                        </p>
                    </div>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                            <div className="text-gray-500">Events Completed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">98%</div>
                            <div className="text-gray-500">Satisfaction Rate</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">4.9</div>
                            <div className="text-gray-500 flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                Average Rating
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loadingReviews ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : reviews.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {reviews.map((testimonial, index) => (
                                <div
                                    key={testimonial.id || index}
                                    className="bg-[#1a1a1a] rounded-3xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
                                >
                                    {/* Header with avatar */}
                                    <div className="p-6">
                                        <div className="flex items-center gap-4 mb-4">
                                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center">
                                                <User className="w-6 h-6 text-orange-400" />
                                            </div>
                                            <div>
                                                <p className="font-semibold text-white">{testimonial.user_name || testimonial.name}</p>
                                                <p className="text-sm text-gray-500">
                                                    {new Date(testimonial.created_at).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        {/* Rating */}
                                        <div className="flex gap-1 mb-4">
                                            {[...Array(testimonial.rating || 5)].map((_, i) => (
                                                <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                            ))}
                                        </div>

                                        {/* Quote */}
                                        <div className="relative">
                                            <Quote className="absolute -top-2 -left-2 w-8 h-8 text-orange-500/30" />
                                            <p className="text-gray-300 leading-relaxed pl-4">
                                                "{testimonial.review || testimonial.testimonial}"
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20 bg-[#1a1a1a] rounded-2xl border border-gray-800">
                            <Quote className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Reviews Yet</h3>
                            <p className="text-gray-400">Be the first to share your experience!</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Review Form */}
            <section className="py-16 border-t border-gray-800">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-[#111114] border border-gray-800 rounded-3xl p-8 sm:p-10">
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                            <div>
                                <p className="text-sm uppercase tracking-wider text-orange-400 font-semibold mb-2">
                                    Share your experience
                                </p>
                                <h2 className="text-3xl font-bold text-white">Leave a Review</h2>
                                <p className="text-gray-400 mt-2">
                                    Your testimonial helps others book with confidence.
                                </p>
                            </div>
                            <div className="flex items-center gap-2 text-yellow-400">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-5 h-5 fill-yellow-400" />
                                ))}
                                <span className="text-sm text-gray-400">Trusted by clients nationwide</span>
                            </div>
                        </div>

                        <form onSubmit={submitReview} className="space-y-6">
                            <div className="grid gap-6 sm:grid-cols-2">
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Your Name</label>
                                    <input
                                        type="text"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your full name"
                                        className="w-full rounded-xl bg-[#0a0a0b] border border-gray-800 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm text-gray-400 mb-2">Rating</label>
                                    <div className="flex items-center gap-2">
                                        {[1, 2, 3, 4, 5].map((value) => (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => setRating(value)}
                                                className={`p-2 rounded-lg border transition-colors ${rating >= value
                                                    ? 'border-yellow-500/60 bg-yellow-500/10'
                                                    : 'border-gray-800 bg-[#0a0a0b]'
                                                    }`}
                                            >
                                                <Star
                                                    className={`w-5 h-5 ${rating >= value
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-600'
                                                        }`}
                                                />
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm text-gray-400 mb-2">Your Review</label>
                                <textarea
                                    value={review}
                                    onChange={(e) => setReview(e.target.value)}
                                    rows={5}
                                    placeholder="Tell us about your experience with Artist Factory"
                                    className="w-full rounded-xl bg-[#0a0a0b] border border-gray-800 px-4 py-3 text-white placeholder:text-gray-600 focus:outline-none focus:ring-2 focus:ring-orange-500/50"
                                />
                            </div>

                            {submitError && (
                                <p className="text-sm text-red-400">{submitError}</p>
                            )}

                            {submitSuccess && (
                                <div className="flex items-center gap-2 text-sm text-green-400">
                                    <CheckCircle className="w-4 h-4" />
                                    Thank you! Your review has been submitted.
                                </div>
                            )}

                            <button
                                type="submit"
                                disabled={submitting}
                                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-60"
                            >
                                {submitting ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Submit Review'
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection
                title="Review Questions?"
                subtitle="Common questions about reviews and testimonials"
                faqs={[
                    {
                        question: "Are these reviews verified?",
                        answer: "Yes! All reviews are from real customers who booked artists through our platform. We verify each review for authenticity."
                    },
                    {
                        question: "Can I leave a review without booking?",
                        answer: "Reviews are typically from customers who have used our services, but we welcome feedback from anyone who has interacted with our platform."
                    },
                    {
                        question: "How do I edit or delete my review?",
                        answer: "Contact our support team with your review details and we'll assist you with any modifications or deletions."
                    }
                ]}
            />

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-size-200 animate-gradient rounded-3xl p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Success Story?</h2>
                        <p className="text-white/90 mb-8 max-w-xl mx-auto">
                            Join thousands of happy customers who've made their events unforgettable with Artist Factory
                        </p>
                        <Link
                            href="/post-requirement"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Get Started Today
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
