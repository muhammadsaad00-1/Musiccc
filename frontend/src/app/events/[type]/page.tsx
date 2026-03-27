'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Loader2, Calendar, Users, CheckCircle, MapPin, Music, ChevronDown, Star } from 'lucide-react';
import { useState, useEffect, use } from 'react';
import ArtistCard from '@/components/artists/ArtistCard';
import FAQSection from '@/components/ui/FAQSection';
import { API_BASE_URL } from '@/lib/api';

interface EventTypePageProps {
    params: Promise<{ type: string }>;
}

interface BackendEvent {
    id: string;
    name: string;
    description: string;
    event_recommendations: string;
    pricing: number;
    header_image_url: string;
    performers: any[];
}

// Hero background images for each event type
const eventHeroImages: Record<string, string[]> = {
    wedding: [
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?auto=format&fit=crop&q=80"
    ],
    mehendi: [
        "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?auto=format&fit=crop&q=80"
    ],
    concert: [
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80"
    ],
    corporate: [
        "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&q=80"
    ],
    birthday: [
        "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1527529482837-4698179dc6ce?auto=format&fit=crop&q=80"
    ],
    default: [
        "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
        "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80"
    ]
};

// Event type configurations
const eventConfigs: Record<string, { name: string; description: string; icon: string }> = {
    wedding: {
        name: "Wedding",
        description: "Create magical moments with world-class entertainment for your special day",
        icon: "💍"
    },
    mehendi: {
        name: "Mehendi",
        description: "Traditional celebrations deserve extraordinary performances and vibrant music",
        icon: "🌙"
    },
    concert: {
        name: "Concert",
        description: "Electrifying live performances that create unforgettable musical experiences",
        icon: "🎭"
    },
    corporate: {
        name: "Corporate Event",
        description: "Professional entertainment solutions for conferences, galas, and corporate celebrations",
        icon: "🏢"
    },
    birthday: {
        name: "Birthday Party",
        description: "Make every birthday celebration special with talented performers",
        icon: "🎂"
    },
    "private-party": {
        name: "Private Party",
        description: "Exclusive entertainment for intimate gatherings and celebrations",
        icon: "🎉"
    },
};

