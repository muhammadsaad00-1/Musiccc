'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Play, Eye, Clock, Filter, ArrowRight } from 'lucide-react';
import { videoShowcases } from '@/lib/mockData';

export default function VideosPage() {
    const [activeCategory, setActiveCategory] = useState('All');
    const categories = ['All', 'Wedding', 'Corporate', 'Birthday', 'Mehendi'];

    const filteredVideos = activeCategory === 'All'
        ? videoShowcases
        : videoShowcases.filter((v) => v.category === activeCategory);

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full text-gray-300 text-sm mb-6 border border-gray-800">
                        <Play className="w-4 h-4 text-orange-400" />
                        <span>See Artists in Action</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Video
                        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"> Showcases</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Watch highlight reels and performances from our talented artists
                    </p>
                </div>
            </section>

            {/* Category Filters */}
            <section className="py-6 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-4 overflow-x-auto pb-2">
                        <Filter className="w-5 h-5 text-gray-500 flex-shrink-0" />
                        {categories.map((category) => (
                            <button
                                key={category}
                                onClick={() => setActiveCategory(category)}
                                className={`px-6 py-2 rounded-full font-medium transition-all whitespace-nowrap ${activeCategory === category
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                                        : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-800'
                                    }`}
                            >
                                {category}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Videos Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {filteredVideos.map((video) => (
                            <div
                                key={video.id}
                                className="group bg-[#1a1a1a] rounded-2xl border border-gray-800 hover:border-gray-700 overflow-hidden transition-all"
                            >
                                {/* Thumbnail */}
                                <div className="relative aspect-video overflow-hidden">
                                    <Image
                                        src={video.thumbnail}
                                        alt={video.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                                    />

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center transform scale-90 group-hover:scale-100 transition-transform">
                                            <Play className="w-7 h-7 text-white ml-1" />
                                        </div>
                                    </div>

                                    {/* Duration */}
                                    <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                        {video.duration}
                                    </div>

                                    {/* Category */}
                                    <div className="absolute top-3 left-3 px-3 py-1 bg-black/70 backdrop-blur-sm text-gray-300 text-xs rounded-full">
                                        {video.category}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-5">
                                    <h3 className="font-bold text-white mb-1 group-hover:text-orange-400 transition-colors">
                                        {video.title}
                                    </h3>
                                    <p className="text-sm text-gray-500 mb-3">{video.artist}</p>
                                    <div className="flex items-center gap-3 text-sm text-gray-500">
                                        <span className="flex items-center gap-1">
                                            <Eye className="w-4 h-4" />
                                            {video.views} views
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {filteredVideos.length === 0 && (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-gray-800">
                            <p className="text-gray-400">No videos found for this category</p>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Want to See More?</h2>
                    <p className="text-gray-400 mb-8">Browse our artist profiles for full portfolios and videos</p>
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        Browse Artists
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
