'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';
import { Menu, X, Search, ChevronDown, Zap, Mic2, Music, Home, Star, Calendar, Info, Phone } from 'lucide-react';
import { useCategories } from '@/lib/hooks';

// Icon mapping for categories
const categoryIcons: Record<string, string> = {
    'Singers': '🎤',
    'Singer': '🎤',
    'Qawwals': '🎵',
    'Qawwal': '🎵',
    'Live Bands': '🎸',
    'Band': '🎸',
    'Bhangra Artists': '💃',
    'Bhangra': '💃',
    'DJs': '🎧',
    'DJ': '🎧',
    'Musicians': '🎹',
    'Musician': '🎹',
    'Comedians': '🎭',
    'Comedian': '🎭',
    'Photographers': '📸',
    'Photographer': '📸',
    'Photography': '📸',
    'Sufi': '✨',
    'Sufi Artists': '✨',
    'Ghazal': '🎻',
    'Ghazal Artists': '🎻',
    'Folk': '🪕',
    'Folk Singers': '🪕',
    'Classical': '🎼',
    'Classical Musicians': '🎼',
    'Dancer': '👯',
    'Anchor': '🎙️',
    'Makeup Artist': '💄',
    'Mehndi Artist': '🎨',
    'Decorator': '🎈',
};

