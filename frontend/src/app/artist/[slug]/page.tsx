"use client";

import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, use } from "react";
import {
  MapPin,
  Clock,
  CheckCircle,
  Star,
  Play,
  ArrowLeft,
  Share2,
  Music,
  Disc3,
  Award,
  Instagram,
  Youtube,
  ExternalLink,
  ChevronRight,
  ChevronLeft,
  Pause,
  Loader2,
} from "lucide-react";

import AlbumCarousel from "@/components/artists/AlbumCarousel";


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

// Transform backend performer to frontend artist format
function transformPerformerToArtist(performer: any): any {
  const slug = performer.name?.toLowerCase().replace(/\s+/g, "-") || "";

  // Transform videos array (YouTube URLs) to the expected format
  const youtubeVideos = (performer.videos || [])
    .map((url: string, index: number) => {
      const videoId = extractYoutubeId(url);
      return {
        id: index + 1,
        title: `${performer.name} - Performance ${index + 1}`,
        videoId: videoId || "",
        views: "N/A",
        thumbnail: videoId
          ? `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`
          : performer.profile_image_url,
      };
    })
    .filter((v: any) => v.videoId);

  // Transform popular_songs array to the expected format
  const popularSongs = (performer.popular_songs || []).map(
    (songName: string, index: number) => ({
      id: index + 1,
      name: songName,
      plays: "N/A",
      duration: "N/A",
    }),
  );

  return {
    id: performer.id,
    name: performer.name,
    slug: slug,
    category_id: getCategoryIdFromName(performer.category),
    bio: performer.description || "",
    short_bio: performer.description?.substring(0, 100) || "",
    location: performer.locations?.[0] || "Pakistan",
    price_range: performer.price
      ? `PKR ${performer.price.toLocaleString()}`
      : undefined,
    image_url:
      performer.profile_image_url ||
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    cover_image: performer.header_image_url || performer.profile_image_url,
    is_featured: false,
    is_verified: true,
    languages: performer.genres || [],
    genres: performer.genres || [],
    performance_duration: undefined,
    youtubeVideos: youtubeVideos,
    socialLinks: {
      instagram: performer.instagram_url,
      youtube: performer.youtube_url,
    },
    // These could be fetched from external APIs in the future
    albums: [],
    popularSongs: popularSongs,
    achievements: [],
    gallery_urls: performer.gallery_image_urls || [],
  };
}

function getCategoryIdFromName(categoryName: string): number {
  const mapping: Record<string, number> = {
    Singer: 1,
    Musician: 2,
    DJ: 3,
    Dancer: 4,
    Comedian: 5,
    Anchor: 6,
    "Makeup Artist": 7,
    Photographer: 8,
    "Mehndi Artist": 9,
    Decorator: 10,
  };
  return mapping[categoryName] || 1;
}

