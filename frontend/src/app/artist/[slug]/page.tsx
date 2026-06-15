"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import ArtistFAQ from '@/components/artists/ArtistFAQ';
import { useState, useEffect, use } from "react";
import {
  CheckCircle,
  Play,
  ArrowLeft,
  Music,
  Youtube,
  ChevronRight,
  ChevronLeft,
  Loader2,
  Calendar,
  Sparkles,
  Quote,
  X,
  Instagram,
  ExternalLink,
} from "lucide-react";
import { API_BASE_URL } from '@/lib/api';

interface ArtistPageProps {
  params: Promise<{ slug: string }>;
}

// Helper to extract YouTube video ID from URL
function extractYoutubeId(url: string): string | null {
  if (!url) return null;
  const match = url.match(
    /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/,
  );
  return match ? match[1] : null;
}

// Get YouTube video title from URL (extract meaningful title)
function getVideoTitle(url: string, artistName: string, index: number): string {
  // Try to extract title-like info from the URL
  const urlObj = new URL(url).searchParams;
  return `${artistName} - Performance ${index + 1}`;
}

// Transform backend performer to frontend artist format
function transformPerformerToArtist(performer: any): any {
  const slug = performer.name?.toLowerCase().replace(/\s+/g, "-") || "";

  // Transform videos array (YouTube URLs) to the expected format
  const youtubeVideos = (performer.videos || [])
    .map((url: string, index: number) => {
      const videoId = extractYoutubeId(url);
      return {
        id: index + 1,
        title: getVideoTitle(url, performer.name, index),
        videoId: videoId || "",
        thumbnail: videoId
          ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
          : performer.profile_image_url,
      };
    })
    .filter((v: any) => v.videoId);

  return {
    id: performer.id,
    name: performer.name,
    slug: slug,
    category: performer.category,
    bio: performer.description || "",
    short_bio: performer.description?.substring(0, 100) || "",
    image_url:
      performer.profile_image_url ||
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    cover_image: performer.header_image_url || performer.profile_image_url,
    is_verified: true,
    genres: performer.genres || [],
    youtubeVideos: youtubeVideos,
    socialLinks: {
      instagram: performer.instagram_url,
      youtube: performer.youtube_url,
    },
    gallery_urls: performer.gallery_image_urls || [],
    popular_songs: performer.popular_songs || [],
  };
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = use(params);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeVideoIndex, setActiveVideoIndex] = useState(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);
  const [aboutImageIndex, setAboutImageIndex] = useState(0);
  const [selectedGalleryImage, setSelectedGalleryImage] = useState<string | null>(null);
  const [category, setCategory] = useState<{ name: string; slug: string } | null>(null);
  const [relatedArtists, setRelatedArtists] = useState<any[]>([]);

  // Auto-rotate about section gallery images every 5 seconds
  useEffect(() => {
    if (!artist?.gallery_urls?.length || artist.gallery_urls.length <= 1) return;
    const interval = setInterval(() => {
      setAboutImageIndex((prev) => (prev + 1) % artist.gallery_urls.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [artist?.gallery_urls]);

  // Fetch artist from backend
  useEffect(() => {
    async function fetchArtist() {
      setLoading(true);
      try {
        const response = await fetch(
          `${API_BASE_URL}/performers/by-name/${encodeURIComponent(slug)}`,
        );
        if (response.ok) {
          const performer = await response.json();
          if (!performer.error) {
            const transformedArtist = transformPerformerToArtist(performer);
            setArtist(transformedArtist);
            setLoading(false);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching performer:", error);
      }
      setArtist(null);
      setLoading(false);
    }
    fetchArtist();
  }, [slug]);

  // Fetch categories
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const categories = await response.json();
          if (artist) {
            const found = categories.find(
              (c: any) =>
                c.name === artist.category ||
                c.name.toLowerCase() === String(artist.category).toLowerCase(),
            );
            if (found) {
              setCategory({ name: found.name, slug: found.slug });
            } else {
              setCategory({ name: "Artists", slug: "artists" });
            }
          }
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }
    if (artist) fetchCategories();
  }, [artist]);

  // Fetch related artists (random selection)
  useEffect(() => {
    async function fetchRelatedArtists() {
      if (!artist) return;
      try {
        // Fetch all performers to get a random selection
        // In a real app with many artists, we'd want a specific endpoint for this
        const response = await fetch(`${API_BASE_URL}/performers?limit=100`);
        if (response.ok) {
          const data = await response.json();
          // Handle paginated response - data is in response.data
          const allPerformers = data.data || data;
          // Filter out current artist
          const otherArtists = allPerformers.filter((p: any) => p.id !== artist.id);

          // Shuffle and slice to get 8 random artists
          const shuffled = otherArtists.sort(() => 0.5 - Math.random());
          const selected = shuffled.slice(0, 8).map(transformPerformerToArtist);

          setRelatedArtists(selected);
        }
      } catch (error) {
        console.error("Error fetching related artists:", error);
      }
    }

    if (artist) {
      fetchRelatedArtists();
    }
  }, [artist]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-12 h-12 text-orange-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-400">Loading artist profile...</p>
        </div>
      </div>
    );
  }

  if (!artist) {
    notFound();
  }

  // Split bio into paragraphs
  const bioParagraphs = (artist.bio || "")
    .split("\n\n")
    .filter((p: string) => p.trim());

  const activeVideo = artist.youtubeVideos?.[activeVideoIndex];

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* ============ HERO SECTION ============ */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[550px] overflow-hidden">
        {/* Header Image */}
        <div className="absolute inset-0">
          <Image
            src={artist.cover_image || artist.image_url}
            alt={artist.name}
            fill
            sizes="100vw"
            className="object-cover"
            style={{ objectPosition: 'center 30%' }}
            priority
          />
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/60 via-transparent to-transparent" />

        {/* Back Button */}
        <div className="absolute top-6 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={category && category.slug && category.slug !== 'artists' ? `/artists/${category.slug}` : `/artists`}
              className="inline-flex items-center gap-2 text-white hover:text-orange-400 transition-colors bg-black/40 backdrop-blur-md px-5 py-2.5 rounded-full border border-white/10 hover:border-orange-500/50"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {category?.name && category.name !== 'Artists' ? category.name : "Artists"}
            </Link>
          </div>
        </div>
      </section>

      {/* ============ ARTIST INFO SECTION ============ */}
      <section className="relative pb-12 -mt-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row items-start gap-8">
            {/* Profile Image */}
            <div className="flex-shrink-0">
              <div className="relative w-40 h-40 lg:w-48 lg:h-48">
                <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full blur-xl opacity-30" />
                <Image
                  src={artist.image_url}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 1024px) 160px, 192px"
                  className="object-cover rounded-full border-4 border-[#0a0a0b] relative z-10 shadow-2xl"
                />
                {artist.is_verified && (
                  <div className="absolute bottom-1 right-1 z-20 w-10 h-10 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full flex items-center justify-center border-3 border-[#0a0a0b] shadow-lg">
                    <CheckCircle className="w-5 h-5 text-white" />
                  </div>
                )}
              </div>
            </div>

            {/* Info */}
            <div className="flex-1 pt-2">
              {/* Badges */}
              <div className="flex flex-wrap gap-3 mb-4">
                {artist.is_verified && (
                  <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/15 text-green-400 rounded-full text-sm border border-green-500/30">
                    <CheckCircle className="w-3.5 h-3.5" />
                    Verified Artist
                  </span>
                )}
                {category && (
                  <span className="px-3 py-1.5 bg-[#1a1a1a] text-gray-300 rounded-full text-sm border border-gray-700">
                    {category.name}
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold mb-4 text-white leading-tight">
                {artist.name}
              </h1>

              {/* Genres */}
              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {artist.genres.map((genre: string) => (
                    <span
                      key={genre}
                      className="px-3 py-1.5 bg-orange-500/10 text-orange-300 rounded-full text-sm border border-orange-500/20"
                    >
                      {genre}
                    </span>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-wrap gap-3">
                <Link
                  href={`/post-requirement?artist=${artist.slug}`}
                  className="group px-7 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-full hover:shadow-xl hover:shadow-pink-500/30 transition-all flex items-center gap-2"
                >
                  <span>Request Booking</span>
                  <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`https://wa.me/923206876442?text=${encodeURIComponent(`Hi, I'm interested in booking ${artist.name}. Please share price details.`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-6 py-3 bg-[#1a1a1a] border border-orange-500/40 hover:border-orange-500 text-white font-bold rounded-full transition-all flex items-center gap-2 shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20"
                >
                  <span>Contact for Price</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
                {artist.socialLinks?.instagram && (
                  <a
                    href={artist.socialLinks.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500 transition-all border border-gray-700"
                  >
                    <Instagram className="w-5 h-5" />
                  </a>
                )}
                {artist.socialLinks?.youtube && (
                  <a
                    href={artist.socialLinks.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-12 h-12 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-all border border-gray-700"
                  >
                    <Youtube className="w-5 h-5" />
                  </a>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============ ABOUT SECTION (Auto-rotating gallery image left + Bio right) ============ */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-0 bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-800/50">
            {/* Auto-rotating Gallery Image */}
            <div className="relative aspect-square lg:aspect-auto lg:min-h-[500px] overflow-hidden">
              {artist.gallery_urls && artist.gallery_urls.length > 0 ? (
                artist.gallery_urls.map((url: string, index: number) => (
                  <div
                    key={index}
                    className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === aboutImageIndex ? "opacity-100" : "opacity-0"
                      }`}
                  >
                    <Image
                      src={url}
                      alt={`${artist.name} ${index + 1}`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      className="object-cover"
                    />
                  </div>
                ))
              ) : (
                <Image
                  src={artist.image_url}
                  alt={artist.name}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              )}
              {/* Image counter dots */}
              {artist.gallery_urls && artist.gallery_urls.length > 1 && (
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                  {artist.gallery_urls.map((_: string, idx: number) => (
                    <div
                      key={idx}
                      className={`h-1.5 rounded-full transition-all duration-500 ${idx === aboutImageIndex
                        ? "w-6 bg-orange-500"
                        : "w-1.5 bg-white/40"
                        }`}
                    />
                  ))}
                </div>
              )}
            </div>

            {/* Bio Content */}
            <div className="p-8 lg:p-12 flex flex-col justify-center">
              <h2 className="text-3xl lg:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500 mb-6">
                {artist.name}
              </h2>

              <div className="space-y-4 mb-8 max-h-[400px] overflow-y-auto custom-scrollbar pr-2" data-lenis-prevent>
                {bioParagraphs.length > 0 ? (
                  bioParagraphs.map((paragraph: string, index: number) => (
                    <p
                      key={index}
                      className="text-gray-300 leading-relaxed text-base lg:text-lg"
                    >
                      {paragraph}
                    </p>
                  ))
                ) : (
                  <p className="text-gray-300 leading-relaxed text-base lg:text-lg">
                    {artist.short_bio ||
                      `${artist.name} is a talented performer available for bookings through The Artist Factory.`}
                  </p>
                )}
              </div>


            </div>
          </div>
        </div>
      </section>

      {/* ============ YOUTUBE VIDEOS (Reference: Large player left + Sidebar playlist right) ============ */}
      {artist.youtubeVideos && artist.youtubeVideos.length > 0 && (
        <section className="py-16 bg-gradient-to-b from-[#0a0a0b] via-[#111] to-[#0a0a0b]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-red-500/20 rounded-xl">
                <Youtube className="w-6 h-6 text-red-500" />
              </div>
              <div>
                <h2 className="text-3xl font-bold text-white">
                  Live Performances
                </h2>
                <p className="text-gray-400 text-sm mt-1">
                  Watch {artist.name} in action
                </p>
              </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-0 rounded-2xl overflow-hidden border border-gray-800">
              {/* Main Video Player (Left — 2/3 width) */}
              <div className="lg:col-span-2 bg-black">
                {activeVideo && (
                  <div className="relative aspect-video">
                    {isVideoPlaying ? (
                      <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${activeVideo.videoId}?autoplay=1&modestbranding=1&rel=0`}
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
                        <Image
                          src={activeVideo.thumbnail}
                          alt={activeVideo.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                          <div className="w-20 h-20 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-red-600/50">
                            <Play className="w-10 h-10 text-white ml-1" />
                          </div>
                        </div>
                        <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                          <h3 className="text-lg font-semibold text-white">
                            {activeVideo.title}
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Video Playlist Sidebar (Right — 1/3 width) */}
              <div className="bg-[#141414] max-h-[400px] lg:max-h-[500px] overflow-y-auto custom-scrollbar">
                <div className="p-3 border-b border-gray-800 sticky top-0 bg-[#141414] z-10">
                  <p className="text-sm text-gray-400 font-medium">
                    {artist.youtubeVideos.length} Videos
                  </p>
                </div>
                {artist.youtubeVideos.map(
                  (
                    video: {
                      id: number;
                      title: string;
                      videoId: string;
                      thumbnail: string;
                    },
                    index: number,
                  ) => {
                    const isActive = index === activeVideoIndex;
                    return (
                      <button
                        key={video.id}
                        onClick={() => {
                          setActiveVideoIndex(index);
                          setIsVideoPlaying(false);
                        }}
                        className={`w-full flex items-start gap-3 p-3 text-left transition-all hover:bg-white/5 ${isActive
                          ? "bg-orange-500/10 border-l-4 border-orange-500"
                          : "border-l-4 border-transparent"
                          }`}
                      >
                        {/* Thumbnail */}
                        <div className="relative w-28 h-16 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image
                            src={video.thumbnail}
                            alt={video.title}
                            fill
                            className="object-cover"
                          />
                          <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                            <Play className="w-5 h-5 text-white/80" />
                          </div>
                        </div>

                        {/* Video Info */}
                        <div className="flex-1 min-w-0">
                          <p
                            className={`text-sm font-medium line-clamp-2 ${isActive ? "text-orange-400" : "text-gray-300"
                              }`}
                          >
                            {video.title}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {artist.name}
                          </p>
                        </div>
                      </button>
                    );
                  },
                )}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ============ POPULAR SONGS ============ */}
      {artist.popular_songs && artist.popular_songs.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center gap-3 mb-8">
              <div className="p-3 bg-orange-500/20 rounded-xl">
                <Music className="w-6 h-6 text-orange-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">Popular Songs</h2>
            </div>

            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
              {artist.popular_songs.map(
                (songName: string, index: number) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-4 hover:bg-[#222] transition-colors border-b border-gray-800/50 last:border-b-0 group"
                  >
                    <div className="w-8 text-center">
                      <span className="text-gray-600 font-mono text-sm group-hover:hidden">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <Play className="w-4 h-4 text-orange-400 hidden group-hover:block mx-auto" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-white group-hover:text-orange-400 transition-colors">
                        {songName}
                      </h4>
                    </div>
                    <Music className="w-4 h-4 text-gray-600" />
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}



      {/* Full Screen Gallery Modal */}
      {selectedGalleryImage && (
        <div
          className="fixed inset-0 bg-black/95 backdrop-blur-sm z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedGalleryImage(null)}
        >
          <button
            onClick={() => setSelectedGalleryImage(null)}
            className="absolute top-4 right-4 p-3 bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          <div className="relative w-full h-full max-w-5xl max-h-[85vh]">
            <Image
              src={selectedGalleryImage}
              alt="Gallery image"
              fill
              className="object-contain"
            />
          </div>
        </div>
      )}



      {/* ============ BOOKING CTA ============ */}
      <section className="py-20 relative overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/20 rounded-full blur-3xl animate-pulse" />
          <div
            className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/20 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          />
        </div>

        <div className="max-w-5xl mx-auto px-4 relative z-10">
          <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 rounded-3xl p-12 lg:p-16 text-center shadow-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full mb-6">
              <Sparkles className="w-5 h-5 text-white" />
              <span className="text-white text-sm font-medium">
                Ready to Book?
              </span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6">
              Book {artist.name} for Your Event
            </h2>
            <p className="text-white/90 mb-10 max-w-2xl mx-auto text-lg leading-relaxed">
              Make your event unforgettable with an amazing performance. Get in
              touch today and let&apos;s create something special together.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link
                href={`/post-requirement?artist=${artist.slug}`}
                className="group inline-flex items-center gap-3 px-10 py-5 bg-white text-gray-900 font-bold rounded-full hover:bg-gray-100 transition-all shadow-2xl hover:scale-105 transform"
              >
                <span>Request Booking</span>
                <ChevronRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a
                href={`https://wa.me/923206876442?text=${encodeURIComponent(`Hi, I'm interested in booking ${artist.name}. Please share details.`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-5 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-full hover:bg-white/20 transition-all border-2 border-white/30 hover:border-white/50 flex items-center gap-2"
              >
                <ExternalLink className="w-5 h-5" />
                Contact on WhatsApp
              </a>
            </div>
          </div>
        </div>
      </section>



      {/* ============ FAQ SECTION ============ */}
      <ArtistFAQ artistName={artist.name} />

      {/* ============ STILL GOT QUESTIONS WA SECTION ============ */}
      <section className="py-12 border-t border-gray-900 bg-[#0a0a0b] relative z-20">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            Still got Questions?
          </h3>
          <p className="text-gray-400 mb-6">
            Need to discuss availability, specific packages, or custom requirements?
          </p>
          <a
            href={`https://wa.me/923206876442?text=${encodeURIComponent(`Hi, I have some questions about booking ${artist.name}.`)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-3 bg-[#0a0a0b] border border-green-500/50 text-green-400 font-medium rounded-full transition-all hover:border-green-400 hover:shadow-[0_0_12px_rgba(34,197,94,0.25)] hover:text-green-300"
          >
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse mr-1" />
            Chat with Us on WhatsApp
          </a>
        </div>
      </section>

      {/* ============ RELATED ARTISTS ============ */}
      {
        relatedArtists.length > 0 && (
          <section className="py-24 bg-[#0a0a0b] relative z-10 border-t border-gray-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 tracking-tight">
                  Discover More Talent
                </h2>
                <div className="h-1 w-24 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full mx-auto"></div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 md:gap-12">
                {relatedArtists.map((relatedArtist) => (
                  <Link
                    key={relatedArtist.id}
                    href={`/artist/${relatedArtist.slug}`}
                    className="group flex flex-col items-center"
                  >
                    {/* Circular Image with Glow */}
                    <div className="relative w-32 h-32 md:w-40 md:h-40 mb-6 transition-transform duration-500 group-hover:-translate-y-2">
                      {/* Rotating Border Effect */}
                      <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 opacity-0 group-hover:opacity-100 blur transition-opacity duration-500 animate-spin-slow" />

                      <div className="relative w-full h-full rounded-full overflow-hidden border-4 border-[#1a1a1a] group-hover:border-transparent transition-colors duration-300 shadow-2xl">
                        <Image
                          src={relatedArtist.image_url}
                          alt={relatedArtist.name}
                          fill
                          sizes="(max-width: 768px) 128px, 160px"
                          className="object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      </div>
                    </div>

                    {/* Text Info */}
                    <div className="text-center">
                      <h3 className="text-lg font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-orange-400 group-hover:to-pink-500 transition-all duration-300">
                        {relatedArtist.name}
                      </h3>
                      <p className="text-sm text-gray-500 mt-1 uppercase tracking-wider font-medium">
                        {(Array.isArray(relatedArtist.category)
                          ? relatedArtist.category[0]
                          : relatedArtist.category)}
                      </p>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )
      }

      {/* Sticky Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0b]/95 backdrop-blur-xl border-t border-gray-800/50 md:hidden z-40">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <div className="flex-1">
            <p className="text-sm font-semibold text-white">{artist.name}</p>
            <p className="text-xs text-gray-400">{category?.name}</p>
          </div>
          <Link
            href={`/post-requirement?artist=${artist.slug}`}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full text-white font-bold shadow-lg flex items-center gap-2"
          >
            <Calendar className="w-4 h-4" />
            Book Now
          </Link>
        </div>
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: #1a1a1a;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: linear-gradient(to bottom, #f97316, #ec4899);
          border-radius: 10px;
        }
        .line-clamp-2 {
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
      `}</style>
    </div>
  );
}
