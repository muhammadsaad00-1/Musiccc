'use client';

import Link from 'next/link';
import { ArrowRight, MessageSquare } from 'lucide-react';
import Image from 'next/image';

export default function ReadyForMomentsCTA() {
    return (
        <section className="py-12 px-4 relative overflow-hidden">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[400px] bg-red-600/10 rounded-full blur-[140px]" />
            </div>
            
            <div className="max-w-7xl mx-auto">
                <div className="relative bg-gradient-to-br from-[#801b1b] via-[#611212] to-[#400c0c] border border-red-900/40 rounded-[2.5rem] p-8 md:px-16 md:py-14 text-center shadow-3xl overflow-hidden group">
                    {/* Glossy Overlay & Patterns */}
                    <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-5 mix-blend-overlay" />
                    
                    {/* Floating Star Icon (from image) */}
                    <div className="absolute top-6 right-8 opacity-10 group-hover:opacity-20 transition-opacity duration-1000 rotate-12">
                        <svg width="120" height="120" viewBox="0 0 24 24" fill="white">
                            <path d="M12 1.7L15 8.3L22.3 8.8L16.7 13.5L18.5 20.6L12 16.7L5.5 20.6L7.3 13.5L1.7 8.8L9 8.3L12 1.7Z" />
                        </svg>
                    </div>

                    <div className="relative z-10">
                        <h2 className="text-3xl md:text-6xl font-black text-white mb-6 tracking-tighter leading-tight italic font-serif">
                            Ready to create your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-300 to-white not-italic uppercase font-sans text-4xl md:text-5xl">unforgettable moment?</span>
                        </h2>
                        
                        <p className="text-red-100/70 text-base md:text-lg max-w-2xl mx-auto mb-10 font-medium leading-relaxed">
                            Book a top artist for your next event — weddings, concerts, corporate or private. Let&apos;s turn your vision into a star-studded reality.
                        </p>
                        
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
                            <Link 
                                href="/artists"
                                className="w-full sm:w-auto px-10 py-4 bg-white text-[#611212] font-black rounded-xl hover:bg-orange-400 hover:text-white transition-all duration-300 flex items-center justify-center gap-2 group/btn shadow-xl shadow-black/20 hover:scale-105 active:scale-95 text-sm uppercase tracking-wider"
                            >
                                BROWSE ARTISTS <ArrowRight className="w-5 h-5 group-hover/btn:translate-x-1 transition-transform" />
                            </Link>
                            
                            <a 
                                href="https://wa.me/923206876442?text=Hello%20Artist%20Factory!%20I'm%20interested%20in%20an%20EXPRESS%20BOOKING%20for%20my%20event."
                                target="_blank"
                                rel="noopener noreferrer"
                                className="w-full sm:w-auto px-10 py-4 bg-transparent border-2 border-white/20 text-white font-black rounded-xl hover:bg-white/10 hover:border-white transition-all duration-300 flex items-center justify-center gap-2 group/wa active:scale-95 text-sm uppercase tracking-wider"
                            >
                                <MessageSquare className="w-5 h-5 fill-current text-green-400" />
                                EXPRESS BOOKING
                            </a>
                        </div>
                        
                        <div className="mt-12 flex items-center justify-center gap-4 opacity-80">
                            <div className="h-[1px] w-8 bg-white/20" />
                            <div className="flex items-center gap-2">
                                <Image 
                                    src="/logo-taf.png" 
                                    alt="Artist Factory Logo" 
                                    width={24} 
                                    height={24} 
                                    className="object-contain"
                                />
                                <span className="text-white text-[10px] font-bold uppercase tracking-[0.3em]">The Artist Factory</span>
                            </div>
                            <div className="h-[1px] w-8 bg-white/20" />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
