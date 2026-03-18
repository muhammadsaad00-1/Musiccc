'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Plus, ArrowLeft, Edit2, Trash2, Loader2, X, Upload } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
// import { mockCategories } from '@/lib/mockData'; // Removed mock data

interface Category {
    id: number;
    name: string;
    slug: string;
    description: string;
    artist_count?: number;
    image_url?: string;
}

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    // Modal State
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        image: null as File | null
    });
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchCategories = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_BASE_URL}/categories`);
            if (!response.ok) throw new Error('Failed to fetch categories');
            const result = await response.json();
            // Handle both paginated and non-paginated responses
            const data = result.data || result;
            setCategories(data);
        } catch (err) {
            console.error('Error fetching categories:', err);
            setError('Failed to load categories');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleDelete = async (id: number) => {
        if (!confirm('Are you sure you want to delete this category?')) return;

        try {
            const response = await fetch(`${API_BASE_URL}/admin/categories/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                setCategories(categories.filter((c) => c.id !== id));
            } else {
                alert('Failed to delete category');
            }
        } catch (error) {
            console.error('Error deleting category:', error);
            alert('Error deleting category');
        }
    };

    const handleEdit = (category: Category) => {
        setEditingCategory(category);
        setFormData({
            name: category.name,
            description: category.description || '',
            image: null
        });
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setEditingCategory(null);
        setFormData({ name: '', description: '', image: null });
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFormData({ ...formData, image: e.target.files[0] });
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name) return;

        try {
            setIsSubmitting(true);
            const data = new FormData();
            data.append('name', formData.name);
            data.append('description', formData.description);
            if (formData.image) {
                data.append('image', formData.image);
            }

            const url = editingCategory
                ? `${API_BASE_URL}/admin/categories/${editingCategory.id}`
                : `${API_BASE_URL}/admin/categories`;

            const method = editingCategory ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: data,
            });

            if (response.ok) {
                const result = await response.json();
                if (result.success) {
                    await fetchCategories(); // Refresh list
                    handleCloseModal();
                } else {
                    alert(`Failed to ${editingCategory ? 'update' : 'create'} category: ` + result.message);
                }
            } else {
                alert(`Failed to ${editingCategory ? 'update' : 'create'} category`);
            }
        } catch (error) {
            console.error(`Error ${editingCategory ? 'updating' : 'creating'} category:`, error);
            alert(`Error ${editingCategory ? 'updating' : 'creating'} category`);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Manage Categories</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions Bar */}
                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setIsModalOpen(true)}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                        <Plus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>

                {/* Loading State */}
                {loading && (
                    <div className="flex justify-center items-center py-12">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                )}

                {/* Error State */}
                {error && (
                    <div className="text-red-500 text-center py-8">{error}</div>
                )}

                {/* Categories Grid */}
                {!loading && !error && (
                    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {categories.map((category) => (
                            <div key={category.id} className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 relative group">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="flex items-center gap-3">
                                        {category.image_url ? (
                                            <img src={category.image_url} alt={category.name} className="w-12 h-12 rounded-lg object-cover bg-gray-800" />
                                        ) : (
                                            <div className="w-12 h-12 rounded-lg bg-gray-800 flex items-center justify-center text-gray-500 text-xs">No img</div>
                                        )}
                                        <div>
                                            <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                            <p className="text-sm text-gray-500">/{category.slug}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button
                                            onClick={() => handleEdit(category)}
                                            className="p-2 text-gray-400 hover:text-orange-400 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                                            <Edit2 className="w-4 h-4" />
                                        </button>
                                        <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                </div>
                                <p className="text-sm text-gray-500 mb-4 line-clamp-2">{category.description || 'No description provided.'}</p>
                                <div className="flex items-center justify-between text-sm pt-4 border-t border-gray-800">
                                    <span className="text-gray-500">{category.artist_count || 0} artists</span>
                                    <Link href={`/artists/${category.slug}`} className="text-orange-400 hover:text-orange-300 font-medium text-xs uppercase tracking-wider">
                                        View Artists
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {!loading && !error && categories.length === 0 && (
                    <div className="flex flex-col items-center justify-center py-20 bg-[#1a1a1a] rounded-xl border border-gray-800 border-dashed">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mb-4">
                            <Plus className="w-8 h-8 text-gray-500" />
                        </div>
                        <h3 className="text-xl font-medium text-white mb-2">No categories found</h3>
                        <p className="text-gray-500 mb-6">Get started by creating your first category.</p>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="px-6 py-2 bg-white text-black font-medium rounded-lg hover:bg-gray-200 transition-colors">
                            Create Category
                        </button>
                    </div>
                )}
            </main>

            {/* Add/Edit Category Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
                    <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl w-full max-w-lg shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-gray-800 flex justify-between items-center">
                            <h2 className="text-xl font-bold text-white">
                                {editingCategory ? 'Edit Category' : 'Add New Category'}
                            </h2>
                            <button onClick={handleCloseModal} className="text-gray-400 hover:text-white">
                                <X className="w-5 h-5" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Category Name *</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors"
                                    placeholder="e.g. Musicians"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-colors h-24 resize-none"
                                    placeholder="Brief description of the category..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-1">Cover Image</label>
                                {editingCategory?.image_url && !formData.image && (
                                    <div className="mb-3 p-3 bg-[#0a0a0b] border border-gray-800 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={editingCategory.image_url}
                                                alt="Current"
                                                className="w-16 h-16 rounded-lg object-cover"
                                            />
                                            <div className="flex-1">
                                                <p className="text-sm text-gray-400">Current Image</p>
                                                <p className="text-xs text-gray-600 mt-1">Upload a new image to replace</p>
                                            </div>
                                        </div>
                                    </div>
                                )}
                                <div
                                    onClick={() => fileInputRef.current?.click()}
                                    className="border-2 border-dashed border-gray-800 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 hover:bg-white/5 transition-all group"
                                >
                                    {formData.image ? (
                                        <div className="text-center">
                                            <p className="text-green-500 font-medium mb-1">{formData.image.name}</p>
                                            <p className="text-xs text-gray-500">Click to change</p>
                                        </div>
                                    ) : (
                                        <>
                                            <Upload className="w-8 h-8 text-gray-500 mb-2 group-hover:text-orange-500 transition-colors" />
                                            <p className="text-sm text-gray-400">
                                                {editingCategory?.image_url ? 'Upload new image' : 'Click to upload image'}
                                            </p>
                                            <p className="text-xs text-gray-600 mt-1">JPG, PNG up to 5MB</p>
                                        </>
                                    )}
                                    <input
                                        type="file"
                                        ref={fileInputRef}
                                        onChange={handleFileChange}
                                        className="hidden"
                                        accept="image/*"
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                                <button
                                    type="button"
                                    onClick={handleCloseModal}
                                    className="flex-1 px-4 py-2 bg-[#2a2a2a] text-white rounded-lg hover:bg-[#3a3a3a] transition-colors font-medium">
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    className="flex-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {isSubmitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            {editingCategory ? 'Updating...' : 'Saving...'}
                                        </>
                                    ) : (
                                        editingCategory ? 'Update Category' : 'Create Category'
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
