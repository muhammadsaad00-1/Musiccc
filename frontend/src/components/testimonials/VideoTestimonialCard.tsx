'use client';

import { Play } from 'lucide-react';
import Image from 'next/image';

interface VideoTestimonialCardProps {
    id: string;
    name: string;
    role: string;
    review: string;
    videoUrl: string;
    eventName?: string;
    customMessage?: string;
    thumbnail?: string;
    isPlaying: boolean;
    onTogglePlay: (id: string, play: boolean) => void;
    onPrev?: () => void;
    onNext?: () => void;
    hasPrev?: boolean;
    hasNext?: boolean;
}

export default function VideoTestimonialCard({
    id,
    name,
    role,
    review,
    videoUrl,
    eventName,
    customMessage,
    thumbnail,
    isPlaying,
    onTogglePlay,
    onPrev,
    onNext,
    hasPrev,
    hasNext,
}: VideoTestimonialCardProps) {
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return match && match[2].length === 11 ? match[2] : null;
    };

    const videoId = getYouTubeId(videoUrl);
    if (!videoId) return null;

    return (
        <div className="group relative flex flex-col md:flex-row items-center gap-10 bg-[#0f0f10] border border-gray-800 rounded-[2.5rem] p-6 lg:p-10 transition-all duration-500 hover:border-orange-500/20 shadow-2xl">

            {/* ── Phone / Video Column ── */}
            <div className="relative shrink-0 flex flex-col items-center">

                {/* Side navigation arrows — sit on the edges of the phone */}
                {onPrev && (
                    <button
                        onClick={onPrev}
                        disabled={!hasPrev}
                        className={`absolute left-0 top-[40%] -translate-y-1/2 -translate-x-[calc(100%+8px)] z-30 w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-xl ${!hasPrev ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" /></svg>
                    </button>
                )}
                {onNext && (
                    <button
                        onClick={onNext}
                        disabled={!hasNext}
                        className={`absolute right-0 top-[40%] -translate-y-1/2 translate-x-[calc(100%+8px)] z-30 w-10 h-10 rounded-full border border-white/10 bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-white/10 transition-all shadow-xl ${!hasNext ? 'opacity-20 cursor-not-allowed' : 'opacity-80 hover:opacity-100'}`}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                    </button>
                )}

                {/* Ambient glow behind the phone */}
                <div className="absolute inset-0 rounded-[2.4rem] bg-gradient-to-b from-orange-500/30 to-pink-600/30 blur-2xl -z-10 scale-110 opacity-70" />

                {/* Gradient border ring */}
                <div className="p-[3px] rounded-[2.2rem] bg-gradient-to-b from-orange-400 via-pink-500 to-pink-700 shadow-2xl shadow-pink-600/30">
                    <div className="relative w-[290px] sm:w-[320px] aspect-[9/18] rounded-[2rem] overflow-hidden bg-gray-950">

                        {/* Top notification bar (visible when not playing) */}
                        {!isPlaying && (
                            <div className="absolute top-3 left-3 right-3 z-20">
                                <div className="flex items-center gap-2 bg-white/95 backdrop-blur-sm rounded-full pl-1 pr-3 py-1 shadow-lg">
                                    <div className="w-6 h-6 rounded-full bg-orange-500 flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        <Image
                                            src="/the_artist_factory_logo-04 (1).png"
                                            alt="AF"
                                            width={16}
                                            height={16}
                                            className="object-contain scale-90"
                                        />
                                    </div>
                                    <p className="text-[9px] text-gray-800 font-semibold truncate flex-1 leading-tight">
                                        {name}
                                        {eventName ? ` · ${eventName}` : ''}
                                    </p>
                                    <span className="text-[8px] text-gray-500 whitespace-nowrap flex-shrink-0 font-medium">
                                        Artist Factory
                                    </span>
                                </div>
                            </div>
                        )}

                        {/* Thumbnail + play button */}
                        {!isPlaying ? (
                            <>
                                <Image
                                    src={thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                                    alt={name}
                                    fill
                                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />

                                <button
                                    onClick={() => onTogglePlay(id, true)}
                                    className="absolute inset-0 flex items-center justify-center"
                                >
                                    <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-transform">
                                        <Play className="w-7 h-7 text-white fill-white ml-1" />
                                    </div>
                                </button>
                            </>
                        ) : (
                            <div className="relative w-full h-full">
                                <iframe
                                    src={`https://www.youtube.com/embed/${videoId}?autoplay=1&mute=0&modestbranding=1&rel=0`}
                                    className="w-full h-full"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                />
                                <button
                                    onClick={() => onTogglePlay(id, false)}
                                    className="absolute top-4 left-4 px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-white text-[10px] font-bold uppercase tracking-wider border border-white/10 hover:bg-black/80 transition-all"
                                >
                                    Stop
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* ── Circular Verified Badge ── */}
                <div className="relative mt-[-28px] z-20 drop-shadow-2xl">
                    <svg viewBox="0 0 160 160" width="148" height="148" className="select-none">
                        {/* Outer dark ring */}
                        <circle cx="80" cy="80" r="78" fill="#0d0a06" />
                        {/* Amber border */}
                        <circle cx="80" cy="80" r="77" fill="none" stroke="#d97706" strokeWidth="2" />
                        {/* Inner dashed ring */}
                        <circle cx="80" cy="80" r="65" fill="none" stroke="#d97706" strokeWidth="1" strokeDasharray="3 3" />

                        <defs>
                            <path
                                id="top-arc"
                                d="M 13,80 A 67,67 0 1,1 147,80"
                            />
                            <path
                                id="bottom-arc"
                                d="M 20,80 A 60,60 0 0,0 140,80"
                            />
                        </defs>

                        <text fontSize="9" fill="#d97706" fontWeight="700" letterSpacing="3">
                            <textPath href="#top-arc" startOffset="3%">
                                ARTIST FACTORY · VERIFIED ARTISTS ·
                            </textPath>
                        </text>

                        <text fontSize="8.5" fill="#9ca3af" fontWeight="500" letterSpacing="2.2">
                            <textPath href="#bottom-arc" startOffset="6%">
                                PREMIUM LIVE ENTERTAINMENT
                            </textPath>
                        </text>

                        {/* Centre text */}
                        <text x="80" y="70" textAnchor="middle" fontSize="13" fill="white" fontWeight="800" fontFamily="Georgia, serif">
                            Artist
                        </text>
                        <text x="80" y="87" textAnchor="middle" fontSize="15" fill="#f97316" fontWeight="700" fontStyle="italic" fontFamily="Georgia, serif">
                            Factory
                        </text>
                        <text x="80" y="101" textAnchor="middle" fontSize="8.5" fill="#d1d5db" fontWeight="600" letterSpacing="2">
                            VERIFIED
                        </text>
                    </svg>
                </div>
            </div>

            {/* ── Content Side ── */}
            <div className="flex-1 text-center md:text-left py-4">
                <div className="mb-8 space-y-4">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 text-orange-400 text-[10px] font-bold tracking-widest uppercase">
                        Artist Spotlight
                    </div>
                    <div>
                        <h3 className="text-3xl md:text-5xl font-black text-white tracking-tighter uppercase leading-tight">
                            {name}
                        </h3>
                        <p className="text-orange-500 text-sm font-bold tracking-[0.3em] uppercase mt-2">
                            {role}
                        </p>
                    </div>
                </div>

                <div className="relative mb-10">
                    <div className="absolute -left-6 top-0 w-1 h-full bg-gradient-to-b from-orange-500 to-transparent rounded-full opacity-30 hidden md:block" />
                    <p className="text-gray-300 text-xl md:text-2xl font-medium leading-relaxed italic pr-4">
                        &quot;{review}&quot;
                    </p>
                </div>

                {customMessage ? (
                    <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl" />
                        <p className="text-gray-200 text-lg font-medium leading-relaxed italic">
                            &quot;{customMessage}&quot;
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative overflow-hidden">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl" />
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Thank You{' '}
                            <span className="text-white font-bold">{role}</span> for your
                            incredible performance at
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 text-xl font-black mt-1 uppercase tracking-tight">
                                {eventName || 'Our Recent Event'}
                            </span>
                        </p>
                    </div>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 opacity-80">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl">
                        <Image
                            src="/the_artist_factory_logo-04 (1).png"
                            alt="Artist Factory Logo"
                            width={80}
                            height={80}
                            className="h-8 w-auto object-contain"
                        />
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none mt-0.5">
                            Artist Factory <br /> Exclusive
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
