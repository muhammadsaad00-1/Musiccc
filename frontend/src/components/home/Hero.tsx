import Link from 'next/link';
import SearchBar from '@/components/ui/SearchBar';
import { Mic2, Music, Star, MapPin, Sparkles } from 'lucide-react';

const popularCategories = [
    { name: 'Singers', slug: 'singers', icon: '🎤' },
    { name: 'Qawwals', slug: 'qawwals', icon: '🎵' },
    { name: 'Sufi Artists', slug: 'sufi-artists', icon: '✨' },
    { name: 'Live Bands', slug: 'live-bands', icon: '🎸' },
    { name: 'DJs', slug: 'djs', icon: '🎧' },
];

const eventTypes = [
    { name: 'Weddings', slug: 'wedding', highlight: true },
    { name: 'Concerts', slug: 'concert', highlight: true },
    { name: 'Mehendi', slug: 'mehendi', highlight: false },
    { name: 'Corporate', slug: 'corporate', highlight: false },
];

export default function Hero() {
    return (
        <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#0a0a0b]">
            {/* Background Effects */}
            <div className="absolute inset-0">
                {/* Gradient orbs */}
                <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-500/10 rounded-full blur-[150px]" />

                {/* Decorative music notes */}
                <div className="absolute top-32 right-20 text-4xl opacity-10 animate-pulse">🎵</div>
                <div className="absolute bottom-40 left-20 text-5xl opacity-10 animate-pulse delay-1000">🎤</div>
            </div>

            {/* Content */}
            <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                {/* Badge */}
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-pink-600/10 rounded-full text-gray-300 text-sm mb-8 border border-orange-500/30">
                    <Mic2 className="w-4 h-4 text-orange-400" />
                    <span>Pakistan's Premier Artist Booking Platform</span>
                    <Sparkles className="w-4 h-4 text-pink-400" />
                </div>

                {/* Heading */}
                <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
                    Book <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">Singers & Qawwals</span>
                    <span className="block mt-2">for Your Events</span>
                </h1>

                {/* Subtitle */}
                <p className="text-lg sm:text-xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                    From soulful <span className="text-white font-medium">Qawwals</span> to chart-topping <span className="text-white font-medium">Singers</span> —
                    book the perfect musical talent for weddings, concerts, and celebrations across <span className="text-orange-400">Lahore, Karachi, Islamabad</span> & beyond.
                </p>

                {/* Event Type Quick Links */}
                <div className="flex flex-wrap justify-center gap-3 mb-8">
                    {eventTypes.map((event) => (
                        <Link
                            key={event.slug}
                            href={`/events/${event.slug}`}
                            className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${event.highlight
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-500/30'
                                    : 'bg-[#1a1a1a] text-gray-300 border border-gray-800 hover:border-gray-700'
                                }`}
                        >
                            {event.name}
                        </Link>
                    ))}
                </div>

                {/* Search Bar */}
                <div className="max-w-3xl mx-auto mb-8">
                    <SearchBar size="large" />
                </div>

                {/* Popular Categories */}
                <div className="flex flex-wrap justify-center gap-3 text-sm mb-12">
                    <span className="text-gray-500 flex items-center gap-1">
                        <Star className="w-4 h-4 text-yellow-400" />
                        Popular:
                    </span>
                    {popularCategories.map((cat) => (
                        <Link
                            key={cat.slug}
                            href={`/artists/${cat.slug}`}
                            className="px-4 py-1.5 bg-[#1a1a1a] hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-pink-600/20 text-gray-300 hover:text-white rounded-full border border-gray-800 hover:border-orange-500/50 transition-all flex items-center gap-1.5"
                        >
                            <span>{cat.icon}</span>
                            {cat.name}
                        </Link>
                    ))}
                </div>

                {/* Stats */}
                <div className="flex flex-wrap justify-center gap-8 sm:gap-16 pt-8 border-t border-gray-800">
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-white">200+</div>
                        <div className="text-gray-500 text-sm mt-1">Singers & Qawwals</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-white">5,000+</div>
                        <div className="text-gray-500 text-sm mt-1">Events Performed</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold text-white">20+</div>
                        <div className="text-gray-500 text-sm mt-1">Cities in Pakistan</div>
                    </div>
                    <div className="text-center">
                        <div className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-orange-400 to-pink-500 bg-clip-text text-transparent">4.9★</div>
                        <div className="text-gray-500 text-sm mt-1">Average Rating</div>
                    </div>
                </div>
            </div>

            {/* Scroll Indicator */}
            <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce">
                <div className="w-6 h-10 border-2 border-gray-700 rounded-full flex justify-center pt-2">
                    <div className="w-1 h-2 bg-gradient-to-b from-orange-500 to-pink-600 rounded-full" />
                </div>
            </div>
        </section>
    );
}
