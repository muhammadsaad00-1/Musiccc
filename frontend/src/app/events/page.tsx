"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Calendar, Users, Star, Music, Award, Mic2, Globe, HeartHandshake } from "lucide-react";
import EventBannerCarousel from "@/components/home/EventBannerCarousel";
import ReadyForMomentsCTA from "@/components/home/ReadyForMomentsCTA";

// Static Event Types Data
const eventTypes = [
    {
        slug: "wedding",
        name: "Wedding",
        description: "Create magical moments with world-class entertainment for your special day.",
        icon: "💍",
        banner: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80",
        stats: "400+ Artists",
        popular: "Singers • Qawwals",
    },
    {
        slug: "corporate",
        name: "Corporate Event",
        description: "Professional entertainment solutions for conferences and corporate celebrations.",
        icon: "🏢",
        banner: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&q=80",
        stats: "150+ Artists",
        popular: "Emcees • Live Bands",
    },
    {
        slug: "concert",
        name: "Concert",
        description: "Electrifying live performances that create unforgettable musical experiences.",
        icon: "🎸",
        banner: "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
        stats: "100+ Artists",
        popular: "Bands • DJs",
    },
    {
        slug: "mehendi",
        name: "Mehendi",
        description: "Traditional celebrations deserve extraordinary performances and vibrant music.",
        icon: "🌙",
        banner: "https://images.unsplash.com/photo-1583089892943-e02e5b017b6a?auto=format&fit=crop&q=80",
        stats: "200+ Artists",
        popular: "Dhol • Folk Music",
    },
    {
        slug: "birthday",
        name: "Birthday Party",
        description: "Make every birthday celebration special with talented performers.",
        icon: "🎂",
        banner: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&q=80",
        stats: "100+ Artists",
        popular: "Magicians • DJs",
    },
    {
        slug: "private-party",
        name: "Private Gathering",
        description: "Exclusive entertainment for intimate gatherings and home celebrations.",
        icon: "🎉",
        banner: "https://images.unsplash.com/photo-1599839619722-39751411ea63?auto=format&fit=crop&q=80",
        stats: "120+ Artists",
        popular: "Soloists • Fusion",
    },
    {
        slug: "college-event",
        name: "College Fest",
        description: "High-energy performances and bands perfect for university campus parties.",
        icon: "🎓",
        banner: "https://images.unsplash.com/photo-1523580494863-6f3031224c94?auto=format&fit=crop&q=80",
        stats: "80+ Artists",
        popular: "Bands • Rockers",
    },
    {
        slug: "resort-event",
        name: "Luxury Resort Event",
        description: "Premium entertainment for destination weddings and luxury resort galas.",
        icon: "🛳️",
        banner: "https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&q=80",
        stats: "50+ Artists",
        popular: "Acoustic • Jazz",
    },
    {
        slug: "festival",
        name: "Festival",
        description: "Enthrall large audiences with headlining acts, live bands, and high-energy cultural performers.",
        icon: "🎪",
        banner: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?auto=format&fit=crop&q=80",
        stats: "150+ Artists",
        popular: "Rock Bands • Folk Artists • DJs",
    },
    {
        slug: "cultural-exchange",
        name: "Cultural Exchange",
        description: "Celebrate global heritage with authentic folk dancers, classical musicians, and traditional troupes.",
        icon: "🌍",
        banner: "https://images.unsplash.com/photo-1465847899084-d164df4dedc6?auto=format&fit=crop&q=80",
        stats: "80+ Artists",
        popular: "Classical Musicians • Sufi • Folk Dancers",
    },
    {
        slug: "embassy-diplomatic",
        name: "Embassy & Diplomatic Event",
        description: "Exquisite, sophisticated entertainment curated for national celebrations, galas, and VIP diplomatic receptions.",
        icon: "🤝",
        banner: "https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&q=80",
        stats: "60+ Artists",
        popular: "Violinists • Instrumentalists • Ghazal Artists",
    },
    {
        slug: "government-event",
        name: "Government Event",
        description: "Dignified and elegant entertainment featuring national anthems, classical recitals, and respectful live performances.",
        icon: "🏛️",
        banner: "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&q=80",
        stats: "90+ Artists",
        popular: "National Reciters • Ghazal Singers • Classical",
    },
];

