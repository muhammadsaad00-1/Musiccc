'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ArtistCard from '@/components/artists/ArtistCard';
import { mockArtists, mockCategories, cities } from '@/lib/mockData';
import { Search, SlidersHorizontal } from 'lucide-react';

function SearchContent() {
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get('q') || '';
    const initialLocation = searchParams.get('location') || '';

    const [query, setQuery] = useState(initialQuery);
    const [location, setLocation] = useState(initialLocation);
    const [category, setCategory] = useState('');
    const [results, setResults] = useState(mockArtists);

    useEffect(() => {
        let filtered = mockArtists;

        if (query) {
            filtered = filtered.filter(
                (artist) =>
                    artist.name.toLowerCase().includes(query.toLowerCase()) ||
                    artist.bio?.toLowerCase().includes(query.toLowerCase())
            );
        }

        if (location) {
            filtered = filtered.filter(
                (artist) => artist.location.toLowerCase() === location.toLowerCase()
            );
        }

        if (category) {
            const cat = mockCategories.find((c) => c.slug === category);
            if (cat) {
                filtered = filtered.filter((artist) => artist.category_id === cat.id);
            }
        }

        setResults(filtered);
    }, [query, location, category]);

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Search Header */}
            <section className="bg-[#1a1a1a] border-b border-gray-800 py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-4">
                        {/* Main Search */}
                        <div className="flex-1 relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search artists, categories..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>

                        {/* Location */}
                        <select
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className="px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">All Cities</option>
                            {cities.map((city) => (
                                <option key={city} value={city}>{city}</option>
                            ))}
                        </select>

                        {/* Category */}
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className="px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">All Categories</option>
                            {mockCategories.map((cat) => (
                                <option key={cat.id} value={cat.slug}>{cat.name}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </section>

            {/* Results */}
            <section className="py-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results Header */}
                    <div className="flex items-center justify-between mb-6">
                        <p className="text-gray-400">
                            Found <span className="font-semibold text-white">{results.length}</span> artists
                            {query && <span> for "{query}"</span>}
                        </p>
                        <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-[#1a1a1a] rounded-lg lg:hidden">
                            <SlidersHorizontal className="w-5 h-5" />
                            Filters
                        </button>
                    </div>

                    {/* Grid */}
                    {results.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {results.map((artist) => (
                                <ArtistCard key={artist.id} artist={artist} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
                            <p className="text-gray-400 text-lg mb-2">No artists found</p>
                            <p className="text-gray-600">Try adjusting your search or filters</p>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}

export default function SearchPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-white">Loading...</div>}>
            <SearchContent />
        </Suspense>
    );
}
