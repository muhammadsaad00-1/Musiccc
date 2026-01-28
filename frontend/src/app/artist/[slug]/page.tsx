'use client';

import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { useState, use } from 'react';
import {
    MapPin, Clock, CheckCircle, Star, Play, ArrowLeft, Share2,
    Music, Disc3, Award, Instagram, Youtube, ExternalLink,
    ChevronRight, Pause
} from 'lucide-react';
import { mockArtists, mockCategories } from '@/lib/mockData';
import AlbumCarousel from '@/components/artists/AlbumCarousel';

interface ArtistPageProps {
    params: Promise<{ slug: string }>;
}

export default function ArtistPage({ params }: ArtistPageProps) {
    const { slug } = use(params);
    const artist = mockArtists.find((a) => a.slug === slug);
    const [playingVideo, setPlayingVideo] = useState<string | null>(null);

    if (!artist) {
        notFound();
    }

    const category = mockCategories.find((c) => c.id === artist.category_id);
    const hasMedia = artist.albums || artist.popularSongs || artist.youtubeVideos;

    // Split bio into paragraphs for better readability
    const bioParagraphs = artist.bio.split('\n\n').filter(p => p.trim());

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero Section with Cover */}
            <section className="relative h-[50vh] min-h-[400px] max-h-[500px]">
                {/* Cover Image */}
                <Image
                    src={artist.cover_image || artist.image_url}
                    alt={artist.name}
                    fill
                    className="object-cover"
                    priority
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent" />
                <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/80 via-transparent to-transparent" />

                {/* Back Button */}
                <div className="absolute top-24 left-0 right-0">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <Link
                            href={`/artists/${category?.slug || ''}`}
                            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-[#0a0a0b]/50 backdrop-blur-sm px-4 py-2 rounded-full"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Back to {category?.name || 'Artists'}
                        </Link>
                    </div>
                </div>
            </section>

            {/* Artist Info Section */}
            <section className="relative -mt-32 pb-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Profile Image */}
                        <div className="lg:w-1/4">
                            <div className="relative w-48 h-48 lg:w-64 lg:h-64 mx-auto lg:mx-0">
                                {/* Glow Effect */}
                                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full blur-xl opacity-30" />

                                {/* Image */}
                                <Image
                                    src={artist.image_url}
                                    alt={artist.name}
                                    fill
                                    className="object-cover rounded-full border-4 border-[#0a0a0b] relative z-10"
                                />

                                {/* Verified Badge */}
                                {artist.is_verified && (
                                    <div className="absolute bottom-4 right-4 z-20 w-12 h-12 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center border-4 border-[#0a0a0b]">
                                        <CheckCircle className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Info */}
                        <div className="lg:w-3/4 text-center lg:text-left">
                            {/* Badges */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-4">
                                {artist.is_verified && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-green-500/20 text-green-400 rounded-full text-sm border border-green-500/30">
                                        <CheckCircle className="w-4 h-4" />
                                        Verified Artist
                                    </span>
                                )}
                                {artist.is_featured && (
                                    <span className="inline-flex items-center gap-1 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-pink-600/20 text-orange-400 rounded-full text-sm border border-orange-500/30">
                                        <Star className="w-4 h-4" />
                                        Featured
                                    </span>
                                )}
                                {category && (
                                    <span className="px-3 py-1 bg-[#1a1a1a] text-gray-400 rounded-full text-sm border border-gray-800">
                                        {category.name}
                                    </span>
                                )}
                            </div>

                            {/* Name */}
                            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                                {artist.name}
                            </h1>

                            {/* Genres */}
                            {artist.genres && (
                                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                                    {artist.genres.map((genre: string) => (
                                        <span key={genre} className="px-3 py-1 bg-gradient-to-r from-orange-500/10 to-pink-600/10 text-gray-300 rounded-full text-sm border border-gray-800">
                                            {genre}
                                        </span>
                                    ))}
                                </div>
                            )}

                            {/* Meta Info */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-6 mb-6">
                                <div className="flex items-center gap-2">
                                    <MapPin className="w-5 h-5 text-orange-400" />
                                    <span className="text-gray-300">{artist.location}</span>
                                </div>
                                {artist.performance_duration && (
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-orange-400" />
                                        <span className="text-gray-300">{artist.performance_duration}</span>
                                    </div>
                                )}
                                {artist.price_range && (
                                    <div className="flex items-center gap-2">
                                        <span className="text-xl font-bold text-white">{artist.price_range}</span>
                                    </div>
                                )}
                            </div>

                            {/* CTA Buttons */}
                            <div className="flex flex-wrap justify-center lg:justify-start gap-4">
                                <Link
                                    href={`/post-requirement?artist=${artist.slug}`}
                                    className="px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                                >
                                    See Price & Book
                                </Link>
                                <button className="px-6 py-4 bg-[#1a1a1a] text-white font-semibold rounded-full hover:bg-[#2a2a2a] transition-colors border border-gray-800 flex items-center gap-2">
                                    <Share2 className="w-5 h-5" />
                                    Share
                                </button>
                                {artist.socialLinks && (
                                    <>
                                        {artist.socialLinks.instagram && (
                                            <a href={artist.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500 transition-colors border border-gray-800">
                                                <Instagram className="w-6 h-6" />
                                            </a>
                                        )}
                                        {artist.socialLinks.youtube && (
                                            <a href={artist.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors border border-gray-800">
                                                <Youtube className="w-6 h-6" />
                                            </a>
                                        )}
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Achievements */}
            {artist.achievements && (
                <section className="py-8 border-y border-gray-800">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-wrap justify-center gap-8">
                            {artist.achievements.map((achievement: string, index: number) => (
                                <div key={index} className="flex items-center gap-2 text-gray-400">
                                    <Award className="w-5 h-5 text-orange-400" />
                                    <span>{achievement}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* About Section - Enhanced with Paragraphs */}
            <section className="py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 p-8">
                        <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                            <Music className="w-6 h-6 text-orange-400" />
                            About {artist.name}
                        </h2>
                        <div className="space-y-4">
                            {bioParagraphs.map((paragraph, index) => (
                                <p key={index} className="text-gray-400 leading-relaxed text-lg">
                                    {paragraph}
                                </p>
                            ))}
                        </div>

                        {/* Languages */}
                        {artist.languages && artist.languages.length > 0 && (
                            <div className="mt-8 pt-6 border-t border-gray-800">
                                <p className="text-gray-500 text-sm mb-3">Languages</p>
                                <div className="flex flex-wrap gap-2">
                                    {artist.languages.map((lang: string) => (
                                        <span key={lang} className="px-4 py-2 bg-[#0a0a0b] border border-gray-800 rounded-full text-sm text-gray-300">
                                            {lang}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Discography - 3D Rotating Carousel */}
            {artist.albums && artist.albums.length > 0 && (
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <AlbumCarousel albums={artist.albums} artistName={artist.name} />
                    </div>
                </section>
            )}

            {/* Popular Songs */}
            {artist.popularSongs && artist.popularSongs.length > 0 && (
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                            <Music className="w-6 h-6 text-orange-400" />
                            Popular Songs
                        </h2>

                        <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                            {artist.popularSongs.map((song: { id: number; name: string; plays: string; duration: string }, index: number) => (
                                <div
                                    key={song.id}
                                    className="flex items-center gap-4 p-4 hover:bg-[#2a2a2a] transition-colors border-b border-gray-800 last:border-b-0 group"
                                >
                                    {/* Track Number */}
                                    <div className="w-8 text-center">
                                        <span className="text-gray-500 group-hover:hidden">{index + 1}</span>
                                        <Play className="w-4 h-4 text-white hidden group-hover:block mx-auto" />
                                    </div>

                                    {/* Song Info */}
                                    <div className="flex-1">
                                        <h4 className="font-medium text-white group-hover:text-orange-400 transition-colors">
                                            {song.name}
                                        </h4>
                                    </div>

                                    {/* Plays */}
                                    <div className="text-gray-500 text-sm">
                                        {song.plays} plays
                                    </div>

                                    {/* Duration */}
                                    <div className="text-gray-500 text-sm w-12 text-right">
                                        {song.duration}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* YouTube Videos */}
            {artist.youtubeVideos && artist.youtubeVideos.length > 0 && (
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                            <Youtube className="w-6 h-6 text-red-500" />
                            Videos
                        </h2>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {artist.youtubeVideos.map((video: { id: number; title: string; videoId: string; views: string; thumbnail: string }) => (
                                <div key={video.id} className="group">
                                    {playingVideo === video.videoId ? (
                                        // Embedded YouTube Player
                                        <div className="relative aspect-video rounded-2xl overflow-hidden">
                                            <iframe
                                                width="100%"
                                                height="100%"
                                                src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1`}
                                                title={video.title}
                                                frameBorder="0"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                                className="absolute inset-0"
                                            />
                                            <button
                                                onClick={() => setPlayingVideo(null)}
                                                className="absolute top-4 right-4 p-2 bg-black/70 rounded-full text-white hover:bg-black transition-colors"
                                            >
                                                <Pause className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ) : (
                                        // Thumbnail with Play Button
                                        <div
                                            className="relative aspect-video rounded-2xl overflow-hidden border border-gray-800 cursor-pointer"
                                            onClick={() => setPlayingVideo(video.videoId)}
                                        >
                                            <Image
                                                src={video.thumbnail}
                                                alt={video.title}
                                                fill
                                                className="object-cover group-hover:scale-105 transition-transform duration-500"
                                            />
                                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center group-hover:bg-black/50 transition-colors">
                                                <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform">
                                                    <Play className="w-7 h-7 text-white ml-1" />
                                                </div>
                                            </div>
                                            <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
                                                {video.views} views
                                            </div>
                                        </div>
                                    )}

                                    {/* Video Title */}
                                    <h3 className="mt-3 font-medium text-white group-hover:text-orange-400 transition-colors">
                                        {video.title}
                                    </h3>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Gallery */}
            {artist.gallery_urls && artist.gallery_urls.length > 0 && (
                <section className="py-12">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <h2 className="text-2xl font-bold text-white mb-8">Gallery</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {artist.gallery_urls.map((url: string, index: number) => (
                                <div key={index} className="relative aspect-video rounded-xl overflow-hidden border border-gray-800 group">
                                    <Image
                                        src={url}
                                        alt={`${artist.name} gallery ${index + 1}`}
                                        fill
                                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </section>
            )}

            {/* Booking CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-size-200 rounded-3xl p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Book {artist.name} for Your Event</h2>
                        <p className="text-white/90 mb-8 max-w-xl mx-auto">
                            Make your event unforgettable with an electrifying performance
                        </p>
                        <Link
                            href={`/post-requirement?artist=${artist.slug}`}
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Request Booking
                            <ChevronRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
