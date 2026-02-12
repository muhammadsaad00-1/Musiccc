'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, Star, Loader2, Sparkles, Music } from 'lucide-react';

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
    const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchFeaturedArtists = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/performers?featured=true&limit=6');
                if (response.ok) {
                    const data = await response.json();
                    const artists = (data.performers || data || []).map((artist: any) => ({
                        id: artist.id,
                        name: artist.name,
                        slug: artist.slug || artist.name.toLowerCase().replace(/\s+/g, '-'),
                        category: artist.category,
                        location: artist.locations?.[0] || artist.location || 'Pakistan',
                        image_url: artist.profile_image_url || artist.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
                        is_featured: artist.is_featured,
                        is_verified: artist.is_verified,
                    }));
                    setFeaturedArtists(artists);
                }
            } catch (error) {
                console.error('Error fetching featured artists:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchFeaturedArtists();
    }, []);

    if (loading) {
        return (
            <section className="py-24 bg-[#0a0a0b] overflow-hidden min-h-[600px] flex items-center justify-center">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </section>
        );
    }

    if (featuredArtists.length === 0) return null;

    return (
        <section className="relative py-32 bg-[#050508] overflow-hidden min-h-[900px]">
            {/* Space Background */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-[#050508] to-[#050508]" />
                <div className="absolute top-[20%] left-[10%] w-72 h-72 bg-purple-600/10 rounded-full blur-[100px] animate-pulse-slow" />
                <div className="absolute bottom-[20%] right-[10%] w-96 h-96 bg-orange-600/10 rounded-full blur-[120px] animate-pulse-slow delay-1000" />

                {/* Stars/Dots */}
                {[...Array(20)].map((_, i) => (
                    <div
                        key={i}
                        className="absolute rounded-full bg-white animate-twinkle"
                        style={{
                            width: Math.random() * 2 + 1 + 'px',
                            height: Math.random() * 2 + 1 + 'px',
                            top: Math.random() * 100 + '%',
                            left: Math.random() * 100 + '%',
                            opacity: Math.random() * 0.5 + 0.1,
                            animationDelay: Math.random() * 5 + 's',
                        }}
                    />
                ))}
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

                {/* Constellation Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 gap-y-16 lg:gap-y-24 perspective-1000">
                    {featuredArtists.map((artist, index) => (
                        <div
                            key={artist.id}
                            className={`relative group flex flex-col items-center ${index % 3 === 1 ? 'lg:mt-16' : '' // Stagger middle column down
                                }`}
                        >
                            {/* Floating Card */}
                            <Link
                                href={`/artist/${artist.slug}`}
                                className="relative animate-float"
                                style={{ animationDelay: `${index * 0.5}s` }}
                            >
                                {/* Glow Halo */}
                                <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/0 via-indigo-500/20 to-purple-500/0 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                                {/* Main Node */}
                                <div className="relative w-48 h-48 md:w-56 md:h-56 rounded-full p-1.5 bg-gradient-to-br from-indigo-500/30 to-orange-500/30 backdrop-blur-sm border border-white/10 group-hover:border-white/30 transition-all duration-500 group-hover:scale-105 shadow-2xl">
                                    <div className="w-full h-full rounded-full overflow-hidden relative">
                                        <Image
                                            src={artist.image_url!}
                                            alt={artist.name}
                                            fill
                                            className="object-cover transition-transform duration-700 group-hover:scale-110 group-hover:rotate-2"
                                        />

                                        {/* Overlay Content on Hover */}
                                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-center p-4">
                                            <span className="text-orange-400 font-medium text-xs tracking-wider uppercase mb-1">
                                                {artist.category}
                                            </span>
                                            <div className="w-8 h-0.5 bg-white/30 mb-2" />
                                            <p className="text-white text-xs opacity-90">
                                                {artist.location}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Orbiting Satellite (Decorative) */}
                                    <div className="absolute -inset-2 border border-white/5 rounded-full animate-spin-slow pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-700">
                                        <div className="absolute top-[50%] -right-1 w-2 h-2 bg-white rounded-full shadow-[0_0_10px_white]" />
                                    </div>
                                </div>

                                {/* Label Below Node */}
                                <div className="mt-6 text-center transition-transform duration-300 group-hover:translate-y-2">
                                    <h3 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-400 transition-colors">
                                        {artist.name}
                                    </h3>
                                    {artist.is_verified && (
                                        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-[10px] font-bold uppercase tracking-wider">
                                            Verified Artist
                                        </div>
                                    )}
                                </div>
                            </Link>

                            {/* Connecting Line (Visual only, draws line to next item on large screens) */}
                            {index < featuredArtists.length - 1 && (index + 1) % 3 !== 0 && (
                                <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-[1px] bg-gradient-to-r from-transparent via-gray-800 to-transparent pointer-events-none" />
                            )}
                        </div>
                    ))}
                </div>

                {/* View All CTA */}
                <div className="text-center mt-32 relative z-10">
                    <Link
                        href="/search"
                        className="group inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/10 hover:border-indigo-500/50 rounded-full text-white font-medium transition-all duration-300 hover:shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)] hover:-translate-y-1"
                    >
                        <span>Explore the Galaxy</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
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
                @keyframes twinkle {
                    0%, 100% { opacity: 0.2; transform: scale(1); }
                    50% { opacity: 0.8; transform: scale(1.5); }
                }
                .animate-twinkle {
                    animation: twinkle 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
