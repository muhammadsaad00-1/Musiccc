'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { ImageIcon, Video, ChevronLeft, ChevronRight, Youtube, Play, X } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface PortfolioItem {
    id: string;
    title: string;
    description?: string;
    item_type: 'image' | 'video';
    media_url: string;
    thumbnail_url?: string;
    display_order: number;
}

// Extract YouTube video ID from URL
function extractYoutubeId(url: string): string | null {
    if (!url) return null;
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/
    );
    return match ? match[1] : null;
}

// Fallback portfolio items
const fallbackPortfolioItems: PortfolioItem[] = [
    {
        id: '1',
        title: 'Corporate Event - Lahore',
        description: 'Annual conference with live entertainment',
        item_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop',
        display_order: 1
    },
    {
        id: '2',
        title: 'Wedding Celebration',
        description: 'Grand wedding with traditional performances',
        item_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800&auto=format&fit=crop',
        display_order: 2
    },
    {
        id: '3',
        title: 'Concert Night - Karachi',
        description: 'Live music concert featuring top artists',
        item_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1501281668745-f7f57925c3b4?w=800&auto=format&fit=crop',
        display_order: 3
    },
    {
        id: '4',
        title: 'Corporate Gala',
        description: 'Elegant corporate evening event',
        item_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop',
        display_order: 4
    },
    {
        id: '5',
        title: 'Festival Performance',
        description: 'Cultural festival with diverse performances',
        item_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&auto=format&fit=crop',
        display_order: 5
    },
    {
        id: '6',
        title: 'Private Party',
        description: 'Exclusive private event',
        item_type: 'image',
        media_url: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop',
        display_order: 6
    }
];

interface PortfolioGridProps {
    bgClass?: string;
}

