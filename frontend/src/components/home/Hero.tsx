'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/ui/SearchBar';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Mic2, Music, Star, MapPin, Sparkles, Users, Calendar, Award } from 'lucide-react';
import { useHeroImages, useStats } from '@/lib/hooks';

const categories = [
    { name: 'Singers', slug: 'singers', icon: '🎤' },
    { name: 'Qawwals', slug: 'qawwals', icon: '🎵' },
    { name: 'Live Bands', slug: 'live-bands', icon: '🎸' },
    { name: 'Bhangra Artists', slug: 'bhangra-artists', icon: '💃' },
    { name: 'DJs', slug: 'djs', icon: '🎧' },
];

const eventTypes = [
    { name: 'Weddings', slug: 'wedding', highlight: true },
    { name: 'Concerts', slug: 'concert', highlight: true },
    { name: 'Mehendi', slug: 'mehendi', highlight: false },
    { name: 'Corporate', slug: 'corporate', highlight: false },
];

// Fixed particle positions to avoid hydration mismatch
const particlePositions = [
    { left: 20, top: 25, duration: 18, delay: 0 },
    { left: 75, top: 15, duration: 22, delay: 2 },
    { left: 45, top: 60, duration: 25, delay: 4 },
    { left: 85, top: 45, duration: 20, delay: 1 },
    { left: 30, top: 80, duration: 24, delay: 3 },
    { left: 60, top: 35, duration: 19, delay: 5 },
    { left: 15, top: 55, duration: 23, delay: 2.5 },
    { left: 70, top: 70, duration: 21, delay: 1.5 },
];

const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {particlePositions.map((particle, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-orange-500/20 rounded-full animate-float"
                    style={{
                        left: `${particle.left}%`,
                        top: `${particle.top}%`,
                        animationDuration: `${particle.duration}s`,
                        animationDelay: `${particle.delay}s`,
                    }}
                />
            ))}
            <style jsx>{`
                @keyframes float {
                    0%, 100% {
                        transform: translateY(0) translateX(0);
                        opacity: 0.2;
                    }
                    50% {
                        transform: translateY(-20px) translateX(10px);
                        opacity: 0.5;
                    }
                }
                .animate-float {
                    animation: float ease-in-out infinite;
                }
            `}</style>
        </div>
    );
};

interface Stats {
    artists: number;
    events: number;
    cities: number;
    rating: number;
}

interface HeroImage {
    id: string;
    image_url: string;
    title?: string;
    subtitle?: string;
}

// Fallback hero images if backend has none
const fallbackHeroImages = [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=1000&auto=format&fit=crop", // Music concert
    "https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=1000&auto=format&fit=crop", // Stage performance
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?w=1000&auto=format&fit=crop", // Band
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=1000&auto=format&fit=crop"  // DJ
];

