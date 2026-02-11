'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { ArrowRight, Star, Loader2 } from 'lucide-react';

interface Artist {
    id: number;
    name: string;
    slug: string;
    category: string;
    location: string;
    profile_image_url?: string;
    image_url?: string;
    price_range?: string;
    min_price?: number;
    max_price?: number;
    is_featured?: boolean;
    is_verified?: boolean;
}

export default function FeaturedArtists() {
    const [featuredArtists, setFeaturedArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    useEffect(() => {
        const fetchFeaturedArtists = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/performers?featured=true&limit=6');
                if (response.ok) {
                    const data = await response.json();
                    // Transform data if needed
                    const artists = (data.performers || data || []).map((artist: any) => ({
                        id: artist.id,
                        name: artist.name,
                        slug: artist.slug || artist.name.toLowerCase().replace(/\s+/g, '-'),
                        category: artist.category,
                        location: artist.locations?.[0] || artist.location || 'Pakistan',
                        image_url: artist.profile_image_url || artist.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=800',
                        price_range: artist.min_price && artist.max_price
                            ? `PKR ${(artist.min_price / 1000).toFixed(0)}K - ${(artist.max_price / 1000).toFixed(0)}K`
                            : 'Contact for Price',
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
            <section className="py-16 lg:py-24 bg-[#0a0a0b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <span className="ml-3 text-gray-400">Loading featured artists...</span>
                    </div>
                </div>
            </section>
        );
    }

    if (featuredArtists.length === 0) {
        return (
            <section className="py-16 lg:py-24 bg-[#0a0a0b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center py-16">
                        <h2 className="text-2xl font-bold text-white mb-4">Featured Artists Coming Soon</h2>
                        <p className="text-gray-400 mb-6">We're curating the best talent for you.</p>
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                        >
                            Browse All Artists
                            <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 lg:py-24 bg-[#0a0a0b] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">


                {/* Section Header */}
                <div className="flex flex-col items-center justify-center text-center mb-16 space-y-6">
                    <h2 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                        Unforgettable <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Performances Start Here</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Discover the exceptional talent that transforms ordinary events into extraordinary memories
                    </p>
                </div>

                {/* Artists Grid - All Circular Style */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6 gap-8">
                    {featuredArtists.map((artist) => (
                        <Link
                            key={artist.id}
                            href={`/artist/${artist.slug}`}
                            className="group text-center"
                            onMouseEnter={() => setHoveredId(artist.id)}
                            onMouseLeave={() => setHoveredId(null)}
                        >
                            {/* Circular Image with Glow */}
                            <div className="relative mx-auto mb-4">
                                {/* Glow Effect */}
                                <div className={`absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full blur-xl transition-opacity duration-300 ${hoveredId === artist.id ? 'opacity-50' : 'opacity-0'}`} />

                                {/* Image Container */}
                                <div className="relative w-28 h-28 sm:w-32 sm:h-32 lg:w-36 lg:h-36 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-orange-500 transition-all duration-300">
                                    <Image
                                        src={artist.image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'}
                                        alt={artist.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Verified Badge */}
                                {artist.is_verified && (
                                    <div className="absolute bottom-0 right-0 w-7 h-7 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center border-2 border-[#0a0a0b]">
                                        <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}

                                {/* Featured Badge */}
                                {artist.is_featured && (
                                    <div className="absolute -top-1 -left-1 w-7 h-7 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center border-2 border-[#0a0a0b]">
                                        <Star className="w-3.5 h-3.5 text-white fill-white" />
                                    </div>
                                )}
                            </div>

                            {/* Artist Info */}
                            <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors mb-1 truncate px-2">
                                {artist.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {artist.location}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Bottom Button */}
                <div className="flex justify-center mt-12">
                    <Link
                        href="/artists"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-full shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all"
                    >
                        Browse All Artists
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
