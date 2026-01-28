'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Plus, Search, Edit2, Trash2, ArrowLeft } from 'lucide-react';
import { mockArtists, mockCategories } from '@/lib/mockData';

export default function ManageArtistsPage() {
    const [searchQuery, setSearchQuery] = useState('');
    const [artists, setArtists] = useState(mockArtists);

    const filteredArtists = artists.filter((artist) =>
        artist.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleDelete = (id: number) => {
        if (confirm('Are you sure you want to delete this artist?')) {
            setArtists(artists.filter((a) => a.id !== id));
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
                        <h1 className="text-2xl font-bold text-white">Manage Artists</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions Bar */}
                <div className="flex flex-col sm:flex-row gap-4 mb-6">
                    <div className="flex-1 relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search artists..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                    <button className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all">
                        <Plus className="w-5 h-5" />
                        Add Artist
                    </button>
                </div>

                {/* Artists Table */}
                <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0f0f10]">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Artist</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price Range</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {filteredArtists.map((artist) => {
                                    const category = mockCategories.find((c) => c.id === artist.category_id);
                                    return (
                                        <tr key={artist.id} className="hover:bg-[#2a2a2a]">
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex items-center">
                                                    <img src={artist.image_url} alt={artist.name} className="w-10 h-10 rounded-full object-cover" />
                                                    <div className="ml-4">
                                                        <div className="text-sm font-medium text-white">{artist.name}</div>
                                                        <div className="text-sm text-gray-500">/{artist.slug}</div>
                                                    </div>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{category?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{artist.location}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-400">{artist.price_range || '-'}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="flex gap-2">
                                                    {artist.is_verified && (
                                                        <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">Verified</span>
                                                    )}
                                                    {artist.is_featured && (
                                                        <span className="px-2 py-1 text-xs font-medium bg-orange-500/20 text-orange-400 rounded-full">Featured</span>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap text-right">
                                                <div className="flex justify-end gap-2">
                                                    <button className="p-2 text-gray-400 hover:text-orange-400 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                                                        <Edit2 className="w-4 h-4" />
                                                    </button>
                                                    <button onClick={() => handleDelete(artist.id)} className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors">
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>

                    {filteredArtists.length === 0 && (
                        <div className="text-center py-12">
                            <p className="text-gray-500">No artists found</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}
