'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect, useRef, type ReactNode } from 'react';
import {
    Menu, X, Search, ChevronDown, Zap, Mic2, Music, Home, Star, Calendar, Info, Phone,
    Mic, Guitar, Drum, Headphones, Piano, Theater, Camera, Sparkles, MusicIcon,
    PersonStanding, Megaphone, Paintbrush, Palette, PartyPopper,
    Heart, Building2, GraduationCap, Cake, Ship, Tent, Globe, Handshake, Landmark,
    ArrowRight, LayoutGrid, Music2
} from 'lucide-react';
import { useCategories } from '@/lib/hooks';

const categoryIconMap: Record<string, { icon: ReactNode; color: string; bg: string }> = {
    'Singers': { icon: <Mic className="w-4 h-4" />, color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/20' },
    'Singer': { icon: <Mic className="w-4 h-4" />, color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/20' },
    'Qawwals': { icon: <Music className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/20' },
    'Qawwal': { icon: <Music className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/20' },
    'Live Bands': { icon: <Guitar className="w-4 h-4" />, color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/20' },
    'Live bands': { icon: <Guitar className="w-4 h-4" />, color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/20' },
    'Band': { icon: <Guitar className="w-4 h-4" />, color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/20' },
    'Bhangra Artists': { icon: <Drum className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/20' },
    'Bhangra': { icon: <Drum className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/20' },
    'DJs': { icon: <Headphones className="w-4 h-4" />, color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/20' },
    'DJ': { icon: <Headphones className="w-4 h-4" />, color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/20' },
    'Musicians': { icon: <Piano className="w-4 h-4" />, color: 'text-teal-400', bg: 'bg-teal-500/15 border-teal-500/20' },
    'Musician': { icon: <Piano className="w-4 h-4" />, color: 'text-teal-400', bg: 'bg-teal-500/15 border-teal-500/20' },
    'Comedians': { icon: <Theater className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/20' },
    'Comedian': { icon: <Theater className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/20' },
    'Photographers': { icon: <Camera className="w-4 h-4" />, color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/20' },
    'Photographer': { icon: <Camera className="w-4 h-4" />, color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/20' },
    'Photography': { icon: <Camera className="w-4 h-4" />, color: 'text-cyan-400', bg: 'bg-cyan-500/15 border-cyan-500/20' },
    'Sufi': { icon: <Sparkles className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20' },
    'Sufi Artists': { icon: <Sparkles className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20' },
    'Ghazal': { icon: <Music2 className="w-4 h-4" />, color: 'text-pink-400', bg: 'bg-pink-500/15 border-pink-500/20' },
    'Ghazal Artists': { icon: <Music2 className="w-4 h-4" />, color: 'text-pink-400', bg: 'bg-pink-500/15 border-pink-500/20' },
    'Folk': { icon: <MusicIcon className="w-4 h-4" />, color: 'text-lime-400', bg: 'bg-lime-500/15 border-lime-500/20' },
    'Folk Singers': { icon: <MusicIcon className="w-4 h-4" />, color: 'text-lime-400', bg: 'bg-lime-500/15 border-lime-500/20' },
    'Classical': { icon: <Piano className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/20' },
    'Classical Musicians': { icon: <Piano className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/20' },
    'Dancer': { icon: <PersonStanding className="w-4 h-4" />, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/15 border-fuchsia-500/20' },
    'Anchor': { icon: <Megaphone className="w-4 h-4" />, color: 'text-blue-400', bg: 'bg-blue-500/15 border-blue-500/20' },
    'Makeup Artist': { icon: <Paintbrush className="w-4 h-4" />, color: 'text-pink-300', bg: 'bg-pink-400/15 border-pink-400/20' },
    'Mehndi Artist': { icon: <Palette className="w-4 h-4" />, color: 'text-amber-300', bg: 'bg-amber-400/15 border-amber-400/20' },
    'Decorator': { icon: <PartyPopper className="w-4 h-4" />, color: 'text-red-400', bg: 'bg-red-500/15 border-red-500/20' },
    'Cultural Artists': { icon: <Globe className="w-4 h-4" />, color: 'text-teal-400', bg: 'bg-teal-500/15 border-teal-500/20' },
    'Instrumental': { icon: <Piano className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/20' },
};

const defaultCategoryIcon = { icon: <Music className="w-4 h-4" />, color: 'text-gray-400', bg: 'bg-gray-500/15 border-gray-500/20' };

const eventTypes = [
    { name: 'Wedding & Mehndi', slug: 'wedding', icon: <Heart className="w-4 h-4" />, color: 'text-rose-400', bg: 'bg-rose-500/15 border-rose-500/20' },
    { name: 'Corporate Event', slug: 'corporate', icon: <Building2 className="w-4 h-4" />, color: 'text-sky-400', bg: 'bg-sky-500/15 border-sky-500/20' },
    { name: 'College Event', slug: 'college-event', icon: <GraduationCap className="w-4 h-4" />, color: 'text-violet-400', bg: 'bg-violet-500/15 border-violet-500/20' },
    { name: 'Birthday Party', slug: 'birthday', icon: <Cake className="w-4 h-4" />, color: 'text-pink-400', bg: 'bg-pink-500/15 border-pink-500/20' },
    { name: 'Luxury Resort', slug: 'resort-event', icon: <Ship className="w-4 h-4" />, color: 'text-teal-400', bg: 'bg-teal-500/15 border-teal-500/20' },
    { name: 'Private Party', slug: 'private-party', icon: <PartyPopper className="w-4 h-4" />, color: 'text-amber-400', bg: 'bg-amber-500/15 border-amber-500/20' },
    { name: 'Festival', slug: 'festival', icon: <Tent className="w-4 h-4" />, color: 'text-orange-400', bg: 'bg-orange-500/15 border-orange-500/20' },
    { name: 'Cultural Exchange', slug: 'cultural-exchange', icon: <Globe className="w-4 h-4" />, color: 'text-emerald-400', bg: 'bg-emerald-500/15 border-emerald-500/20' },
    { name: 'Embassy / Diplomatic', slug: 'embassy-diplomatic', icon: <Handshake className="w-4 h-4" />, color: 'text-yellow-400', bg: 'bg-yellow-500/15 border-yellow-500/20' },
    { name: 'Government Event', slug: 'government-event', icon: <Landmark className="w-4 h-4" />, color: 'text-indigo-400', bg: 'bg-indigo-500/15 border-indigo-500/20' },
];

function getCategoryIcon(name: string) {
    return categoryIconMap[name] || categoryIconMap[name?.split(' ')[0]] || defaultCategoryIcon;
}

export default function Header() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isArtistDropdownOpen, setIsArtistDropdownOpen] = useState(false);
    const [isEventsDropdownOpen, setIsEventsDropdownOpen] = useState(false);
    const [artistCategories, setArtistCategories] = useState<any[]>([]);
    const artistTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
    const eventsTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const { data: categories } = useCategories();

    useEffect(() => {
        if (categories) {
            const transformed = categories.map((cat: any) => ({
                name: cat.name,
                slug: cat.slug,
                hot: cat.artist_count > 10,
                ...getCategoryIcon(cat.name),
            }));
            setArtistCategories(transformed);
        }
    }, [categories]);

    function openArtistMenu() {
        if (artistTimerRef.current) clearTimeout(artistTimerRef.current);
        if (eventsTimerRef.current) clearTimeout(eventsTimerRef.current);
        setIsArtistDropdownOpen(true);
        setIsEventsDropdownOpen(false);
    }
    function scheduleCloseArtistMenu() {
        artistTimerRef.current = setTimeout(() => setIsArtistDropdownOpen(false), 150);
    }
    function openEventsMenu() {
        if (eventsTimerRef.current) clearTimeout(eventsTimerRef.current);
        if (artistTimerRef.current) clearTimeout(artistTimerRef.current);
        setIsEventsDropdownOpen(true);
        setIsArtistDropdownOpen(false);
    }
    function scheduleCloseEventsMenu() {
        eventsTimerRef.current = setTimeout(() => setIsEventsDropdownOpen(false), 150);
    }

    const navLinkClass = "text-gray-300 hover:text-transparent hover:bg-clip-text hover:bg-gradient-to-r hover:from-orange-400 hover:to-pink-500 font-medium transition-all duration-300 whitespace-nowrap";

    return (
        <header className="fixed top-0 left-0 right-0 z-50 bg-[#0a0a0b]/95 backdrop-blur-md border-b border-gray-800/50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-24 lg:h-26">

                    {/* Logo */}
                    <Link href="/" className="flex items-end space-x-3 pb-1 shrink-0">
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
                    <nav className="hidden lg:flex items-center space-x-5 xl:space-x-6">

                        <Link href="/" className={navLinkClass}>Home</Link>

                        {/* Book an Artist dropdown trigger */}
                        <div
                            className="relative"
                            onMouseEnter={openArtistMenu}
                            onMouseLeave={scheduleCloseArtistMenu}
                        >
                            <button className="flex items-center gap-1.5 font-semibold py-6 group whitespace-nowrap">
                                <span className={`transition-colors duration-200 ${isArtistDropdownOpen ? 'text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500' : 'text-gray-300 group-hover:text-white'}`}>
                                    Artist
                                </span>
                                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isArtistDropdownOpen ? 'rotate-180 text-orange-400' : 'text-gray-500 group-hover:text-orange-400'}`} />
                            </button>
                        </div>

                        {/* Events dropdown trigger */}
                        <div
                            className="relative"
                            onMouseEnter={openEventsMenu}
                            onMouseLeave={scheduleCloseEventsMenu}
                        >
                            <button className="flex items-center gap-1.5 font-semibold py-6 group whitespace-nowrap">
                                <span className={`transition-colors duration-200 ${isEventsDropdownOpen ? 'text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-500' : 'text-gray-300 group-hover:text-white'}`}>
                                    Events
                                </span>
                                <ChevronDown className={`w-4 h-4 shrink-0 transition-transform duration-200 ${isEventsDropdownOpen ? 'rotate-180 text-pink-400' : 'text-gray-500 group-hover:text-pink-400'}`} />
                            </button>
                        </div>

                        {/* Express Booking */}
                        <Link
                            href="/post-requirement"
                            className="flex items-center gap-1 text-yellow-400 hover:text-yellow-300 font-medium transition-colors whitespace-nowrap"
                        >
                            <Zap className="w-4 h-4 shrink-0" />
                            Express Booking
                        </Link>

                        <Link href="/gallery" className={navLinkClass}>Gallery</Link>
                        <Link href="/about" className={navLinkClass}>About Us</Link>
                        <Link href="/contact" className={navLinkClass}>Contact Us</Link>
                        <Link href="/blog" className={navLinkClass}>Blog</Link>
                    </nav>

                    {/* Right Section */}
                    <div className="hidden lg:flex items-center space-x-4 shrink-0">
                        <Link href="/artists" className="p-2 text-gray-400 hover:text-white transition-colors">
                            <Search className="w-5 h-5" />
                        </Link>
                    </div>

                    {/* Mobile Menu Button — 44px touch target */}
                    <button
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                        className="lg:hidden w-11 h-11 flex items-center justify-center text-gray-300 bg-white/5 border border-white/10 rounded-xl hover:border-orange-500/40 hover:text-white transition-all"
                        aria-label="Toggle navigation menu"
                    >
                        {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            </div>

            {/* ── Book an Artist Full-Width Dropdown Panel ── */}
            {isArtistDropdownOpen && (
                <div
                    className="absolute top-full left-0 right-0 shadow-2xl shadow-black/80 animate-fadeIn overflow-hidden"
                    style={{ background: '#0a0a0b' }}
                    onMouseEnter={() => { if (artistTimerRef.current) clearTimeout(artistTimerRef.current); }}
                    onMouseLeave={() => setIsArtistDropdownOpen(false)}
                >
                    {/* Ambient glow blobs — matching the site's CategoryGrid atmosphere */}
                    <div className="absolute top-0 left-[-5%] w-[380px] h-[380px] bg-orange-500/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-0 right-[-5%] w-[320px] h-[320px] bg-purple-700/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(249,115,22,0.07)_0%,_transparent_60%)] pointer-events-none" />

                    {/* SVG arc with orange→pink→orange gradient + fairy lights, matching CategoryGrid */}
                    <svg className="absolute top-0 left-0 w-full h-[56px] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 56">
                        <path d="M0,42 Q 720,4 1440,42" fill="none" stroke="url(#artistArcGrad)" strokeWidth="2.5" />
                        {[...Array(13)].map((_, i) => {
                            const t = i / 12;
                            const cx = t * 1440;
                            const cy = Math.pow(1 - t, 2) * 42 + 2 * (1 - t) * t * 4 + Math.pow(t, 2) * 42;
                            return (
                                <g key={i}>
                                    <circle cx={cx} cy={cy} r="5" fill="white" opacity="0.12" />
                                    <circle cx={cx} cy={cy} r="1.8" fill="white" opacity="0.9" style={{ filter: 'drop-shadow(0 0 4px rgba(249,115,22,0.9))' }} />
                                </g>
                            );
                        })}
                        <defs>
                            <linearGradient id="artistArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#f97316" stopOpacity="0.5" />
                                <stop offset="50%" stopColor="#db2777" stopOpacity="1" />
                                <stop offset="100%" stopColor="#f97316" stopOpacity="0.5" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="relative max-w-7xl mx-auto px-6 xl:px-8 pt-12 pb-6">
                        {/* Panel header row */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 border border-orange-500/30">
                                    <Mic2 className="w-4 h-4 text-orange-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 uppercase tracking-[0.22em]">Talent Roster</p>
                                    <h2 className="text-base font-bold text-white leading-tight">Book an Artist</h2>
                                </div>
                            </div>
                            <Link
                                href="/categories"
                                className="flex items-center gap-2 text-xs font-bold text-orange-400 hover:text-white border border-orange-500/30 hover:border-orange-400/70 rounded-lg px-4 py-2 bg-gradient-to-r from-orange-500/10 to-pink-600/5 hover:from-orange-500/20 hover:to-pink-600/10 transition-all duration-200 uppercase tracking-wider"
                                onClick={() => setIsArtistDropdownOpen(false)}
                            >
                                <LayoutGrid className="w-3.5 h-3.5" />
                                View All
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* 4-column categories grid */}
                        <div className="grid grid-cols-4 border-t border-white/[0.06]">
                            {artistCategories.map((category) => (
                                <Link
                                    key={category.slug}
                                    href={`/artists/${category.slug}`}
                                    className="group relative flex items-center gap-3 py-3.5 px-4 border-b border-white/[0.05] hover:bg-gradient-to-r hover:from-orange-500/[0.09] hover:via-pink-600/[0.04] hover:to-transparent transition-all duration-150"
                                    onClick={() => setIsArtistDropdownOpen(false)}
                                >
                                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-orange-400 to-pink-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-full" />
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg border ${category.bg} ${category.color} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                                        {category.icon}
                                    </span>
                                    <span className="text-[11px] font-bold text-gray-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-400 uppercase tracking-[0.07em] transition-all duration-150 leading-tight">
                                        {category.name}
                                    </span>
                                    {category.hot && (
                                        <span className="ml-auto px-1.5 py-0.5 text-[8px] font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white rounded-full uppercase tracking-wide shrink-0">Hot</span>
                                    )}
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                </div>
            )}

            {/* ── Events Full-Width Dropdown Panel ── */}
            {isEventsDropdownOpen && (
                <div
                    className="absolute top-full left-0 right-0 shadow-2xl shadow-black/80 animate-fadeIn overflow-hidden"
                    style={{ background: '#0a0a0b' }}
                    onMouseEnter={() => { if (eventsTimerRef.current) clearTimeout(eventsTimerRef.current); }}
                    onMouseLeave={() => setIsEventsDropdownOpen(false)}
                >
                    {/* Ambient glow blobs */}
                    <div className="absolute top-0 left-[-5%] w-[320px] h-[320px] bg-pink-600/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute top-0 right-[-5%] w-[380px] h-[380px] bg-violet-700/10 rounded-full blur-[100px] pointer-events-none" />
                    <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(219,39,119,0.07)_0%,_transparent_60%)] pointer-events-none" />

                    {/* SVG arc with pink→violet→pink gradient + fairy lights */}
                    <svg className="absolute top-0 left-0 w-full h-[56px] pointer-events-none" preserveAspectRatio="none" viewBox="0 0 1440 56">
                        <path d="M0,42 Q 720,4 1440,42" fill="none" stroke="url(#eventsArcGrad)" strokeWidth="2.5" />
                        {[...Array(13)].map((_, i) => {
                            const t = i / 12;
                            const cx = t * 1440;
                            const cy = Math.pow(1 - t, 2) * 42 + 2 * (1 - t) * t * 4 + Math.pow(t, 2) * 42;
                            return (
                                <g key={i}>
                                    <circle cx={cx} cy={cy} r="5" fill="white" opacity="0.12" />
                                    <circle cx={cx} cy={cy} r="1.8" fill="white" opacity="0.9" style={{ filter: 'drop-shadow(0 0 4px rgba(219,39,119,0.9))' }} />
                                </g>
                            );
                        })}
                        <defs>
                            <linearGradient id="eventsArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                                <stop offset="0%" stopColor="#db2777" stopOpacity="0.5" />
                                <stop offset="50%" stopColor="#7c3aed" stopOpacity="1" />
                                <stop offset="100%" stopColor="#db2777" stopOpacity="0.5" />
                            </linearGradient>
                        </defs>
                    </svg>

                    <div className="relative max-w-7xl mx-auto px-6 xl:px-8 pt-12 pb-6">
                        {/* Panel header row */}
                        <div className="flex items-center justify-between mb-5">
                            <div className="flex items-center gap-3">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-gradient-to-br from-pink-600/20 to-violet-600/20 border border-pink-500/30">
                                    <Calendar className="w-4 h-4 text-pink-400" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold text-transparent bg-clip-text bg-gradient-to-r from-pink-400 to-violet-400 uppercase tracking-[0.22em]">Browse Events</p>
                                    <h2 className="text-base font-bold text-white leading-tight">Find Artists for Your Event</h2>
                                </div>
                            </div>
                            <Link
                                href="/events"
                                className="flex items-center gap-2 text-xs font-bold text-pink-400 hover:text-white border border-pink-500/30 hover:border-pink-400/70 rounded-lg px-4 py-2 bg-gradient-to-r from-pink-600/10 to-violet-600/5 hover:from-pink-600/20 hover:to-violet-600/10 transition-all duration-200 uppercase tracking-wider"
                                onClick={() => setIsEventsDropdownOpen(false)}
                            >
                                <Calendar className="w-3.5 h-3.5" />
                                View All
                                <ArrowRight className="w-3 h-3" />
                            </Link>
                        </div>

                        {/* 4-column events grid */}
                        <div className="grid grid-cols-4 border-t border-white/[0.06]">
                            {eventTypes.map((event) => (
                                <Link
                                    key={event.slug}
                                    href={`/events/${event.slug}`}
                                    className="group relative flex items-center gap-3 py-3.5 px-4 border-b border-white/[0.05] hover:bg-gradient-to-r hover:from-pink-600/[0.09] hover:via-violet-600/[0.04] hover:to-transparent transition-all duration-150"
                                    onClick={() => setIsEventsDropdownOpen(false)}
                                >
                                    <span className="absolute left-0 top-0 bottom-0 w-[2px] bg-gradient-to-b from-pink-400 to-violet-500 scale-y-0 group-hover:scale-y-100 transition-transform duration-200 origin-center rounded-full" />
                                    <span className={`flex items-center justify-center w-8 h-8 rounded-lg border ${event.bg} ${event.color} shrink-0 transition-transform duration-200 group-hover:scale-110`}>
                                        {event.icon}
                                    </span>
                                    <span className="text-[11px] font-bold text-gray-400 group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-pink-400 group-hover:to-violet-400 uppercase tracking-[0.07em] transition-all duration-150 leading-tight">
                                        {event.name}
                                    </span>
                                </Link>
                            ))}
                        </div>
                    </div>
                    <div className="h-px bg-gradient-to-r from-transparent via-pink-500/30 to-transparent" />
                </div>
            )}

            {/* ── Mobile Menu ── */}
            {isMenuOpen && (
                <div className="lg:hidden border-t border-white/10 animate-slideDown max-h-[85vh] overflow-y-auto bg-gradient-to-b from-[#111113] via-[#141416] to-[#0f0f10] backdrop-blur-xl" data-lenis-prevent>
                    <div className="px-4 py-5 space-y-4">
                        <Link
                            href="/"
                            className="flex items-center gap-2 rounded-xl px-3 py-2.5 bg-white/5 border border-white/10 text-white font-semibold"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            <Home className="w-4 h-4 text-orange-400" /> Home
                        </Link>

                        {/* Artist Categories */}
                        <div className="p-3 rounded-2xl border border-orange-500/20 bg-gradient-to-br from-orange-500/5 to-white/[0.02]">
                            <p className="text-xs font-bold text-orange-400 uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-orange-500/20 to-pink-500/20 border border-orange-500/20">
                                    <Mic2 className="w-3 h-3 text-orange-400" />
                                </div>
                                Book an Artist
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {artistCategories.map((category) => (
                                    <Link
                                        key={category.slug}
                                        href={`/artists/${category.slug}`}
                                        className="group flex items-center gap-2.5 py-3 px-3 rounded-xl bg-black/20 active:bg-orange-500/10 transition-all border border-transparent active:border-orange-500/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-lg border ${category.bg} ${category.color} shrink-0`}>
                                            {category.icon}
                                        </span>
                                        <span className="text-gray-300 group-active:text-white text-[11px] font-semibold uppercase tracking-wide leading-tight min-w-0 break-words">{category.name}</span>
                                        {category.hot && (
                                            <span className="px-1 py-0.5 text-[7px] font-bold bg-gradient-to-r from-red-500 to-rose-500 text-white rounded uppercase shrink-0">Hot</span>
                                        )}
                                    </Link>
                                ))}
                                <Link
                                    href="/categories"
                                    className="flex items-center gap-2 text-orange-400 font-bold py-3.5 px-3 rounded-xl bg-orange-500/10 border border-orange-500/20 col-span-2 text-sm"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <LayoutGrid className="w-4 h-4" />
                                    View All Artists
                                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                                </Link>
                            </div>
                        </div>

                        {/* Event Types */}
                        <div className="p-3 rounded-2xl border border-pink-500/20 bg-gradient-to-br from-pink-500/5 to-white/[0.02]">
                            <p className="text-xs font-bold text-pink-400 uppercase tracking-[0.12em] mb-3 flex items-center gap-2">
                                <div className="flex items-center justify-center w-5 h-5 rounded bg-gradient-to-br from-pink-500/20 to-violet-500/20 border border-pink-500/20">
                                    <Calendar className="w-3 h-3 text-pink-400" />
                                </div>
                                Events
                            </p>
                            <div className="grid grid-cols-2 gap-2">
                                {eventTypes.map((event) => (
                                    <Link
                                        key={event.slug}
                                        href={`/events/${event.slug}`}
                                        className="group flex items-center gap-2.5 py-3 px-3 rounded-xl bg-black/20 active:bg-pink-500/10 transition-all border border-transparent active:border-pink-500/20"
                                        onClick={() => setIsMenuOpen(false)}
                                    >
                                        <span className={`flex items-center justify-center w-8 h-8 rounded-lg border ${event.bg} ${event.color} shrink-0`}>
                                            {event.icon}
                                        </span>
                                        <span className="text-gray-300 group-active:text-white text-[11px] font-semibold uppercase tracking-wide leading-tight min-w-0 break-words">{event.name}</span>
                                    </Link>
                                ))}
                                <Link
                                    href="/events"
                                    className="flex items-center gap-2 text-orange-400 font-bold py-3.5 px-3 rounded-xl bg-orange-500/10 border border-orange-500/20 col-span-2 text-sm"
                                    onClick={() => setIsMenuOpen(false)}
                                >
                                    <Calendar className="w-4 h-4" />
                                    View All Events
                                    <ArrowRight className="w-3.5 h-3.5 ml-auto" />
                                </Link>
                            </div>
                        </div>

                        {/* Quick Links — min 44px touch targets */}
                        <Link href="/post-requirement" className="flex items-center gap-3 rounded-xl px-4 py-3.5 bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 font-semibold text-sm" onClick={() => setIsMenuOpen(false)}>
                            <Zap className="w-4 h-4 shrink-0" />
                            Express Booking
                        </Link>
                        <div className="grid grid-cols-2 gap-2">
                            <Link href="/gallery" className="flex items-center gap-2 rounded-xl px-3 py-3.5 text-gray-300 bg-white/5 border border-white/10 transition-all font-medium text-sm" onClick={() => setIsMenuOpen(false)}>
                                <Star className="w-4 h-4 text-orange-400 shrink-0" /> Gallery
                            </Link>
                            <Link href="/about" className="flex items-center gap-2 rounded-xl px-3 py-3.5 text-gray-300 bg-white/5 border border-white/10 transition-all font-medium text-sm" onClick={() => setIsMenuOpen(false)}>
                                <Info className="w-4 h-4 text-orange-400 shrink-0" /> About Us
                            </Link>
                            <Link href="/contact" className="flex items-center gap-2 rounded-xl px-3 py-3.5 text-gray-300 bg-white/5 border border-white/10 transition-all font-medium text-sm" onClick={() => setIsMenuOpen(false)}>
                                <Phone className="w-4 h-4 text-orange-400 shrink-0" /> Contact
                            </Link>
                            <Link href="/blog" className="flex items-center gap-2 rounded-xl px-3 py-3.5 text-gray-300 bg-white/5 border border-white/10 transition-all font-medium text-sm" onClick={() => setIsMenuOpen(false)}>
                                <Music className="w-4 h-4 text-orange-400 shrink-0" /> Blog
                            </Link>
                        </div>

                        {/* CTA */}
                        <Link
                            href="/post-requirement"
                            className="block w-full text-center px-4 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 transition-all text-base"
                            onClick={() => setIsMenuOpen(false)}
                        >
                            Book An Artist Now
                        </Link>
                    </div>
                </div>
            )}
        </header>
    );
}
