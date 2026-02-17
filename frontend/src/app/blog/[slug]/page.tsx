'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowLeft, Loader2, User, Share2, Facebook, Twitter, Link as LinkIcon, Instagram } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface BlogPageProps {
    params: Promise<{ slug: string }>;
}

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

export default function BlogDetailPage({ params }: BlogPageProps) {
    const { slug } = use(params);
    const [blog, setBlog] = useState<BlogPost | null>(null);
    const [loading, setLoading] = useState(true);
    const [relatedBlogs, setRelatedBlogs] = useState<BlogPost[]>([]);
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 100);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        async function fetchBlog() {
            setLoading(true);
            try {
                const response = await fetch(`${API_BASE_URL}/blogs/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.error) {
                        setBlog(null);
                    } else {
                        setBlog(data);
                        // Fetch related blogs
                        const relatedResponse = await fetch(`${API_BASE_URL}/blogs?category=${encodeURIComponent(data.category)}&limit=4`);
                        if (relatedResponse.ok) {
                            const related = await relatedResponse.json();
                            setRelatedBlogs(related.filter((b: BlogPost) => b.id !== data.id).slice(0, 3));
                        }
                    }
                } else {
                    setBlog(null);
                }
            } catch (error) {
                console.error('Error fetching blog:', error);
                setBlog(null);
            } finally {
                setLoading(false);
            }
        }
        fetchBlog();
    }, [slug]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <div className="relative">
                    <div className="w-20 h-20 border-2 border-orange-500/20 rounded-full animate-[spin_3s_linear_infinite]" />
                    <div className="absolute inset-0 w-20 h-20 border-t-2 border-orange-500 rounded-full animate-spin" />
                    <Loader2 className="absolute inset-0 m-auto w-8 h-8 text-orange-500 animate-pulse" />
                </div>
            </div>
        );
    }

    if (!blog) {
        notFound();
    }

    const formatDate = (dateString: string) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    const calculateReadTime = (content: string) => {
        const words = content.split(/\s+/).length;
        const minutes = Math.ceil(words / 200);
        return `${minutes} min read`;
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] selection:bg-orange-500/30">
            {/* Reading Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1 z-50">
                <div
                    className="h-full bg-gradient-to-r from-orange-500 via-pink-500 to-orange-500"
                    style={{
                        width: '0%', // This would ideally be calculated based on scroll
                        boxShadow: '0 0 10px rgba(249, 115, 22, 0.5)'
                    }}
                />
            </div>

            {/* Back Button - Floating */}
            <div className={`fixed top-8 left-8 z-40 transition-all duration-300 ${scrolled ? 'opacity-100' : 'opacity-100 sm:opacity-0'}`}>
                <Link
                    href="/blog"
                    className="flex items-center gap-2 p-2 pr-4 bg-[#1a1a1a]/80 backdrop-blur-md border border-gray-800 rounded-full text-white hover:border-orange-500/50 transition-all group"
                >
                    <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                        <ArrowLeft className="w-4 h-4" />
                    </div>
                    <span className="text-sm font-medium">Back</span>
                </Link>
            </div>

            {/* Hero Section - Artistic Layout */}
            <section className="relative min-h-[80vh] flex items-end pb-20 pt-32 overflow-hidden">
                {/* Parallax Background */}
                <div className="absolute inset-0 z-0">
                    <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0b]/20 via-[#0a0a0b]/60 to-[#0a0a0b] z-10" />
                    {blog.image_url ? (
                        <Image
                            src={blog.image_url}
                            alt={blog.title}
                            fill
                            className="object-cover scale-105"
                            priority
                        />
                    ) : (
                        <div className="w-full h-full bg-gradient-to-br from-gray-900 to-black" />
                    )}
                    {/* Animated Glow Elements */}
                    <div className="absolute top-1/4 -left-20 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px] animate-pulse" />
                    <div className="absolute bottom-1/4 -right-20 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px] animate-pulse" />
                </div>

                <div className="relative z-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                    <div className="max-w-4xl">
                        <div className="flex flex-wrap items-center gap-3 mb-8">
                            <span className="px-5 py-2 bg-white/10 backdrop-blur-md border border-white/20 text-white text-xs font-bold tracking-widest uppercase rounded-full">
                                {blog.category}
                            </span>
                            <div className="h-px w-12 bg-gray-600" />
                            <span className="text-gray-400 text-sm">{calculateReadTime(blog.content)}</span>
                        </div>

                        <h1 className="text-5xl sm:text-7xl lg:text-8xl font-black text-white mb-10 leading-[1.1] tracking-tight">
                            {blog.title.split(' ').map((word, i) => (
                                <span key={i} className="inline-block mr-[0.2em]">
                                    {word}
                                </span>
                            ))}
                        </h1>

                        <div className="flex flex-wrap items-center gap-8 py-8 border-t border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-gray-800 to-gray-900 rounded-full border border-gray-700 flex items-center justify-center overflow-hidden">
                                    <User className="w-6 h-6 text-gray-500" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-tighter">Written by</p>
                                    <p className="font-bold text-white tracking-wide">{blog.author}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-white/5 rounded-full flex items-center justify-center border border-white/10">
                                    <Calendar className="w-5 h-5 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 uppercase tracking-tighter">Published on</p>
                                    <p className="font-bold text-white tracking-wide">{formatDate(blog.created_at)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Content Area */}
            <section className="relative pb-32">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-16">
                        {/* Sidebar - Floating Socials */}
                        <div className="lg:w-20 lg:sticky lg:top-32 h-fit flex lg:flex-col gap-4 border-b lg:border-b-0 lg:border-r border-gray-800/50 pb-8 lg:pb-0 lg:pr-8">
                            <button className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-orange-500 hover:border-orange-500/50 transition-all group">
                                <Share2 className="w-5 h-5 group-active:scale-90 transition-transform" />
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-[#1877F2] hover:border-[#1877F2]/50 transition-all">
                                <Facebook className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-[#1DA1F2] hover:border-[#1DA1F2]/50 transition-all">
                                <Twitter className="w-5 h-5" />
                            </button>
                            <button className="w-12 h-12 rounded-2xl bg-[#1a1a1a] border border-gray-800 flex items-center justify-center text-gray-500 hover:text-[#E4405F] hover:border-[#E4405F]/50 transition-all">
                                <Instagram className="w-5 h-5" />
                            </button>
                        </div>

                        {/* Article Text */}
                        <div className="flex-1 lg:max-w-3xl">
                            {/* Excerpt/Intro */}
                            <div className="mb-16 p-8 sm:p-12 bg-gradient-to-br from-[#1a1a1a] to-[#0d0d0e] rounded-3xl border border-gray-800 relative overflow-hidden group">
                                <div className="absolute top-0 right-0 p-4 opacity-5">
                                    <Clock className="w-32 h-32" />
                                </div>
                                <p className="text-2xl sm:text-3xl font-medium text-gray-200 leading-snug italic relative z-10">
                                    "{blog.excerpt}"
                                </p>
                            </div>

                            {/* Content Body */}
                            <div className="prose prose-invert prose-2xl max-w-none">
                                <div
                                    className="text-gray-300 leading-[1.8] space-y-10 text-xl font-light"
                                    dangerouslySetInnerHTML={{
                                        __html: blog.content
                                            .replace(/\n\n/g, '</div><div class="mb-10">')
                                            .replace(/\n/g, '<br />')
                                    }}
                                />
                            </div>

                            {/* Tags or Footer Info */}
                            <div className="mt-20 pt-10 border-t border-gray-800 flex flex-wrap gap-4">
                                {['Entertainment', 'Arts', blog.category, 'Culture'].map(tag => (
                                    <span key={tag} className="px-4 py-2 bg-[#1a1a1a] border border-gray-800 rounded-lg text-sm text-gray-500 hover:text-white transition-colors cursor-pointer">
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>

                        {/* Right Sidebar - Trending/Related Blogs */}
                        <div className="lg:w-80 lg:sticky lg:top-32 h-fit space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="h-px flex-1 bg-gray-800" />
                                <h2 className="text-xs font-black uppercase tracking-[0.2em] text-orange-500">Trending Stories</h2>
                                <div className="h-px w-8 bg-gray-800" />
                            </div>

                            <div className="space-y-6">
                                {relatedBlogs.slice(0, 3).map((item) => (
                                    <Link
                                        key={item.id}
                                        href={`/blog/${item.slug}`}
                                        className="group block space-y-3"
                                    >
                                        {item.image_url && (
                                            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-gray-800">
                                                <Image
                                                    src={item.image_url}
                                                    alt={item.title}
                                                    fill
                                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                />
                                            </div>
                                        )}
                                        <div>
                                            <span className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1 block">
                                                {item.category}
                                            </span>
                                            <h3 className="text-sm font-bold text-white group-hover:text-orange-400 transition-colors line-clamp-2 leading-tight">
                                                {item.title}
                                            </h3>
                                        </div>
                                    </Link>
                                ))}
                            </div>

                            {/* Mini Newsletter Sidebar */}
                            <div className="p-6 bg-gradient-to-br from-orange-500/10 to-pink-600/10 rounded-3xl border border-orange-500/20">
                                <h4 className="text-white font-bold mb-2">Artistic Insights</h4>
                                <p className="text-gray-500 text-xs mb-4">Get the latest trends delivered to your inbox.</p>
                                <div className="flex gap-2">
                                    <input
                                        type="email"
                                        placeholder="Email"
                                        className="flex-1 bg-black/40 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-orange-500/50"
                                    />
                                    <button className="p-2 bg-orange-500 rounded-xl hover:bg-orange-600 transition-colors">
                                        <ArrowLeft className="w-4 h-4 rotate-180" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Related Posts - Creative Grid */}
            {relatedBlogs.length > 0 && (
                <section className="py-32 bg-gradient-to-b from-transparent to-[#0d0d0e]">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between mb-16">
                            <div>
                                <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">More from the <span className="text-orange-500">Factory</span></h2>
                                <p className="text-gray-500">Dive deeper into our creative collective</p>
                            </div>
                            <Link href="/blog" className="hidden sm:flex items-center gap-2 text-white font-bold hover:text-orange-500 transition-colors group">
                                View all stories
                                <ArrowLeft className="w-5 h-5 rotate-180 group-hover:translate-x-1 transition-transform" />
                            </Link>
                        </div>

                        <div className="grid md:grid-cols-3 gap-10">
                            {relatedBlogs.map((related, i) => (
                                <Link
                                    key={related.id}
                                    href={`/blog/${related.slug}`}
                                    className={`group relative h-[500px] rounded-[2.5rem] overflow-hidden border border-gray-800 transition-all hover:border-orange-500/30 ${i === 1 ? 'md:-translate-y-8' : ''}`}
                                >
                                    {related.image_url ? (
                                        <Image
                                            src={related.image_url}
                                            alt={related.title}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-1000 grayscale group-hover:grayscale-0"
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gray-900" />
                                    )}
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent z-10" />

                                    <div className="absolute inset-x-0 bottom-0 p-8 z-20">
                                        <span className="inline-block px-3 py-1 bg-orange-500 text-white text-[10px] font-bold uppercase tracking-wider rounded-md mb-4">
                                            {related.category}
                                        </span>
                                        <h3 className="text-2xl font-bold text-white mb-4 group-hover:text-orange-400 transition-colors line-clamp-3 leading-tight">
                                            {related.title}
                                        </h3>
                                        <div className="flex items-center gap-2 text-gray-400 text-xs font-medium">
                                            <Calendar className="w-3 h-3" />
                                            <span>{formatDate(related.created_at)}</span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Newsletter/Call to Action */}
            <section className="py-20 px-4">
                <div className="max-w-5xl mx-auto rounded-[3rem] p-12 sm:p-20 relative overflow-hidden bg-gradient-to-r from-orange-600 to-pink-700 text-center">
                    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-20 pointer-events-none" />
                    <h2 className="text-4xl sm:text-6xl font-black text-white mb-8 relative z-10">Don't miss a <span className="italic">beat</span>.</h2>
                    <p className="text-white/80 text-lg mb-12 max-w-2xl mx-auto relative z-10">Subscribe to our newsletter for exclusive artist interviews, event tips, and behind-the-scenes content.</p>
                    <div className="max-w-md mx-auto relative z-10 flex gap-4">
                        <input
                            type="email"
                            placeholder="your@email.com"
                            className="flex-1 px-6 py-4 bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl text-white placeholder-white/50 focus:outline-none focus:ring-2 focus:ring-white/50"
                        />
                        <button className="px-8 py-4 bg-white text-orange-600 font-bold rounded-2xl hover:scale-105 transition-transform">Join</button>
                    </div>
                </div>
            </section>
        </div>
    );
}

