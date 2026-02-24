"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArtistCard from "@/components/artists/ArtistCard";

import { Loader2, ChevronDown, ArrowLeft, Music, Users } from "lucide-react";
import { Artist } from "@/types";
import { use } from "react";
import { API_BASE_URL } from '@/lib/api';

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Hero background images for each category
const categoryHeroImages: Record<string, string[]> = {
  singers: [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80"
  ],
  qawwals: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80"
  ],
  "sufi-artists": [
    "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80"
  ],
  "live-bands": [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1501612780327-45045538702b?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80"
  ],
  "bhangra-artists": [
    "https://images.unsplash.com/photo-1547153760-18fc86324498?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1504609813442-a8924e83f76e?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1508700929628-666bc8bd84ea?auto=format&fit=crop&q=80"
  ],
  musicians: [
    "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514320291840-2e0a9bf2a9ae?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1507838153414-b4b713384a76?auto=format&fit=crop&q=80"
  ],
  djs: [
    "https://images.unsplash.com/photo-1571266028243-e4733b0f0bb0?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1574391884720-bbc3740c59d1?auto=format&fit=crop&q=80"
  ],
  default: [
    "https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&q=80",
    "https://images.unsplash.com/photo-1429962714451-bb934ecdc4ec?auto=format&fit=crop&q=80"
  ]
};

// Map category slugs to backend category names
// IMPORTANT: Only map to categories that exist in the backend database
// Sub-genres like qawwals, sufi-artists should be filtered by tags, not parent category
const categorySlugToBackendName: Record<string, string> = {
  // Main categories that exist in backend
  singers: "Singers",
  musicians: "Musicians",
  anchors: "Anchors",
  "makeup-artists": "Makeup Artists",
  photographers: "Photographers",
  "mehndi-artists": "Mehndi Artists",
  decorators: "Decorators",
  // Sub-categories - these need dedicated backend categories OR tag filtering
  qawwals: "Qawwals",           // Needs to exist as a category in backend
  "sufi-artists": "Sufi Artists",      // Needs to exist as a category in backend
  "live-bands": "Live bands",   // Needs to exist as a category in backend
  "bhangra-artists": "Bhangra Artists", // Needs to exist as a category in backend
  djs: "DJ",
};

// Define all valid category configurations
const categoryConfigs: Record<string, { name: string; description: string; id: number }> = {
  singers: { name: "Singers", description: "Discover exceptional vocal talent for weddings, concerts, and corporate events", id: 4 },
  qawwals: { name: "Qawwals", description: "Experience the divine magic of traditional Qawwali — from soulful Sufi kalam to energetic mehfils", id: 2 },
  "sufi-artists": { name: "Sufi Artists", description: "Immerse in the spiritual journey with mesmerizing Sufi music that touches the soul", id: 2 },
  musicians: { name: "Musicians", description: "Talented instrumentalists and versatile musicians for any occasion", id: 2 },
  "live-bands": { name: "Live Bands", description: "Electrifying performances from Rock, Fusion, Jazz & Pop bands that get the party started", id: 5 },
  djs: { name: "DJs", description: "Top DJs spinning the latest hits for parties, weddings & nightlife events", id: 6 },
  "bhangra-artists": { name: "Bhangra Artists", description: "High-energy Bhangra performances that bring Punjabi spirit to your celebrations", id: 1 },
  comedians: { name: "Comedians", description: "Stand-up comedy acts that bring laughter and entertainment", id: 5 },
  anchors: { name: "Anchors", description: "Charismatic event hosts and MCs to make your event memorable", id: 6 },
  "makeup-artists": { name: "Makeup Artists", description: "Expert bridal, party & event makeup specialists", id: 7 },
  photographers: { name: "Photographers", description: "Capture every moment with professional wedding & event photography", id: 8 },
  "mehndi-artists": { name: "Mehndi Artists", description: "Intricate traditional & modern mehndi designs for brides and guests", id: 9 },
  decorators: { name: "Decorators", description: "Transform your venue with stunning event decoration & styling", id: 10 },
};


