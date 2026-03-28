'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import ArtistCard from '@/components/artists/ArtistCard';
import FAQSection from '@/components/ui/FAQSection';
import {
    Loader2, ArrowLeft, Music, Users, Search, Sparkles
} from 'lucide-react';
import Pagination from '@/components/ui/Pagination';
import { Artist } from '@/types';
import { API_BASE_URL } from '@/lib/api';
import EventBannerCarousel from '@/components/home/EventBannerCarousel';

// Hero background images
const heroImages = [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80"
];

// Transform backend performer to frontend artist
function transformPerformerToArtist(performer: any): Artist {
    return {
        id: performer.id || performer.name,
        name: performer.name,
        slug: performer.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
        category_id: performer.category,
        image_url: performer.profile_image_url || performer.image_url || '/placeholder-artist.jpg',
        short_bio: performer.description || 'Professional artist',
        bio: performer.description || 'Professional artist',
        location: 'Pakistan',
        is_verified: performer.is_verified ?? true,
        is_featured: performer.is_featured ?? false,
        video_url: performer.videos && performer.videos.length > 0 ? performer.videos[0] : null,
    };
}

function AllArtistsContent() {
    const searchParams = useSearchParams();
    const [artists, setArtists] = useState<Artist[]>([]);
    const [loading, setLoading] = useState(true);
    const [availableCategories, setAvailableCategories] = useState<string[]>([]);
    const [heroImageIndex, setHeroImageIndex] = useState(0);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 20;

    // Filter states
    const [searchQuery, setSearchQuery] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('');

    // Read URL params and set filters
    useEffect(() => {
        const categoryParam = searchParams.get('category');
        if (categoryParam) {
            setCategoryFilter(categoryParam);
        }
    }, [searchParams]);

    // Reset pagination when filters change
    useEffect(() => {
        setCurrentPage(1);
    }, [searchQuery, categoryFilter]);

    // Auto-advance hero carousel
    useEffect(() => {
        const interval = setInterval(() => {
            setHeroImageIndex((current) => (current + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    // Fetch all artists and categories from API
    useEffect(() => {
        async function fetchData() {
            setLoading(true);
            try {
                // Fetch performers - API now returns paginated response
                const performersRes = await fetch(`${API_BASE_URL}/performers?limit=100`);
                if (performersRes.ok) {
                    const response = await performersRes.json();
                    // Handle paginated response - data is in response.data
                    const backendPerformers = response.data || response;
                    const transformedArtists = backendPerformers.map((p: any) => transformPerformerToArtist(p));
                    setArtists(transformedArtists);
                }

                // Fetch categories from backend
                const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
                if (categoriesRes.ok) {
                    const categories = await categoriesRes.json();
                    const categoryNames = categories.map((cat: any) => cat.name).sort();
                    setAvailableCategories(categoryNames);
                }
            } catch (err) {
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchData();
    }, []);

    // Filter artists
    const filteredArtists = (() => {
        let result = [...artists];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(artist =>
                artist.name.toLowerCase().includes(query) ||
                artist.short_bio?.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (categoryFilter) {
            result = result.filter(artist => String(artist.category_id) === categoryFilter);
        }

        return result;
    })();

    // Paginated artists
    const totalPages = Math.ceil(filteredArtists.length / itemsPerPage);
    const paginatedArtists = filteredArtists.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
    );

    const handlePageChange = (page: number) => {
        setCurrentPage(page);
        window.scrollTo({ top: 500, behavior: 'smooth' });
    };

    const hasFilters = !!(searchQuery || categoryFilter);

    const clearFilters = () => {
        setSearchQuery('');
        setCategoryFilter('');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero with Background Image Carousel */}
            <section className="relative min-h-[400px] lg:min-h-[450px] flex items-center overflow-hidden">
                {/* Background Image Carousel */}
                <div className="absolute inset-0">
                    <Image
                        key={heroImageIndex}
                        src={heroImages[heroImageIndex]}
                        alt="Artists background"
                        fill
                        className="object-cover transition-opacity duration-1000"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0b]" />
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-purple-900/20" />
                </div>

                {/* Gradient orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/20 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>

                    <div className="text-center max-w-4xl mx-auto">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-full text-orange-300 text-base font-semibold mb-8 border border-orange-500/30">
                            <Sparkles className="w-5 h-5" />
                            <span>Browse Our Talent Pool</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 drop-shadow-2xl leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-white">All</span>{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                                Artists
                            </span>
                            <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-purple-200 to-pink-200">
                                    Find Your Perfect Match
                                </span>
                            </span>
                        </h1>

                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                            Discover talented performers from across Pakistan for your special events
                        </p>

                        <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <Users className="w-4 h-4 text-orange-400" />
                                <span className="text-white">{loading ? '...' : artists.length} Artists</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <span className="text-green-400">✓</span>
                                <span className="text-white">Verified Professionals</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <Music className="w-4 h-4 text-purple-400" />
                                <span className="text-white">Multiple Categories</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Carousel indicators */}
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
                    {heroImages.map((_, idx) => (
                        <button
                            key={idx}
                            onClick={() => setHeroImageIndex(idx)}
                            className={`w-2 h-2 rounded-full transition-all ${idx === heroImageIndex
                                ? 'bg-orange-500 w-6'
                                : 'bg-white/30 hover:bg-white/50'
                                }`}
                        />
                    ))}
                </div>
            </section>

            {/* Event Banners Carousel - Placed right below the hero banner */}
            <div className="bg-[#0a0a0b] py-4 border-b border-gray-800/50">
                <EventBannerCarousel />
            </div>

            {/* Search and Category Filter */}
            <section className="py-8 border-b border-gray-800/50 sticky top-16 lg:top-20 z-30 bg-[#0a0a0b]/95 backdrop-blur-md">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <div className="relative flex-1 w-full">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                            <input
                                type="text"
                                placeholder="Search artists by name..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white placeholder-gray-500 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition-all"
                            />
                        </div>

                        {/* Category Filter */}
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="px-4 py-3 bg-[#1a1a1a] border border-gray-800 rounded-xl text-white text-sm focus:border-orange-500 transition-all cursor-pointer"
                        >
                            <option value="">All Categories</option>
                            {availableCategories.map((cat) => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>

                        {/* Clear Filters */}
                        {hasFilters && (
                            <button
                                onClick={clearFilters}
                                className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm font-medium hover:bg-red-500/20 transition-all whitespace-nowrap"
                            >
                                Clear Filters
                            </button>
                        )}
                    </div>
                </div>
            </section>

            {/* Artists Grid */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Results count */}
                    <div className="mb-8 flex justify-between items-center">
                        <p className="text-gray-400">
                            Showing <span className="text-white font-semibold">
                                {paginatedArtists.length > 0 ? (currentPage - 1) * itemsPerPage + 1 : 0}-
                                {Math.min(currentPage * itemsPerPage, filteredArtists.length)}
                            </span> of <span className="text-white font-semibold">{filteredArtists.length}</span> artists
                        </p>
                    </div>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : paginatedArtists.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                                {paginatedArtists.map((artist) => (
                                    <ArtistCard key={artist.id} artist={artist} />
                                ))}
                            </div>

                            <Pagination
                                currentPage={currentPage}
                                totalPages={totalPages}
                                onPageChange={handlePageChange}
                            />
                        </>
                    ) : (
                        <div className="text-center py-16 bg-gradient-to-b from-[#1a1a1a]/50 to-[#151515]/50 rounded-3xl border border-gray-800/50">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center">
                                <Music className="w-10 h-10 text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Artists Found</h3>
                            <p className="text-gray-500 mb-6 max-w-md mx-auto">
                                {hasFilters
                                    ? 'Try adjusting your search or category to see more results'
                                    : 'No artists are currently available. Check back later!'}
                            </p>
                            {hasFilters && (
                                <button
                                    onClick={clearFilters}
                                    className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full font-medium hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                                >
                                    Clear Filters
                                </button>
                            )}
                        </div>
                    )}
                </div>
            </section>

            {/* FAQs Section */}
            <FAQSection
                title="Got Questions?"
                subtitle="Everything you need to know about browsing and booking artists"
                faqs={[
                    {
                        question: "How do I book an artist?",
                        answer: "Browse our artists, click on their profile to view details, then click the WhatsApp button to contact them directly with your event requirements."
                    },
                    {
                        question: "Are all artists verified?",
                        answer: "Yes, all artists on our platform go through a verification process to ensure quality and professionalism."
                    },
                    {
                        question: "What if I need help choosing an artist?",
                        answer: "Contact our team and we'll help you find the perfect artist based on your event type and preferences."
                    },
                    {
                        question: "Can I see artist reviews?",
                        answer: "Yes, you can view ratings and reviews on each artist's profile page to help you make an informed decision."
                    }
                ]}
            />
        </div>
    );
}

export default function AllArtistsPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        }>
            <AllArtistsContent />
        </Suspense>
    );
}
