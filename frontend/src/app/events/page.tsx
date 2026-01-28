import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Users, Music, Sparkles, PartyPopper, ArrowRight } from 'lucide-react';
import { eventTypeDetails } from '@/lib/mockData';

const eventIcons: { [key: string]: React.ReactNode } = {
    wedding: <Sparkles className="w-8 h-8" />,
    corporate: <Users className="w-8 h-8" />,
    birthday: <PartyPopper className="w-8 h-8" />,
    mehendi: <Sparkles className="w-8 h-8" />,
    concert: <Music className="w-8 h-8" />,
};

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
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
            </section>

            {/* Event Types Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventTypeDetails.map((event) => (
                            <Link
                                key={event.id}
                                href={`/events/${event.slug}`}
                                className="group relative overflow-hidden rounded-3xl border border-gray-800 hover:border-gray-700 transition-all duration-500"
                            >
                                {/* Background Image */}
                                <div className="relative h-80">
                                    <Image
                                        src={event.image}
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
                                        {eventIcons[event.id] || <Calendar className="w-8 h-8" />}
                                    </div>

                                    <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-orange-400 transition-colors">
                                        {event.name}
                                    </h3>
                                    <p className="text-gray-400 text-sm mb-4">
                                        {event.description}
                                    </p>

                                    {/* Popular Categories */}
                                    <div className="flex flex-wrap gap-2 mb-4">
                                        {event.popularCategories.slice(0, 3).map((cat) => (
                                            <span key={cat} className="px-2 py-1 bg-[#1a1a1a] text-gray-400 text-xs rounded-full border border-gray-800">
                                                {cat}
                                            </span>
                                        ))}
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span className="text-sm text-gray-500">{event.priceRange}</span>
                                        <span className="flex items-center gap-1 text-orange-400 text-sm font-medium group-hover:translate-x-1 transition-transform">
                                            Explore <ArrowRight className="w-4 h-4" />
                                        </span>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

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
