'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, ArrowRight, Calendar } from 'lucide-react';
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
}

export default function HomeBlogSection() {
    const [blogs, setBlogs] = useState<BlogPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchBlogs() {
            try {
                const response = await fetch(`${API_BASE_URL}/blogs?limit=4`);
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

    const calculateReadTime = (content: string) => {
        const words = content.split(/\s+/).length;
        return `${Math.ceil(words / 200)} min read`;
    };

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    // Don't render if no blogs
    if (loading || blogs.length === 0) return null;

    const featured = blogs[0];
    const rest = blogs.slice(1, 4);

    return (
        <section className="w-full bg-[#0a0a0b] py-20 relative overflow-hidden">
            {/* Background glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <p className="text-xs font-bold uppercase tracking-[0.25em] text-orange-400 mb-3">
                        Blog & Magazine
                    </p>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white">
                        Latest{' '}
                        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                            Stories
                        </span>
                    </h2>
                    <p className="text-gray-500 mt-4 max-w-lg mx-auto">
                        Event planning tips, artist spotlights, and entertainment industry insights
                    </p>
                </div>

                {/* Blog Grid: Featured + Side cards */}
                <div className="grid lg:grid-cols-2 gap-6">
                    {/* Featured Post */}
                    <Link href={`/blog/${featured.slug}`} className="group block">
                        <div className="relative h-full min-h-[380px] rounded-2xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all">
                            {/* Image */}
                            <div className="absolute inset-0">
                                {featured.image_url ? (
                                    <Image
                                        src={featured.image_url}
                                        alt={featured.title}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-orange-500/20 to-pink-600/20" />
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
                            </div>

                            {/* Content overlay */}
                            <div className="relative z-10 flex flex-col justify-end h-full p-7">
                                {featured.category && (
                                    <span className="inline-block px-3 py-1 bg-orange-500/20 backdrop-blur-sm text-orange-300 text-[10px] font-bold uppercase tracking-wider rounded-full w-fit mb-3 border border-orange-500/20">
                                        {featured.category}
                                    </span>
                                )}
                                <h3 className="text-xl sm:text-2xl font-bold text-white mb-2 group-hover:text-orange-300 transition-colors leading-snug line-clamp-2">
                                    {featured.title}
                                </h3>
                                <p className="text-gray-400 text-sm line-clamp-2 mb-4 max-w-md">
                                    {featured.excerpt}
                                </p>
                                <div className="flex items-center gap-4 text-xs text-gray-500">
                                    <span className="flex items-center gap-1">
                                        <Calendar className="w-3 h-3" />
                                        {formatDate(featured.created_at)}
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {calculateReadTime(featured.content)}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </Link>

                    {/* Side Cards */}
                    <div className="flex flex-col gap-4">
                        {rest.map((post) => (
                            <Link key={post.id} href={`/blog/${post.slug}`} className="group block flex-1">
                                <div className="h-full bg-[#131315] rounded-2xl border border-gray-800 hover:border-gray-700 transition-all overflow-hidden flex flex-row">
                                    {/* Thumbnail */}
                                    <div className="relative w-28 sm:w-36 shrink-0">
                                        {post.image_url ? (
                                            <Image
                                                src={post.image_url}
                                                alt={post.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        ) : (
                                            <div className="w-full h-full bg-gradient-to-br from-orange-500/10 to-pink-600/10 flex items-center justify-center">
                                                <Calendar className="w-6 h-6 text-orange-400/30" />
                                            </div>
                                        )}
                                    </div>
                                    {/* Text */}
                                    <div className="p-4 flex flex-col justify-center flex-1 min-w-0">
                                        {post.category && (
                                            <span className="text-[10px] font-bold uppercase tracking-wider text-orange-400/70 mb-1">
                                                {post.category}
                                            </span>
                                        )}
                                        <h4 className="text-sm sm:text-base font-semibold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-snug mb-1.5">
                                            {post.title}
                                        </h4>
                                        <div className="flex items-center gap-3 text-[11px] text-gray-600">
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

                {/* View All Button */}
                <div className="text-center mt-10">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 px-7 py-3 bg-[#1a1a1a] border border-gray-700 text-white font-semibold rounded-full hover:border-orange-500/40 hover:bg-[#222] transition-all group"
                    >
                        View All Posts
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
