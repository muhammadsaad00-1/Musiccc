'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, ArrowLeft, Edit2, Trash2, Loader2, X, Upload, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface Blog {
    id: string;
    title: string;
    slug: string;
    excerpt: string;
    content: string;
    category: string;
    author: string;
    image_url?: string;
    is_published: boolean;
    created_at: string;
    updated_at: string;
}

export default function ManageBlogsPage() {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
    const [formData, setFormData] = useState({
        title: '',
        slug: '',
        excerpt: '',
        content: '',
        category: '',
        author: 'Artist Factory Team',
        image: null as File | null,
        is_published: false,
    });

    const fetchBlogs = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/blogs?limit=100`);
            if (!response.ok) throw new Error('Failed to fetch blogs');
            const data = await response.json();
            setBlogs(data);
        } catch (err) {
            console.error('Error fetching blogs:', err);
            setError('Failed to load blogs');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this blog post?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/blogs/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setBlogs(blogs.filter((b) => b.id !== id));
            } else {
                alert('Failed to delete blog post');
            }
        } catch (error) {
            console.error('Error deleting blog:', error);
            alert('Error deleting blog post');
        }
    };

    const handleEdit = (blog: Blog) => {
        setEditingBlog(blog);
        setFormData({
            title: blog.title,
            slug: blog.slug,
            excerpt: blog.excerpt || '',
            content: blog.content,
            category: blog.category || '',
            author: blog.author || 'Artist Factory Team',
            image: null,
            is_published: blog.is_published,
        });
        setIsModalOpen(true);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.title || !formData.content) return;

        try {
            setIsSubmitting(true);
            const data = new FormData();
            data.append('title', formData.title);
            if (formData.slug) data.append('slug', formData.slug);
            data.append('excerpt', formData.excerpt);
            data.append('content', formData.content);
            data.append('category', formData.category || 'General');
            data.append('author', formData.author);
            data.append('is_published', String(formData.is_published));
            if (formData.image) {
                data.append('image', formData.image);
            }

            const url = editingBlog
                ? `${API_BASE_URL}/admin/blogs/${editingBlog.id}`
                : `${API_BASE_URL}/admin/blogs`;
            const method = editingBlog ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: data,
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    await fetchBlogs();
                    setFormData({
                        title: '',
                        slug: '',
                        excerpt: '',
                        content: '',
                        category: '',
                        author: 'Artist Factory Team',
                        image: null,
                        is_published: false,
                    });
                    setEditingBlog(null);
                    setIsModalOpen(false);
                } else {
                    alert('Failed to save blog: ' + result.message);
                }
            } else {
                alert('Failed to save blog post');
            }
        } catch (error) {
            console.error('Error saving blog:', error);
            alert('Error saving blog post');
        } finally {
            setIsSubmitting(false);
        }
    };

    const categories = [
        'Music Festivals',
        'Events',
        'Wedding Tips',
        'Event Planning',
        'Mehendi',
        'Booking Guide',
        'General',
    ];

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <Link href="/admin" className="text-gray-400 hover:text-white">
                                <ArrowLeft className="w-5 h-5" />
                            </Link>
                            <h1 className="text-2xl font-bold text-white">Manage Blog Posts</h1>
                        </div>
                        <button
                            onClick={() => {
                                setEditingBlog(null);
                                setFormData({
                                    title: '',
                                    slug: '',
                                    excerpt: '',
                                    content: '',
                                    category: '',
                                    author: 'Artist Factory Team',
                                    image: null,
                                    is_published: false,
                                });
                                setIsModalOpen(true);
                            }}
                            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add Blog Post
                        </button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20">
                        <p className="text-red-400">{error}</p>
                    </div>
                ) : blogs.length === 0 ? (
                    <div className="text-center py-20">
                        <p className="text-gray-400 mb-4">No blog posts yet</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg transition-all"
                        >
                            Create First Post
                        </button>
                    </div>
                ) : (
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {blogs.map((blog) => (
                            <div key={blog.id} className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden group hover:border-orange-500/50 transition-all">
                                {blog.image_url && (
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={blog.image_url}
                                            alt={blog.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                        />
                                    </div>
                                )}
                                <div className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <span className="px-2 py-1 bg-orange-500/20 text-orange-400 text-xs rounded-full">
                                            {blog.category}
                                        </span>
                                        {blog.is_published ? (
                                            <Eye className="w-4 h-4 text-green-400" />
                                        ) : (
                                            <EyeOff className="w-4 h-4 text-gray-500" />
                                        )}
                                    </div>
                                    <h3 className="text-lg font-bold text-white mb-2 line-clamp-2">{blog.title}</h3>
                                    <p className="text-gray-400 text-sm mb-4 line-clamp-2">{blog.excerpt}</p>
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>{blog.author}</span>
                                        <span>{new Date(blog.created_at).toLocaleDateString()}</span>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(blog)}
                                            className="flex-1 px-4 py-2 bg-[#0a0a0b] border border-gray-700 text-white rounded-lg hover:border-orange-500 transition-colors"
                                        >
                                            <Edit2 className="w-4 h-4 inline mr-2" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(blog.id)}
                                            className="px-4 py-2 bg-red-500/20 border border-red-500/30 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>

            {/* Add/Edit Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] flex flex-col">
                        <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
                            <h2 className="text-xl font-bold text-white">
                                {editingBlog ? 'Edit Blog Post' : 'Add New Blog Post'}
                            </h2>
                            <button
                                onClick={() => {
                                    setIsModalOpen(false);
                                    setEditingBlog(null);
                                }}
                                className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                    Title <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Slug (optional)</label>
                                <input
                                    type="text"
                                    value={formData.slug}
                                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                                    placeholder="Auto-generated from title"
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Category</label>
                                <select
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                                >
                                    {categories.map((cat) => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Excerpt</label>
                                <textarea
                                    value={formData.excerpt}
                                    onChange={(e) => setFormData({ ...formData, excerpt: e.target.value })}
                                    rows={3}
                                    placeholder="Brief description..."
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                    Content <span className="text-red-400">*</span>
                                </label>
                                <textarea
                                    required
                                    value={formData.content}
                                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                                    rows={12}
                                    placeholder="Write your blog post content here..."
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 font-mono text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">Author</label>
                                <input
                                    type="text"
                                    value={formData.author}
                                    onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1.5">
                                    Featured Image
                                </label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                                />
                            </div>

                            <div className="flex items-center gap-2">
                                <input
                                    type="checkbox"
                                    id="is_published"
                                    checked={formData.is_published}
                                    onChange={(e) => setFormData({ ...formData, is_published: e.target.checked })}
                                    className="w-4 h-4 text-orange-500 bg-[#0a0a0b] border-gray-700 rounded focus:ring-orange-500"
                                />
                                <label htmlFor="is_published" className="text-sm text-gray-400">
                                    Publish immediately
                                </label>
                            </div>

                            <div className="flex gap-4 pt-4">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all disabled:opacity-50"
                                >
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-5 h-5 inline mr-2 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        editingBlog ? 'Update Post' : 'Create Post'
                                    )}
                                </button>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setIsModalOpen(false);
                                        setEditingBlog(null);
                                    }}
                                    className="px-6 py-3 bg-[#0a0a0b] border border-gray-700 text-white rounded-lg hover:border-gray-600 transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

