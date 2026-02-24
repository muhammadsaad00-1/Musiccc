'use client';

import { useState, useEffect, JSX } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Mic2, Music, Disc3, Sparkles, Users, Star, Heart, Zap, Loader2, ArrowRight } from 'lucide-react';
import { useCategories } from '@/lib/hooks';

// Icon mapping for categories
const iconMap: Record<string, JSX.Element> = {
    'Singers': <Mic2 className="w-8 h-8" />,
    'Singer': <Mic2 className="w-8 h-8" />,
    'Qawwals': <Music className="w-8 h-8" />,
    'Qawwal': <Music className="w-8 h-8" />,
    'Sufi Artists': <Sparkles className="w-8 h-8" />,
    'Sufi': <Sparkles className="w-8 h-8" />,
    'Live Bands': <Users className="w-8 h-8" />,
    'Band': <Users className="w-8 h-8" />,
    'Ghazal Artists': <Heart className="w-8 h-8" />,
    'Ghazal': <Heart className="w-8 h-8" />,
    'Folk Singers': <Star className="w-8 h-8" />,
    'Folk': <Star className="w-8 h-8" />,
    'Classical Musicians': <Music className="w-8 h-8" />,
    'Classical': <Music className="w-8 h-8" />,
    'DJs': <Disc3 className="w-8 h-8" />,
    'DJ': <Disc3 className="w-8 h-8" />,
    'Dancer': <Sparkles className="w-8 h-8" />,
    'Comedian': <Star className="w-8 h-8" />,
    'Anchor': <Mic2 className="w-8 h-8" />,
    'Makeup Artist': <Heart className="w-8 h-8" />,
    'Photographer': <Star className="w-8 h-8" />,
    'Mehndi Artist': <Heart className="w-8 h-8" />,
    'Decorator': <Sparkles className="w-8 h-8" />,
};

// Hot categories (featured)
const hotCategories = ['Singer', 'Qawwal', 'DJ'];

interface Category {
    id: number;
    name: string;
    slug: string;
    description?: string;
    artist_count: number;
    image_url?: string;
}

