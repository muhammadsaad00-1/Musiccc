'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import SearchBar from '@/components/ui/SearchBar';
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import { Mic2, Music, Star, MapPin, Sparkles, Users, Calendar, Award } from 'lucide-react';

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

export default function Hero() {
    const [stats, setStats] = useState<Stats>({
        artists: 200,
        events: 5000,
        cities: 20,
        rating: 4.9,
    });

    const [currentImageIndex, setCurrentImageIndex] = useState(0);

    const heroImages = [
        "https://images.unsplash.com/photo-1516280440614-6697288d5d38?q=80&w=1000&auto=format&fit=crop", // Singer
        "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?q=80&w=1000&auto=format&fit=crop", // Mic
        "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=1000&auto=format&fit=crop", // Concert
        "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?q=80&w=1000&auto=format&fit=crop"  // DJ
    ];

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentImageIndex((prev) => (prev + 1) % heroImages.length);
        }, 5000);
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Fetch real stats from backend
        const fetchStats = async () => {
            try {
                const response = await fetch('http://127.0.0.1:8000/api/stats');
                if (response.ok) {
                    const data = await response.json();
                    setStats({
                        artists: data.total_artists || 200,
                        events: data.total_events || 5000,
                        cities: data.total_cities || 20,
                        rating: data.average_rating || 4.9,
                    });
                }
            } catch (error) {
                // Keep default values
                console.log('Using default stats');
            }
        };

        fetchStats();
    }, []);

    return (
        <section className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#0a0a0b] pt-20 lg:pt-0">
            {/* Background Effects */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/20 rounded-full blur-[100px]" />
                <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full relative z-10">
                <div className="grid lg:grid-cols-12 gap-8 lg:gap-16 items-center">
                    {/* Left Content (now Right on Desktop) */}
                    <div className="text-left space-y-8 lg:order-2 lg:col-span-7">
                        {/* Badge */}
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full backdrop-blur-md">
                            <span className="flex h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
                            <span className="text-sm text-gray-300 font-medium">#1 Artist Booking Platform in Pakistan</span>
                        </div>

                        {/* Heading */}
                        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-white leading-[1.1] tracking-tight">
                            Book <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Top Artists</span><br />
                            For Your Event
                        </h1>

                        {/* Subtitle */}
                        <p className="text-lg text-gray-400 max-w-xl leading-relaxed">
                            From soulful <strong>Qawwals</strong> to high-energy <strong>Live Bands</strong>, we connect you with Pakistan&apos;s finest talent for weddings, corporate events, and concerts.
                        </p>

                        {/* Search Bar - Wider */}
                        <div className="w-full relative group">
                            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-pink-600 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                            <div className="relative bg-[#0a0a0b] rounded-xl">
                                <SearchBar size="large" />
                            </div>
                        </div>

                        {/* Buttons & Stats */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <Link
                                href="/post-requirement"
                                className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all text-center"
                            >
                                Book An Artist
                            </Link>
                            <Link
                                href="/artists"
                                className="px-8 py-4 bg-[#1a1a1a] text-white font-bold rounded-xl border border-gray-800 hover:bg-[#252525] hover:border-gray-700 transition-all text-center flex items-center justify-center gap-2"
                            >
                                <Users className="w-5 h-5 text-gray-400" />
                                Find All Artists
                            </Link>
                        </div>

                        {/* Quick Stats Row */}
                        <div className="flex items-center gap-8 pt-6 border-t border-white/5">
                            <div>
                                <div className="text-2xl font-bold text-white"><AnimatedCounter end={stats.artists} duration={2000} suffix="+" /></div>
                                <div className="text-sm text-gray-500">Artists</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div>
                                <div className="text-2xl font-bold text-white"><AnimatedCounter end={stats.events} duration={2500} suffix="+" /></div>
                                <div className="text-sm text-gray-500">Events</div>
                            </div>
                            <div className="w-px h-8 bg-white/10" />
                            <div>
                                <div className="text-2xl font-bold text-white flex items-center gap-1">
                                    <AnimatedCounter end={stats.rating} decimals={1} duration={1500} />
                                    <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
                                </div>
                                <div className="text-sm text-gray-500">Rating</div>
                            </div>
                        </div>
                    </div>

                    {/* Right Image (now Left on Desktop) */}
                    <div className="relative lg:h-[800px] flex items-end justify-center lg:justify-start lg:order-1 lg:col-span-5">
                        {/* Main Character Image */}
                        <div className="relative z-10 w-full max-w-lg aspect-[3/4] lg:aspect-auto lg:h-[90%]">
                            <Image
                                key={currentImageIndex}
                                src={heroImages[currentImageIndex]}
                                alt="Featured Artist"
                                fill
                                className="object-cover rounded-t-3xl lg:rounded-t-[3rem] shadow-2xl shadow-orange-900/20 animate-in fade-in duration-700"
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
                        <div className="absolute top-1/4 right-0 w-[500px] h-[500px] bg-gradient-to-tr from-orange-600/20 to-pink-600/20 rounded-full blur-[100px] -z-10" />
                    </div>
                </div>
            </div>

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-float {
                    animation: float 4s ease-in-out infinite;
                }
            `}</style>
        </section>
    );
}
