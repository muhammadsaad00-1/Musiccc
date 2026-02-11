'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, Music, Sparkles, PartyPopper, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import FAQSection from '@/components/ui/FAQSection';


const eventIcons: { [key: string]: React.ReactNode } = {
    wedding: <Sparkles className="w-8 h-8" />,
    corporate: <Users className="w-8 h-8" />,
    birthday: <PartyPopper className="w-8 h-8" />,
    mehendi: <Sparkles className="w-8 h-8" />,
    concert: <Music className="w-8 h-8" />,
};

interface Event {
    id: string;
    name: string;
    description: string;
    event_recommendations: string;
    pricing: number;
    header_image_url: string;
    performers: any[];
}

export default function EventsPage() {
    const [backendEvents, setBackendEvents] = useState<Event[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchEvents = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/events');
                if (response.ok) {
                    const data = await response.json();
                    setBackendEvents(data);
                }
            } catch (error) {
                console.error('Failed to fetch events:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchEvents();
    }, []);

    // Create slug from event name
    const createSlug = (name: string) => {
        return name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
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
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full text-gray-300 text-sm mb-6 border border-gray-800">
                            <Calendar className="w-4 h-4 text-orange-400" />
                            <span>Find Artists for Your Event</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Browse by
                            <span className="block bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                                Event Type
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Find the perfect entertainment tailored for your specific occasion
                        </p>
                    </div>
                </div>
            </section>

            {/* Event Types Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : backendEvents.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {/* Events from API */}
                            {backendEvents.map((event) => (
                                <Link
                                    key={event.id}
                                    href={`/events/${createSlug(event.name)}`}
                                    className="group relative overflow-hidden rounded-3xl border border-gray-800 hover:border-gray-700 transition-all duration-500"
                                >
                                    {/* Background Image */}
                                    <div className="relative h-80">
                                        <Image
                                            src={event.header_image_url || 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800'}
                                            alt={event.name}
                                            fill
                                            className="object-cover group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/60 to-transparent" />
                                    </div>

                                    {/* Content */}
                                    <div className="absolute bottom-0 left-0 right-0 p-6">
                                        {/* Icon */}
                                        <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform">
                                            <Calendar className="w-8 h-8" />
                                        </div>

                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                            {event.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {event.description || event.event_recommendations}
                                        </p>

                                        {/* Performers Count */}
                                        {event.performers && event.performers.length > 0 && (
                                            <div className="flex flex-wrap gap-2 mb-4">
                                                <span className="px-2 py-1 bg-[#1a1a1a] text-gray-400 text-xs rounded-full border border-gray-800">
                                                    {event.performers.length} Artists
                                                </span>
                                            </div>
                                        )}

                                        <div className="flex items-center justify-between">
                                            <span className="text-sm text-gray-500">
                                                {event.pricing ? `PKR ${event.pricing.toLocaleString()}+` : 'Custom Pricing'}
                                            </span>
                                            <span className="flex items-center gap-1 text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                                Explore <ArrowRight className="w-4 h-4" />
                                            </span>
                                        </div>
                                    </div>
                                </Link>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Calendar className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No Events Available</h3>
                            <p className="text-gray-400 mb-8">Check back soon for upcoming events</p>
                            <Link
                                href="/post-requirement"
                                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Post Your Requirement
                            </Link>
                        </div>
                    )}
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection
                title="Event Questions?"
                subtitle="Everything you need to know about booking for different events"
                faqs={[
                    {
                        question: "What types of events do you cater to?",
                        answer: "We cater to all types of events including weddings, corporate events, birthday parties, mehendi ceremonies, concerts, and private celebrations."
                    },
                    {
                        question: "How far in advance should I book?",
                        answer: "We recommend booking at least 2-4 weeks before your event. For popular artists or peak wedding season, booking 1-2 months in advance is ideal."
                    },
                    {
                        question: "Can artists travel to my event location?",
                        answer: "Yes! Most artists are willing to travel. Travel arrangements and any additional costs will be discussed during the booking process."
                    },
                    {
                        question: "What if I need multiple artists?",
                        answer: "We can help you book multiple artists for your event. Contact us with your requirements and we'll create a custom package for you."
                    }
                ]}
            />

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Can't find what you're looking for?</h2>
                    <p className="text-gray-400 mb-8">Tell us about your event and we'll recommend the perfect artists</p>
                    <Link
                        href="/post-requirement"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        Post Your Requirement
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
