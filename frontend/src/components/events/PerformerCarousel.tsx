'use client';

import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface PerformerCarouselProps {
    eventName: string;
    categories: any[];
    artists: any[];
}

export default function PerformerCarousel({ eventName, categories, artists }: PerformerCarouselProps) {
    const [activeCategory, setActiveCategory] = useState<string>('');
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const router = useRouter();

    // Set initial active category
    useEffect(() => {
        if (categories && categories.length > 0 && !activeCategory) {
            setActiveCategory(categories[0].name.toLowerCase());
        }
    }, [categories, activeCategory]);

    // Auto-scroll logic
    useEffect(() => {
        const scrollContainer = scrollContainerRef.current;
        if (!scrollContainer) return;

        let scrollInterval: NodeJS.Timeout;

        const startScrolling = () => {
            scrollInterval = setInterval(() => {
                if (scrollContainer) {
                    // Check if we reached the end (added 10px buffer for sub-pixel/zoom rounding accuracy)
                    if (
                        Math.ceil(scrollContainer.scrollLeft + scrollContainer.clientWidth) >=
                        scrollContainer.scrollWidth - 10
                    ) {
                        scrollContainer.scrollTo({ left: 0, behavior: 'smooth' });
                    } else {
                        // Scroll by approximately one card width
                        const cardWidth = 300; // rough width of a card + gap
                        scrollContainer.scrollBy({ left: cardWidth, behavior: 'smooth' });
                    }
                }
            }, 1500); // Auto-scroll every 1.5 seconds (Faster for higher energy)
        };

        const stopScrolling = () => {
            if (scrollInterval) clearInterval(scrollInterval);
        };

        // Start the scroll
        startScrolling();

        return () => {
            stopScrolling();
        };
    }, [activeCategory]); // Re-bind when category changes to get fresh container width

    // Filter artists by active category
    const categoryArtists = artists.filter((artist) => {
        const cats = Array.isArray(artist.category_id)
            ? artist.category_id
            : [artist.category_id || ''];
        return cats.some((c: string) => {
            const artCat = c.toLowerCase();
            return activeCategory && (
                artCat === activeCategory ||
                activeCategory.includes(artCat) ||
                artCat.includes(activeCategory)
            );
        });
    });

    // Helper: generate whatsapp link
    const getWhatsAppLink = (artistName: string) => {
        const phoneNumber = "923001234567"; // Replace with actual business number
        const message = encodeURIComponent(`Hi, I want to book ${artistName} for a ${eventName} event.`);
        return `https://wa.me/${phoneNumber}?text=${message}`;
    };

    if (categories.length === 0 || artists.length === 0) {
        return null;
    }

    return (
        <section className="py-20 bg-[#0a0a0b] overflow-hidden">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header Sequence per UI screenshot */}
                <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">
                    <h2 className="text-4xl md:text-5xl font-medium text-white tracking-wide">
                        Pick your Performer
                    </h2>
                    <p className="text-gray-300 max-w-sm md:text-right text-sm">
                        Craft your experience: Customize your event with our diverse artists.
                    </p>
                </div>

                {/* Category Pills */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-12">
                    {categories.map((category) => {
                        const isActive = activeCategory === category.name.toLowerCase();
                        return (
                            <button
                                key={category.id || category.name}
                                onClick={() => setActiveCategory(category.name.toLowerCase())}
                                className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-widest transition-all border shadow-lg ${
                                    isActive
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent shadow-orange-500/30'
                                        : 'bg-[#111] text-gray-400 border-gray-800 hover:border-gray-500 hover:text-white'
                                }`}
                            >
                                {category.name}
                            </button>
                        );
                    })}
                </div>

                {/* Carousel Container */}
                {categoryArtists.length > 0 ? (
                    <div className="relative -mx-4 px-4 sm:mx-0 sm:px-0">
                        {/* Fade gradients for edges */}
                        <div className="hidden md:block absolute top-0 left-0 w-24 h-full bg-gradient-to-r from-[#0a0a0b] to-transparent z-10 pointer-events-none" />
                        <div className="hidden md:block absolute top-0 right-0 w-24 h-full bg-gradient-to-l from-[#0a0a0b] to-transparent z-10 pointer-events-none" />

                        <div
                            ref={scrollContainerRef}
                            className="flex gap-4 md:gap-6 overflow-x-auto snap-x snap-mandatory scrollbar-hide pb-8 pt-4"
                            style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                        >
                            {categoryArtists.map((artist, idx) => (
                                <div
                                    key={`${artist.id}-${idx}`}
                                    onClick={() => router.push(`/artist/${artist.slug}`)}
                                    className="snap-start shrink-0 w-[280px] sm:w-[320px] aspect-[3/4] relative rounded-3xl overflow-hidden group border border-gray-800 hover:border-orange-500/50 transition-colors cursor-pointer"
                                >
                                    {/* Image Base */}
                                    <Image
                                        src={artist.image_url || '/placeholder-artist.jpg'}
                                        alt={artist.name}
                                        fill
                                        sizes="(max-width: 640px) 280px, 320px"
                                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                                    />
                                    
                                    {/* Subdued Gradient initially, becomes darker/taller on hover */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-100 transition-opacity duration-300" />
                                    
                                    {/* Content (Bottom Anchored) */}
                                    <div className="absolute inset-x-0 bottom-0 p-6 flex flex-col justify-end translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                                        <h3 className="text-xl sm:text-2xl font-bold text-white mb-4 line-clamp-1">
                                            {artist.name}
                                        </h3>
                                        
                                        {/* Action Buttons */}
                                        <div className="flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                                            <a 
                                                href={getWhatsAppLink(artist.name)}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full text-center py-2.5 bg-green-500 text-white text-sm font-bold rounded-xl hover:bg-green-600 transition-colors shadow-lg shadow-green-500/20"
                                            >
                                                Contact Us (WhatsApp)
                                            </a>
                                            <Link 
                                                href={`/artist/${artist.slug}`}
                                                onClick={(e) => e.stopPropagation()}
                                                className="w-full text-center py-2.5 bg-white/10 backdrop-blur-md border border-white/20 text-white text-sm font-bold rounded-xl hover:bg-white/20 transition-all"
                                            >
                                                View Artist Profile
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-24 bg-[#111] rounded-3xl border border-gray-800/50">
                        <p className="text-gray-500 text-lg">No {activeCategory} listed for this event type yet.</p>
                    </div>
                )}
            </div>
            {/* Global style for hiding scrollbar */}
            <style jsx global>{`
                .scrollbar-hide::-webkit-scrollbar {
                    display: none;
                }
            `}</style>
        </section>
    );
}
