'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Plus, X, Check, MapPin, Clock, ArrowRight, ArrowLeft } from 'lucide-react';

import { Artist } from '@/types';

export default function ComparePage() {
    const [selectedArtists, setSelectedArtists] = useState<Artist[]>([]);
    const [showSelector, setShowSelector] = useState(false);
    const [allArtists, setAllArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState<any[]>([]);
    const [categoryMap, setCategoryMap] = useState<Record<number, string>>({});

    // Fetch categories from backend
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch('http://127.0.0.1:8000/categories');
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data);
                    // Create mapping from category data
                    const mapping: Record<number, string> = {};
                    data.forEach((cat: any) => {
                        // Map by ID if available, or create ID from position
                        const id = cat.id || data.indexOf(cat) + 1;
                        mapping[id] = cat.name;
                    });
                    setCategoryMap(mapping);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
                // Fallback to default mapping
                setCategoryMap({
                    1: "Singer", 2: "Musician", 3: "DJ", 4: "Dancer", 5: "Comedian",
                    6: "Anchor", 7: "Makeup Artist", 8: "Photographer", 9: "Mehndi Artist", 10: "Decorator"
                });
            }
        }
        fetchCategories();
    }, []);

    // Fetch artists from API
    useEffect(() => {
        async function fetchArtists() {
            setLoading(true);
            try {
                const response = await fetch('http://127.0.0.1:8000/performers');
                if (response.ok) {
                    const performers = await response.json();
                    const transformed = performers.map((p: any) => ({
                        id: p.id,
                        name: p.name,
                        slug: p.name?.toLowerCase().replace(/\s+/g, '-') || '',
                        category_id: getCategoryIdFromName(p.category),
                        location: p.locations?.[0] || 'Pakistan',
                        price_range: p.price ? `PKR ${p.price.toLocaleString()}` : undefined,
                        image_url: p.profile_image_url || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400',
                        is_verified: true,
                        is_featured: false,
                        languages: p.genres || [],
                        performance_duration: undefined,
                    }));
                    setAllArtists(transformed);
                }
            } catch (error) {
                console.error('Failed to fetch artists:', error);
            } finally {
                setLoading(false);
            }
        }
        fetchArtists();
    }, []);

    function getCategoryIdFromName(categoryName: string): number {
        const mapping: Record<string, number> = {
            Singer: 1, Musician: 2, DJ: 3, Dancer: 4, Comedian: 5,
            Anchor: 6, 'Makeup Artist': 7, Photographer: 8, 'Mehndi Artist': 9, Decorator: 10
        };
        return mapping[categoryName] || 1;
    }

    const addArtist = (artist: Artist) => {
        if (selectedArtists.length < 4 && !selectedArtists.find((a) => a.id === artist.id)) {
            setSelectedArtists([...selectedArtists, artist]);
        }
        setShowSelector(false);
    };

    const removeArtist = (artistId: number) => {
        setSelectedArtists(selectedArtists.filter((a) => a.id !== artistId));
    };


    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-16 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            Compare
                            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"> Artists</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Compare up to 4 artists side by side to find the perfect match for your event
                        </p>
                    </div>
                </div>
            </section>

            {/* Comparison Area */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Artist Selection Cards */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                        {[0, 1, 2, 3].map((index) => {
                            const artist = selectedArtists[index];
                            return (
                                <div
                                    key={index}
                                    className={`relative bg-[#1a1a1a] rounded-2xl border ${artist ? 'border-gray-700' : 'border-dashed border-gray-700'
                                        } overflow-hidden min-h-[200px]`}
                                >
                                    {artist ? (
                                        <>
                                            {/* Remove Button */}
                                            <button
                                                onClick={() => removeArtist(artist.id)}
                                                className="absolute top-2 right-2 z-10 w-8 h-8 bg-[#0a0a0b] rounded-full flex items-center justify-center text-gray-400 hover:text-red-400 transition-colors"
                                            >
                                                <X className="w-4 h-4" />
                                            </button>

                                            {/* Artist Image */}
                                            <div className="relative h-32">
                                                <Image
                                                    src={artist.image_url}
                                                    alt={artist.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                                            </div>

                                            {/* Artist Info */}
                                            <div className="p-4">
                                                <h3 className="font-semibold text-white">{artist.name}</h3>
                                                <p className="text-sm text-gray-500">{categoryMap[artist.category_id]}</p>
                                            </div>
                                        </>
                                    ) : (
                                        <button
                                            onClick={() => setShowSelector(true)}
                                            className="absolute inset-0 flex flex-col items-center justify-center text-gray-500 hover:text-orange-400 transition-colors group"
                                        >
                                            <div className="w-12 h-12 rounded-full border-2 border-current flex items-center justify-center mb-2 group-hover:scale-110 transition-transform">
                                                <Plus className="w-6 h-6" />
                                            </div>
                                            <span className="text-sm">Add Artist</span>
                                        </button>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Comparison Table */}
                    {selectedArtists.length > 0 && (
                        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                            {/* Headers */}
                            <div className="grid grid-cols-[200px_repeat(4,1fr)] border-b border-gray-800">
                                <div className="p-4 bg-[#0f0f10]">
                                    <span className="text-gray-500 font-medium">Compare</span>
                                </div>
                                {[0, 1, 2, 3].map((index) => {
                                    const artist = selectedArtists[index];
                                    return (
                                        <div key={index} className="p-4 text-center border-l border-gray-800 bg-[#0f0f10]">
                                            {artist ? (
                                                <span className="font-semibold text-white">{artist.name}</span>
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>

                            {/* Comparison Rows */}
                            {[
                                { label: 'Category', getValue: (a: Artist) => categoryMap[a.category_id] },
                                { label: 'Location', getValue: (a: Artist) => a.location },
                                { label: 'Price Range', getValue: (a: Artist) => a.price_range || 'Contact for price' },
                                { label: 'Duration', getValue: (a: Artist) => a.performance_duration || '—' },
                                { label: 'Languages', getValue: (a: Artist) => a.languages?.join(', ') || '—' },
                                { label: 'Verified', getValue: (a: Artist) => a.is_verified ? 'Yes' : 'No', isCheck: true },
                                { label: 'Featured', getValue: (a: Artist) => a.is_featured ? 'Yes' : 'No', isCheck: true },
                            ].map((row, rowIndex) => (
                                <div key={rowIndex} className="grid grid-cols-[200px_repeat(4,1fr)] border-b border-gray-800 last:border-b-0">
                                    <div className="p-4 bg-[#0f0f10] flex items-center">
                                        <span className="text-gray-400 font-medium">{row.label}</span>
                                    </div>
                                    {[0, 1, 2, 3].map((index) => {
                                        const artist = selectedArtists[index];
                                        const value = artist ? row.getValue(artist) : null;
                                        return (
                                            <div key={index} className="p-4 text-center border-l border-gray-800 flex items-center justify-center">
                                                {artist ? (
                                                    row.isCheck && value === 'Yes' ? (
                                                        <div className="w-6 h-6 bg-green-500/20 rounded-full flex items-center justify-center">
                                                            <Check className="w-4 h-4 text-green-400" />
                                                        </div>
                                                    ) : (
                                                        <span className="text-gray-300">{value}</span>
                                                    )
                                                ) : (
                                                    <span className="text-gray-600">—</span>
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                            ))}

                            {/* Book Row */}
                            <div className="grid grid-cols-[200px_repeat(4,1fr)] bg-[#0f0f10]">
                                <div className="p-4">
                                    <span className="text-gray-400 font-medium">Book Now</span>
                                </div>
                                {[0, 1, 2, 3].map((index) => {
                                    const artist = selectedArtists[index];
                                    return (
                                        <div key={index} className="p-4 text-center border-l border-gray-800">
                                            {artist ? (
                                                <Link
                                                    href={`/artist/${artist.slug}`}
                                                    className="inline-flex items-center gap-1 px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                                                >
                                                    View <ArrowRight className="w-3 h-3" />
                                                </Link>
                                            ) : (
                                                <span className="text-gray-600">—</span>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    )}

                    {selectedArtists.length === 0 && (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-2xl border border-gray-800">
                            <p className="text-gray-400 text-lg mb-2">Add artists to compare</p>
                            <p className="text-gray-600">Click the + buttons above to select artists</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Artist Selector Modal */}
            {showSelector && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-2xl max-h-[80vh] overflow-hidden">
                        {/* Header */}
                        <div className="flex items-center justify-between p-4 border-b border-gray-800">
                            <h2 className="text-xl font-bold text-white">Select an Artist</h2>
                            <button
                                onClick={() => setShowSelector(false)}
                                className="p-2 text-gray-400 hover:text-white transition-colors"
                            >
                                <X className="w-6 h-6" />
                            </button>
                        </div>

                        <div className="overflow-y-auto max-h-[60vh] p-4 space-y-2">
                            {loading ? (
                                <div className="flex items-center justify-center py-8">
                                    <div className="animate-spin w-6 h-6 border-2 border-orange-500 border-t-transparent rounded-full"></div>
                                </div>
                            ) : allArtists.length > 0 ? (
                                allArtists.map((artist) => {
                                    const isSelected = selectedArtists.some((a) => a.id === artist.id);
                                    return (
                                        <button
                                            key={artist.id}
                                            onClick={() => !isSelected && addArtist(artist)}
                                            disabled={isSelected}
                                            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${isSelected
                                                ? 'bg-gray-800 opacity-50 cursor-not-allowed'
                                                : 'bg-[#0a0a0b] hover:bg-[#2a2a2a] border border-gray-800 hover:border-gray-700'
                                                }`}
                                        >
                                            <Image
                                                src={artist.image_url}
                                                alt={artist.name}
                                                width={60}
                                                height={60}
                                                className="rounded-full object-cover"
                                            />
                                            <div className="flex-1 text-left">
                                                <h3 className="font-semibold text-white">{artist.name}</h3>
                                                <p className="text-sm text-gray-500">
                                                    {categoryMap[artist.category_id]} • {artist.location}
                                                </p>
                                            </div>
                                            {isSelected && (
                                                <span className="text-sm text-gray-500">Added</span>
                                            )}
                                        </button>
                                    );
                                })
                            ) : (
                                <div className="text-center py-8 text-gray-500">
                                    No artists available
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
