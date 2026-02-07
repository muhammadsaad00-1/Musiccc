'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Menu, X, Search, ChevronDown, Zap, Mic2, Music, Home, MapPin, Star, Calendar, Info, Phone } from 'lucide-react';

// Pakistan-focused artist categories
const artistCategories = [
    { name: 'Singers', slug: 'singers', icon: '🎤', hot: true },
    { name: 'Qawwals', slug: 'qawwals', icon: '🎵', hot: true },
    { name: 'Live Bands', slug: 'live-bands', icon: '🎸', hot: false },
    { name: 'Sufi Artists', slug: 'sufi-artists', icon: '✨', hot: true },
    { name: 'Folk Singers', slug: 'folk-singers', icon: '🎶', hot: false },
    { name: 'Classical Musicians', slug: 'classical-musicians', icon: '🎻', hot: false },
    { name: 'Ghazal Artists', slug: 'ghazal-artists', icon: '💫', hot: false },
    { name: 'DJs', slug: 'djs', icon: '🎧', hot: false },
];

// Event types
const eventTypes = [
    { name: 'Wedding', slug: 'wedding', icon: '💍' },
    { name: 'Mehendi', slug: 'mehendi', icon: '🌙' },
    { name: 'Concert', slug: 'concert', icon: '🎭' },
    { name: 'Corporate Event', slug: 'corporate', icon: '🏢' },
    { name: 'Private Party', slug: 'private-party', icon: '🎉' },
    { name: 'Milad/Religious', slug: 'milad', icon: '🕌' },
];

// Major Pakistani cities
const cities = [
    { name: 'Lahore', slug: 'lahore' },
    { name: 'Karachi', slug: 'karachi' },
    { name: 'Islamabad', slug: 'islamabad' },
    { name: 'Rawalpindi', slug: 'rawalpindi' },
    { name: 'Faisalabad', slug: 'faisalabad' },
    { name: 'Multan', slug: 'multan' },
];

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/95 backdrop-blur-md border-b border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16 lg:h-20">
                    {/* Logo */}
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
                            <Mic2 className="w-5 h-5 text-white" />
                        </div>
                        <div className="hidden sm:block">
                            <span className="text-xl font-bold text-white">ArtistFactory</span>
                            <span className="block text-[10px] text-gray-500 -mt-1">Book Artists in Pakistan</span>
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
                            <button className="flex items-center space-x-1 text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300 py-6">
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

                                        <div className="grid grid-cols-3 gap-8">
                                            {/* Artists Column */}
                                            <div>
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <Star className="w-3 h-3" /> Artists
                                                </h3>
                                                <div className="space-y-3">
                                                    {artistCategories.map((category) => (
                                                        <Link
                                                            key={category.slug}
                                                            href={`/artists?category=${category.slug}`}
                                                            className="flex items-center gap-2 text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 transition-all duration-200"
                                                        >
                                                            <span>{category.icon}</span>
                                                            <span className="text-sm font-medium">{category.name}</span>
                                                            {category.hot && (
                                                                <span className="px-1.5 py-0.5 text-[10px] bg-red-500 text-white rounded-full">HOT</span>
                                                            )}
                                                        </Link>
                                                    ))}
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
                                                </div>
                                            </div>

                                            {/* Cities Column */}
                                            <div>
                                                <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                                                    <MapPin className="w-3 h-3" /> Cities
                                                </h3>
                                                <div className="space-y-3">
                                                    {cities.map((city) => (
                                                        <Link
                                                            key={city.slug}
                                                            href={`/search?city=${city.slug}`}
                                                            className="block text-sm text-gray-400 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 transition-all duration-200 font-medium"
                                                        >
                                                            {city.name}
                                                        </Link>
                                                    ))}
                                                </div>

                                                {/* Quick CTA */}
                                                <Link
                                                    href="/search"
                                                    className="mt-6 block px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-center text-sm font-semibold rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                                                >
                                                    Browse All Artists
                                                </Link>
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

                        {/* About Us */}
                        <Link
                            href="/about"
                            className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300"
                        >
                            About Us
                        </Link>

                        {/* Contact Us */}
                        <Link
                            href="/contact"
                            className="text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300"
                        >
                            Contact Us
                        </Link>
                    </nav>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center space-x-4">
                        <Link
                            href="/search"
                            className="p-2 text-gray-400 hover:text-white transition-colors"
                        >
                            <Search className="w-5 h-5" />
                        </Link>
                        <Link
                            href="/post-requirement"
                            className="px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all text-sm"
                        >
                            Book Now
                        </Link>
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden p-2 text-gray-400"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {isMenuOpen && (
                <div className="lg:hidden bg-[#1a1a1a] border-t border-gray-800 animate-slideDown max-h-[80vh] overflow-y-auto">
                    <div className="px-4 py-4 space-y-4">
                        {/* Home */}
                        <Link
                            href="/"
                            className="block py-2 text-white font-medium"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            🏠 Home
                        </Link>

                        {/* Artists */}
                        <div className="pb-4 border-b border-gray-800">
                            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Mic2 className="w-3 h-3" /> Artists
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {artistCategories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        href={`/artists?category=${category.slug}`}
                                        className="flex items-center gap-2 text-gray-300 hover:text-white py-1.5 text-sm"
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
                        <div className="pb-4 border-b border-gray-800">
                            <p className="text-xs font-semibold text-orange-400 uppercase tracking-wider mb-3 flex items-center gap-2">
                                <Calendar className="w-3 h-3" /> Events
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {eventTypes.map((event) => (
                                    <Link
                                        key={event.slug}
                                        href={`/events/${event.slug}`}
                                        className="flex items-center gap-2 text-gray-300 hover:text-white py-1.5 text-sm"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span>{event.icon}</span>
                                        {event.name}
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Quick Links */}
                        <Link href="/post-requirement" className="flex items-center gap-2 py-2 text-yellow-400 font-medium" onClick={() => setIsMenuOpen(false)}>
                            <Zap className="w-4 h-4" />
                            Express Booking
                        </Link>
                        <Link href="/about" className="block py-2 text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>
                            ℹ️ About Us
                        </Link>
                        <Link href="/contact" className="block py-2 text-gray-300 font-medium" onClick={() => setIsMenuOpen(false)}>
                            📞 Contact Us
                        </Link>

                        {/* CTA */}
                        <Link
                            href="/post-requirement"
                            className="block w-full text-center px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:shadow-lg transition-all"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Book Now
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
