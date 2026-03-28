'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Loader2, ArrowLeft, Sparkles, Music, Star, Mic2, Disc3, Heart, Users } from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { API_BASE_URL } from '@/lib/api';
import EventBannerCarousel from '@/components/home/EventBannerCarousel';

const categoryIcons: Record<string, any> = {
    'Singers': <Mic2 className="w-8 h-8" />,
    'Singer': <Mic2 className="w-8 h-8" />,
    'Qawwals': <Music className="w-8 h-8" />,
    'Qawwal': <Music className="w-8 h-8" />,
    'Live Bands': <Users className="w-8 h-8" />,
    'Band': <Users className="w-8 h-8" />,
    'Bhangra Artists': <Star className="w-8 h-8" />,
    'DJs': <Disc3 className="w-8 h-8" />,
    'DJ': <Disc3 className="w-8 h-8" />,
    'Musicians': <Music className="w-8 h-8" />,
    'Musician': <Music className="w-8 h-8" />,
    'Comedians': <Star className="w-8 h-8" />,
    'Comedian': <Star className="w-8 h-8" />,
    'Photographers': <Heart className="w-8 h-8" />,
    'Sufi': <Sparkles className="w-8 h-8" />,
};

export default function CategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories`);
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

    // Pagination logic
    const totalPages = Math.ceil(categories.length / itemsPerPage);
    const paginatedCategories = categories.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 300, behavior: 'smooth' });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] py-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-12 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back to Home
                </Link>

                {/* Header */}
                <div className="text-center mb-20">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-sm font-medium mb-6">
                        <Sparkles className="w-4 h-4" />
                        <span>Our Talent Ecosystem</span>
                    </div>
                    <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">Categories</span>
                    </h1>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Browse through our curated list of professional performers for every type of event.
                    </p>
                </div>

                <div className="mb-16 -mt-8">
                    <EventBannerCarousel />
                </div>

                {/* Categories Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {paginatedCategories.map((category) => (
                        <Link
                            key={category.id}
                            href={`/artists/${category.slug}`}
                            className="group relative bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-800 hover:border-orange-500/40 transition-all duration-500 transform hover:-translate-y-2"
                        >
                            {/* ... Category Card Content ... */}
                            <div className="relative aspect-[16/10] overflow-hidden">
                                {category.image_url ? (
                                    <Image
                                        src={category.image_url}
                                        alt={category.name}
                                        fill
                                        className="object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-[#2a2a2a] to-[#111] flex items-center justify-center">
                                        <div className="text-orange-500/30">
                                            {categoryIcons[category.name] || <Music className="w-12 h-12" />}
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/20 to-transparent" />
                            </div>

                            <div className="p-6 relative">
                                <div className="absolute -top-10 left-6 p-3 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl shadow-xl text-white transform group-hover:scale-110 transition-transform duration-300">
                                    {categoryIcons[category.name] || <Music className="w-6 h-6" />}
                                </div>
                                <h3 className="text-xl font-bold text-white mt-2 mb-2 group-hover:text-orange-400 transition-colors">
                                    {category.name}
                                </h3>
                                <p className="text-gray-500 text-sm line-clamp-2">
                                    {category.description || `Meet the best ${category.name.toLowerCase()} in Pakistan.`}
                                </p>
                                <div className="mt-4 flex items-center justify-between">
                                    <span className="text-xs font-semibold text-gray-400 bg-gray-800 px-2 py-1 rounded-md">
                                        {category.artist_count || 0} Artists
                                    </span>
                                    <span className="text-orange-400 text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                                        Explore →
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>

                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />
            </div>
        </div>
    );
}
