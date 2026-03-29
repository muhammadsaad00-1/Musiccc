"use client";

import { useState } from "react";
import Image from "next/image";
import { API_BASE_URL } from '@/lib/api';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import ArtistReviewsCarousel from '@/components/home/ArtistReviewsCarousel';
import ArtistVideoTestimonials from "@/components/testimonials/ArtistVideoTestimonials";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Mic2, Music, Globe, Award, Send, Star, User, MapPin, Briefcase, X, Quote } from "lucide-react";

// Reuse stats data structure for consistency
const stats = [
    { value: 400, suffix: "+", label: "Verified Artists", icon: Mic2 },
    { value: 5000, suffix: "+", label: "Events Delivered", icon: Music },
    { value: 20, suffix: "", label: "Cities Served", icon: Globe },
    { value: 4.9, suffix: "", label: "Average Rating", icon: Award },
];

function ReviewForm() {
    const [formData, setFormData] = useState({
        name: "",
        role: "",
        location: "",
        rating: 5,
        review: ""
    });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitted, setSubmitted] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            // Create FormData as backend expects Form fields
            const formDataToSend = new FormData();
            formDataToSend.append('user_name', formData.name);
            formDataToSend.append('rating', String(formData.rating));
            formDataToSend.append('review', formData.review);

            const response = await fetch(`${API_BASE_URL}/api/reviews`, {
                method: 'POST',
                body: formDataToSend,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                // Reset and show success
                setSubmitted(true);
                setFormData({ name: "", role: "", location: "", rating: 5, review: "" });
                
                // Hide success message after 5 seconds
                setTimeout(() => setSubmitted(false), 5000);
            } else {
                console.error('Failed to submit review:', data.message);
                alert(data.message || 'Failed to submit review. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('An error occurred. Please try again later.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-8 md:p-12 relative overflow-hidden">
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-2 gap-12 items-center">
                <div>
                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500/10 to-pink-600/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium mb-6">
                        ✍️ Share Your Story
                    </span>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                        How Was Your Experience?
                    </h2>
                    <p className="text-gray-400 mb-8 leading-relaxed">
                        Your feedback helps us maintain the highest standards of excellence. Whether you're an artist or a client, we'd love to hear from you.
                    </p>

                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">🌟</div>
                            <div>
                                <h4 className="text-white font-semibold">Rate Your Experience</h4>
                                <p className="text-sm text-gray-500">Tap the stars to rate</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-gray-800 rounded-full flex items-center justify-center text-2xl">📝</div>
                            <div>
                                <h4 className="text-white font-semibold">Detailed Feedback</h4>
                                <p className="text-sm text-gray-500">Tell us what you loved</p>
                            </div>
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4 bg-black/20 p-6 rounded-2xl border border-white/5">
                    {submitted ? (
                        <div className="text-center py-12">
                            <div className="w-16 h-16 bg-green-500/20 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✓</div>
                            <h3 className="text-xl font-bold text-white mb-2">Thank You!</h3>
                            <p className="text-gray-400">Your review has been submitted successfully.</p>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Your Name</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            className="w-full bg-[#0a0a0b] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder:text-gray-600"
                                            placeholder="John Doe"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Role / Event Type</label>
                                    <div className="relative">
                                        <Briefcase className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.role}
                                            onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                                            className="w-full bg-[#0a0a0b] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder:text-gray-600"
                                            placeholder="e.g. Wedding Planner"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Location</label>
                                    <div className="relative">
                                        <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-500" />
                                        <input
                                            type="text"
                                            required
                                            value={formData.location}
                                            onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                            className="w-full bg-[#0a0a0b] border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder:text-gray-600"
                                            placeholder="City, Country"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-gray-400 ml-1">Rating</label>
                                    <div className="flex bg-[#0a0a0b] border border-gray-800 rounded-xl py-2 px-4 gap-2 items-center h-[46px]">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <button
                                                key={star}
                                                type="button"
                                                onClick={() => setFormData({ ...formData, rating: star })}
                                                className="focus:outline-none transition-transform hover:scale-110"
                                            >
                                                <Star
                                                    className={`w-5 h-5 ${star <= formData.rating ? "fill-orange-400 text-orange-400" : "text-gray-600"}`}
                                                />
                                            </button>
                                        ))}
                                        <span className="ml-auto text-sm text-gray-400 font-medium">{formData.rating}.0</span>
                                    </div>
                                </div>
                            </div>

                            <div className="space-y-1">
                                <label className="text-xs font-medium text-gray-400 ml-1">Your Review</label>
                                <textarea
                                    required
                                    rows={4}
                                    value={formData.review}
                                    onChange={(e) => setFormData({ ...formData, review: e.target.value })}
                                    className="w-full bg-[#0a0a0b] border border-gray-800 rounded-xl py-3 px-4 text-white focus:border-orange-500/50 focus:ring-1 focus:ring-orange-500/50 outline-none transition-all placeholder:text-gray-600 resize-none"
                                    placeholder="Share your experience working with The Artist Factory..."
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isSubmitting ? (
                                    <span className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                                ) : (
                                    <>
                                        Submit Review <Send className="w-4 h-4" />
                                    </>
                                )}
                            </button>
                        </>
                    )}
                </form>
            </div>
        </div>
    );
}

