'use client';

import { Play, Volume2, VolumeX } from 'lucide-react';
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
    onTogglePlay
}: VideoTestimonialCardProps) {
    // Extract YouTube ID (Supports regular, shorts, and mobile links)
    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };

    const videoId = getYouTubeId(videoUrl);

    if (!videoId) return null;

    return (
        <div className="group relative flex flex-col md:flex-row items-center gap-8 bg-[#0f0f10] border border-gray-800 rounded-[2.5rem] p-6 lg:p-10 transition-all duration-500 hover:border-orange-500/30 shadow-2xl">
            {/* Portrait Video Container */}
            <div className="relative w-full max-w-[300px] aspect-[9/16] rounded-[2rem] overflow-hidden bg-gray-900 shadow-2xl ring-1 ring-white/10 group-hover:ring-orange-500/30 transition-all duration-500 shrink-0">
                {!isPlaying ? (
                    <>
                        <Image
                            src={thumbnail || `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`}
                            alt={name}
                            fill
                            className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/10 transition-colors" />
                        <button
                            onClick={() => onTogglePlay(id, true)}
                            className="absolute inset-0 flex items-center justify-center transition-transform duration-500 group-hover:scale-110"
                        >
                            <div className="w-16 h-16 bg-orange-500 rounded-full flex items-center justify-center shadow-2xl group-hover:bg-orange-600 transition-colors">
                                <Play className="w-6 h-6 text-white fill-white ml-1" />
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

                {/* Badge Overlay */}
                {!isPlaying && (
                    <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-black/60 backdrop-blur-md border border-white/10 rounded-xl p-3 text-center">
                            <p className="text-white text-[10px] font-bold tracking-widest uppercase">Verified Performance</p>
                        </div>
                    </div>
                )}
            </div>

            {/* Content Side */}
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

                {/* Custom Message Section */}
                {customMessage ? (
                    <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative overflow-hidden group/thanks animate-in fade-in slide-in-from-bottom-4 duration-700">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover/thanks:bg-orange-500/10 transition-colors" />
                        <p className="text-gray-200 text-lg font-medium leading-relaxed italic">
                            &quot;{customMessage}&quot;
                        </p>
                    </div>
                ) : (
                    <div className="mt-8 p-6 bg-white/5 border border-white/10 rounded-2xl backdrop-blur-sm relative overflow-hidden group/thanks">
                        <div className="absolute top-0 right-0 w-24 h-24 bg-orange-500/5 rounded-full blur-2xl group-hover/thanks:bg-orange-500/10 transition-colors" />
                        <p className="text-gray-400 text-sm font-medium leading-relaxed">
                            Thank You <span className="text-white font-bold">{role}</span> for your incredible performance at 
                            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 text-xl font-black mt-1 uppercase tracking-tight">
                                {eventName || 'Our Recent Event'}
                            </span>
                        </p>
                    </div>
                )}

                <div className="mt-8 flex flex-wrap items-center justify-center md:justify-start gap-4 opacity-80">
                    <div className="flex items-center gap-3 px-4 py-2 bg-white/5 border border-white/10 rounded-2xl transition-all duration-500 hover:bg-white/10 hover:border-orange-500/30">
                        <Image 
                            src="/logo-taf.png" 
                            alt="Artist Factory Logo" 
                            width={32} 
                            height={32} 
                            className="object-contain"
                        />
                        <span className="text-gray-400 text-xs font-bold uppercase tracking-widest leading-none mt-0.5">
                            Artist Factory <br/> Exclusive
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
}
