'use client';

import { useState, useEffect, JSX } from 'react';
import Link from 'next/link';
import { Mic2, Music, Disc3, Sparkles, Users, Star, Heart, Zap, Loader2 } from 'lucide-react';

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
}

export default function CategoryGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://localhost:8000/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data.categories || data || []);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    const getIcon = (name: string) => {
        return iconMap[name] || <Music className="w-8 h-8" />;
    };

    const isHot = (name: string) => {
        return hotCategories.some(hot => name.toLowerCase().includes(hot.toLowerCase()));
    };

    if (loading) {
        return (
            <section className="py-16 lg:py-24 bg-[#0a0a0b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-center py-16">
                        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
                        <span className="ml-3 text-gray-400">Loading categories...</span>
                    </div>
                </div>
            </section>
        );
    }

    if (categories.length === 0) {
        // Fallback to static categories if API fails
        return (
            <section className="py-16 lg:py-24 bg-[#0a0a0b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Find Your Perfect
                            <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"> Musical Artist</span>
                        </h2>
                        <p className="text-lg text-gray-400">Browse our artist categories</p>
                    </div>
                    <div className="text-center">
                        <Link
                            href="/search"
                            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full"
                        >
                            Browse All Artists
                        </Link>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section className="py-16 lg:py-24 bg-[#0a0a0b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full text-gray-400 text-sm mb-4 border border-gray-800">
                        <Mic2 className="w-4 h-4 text-orange-400" />
                        <span>Top Categories</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Explore
                        <span className="bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent"> Categories</span>
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Book talented singers, qawwals, and musicians for weddings, concerts, and celebrations across Pakistan
                    </p>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 lg:gap-6">
                    {categories.slice(0, 8).map((category) => (
                        <Link
                            key={category.id}
                            href={`/artists/${category.slug || category.name.toLowerCase()}`}
                            className="group relative bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 overflow-hidden"
                        >
                            {/* HOT Badge */}
                            {isHot(category.name) && (
                                <div className="absolute top-3 right-3 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    HOT
                                </div>
                            )}

                            {/* Hover Gradient Background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 to-pink-600/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                            {/* Content */}
                            <div className="relative z-10">
                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center text-orange-400 mb-4 group-hover:from-orange-500 group-hover:to-pink-600 group-hover:text-white transition-all duration-300">
                                    {getIcon(category.name)}
                                </div>

                                {/* Name */}
                                <h3 className="font-bold text-lg text-white group-hover:text-orange-400 transition-colors mb-1">
                                    {category.name}
                                </h3>

                                {/* Description */}
                                {category.description && (
                                    <p className="text-xs text-gray-500 mb-2 line-clamp-1">
                                        {category.description}
                                    </p>
                                )}

                                {/* Count */}
                                <p className="text-sm text-gray-400">
                                    {category.artist_count}+ Artists
                                </p>
                            </div>
                        </Link>
                    ))}
                </div>

                {/* View All Link */}
                <div className="text-center mt-10">
                    <Link
                        href="/search"
                        className="inline-flex items-center gap-2 text-orange-400 hover:text-orange-300 font-medium transition-colors"
                    >
                        View All Categories
                        <span className="text-lg">→</span>
                    </Link>
                </div>
            </div>
        </section>
    );
}