export default function Hero() {
    // Use React Query hooks for data fetching
    const { data: heroImagesData } = useHeroImages();
    const { data: statsData } = useStats();
    
    const [stats, setStats] = useState<Stats>({
        artists: 400,
        events: 5000,
        cities: 20,
        rating: 4.9,
    });

    const categoriesList = ['Artists', 'Qawwals', 'Singers', 'Live Bands', 'Bhangra Artists'];
    const [categoryIndex, setCategoryIndex] = useState(0);

    const [currentImageIndex, setCurrentImageIndex] = useState(0);
    const [heroImages, setHeroImages] = useState<string[]>(fallbackHeroImages);

    // Update hero images when data is fetched
    useEffect(() => {
        if (heroImagesData && heroImagesData.length > 0) {
            setHeroImages(heroImagesData.map((img: HeroImage) => img.image_url));
        }
    }, [heroImagesData]);

    // Update stats when data is fetched  
    useEffect(() => {
        if (statsData) {
            setStats({
                artists: 400,
                events: 5000,
                cities: statsData.total_cities || 20,
                rating: 4.9,
            });
        }
    }, [statsData]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, [heroImages.length]);

    useEffect(() => {
        const interval = setInterval(() => {
            setCategoryIndex((prev) => (prev + 1) % categoriesList.length);
        }, 2000);
        return () => clearInterval(interval);
    }, []);

    return (
        <section className="relative min-h-[100svh] flex items-center overflow-hidden bg-[#0a0a0b] pt-20 pb-10 sm:pb-12 lg:pt-0 lg:pb-0">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/20 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-12 gap-6 lg:gap-16 items-center">
                    {/* Text content — order-2 on mobile (image shows first), order-2 on desktop too */}
                    <div className="text-left space-y-4 sm:space-y-6 lg:space-y-8 order-2 lg:order-2 lg:col-span-7">
                        {/* Badge */}
                        <div className="inline-flex max-w-full items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-xs sm:text-sm text-gray-300 font-medium truncate">#1 Artist Booking Platform in Pakistan</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-[28px] sm:text-5xl lg:text-7xl font-bold text-white leading-tight tracking-tight">
                            Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600 inline-block animate-slideUp">
                                Top {categoriesList[categoryIndex]}
                            </span>{' '}
                            For Your Event
                        </h1>

                        {/* Tagline */}
                        <p className="text-sm sm:text-xl font-semibold italic text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                            Bringing stars to your event!
                        </p>

                        {/* Subtitle — hidden on smallest screens to reduce clutter */}
                        <p className="hidden sm:block text-base lg:text-lg text-gray-400 max-w-xl leading-relaxed">
                            From soulful <strong>Qawwals</strong> to high-energy <strong>Live Bands</strong>, we connect you with Pakistan&apos;s finest talent for weddings, corporate events, and concerts.
                        </p>

                        {/* Search Bar - Wider */}
                        <div className="w-full relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-[#0a0a0b] rounded-xl p-1">
                                <div className="sm:hidden">
                                    <SearchBar size="default" showCategory={false} className="w-full" />
                                </div>
                                <div className="hidden sm:block">
                                    <SearchBar size="large" className="w-full" />
                                </div>
                            </div>
                        </div>

                        {/* Buttons & Stats */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/post-requirement"
                                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all text-center"
                            >
                                Book An Artist
                            </Link>
                            <Link
                                href="/artists"
                                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#1a1a1a] text-white font-bold rounded-xl border border-gray-800 hover:bg-[#252525] hover:border-gray-700 transition-all text-center flex items-center justify-center gap-2"
                            >
                                <Users className="w-5 h-5 text-gray-400" />
                                Find All Artists
                            </Link>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="grid grid-cols-3 gap-2 sm:gap-8 pt-4 sm:pt-6 border-t border-white/5">
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter end={stats.artists} duration={2000} suffix="+" /></div>
                                <div className="text-xs sm:text-sm text-gray-500">Artists</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-white"><AnimatedCounter end={stats.events} duration={2500} suffix="+" /></div>
                                <div className="text-xs sm:text-sm text-gray-500">Events</div>
                            </div>
                            <div>
                                <div className="text-xl sm:text-2xl font-bold text-white flex items-center gap-1">
                                    <AnimatedCounter end={stats.rating} decimals={1} duration={1500} />
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                </div>
                                <div className="text-xs sm:text-sm text-gray-500">Rating</div>
                            </div>
                        </div>

                        {/* Global Presence Indicator */}

                    </div>

                    {/* Image — order-1 on mobile (above text), order-1 on desktop */}
                    <div className="relative h-[260px] sm:h-[400px] lg:h-[800px] flex items-end justify-center lg:justify-start order-1 lg:order-1 lg:col-span-5">
                        {/* Main Character Image */}
                        <div className="relative z-10 w-full max-w-[280px] sm:max-w-lg h-full lg:aspect-auto lg:h-[90%]">
                            <Image
                                key={currentImageIndex}
                                src={heroImages[currentImageIndex]}
                                alt="Featured Artist"
                                fill
                                className="object-cover rounded-3xl lg:rounded-t-[3rem] shadow-2xl shadow-orange-900/20 animate-in fade-in duration-700"
                                priority
                            />

                            {/* Gradient Overlay at bottom */}
                            <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0a0a0b] to-transparent" />

                            {/* Floating Element 1 */}
                            <div className="absolute top-10 -left-10 z-30 bg-[#1a1a1a]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl animate-float delay-100 hidden sm:block">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
                                        <Award className="w-5 h-5 text-green-500" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Top Rated</div>
                                        <div className="text-xs text-gray-400">Verified Artists</div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Element 2 */}
                            <div className="absolute bottom-20 -right-5 z-30 bg-[#1a1a1a]/80 backdrop-blur-md p-4 rounded-2xl border border-white/10 shadow-xl animate-float delay-300 hidden sm:block">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-orange-500/20 rounded-full flex items-center justify-center">
                                        <Music className="w-5 h-5 text-orange-500" />
                                    </div>
                                    <div>
                                        <div className="text-white font-bold text-sm">Live Music</div>
                                        <div className="text-xs text-gray-400">For Any Event</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Background Splashes behind image */}
                        <div className="absolute top-1/4 right-0 w-[300px] h-[300px] sm:w-[500px] sm:h-[500px] bg-gradient-to-tr from-orange-600/20 to-pink-600/20 rounded-full blur-[100px] -z-10" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                @keyframes slideUp {
                    0% { transform: translateY(10px); opacity: 0; }
                    10% { transform: translateY(0); opacity: 1; }
                    90% { transform: translateY(0); opacity: 1; }
                    100% { transform: translateY(-10px); opacity: 0; }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
                .animate-slideUp {
                    animation: slideUp 2s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
