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
    image_url?: string;
}

export default function CategoryGrid() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/categories');
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
        return null; // Don't show anything if no categories
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
                            className="group relative bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-orange-500/50 transition-all duration-300 overflow-hidden min-h-[280px] flex flex-col justify-end"
                        >
                            {/* Background Image */}
                            {category.image_url ? (
                                <>
                                    <div className="absolute inset-0 z-0">
                                        <img
                                            src={category.image_url}
                                            alt={category.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 opacity-60 group-hover:opacity-40"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
                                    </div>
                                </>
                            ) : (
                                <div className="absolute inset-0 bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] z-0" />
                            )}

                            {/* HOT Badge */}
                            {isHot(category.name) && (
                                <div className="absolute top-3 right-3 z-20 px-2 py-0.5 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center gap-1">
                                    <Zap className="w-3 h-3" />
                                    HOT
                                </div>
                            )}

                            {/* Content */}
                            <div className="relative z-10 p-2">
                                {/* Icon fallback if no image, or smaller icon if image exists */}
                                {!category.image_url && (
                                    <div className="mb-4 text-orange-400 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {getIcon(category.name)}
                                    </div>
                                )}

                                {/* Name */}
                                <h3 className="font-bold text-xl text-white group-hover:text-orange-400 transition-colors mb-2">
                                    {category.name}
                                </h3>

                                {/* Description */}
                                {category.description && (
                                    <p className="text-xs text-gray-300 mb-3 line-clamp-2 opacity-80 group-hover:opacity-100 transition-opacity">
                                        {category.description}
                                    </p>
                                )}

                                {/* Count */}
                                <div className="flex items-center gap-2 text-xs font-medium text-gray-400 group-hover:text-white transition-colors">
                                    <Users className="w-3 h-3" />
                                    <span>{category.artist_count}+ Artists</span>
                                </div>
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