export default function PortfolioGrid({ bgClass = 'bg-[#0a0a0b]' }: PortfolioGridProps) {
    const [items, setItems] = useState<PortfolioItem[]>(fallbackPortfolioItems);
    const [images, setImages] = useState<PortfolioItem[]>([]);
    const [videos, setVideos] = useState<PortfolioItem[]>([]);
    const [currentImagePage, setCurrentImagePage] = useState(0);
    const [activeVideoIndex, setActiveVideoIndex] = useState(0);
    const [isVideoPlaying, setIsVideoPlaying] = useState(false);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const IMAGES_PER_PAGE = 12;

    useEffect(() => {
        const fetchPortfolio = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/api/portfolio`);
                if (response.ok) {
                    const data: PortfolioItem[] = await response.json();
                    if (data && data.length > 0) {
                        setItems(data);
                        setImages(data.filter(item => item.item_type === 'image'));
                        setVideos(data.filter(item => item.item_type === 'video'));
                        return;
                    }
                }
            } catch (error) {
                console.log('Using fallback portfolio items');
            }
            // Use fallback
            setImages(fallbackPortfolioItems);
        };

        fetchPortfolio();
    }, []);

    const totalImagePages = Math.ceil(images.length / IMAGES_PER_PAGE);
    const currentImages = images.slice(
        currentImagePage * IMAGES_PER_PAGE,
        (currentImagePage + 1) * IMAGES_PER_PAGE
    );

    const nextImagePage = () => {
        if (currentImagePage < totalImagePages - 1) {
            setCurrentImagePage(currentImagePage + 1);
        }
    };

    const prevImagePage = () => {
        if (currentImagePage > 0) {
            setCurrentImagePage(currentImagePage - 1);
        }
    };

    const activeVideo = videos[activeVideoIndex];

    return (
        <section className={`py-20 lg:py-32 ${bgClass} relative overflow-hidden`}>
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-1/3 left-0 w-96 h-96 bg-orange-600/5 rounded-full blur-[140px]" />
                <div className="absolute bottom-1/3 right-0 w-96 h-96 bg-pink-600/5 rounded-full blur-[140px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30 tracking-wide">
                        📸 Our Work
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Portfolio
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Browse through our successful events and memorable moments
                    </p>
                </div>

                {/* Images Grid */}
                <div className="mb-16">
                    <div className="flex items-center justify-between mb-6">
                        <h3 className="text-2xl font-bold text-white flex items-center gap-2">
                            <ImageIcon className="w-6 h-6 text-orange-400" />
                            Event Gallery ({images.length})
                        </h3>
                        {totalImagePages > 1 && (
                            <div className="flex items-center gap-2 text-sm text-gray-400">
                                <span>Page {currentImagePage + 1} of {totalImagePages}</span>
                            </div>
                        )}
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {currentImages.map((item) => (
                            <div
                                key={item.id}
                                onClick={() => setSelectedImage(item.media_url)}
                                className="group relative aspect-square bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/50 transition-all cursor-pointer"
                            >
                                <Image
                                    src={item.media_url}
                                    alt={item.title}
                                    fill
                                    sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
                                    className="object-cover group-hover:scale-110 transition-transform duration-500"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all duration-300 flex items-center justify-center">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity text-center p-4">
                                        <p className="text-white font-semibold text-sm mb-1">{item.title}</p>
                                        {item.description && (
                                            <p className="text-gray-300 text-xs">{item.description}</p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
                    {totalImagePages > 1 && (
                        <div className="flex justify-center gap-4 mt-8">
                            <button
                                onClick={prevImagePage}
                                disabled={currentImagePage === 0}
                                className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg hover:border-orange-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                <ChevronLeft className="w-5 h-5" />
                                Previous
                            </button>
                            <button
                                onClick={nextImagePage}
                                disabled={currentImagePage === totalImagePages - 1}
                                className="flex items-center gap-2 px-6 py-3 bg-[#1a1a1a] border border-gray-800 text-white rounded-lg hover:border-orange-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                            >
                                Next
                                <ChevronRight className="w-5 h-5" />
                            </button>
                        </div>
                    )}
                </div>

                {/* Videos Section - Only show if videos exist */}
                {videos.length > 0 && (
                    <div>
                        <div className="flex items-center gap-3 mb-8">
                            <div className="p-3 bg-red-500/20 rounded-xl">
                                <Youtube className="w-6 h-6 text-red-500" />
                            </div>
                            <div>
                                <h3 className="text-2xl font-bold text-white">
                                    Event Videos
                                </h3>
                                <p className="text-gray-400 text-sm mt-1">
                                    Watch highlights from our events
                                </p>
                            </div>
                        </div>

                        <div className="grid lg:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-gray-800">
                            {/* Main Video Player */}
                            <div className="lg:col-span-2 bg-black">
                                {activeVideo && (
                                    <div className="relative aspect-video">
                                        {isVideoPlaying ? (
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${extractYoutubeId(activeVideo.media_url)}?autoplay=1&modestbranding=1&rel=0`}
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
                                                <img
                                                    src={`https://img.youtube.com/vi/${extractYoutubeId(activeVideo.media_url)}/hqdefault.jpg`}
                                                    alt={activeVideo.title}
                                                    className="w-full h-full object-cover"
                                                />
                                                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                    <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-red-600/50">
                                                        <Play className="w-10 h-10 text-white ml-1" />
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                                                    <h3 className="text-lg font-semibold text-white">{activeVideo.title}</h3>
                                                    {activeVideo.description && (
                                                        <p className="text-gray-300 text-sm mt-1">{activeVideo.description}</p>
                                                    )}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>

                            {/* Video Playlist */}
                            <div className="bg-[#141414] max-h-[400px] lg:max-h-none overflow-y-auto custom-scrollbar">
                                <div className="p-3 border-b border-gray-800 sticky top-0 bg-[#141414] z-10">
                                    <p className="text-sm text-gray-400 font-medium">
                                        {videos.length} Videos
                                    </p>
                                </div>
                                {videos.map((video, index) => (
                                    <div
                                        key={video.id}
                                        onClick={() => {
                                            setActiveVideoIndex(index);
                                            setIsVideoPlaying(false);
                                        }}
                                        className={`p-3 cursor-pointer hover:bg-[#1a1a1a] transition-colors flex gap-3 ${
                                            index === activeVideoIndex ? 'bg-[#1a1a1a]' : ''
                                        }`}
                                    >
                                        <div className="relative w-24 h-16 flex-shrink-0 rounded overflow-hidden">
                                            <img
                                                src={`https://img.youtube.com/vi/${extractYoutubeId(video.media_url)}/mqdefault.jpg`}
                                                alt={video.title}
                                                className="w-full h-full object-cover"
                                            />
                                            {index === activeVideoIndex && isVideoPlaying && (
                                                <div className="absolute inset-0 bg-red-600/20 flex items-center justify-center">
                                                    <div className="w-6 h-6 border-2 border-white rounded animate-pulse" />
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-white text-sm font-medium line-clamp-2 mb-1">
                                                {video.title}
                                            </p>
                                            {video.description && (
                                                <p className="text-gray-500 text-xs line-clamp-1">
                                                    {video.description}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                )}

                {/* Image Modal */}
                {selectedImage && (
                    <div
                        className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
                        onClick={() => setSelectedImage(null)}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors"
                            onClick={() => setSelectedImage(null)}
                        >
                            <X className="w-6 h-6 text-white" />
                        </button>
                        <div className="relative max-w-5xl max-h-[90vh] w-full h-full">
                            <Image
                                src={selectedImage}
                                alt="Portfolio image"
                                fill
                                sizes="(max-width: 1280px) 100vw, 1280px"
                                className="object-contain"
                            />
                        </div>
                    </div>
                )}
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 8px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: #1a1a1a;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #333;
                    border-radius: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #444;
                }
            `}</style>
        </section>
    );
}
