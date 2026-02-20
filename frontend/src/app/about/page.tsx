"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import AnimatedCounter from '@/components/ui/AnimatedCounter';
import TestimonialsSection from "@/components/home/TestimonialsSection";
import PortfolioGrid from "@/components/home/PortfolioGrid";
import {
    CheckCircle,
    Star,
    Globe,
    Shield,
    Zap,
    HeartHandshake,
    Trophy,
    Users,
    Play,
    Youtube,
    ChevronLeft,
    ChevronRight,
    Quote,
    Mic2,
    Music,
    Award,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

// ─── YouTube helper ────────────────────────────────────────────
function extractYoutubeId(url: string): string | null {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/
    );
    return match ? match[1] : null;
}

// ─── Portfolio types ────────────────────────────────────────────
interface PortfolioItem {
    id: string;
    url: string;
    title: string;
}

// ─── Team data ─────────────────────────────────────────────────
const teamMembers = [
    {
        name: "Sarah Malik",
        role: "Head of Artist Relations",
        bio: "Curates and manages our roster of 500+ verified artists across Pakistan and internationally.",
        emoji: "🎭",
        gradient: "from-orange-500 to-pink-600",
    },
    {
        name: "Usman Tariq",
        role: "Event Production Director",
        bio: "10+ years of experience producing corporate galas, weddings, and live concerts across South Asia.",
        emoji: "🎬",
        gradient: "from-purple-500 to-blue-600",
    },
    {
        name: "Ayesha Noor",
        role: "Client Experience Manager",
        bio: "Ensures every client gets a seamless booking experience from first inquiry to final performance.",
        emoji: "💼",
        gradient: "from-pink-500 to-rose-600",
    },
    {
        name: "Bilal Chaudhary",
        role: "Technology Lead",
        bio: "Builds and maintains the platform infrastructure that connects artists and clients worldwide.",
        emoji: "💻",
        gradient: "from-cyan-500 to-teal-600",
    },
];

// ─── Why choose us data ─────────────────────────────────────────
const whyChooseUs = [
    {
        icon: Shield,
        title: "Verified Artists Only",
        desc: "Every artist on our platform is personally vetted. We verify credentials, review past performances, and check professionalism before listing.",
        color: "text-green-400",
        bg: "bg-green-500/10",
    },
    {
        icon: Zap,
        title: "Fast & Reliable Booking",
        desc: "From inquiry to confirmation in hours — not days. Our streamlined process gets you booked quickly with zero hassle.",
        color: "text-yellow-400",
        bg: "bg-yellow-500/10",
    },
    {
        icon: Globe,
        title: "Global Reach",
        desc: "We operate across Pakistan, UAE, UK, USA and Canada, bringing local talent to international stages and vice versa.",
        color: "text-blue-400",
        bg: "bg-blue-500/10",
    },
    {
        icon: HeartHandshake,
        title: "Transparent Pricing",
        desc: "No hidden fees, no surprises. We negotiate on your behalf and give you full clarity on costs upfront.",
        color: "text-pink-400",
        bg: "bg-pink-500/10",
    },
    {
        icon: Trophy,
        title: "Premium Event Experience",
        desc: "From intimate dinners to 5000-person concerts — we handle all scale of events with the same level of excellence.",
        color: "text-orange-400",
        bg: "bg-orange-500/10",
    },
    {
        icon: Star,
        title: "Dedicated Support",
        desc: "A real human event coordinator is assigned to every booking. We're with you every step of the way, before and on the day.",
        color: "text-purple-400",
        bg: "bg-purple-500/10",
    },
];

// ─── Stats ──────────────────────────────────────────────────────
const stats = [
    { value: 500, suffix: "+", label: "Verified Artists", icon: Mic2 },
    { value: 2000, suffix: "+", label: "Events Delivered", icon: Music },
    { value: 5, suffix: "", label: "Countries Served", icon: Globe },
    { value: 98, suffix: "%", label: "Client Satisfaction", icon: Award },
];