export default function EventsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            
            {/* ══ HERO SECTION ═══════════════════════════════════════════════ */}
            <section className="relative pt-28 pb-16 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/10 rounded-full blur-[100px]" />
                </div>
                
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-orange-400 text-sm font-semibold mb-8">
                        ✨ Discover Events
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-white mb-6 tracking-tighter leading-tight uppercase">
                        THE STAGE & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 animate-gradient bg-size-200">
                            THEIR STORY
                        </span>
                    </h1>
                    <p className="text-gray-400 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed italic border-l-2 border-orange-500/50 pl-6">
                        "Every event has a story. Let us curate the perfect memory to make yours unforgettable."
                    </p>
                </div>
            </section>

            {/* ══ BANNER CAROUSEL ═════════════════════════════════════════════ */}
            <div className="relative z-10 -mt-8">
                <EventBannerCarousel />
            </div>

            {/* ══ EVENTS GRID ═════════════════════════════════════════════════ */}
            <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
                    <div className="max-w-2xl">
                        <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight uppercase">
                            Explore <span className="text-orange-500">Event Types</span>
                        </h2>
                        <p className="text-gray-400 text-lg">
                            Select an event type to discover verified artists and curated performers specifically suited for your celebration.
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-bold uppercase tracking-widest text-gray-500 whitespace-nowrap">
                        <div className="w-12 h-[1px] bg-gray-800" />
                        Scroll to discover
                        <div className="w-12 h-[1px] bg-gray-800" />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                    {eventTypes.map((event, idx) => (
                        <Link 
                            key={event.slug}
                            href={`/events/${event.slug}`}
                            className="group relative h-[450px] rounded-[2rem] overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all duration-700 hover:-translate-y-2 hover:shadow-2xl hover:shadow-orange-500/10"
                        >
                            {/* Static Banner Background */}
                            <Image 
                                src={event.banner}
                                alt={event.name}
                                fill
                                className="object-cover transition-transform duration-1000 group-hover:scale-110 grayscale-[30%] group-hover:grayscale-0 opacity-60 group-hover:opacity-100"
                            />
                            
                            {/* Glass Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent flex flex-col justify-end p-8">
                                <div className="mb-4">
                                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full text-white text-[10px] font-bold uppercase tracking-widest mb-3">
                                        <span>{event.icon}</span>
                                        <span>{event.name}</span>
                                    </div>
                                    <h3 className="text-2xl font-black text-white mb-2 leading-none group-hover:text-orange-400 transition-colors uppercase">
                                        {event.name}
                                    </h3>
                                    <p className="text-gray-300 text-sm line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 transition-all duration-500 transform translate-y-4 group-hover:translate-y-0">
                                        {event.description}
                                    </p>
                                </div>
                                
                                <div className="flex items-center justify-between pt-4 border-t border-white/10 mt-auto">
                                    <div className="flex flex-col">
                                        <span className="text-[10px] font-bold text-gray-400 uppercase tracking-tighter">Available</span>
                                        <span className="text-xs font-bold text-white uppercase">{event.stats}</span>
                                    </div>
                                    <div className="w-10 h-10 rounded-full bg-orange-500 flex items-center justify-center text-white transform group-hover:rotate-45 transition-transform duration-500">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>

                            {/* Popular Hint */}
                            <div className="absolute top-6 left-6 right-6 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                                <div className="flex items-center gap-2 text-[10px] font-black text-orange-400 uppercase tracking-widest bg-black/60 backdrop-blur-md px-4 py-2 rounded-full w-fit">
                                    <Mic2 className="w-3 h-3" />
                                    {event.popular}
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            </section>

            {/* ══ STATS SECTION ═══════════════════════════════════════════════ */}
            <section className="py-24 relative">
                <div className="absolute inset-0 bg-orange-500/5 backdrop-blur-[2px]" />
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 md:gap-12">
                        {[
                            { icon: Globe, label: "Cities", value: "20+", color: "text-blue-400" },
                            { icon: Users, label: "Verified Artists", value: "400+", color: "text-orange-400" },
                            { icon: HeartHandshake, label: "Private Events", value: "5000+", color: "text-pink-400" },
                            { icon: Award, label: "Premium Rating", value: "4.9/5", color: "text-purple-400" },
                        ].map((stat, i) => (
                            <div key={i} className="flex flex-col items-center text-center group">
                                <div className={`w-16 h-16 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center mb-6 transition-all duration-500 group-hover:scale-110 group-hover:rotate-12 ${stat.color}`}>
                                    <stat.icon className="w-8 h-8" />
                                </div>
                                <div className="text-4xl font-black text-white mb-1">{stat.value}</div>
                                <div className="text-gray-500 text-xs font-bold uppercase tracking-widest">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA SECTION ══════════════════════════════════════════════════ */}
            <ReadyForMomentsCTA />

            <div className="pb-24" />
        </div>
    );
}
