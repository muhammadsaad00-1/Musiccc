'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Calendar, ArrowLeft, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { API_BASE_URL } from '@/lib/api';

interface BlogPost {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    image_url?: string;
    created_at: string;
    updated_at: string;
}

export default function BlogPage() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await fetch(`${API_BASE_URL}/blogs?limit=50`);
                if (response.ok) {
                    const data = await response.json();
                    setBlogs(data);
                }
            } catch (error) {
                console.error('Error fetching blogs:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchBlogs();
    }, []);

    const featuredPost = blogs[0];
    const otherPosts = blogs.slice(1);

    const calculateReadTime = (content: string) => {
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-center">
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Blog &
                            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"> Magazine</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Event planning tips, artist spotlights, and industry insights
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            {loading ? (
                <section className="py-8">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    </div>
                </section>
            ) : blogs.length === 0 ? (
                <section className="py-16">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                        <p className="text-gray-400 text-lg">No blog posts yet. Check back soon!</p>
                    </div>
                </section>
            ) : (
                <>
                    {/* Featured Post */}
                    {featuredPost && (
                        <section className="py-8">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <Link href={`/blog/${featuredPost.slug}`} className="group block">
                                    <div className="relative overflow-hidden rounded-3xl border border-gray-800 hover:border-gray-700 transition-all">
                                        <div className="grid lg:grid-cols-2 gap-0">
                                            <div className="relative h-64 lg:h-auto lg:min-h-[360px]">
                                                {featuredPost.image_url ? (
                                                    <Image
                                                        src={featuredPost.image_url}
                                                        alt={featuredPost.title}
                                                        fill
                                                        sizes="(max-width: 1024px) 100vw, 66vw"
                                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center">
                                                        <Calendar className="w-16 h-16 text-orange-400/50" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-8 lg:p-12 bg-[#1a1a1a] flex flex-col justify-center">
                                                <span className="inline-block px-3 py-1 bg-gradient-to-r from-orange-500/20 to-pink-600/20 text-orange-400 text-sm rounded-full w-fit mb-4 border border-orange-500/30">
                                                    Featured
                                                </span>
                                                <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors">
                                                    {featuredPost.title}
                                                </h2>
                                                <p className="text-gray-400 mb-6 line-clamp-3">{featuredPost.excerpt}</p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span className="flex items-center gap-1">
                                                        <Calendar className="w-4 h-4" />
                                                        {formatDate(featuredPost.created_at)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="w-4 h-4" />
                                                        {calculateReadTime(featuredPost.content)}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </Link>
                            </div>
                        </section>
                    )}

                    {/* All Posts Grid */}
                    {otherPosts.length > 0 && (
                        <section className="py-12">
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                                <div className="flex items-center gap-3 mb-10">
                                    <div className="h-px flex-1 bg-gray-800" />
                                    <h2 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">
                                        Latest Stories
                                    </h2>
                                    <div className="h-px flex-1 bg-gray-800" />
                                </div>

                                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                                    {otherPosts.map((post) => (
                                        <Link
                                            key={post.id}
                                            href={`/blog/${post.slug}`}
                                            className="group block"
                                        >
                                            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all hover:shadow-lg hover:shadow-orange-500/5">
                                                {/* Thumbnail */}
                                                <div className="relative h-48 overflow-hidden">
                                                    {post.image_url ? (
                                                        <Image
                                                            src={post.image_url}
                                                            alt={post.title}
                                                            fill
                                                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full bg-gradient-to-br from-orange-500/10 to-pink-600/10 flex items-center justify-center">
                                                            <Calendar className="w-10 h-10 text-orange-400/30" />
                                                        </div>
                                                    )}
                                                    {/* Category badge */}
                                                    {post.category && (
                                                        <div className="absolute top-3 left-3">
                                                            <span className="px-3 py-1 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold uppercase tracking-wider rounded-full border border-white/10">
                                                                {post.category}
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                {/* Content */}
                                                <div className="p-5">
                                                    <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug">
                                                        {post.title}
                                                    </h3>
                                                    <p className="text-gray-500 text-sm mb-4 line-clamp-2">
                                                        {post.excerpt}
                                                    </p>
                                                    <div className="flex items-center justify-between text-xs text-gray-600">
                                                        <span className="flex items-center gap-1">
                                                            <Calendar className="w-3 h-3" />
                                                            {formatDate(post.created_at)}
                                                        </span>
                                                        <span className="flex items-center gap-1">
                                                            <Clock className="w-3 h-3" />
                                                            {calculateReadTime(post.content)}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        </Link>
                                    ))}
                                </div>
                            </div>
                        </section>
                    )}
                </>
            )}

            {/* Newsletter CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-3xl border border-gray-800 p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Stay Updated</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Subscribe to our newsletter for the latest event planning tips and artist spotlights
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto">
                            <input
                                type="email"
                                placeholder="Enter your email"
                                className="flex-1 px-6 py-4 bg-[#0a0a0b] border border-gray-700 rounded-full text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                            <button className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                                Subscribe
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