export default function CategoryGrid() {
    // Use React Query hook
    const { data: categoriesData, isLoading: loading } = useCategories();
    const categories: Category[] = categoriesData || [];

    const getIcon = (name: string) => {
        return iconMap[name] || <Music className="w-8 h-8" />;
    };

    const isHot = (name: string) => {
        return hotCategories.some(hot => name.toLowerCase().includes(hot.toLowerCase()));
    };

    if (loading) {
        return (
            <section className="py-24 bg-[#0a0a0b] overflow-hidden">
                <div className="flex items-center justify-center min-h-[400px]">
                    <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        return null;
    }

    // Positions for the "hanging" effect (x: %, y: px offset from top curve)
    // Adjusted for a nice distribution along a curve
    const positions = [
        { x: 5, y: 40, length: 100, delay: 0 },
        { x: 20, y: 90, length: 140, delay: 0.2 },
        { x: 38, y: 120, length: 180, delay: 0.4 }, // Center-ish, lowest
        { x: 62, y: 120, length: 180, delay: 0.6 }, // Center-ish, lowest
        { x: 80, y: 90, length: 140, delay: 0.8 },
        { x: 95, y: 40, length: 100, delay: 1.0 },
    ];

    const displayCategories = categories.slice(0, 8);

    return (
        <section className="relative py-24 bg-[#0a0a0b] overflow-hidden min-h-[800px]">
            {/* Background Atmosphere */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-0 left-1/4 w-[800px] h-[800px] bg-orange-500/10 rounded-full blur-[150px] animate-pulse" />
                <div className="absolute bottom-0 right-1/4 w-[800px] h-[800px] bg-indigo-500/10 rounded-full blur-[150px] animate-pulse delay-1000" />

                {/* Studio Spotlights - Multiple points for depth */}
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,_rgba(255,255,255,0.06)_0%,_transparent_60%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_60%,_rgba(249,115,22,0.04)_0%,_transparent_50%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_60%,_rgba(99,102,241,0.04)_0%,_transparent_50%)]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                {/* Header */}
                <div className="text-center mb-16 relative z-10">
                    <span className="inline-block py-1 px-3 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-4">
                        Discover Talent
                    </span>
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Categories</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Find the perfect artist for your event from our diverse collection of talent
                    </p>
                </div>

                {/* The Hanging Thread Container */}
                <div className="relative w-full h-[500px] mt-12 hidden lg:block">
                    {/* The Curved Thread SVG */}
                    <svg className="absolute top-0 left-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                        {/* Main Thread */}
                        <path
                            d="M0,50 Q 640,250 1280,50"
                            fill="none"
                            stroke="url(#threadGradient)"
                            strokeWidth="3"
                            vectorEffect="non-scaling-stroke"
                            className="drop-shadow-[0_0_15px_rgba(249,115,22,0.4)]"
                        />

                        {/* Fairy Lights along the path */}
                        {[...Array(15)].map((_, i) => {
                            const t = i / 14;
                            // Quadratic Bezier: (1-t)^2*P0 + 2(1-t)*t*P1 + t^2*P2
                            // P0=(0,50), P1=(640,250), P2=(1280,50)
                            const cx = Math.pow(1 - t, 2) * 0 + 2 * (1 - t) * t * 640 + Math.pow(t, 2) * 1280;
                            const cy = Math.pow(1 - t, 2) * 50 + 2 * (1 - t) * t * 250 + Math.pow(t, 2) * 50;

                            return (
                                <g key={i}>
                                    {/* Outer Bloom */}
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r="6"
                                        fill="white"
                                        className="animate-pulse opacity-20"
                                        style={{ animationDelay: `${i * 0.2}s` }}
                                    />
                                    {/* Inner Light */}
                                    <circle
                                        cx={cx}
                                        cy={cy}
                                        r="2"
                                        fill="white"
                                        className="animate-pulse"
                                        style={{
                                            animationDelay: `${i * 0.2}s`,
                                            filter: 'drop-shadow(0 0 5px white)'
                                        }}
                                    />
                                </g>
                            );
                        })}

                        <defs>
                            <linearGradient id="threadGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.6" />
                                <stop offset="50%" stopColor="#db2777" stopOpacity="0.9" />
                                <stop offset="100%" stopColor="#f97316" stopOpacity="0.6" />
                            </linearGradient>
                        </defs>
                    </svg>

                    {/* Hanging Items */}
                    {displayCategories.map((category, index) => {
                        const pos = positions[index];
                        if (!pos) return null;

                        return (
                            <div
                                key={category.id}
                                className="absolute top-[50px] z-10 group"
                                style={{
                                    left: `${pos.x}%`,
                                    transform: 'translateX(-50%)',
                                }}
                            >
                                {/* The Vertical String */}
                                <div
                                    className="absolute top-0 left-1/2 w-[2px] bg-gradient-to-b from-gray-700 to-gray-800 origin-top group-hover:animate-swing-string"
                                    style={{
                                        height: `${pos.length}px`,
                                        transform: 'translateX(-50%)',
                                    }}
                                />

                                {/* The Hanging Circle Node */}
                                <div
                                    className="relative group cursor-pointer"
                                    style={{
                                        marginTop: `${pos.length}px`,
                                    }}
                                >
                                    {/* Link wrapper */}
                                    <Link href={`/artists/${category.slug || category.name.toLowerCase()}`}>
                                        <div className="relative w-32 h-32 md:w-40 md:h-40 rounded-full border-4 border-[#1a1a1a] shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)] group-hover:shadow-[0_20px_50px_-10px_rgba(249,115,22,0.3)] transition-all duration-500 ease-in-out transform group-hover:scale-110 bg-[#1a1a1a] overflow-hidden">

                                            {/* Image / Icon */}
                                            {category.image_url ? (
                                                <img
                                                    src={category.image_url}
                                                    alt={category.name}
                                                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#111] flex flex-col items-center justify-center p-4 text-center">
                                                    <div className="text-orange-400 mb-2 transform group-hover:-translate-y-1 transition-transform duration-300">
                                                        {getIcon(category.name)}
                                                    </div>
                                                </div>
                                            )}

                                            {/* Overlay on Hover */}
                                            <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center backdrop-blur-[2px]">
                                                <ArrowRight className="text-white w-8 h-8 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300" />
                                            </div>
                                        </div>

                                        {/* Label Tag */}
                                        <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 bg-[#1a1a1a]/90 backdrop-blur-md border border-gray-800 px-4 py-2 rounded-full whitespace-nowrap shadow-xl transform transition-all duration-300 group-hover:-translate-y-2 group-hover:border-orange-500/30">
                                            <span className="text-white font-semibold text-sm tracking-wide">
                                                {category.name}
                                            </span>
                                            {isHot(category.name) && (
                                                <span className="absolute -top-2 -right-2 w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            </div>
                        );
                    })}
                </div>

                <div className="lg:hidden grid grid-cols-2 gap-4 mt-8 relative">
                    {/* Atmospheric glow for mobile */}
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(249,115,22,0.05)_0%,_transparent_70%)] pointer-events-none" />

                    {categories.slice(0, 6).map((category) => (
                        <Link
                            key={category.id}
                            href={`/artists/${category.slug || category.name.toLowerCase()}`}
                            className="bg-[#1a1a1a] rounded-xl p-4 border border-gray-800 flex flex-col items-center text-center gap-3 active:scale-95 transition-transform"
                        >
                            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-orange-500/10 to-pink-500/10 flex items-center justify-center text-orange-400">
                                {getIcon(category.name)}
                            </div>
                            <span className="text-white font-medium text-sm">{category.name}</span>
                        </Link>
                    ))}
                </div>

                {/* View All Button */}
                <div className="text-center mt-20 relative z-20">
                    <Link
                        href="/categories"
                        className="inline-flex items-center gap-2 px-8 py-3 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-white font-medium transition-all hover:scale-105"
                    >
                        View All Categories
                        <ArrowRight className="w-4 h-4" />
                    </Link>
                </div>
            </div>

            {/* Styles for custom swing animation */}
            <style jsx>{`
                @keyframes swing-string {
                    0%, 100% { transform: translateX(-50%) rotate(0deg); }
                    25% { transform: translateX(-50%) rotate(1deg); }
                    75% { transform: translateX(-50%) rotate(-1deg); }
                }
                .animate-swing-string {
                    animation: swing-string 3s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
