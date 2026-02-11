'use client';

import { useState, useEffect, use } from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Clock, Calendar, ArrowLeft, Loader2, User } from 'lucide-react';

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

    useEffect(() => {
        async function fetchBlog() {
            setLoading(true);
            try {
                const response = await fetch(`http://127.0.0.1:8000/blogs/${slug}`);
                if (response.ok) {
                    const data = await response.json();
                    if (data.error) {
                        setBlog(null);
                    } else {
                        setBlog(data);
                        // Fetch related blogs
                        const relatedResponse = await fetch(`http://127.0.0.1:8000/blogs?category=${encodeURIComponent(data.category)}&limit=4`);
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
                <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
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
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Header */}
            <section className="relative py-12 border-b border-gray-800">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/blog"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span className="text-sm font-medium">Back to Blog</span>
                    </Link>

                    <div className="mb-6">
                        <span className="inline-block px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-600/20 text-orange-400 text-sm rounded-full border border-orange-500/30">
                            {blog.category}
                        </span>
                    </div>

                    <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 leading-tight">
                        {blog.title}
                    </h1>

                    <div className="flex flex-wrap items-center gap-6 text-gray-400">
                        <div className="flex items-center gap-2">
                            <User className="w-5 h-5" />
                            <span>{blog.author}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Calendar className="w-5 h-5" />
                            <span>{formatDate(blog.created_at)}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <Clock className="w-5 h-5" />
                            <span>{calculateReadTime(blog.content)}</span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Featured Image */}
            {blog.image_url && (
                <section className="py-8">
                    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="relative aspect-video rounded-3xl overflow-hidden border border-gray-800">
                            <Image
                                src={blog.image_url}
                                alt={blog.title}
                                fill
                                className="object-cover"
                            />
                        </div>
                    </div>
                </section>
            )}

            {/* Content */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="prose prose-invert prose-lg max-w-none">
                        <div 
                            className="text-gray-300 leading-relaxed space-y-6 text-lg"
                            dangerouslySetInnerHTML={{ __html: blog.content.replace(/\n/g, '<br />') }}
                        />
                    </div>
                </div>
            </section>

            {/* Related Posts */}
            {relatedBlogs.length > 0 && (
                <section className="py-16 border-t border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-3xl font-bold text-white mb-8">Related Articles</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {relatedBlogs.map((related) => (
                                <Link
                                    key={related.id}
                                    href={`/blog/${related.slug}`}
                                    className="group bg-[#1a1a1a] rounded-2xl border border-gray-800 hover:border-gray-700 overflow-hidden transition-all"
                                >
                                    {related.image_url && (
                                        <div className="relative h-48 overflow-hidden">
                                            <Image
                                                src={related.image_url}
                                                alt={related.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                        </div>
                                    )}
                                    <div className="p-6">
                                        <h3 className="text-lg font-bold text-white mb-2 group-hover:text-orange-400 transition-colors line-clamp-2">
                                            {related.title}
                                        </h3>
                                        <p className="text-gray-500 text-sm line-clamp-2">{related.excerpt}</p>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    </div>
                </section>
            )}
        </div>
    );
}

