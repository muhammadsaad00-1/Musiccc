'use client';

import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import ArtistCard from '@/components/artists/ArtistCard';
import { eventTypeDetails, mockArtists, mockCategories } from '@/lib/mockData';

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

export default function EventTypePage({ params }: EventTypePageProps) {
    const [type, setType] = useState<string>('');
    const [event, setEvent] = useState<any>(null);
    const [relevantArtists, setRelevantArtists] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const initPage = async () => {
            const resolvedParams = await params;
            setType(resolvedParams.type);

            // First try to find in mock data
            const mockEvent = eventTypeDetails.find((e) => e.slug === resolvedParams.type);

            if (mockEvent) {
                setEvent(mockEvent);

                // Get artists from popular categories for this event type
                const relevantCategoryIds = mockCategories
                    .filter((cat) => mockEvent.popularCategories.includes(cat.name))
                    .map((cat) => cat.id);

                const filteredArtists = mockArtists.filter((artist) =>
                    relevantCategoryIds.includes(artist.category_id)
                );
                setRelevantArtists(filteredArtists);
                setLoading(false);
            } else {
                // Try to fetch from backend
                try {
                    const response = await fetch('http://localhost:8000/events');
                    if (response.ok) {
                        const backendEvents: BackendEvent[] = await response.json();
                        const createSlug = (name: string) => {
                            return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
                        };

                        const backendEvent = backendEvents.find(
                            (e) => createSlug(e.name) === resolvedParams.type
                        );

                        if (backendEvent) {
                            setEvent({
                                ...backendEvent,
                                slug: resolvedParams.type,
                                image: backendEvent.header_image_url,
                            });

                            // Use performers from backend event and transform them to match ArtistCard structure
                            if (backendEvent.performers && backendEvent.performers.length > 0) {
                                const transformedPerformers = backendEvent.performers.map((performer: any) => ({
                                    ...performer,
                                    // Map backend fields to frontend expected fields
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
                        } else {
                            notFound();
                        }
                    }
                } catch (error) {
                    console.error('Failed to fetch event:', error);
                    notFound();
                } finally {
                    setLoading(false);
                }
            }
        };

        initPage();
    }, [params]);

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

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative h-[50vh] min-h-[400px]">
                <Image
                    src={event.image}
                    alt={event.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent" />

                <div className="absolute inset-0 flex items-end">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12 w-full">
                        <Link
                            href="/events"
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white mb-6 transition-colors"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            All Events
                        </Link>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
                            {event.name} Entertainment
                        </h1>
                        <p className="text-xl text-gray-300 max-w-2xl">
                            {event.description}
                        </p>
                    </div>
                </div>
            </section>

            {/* Popular Categories for this Event */}
            <section className="py-12 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-lg text-gray-400 mb-6">Popular for {event.name}</h2>
                    <div className="flex flex-wrap gap-3">
                        {event.popularCategories?.map((category: string) => {
                            const cat = mockCategories.find((c) => c.name === category);
                            return (
                                <Link
                                    key={category}
                                    href={`/artists/${cat?.slug || ''}`}
                                    className="px-6 py-3 bg-[#1a1a1a] text-white rounded-full border border-gray-800 hover:border-orange-500 hover:bg-gradient-to-r hover:from-orange-500/10 hover:to-pink-600/10 transition-all"
                                >
                                    {category}
                                </Link>
                            );
                        })}
                        {!event.popularCategories && event.performers && (
                            <span className="px-6 py-3 bg-[#1a1a1a] text-gray-400 rounded-full border border-gray-800">
                                {event.performers.length} Featured Artists
                            </span>
                        )}
                    </div>
                </div>
            </section>

            {/* Recommended Artists */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Recommended Artists</h2>
                            <p className="text-gray-400">
                                {relevantArtists.length > 0
                                    ? `Perfect performers for your ${event.name.toLowerCase()}`
                                    : 'No artists available yet'}
                            </p>
                        </div>
                        {relevantArtists.length > 0 && (
                            <Link
                                href="/search"
                                className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1"
                            >
                                View All <ArrowRight className="w-4 h-4" />
                            </Link>
                        )}
                    </div>

                    {relevantArtists.length > 0 ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                            {relevantArtists.map((artist) => (
                                <ArtistCard key={artist.id} artist={artist} />
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-gray-500 mb-6">No artists found for this event type yet.</p>
                            <Link
                                href="/post-requirement"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Post Your Requirement
                                <ArrowRight className="w-4 h-4" />
                            </Link>
                        </div>
                    )}
                </div>
            </section>
        </div>
    );
}