export default function TestimonialsPage() {
    const [activeTab, setActiveTab] = useState<'clients' | 'artists'>('clients');

    return (
        <div className="min-h-screen bg-[#0a0a0b]">

            {/* ══ HERO ══════════════════════════════════════════════════ */}
            <section className="relative py-32 md:py-48 overflow-hidden bg-black">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[160px]" />
                    <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-pink-600/10 rounded-full blur-[140px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 text-center">
                    <div className="flex items-center justify-center gap-4 mb-10">
                        <div className="h-px w-16 bg-gradient-to-r from-transparent to-orange-500" />
                        <span className="text-orange-500 text-sm font-black tracking-[0.4em] uppercase">The Testimonials</span>
                        <div className="h-px w-16 bg-gradient-to-l from-transparent to-orange-500" />
                    </div>
                    
                    <h1 className="text-7xl md:text-9xl font-black text-white mb-10 tracking-tighter leading-[0.8]">
                        Voices of <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600 italic font-serif">Excellence</span>
                    </h1>
                    
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-20">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-[#1a1a1a] border border-gray-800 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-300 group overflow-hidden relative"
                            >
                                <div className="absolute top-0 right-0 w-32 h-32 bg-orange-500/5 rounded-full blur-3xl pointer-events-none group-hover:bg-orange-500/10 transition-colors" />
                                <div className="relative z-10 text-center">
                                    <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:border-orange-500/50 shadow-lg">
                                        <stat.icon className="w-5 h-5 text-orange-400" />
                                    </div>
                                    <div className="text-3xl font-extrabold text-white mb-1 flex items-center justify-center gap-0.5">
                                        <AnimatedCounter end={stat.value} duration={2000} suffix={stat.suffix} />
                                    </div>
                                    <p className="text-gray-500 text-xs font-bold uppercase tracking-[0.2em]">{stat.label}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>



            {/* ══ VIDEO HIGHLIGHTS ═════════════════════════════════════ */}
            <ArtistVideoTestimonials />

            {/* ══ TABS SECTION ══════════════════════════════════════════ */}
            <section className="py-24 bg-[#0a0a0b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Premium Tabs */}
                    <div className="flex justify-center mb-20">
                        <div className="flex gap-2 p-2 bg-[#1a1a1a] rounded-2xl border border-gray-800 shadow-2xl">
                            <button
                                onClick={() => setActiveTab('clients')}
                                className={`flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-500 ${activeTab === 'clients'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-xl shadow-orange-500/20 scale-105'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <User className="w-5 h-5" />
                                Client Reviews
                            </button>
                            <button
                                onClick={() => setActiveTab('artists')}
                                className={`flex items-center gap-3 px-10 py-4 rounded-xl text-lg font-bold transition-all duration-500 ${activeTab === 'artists'
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white shadow-xl shadow-orange-500/20 scale-105'
                                    : 'text-gray-500 hover:text-white'
                                    }`}
                            >
                                <Mic2 className="w-5 h-5" />
                                Artist Stories
                            </button>
                        </div>
                    </div>

                    <div className="min-h-[400px]">
                        {activeTab === 'clients' ? (
                            <div className="animate-fadeIn">
                                <h3 className="text-center text-gray-400 text-sm uppercase tracking-[0.3em] font-bold mb-12">Trusted by 2000+ Happy Clients</h3>
                                <ReviewsCarousel />
                            </div>
                        ) : (
                            <div className="animate-fadeIn">
                                <h3 className="text-center text-gray-400 text-sm uppercase tracking-[0.3em] font-bold mb-12">Stars Who Call Us Home</h3>
                                <ArtistReviewsCarousel />
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* ══ SUBMIT REVIEW ══════════════════════════════════════════ */}
            <section className="py-20 bg-[#0f0f10]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ReviewForm />
                </div>
            </section>

        </div>
    );
}
