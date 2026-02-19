"use client";

import { useState } from "react";
import Image from "next/image";
import TestimonialsSection from "@/components/home/TestimonialsSection";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import { Mic2, Music, Globe, Award, Send, Star, User, MapPin, Briefcase } from "lucide-react";

// Reuse stats data structure for consistency
const stats = [
    { value: 500, suffix: "+", label: "Verified Artists", icon: Mic2 },
    { value: 2000, suffix: "+", label: "Events Delivered", icon: Music },
    { value: 5, suffix: "", label: "Countries Served", icon: Globe },
    { value: 98, suffix: "%", label: "Client Satisfaction", icon: Award },
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

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Reset and show success
        setIsSubmitting(false);
        setSubmitted(true);
        setFormData({ name: "", role: "", location: "", rating: 5, review: "" });

        // Hide success message after 5 seconds
        setTimeout(() => setSubmitted(false), 5000);
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
    return (
        <div className="min-h-screen bg-[#0a0a0b]">

            {/* ══ HERO ══════════════════════════════════════════════════ */}
            <section className="relative py-28 md:py-36 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-orange-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-8 border border-orange-500/30">
                        ✨ Client Stories
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-none">
                        Trusted by the <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                            Best in the Business
                        </span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        From multinational corporations to happy couples, see why thousands choose The Artist Factory for their most important moments.
                    </p>
                </div>
            </section>

            {/* ══ STATS STRIP ════════════════════════════════════════════ */}
            <section className="border-y border-gray-800/50 bg-[#0f0f10]/50 backdrop-blur-sm relative z-10">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                        {stats.map((stat) => (
                            <div key={stat.label} className="text-center group">
                                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 group-hover:border-orange-500/30 shadow-lg">
                                    <stat.icon className="w-5 h-5 text-orange-400" />
                                </div>
                                <div className="text-3xl font-extrabold text-white mb-1 flex items-center justify-center gap-0.5">
                                    <AnimatedCounter end={stat.value} duration={2000} suffix={stat.suffix} />
                                </div>
                                <p className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ EXISTING TESTIMONIALS ══════════════════════════════════ */}
            <TestimonialsSection />

            {/* ══ SUBMIT REVIEW ══════════════════════════════════════════ */}
            <section className="py-20 bg-[#0f0f10]">
                <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
                    <ReviewForm />
                </div>
            </section>

        </div>
    );
}
