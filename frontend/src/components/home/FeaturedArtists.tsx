'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, Star, Loader2, Sparkles, Music, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react';
import { usePerformers } from '@/lib/hooks';

interface Artist {
    id: number;
    name: string;
    slug: string;
    category: string;
    location: string;
    profile_image_url?: string;
    image_url?: string;
    is_featured?: boolean;
    is_verified?: boolean;
}

export default function FeaturedArtists() {
    // Use React Query hook to fetch featured performers
    const { data: performersData, isLoading: loading } = usePerformers({ limit: 500 });

    const [allFeaturedArtists, setAllFeaturedArtists] = useState<Artist[]>([]);
    const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
    const [displayIndex, setDisplayIndex] = useState(0);

    useEffect(() => {
        if (performersData?.data) {
            const artists = performersData.data.map((artist: any) => ({
                id: artist.id,
                name: artist.name,
                slug: artist.slug || artist.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                category: artist.category,
                location: artist.locations?.[0] || artist.location || 'Pakistan',
                image_url: artist.profile_image_url || artist.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
                is_featured: artist.is_featured,
                is_verified: artist.is_verified,
            }));

            // Prefer featured, but if not enough, use all
            const featured = artists.filter((a: any) => a.is_featured);
            const finalPool = featured.length >= 3 ? featured : artists;

            setAllFeaturedArtists(finalPool);
            // Explicitly slice 5 for the new constellation layout
            setFeaturedArtists(finalPool.slice(0, 5));
        }
    }, [performersData]);

    // Rotation logic
    const handleNext = () => {
        setDisplayIndex((prev) => {
            const nextIndex = (prev + 5) >= allFeaturedArtists.length ? 0 : prev + 5;
            setFeaturedArtists(allFeaturedArtists.slice(nextIndex, nextIndex + 5));
            return nextIndex;
        });
    };

    const handlePrev = () => {
        setDisplayIndex((prev) => {
            const nextIndex = (prev - 5) < 0 ? Math.max(0, Math.floor((allFeaturedArtists.length - 1) / 5) * 5) : prev - 5;
            setFeaturedArtists(allFeaturedArtists.slice(nextIndex, nextIndex + 5));
            return nextIndex;
        });
    };

    // Rotation interval
    useEffect(() => {
        if (allFeaturedArtists.length <= 5) return;

        const interval = setInterval(() => {
            handleNext();
        }, 5000); // 5 seconds per user request

        return () => clearInterval(interval);
    }, [allFeaturedArtists]);

    if (loading) {
        return (
            <section className="py-24 bg-[#0a0a0b] overflow-hidden min-h-[600px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </section>
        );
    }

    if (featuredArtists.length === 0) return null;

    return (
        <section className="relative pt-24 pb-24 bg-gradient-to-b from-[#0a0a0b] to-[#050508] overflow-hidden">
            {/* Space Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-transparent to-transparent" />
                <div className="absolute top-[10%] left-[5%] w-[800px] h-[800px] bg-indigo-600/5 rounded-full blur-[150px] animate-pulse-slow" />
                <div className="absolute bottom-[10%] right-[5%] w-[900px] h-[900px] bg-orange-600/5 rounded-full blur-[180px] animate-pulse-slow delay-2000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[1px] bg-gradient-to-r from-transparent via-white/5 to-transparent rotate-12 pointer-events-none" />

                {/* Stars/Dots - Denser field */}
                {[...Array(120)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-twinkle"
                        style={{
                            width: Math.random() * 2 + 0.5 + 'px',
                            height: Math.random() * 2 + 0.5 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.7 + 0.1,
                            animationDelay: Math.random() * 10 + 's',
                            animationDuration: Math.random() * 5 + 3 + 's' as any,
                        }}
                    />
                ))}

                {/* Galaxy Streaks */}
                <div className="absolute top-1/4 -left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/20 to-transparent rotate-45 animate-slide-slow" />
                <div className="absolute top-3/4 -left-1/4 w-full h-[1px] bg-gradient-to-r from-transparent via-purple-500/10 to-transparent -rotate-12 animate-slide-slow delay-7000" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full">
                {/* Header */}
                <div className="text-center mb-20 relative z-10">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-300 text-sm font-medium mb-6 backdrop-blur-sm">
                        <Sparkles className="w-4 h-4" />
                        <span>Star Performers</span>
                    </div>
                    <h2 className="text-5xl md:text-6xl font-bold text-white tracking-tight mb-6">
                        Meet the <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-orange-400 animate-gradient-x">Stars</span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg leading-relaxed">
                        Top-tier artists who are shaping the future of entertainment in Pakistan
                    </p>
                </div>

                <div className="relative group/carousel px-4 lg:px-0">
                    {/* Manual Navigation - Previous */}
                    <button
                        onClick={handlePrev}
                        className="absolute -left-2 lg:-left-24 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-[#1a1a1a]/90 border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 transition-all opacity-100 md:opacity-0 group-hover/carousel:opacity-100 flex items-center justify-center backdrop-blur-md hover:scale-110 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                        aria-label="Previous Stars"
                    >
                        <ChevronLeft className="w-8 h-8" />
                    </button>

                    {/* Manual Navigation - Next */}
                    <button
                        onClick={handleNext}
                        className="absolute -right-2 lg:-right-24 top-1/2 -translate-y-1/2 z-50 p-4 rounded-full bg-[#1a1a1a]/90 border border-white/20 text-white hover:bg-orange-500 hover:border-orange-500 transition-all opacity-100 md:opacity-0 group-hover/carousel:opacity-100 flex items-center justify-center backdrop-blur-md hover:scale-110 shadow-[0_0_30px_rgba(249,115,22,0.4)]"
                        aria-label="Next Stars"
                    >
                        <ChevronRight className="w-8 h-8" />
                    </button>

                    {/* Constellation Lines (SVG) */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" preserveAspectRatio="none">
                        <defs>
                            <linearGradient id="constellationGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="rgba(99,102,241,0.05)" />
                                <stop offset="50%" stopColor="rgba(249,115,22,0.2)" />
                                <stop offset="100%" stopColor="rgba(168,85,247,0.05)" />
                            </linearGradient>
                        </defs>
                        <path
                            d="M 70,260 L 300,160 L 640,80 L 980,160 L 1210,260"
                            className="hidden lg:block constellation-path"
                            fill="none"
                            stroke="url(#constellationGradient)"
                            strokeWidth="1.5"
                            strokeDasharray="8 12"
                        />
                    </svg>

                    <div className="relative flex flex-wrap justify-center items-center gap-8 lg:gap-0 lg:h-[450px]">
                        {featuredArtists.map((artist, index) => {
                            // Custom positions for constellation (Arc/Apex layout)
                            const positions = [
                                'lg:absolute lg:left-[5%] lg:top-[50%]',   // Outer Left
                                'lg:absolute lg:left-[22%] lg:top-[25%]',  // Inner Left
                                'lg:absolute lg:left-[50%] lg:top-[0%] lg:-translate-x-1/2',   // Center Apex
                                'lg:absolute lg:right-[22%] lg:top-[25%]', // Inner Right
                                'lg:absolute lg:right-[5%] lg:top-[50%]',  // Outer Right
                            ];

                            return (
                                <div
                                    key={`${artist.id}-${displayIndex}`}
                                    className={`relative group animate-in fade-in zoom-in-95 slide-in-from-bottom-8 duration-1000 flex flex-col items-center ${positions[index] || ''}`}
                                    style={{ animationDelay: `${index * 0.15}s` }}
                                >
                                    {/* Floating Card - Scaled down for 5 items */}
                                    <Link
                                        href={`/artist/${artist.slug}`}
                                        className="relative animate-float"
                                        style={{ animationDelay: `${index * 0.5}s` }}
                                    >
                                        {/* Glow Halo */}
                                        <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/0 via-indigo-500/20 to-purple-500/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                        {/* Main Node */}
                                        <div className="relative w-36 h-36 md:w-44 md:h-44 lg:w-48 lg:h-48 rounded-full p-1 bg-gradient-to-br from-indigo-500/30 to-orange-500/30 backdrop-blur-sm border border-white/10 group-hover:border-white/30 transition-all duration-500 group-hover:scale-110 shadow-2xl">
                                            <div className="w-full h-full rounded-full overflow-hidden relative">
                                                <Image
                                                    src={artist.image_url!}
                                                    alt={artist.name}
                                                    fill
                                                    className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                                                />

                                                {/* Overlay Content on Hover */}
                                                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                                                    <span className="text-orange-400 font-medium text-[10px] tracking-wider uppercase mb-1">
                                                        {artist.category}
                                                    </span>
                                                    <div className="w-8 h-0.5 bg-white/30 mb-2" />
                                                    <p className="text-white text-[10px] opacity-90">
                                                        {artist.location}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Label Below Node */}
                                        <div className="mt-4 text-center transition-transform duration-300 group-hover:translate-y-2">
                                            <h3 className="text-sm md:text-base lg:text-lg font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                                {artist.name}
                                            </h3>
                                            {artist.is_verified && (
                                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[8px] font-bold uppercase tracking-wider">
                                                    Verified
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* View All CTA */}
                <div className="text-center mt-32 relative z-10">
                    <Link
                        href="/artists"
                        className="group inline-flex items-center gap-4 px-12 py-6 bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-white/20 hover:border-indigo-500 rounded-full text-white text-xl font-bold transition-all duration-300 hover:shadow-[0_0_40px_-5px_rgba(99,102,241,0.5)] hover:-translate-y-1 backdrop-blur-md"
                    >
                        <span>Explore the Galaxy</span>
                        <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                    </Link>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px); }
                    50% { transform: translateY(-20px); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes spin-slow {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
                .animate-spin-slow {
                    animation: spin-slow 10s linear infinite;
                }
                @keyframes pulse-slow {
                    0%, 100% { opacity: 0.1; transform: scale(1); }
                    50% { opacity: 0.3; transform: scale(1.1); }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s ease-in-out infinite;
                }
                @keyframes galaxy-spin {
                    from { transform: translate(-50%, -50%) rotate(0deg); }
                    to { transform: translate(-50%, -50%) rotate(360deg); }
                }
                .animate-galaxy-spin {
                    animation: galaxy-spin 60s linear infinite;
                }
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 1; transform: scale(1.2); }
                }
                .animate-twinkle {
                    animation: twinkle 4s ease-in-out infinite;
                }
                @keyframes slide-slow {
                    0% { transform: translateX(-100%) translateY(-100%); opacity: 0; }
                    20% { opacity: 0.1; }
                    80% { opacity: 0.1; }
                    100% { transform: translateX(100%) translateY(100%); opacity: 0; }
                }
                .animate-slide-slow {
                    animation: slide-slow 15s linear infinite;
                }
                @keyframes constellation-flow {
                    from { stroke-dashoffset: 100%; }
                    to { stroke-dashoffset: 0%; }
                }
                .constellation-path {
                    animation: constellation-flow 30s linear infinite;
                }
            `}</style>
        </section>
    );
}
