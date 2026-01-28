import { notFound } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import ArtistCard from '@/components/artists/ArtistCard';
import { eventTypeDetails, mockArtists, mockCategories } from '@/lib/mockData';

interface EventTypePageProps {
    params: Promise<{ type: string }>;
}

export async function generateStaticParams() {
    return eventTypeDetails.map((event) => ({
        type: event.slug,
    }));
}

export default async function EventTypePage({ params }: EventTypePageProps) {
    const { type } = await params;
    const event = eventTypeDetails.find((e) => e.slug === type);

    if (!event) {
        notFound();
    }

    // Get artists from popular categories for this event type
    const relevantCategoryIds = mockCategories
        .filter((cat) => event.popularCategories.includes(cat.name))
        .map((cat) => cat.id);

    const relevantArtists = mockArtists.filter((artist) =>
        relevantCategoryIds.includes(artist.category_id)
    );

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
                        {event.popularCategories.map((category) => {
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
                    </div>
                </div>
            </section>

            {/* Recommended Artists */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between mb-8">
                        <div>
                            <h2 className="text-2xl font-bold text-white mb-2">Recommended Artists</h2>
                            <p className="text-gray-400">Perfect performers for your {event.name.toLowerCase()}</p>
                        </div>
                        <Link
                            href="/search"
                            className="text-orange-400 hover:text-orange-300 font-medium flex items-center gap-1"
                        >
                            View All <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {relevantArtists.map((artist) => (
                            <ArtistCard key={artist.id} artist={artist} />
                        ))}
                    </div>

                    {relevantArtists.length === 0 && (
                        <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
                            <p className="text-gray-400">No artists found for this event type yet.</p>
                        </div>
                    )}
                </div>
            </section>

            {/* Price Range Info */}
            <section className="py-16 bg-[#0f0f10]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Budget Guide</h2>
                    <p className="text-gray-400 mb-6">
                        Typical entertainment budget for {event.name.toLowerCase()} events in Pakistan
                    </p>
                    <div className="inline-block px-8 py-4 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-2xl border border-orange-500/30">
                        <span className="text-2xl font-bold text-white">{event.priceRange}</span>
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Planning a {event.name}?</h2>
                    <p className="text-gray-400 mb-8">Get personalized artist recommendations for your event</p>
                    <Link
                        href="/post-requirement"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        Get Recommendations
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