const eventTypes = [
    { name: 'Wedding & Mehndi', slug: 'wedding', icon: '💍' },
    { name: 'Corporate Event', slug: 'corporate', icon: '🏢' },
    { name: 'College Event', slug: 'college-event', icon: '🎓' },
    { name: 'Birthday Party', slug: 'birthday', icon: '🎂' },
    { name: 'Luxury Resort', slug: 'resort-event', icon: '🛳️' },
    { name: 'Private Party', slug: 'private-party', icon: '🎉' },
    { name: 'Luxury / Resort / Cruise', slug: 'luxury-resort-cruise', icon: '🛳️' },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [artistCategories, setArtistCategories] = useState<any[]>([]);

    // Use React Query hook to fetch categories
    const { data: categories } = useCategories();

    // Transform categories when data is fetched
    useEffect(() => {
        if (categories) {
            const transformed = categories.map((cat: any) => ({
                name: cat.name,
                slug: cat.slug,
                icon: categoryIcons[cat.name] || categoryIcons[cat.name?.split(' ')[0]] || '🎵',
                hot: cat.artist_count > 10, // Mark as hot if has more than 10 artists
            }));
            setArtistCategories(transformed);
        }
    }, [categories]);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/95 backdrop-blur-md border-b border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24 lg:h-26">
                    {/* Logo */}
                    <Link href="/" className="flex items-end space-x-3 pb-1">
                        <Image
                            src="/the_artist_factory_logo-04 (1).png"
                            alt="The Artist Factory"
                            width={120}
                            height={120}
                            className="w-16 h-16 md:w-20 md:h-20 object-contain"
                            priority
                        />
                        <div className="flex flex-col justify-end pb-1 md:pb-2">
                            <span className="text-xl md:text-2xl font-bold text-white tracking-tight leading-none">The Artist Factory</span>
                            <span className="text-[10px] md:text-xs text-orange-400 italic font-medium mt-1">Bringing stars to your event!</span>
                        </div>
                    </Link>

                    {/* Desktop Navigation */}
                    <nav className="hidden lg:flex items-center space-x-8">
                        {/* Home */}
                        <Link
                            href="/"
                            className="flex items-center gap-1 text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300"
                        >
                            Home
                        </Link>

                        {/* Artists Dropdown */}
                        <div
                            className="relative"
                            onMouseEnter={() => setIsDropdownOpen(true)}
                            onMouseLeave={() => setIsDropdownOpen(false)}
                        >
                            <button className="flex items-center space-x-1 text-white hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300 py-6">
                                <span>Artists</span>
                                <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${isDropdownOpen ? 'rotate-180' : ''}`} />
                            </button>

                            {/* Mega Menu Dropdown */}
                            {isDropdownOpen && (
                                <>
                                    <div className="absolute top-full left-0 right-0 h-2" />
                                    <div className="absolute top-[calc(100%+8px)] left-1/2 -translate-x-1/2 w-[700px] bg-gradient-to-br from-[#1a1a1a] via-[#1f1f1f] to-[#1a1a1a] backdrop-blur-xl rounded-2xl shadow-2xl border border-gray-700 py-6 px-8 animate-fadeIn">
                                        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-orange-500/20 via-pink-600/20 to-orange-500/20 opacity-50 blur-xl -z-10" />
                                        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-[#1a1a1a] rotate-45 border-l border-t border-gray-700" />

                                        <div className="grid grid-cols-2 gap-8">
                                            {/* Artists Column */}
                                            <div>
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <Star className="w-3 h-3" /> Artists
                                                </h3>
                                                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar" data-lenis-prevent>
                                                    {artistCategories.map((category) => (
                                                        <Link
                                                            key={category.slug}
                                                            href={`/artists/${category.slug}`}
                                                            className="flex items-center gap-2 text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 transition-all duration-200"
                                                        >
                                                            <span>{category.icon}</span>
                                                            <span className="text-sm font-medium">{category.name}</span>
                                                            {category.hot && (
                                                                <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">HOT</span>
                                                            )}
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        href="/categories"
                                                        className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-all duration-200 pt-2 border-t border-gray-800 font-bold"
                                                    >
                                                        <span>📂</span>
                                                        <span className="text-sm">View All Categories</span>
                                                    </Link>
                                                </div>
                                            </div>


                                            {/* Events Column */}
                                            <div>
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <Calendar className="w-3 h-3" /> Events
                                                </h3>
                                                <div className="space-y-3">
                                                    {eventTypes.map((event) => (
                                                        <Link
                                                            key={event.slug}
                                                            href={`/events/${event.slug}`}
                                                            className="flex items-center gap-2 text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 transition-all duration-200"
                                                        >
                                                            <span>{event.icon}</span>
                                                            <span className="text-sm font-medium">{event.name}</span>
                                                        </Link>
                                                    ))}
                                                    <Link
                                                        href="/events"
                                                        className="flex items-center gap-2 text-orange-400 hover:text-orange-300 transition-all duration-200 pt-2 border-t border-gray-800 font-bold"
                                                    >
                                                        <span>📅</span>
                                                        <span className="text-sm">View All Events</span>
                                                    </Link>
                                                </div>
                                            </div>

                                        </div>
                                    </div>
                                </>
                            )}
                        </div>

                        {/* Express Booking */}
                        <Link
                            href="/post-requirement"
                            className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-medium transition-colors"
                        >
                            <Zap className="w-4 h-4" />
                            Express Booking
                        </Link>

                        {/* Gallery */}
                        <Link
                            href="/gallery"
                            className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300"
                        >
                            Gallery
                        </Link>

                        {/* About Us */}
                        <Link
                            href="/about"
                            className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300"
                        >
                            About Us
                        </Link>

                        {/* Testimonials */}
                        <Link
                            href="/testimonials"
                            className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300"
                        >
                            Testimonials
                        </Link>

                        {/* Contact Us */}
                        <Link
                            href="/contact"
                            className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300"
                        >
                            Contact Us
                        </Link>

                        {/* Blog */}
                        <Link
                            href="/blog"
                            className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300"
                        >
                            Blog
                        </Link>
                    </nav>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link
                            href="/artists"
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2.5 text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:border-orange-500/40 hover:text-white transition-all"
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-white/10 animate-slideDown max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#111113] via-[#141416] to-[#0f0f10] backdrop-blur-xl" data-lenis-prevent>
                    <div className="px-4 py-5 space-y-4">
                        {/* Home */}
                        <Link
                            href="/"
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-white/5 border border-white/10 text-white font-semibold"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Home className="w-4 h-4 text-orange-400" /> Home
                        </Link>

                        {/* Artists */}
                        <div className="p-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
                            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Mic2 className="w-3 h-3" /> Artists
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {artistCategories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        href={`/artists/${category.slug}`}
                                        className="flex items-center gap-2 text-gray-200 hover:text-white py-2 px-2 rounded-lg bg-black/20 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-pink-500/20 transition-all text-sm border border-transparent hover:border-orange-400/30"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{category.icon}</span>
                                        {category.name}
                                        {category.hot && (
                                            <span className="px-1 py-0.5 text-[8px] bg-red-500 text-white rounded">HOT</span>
                                        )}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Events */}
                        <div className="p-3 rounded-2xl border border-white/10 bg-gradient-to-br from-white/5 to-white/[0.02]">
                            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Events
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {eventTypes.map((event) => (
                                    <Link
                                        key={event.slug}
                                        href={`/events/${event.slug}`}
                                        className="flex items-center gap-2 text-gray-200 hover:text-white py-2 px-2 rounded-lg bg-black/20 hover:bg-gradient-to-r hover:from-orange-500/20 hover:to-pink-500/20 transition-all text-sm border border-transparent hover:border-orange-400/30"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{event.icon}</span>
                                        {event.name}
                                    </Link>
                                ))}
                                <Link
                                    href="/events"
                                    className="flex items-center gap-2 text-orange-400 font-bold py-2 px-2 rounded-lg bg-orange-500/10 border border-orange-500/20 text-sm"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <span>📅</span>
                                    View All Events
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links */}
                        <Link href="/post-requirement" className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-semibold" onClick={() => setIsMenuOpen(false)}>
                            <Zap className="w-4 h-4" />
                            Express Booking
                        </Link>
                        <Link href="/gallery" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-gray-300 bg-white/5 border border-white/10 hover:text-white hover:border-orange-500/30 transition-all font-medium" onClick={() => setIsMenuOpen(false)}>
                            <Star className="w-4 h-4 text-orange-400" /> Gallery
                        </Link>
                        <Link href="/about" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-gray-300 bg-white/5 border border-white/10 hover:text-white hover:border-orange-500/30 transition-all font-medium" onClick={() => setIsMenuOpen(false)}>
                            <Info className="w-4 h-4 text-orange-400" /> About Us
                        </Link>
                        <Link href="/testimonials" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-gray-300 bg-white/5 border border-white/10 hover:text-white hover:border-orange-500/30 transition-all font-medium" onClick={() => setIsMenuOpen(false)}>
                            <Star className="w-4 h-4 text-orange-400" /> Testimonials
                        </Link>
                        <Link href="/contact" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-gray-300 bg-white/5 border border-white/10 hover:text-white hover:border-orange-500/30 transition-all font-medium" onClick={() => setIsMenuOpen(false)}>
                            <Phone className="w-4 h-4 text-orange-400" /> Contact Us
                        </Link>
                        <Link href="/blog" className="flex items-center gap-2 rounded-xl px-3 py-2.5 text-gray-300 bg-white/5 border border-white/10 hover:text-white hover:border-orange-500/30 transition-all font-medium" onClick={() => setIsMenuOpen(false)}>
                            <Music className="w-4 h-4 text-orange-400" /> Blog
                        </Link>

                        {/* CTA */}
                        <Link
                            href="/post-requirement"
                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/30 transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Express Booking
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
