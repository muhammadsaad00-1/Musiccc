'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Linkedin, Heart } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

// Simple TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);


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


export default function Footer() {

    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    // Transform to include icon (matching Header logic)
                    const transformed = data.map((cat: any) => ({
                        name: cat.name,
                        slug: cat.slug,
                        icon: categoryIcons[cat.name] || categoryIcons[cat.name?.split(' ')[0]] || '🎵',
                    }));
                    setCategories(transformed);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        };

        fetchCategories();
    }, []);


    // Helper to slugify text
    const slugify = (text: string) => {
        return text
            .toLowerCase()
            .replace(/ /g, '-')
            .replace(/[^\w-]+/g, '');
    };

    const events = [
        { name: "Wedding Events", slug: "wedding" },
        { name: "Mehendi Events", slug: "mehendi" },
        { name: "Corporate Events", slug: "corporate" },
        { name: "Private Parties", slug: "private-party" },
        { name: "Concerts", slug: "concert" },
        { name: "Milad & Religious", slug: "milad" }
    ];

    const companyLinks = [
        { name: "About Us", href: "/about" },
        { name: "Testimonials", href: "/testimonials" },
        { name: "Blog", href: "/blog" },
        { name: "Contact Us", href: "/contact" },
        { name: "Terms & Conditions", href: "/terms" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "FAQs", href: "/faq" }
    ];

    return (
        <footer className="relative bg-[#050508] text-gray-300 overflow-hidden pt-20 pb-10">
            {/* Decorative Background Elements */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-600/10 rounded-full blur-[100px]" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-pink-600/5 rounded-full blur-[120px]" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-900/5 rounded-full blur-[150px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 mb-16">
                    {/* Brand Column - Spans 4 columns for better balance */}
                    <div className="lg:col-span-4">
                        <Link href="/" className="flex items-center gap-3 mb-6">
                            <Image
                                src="/logo-taf.png"
                                alt="The Artist Factory"
                                width={60}
                                height={60}
                                className="w-[60px] h-[60px] object-contain"
                            />
                            <div>
                                <span className="text-2xl font-bold text-white block">The Artist Factory</span>
                                {/* <span className="text-xs uppercase tracking-widest text-orange-500 font-semibold">
                                    Pakistan&apos;s Premier Marketplace
                                </span> */}
                                <span className="block text-sm text-orange-300 italic font-medium mt-1">
                                    Bringing stars to your event!
                                </span>
                            </div>
                        </Link>

                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                            Your gateway to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                                unforgettable events
                            </span>
                        </h2>

                        {/* <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                            Pakistan&apos;s Largest Marketplace for Professional Artists. We connect you with the best talent for weddings, corporate events, and concerts.
                        </p> */}

                        <div className="flex items-center gap-4">
                            <span className="text-base font-medium text-white">Follow us On</span>
                            <div className="h-px w-8 bg-gray-700"></div>
                            <div className="flex gap-3">
                                <a href="https://www.facebook.com/share/1BkG8r9xrN/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-600 hover:text-white transition-all border border-white/5">
                                    <Facebook className="w-4 h-4" />
                                </a>
                                <a href="https://www.instagram.com/theartistfactoryofficial" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:bg-pink-600 hover:text-white transition-all border border-white/5">
                                    <Instagram className="w-4 h-4" />
                                </a>
                                <a href="https://youtube.com/@theartistfactoryofficial" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:bg-red-600 hover:text-white transition-all border border-white/5">
                                    <Youtube className="w-4 h-4" />
                                </a>
                                <a href="https://www.tiktok.com/@theartistfactory" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:bg-black hover:text-white hover:border-gray-700 border border-transparent transition-all border-white/5">
                                    <TikTokIcon className="w-4 h-4" />
                                </a>
                                <a href="https://www.linkedin.com/company/artistfactoryofficial/" target="_blank" rel="noopener noreferrer" className="w-9 h-9 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:bg-blue-700 hover:text-white transition-all border border-white/5">
                                    <Linkedin className="w-4 h-4" />
                                </a>
                            </div>
                        </div>

                        {/* Leave a Review Button */}
                        <Link 
                            href="/testimonials"
                            className="mt-6 inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all"
                        >
                            Leave a Review
                        </Link>

                        {/* Global Presence — inline in brand column */}
                        <div className="mt-8 pt-6 border-t border-gray-800/50">
                            <p className="text-xs uppercase tracking-widest text-gray-500 font-semibold mb-4 flex items-center gap-2">
                                🌍 Global Presence
                            </p>
                            <div className="flex flex-wrap gap-4">
                                {[
                                    { code: 'pk', name: 'Pakistan' },
                                    { code: 'ae', name: 'UAE' },
                                    { code: 'us', name: 'USA' },
                                    { code: 'gb', name: 'UK' },
                                    { code: 'ca', name: 'Canada' },
                                ].map((country) => (
                                    <div key={country.name} className="flex flex-col items-center gap-1 group cursor-pointer">
                                        <div className="w-10 h-7 rounded overflow-hidden border border-gray-700/50 group-hover:border-orange-500/40 transition-all duration-200 group-hover:scale-110 shadow-lg relative">
                                            {/* eslint-disable-next-line @next/next/no-img-element */}
                                            <img
                                                src={`https://flagcdn.com/w80/${country.code}.png`}
                                                alt={`${country.name} flag`}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors" />
                                        </div>
                                        <span className="text-[10px] uppercase font-bold text-gray-600 group-hover:text-orange-400 transition-colors">{country.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Links Columns - Spans 8 columns (4 cols total) */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-3 gap-8 lg:mt-10 lg:pl-12">

                        {/* Artists Column */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6 flex items-center gap-2">
                                Artists
                            </h3>
                            <ul className="space-y-4">
                                {categories.slice(0, 6).map((category, index) => (
                                    <li key={index}>
                                        <Link href={`/artists/${category.slug}`} className="text-base text-gray-400 hover:text-orange-400 transition-colors flex items-center gap-2">
                                            {/* <span className="text-sm opacity-70">{category.icon}</span> */}
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link href="/artists" className="text-base font-semibold text-orange-400 hover:text-orange-300 transition-colors flex items-center gap-2 mt-2">
                                        View All Categories →
                                    </Link>
                                </li>
                            </ul>
                        </div>


                        {/* Events Column */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6">Events</h3>
                            <ul className="space-y-4">
                                {events.map((event, index) => (
                                    <li key={index}>
                                        <Link href={`/events/${event.slug}`} className="text-base text-gray-400 hover:text-orange-400 transition-colors block">
                                            {event.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company Column */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6">Company</h3>
                            <ul className="space-y-4">
                                {companyLinks.map((link, index) => (
                                    <li key={index}>
                                        <Link href={link.href} className="text-base text-gray-400 hover:text-orange-400 transition-colors block">
                                            {link.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>


                {/* Bottom Bar */}
                <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-base">
                        © Copyright 2026 | The Artist Factory | All Rights Reserved.
                    </p>
                    <div className="flex items-center gap-2 text-gray-400 text-base group">
                        <span>Made with</span>
                        <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse group-hover:scale-110 transition-transform" />
                        <span>in Pakistan</span>
                    </div>
                </div>
            </div>
        </footer>
    );
}

