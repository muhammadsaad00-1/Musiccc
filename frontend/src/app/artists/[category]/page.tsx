"use client";

import { useEffect, useState, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import ArtistCard from "@/components/artists/ArtistCard";

import { SlidersHorizontal, Loader2, MapPin, DollarSign, CheckCircle, X, ChevronDown, ArrowLeft, Music, Users } from "lucide-react";
import { Artist } from "@/types";
import { use } from "react";

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
  singers: "Singer",
  musicians: "Musician",
  djs: "DJ",
  dancers: "Dancer",
  comedians: "Comedian",
  anchors: "Anchor",
  "makeup-artists": "Makeup Artist",
  photographers: "Photographer",
  "mehndi-artists": "Mehndi Artist",
  decorators: "Decorator",
  // Sub-categories - these need dedicated backend categories OR tag filtering
  qawwals: "Qawwal",           // Needs to exist as a category in backend
  "sufi-artists": "Sufi",      // Needs to exist as a category in backend
  "live-bands": "Live Band",   // Needs to exist as a category in backend
  "bhangra-artists": "Bhangra", // Needs to exist as a category in backend
};

// Define all valid category configurations
const categoryConfigs: Record<string, { name: string; description: string; id: number }> = {
  singers: { name: "Singers", description: "Discover exceptional vocal talent for weddings, concerts, and corporate events", id: 1 },
  qawwals: { name: "Qawwals", description: "Experience the divine magic of traditional Qawwali — from soulful Sufi kalam to energetic mehfils", id: 1 },
  "sufi-artists": { name: "Sufi Artists", description: "Immerse in the spiritual journey with mesmerizing Sufi music that touches the soul", id: 1 },
  musicians: { name: "Musicians", description: "Talented instrumentalists and versatile musicians for any occasion", id: 2 },
  "live-bands": { name: "Live Bands", description: "Electrifying performances from Rock, Fusion, Jazz & Pop bands that get the party started", id: 2 },
  djs: { name: "DJs", description: "Top DJs spinning the latest hits for parties, weddings & nightlife events", id: 3 },
  "bhangra-artists": { name: "Bhangra Artists", description: "High-energy Bhangra performances that bring Punjabi spirit to your celebrations", id: 4 },
  comedians: { name: "Comedians", description: "Stand-up comedy acts that bring laughter and entertainment", id: 5 },
  anchors: { name: "Anchors", description: "Charismatic event hosts and MCs to make your event memorable", id: 6 },
  "makeup-artists": { name: "Makeup Artists", description: "Expert bridal, party & event makeup specialists", id: 7 },
  photographers: { name: "Photographers", description: "Capture every moment with professional wedding & event photography", id: 8 },
  "mehndi-artists": { name: "Mehndi Artists", description: "Intricate traditional & modern mehndi designs for brides and guests", id: 9 },
  decorators: { name: "Decorators", description: "Transform your venue with stunning event decoration & styling", id: 10 },
};

// Price range options
const priceRanges = [
  { value: "", label: "Any Budget", min: 0, max: Infinity },
  { value: "0-50000", label: "Under PKR 50,000", min: 0, max: 50000 },
  { value: "50000-100000", label: "PKR 50,000 - 100,000", min: 50000, max: 100000 },
  { value: "100000-300000", label: "PKR 100,000 - 300,000", min: 100000, max: 300000 },
  { value: "300000+", label: "PKR 300,000+", min: 300000, max: Infinity },
];

// Sort options
const sortOptions = [
  { value: "featured", label: "Featured" },
  { value: "price-low", label: "Price: Low to High" },
  { value: "price-high", label: "Price: High to Low" },
  { value: "name", label: "Name: A-Z" },
];

// Transform backend performer data to frontend Artist format
function transformPerformerToArtist(performer: any, categoryId: number): Artist {
  return {
    id: performer.id,
    name: performer.name,
    slug: performer.name.toLowerCase().replace(/\s+/g, "-"),
    category_id: categoryId,
    bio: performer.description,
    short_bio: performer.description?.substring(0, 100),
    location: performer.locations?.[0] || "Pakistan",
    price_range: performer.price ? `PKR ${performer.price.toLocaleString()}` : undefined,
    price: performer.price,
    image_url: performer.profile_image_url || "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
    is_featured: false,
    is_verified: true,
    languages: performer.genres || [],
    performance_duration: undefined,
    locations: performer.locations || [],
  };
}

