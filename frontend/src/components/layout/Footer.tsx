'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Linkedin, Heart } from 'lucide-react';

// Simple TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);

export default function Footer() {
    const [categories, setCategories] = useState<any[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/categories');
                const data = await response.json();
                setCategories(data);
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

    const cities = [
        "Lahore",
        "Karachi",
        "Islamabad",
        "Faisalabad",
        "Multan",
        "Peshawar"
    ];

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
                                <span className="text-xs uppercase tracking-widest text-orange-500 font-semibold">
                                    Pakistan&apos;s Premier Marketplace
                                </span>
                            </div>
                        </Link>

                        <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
                            Your gateway to <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                                unforgettable events
                            </span>
                        </h2>

                        <p className="text-gray-400 mb-8 max-w-sm leading-relaxed">
                            Pakistan&apos;s Largest Marketplace for Professional Artists. We connect you with the best talent for weddings, corporate events, and concerts.
                        </p>

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
                    </div>

                    {/* Links Columns - Spans 8 columns (4 cols total) */}
                    <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8 lg:mt-10 lg:pl-12">
                        {/* Artists Column */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6">Artists</h3>
                            <ul className="space-y-4">
                                {categories.slice(0, 6).map((category, index) => (
                                    <li key={index}>
                                        <Link href={`/artists/${category.slug}`} className="text-base text-gray-400 hover:text-orange-400 transition-colors block">
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Cities Column */}
                        <div>
                            <h3 className="text-white font-bold text-lg mb-6">Cities</h3>
                            <ul className="space-y-4">
                                {cities.map((city, index) => (
                                    <li key={index}>
                                        <Link href={`/artists?location=${city}`} className="text-base text-gray-400 hover:text-orange-400 transition-colors block">
                                            Artists in {city}
                                        </Link>
                                    </li>
                                ))}
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
                <div className="pt-8 border-t border-gray-800/50 flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-400 text-base">
                        © Copyright 2024 - 2026 | The Artist Factory | All Rights Reserved.
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

