import { notFound } from 'next/navigation';
import ArtistCard from '@/components/artists/ArtistCard';
import { mockArtists, mockCategories } from '@/lib/mockData';
import { SlidersHorizontal } from 'lucide-react';

interface CategoryPageProps {
    params: Promise<{ category: string }>;
}

export async function generateStaticParams() {
    return mockCategories.map((category) => ({
        category: category.slug,
    }));
}

export default async function CategoryPage({ params }: CategoryPageProps) {
    const { category: categorySlug } = await params;
    const category = mockCategories.find((c) => c.slug === categorySlug);

    if (!category) {
        notFound();
    }

    const artists = mockArtists.filter((a) => a.category_id === category.id);

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-16">
                <div className="absolute inset-0">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                        Book {category.name}
                    </h1>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        {category.description}
                    </p>
                    <p className="text-gray-500 mt-4">
                        {category.artist_count}+ verified artists available
                    </p>
                </div>
            </section>

            {/* Content */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Filters Sidebar */}
                        <aside className="lg:w-64 flex-shrink-0">
                            <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 sticky top-24">
                                <div className="flex items-center gap-2 mb-6">
                                    <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                                    <h2 className="font-semibold text-white">Filters</h2>
                                </div>

                                {/* Location Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Location</label>
                                    <select className="w-full px-3 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                        <option value="">All Cities</option>
                                        <option value="lahore">Lahore</option>
                                        <option value="karachi">Karachi</option>
                                        <option value="islamabad">Islamabad</option>
                                        <option value="rawalpindi">Rawalpindi</option>
                                    </select>
                                </div>

                                {/* Price Range Filter */}
                                <div className="mb-6">
                                    <label className="block text-sm font-medium text-gray-400 mb-2">Price Range</label>
                                    <select className="w-full px-3 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                        <option value="">Any Budget</option>
                                        <option value="0-50000">Under PKR 50,000</option>
                                        <option value="50000-100000">PKR 50,000 - 100,000</option>
                                        <option value="100000-300000">PKR 100,000 - 300,000</option>
                                        <option value="300000+">PKR 300,000+</option>
                                    </select>
                                </div>

                                {/* Verified Only */}
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="verified"
                                        className="w-4 h-4 text-orange-500 bg-[#0a0a0b] border-gray-700 rounded focus:ring-orange-500"
                                    />
                                    <label htmlFor="verified" className="text-sm text-gray-400">
                                        Verified Artists Only
                                    </label>
                                </div>
                            </div>
                        </aside>

                        {/* Artists Grid */}
                        <div className="flex-1">
                            {/* Results Header */}
                            <div className="flex items-center justify-between mb-6">
                                <p className="text-gray-400">
                                    Showing <span className="font-semibold text-white">{artists.length}</span> {category.name.toLowerCase()}
                                </p>
                                <select className="px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                                    <option>Sort by: Featured</option>
                                    <option>Price: Low to High</option>
                                    <option>Price: High to Low</option>
                                    <option>Most Recent</option>
                                </select>
                            </div>

                            {/* Grid */}
                            {artists.length > 0 ? (
                                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                                    {artists.map((artist) => (
                                        <ArtistCard key={artist.id} artist={artist} />
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
                                    <p className="text-gray-400 text-lg">No artists found in this category yet.</p>
                                    <p className="text-gray-600 mt-2">Check back soon or try a different category.</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
