'use client';

import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Mic2, Star, Music, Award } from 'lucide-react';
import { useState, useEffect } from 'react';

export default function FeatureSection() {
    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const featureImages = [
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop", // Mic (Orange-ish)
        "https://images.unsplash.com/photo-1570295999919-56ceb5ecca61?w=800&q=80", // Original Man
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop", // Concert
        "https://images.unsplash.com/photo-1501386761578-eac5c94b800a?q=80&w=1000&auto=format&fit=crop"  // Crowd/Party
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % featureImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // ... (rest of the component)

    return (
        <section className="py-20 bg-[#0a0a0b] relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-orange-900/10 to-transparent pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-1/3 h-full bg-gradient-to-r from-pink-900/10 to-transparent pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid lg:grid-cols-2 gap-16 items-center">

                    {/* Text Content */}
                    <div className="order-2 lg:order-1 space-y-8">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                            <span className="text-sm text-orange-400 font-medium tracking-wide uppercase">Why Choose Us</span>
                        </div>

                        <h2 className="text-4xl sm:text-5xl font-bold text-white leading-tight">
                            Dealing in <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">
                                National & International
                            </span> <br />
                            Artists!
                        </h2>

                        <p className="text-lg text-gray-400 leading-relaxed">
                            We pride ourselves on being Pakistan's premier artist booking platform. Whether you need a local folk legend or an international pop sensation, we make it happen with zero hassle.
                        </p>

                        <div className="space-y-4">
                            {[
                                'Direct Access to Top Talent',
                                'Secure & Transparent Booking',
                                'End-to-End Event Management Support',
                                '100% Reliability Guarantee'
                            ].map((item, index) => (
                                <div key={index} className="flex items-center gap-3 group">
                                    <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center group-hover:bg-green-500/30 transition-colors">
                                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                                    </div>
                                    <span className="text-gray-300 group-hover:text-white transition-colors">{item}</span>
                                </div>
                            ))}
                        </div>

                        <div className="pt-8 flex flex-col sm:flex-row gap-4">
                            <Link
                                href="/artists"
                                className="px-8 py-4 bg-white text-black font-bold rounded-xl hover:bg-gray-200 transition-all text-center flex items-center justify-center gap-2"
                            >
                                Find Artists
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-transparent border border-gray-700 text-white font-bold rounded-xl hover:bg-white/5 transition-all text-center"
                            >
                                Contact Support
                            </Link>
                        </div>
                    </div>

                    {/* Image Carousel */}
                    <div className="order-1 lg:order-2 relative">
                        <div className="relative aspect-[4/5] rounded-3xl overflow-hidden border border-gray-800 shadow-2xl shadow-orange-500/10 group">
                            {featureImages.map((src, index) => (
                                <div
                                    key={src}
                                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentImageIndex ? 'opacity-100' : 'opacity-0'}`}
                                >
                                    <Image
                                        src={src}
                                        alt={`Featured Artist ${index + 1}`}
                                        fill
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                </div>
                            ))}

                            {/* Overlay Gradient */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-90" />

                            {/* Content Over Layout */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                <div className="space-y-2">
                                    <div className="flex items-center gap-2 text-orange-400 font-medium text-sm mb-2">
                                        <Star className="w-4 h-4 fill-orange-400" />
                                        <span>Featured Artists</span>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white">
                                        Atif Aslam, Rahat Fateh Ali Khan, & More
                                    </h3>
                                    <p className="text-gray-300 text-sm opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        Book the biggest names in the industry for your special day.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Floating Badge */}
                        <div className="absolute -bottom-6 -left-6 bg-[#1a1a1a] p-4 rounded-2xl border border-gray-800 shadow-xl flex items-center gap-4 animate-bounce-slow hidden sm:flex">
                            <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center text-white font-bold text-lg">
                                10k+
                            </div>
                            <div>
                                <div className="text-white font-bold">Successful Events</div>
                                <div className="text-xs text-gray-400">Since 2024</div>
                            </div>
                        </div>

                        {/* Floating Badge 2 */}
                        <div className="absolute top-10 -right-6 bg-[#1a1a1a] p-3 rounded-xl border border-gray-800 shadow-xl flex items-center gap-3 animate-pulse hidden sm:flex">
                            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                <Award className="w-5 h-5 text-green-500" />
                            </div>
                            <div>
                                <div className="text-white font-bold text-sm">100%</div>
                                <div className="text-xs text-gray-400">Satisfaction</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <style jsx>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
