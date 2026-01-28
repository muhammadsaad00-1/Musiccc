'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, ArrowLeft, Edit2, Trash2 } from 'lucide-react';
import { mockCategories } from '@/lib/mockData';

export default function ManageCategoriesPage() {
    const [categories, setCategories] = useState(mockCategories);

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this category?')) {
            setCategories(categories.filter((c) => c.id !== id));
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
                    <button className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                        <Plus className="w-5 h-5" />
                        Add Category
                    </button>
                </div>

                {/* Categories Grid */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {categories.map((category) => (
                        <div key={category.id} className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6">
                            <div className="flex items-start justify-between mb-4">
                                <div>
                                    <h3 className="text-lg font-semibold text-white">{category.name}</h3>
                                    <p className="text-sm text-gray-500">/{category.slug}</p>
                                </div>
                                <div className="flex gap-1">
                                    <button className="p-2 text-gray-400 hover:text-orange-400 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                                        <Edit2 className="w-4 h-4" />
                                    </button>
                                    <button onClick={() => handleDelete(category.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                            <p className="text-sm text-gray-500 mb-4 line-clamp-2">{category.description}</p>
                            <div className="flex items-center justify-between text-sm">
                                <span className="text-gray-500">{category.artist_count} artists</span>
                                <Link href={`/artists/${category.slug}`} className="text-orange-400 hover:text-orange-300 font-medium">
                                    View →
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </main>
        </div>
    );
}
