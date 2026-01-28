'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState } from 'react';
import { ArrowRight, Play, Star, MapPin } from 'lucide-react';
import { mockArtists } from '@/lib/mockData';

export default function FeaturedArtists() {
    const featuredArtists = mockArtists.filter(artist => artist.is_featured);
    const [hoveredId, setHoveredId] = useState<number | null>(null);

    return (
        <section className="py-16 lg:py-24 bg-[#0a0a0b] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-12">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm mb-4 border border-orange-500/30">
                            <Star className="w-4 h-4" />
                            <span>StarClinch Verified</span>
                        </div>
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                            Famous Artists
                        </h2>
                        <p className="text-lg text-gray-400">
                            Book top celebrities and performers for your special events
                        </p>
                    </div>
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium group"
                    >
                        View All Artists
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>

                {/* Featured Artist Showcase - Large Card */}
                {featuredArtists.length > 0 && (
                    <div className="mb-12">
                        <div className="relative group rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-500">
                            {/* Large Hero Image */}
                            <div className="relative h-[400px] lg:h-[500px]">
                                <Image
                                    src={featuredArtists[0].image_url}
                                    alt={featuredArtists[0].name}
                                    fill
                                    className="object-cover group-hover:scale-105 transition-transform duration-700"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/50 to-transparent" />

                                {/* Play Button */}
                                <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-20 h-20 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 shadow-2xl shadow-pink-500/30">
                                    <Play className="w-8 h-8 text-white ml-1" />
                                </button>
                            </div>

                            {/* Content Overlay */}
                            <div className="absolute bottom-0 left-0 right-0 p-8 lg:p-12">
                                <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6">
                                    <div>
                                        <div className="flex items-center gap-3 mb-3">
                                            <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-semibold rounded-full">
                                                Featured
                                            </span>
                                            <span className="px-3 py-1 bg-green-500/20 text-green-400 text-sm font-semibold rounded-full border border-green-500/30">
                                                Verified
                                            </span>
                                        </div>
                                        <h3 className="text-3xl lg:text-4xl font-bold text-white mb-2">
                                            {featuredArtists[0].name}
                                        </h3>
                                        <div className="flex items-center gap-4 text-gray-400">
                                            <span className="flex items-center gap-1">
                                                <MapPin className="w-4 h-4" />
                                                {featuredArtists[0].location}
                                            </span>
                                            <span>{featuredArtists[0].price_range}</span>
                                        </div>
                                    </div>
                                    <Link
                                        href={`/artist/${featuredArtists[0].slug}`}
                                        className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all whitespace-nowrap"
                                    >
                                        See Price & Book
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Artists Grid - Unique Circular Style */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                    {featuredArtists.slice(1, 6).map((artist) => (
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
                                <div className="relative w-32 h-32 lg:w-40 lg:h-40 rounded-full overflow-hidden border-2 border-gray-800 group-hover:border-orange-500 transition-all duration-300">
                                    <Image
                                        src={artist.image_url}
                                        alt={artist.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-500"
                                    />
                                </div>

                                {/* Verified Badge */}
                                {artist.is_verified && (
                                    <div className="absolute bottom-1 right-1 w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center border-2 border-[#0a0a0b]">
                                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                    </div>
                                )}
                            </div>

                            {/* Artist Info */}
                            <h3 className="font-semibold text-white group-hover:text-orange-400 transition-colors mb-1">
                                {artist.name}
                            </h3>
                            <p className="text-sm text-gray-500">
                                {artist.location}
                            </p>
                        </Link>
                    ))}
                </div>

                {/* Bottom CTA */}
                <div className="mt-12 text-center">
                    <p className="text-gray-500 mb-4">Looking for a specific artist?</p>
                    <Link
                        href="/post-requirement"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-[#1a1a1a] text-white font-semibold rounded-full border border-gray-700 hover:border-orange-500 hover:bg-[#2a2a2a] transition-all"
                    >
                        Post Your Requirement
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
