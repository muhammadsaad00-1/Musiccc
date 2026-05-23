'use client';

import { useEffect, useState, useRef } from 'react';
import { Loader2, PlaySquare } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import VideoTestimonialCard from './VideoTestimonialCard';

export default function ArtistVideoTestimonials() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [playingId, setPlayingId] = useState<string | null>(null);
    const [inView, setInView] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);
    const mobileScrollRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchVideoTestimonials() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/artist-testimonials`);
                if (res.ok) {
                    const data = await res.json();
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
        setPlayingId(null);
        setCurrentIndex((prev) => (prev + 1) % testimonials.length);
    };

    const prev = () => {
        setPlayingId(null);
        setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
    };

    /* Sync mobile scroll → dot indicator */
    const handleMobileScroll = () => {
        const el = mobileScrollRef.current;
        if (!el) return;
        const slideWidth = el.scrollWidth / testimonials.length;
        const idx = Math.round(el.scrollLeft / slideWidth);
        setCurrentIndex(idx);
        setPlayingId(null);
    };

    /* Sync dot click → mobile scroll position */
    const scrollToSlide = (idx: number) => {
        const el = mobileScrollRef.current;
        if (el) {
            const slideWidth = el.scrollWidth / testimonials.length;
            el.scrollTo({ left: idx * slideWidth, behavior: 'smooth' });
        }
        setCurrentIndex(idx);
        setPlayingId(null);
    };

    /* Intersection observer for autoplay */
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => setInView(entry.isIntersecting),
            { threshold: 0.3 }
        );
        if (sectionRef.current) observer.observe(sectionRef.current);
        return () => observer.disconnect();
    }, []);

    useEffect(() => {
        if (inView && testimonials.length > 0) {
            setPlayingId(testimonials[currentIndex].id);
        } else {
            setPlayingId(null);
        }
    }, [inView, currentIndex, testimonials]);

    const handleTogglePlay = (id: string, play: boolean) => {
        setPlayingId(play ? id : null);
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
        <section ref={sectionRef} className="relative py-16 md:py-24 overflow-hidden bg-black">
            {/* Background gradients */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/20 rounded-full blur-[120px]" />
                <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/15 rounded-full blur-[120px]" />
                <div className="absolute -top-20 left-1/4 w-[320px] h-[320px] bg-orange-600/10 rounded-full blur-[100px]" />
                <div className="absolute -bottom-20 right-1/4 w-[320px] h-[320px] bg-purple-600/10 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto">
                {/* Header */}
                <div className="text-center mb-10 md:mb-16 px-4">
                    <div className="flex items-center justify-center gap-3 text-[11px] font-semibold tracking-[4px] uppercase text-orange-400 mb-5">
                        <span className="w-8 h-[1px] bg-orange-500/50" />
                        Video Stories
                        <span className="w-8 h-[1px] bg-orange-500/50" />
                    </div>
                    <h2 className="text-4xl md:text-6xl font-black text-white mb-4 md:mb-6 tracking-tight leading-tight">
                        Look what our artists{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                            have to say about us
                        </span>
                    </h2>
                    <p className="text-gray-500 text-base md:text-lg max-w-2xl mx-auto leading-relaxed">
                        Hear directly from the performers who trust Artist Factory to grow their careers and fill their calendars.
                    </p>
                </div>

                {/* ── Mobile: scroll-snap peek carousel ── */}
                <div className="md:hidden">
                    <div
                        ref={mobileScrollRef}
                        onScroll={handleMobileScroll}
                        className="flex overflow-x-auto snap-x snap-mandatory gap-4 pb-2"
                        style={{ scrollbarWidth: 'none', WebkitOverflowScrolling: 'touch' }}
                    >
                        {testimonials.map((t, i) => (
                            <div
                                key={t.id}
                                className={`snap-center flex-shrink-0 w-[82vw] ${i === 0 ? 'ml-[9vw]' : ''} ${i === testimonials.length - 1 ? 'mr-[9vw]' : ''}`}
                            >
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

                    {/* Mobile dots */}
                    {testimonials.length > 1 && (
                        <div className="flex justify-center gap-2 mt-6">
                            {testimonials.map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => scrollToSlide(i)}
                                    className={`rounded-full transition-all duration-300 ${
                                        i === currentIndex
                                            ? 'w-6 h-2 bg-orange-500'
                                            : 'w-2 h-2 bg-gray-600 hover:bg-gray-400'
                                    }`}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* ── Desktop: transform carousel ── */}
                <div className="hidden md:block">
                    <div className="relative max-w-5xl mx-auto px-6 lg:px-8">
                        <div className="overflow-hidden">
                            <div
                                className="transition-transform duration-700 ease-in-out flex"
                                style={{ transform: `translateX(-${currentIndex * 100}%)` }}
                            >
                                {testimonials.map((t) => (
                                    <div key={t.id} className="w-full flex-shrink-0 px-8 md:px-16">
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
                                            onPrev={testimonials.length > 1 ? prev : undefined}
                                            onNext={testimonials.length > 1 ? next : undefined}
                                            hasPrev={currentIndex > 0}
                                            hasNext={currentIndex < testimonials.length - 1}
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Desktop dots */}
                        {testimonials.length > 1 && (
                            <div className="flex justify-center gap-2 mt-8">
                                {testimonials.map((_, i) => (
                                    <button
                                        key={i}
                                        onClick={() => { setCurrentIndex(i); setPlayingId(null); }}
                                        className={`rounded-full transition-all duration-300 ${
                                            i === currentIndex
                                                ? 'w-6 h-2 bg-orange-500'
                                                : 'w-2 h-2 bg-gray-700 hover:bg-gray-500'
                                        }`}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    );
}
