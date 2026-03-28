'use client';

import { useEffect, useState, useRef } from 'react';
import { ChevronLeft, ChevronRight, Loader2, PlaySquare } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import VideoTestimonialCard from './VideoTestimonialCard';

export default function ArtistVideoTestimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    useEffect(() => {
        async function fetchVideoTestimonials() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/artist-testimonials`);
                if (res.ok) {
                    const data = await res.json();
                    // Filter those with video_url
                    const videoOnly = data.filter((t: any) => t.video_url && t.is_active);
                    setTestimonials(videoOnly);
                }
            } catch (err) {
                console.error('Failed to fetch video testimonials:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchVideoTestimonials();
    }, []);

    const next = () => {
        setPlayingId(null); // Stop video on slide
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };
    
    const prev = () => {
        setPlayingId(null); // Stop video on slide
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    // Detect if section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                setInView(entry.isIntersecting);
            },
            { threshold: 0.3 } // Start playing when 30% of section is visible
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, []);

    // Handle Autoplay on scroll/slide - ONLY when in view
    useEffect(() => {
        if (inView && testimonials.length > 0) {
            setPlayingId(testimonials[currentIndex].id);
        } else {
            setPlayingId(null); // Pause if scrolled away
        }
    }, [inView, currentIndex, testimonials]);

    const handleTogglePlay = (id: string, play: boolean) => {
        if (play) {
            setPlayingId(id);
        } else {
            setPlayingId(null);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    if (testimonials.length === 0) return null;

    return (
        <section ref={sectionRef} className="relative py-24 overflow-hidden bg-black">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none opacity-30">
                <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-orange-600/10 rounded-full blur-[120px]" />
                <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase mb-6">
                        <PlaySquare className="w-3.5 h-3.5" />
                        Video Stories
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-none uppercase">
                        The Stage & <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 italic font-serif">Their Story</span>
                    </h2>
                    <p className="text-gray-400 text-xl max-w-3xl mx-auto font-medium leading-relaxed italic">
                        Go behind the scenes and hear from the stars who turn every event into a masterpiece.
                    </p>
                </div>

                {/* Main Content Carousel Area */}
                <div className="relative max-w-5xl mx-auto">
                    <div className="overflow-hidden">
                        <div 
                            className="transition-transform duration-700 ease-in-out flex"
                            style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                        >
                            {testimonials.map((t) => (
                                <div key={t.id} className="w-full flex-shrink-0 px-4">
                                    <VideoTestimonialCard
                                        id={t.id}
                                        name={t.name}
                                        role={t.role}
                                        review={t.review}
                                        videoUrl={t.video_url}
                                        eventName={t.event_name}
                                        customMessage={t.custom_message}
                                        thumbnail={t.photo_url}
                                        isPlaying={playingId === t.id}
                                        onTogglePlay={handleTogglePlay}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Navigation Arrows - Repositioned to Sides */}
                    {testimonials.length > 1 && (
                        <>
                            <button
                                onClick={prev}
                                disabled={currentIndex === 0}
                                className={`absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 z-30 w-14 h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-orange-500 hover:border-orange-500 transition-all group shadow-2xl ${currentIndex === 0 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                            >
                                <ChevronLeft className="w-8 h-8 group-hover:-translate-x-1 transition-transform" />
                            </button>
                            <button
                                onClick={next}
                                disabled={currentIndex === testimonials.length - 1}
                                className={`absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 z-30 w-14 h-14 rounded-full border border-white/10 bg-black/40 backdrop-blur-md flex items-center justify-center text-white hover:bg-orange-500 hover:border-orange-500 transition-all group shadow-2xl ${currentIndex === testimonials.length - 1 ? 'opacity-30 cursor-not-allowed' : 'opacity-100'}`}
                            >
                                <ChevronRight className="w-8 h-8 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </>
                    )}
                </div>
            </div>
        </section>
    );
}