// ─── FAQ (kept from original) ────────────────────────────────────
const faqs = [
    {
        q: "How do I book an artist through Artist Factory?",
        a: "Simply browse our roster, click 'Request Booking' on any artist profile, fill in your event details, and our team will get back within 24 hours with availability and pricing.",
    },
    {
        q: "Are all artists on the platform verified?",
        a: "Yes. Every artist undergoes a thorough vetting process including credential checks, performance reviews, and professionalism assessments before joining our roster.",
    },
    {
        q: "What types of events do you cater to?",
        a: "Weddings, corporate events, concerts, brand activations, private parties, festivals, TV productions, and more — across all scales and budgets.",
    },
    {
        q: "Do you operate internationally?",
        a: "Yes! We have active operations and clients in Pakistan, UAE, UK, USA and Canada — with the ability to fly artists internationally upon request.",
    },
    {
        q: "What is your cancellation policy?",
        a: "Each booking has its own cancellation terms based on the artist and event type. Our team will walk you through the specific policy before you confirm any booking.",
    },
];

// ─── PortfolioSection Component ──────────────────────────────────
function PortfolioSection() {
    const [images, setImages] = useState<PortfolioItem[]>([]);
    const [videos, setVideos] = useState<PortfolioItem[]>([]);
    const [imagePage, setImagePage] = useState(0);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);
    const IMAGES_PER_PAGE = 12;

    useEffect(() => {
        fetch(`${API_BASE_URL}/api/portfolio`)
            .then((r) => r.json())
            .then((data) => {
                setImages(data.images || []);
                setVideos(
                    (data.videos || []).map((v: PortfolioItem) => ({
                        ...v,
                        videoId: extractYoutubeId(v.url),
                        thumbnail: extractYoutubeId(v.url)
                            ? `https://img.youtube.com/vi/${extractYoutubeId(v.url)}/hqdefault.jpg`
                            : "",
                    }))
                );
            })
            .catch(() => { });
    }, []);

    const pageImages = images.slice(
        imagePage * IMAGES_PER_PAGE,
        (imagePage + 1) * IMAGES_PER_PAGE
    );
    const totalPages = Math.ceil(images.length / IMAGES_PER_PAGE);
    const activeVideo = videos[activeVideoIndex] as any;


    if (images.length === 0 && videos.length === 0) {
        return (
            <section className="py-20 bg-[#0f0f10] border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gray-800/50 rounded-full text-gray-400 text-sm font-medium mb-6">
                        🎬 Portfolio
                    </span>
                    <h2 className="text-3xl font-bold text-white mb-4">Our Work</h2>
                    <div className="max-w-xl mx-auto p-12 bg-[#1a1a1a] rounded-3xl border border-gray-800 border-dashed">
                        <div className="w-16 h-16 bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📸</span>
                        </div>
                        <h3 className="text-white font-semibold mb-2">Portfolio Coming Soon</h3>
                        <p className="text-gray-500">We are currently curating our finest moments. Check back shortly to see our work in action.</p>
                    </div>
                </div>
            </section>
        );
    }


    return (
        <section className="py-20 bg-[#0f0f10]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                        🎬 Our Portfolio
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Our Work in Action
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                        Browse through our gallery of events and watch live performances from our roster.
                    </p>
                </div>

                {/* Image Gallery */}
                {images.length > 0 && (
                    <div className="mb-16">
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-gradient-to-b from-orange-500 to-pink-600 rounded-full" />
                            Event Gallery
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                            {pageImages.map((img) => (
                                <div
                                    key={img.id}
                                    onClick={() => setSelectedImage(img.url)}
                                    className="relative aspect-square rounded-xl overflow-hidden cursor-pointer group border border-gray-800/50 hover:border-orange-500/30 transition-all"
                                >
                                    <Image
                                        src={img.url}
                                        alt={img.title || "Portfolio"}
                                        fill
                                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                                    />
                                    {img.title && (
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                                            <p className="text-white text-xs font-medium line-clamp-2">{img.title}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-3 mt-8">
                                <button
                                    onClick={() => setImagePage((p) => Math.max(0, p - 1))}
                                    disabled={imagePage === 0}
                                    className="p-2 rounded-xl bg-[#1a1a1a] border border-gray-800 text-gray-400 hover:text-white hover:border-orange-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronLeft className="w-5 h-5" />
                                </button>
                                {Array.from({ length: totalPages }).map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => setImagePage(i)}
                                        className={`w-8 h-8 rounded-lg text-sm font-medium transition-all ${i === imagePage
                                            ? "bg-gradient-to-r from-orange-500 to-pink-600 text-white"
                                            : "bg-[#1a1a1a] border border-gray-800 text-gray-500 hover:text-white"
                                            }`}
                                    >
                                        {i + 1}
                                    </button>
                                ))}
                                <button
                                    onClick={() => setImagePage((p) => Math.min(totalPages - 1, p + 1))}
                                    disabled={imagePage === totalPages - 1}
                                    className="p-2 rounded-xl bg-[#1a1a1a] border border-gray-800 text-gray-400 hover:text-white hover:border-orange-500/50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                >
                                    <ChevronRight className="w-5 h-5" />
                                </button>
                            </div>
                        )}
                    </div>
                )}

                {/* YouTube Videos: Same player as artist profile */}
                {videos.length > 0 && (
                    <div>
                        <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                            <span className="w-2 h-6 bg-gradient-to-b from-red-500 to-red-700 rounded-full" />
                            Live Performances
                        </h3>
                        <div className="grid lg:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-gray-800">
                            {/* Main Player */}
                            <div className="lg:col-span-2 bg-black">
                                {activeVideo && (
                                    <div className="relative aspect-video">
                                        {isVideoPlaying ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&modestbranding=1&rel=0`}
                                                title={activeVideo.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0 w-full h-full"
                                            />
                                        ) : (
                                            <div
                                                className="absolute inset-0 cursor-pointer group"
                                                onClick={() => setIsVideoPlaying(true)}
                                            >
                                                {activeVideo.thumbnail ? (
                                                    <Image
                                                        src={activeVideo.thumbnail}
                                                        alt={activeVideo.title}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full bg-gray-900" />
                                                )}
                                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-red-600/50">
                                                        <Play className="w-10 h-10 text-white ml-1" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                    <h4 className="text-lg font-semibold text-white">{activeVideo.title}</h4>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            {/* Sidebar */}
                            <div className="bg-[#141414] max-h-[400px] lg:max-h-none overflow-y-auto custom-scrollbar">
                                <div className="p-3 border-b border-gray-800 sticky top-0 bg-[#141414] z-10 flex items-center gap-2">
                                    <Youtube className="w-4 h-4 text-red-500" />
                                    <p className="text-sm text-gray-400 font-medium">{videos.length} Videos</p>
                                </div>
                                {videos.map((video: any, index: number) => {
                                    const isActive = index === activeVideoIndex;
                                    return (
                                        <button
                                            key={video.id}
                                            onClick={() => { setActiveVideoIndex(index); setIsVideoPlaying(false); }}
                                            className={`w-full flex items-start gap-3 p-3 text-left transition-all hover:bg-white/5 ${isActive ? "bg-orange-500/10 border-l-4 border-orange-500" : "border-l-4 border-transparent"
                                                }`}
                                        >
                                            <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                                                {video.thumbnail && (
                                                    <Image src={video.thumbnail} alt={video.title} fill className="object-cover" />
                                                )}
                                                <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                                                    <Play className="w-5 h-5 text-white/80" />
                                                </div>
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-medium line-clamp-2 ${isActive ? "text-orange-400" : "text-gray-300"}`}>
                                                    {video.title || "Untitled"}
                                                </p>
                                                <p className="text-xs text-gray-500 mt-1">Artist Factory</p>
                                            </div>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Lightbox */}
            {selectedImage && (
                <div
                    className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                    onClick={() => setSelectedImage(null)}
                >
                    <button
                        onClick={() => setSelectedImage(null)}
                        className="absolute top-4 right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"
                    >
                        ✕
                    </button>
                    <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
                        <Image src={selectedImage} alt="Portfolio" fill className="object-contain" />
                    </div>
                </div>
            )}
        </section>
    );
}

// ─── FAQ ────────────────────────────────────────────────────────
function FAQItem({ q, a }: { q: string; a: string }) {
    const [open, setOpen] = useState(false);
    return (
        <div
            className="border border-gray-800 rounded-2xl overflow-hidden hover:border-gray-700 transition-colors"
            onClick={() => setOpen(!open)}
        >
            <button className="w-full flex items-center justify-between p-6 text-left">
                <span className="text-white font-semibold pr-4">{q}</span>
                <span className={`text-orange-400 text-xl font-light flex-shrink-0 transition-transform duration-300 ${open ? "rotate-45" : ""}`}>+</span>
            </button>
            {open && (
                <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-800/60 pt-4">
                    {a}
                </div>
            )}
        </div>
    );
}

// ─── Main Page ───────────────────────────────────────────────────
export default function AboutPage() {
    // Auto-cycle neon effect for "Why Choose Us" cards
    const [activeNeonIndex, setActiveNeonIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setActiveNeonIndex((prev) => (prev + 1) % whyChooseUs.length);
        }, 3000);
        return () => clearInterval(interval);
    }, []);

    return (
        <div className="min-h-screen bg-[#0a0a0b]">

            {/* ══ HERO ══════════════════════════════════════════════════ */}
            <section className="relative py-28 md:py-36 overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-orange-500/8 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-[400px] h-[400px] bg-pink-600/8 rounded-full blur-[100px]" />
                </div>
                <div className="relative max-w-4xl mx-auto px-4 text-center">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-8 border border-orange-500/30">
                        ✨ Our Story
                    </span>
                    <h1 className="text-5xl md:text-7xl font-extrabold text-white mb-6 tracking-tight leading-none">
                        Where Art Meets{" "}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                            Excellence
                        </span>
                    </h1>
                    <p className="text-gray-400 text-xl max-w-2xl mx-auto leading-relaxed">
                        Artist Factory is Pakistan&apos;s premier talent booking platform — bridging world-class performers and clients across borders since 2020.
                    </p>
                </div>
            </section>

            {/* ══ OUR FOUNDER ════════════════════════════════════════════ */}
            <section className="py-20 bg-[#0f0f10]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-0 bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-800/50 shadow-2xl shadow-black/50">
                        {/* Founder Photo */}
                        <div className="relative min-h-[420px] lg:min-h-[560px]">
                            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center">
                                {/* Placeholder — replace src with real founder photo */}
                                <div className="flex flex-col items-center gap-4 text-center p-12">
                                    <div className="w-48 h-48 rounded-full bg-gradient-to-br from-orange-500/30 to-pink-600/30 flex items-center justify-center border-4 border-orange-500/20">
                                        <Users className="w-24 h-24 text-orange-400/40" />
                                    </div>
                                    <p className="text-gray-600 text-sm">(Founder photo placeholder)</p>
                                </div>
                            </div>
                            <div className="absolute inset-0 bg-gradient-to-r from-transparent to-[#1a1a1a]/20 hidden lg:block" />
                        </div>

                        {/* Founder Bio */}
                        <div className="p-10 lg:p-14 flex flex-col justify-center">
                            <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium mb-6 w-fit">
                                👤 Our Founder
                            </span>
                            <h2 className="text-3xl lg:text-4xl font-bold text-white mb-1">
                                Abubakar Javed
                            </h2>
                            <p className="text-orange-400 font-medium mb-6">Founder, The Artist Factory</p>

                            <div className="space-y-4 max-h-[380px] overflow-y-auto custom-scrollbar pr-2">
                                <p className="text-gray-300 text-lg leading-relaxed italic border-l-2 border-orange-500/40 pl-4">
                                    &ldquo;I build entertainment infrastructure designed for scale, precision, and global standards.&rdquo;
                                </p>
                                <p className="text-gray-400 leading-relaxed">
                                    With formal training from the <span className="text-white font-medium">Berklee College of Music</span> and an <span className="text-white font-medium">ACCA qualification from London</span>, Abubakar combines creative direction with financial and operational discipline — ensuring every production is both artistically powerful and professionally executed.
                                </p>
                                <p className="text-gray-400 leading-relaxed">
                                    As former <span className="text-white font-medium">Music Producer and Project Director at the Lahore Arts Council</span>, he launched <em>Alhamra Unplugged</em>, elevating live studio production standards in Pakistan.
                                </p>
                                <p className="text-gray-400 leading-relaxed">
                                    Over the years, he has collaborated with artists including <span className="text-white font-medium">Abrar-ul-Haq, Hadiqa Kiani, Javed Bashir, and Qurat-ul-Ain Balouch</span> — delivering music production for films, multinational campaigns, diplomatic missions, and high-profile corporate events.
                                </p>
                                <p className="text-gray-400 leading-relaxed">
                                    Today, through <span className="text-white font-medium">The Artist Factory</span>, we manage a curated network of <span className="text-orange-400 font-semibold">1,000+ professional artists</span> across all major genres and provide complete entertainment solutions — from artist booking and contract structuring to full production management.
                                </p>
                            </div>

                            {/* CTA Buttons */}
                            <div className="mt-6 pt-5 border-t border-gray-800/50">
                                <p className="text-white font-semibold text-sm mb-4">Plan an Event That Performs</p>
                                <div className="flex flex-col sm:flex-row flex-wrap gap-3">
                                    <a
                                        href="/artists"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-semibold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all hover:scale-105"
                                    >
                                        🎤 Book Artists
                                    </a>
                                    <a
                                        href="/post-requirement"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-white text-sm font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                                    >
                                        📋 Request a Custom Event Proposal
                                    </a>
                                    <a
                                        href="/contact"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/5 border border-white/10 text-gray-300 text-sm font-medium rounded-xl hover:bg-white/10 hover:border-white/20 transition-all"
                                    >
                                        🎬 Speak to Our Production Team
                                    </a>
                                </div>
                                <p className="text-orange-400 text-xs mt-4 font-medium italic">Let&apos;s build something unforgettable.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ OUR TEAM ═══════════════════════════════════════════════ */}
            <section className="py-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                            👥 Our Team
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            The People Behind the Magic
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            A passionate team of event professionals, artists, and technologists united by one goal: unforgettable experiences.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {teamMembers.map((member) => (
                            <div
                                key={member.name}
                                className="group relative bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 hover:border-orange-500/30 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl hover:shadow-orange-500/5 flex flex-col items-center text-center overflow-hidden"
                            >
                                {/* Avatar */}
                                <div className={`w-20 h-20 rounded-full bg-gradient-to-br ${member.gradient} flex items-center justify-center text-4xl mb-4 shadow-lg`}>
                                    {member.emoji}
                                </div>
                                <h3 className="text-white font-bold text-lg mb-1">{member.name}</h3>
                                <p className={`text-sm font-medium mb-3 text-transparent bg-clip-text bg-gradient-to-r ${member.gradient}`}>
                                    {member.role}
                                </p>
                                <p className="text-gray-500 text-sm leading-relaxed">{member.bio}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ WHY CHOOSE US + STATS ════════════════════════════════ */}
            <section className="py-20 bg-[#0f0f10]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-14">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                            ⭐ Why Choose Us
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            The Artist Factory Difference
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We&apos;ve raised the bar for what a talent booking platform should look like.
                        </p>
                    </div>

                    {/* Reasons Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
                        {whyChooseUs.map((item, idx) => {
                            const isActive = idx === activeNeonIndex;
                            return (
                                <div
                                    key={item.title}
                                    className={`group relative bg-[#1a1a1a] rounded-2xl p-8 border transition-all duration-1000 hover:-translate-y-2 overflow-hidden ${isActive ? 'border-orange-500/30 shadow-[0_0_30px_-10px_rgba(249,115,22,0.15)]' : 'border-gray-800'
                                        }`}
                                >
                                    {/* Neon Glow Effect (Active or Hover) */}
                                    <div className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-br ${item.bg.replace('/10', '/5')} pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                                    <div className={`absolute -inset-px rounded-2xl transition-opacity duration-1000 bg-gradient-to-r ${item.color.replace('text-', 'from-').replace('-400', '-500')} to-transparent blur-sm -z-10 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />

                                    <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 shadow-inner ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        <item.icon className={`w-7 h-7 ${item.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
                                    </div>

                                    <h3 className={`text-xl font-bold mb-3 relative z-10 transition-colors duration-500 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300' : 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300'}`}>
                                        {item.title}
                                    </h3>

                                    <p className={`leading-relaxed text-sm relative z-10 transition-colors duration-500 ${isActive ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                        {item.desc}
                                    </p>

                                    {/* Connecting Line Animation */}
                                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent w-full transition-transform duration-[3000ms] ease-linear ${isActive ? 'translate-x-[100%]' : 'translate-x-[-100%] group-hover:translate-x-[100%]'}`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Social Proof — When Excellence is Non-Negotiable */}
                    <div className="mb-12 relative">
                        <div className="bg-gradient-to-br from-[#1a1010] to-[#1a1a1a] border border-orange-500/20 rounded-3xl p-8 md:p-10 overflow-hidden">
                            {/* Glow */}
                            <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl pointer-events-none" />
                            <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
                                <div>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium mb-4">
                                        ⭐ When Excellence Is Non-Negotiable
                                    </span>
                                    <h3 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight">
                                        Clients Choose Us<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">When Stakes Are Highest</span>
                                    </h3>
                                    <p className="text-gray-400 leading-relaxed mb-2">
                                        Trusted by those for whom <span className="text-white font-semibold">reputation, prestige, and precision</span> are non-negotiable.
                                    </p>
                                    <p className="text-gray-600 text-sm italic">We operate quietly. We deliver powerfully.</p>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        "Reputation is on the line",
                                        "International guests are attending",
                                        "Production failure is not an option",
                                        "The experience must reflect prestige",
                                    ].map((point) => (
                                        <div key={point} className="flex items-center gap-3 group">
                                            <div className="w-5 h-5 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                                                <div className="w-1.5 h-1.5 rounded-full bg-orange-400" />
                                            </div>
                                            <p className="text-gray-300 text-sm group-hover:text-white transition-colors">{point}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Stats Strip */}
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                        {stats.map((stat) => (
                            <div
                                key={stat.label}
                                className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800 text-center group hover:border-orange-500/50 hover:shadow-[0_0_30px_rgba(249,115,22,0.1)] transition-all duration-500 hover:-translate-y-1"
                            >
                                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 group-hover:border-orange-500/50 shadow-lg">
                                    <stat.icon className="w-6 h-6 text-orange-400" />
                                </div>
                                <div className="text-3xl font-extrabold text-white mb-1 flex items-center justify-center gap-0.5">
                                    <AnimatedCounter end={stat.value} duration={2000} suffix={stat.suffix} />
                                </div>
                                <p className="text-gray-500 text-sm font-medium uppercase tracking-wider">{stat.label}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ PORTFOLIO (dynamic) ════════════════════════════════════ */}
            <PortfolioGrid bgClass="bg-[#0f0f10]" />

            {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
            <TestimonialsSection bgClass="bg-[#0a0a0b]" />

            {/* ══ FAQ ═════════════════════════════════════════════════════ */}
            <section className="py-20 bg-[#0f0f10]">
                <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-12">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                            ❓ FAQs
                        </span>
                        <h2 className="text-4xl font-extrabold text-white mb-4">Frequently Asked Questions</h2>
                        <p className="text-gray-400">Got questions? We&apos;ve got answers.</p>
                    </div>
                    <div className="space-y-4">
                        {faqs.map((faq) => (
                            <FAQItem key={faq.q} q={faq.q} a={faq.a} />
                        ))}
                    </div>
                </div>
            </section>

            {/* ══ CTA ═════════════════════════════════════════════════════ */}
            <section className="py-20 relative overflow-hidden">
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
                </div>
                <div className="max-w-4xl mx-auto px-4 relative z-10">
                    <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 rounded-3xl p-12 text-center shadow-2xl">
                        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">Ready to Create Magic?</h2>
                        <p className="text-white/90 mb-8 text-lg max-w-xl mx-auto">
                            Book a world-class artist for your next event or post your requirement and let our team do the rest.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/artists"
                                className="px-8 py-4 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-xl hover:scale-105"
                            >
                                Browse Artists
                            </Link>
                            <Link
                                href="/post-requirement"
                                className="px-8 py-4 bg-white/10 text-white font-semibold rounded-full hover:bg-white/20 border-2 border-white/30 hover:border-white/50 transition-all"
                            >
                                Post a Requirement
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom Scrollbar Style */}
            <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: #1a1a1a; }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ec4899);
          border-radius: 10px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
        </div>
    );
}