export default function CategoryPage({ params }: CategoryPageProps) {
  const { category: categorySlug } = use(params);
  const [artists, setArtists] = useState<Artist[]>([]);
  const [loading, setLoading] = useState(true);
  const [availableCities, setAvailableCities] = useState<string[]>([]);

  // Filter states
  const [locationFilter, setLocationFilter] = useState("");
  const [priceFilter, setPriceFilter] = useState("");
  const [verifiedOnly, setVerifiedOnly] = useState(false);
  const [sortBy, setSortBy] = useState("featured");
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Hero image carousel state
  const [heroImageIndex, setHeroImageIndex] = useState(0);

  const category = categoryConfigs[categorySlug];

  // Auto-advance hero carousel
  useEffect(() => {
    const images = categoryHeroImages[categorySlug] || categoryHeroImages.default;
    const interval = setInterval(() => {
      setHeroImageIndex((current) => (current + 1) % images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [categorySlug]);

  // Fetch artists and cities
  useEffect(() => {
    async function fetchArtists() {
      if (!category) return;

      setLoading(true);
      try {
        const backendCategoryName = categorySlugToBackendName[categorySlug];

        const response = await fetch(
          `http://localhost:8000/performers?category=${encodeURIComponent(backendCategoryName || "")}`,
        );

        if (response.ok) {
          const backendPerformers = await response.json();
          const backendArtists = backendPerformers.map((p: any) =>
            transformPerformerToArtist(p, category.id),
          );
          setArtists(backendArtists as Artist[]);

          // Extract unique cities from artists
          const cities = [...new Set(backendArtists.flatMap((a: Artist) =>
            a.locations || [a.location]
          ).filter(Boolean))] as string[];
          setAvailableCities(cities);
        } else {
          setArtists([]);
        }
      } catch (err) {
        console.error("Error fetching artists:", err);
        setArtists([]);
      } finally {
        setLoading(false);
      }
    }

    // Fetch cities from API
    async function fetchCities() {
      try {
        const response = await fetch("http://localhost:8000/performers/cities");
        if (response.ok) {
          const data = await response.json();
          if (data.cities?.length > 0) {
            setAvailableCities(data.cities);
          }
        }
      } catch (err) {
        console.error("Error fetching cities:", err);
      }
    }

    fetchArtists();
    fetchCities();
  }, [categorySlug, category]);

  // Filter and sort artists
  const filteredArtists = useMemo(() => {
    let result = [...artists];

    // Location filter
    if (locationFilter) {
      result = result.filter(artist => {
        const artistLocation = artist.location?.toLowerCase() || "";
        const artistLocations = artist.locations?.map(l => l.toLowerCase()) || [];
        return artistLocation.includes(locationFilter.toLowerCase()) ||
          artistLocations.some(l => l.includes(locationFilter.toLowerCase()));
      });
    }

    // Price range filter
    if (priceFilter) {
      const priceConfig = priceRanges.find(p => p.value === priceFilter);
      if (priceConfig) {
        result = result.filter(artist => {
          const artistPrice = artist.price || 0;
          return artistPrice >= priceConfig.min && artistPrice <= priceConfig.max;
        });
      }
    }

    // Verified filter
    if (verifiedOnly) {
      result = result.filter(artist => artist.is_verified);
    }

    // Sorting
    switch (sortBy) {
      case "price-low":
        result.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case "price-high":
        result.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case "name":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "featured":
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [artists, locationFilter, priceFilter, verifiedOnly, sortBy]);

  // Count active filters
  const activeFilterCount = [locationFilter, priceFilter, verifiedOnly].filter(Boolean).length;

  // Clear all filters
  const clearFilters = () => {
    setLocationFilter("");
    setPriceFilter("");
    setVerifiedOnly(false);
  };

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
            href="/"
            className="inline-flex items-center gap-2 text-gray-300 hover:text-white transition-colors mb-8 group"
          >
            <div className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/20 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Home</span>
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
                <span className="text-white">{loading ? "..." : filteredArtists.length} Artists</span>
              </div>
              <div className="flex items-center gap-2 px-4 py-2 bg-white/10 backdrop-blur-sm rounded-full">
                <CheckCircle className="w-4 h-4 text-green-400" />
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
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar - Desktop */}
            <aside className="hidden lg:block lg:w-72 flex-shrink-0">
              <div className="bg-gradient-to-b from-[#1a1a1a] to-[#151515] rounded-2xl border border-gray-800/50 p-6 sticky top-24 shadow-xl shadow-black/20">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center">
                      <SlidersHorizontal className="w-5 h-5 text-orange-400" />
                    </div>
                    <div>
                      <h2 className="font-semibold text-white">Filters</h2>
                      {activeFilterCount > 0 && (
                        <span className="text-xs text-orange-400">{activeFilterCount} active</span>
                      )}
                    </div>
                  </div>
                  {activeFilterCount > 0 && (
                    <button
                      onClick={clearFilters}
                      className="text-xs text-gray-400 hover:text-orange-400 transition-colors"
                    >
                      Clear all
                    </button>
                  )}
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <MapPin className="w-4 h-4 text-orange-400" />
                    Location
                  </label>
                  <div className="relative">
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700/50 rounded-xl text-white focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500/50 transition-all appearance-none cursor-pointer hover:border-gray-600"
                    >
                      <option value="">All Cities</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                  </div>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                    <DollarSign className="w-4 h-4 text-green-400" />
                    Price Range
                  </label>
                  <div className="space-y-2">
                    {priceRanges.map(range => (
                      <label
                        key={range.value}
                        className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${priceFilter === range.value
                          ? 'bg-orange-500/10 border border-orange-500/30'
                          : 'bg-[#0a0a0b] border border-gray-800/50 hover:border-gray-700'
                          }`}
                      >
                        <input
                          type="radio"
                          name="priceRange"
                          value={range.value}
                          checked={priceFilter === range.value}
                          onChange={(e) => setPriceFilter(e.target.value)}
                          className="w-4 h-4 text-orange-500 bg-[#0a0a0b] border-gray-600 focus:ring-orange-500/50"
                        />
                        <span className={`text-sm ${priceFilter === range.value ? 'text-white' : 'text-gray-400'}`}>
                          {range.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Verified Only */}
                <div className="pt-4 border-t border-gray-800/50">
                  <label className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${verifiedOnly
                    ? 'bg-green-500/10 border border-green-500/30'
                    : 'bg-[#0a0a0b] border border-gray-800/50 hover:border-gray-700'
                    }`}>
                    <input
                      type="checkbox"
                      checked={verifiedOnly}
                      onChange={(e) => setVerifiedOnly(e.target.checked)}
                      className="w-4 h-4 text-green-500 bg-[#0a0a0b] border-gray-600 rounded focus:ring-green-500/50"
                    />
                    <div className="flex items-center gap-2">
                      <CheckCircle className={`w-4 h-4 ${verifiedOnly ? 'text-green-400' : 'text-gray-500'}`} />
                      <span className={`text-sm ${verifiedOnly ? 'text-white' : 'text-gray-400'}`}>
                        Verified Artists Only
                      </span>
                    </div>
                  </label>
                </div>
              </div>
            </aside>

            {/* Mobile Filter Button */}
            <div className="lg:hidden flex items-center gap-3 mb-4">
              <button
                onClick={() => setShowMobileFilters(true)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl border transition-all ${activeFilterCount > 0
                  ? 'bg-orange-500/10 border-orange-500/30 text-orange-400'
                  : 'bg-[#1a1a1a] border-gray-700 text-gray-400 hover:border-gray-600'
                  }`}
              >
                <SlidersHorizontal className="w-4 h-4" />
                Filters
                {activeFilterCount > 0 && (
                  <span className="px-2 py-0.5 bg-orange-500 text-white text-xs rounded-full">
                    {activeFilterCount}
                  </span>
                )}
              </button>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="flex-1 px-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white text-sm focus:ring-2 focus:ring-orange-500/50"
              >
                {sortOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Mobile Filter Modal */}
            {showMobileFilters && (
              <div className="fixed inset-0 z-50 lg:hidden">
                <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowMobileFilters(false)} />
                <div className="absolute bottom-0 left-0 right-0 bg-[#1a1a1a] rounded-t-3xl p-6 max-h-[80vh] overflow-y-auto animate-slide-up">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-lg font-semibold text-white">Filters</h2>
                    <button onClick={() => setShowMobileFilters(false)} className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
                      <X className="w-5 h-5 text-gray-400" />
                    </button>
                  </div>

                  {/* Location */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Location</label>
                    <select
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white"
                    >
                      <option value="">All Cities</option>
                      {availableCities.map(city => (
                        <option key={city} value={city}>{city}</option>
                      ))}
                    </select>
                  </div>

                  {/* Price */}
                  <div className="mb-6">
                    <label className="block text-sm font-medium text-gray-300 mb-2">Price Range</label>
                    <div className="space-y-2">
                      {priceRanges.map(range => (
                        <label
                          key={range.value}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${priceFilter === range.value
                            ? 'bg-orange-500/10 border border-orange-500/30'
                            : 'bg-[#0a0a0b] border border-gray-800'
                            }`}
                        >
                          <input
                            type="radio"
                            name="mobilePriceRange"
                            value={range.value}
                            checked={priceFilter === range.value}
                            onChange={(e) => setPriceFilter(e.target.value)}
                            className="w-4 h-4 text-orange-500"
                          />
                          <span className="text-sm text-gray-300">{range.label}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* Verified */}
                  <div className="mb-6">
                    <label className="flex items-center gap-3 p-3 bg-[#0a0a0b] border border-gray-800 rounded-xl cursor-pointer">
                      <input
                        type="checkbox"
                        checked={verifiedOnly}
                        onChange={(e) => setVerifiedOnly(e.target.checked)}
                        className="w-4 h-4 text-green-500 rounded"
                      />
                      <span className="text-sm text-gray-300">Verified Artists Only</span>
                    </label>
                  </div>

                  {/* Actions */}
                  <div className="flex gap-3">
                    <button
                      onClick={clearFilters}
                      className="flex-1 px-4 py-3 border border-gray-700 text-gray-400 rounded-xl hover:bg-gray-800 transition-colors"
                    >
                      Clear All
                    </button>
                    <button
                      onClick={() => setShowMobileFilters(false)}
                      className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl font-medium"
                    >
                      Apply Filters
                    </button>
                  </div>
                </div>
              </div>
            )}

            {/* Artists Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="hidden lg:flex items-center justify-between mb-6">
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
                        {filteredArtists.length}
                      </span>{" "}
                      {category.name.toLowerCase()}
                      {activeFilterCount > 0 && (
                        <span className="text-orange-400 ml-1">
                          ({activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} applied)
                        </span>
                      )}
                    </>
                  )}
                </p>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 bg-[#1a1a1a] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500/50 focus:border-transparent cursor-pointer hover:border-gray-600 transition-all"
                >
                  {sortOptions.map(opt => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>

              {/* Active Filters Pills */}
              {activeFilterCount > 0 && (
                <div className="flex flex-wrap gap-2 mb-6">
                  {locationFilter && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-orange-500/10 border border-orange-500/30 rounded-full text-sm text-orange-400">
                      <MapPin className="w-3 h-3" />
                      {locationFilter}
                      <button onClick={() => setLocationFilter("")} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {priceFilter && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-green-500/10 border border-green-500/30 rounded-full text-sm text-green-400">
                      <DollarSign className="w-3 h-3" />
                      {priceRanges.find(p => p.value === priceFilter)?.label}
                      <button onClick={() => setPriceFilter("")} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                  {verifiedOnly && (
                    <span className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-500/10 border border-blue-500/30 rounded-full text-sm text-blue-400">
                      <CheckCircle className="w-3 h-3" />
                      Verified Only
                      <button onClick={() => setVerifiedOnly(false)} className="hover:text-white">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}
                </div>
              )}

              {/* Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading artists...</p>
                  </div>
                </div>
              ) : filteredArtists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredArtists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              ) : artists.length > 0 ? (
                <div className="text-center py-20">
                  <div className="bg-[#1a1a1a] rounded-3xl border border-gray-800 p-12 max-w-md mx-auto">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center mx-auto mb-6">
                      <SlidersHorizontal className="w-10 h-10 text-orange-400" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-2">
                      No Matching Artists
                    </h3>
                    <p className="text-gray-400 mb-6">
                      Try adjusting your filters to see more results
                    </p>
                    <button
                      onClick={clearFilters}
                      className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                    >
                      Clear All Filters
                    </button>
                  </div>
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
                      We're currently building our {category?.name || 'artist'} network. Check back soon!
                    </p>
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <Link
                        href="/search"
                        className="px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-orange-500/20 transition-all"
                      >
                        Browse All Categories
                      </Link>
                      <Link
                        href="/post-requirement"
                        className="px-6 py-3 bg-[#0a0a0b] border border-gray-700 text-white font-semibold rounded-full hover:border-orange-500/50 transition-all"
                      >
                        Post Your Requirement
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
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
