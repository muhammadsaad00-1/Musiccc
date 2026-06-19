'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ChevronLeft, ChevronRight, Play, Disc3 } from 'lucide-react';

interface Album {
    id: number;
    name: string;
    year: string;
    cover: string;
    tracks: number;
}

interface AlbumCarouselProps {
    albums: Album[];
    artistName: string;
}

export default function AlbumCarousel({ albums, artistName }: AlbumCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(false);
    const [autoRotate, setAutoRotate] = useState(true);

    // Auto rotate every 4 seconds
    useEffect(() => {
        if (!autoRotate || albums.length <= 1) return;

        const interval = setInterval(() => {
            nextAlbum();
        }, 4000);

        return () => clearInterval(interval);
    }, [currentIndex, autoRotate, albums.length]);

    const nextAlbum = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev + 1) % albums.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const prevAlbum = () => {
        if (isAnimating) return;
        setIsAnimating(true);
        setCurrentIndex((prev) => (prev - 1 + albums.length) % albums.length);
        setTimeout(() => setIsAnimating(false), 500);
    };

    const goToAlbum = (index: number) => {
        if (isAnimating || index === currentIndex) return;
        setIsAnimating(true);
        setCurrentIndex(index);
        setTimeout(() => setIsAnimating(false), 500);
    };

    // Calculate positions for 3D carousel effect
    const getAlbumStyle = (index: number) => {
        const diff = index - currentIndex;
        const totalAlbums = albums.length;

        // Normalize difference for circular carousel
        let normalizedDiff = diff;
        if (diff > totalAlbums / 2) normalizedDiff = diff - totalAlbums;
        if (diff < -totalAlbums / 2) normalizedDiff = diff + totalAlbums;

        const isCenter = normalizedDiff === 0;
        const isLeft = normalizedDiff === -1 || (normalizedDiff === totalAlbums - 1);
        const isRight = normalizedDiff === 1 || (normalizedDiff === -(totalAlbums - 1));
        const isVisible = Math.abs(normalizedDiff) <= 2;

        if (!isVisible) {
            return {
                opacity: 0,
                transform: 'translateX(0) scale(0.5)',
                zIndex: 0,
                pointerEvents: 'none' as const,
            };
        }

        if (isCenter) {
            return {
                opacity: 1,
                transform: 'translateX(0) scale(1)',
                zIndex: 30,
            };
        }

        if (isLeft) {
            return {
                opacity: 0.7,
                transform: 'translateX(-120%) scale(0.75) rotateY(25deg)',
                zIndex: 20,
            };
        }

        if (isRight) {
            return {
                opacity: 0.7,
                transform: 'translateX(120%) scale(0.75) rotateY(-25deg)',
                zIndex: 20,
            };
        }

        // Far left or right
        return {
            opacity: 0.4,
            transform: `translateX(${normalizedDiff < 0 ? '-200%' : '200%'}) scale(0.5)`,
            zIndex: 10,
        };
    };

    return (
        <div
            className="relative py-8"
            onMouseEnter={() => setAutoRotate(false)}
            onMouseLeave={() => setAutoRotate(true)}
        >
            {/* Section Header */}
            <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                    <Disc3 className="w-6 h-6 text-orange-400" />
                    Discography
                </h2>
                <div className="flex items-center gap-2">
                    <button
                        onClick={prevAlbum}
                        className="p-2 bg-[#1a1a1a] rounded-full text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors border border-gray-800"
                    >
                        <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                        onClick={nextAlbum}
                        className="p-2 bg-[#1a1a1a] rounded-full text-gray-400 hover:text-white hover:bg-[#2a2a2a] transition-colors border border-gray-800"
                    >
                        <ChevronRight className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 3D Carousel */}
            <div className="relative h-[320px] perspective-1000">
                <div className="absolute inset-0 flex items-center justify-center">
                    {albums.map((album, index) => (
                        <div
                            key={album.id}
                            className="absolute transition-all duration-500 ease-out cursor-pointer"
                            style={getAlbumStyle(index)}
                            onClick={() => goToAlbum(index)}
                        >
                            {/* Album Card */}
                            <div className="relative group">
                                {/* Glow Effect for Center Album */}
                                {index === currentIndex && (
                                    <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full blur-2xl opacity-30 animate-pulse" />
                                )}

                                {/* Circular Album Cover */}
                                <div className="relative w-48 h-48 lg:w-56 lg:h-56 rounded-full overflow-hidden border-4 border-gray-800 group-hover:border-orange-500 transition-all shadow-2xl">
                                    <Image
                                        src={album.cover}
                                        alt={album.name}
                                        fill
                                        sizes="(max-width: 1024px) 192px, 224px"
                                        className="object-cover"
                                    />

                                    {/* Play Overlay */}
                                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                        <div className="w-14 h-14 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center transform group-hover:scale-110 transition-transform">
                                            <Play className="w-6 h-6 text-white ml-1" />
                                        </div>
                                    </div>

                                    {/* Vinyl Effect (visible on hover) */}
                                    <div className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-20 transition-opacity">
                                        <div className="absolute inset-4 border border-gray-500 rounded-full" />
                                        <div className="absolute inset-8 border border-gray-600 rounded-full" />
                                        <div className="absolute inset-12 border border-gray-700 rounded-full" />
                                    </div>
                                </div>

                                {/* Spinning Vinyl Behind (for center album) */}
                                {index === currentIndex && (
                                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 lg:w-48 h-40 lg:h-48 -z-10 opacity-60 translate-x-[20%]">
                                        <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900 rounded-full animate-spin-slow border border-gray-700">
                                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-gray-600 rounded-full" />
                                            <div className="absolute inset-3 border border-gray-700 rounded-full" />
                                            <div className="absolute inset-6 border border-gray-800 rounded-full" />
                                            <div className="absolute inset-10 border border-gray-700 rounded-full" />
                                        </div>
                                    </div>
                                )}

                                {/* Album Info (only for center album) */}
                                {index === currentIndex && (
                                    <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 text-center w-64">
                                        <h3 className="text-xl font-bold text-white">{album.name}</h3>
                                        <p className="text-gray-400">{album.year} • {album.tracks} tracks</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Dots Indicator */}
            <div className="flex justify-center gap-2 mt-20">
                {albums.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => goToAlbum(index)}
                        className={`w-2 h-2 rounded-full transition-all ${index === currentIndex
                                ? 'w-8 bg-gradient-to-r from-orange-500 to-pink-600'
                                : 'bg-gray-700 hover:bg-gray-600'
                            }`}
                    />
                ))}
            </div>

            {/* Custom Animation Keyframes */}
            <style jsx>{`
        .perspective-1000 {
          perspective: 1000px;
        }
        @keyframes spin-slow {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
        }
      `}</style>
        </div>
    );
}
