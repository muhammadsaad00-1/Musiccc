'use client';

import { useEffect, useState } from 'react';
import { Star, Quote, Loader2 } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import Image from 'next/image';

export default function WallOfLoveGrid() {
    const [testimonials, setTestimonials] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchAllTestimonials() {
            try {
                const res = await fetch(`${API_BASE_URL}/api/artist-testimonials`);
                if (res.ok) {
                    const data = await res.json();
                    setTestimonials(data.filter((t: any) => t.is_active));
                }
            } catch (err) {
                console.error('Failed to fetch testimonials:', err);
            } finally {
                setLoading(false);
            }
        }
        fetchAllTestimonials();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
            </div>
        );
    }

    return (
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
            {testimonials.map((t, idx) => (
                <div 
                    key={t.id} 
                    className="break-inside-avoid bg-[#1a1a1a] border border-gray-800 rounded-3xl p-8 hover:border-orange-500/30 transition-all duration-300 group relative overflow-hidden"
                >
                    {/* Decorative Quote */}
                    <Quote className="absolute -right-2 -top-2 w-20 h-20 text-white/5 group-hover:text-orange-500/5 transition-colors" />
                    
                    {/* Stars */}
                    <div className="flex gap-1 mb-6">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <Star 
                                key={s} 
                                className={`w-4 h-4 ${s <= t.rating ? 'fill-orange-400 text-orange-400' : 'text-gray-700'}`} 
                            />
                        ))}
                    </div>

                    {/* Review Text */}
                    <p className="text-gray-300 leading-relaxed mb-8 text-lg font-medium">
                        &quot;{t.review}&quot;
                    </p>

                    {/* Author */}
                    <div className="flex items-center gap-4 pt-6 border-t border-gray-800/50">
                        {t.photo_url ? (
                            <div className="relative w-12 h-12 rounded-full overflow-hidden ring-2 ring-gray-800">
                                <Image 
                                    src={t.photo_url} 
                                    alt={t.name} 
                                    fill 
                                    className="object-cover"
                                />
                            </div>
                        ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-800 flex items-center justify-center text-2xl">
                                {t.emoji || '🎵'}
                            </div>
                        )}
                        <div>
                            <h4 className="text-white font-bold">{t.name}</h4>
                            <p className="text-gray-500 text-sm uppercase tracking-wider">{t.role} • {t.location}</p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