export default function ArtistPage({ params }: ArtistPageProps) {
  const { slug } = use(params);
  const [artist, setArtist] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [playingVideo, setPlayingVideo] = useState<string | null>(null);
  const [isBackendArtist, setIsBackendArtist] = useState(false);
  const [youtubeData, setYoutubeData] = useState<any>(null);
  const [loadingYoutube, setLoadingYoutube] = useState(false);
  const [galleryIndex, setGalleryIndex] = useState(0);

  // Fetch YouTube data for the artist
  async function fetchYoutubeData(artistName: string) {
    setLoadingYoutube(true);
    try {
      const response = await fetch(
        `http://localhost:8000/api/youtube/artist/${encodeURIComponent(artistName)}`,
      );
      if (response.ok) {
        const data = await response.json();
        if (data.found) {
          setYoutubeData(data);
        }
      }
    } catch (error) {
      console.error("Error fetching YouTube data:", error);
    } finally {
      setLoadingYoutube(false);
    }
  }

  useEffect(() => {
    async function fetchArtist() {
      setLoading(true);

      // Fetch from backend API
      try {
        const response = await fetch(
          `http://localhost:8000/performers/by-name/${encodeURIComponent(slug)}`,
        );
        if (response.ok) {
          const performer = await response.json();
          if (!performer.error) {
            const transformedArtist = transformPerformerToArtist(performer);
            setArtist(transformedArtist);
            setIsBackendArtist(true);
            setLoading(false);
            // Fetch YouTube data
            fetchYoutubeData(performer.name);
            return;
          }
        }
      } catch (error) {
        console.error("Error fetching performer:", error);
      }

      // Artist not found
      setArtist(null);
      setLoading(false);
    }

    fetchArtist();
  }, [slug]);

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

  // Define category mapping for display
  const categoryMap: Record<number, { name: string; slug: string }> = {
    1: { name: "Singers", slug: "singers" },
    2: { name: "Musicians", slug: "musicians" },
    3: { name: "DJs", slug: "djs" },
    4: { name: "Dancers", slug: "dancers" },
    5: { name: "Comedians", slug: "comedians" },
    6: { name: "Anchors", slug: "anchors" },
    7: { name: "Makeup Artists", slug: "makeup-artists" },
    8: { name: "Photographers", slug: "photographers" },
    9: { name: "Mehndi Artists", slug: "mehndi-artists" },
    10: { name: "Decorators", slug: "decorators" },
  };

  const category = categoryMap[artist.category_id];
  const hasMedia =
    artist.albums?.length > 0 ||
    artist.popularSongs?.length > 0 ||
    artist.youtubeVideos?.length > 0;

  // Split bio into paragraphs for better readability
  const bioParagraphs = (artist.bio || "")
    .split("\n\n")
    .filter((p: string) => p.trim());

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Hero Section with Cover Carousel */}
      <section className="relative h-[50vh] min-h-[400px] max-h-[500px]">
        {/* Cover Image Carousel */}
        {(artist.gallery_urls && artist.gallery_urls.length > 0) ? (
          <>
            {artist.gallery_urls.map((url: string, index: number) => (
              <div
                key={index}
                className={`absolute inset-0 transition-all duration-1000 ease-in-out ${index === galleryIndex
                  ? 'opacity-100 scale-100'
                  : 'opacity-0 scale-105'
                  }`}
              >
                <Image
                  src={url}
                  alt={`${artist.name} ${index + 1}`}
                  fill
                  className="object-cover"
                  priority={index === 0}
                />
              </div>
            ))}

            {/* Slide Indicators in Header */}
            {artist.gallery_urls.length > 1 && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2 z-20">
                {artist.gallery_urls.map((_: string, index: number) => (
                  <button
                    key={index}
                    onClick={() => setGalleryIndex(index)}
                    className={`h-2 rounded-full transition-all ${index === galleryIndex
                      ? 'w-8 bg-gradient-to-r from-orange-500 to-pink-600'
                      : 'w-2 bg-white/50 hover:bg-white/70'
                      }`}
                  />
                ))}
              </div>
            )}
          </>
        ) : (
          <Image
            src={artist.cover_image || artist.image_url}
            alt={artist.name}
            fill
            className="object-cover"
            priority
          />
        )}

        {/* Gradient Overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0b] via-[#0a0a0b]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#0a0a0b]/80 via-transparent to-transparent" />

        {/* Back Button */}
        <div className="absolute top-24 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link
              href={`/artists/${category?.slug || "singers"}`}
              className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors bg-[#0a0a0b]/50 backdrop-blur-sm px-4 py-2 rounded-full"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to {category?.name || "Artists"}
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
                {isBackendArtist && (
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-sm border border-blue-500/30">
                    New Artist
                  </span>
                )}
              </div>

              {/* Name */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4">
                {artist.name}
              </h1>

              {/* Genres */}
              {artist.genres && artist.genres.length > 0 && (
                <div className="flex flex-wrap justify-center lg:justify-start gap-2 mb-6">
                  {artist.genres.map((genre: string) => (
                    <span
                      key={genre}
                      className="px-3 py-1 bg-gradient-to-r from-orange-500/10 to-pink-600/10 text-gray-300 rounded-full text-sm border border-gray-800"
                    >
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
                    <span className="text-gray-300">
                      {artist.performance_duration}
                    </span>
                  </div>
                )}
                {artist.price_range && (
                  <div className="flex items-center gap-2">
                    <span className="text-xl font-bold text-white">
                      {artist.price_range}
                    </span>
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
                      <a
                        href={artist.socialLinks.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-pink-500 hover:border-pink-500 transition-colors border border-gray-800"
                      >
                        <Instagram className="w-6 h-6" />
                      </a>
                    )}
                    {artist.socialLinks.youtube && (
                      <a
                        href={artist.socialLinks.youtube}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-14 h-14 bg-[#1a1a1a] rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 hover:border-red-500 transition-colors border border-gray-800"
                      >
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
      {artist.achievements && artist.achievements.length > 0 && (
        <section className="py-8 border-y border-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-8">
              {artist.achievements.map((achievement: string, index: number) => (
                <div
                  key={index}
                  className="flex items-center gap-2 text-gray-400"
                >
                  <Award className="w-5 h-5 text-orange-400" />
                  <span>{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Sticky Mobile Booking Bar */}
      <div className="fixed bottom-0 left-0 right-0 p-4 bg-[#0a0a0b]/90 backdrop-blur-lg border-t border-gray-800 md:hidden z-50">
        <div className="flex items-center gap-4 max-w-7xl mx-auto">
          <div className="flex-1">
            <p className="text-xs text-gray-400">Starting from</p>
            <p className="text-lg font-bold text-white">{artist.price_range || "Custom Price"}</p>
          </div>
          <Link
            href={`/post-requirement?artist=${artist.slug}`}
            className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full text-white font-semibold shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 transition-all"
          >
            Book Now
          </Link>
        </div>
      </div>

      {/* About Section */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 p-8">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
              <Music className="w-6 h-6 text-orange-400" />
              About {artist.name}
            </h2>
            <div className="space-y-4 max-w-4xl">
              {bioParagraphs.length > 0 ? (
                bioParagraphs.map((paragraph: string, index: number) => (
                  <p
                    key={index}
                    className="text-gray-400 leading-relaxed text-lg"
                  >
                    {paragraph}
                  </p>
                ))
              ) : (
                <p className="text-gray-400 leading-relaxed text-lg">
                  {artist.short_bio ||
                    `${artist.name} is a talented performer available for bookings through our platform.`}
                </p>
              )}
            </div>

            {/* Gallery Strip */}
            {artist.gallery_urls && artist.gallery_urls.length > 0 && (
              <div className="mt-8 pt-8 border-t border-gray-800">
                <h3 className="text-lg font-semibold text-white mb-4">Photos</h3>
                <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
                  {artist.gallery_urls.map((url: string, index: number) => (
                    <div
                      key={index}
                      className="relative h-40 w-60 flex-shrink-0 rounded-xl overflow-hidden border border-gray-800 group cursor-pointer"
                      onClick={() => {
                        setGalleryIndex(index);
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                    >
                      <Image
                        src={url}
                        alt={`${artist.name} photo ${index + 1}`}
                        fill
                        className="object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                        <span className="text-white text-xs font-medium px-2 py-1 bg-black/50 rounded-full border border-white/20">
                          View in Header
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Languages/Genres */}
            {artist.languages && artist.languages.length > 0 && (
              <div className="mt-6 pt-6 border-t border-gray-800">
                <p className="text-gray-500 text-sm mb-3">Genres & Languages</p>
                <div className="flex flex-wrap gap-2">
                  {artist.languages.map((lang: string) => (
                    <span
                      key={lang}
                      className="px-4 py-2 bg-[#0a0a0b] border border-gray-800 rounded-full text-sm text-gray-300"
                    >
                      {lang}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Hidden Carousel ID for smooth scrolling */}
      <div id="gallery-carousel" />

      {/* Fallback to mock album carousel */}
      {artist.albums && artist.albums.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AlbumCarousel albums={artist.albums} artistName={artist.name} />
          </div>
        </section>
      )}

      {/* YouTube Top Songs Section */}
      {(youtubeData?.topSongs?.length > 0 || loadingYoutube) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Music className="w-6 h-6 text-orange-500" />
              Top Songs
              <span className="text-sm font-normal text-gray-500 ml-2">
                from YouTube
              </span>
            </h2>

            {loadingYoutube ? (
              <div className="flex items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
              </div>
            ) : (
              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                {youtubeData.topSongs.map((song: any, index: number) => (
                  <div
                    key={song.id}
                    onClick={() => {
                      if (playingVideo === song.videoId) {
                        setPlayingVideo(null);
                      } else {
                        setPlayingVideo(song.videoId);
                      }
                    }}
                    className="flex items-center gap-4 p-4 hover:bg-[#2a2a2a] transition-colors border-b border-gray-800 last:border-b-0 group cursor-pointer"
                  >
                    {/* Track Number */}
                    <div className="w-8 text-center">
                      <span className="text-gray-500 group-hover:hidden">
                        {index + 1}
                      </span>
                      {playingVideo === song.videoId ? (
                        <Pause className="w-4 h-4 text-orange-500 hidden group-hover:block mx-auto" />
                      ) : (
                        <Play className="w-4 h-4 text-orange-500 hidden group-hover:block mx-auto" />
                      )}
                    </div>

                    {/* Thumbnail */}
                    {song.thumbnail && (
                      <div className="relative w-12 h-12 rounded overflow-hidden flex-shrink-0">
                        <Image
                          src={song.thumbnail}
                          alt={song.name}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          {playingVideo === song.videoId ? (
                            <Pause className="w-4 h-4 text-white" />
                          ) : (
                            <Play className="w-4 h-4 text-white" />
                          )}
                        </div>
                      </div>
                    )}

                    {/* Song Info */}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-white group-hover:text-orange-400 transition-colors truncate">
                        {song.name}
                      </h4>
                      <p className="text-gray-500 text-sm truncate">
                        {artist.name}
                      </p>
                    </div>

                    {/* Views */}
                    {song.views && (
                      <div className="text-gray-500 text-sm hidden sm:block">
                        {song.views}
                      </div>
                    )}

                    {/* Duration */}
                    {song.duration && (
                      <div className="text-gray-500 text-sm w-16 text-right">
                        {song.duration}
                      </div>
                    )}

                    {/* YouTube Icon */}
                    <Youtube className="w-4 h-4 text-gray-600 group-hover:text-red-500 transition-colors" />
                  </div>
                ))}

                {/* Embedded Player */}
                {playingVideo && (
                  <div className="relative aspect-video bg-black">
                    <iframe
                      width="100%"
                      height="100%"
                      src={`https://www.youtube.com/embed/${playingVideo}?autoplay=1&mute=1&modestbranding=1&rel=0`}
                      title="YouTube video player"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="absolute inset-0"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      )}

      {/* Discography Section - Carousel View */}
      {(youtubeData?.topSongs?.length > 0 || (artist.popularSongs && artist.popularSongs.length > 0)) && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <AlbumCarousel
              albums={(youtubeData?.topSongs || artist.popularSongs || []).slice(0, 5).map((song: any, index: number) => ({
                id: song.id || index + 1,
                name: song.name || 'Unknown',
                year: new Date().getFullYear().toString(),
                cover: song.thumbnail || (song.videoId ? `https://img.youtube.com/vi/${song.videoId}/mqdefault.jpg` : 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400'),
                tracks: index + 1,
              }))}
              artistName={artist.name}
            />
          </div>
        </section>
      )}

      {/* Fallback to mock popular songs if no YouTube data */}
      {!youtubeData?.topSongs?.length &&
        !loadingYoutube &&
        artist.popularSongs &&
        artist.popularSongs.length > 0 && (
          <section className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <Music className="w-6 h-6 text-orange-400" />
                Popular Songs
              </h2>

              <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                {artist.popularSongs.map(
                  (
                    song: {
                      id: number;
                      name: string;
                      plays: string;
                      duration: string;
                    },
                    index: number,
                  ) => (
                    <div
                      key={song.id}
                      className="flex items-center gap-4 p-4 hover:bg-[#2a2a2a] transition-colors border-b border-gray-800 last:border-b-0 group"
                    >
                      {/* Track Number */}
                      <div className="w-8 text-center">
                        <span className="text-gray-500 group-hover:hidden">
                          {index + 1}
                        </span>
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
                  ),
                )}
              </div>
            </div>
          </section>
        )}

      {/* YouTube Videos - from Backend or Mock */}
      {artist.youtubeVideos && artist.youtubeVideos.length > 0 && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
              <Youtube className="w-6 h-6 text-red-500" />
              Live Performances
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {artist.youtubeVideos.map(
                (video: {
                  id: number;
                  title: string;
                  videoId: string;
                  views: string;
                  thumbnail: string;
                }) => (
                  <div key={video.id} className="group">
                    {playingVideo === video.videoId ? (
                      // Embedded YouTube Player
                      <div className="relative aspect-video rounded-2xl overflow-hidden">
                        <iframe
                          width="100%"
                          height="100%"
                          src={`https://www.youtube.com/embed/${video.videoId}?autoplay=1&mute=1&modestbranding=1&rel=0`}
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
                        {video.views !== "N/A" && (
                          <div className="absolute bottom-3 right-3 px-2 py-1 bg-black/70 text-white text-xs rounded">
                            {video.views} views
                          </div>
                        )}
                      </div>
                    )}

                    {/* Video Title */}
                    <h3 className="mt-3 font-medium text-white group-hover:text-orange-400 transition-colors">
                      {video.title}
                    </h3>
                  </div>
                ),
              )}
            </div>
          </div>
        </section>
      )}





      {/* Booking CTA */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-size-200 rounded-3xl p-12 text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              Book {artist.name} for Your Event
            </h2>
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