// Transform backend performer data to frontend Artist format
function transformPerformerToArtist(performer: any, categoryId: number): Artist {
  return {
    id: performer.id,
    name: performer.name,
    slug: performer.name.toLowerCase().replace(/\s+/g, "-"),
    category_id: categoryId,
    bio: performer.description,
    short_bio: performer.description?.substring(0, 100),
    location: "Pakistan",
    image_url: performer.profile_image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    is_featured: false,
    is_verified: true,
    languages: performer.genres || [],
    performance_duration: undefined,
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = use(params);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);

  // Hero image carousel state
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  // Dynamic category state
  const [category, setCategory] = useState<{ name: string; description: string; id: number } | null>(null);

  // Auto-advance hero carousel
  useEffect(() => {
    // Only run if category is loaded
    if (!categorySlug) return;

    // Try to find images for the current slug, or try plural/singular variations
    // This helps match "singer" (backend slug) to "singers" (image key)
    let images = categoryHeroImages[categorySlug];
    if (!images) {
      // Try simple pluralization/singularization
      const plural = categorySlug + 's';
      const singular = categorySlug.endsWith('s') ? categorySlug.slice(0, -1) : categorySlug;
      images = categoryHeroImages[plural] || categoryHeroImages[singular] || categoryHeroImages.default;
    }

    const interval = setInterval(() => {
      setHeroImageIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [categorySlug]);

  // Fetch artists and cities
  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        // 1. Fetch all categories to find the current one
        const catResponse = await fetch(`${API_BASE_URL}/categories`);
        let currentCategory: { name: string; description: string; id: number } | null = null;
        let queryName = "";
        let allCategories: any[] = [];

        if (catResponse.ok) {
          const catData = await catResponse.json();
          allCategories = catData.categories || catData || [];
          // Find category by slug (exact match)
          currentCategory = allCategories.find((c: any) => c.slug === categorySlug);
        }

        // Fallback or Singular/Plural mismatch handling
        if (!currentCategory && allCategories.length > 0) {
          // Try to find by variations (e.g. url is 'singers', backend has 'singer')
          currentCategory = allCategories.find((c: any) =>
            c.slug === categorySlug ||
            c.slug + 's' === categorySlug ||
            (categorySlug.endsWith('s') && c.slug === categorySlug.slice(0, -1))
          );
        }

        // Fallback to hardcoded config if still not found
        if (!currentCategory) {
          const fallbackConfig = categoryConfigs[categorySlug];
          if (fallbackConfig) {
            currentCategory = {
              ...fallbackConfig,
              // Use mapped name if available, else config name
              name: categorySlugToBackendName[categorySlug] || fallbackConfig.name,
            };
          }
        }

        if (!currentCategory) {
          setCategory(null);
          setLoading(false);
          return;
        }

        setCategory(currentCategory);
        queryName = currentCategory.name;

        // 2. Fetch performers for this category
        const response = await fetch(
          `${API_BASE_URL}/performers?category=${encodeURIComponent(queryName)}&limit=100`,
        );

        if (response.ok) {
          const result = await response.json();
          // Handle paginated response - data is in result.data
          const backendPerformers = result.data || result;
          const backendArtists = backendPerformers.map((p: any) =>
            transformPerformerToArtist(p, currentCategory!.id),
          );
          setArtists(backendArtists as Artist[]);

        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [categorySlug]);


  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
      </div>
    );
  }

  if (!category) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Hero with Background Image */}
      <section className="relative min-h-[400px] lg:min-h-[450px] flex items-center overflow-hidden">
        {/* Background Image Carousel */}
        <div className="absolute inset-0">
          <Image
            key={heroImageIndex}
            src={categoryHeroImages[categorySlug]?.[heroImageIndex] || categoryHeroImages.default[heroImageIndex]}
            alt="Performance background"
            fill
            className="object-cover transition-opacity duration-1000"
            priority
          />
          {/* Dark overlay for readability */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-[#0a0a0b]" />
          {/* Colored gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-r from-orange-900/20 via-transparent to-purple-900/20" />
        </div>

        {/* Gradient orbs */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/20 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/15 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full py-16">
          <Link
            href="/artists"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Artists</span>
          </Link>

          <div className="text-center max-w-4xl mx-auto">
            {/* Category badge */}
            <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500/20 to-pink-500/20 backdrop-blur-sm rounded-full text-orange-300 text-base font-semibold mb-8 border border-orange-500/30">
              <Music className="w-5 h-5" />
              <span>Professional {category.name}</span>
            </div>

            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-black mb-6 drop-shadow-2xl leading-tight">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-orange-100 to-white">Book</span>{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 animate-gradient bg-size-200">
                {category.name}
              </span>
              <span className="block text-2xl sm:text-3xl lg:text-4xl font-medium mt-4">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-200 via-purple-200 to-pink-200">
                  for Your Unforgettable Event
                </span>
              </span>
            </h1>

            <p className="text-lg text-gray-300 max-w-2xl mx-auto mb-6">
              {category.description}
            </p>

            <div className="flex items-center justify-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <Users className="w-4 h-4 text-orange-400" />
                <span className="text-white">{loading ? "..." : artists.length} Artists</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <span className="text-green-400">✓</span>
                <span className="text-white">Verified Professionals</span>
              </div>
            </div>
          </div>
        </div>

        {/* Carousel indicators */}
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex gap-2">
          {(categoryHeroImages[categorySlug] || categoryHeroImages.default).map((_: string, idx: number) => (
            <button
              key={idx}
              onClick={() => setHeroImageIndex(idx)}
              className={`w-2 h-2 rounded-full transition-all ${idx === heroImageIndex
                ? 'bg-orange-500 w-6'
                : 'bg-white/30 hover:bg-white/50'
                }`}
            />
          ))}
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-8">
            <p className="text-gray-400">
              {loading ? (
                <span className="flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Loading artists...
                </span>
              ) : (
                <>
                  Showing{" "}
                  <span className="font-semibold text-white">
                    {artists.length}
                  </span>{" "}
                  {category.name.toLowerCase()}
                </>
              )}
            </p>
          </div>
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="text-center">
                <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
                <p className="text-gray-400">Loading artists...</p>
              </div>
            </div>
          ) : artists.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {artists.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 p-12 max-w-md mx-auto">
                <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center mx-auto mb-6">
                  <svg className="w-10 h-10 text-orange-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <h3 className="text-xl font-bold text-white mb-2">
                  No Artists Available Yet
                </h3>
                <p className="text-gray-400 mb-6">
                  We&apos;re currently building our {category?.name || 'artist'} network. Check back soon!
                </p>
                <Link
                  href="/"
                  className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                >
                  Browse All Categories
                </Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Looking for Something Else? CTA Section */}
      <section className="py-16 lg:py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-orange-900/5 to-purple-900/10" />
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[150px]" />

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-b from-[#1a1a1a]/80 to-[#151515]/80 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 lg:p-12 shadow-2xl shadow-orange-500/5">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
              <span className="text-lg">🎯</span>
              <span>Can't Find What You're Looking For?</span>
            </div>

            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Looking for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">
                Something Specific?
              </span>
            </h2>

            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              Our team can help you find the perfect artist for your event.
              Tell us your requirements and we'll match you with the best talent.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/contact"
                className="px-8 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all"
              >
                Contact Us Now
              </Link>
              <Link
                href="/post-requirement"
                className="px-8 py-4 bg-[#1a1a1a] border border-gray-700 text-white font-bold rounded-xl hover:bg-[#252525] hover:border-orange-500/30 transition-all"
              >
                Post Your Requirement
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* FAQs Section */}
      <section className="py-16 lg:py-24 bg-[#0f0f10] relative">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-500/10 rounded-full blur-[120px]" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full text-purple-400 text-sm font-medium mb-4 border border-purple-500/30">
              <span className="text-lg">❓</span>
              <span>Frequently Asked Questions</span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Got Questions?{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                We've Got Answers
              </span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Everything you need to know about booking {category?.name || 'artists'} for your events
            </p>
          </div>

          <div className="space-y-4">
            {[
              {
                question: `How do I book a ${category?.name?.toLowerCase()?.slice(0, -1) || 'performer'} for my event?`,
                answer: `Simply browse through our verified ${category?.name?.toLowerCase() || 'artists'}, select the one you like, and click on 'Book Now' or 'Send Inquiry'. You can also post your requirements and we'll match you with the perfect artist.`
              },
              {
                question: "What is the typical booking process?",
                answer: "1. Browse and select an artist. 2. Send an inquiry with your event details. 3. Receive a quote and confirm details. 4. Make payment to confirm booking. 5. Enjoy your event! We handle all the coordination."
              },
              {
                question: `How much do ${category?.name?.toLowerCase() || 'artists'} typically charge?`,
                answer: "Prices vary based on the artist's popularity, event duration, location, and specific requirements. Use our price filter to find artists within your budget. Many artists offer customized packages."
              },
              {
                question: "Are all artists verified?",
                answer: "Yes! Every artist on our platform goes through a verification process. We check their background, past performances, and client reviews to ensure quality and professionalism."
              },
              {
                question: "Can I request a custom performance?",
                answer: "Absolutely! Most artists are flexible and can customize their performance based on your event theme, song requests, or specific requirements. Discuss this with the artist during the booking process."
              },
              {
                question: "What if I need to cancel or reschedule?",
                answer: "We understand plans can change. Our cancellation policy varies by artist, but most offer flexibility if you notify them in advance. Check the specific terms during booking or contact our support team."
              }
            ].map((faq, index) => (
              <details
                key={index}
                className="group bg-gradient-to-r from-[#1a1a1a] to-[#151515] rounded-2xl border border-gray-800/50 overflow-hidden hover:border-purple-500/30 transition-all"
              >
                <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                  <span className="font-semibold text-white group-hover:text-purple-400 transition-colors pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                </summary>
                <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-800/50 pt-4">
                  {faq.answer}
                </div>
              </details>
            ))}
          </div>

          <div className="text-center mt-12">
            <p className="text-gray-500 mb-4">Still have questions?</p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
            >
              Contact our support team
              <span className="text-lg">→</span>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
