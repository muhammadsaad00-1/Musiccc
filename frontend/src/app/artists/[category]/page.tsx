"use client";

import { useEffect, useState, useMemo } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import ArtistCard from "@/components/artists/ArtistCard";

import { SlidersHorizontal, Loader2, MapPin, DollarSign, CheckCircle, X, ChevronDown, ArrowLeft } from "lucide-react";
import { Artist } from "@/types";
import { use } from "react";

interface CategoryPageProps {
  params: Promise<{ category: string }>;
}

// Map category slugs to backend category names
const categorySlugToBackendName: Record<string, string> = {
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
  qawwals: "Singer",
  "sufi-artists": "Singer",
  "live-bands": "Musician",
  "ghazal-artists": "Singer",
  "folk-singers": "Singer",
  "classical-musicians": "Musician",
};

// Define all valid category configurations
const categoryConfigs: Record<string, { name: string; description: string; id: number }> = {
  singers: { name: "Singers", description: "Professional singers for all types of events", id: 1 },
  qawwals: { name: "Qawwals", description: "Traditional and modern Qawwali performances", id: 1 },
  "sufi-artists": { name: "Sufi Artists", description: "Soul-stirring Sufi performances", id: 1 },
  "ghazal-artists": { name: "Ghazal Artists", description: "Poetry in melody", id: 1 },
  "folk-singers": { name: "Folk Singers", description: "Punjabi, Sindhi, Pashto and more", id: 1 },
  musicians: { name: "Musicians", description: "Talented musicians and bands", id: 2 },
  "live-bands": { name: "Live Bands", description: "Rock, Fusion, Jazz bands", id: 2 },
  "classical-musicians": { name: "Classical Musicians", description: "Tabla, Sitar, Harmonium masters", id: 2 },
  djs: { name: "DJs", description: "Top DJs for parties and events", id: 3 },
  dancers: { name: "Dancers", description: "Classical, contemporary and folk dancers", id: 4 },
  comedians: { name: "Comedians", description: "Stand-up comedians and entertainers", id: 5 },
  anchors: { name: "Anchors", description: "Professional event hosts and MCs", id: 6 },
  "makeup-artists": { name: "Makeup Artists", description: "Bridal and event makeup specialists", id: 7 },
  photographers: { name: "Photographers", description: "Wedding and event photographers", id: 8 },
  "mehndi-artists": { name: "Mehndi Artists", description: "Traditional and modern mehndi designs", id: 9 },
  decorators: { name: "Decorators", description: "Event decoration and styling", id: 10 },
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

  const category = categoryConfigs[categorySlug];

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
      {/* Hero */}
      <section className="relative py-16">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
              Book {category.name}
            </h1>
            <p className="text-lg text-gray-400 max-w-2xl mx-auto">
              {category.description}
            </p>
            <p className="text-gray-500 mt-4">
              {loading ? "Loading..." : `${filteredArtists.length} artists available`}
            </p>
          </div>
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
    </div>
  );
}