export default function EventTypePage({ params }: EventTypePageProps) {
    const { type } = use(params);
    const [event, setEvent] = useState<any>(null);
    const [relevantArtists, setRelevantArtists] = useState<any[]>([]);
    const [relevantCategories, setRelevantCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [heroImageIndex, setHeroImageIndex] = useState(0);
    const [activeCategory, setActiveCategory] = useState<string | null>(null);

    // Auto-advance hero carousel
    useEffect(() => {
        const images = eventHeroImages[type] || eventHeroImages.default;
        const interval = setInterval(() => {
            setHeroImageIndex((current) => (current + 1) % images.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [type]);

    useEffect(() => {
        const fetchEventData = async () => {
            setLoading(true);

            // Check if it's a known event type
            const eventConfig = eventConfigs[type];

            try {
                // Try to fetch from backend
                const response = await fetch(`${API_BASE_URL}/events`);
                if (response.ok) {
                    const backendEvents: BackendEvent[] = await response.json();
                    const createSlug = (name: string) => {
                        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                    };

                    const backendEvent = backendEvents.find(
                        (e) => createSlug(e.name) === type
                    );

                    if (backendEvent) {
                        setEvent({
                            ...backendEvent,
                            slug: type,
                            name: backendEvent.name,
                            description: backendEvent.description,
                            image: backendEvent.header_image_url,
                        });

                        // Transform performers
                        if (backendEvent.performers && backendEvent.performers.length > 0) {
                            const transformedPerformers = backendEvent.performers.map((performer: any) => ({
                                ...performer,
                                image_url: performer.profile_image_url || performer.image_url,
                                slug: performer.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                                location: performer.locations && performer.locations.length > 0 ? performer.locations[0] : 'Pakistan',
                                short_bio: performer.description,
                                price_range: performer.price ? `PKR ${performer.price.toLocaleString()}+` : 'Contact for pricing',
                                category_id: performer.category,
                                bio: performer.description
                            }));
                            setRelevantArtists(transformedPerformers);
                        }
                    } else if (eventConfig) {
                        // Use config for known event types
                        setEvent({
                            name: eventConfig.name,
                            description: eventConfig.description,
                            icon: eventConfig.icon,
                            slug: type,
                        });

                        // Fetch relevant artists based on event type
                        await fetchRelevantArtistsForEvent(type);
                    } else {
                        notFound();
                    }
                } else if (eventConfig) {
                    setEvent({
                        name: eventConfig.name,
                        description: eventConfig.description,
                        icon: eventConfig.icon,
                        slug: type,
                    });
                    // Fetch relevant artists
                    await fetchRelevantArtistsForEvent(type);
                }
            } catch (error) {
                console.error('Failed to fetch event:', error);
                if (eventConfig) {
                    setEvent({
                        name: eventConfig.name,
                        description: eventConfig.description,
                        icon: eventConfig.icon,
                        slug: type,
                    });
                    // Fetch relevant artists
                    await fetchRelevantArtistsForEvent(type);
                }
            } finally {
                setLoading(false);
            }
        };

        // Function to fetch relevant artists and categories for event type
        const fetchRelevantArtistsForEvent = async (eventType: string) => {
            try {
                // Map event types to relevant category keywords (used for fuzzy matching)
                const eventCategoryMap: Record<string, string[]> = {
                    'wedding': ['singer', 'dj', 'musician', 'dancer', 'photographer', 'band', 'live band', 'bhangra', 'qawwal'],
                    'mehendi': ['singer', 'dancer', 'dj', 'musician', 'bhangra', 'band', 'qawwal'],
                    'concert': ['singer', 'musician', 'dj', 'band', 'live band', 'qawwal', 'bhangra', 'punjabi'],
                    'corporate': ['singer', 'dj', 'musician', 'anchor', 'band', 'qawwal'],
                    'birthday': ['singer', 'dj', 'comedian', 'dancer', 'musician', 'bhangra', 'qawwal'],
                    'private-party': ['singer', 'dj', 'musician', 'band', 'bhangra', 'qawwal'],
                };

                const relevantKeywords = eventCategoryMap[eventType] || ['singer', 'dj', 'musician'];

                // Helper: check if a category name matches any keyword (fuzzy)
                const matchesKeywords = (categoryName: string) => {
                    const lower = categoryName.toLowerCase();
                    return relevantKeywords.some(keyword =>
                        lower.includes(keyword) || keyword.includes(lower)
                    );
                };

                // Fetch categories from backend
                const categoriesRes = await fetch(`${API_BASE_URL}/categories`);
                if (categoriesRes.ok) {
                    const allCategories = await categoriesRes.json();
                    // Filter categories that match event type keywords
                    const filteredCategories = allCategories.filter((cat: any) =>
                        matchesKeywords(cat.name)
                    );
                    setRelevantCategories(filteredCategories);

                    // Set initial active category if available
                    if (filteredCategories.length > 0) {
                        setActiveCategory(filteredCategories[0].name.toLowerCase());
                    }
                }

                // Fetch all performers
                const performersRes = await fetch(`${API_BASE_URL}/performers?limit=100`);
                if (performersRes.ok) {
                    const data = await performersRes.json();
                    // Handle paginated response - data is in response.data
                    const allPerformers = data.data || data;

                    // Filter performers by relevant categories (fuzzy match, category is now an array)
                    const filtered = allPerformers
                        .filter((p: any) => {
                            const cats = Array.isArray(p.category) ? p.category : [p.category || ''];
                            return cats.some((c: string) => matchesKeywords(c));
                        })
                        .slice(0, 12) // Limit to 12 artists
                        .map((performer: any) => ({
                            id: performer.id,
                            name: performer.name,
                            image_url: performer.profile_image_url || performer.image_url,
                            slug: performer.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
                            location: performer.locations && performer.locations.length > 0 ? performer.locations[0] : 'Pakistan',
                            short_bio: performer.description?.substring(0, 80),
                            price_range: performer.price ? `PKR ${performer.price.toLocaleString()}+` : 'Contact for pricing',
                            category_id: performer.category,
                            bio: performer.description,
                            is_verified: true,
                            is_featured: false,
                        }));

                    setRelevantArtists(filtered);
                }
            } catch (error) {
                console.error('Error fetching relevant artists:', error);
            }
        };

        fetchEventData();
    }, [type]);

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    if (!event) {
        notFound();
    }

    const eventConfig = eventConfigs[type];
    const heroImages = eventHeroImages[type] || eventHeroImages.default;

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero with Background Image Carousel */}
            <section className="relative min-h-[450px] lg:min-h-[500px] flex items-center overflow-hidden">
                {/* Background Image Carousel */}
                <div className="absolute inset-0">
                    <Image
                        key={heroImageIndex}
                        src={heroImages[heroImageIndex]}
                        alt={`${event.name} background`}
                        fill
                        className="object-cover transition-opacity duration-1000"
                        priority
                    />
                    {/* Dark overlay for readability */}
                    <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0b]" />
                    {/* Colored gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-purple-900/20" />
                </div>

                {/* Gradient orbs */}
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px]" />
                    <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
                </div>

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
                    <Link
                        href="/events"
                        className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/20 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">All Events</span>
                    </Link>

                    <div className="text-center max-w-4xl mx-auto">
                        {/* Event badge */}
                        <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-full text-orange-300 text-base font-semibold mb-8 border border-orange-500/30">
                            <span className="text-xl">{eventConfig?.icon || '🎉'}</span>
                            <span>{event.name} Entertainment</span>
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 drop-shadow-2xl leading-tight">
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-white">Book for</span>{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 animate-gradient bg-size-200">
                                {event.name}
                            </span>
                            <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-4">
                                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-purple-200 to-pink-200">
                                    Make It Unforgettable
                                </span>
                            </span>
                        </h1>

                        <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
                            {event.description}
                        </p>

                        <div className="flex items-center justify-center gap-4 text-sm flex-wrap">
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <Users className="w-4 h-4 text-orange-400" />
                                <span className="text-white">{relevantArtists.length} Artists</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <CheckCircle className="w-4 h-4 text-green-400" />
                                <span className="text-white">Verified Professionals</span>
                            </div>
                            <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                <span className="text-white">Instant Booking</span>
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

            {/* Artists Grouped by Category */}
            <section className="py-20 bg-[#0a0a0b]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Section Header */}
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-orange-500/10 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/20">
                            <Star className="w-4 h-4" />
                            <span>Recommended Talent</span>
                        </div>
                        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                            Best for <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">{event.name}s</span>
                        </h2>
                        <p className="text-gray-400 max-w-2xl mx-auto">
                            Handpicked performers specialized in {event.name.toLowerCase()} entertainment.
                            Choose a category to explore our top choices.
                        </p>
                    </div>

                    {relevantCategories.length > 0 && (
                        <div className="mb-12">
                            {/* Category Selection Buttons */}
                            <div className="flex flex-wrap justify-center gap-3 mb-12">
                                {relevantCategories.map((category) => {
                                    const isActive = activeCategory === category.name.toLowerCase();
                                    return (
                                        <button
                                            key={category.id}
                                            onClick={() => setActiveCategory(category.name.toLowerCase())}
                                            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all border ${isActive
                                                ? 'bg-gradient-to-r from-orange-500 to-pink-600 border-transparent text-white shadow-lg shadow-orange-500/20'
                                                : 'bg-[#1a1a1a] border-gray-800 text-gray-400 hover:border-gray-600 hover:text-white'
                                                }`}
                                        >
                                            {category.name}
                                        </button>
                                    );
                                })}
                            </div>

                            {/* Artist Grid for Selected Category */}
                            <div className="min-h-[400px]">
                                {(() => {
                                    const currentCategory = activeCategory;
                                    const categoryArtists = relevantArtists.filter((artist) => {
                                        const cats = Array.isArray(artist.category_id)
                                            ? artist.category_id
                                            : [artist.category_id || ''];
                                        return cats.some((c: string) => {
                                            const artCat = c.toLowerCase();
                                            return currentCategory && (
                                                artCat === currentCategory ||
                                                currentCategory.includes(artCat) ||
                                                artCat.includes(currentCategory)
                                            );
                                        });
                                    });

                                    if (categoryArtists.length > 0) {
                                        return (
                                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                                {categoryArtists.map((artist) => (
                                                    <ArtistCard key={artist.id} artist={artist} />
                                                ))}
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="text-center py-20 bg-[#141414] rounded-3xl border border-gray-800/50">
                                            <p className="text-gray-500">No {activeCategory} listed for this event type yet.</p>
                                        </div>
                                    );
                                })()}
                            </div>
                        </div>
                    )}

                    {!relevantCategories.length && relevantArtists.length > 0 && (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                            {relevantArtists.map((artist) => (
                                <ArtistCard key={artist.id} artist={artist} />
                            ))}
                        </div>
                    )}

                    {!relevantArtists.length && !loading && (
                        <div className="text-center py-20 bg-[#1a1a1a]/50 rounded-3xl border border-gray-800/50">
                            <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center">
                                <Music className="w-10 h-10 text-orange-400" />
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-2">No Artists Listed Yet</h3>
                            <p className="text-gray-500 mb-8 max-w-md mx-auto">
                                We're working on adding amazing artists for {event.name} events.
                            </p>
                            <Link
                                href="/post-requirement"
                                className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full font-semibold hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Post Your Requirement
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* Looking for Something Else? CTA Section */}
            <section className="py-16 lg:py-20 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/5 to-purple-900/10" />
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[150px]" />

                <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="bg-gradient-to-b from-[#1a1a1a]/80 to-[#151515]/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 lg:p-12 shadow-2xl shadow-orange-500/5">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                            <span className="text-lg">🎯</span>
                            <span>Can't Find What You're Looking For?</span>
                        </div>

                        <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                            Looking for{' '}
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                                Something Specific?
                            </span>
                        </h2>

                        <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
                            Tell us your requirements and we'll find the perfect entertainment for your {event.name.toLowerCase()}.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all"
                            >
                                Contact Us Now
                            </Link>
                            <Link
                                href="/post-requirement"
                                className="px-8 py-4 bg-[#1a1a1a] border border-gray-700 text-white font-bold rounded-xl hover:bg-[#252525] hover:border-orange-500/30 transition-all"
                            >
                                Post Your Requirement
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* FAQs Section */}
            <FAQSection
                title="Event Questions?"
                subtitle={`Everything you need to know about booking entertainment for ${event.name} events`}
                faqs={[
                    {
                        question: `What types of artists are best for a ${event.name.toLowerCase()}?`,
                        answer: `For ${event.name.toLowerCase()} events, we recommend singers, musicians, and performers who specialize in this type of celebration. Contact us for personalized recommendations based on your specific requirements.`
                    },
                    {
                        question: "How far in advance should I book?",
                        answer: "We recommend booking at least 2-4 weeks before your event. For popular artists or peak wedding season, booking 1-2 months in advance is ideal."
                    },
                    {
                        question: "Can artists travel to my event location?",
                        answer: "Yes! Most artists are willing to travel across Pakistan. Travel arrangements and any additional costs will be discussed during the booking process."
                    },
                    {
                        question: "What if I need multiple artists?",
                        answer: "We can help you book multiple artists for your event. Contact us with your requirements and we'll create a custom package for you."
                    },
                    {
                        question: "How do payments work?",
                        answer: "Typically, a booking advance is required to confirm, with the remaining amount paid on the event day. Specific terms vary by artist."
                    }
                ]}
            />
        </div>
    );
}
