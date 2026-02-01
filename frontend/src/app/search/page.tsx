"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ArtistCard from "@/components/artists/ArtistCard";
import { mockArtists, mockCategories, cities } from "@/lib/mockData";
import { Search, SlidersHorizontal, Loader2 } from "lucide-react";

// Transform backend performer to frontend artist format
function transformPerformerToArtist(performer: any): any {
  const slug = performer.name?.toLowerCase().replace(/\s+/g, "-") || "";

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
    Photography: 8, // Alias for Photographer
    "Mehndi Artist": 9,
    Decorator: 10,
  };
  return mapping[categoryName] || 1;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialLocation = searchParams.get("location") || "";

  const [query, setQuery] = useState(initialQuery);
  const [location, setLocation] = useState(initialLocation);
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [allPerformers, setAllPerformers] = useState<any[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>(cities);
  const [loading, setLoading] = useState(true);

  // Fetch all performers from backend
  useEffect(() => {
    async function fetchPerformers() {
      setLoading(true);
      try {
        const response = await fetch("http://localhost:8000/performers");
        if (response.ok) {
          const performers = await response.json();
          const transformedPerformers = performers.map(
            transformPerformerToArtist,
          );
          setAllPerformers(transformedPerformers);
        } else {
          // Fallback to mock data if API fails
          setAllPerformers(mockArtists);
        }
      } catch (error) {
        console.error("Error fetching performers:", error);
        // Fallback to mock data
        setAllPerformers(mockArtists);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformers();
  }, []);

  // Fetch available cities from backend
  useEffect(() => {
    async function fetchCities() {
      try {
        const response = await fetch("http://localhost:8000/performers/cities");
        if (response.ok) {
          const data = await response.json();
          if (data.cities && data.cities.length > 0) {
            setAvailableCities(data.cities);
          }
        }
      } catch (error) {
        console.error("Error fetching cities:", error);
        // Keep default cities from mockData
      }
    }

    fetchCities();
  }, []);

  // Filter performers based on search criteria
  useEffect(() => {
    let filtered = allPerformers;

    if (query) {
      filtered = filtered.filter(
        (artist) =>
          artist.name.toLowerCase().includes(query.toLowerCase()) ||
          artist.bio?.toLowerCase().includes(query.toLowerCase()),
      );
    }

    if (location) {
      filtered = filtered.filter(
        (artist) => artist.location.toLowerCase() === location.toLowerCase(),
      );
    }

    if (category) {
      const cat = mockCategories.find((c) => c.slug === category);
      if (cat) {
        filtered = filtered.filter((artist) => artist.category_id === cat.id);
      }
    }

    setResults(filtered);
  }, [query, location, category, allPerformers]);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Search Header */}
      <section className="bg-[#1a1a1a] border-b border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Search */}
            <div className="flex-1 relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search artists, categories..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
              />
            </div>

            {/* Location */}
            <select
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Cities</option>
              {availableCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {mockCategories.map((cat) => (
                <option key={cat.id} value={cat.slug}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* Results */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <p className="text-gray-400">
              {loading ? (
                <span>Loading artists...</span>
              ) : (
                <>
                  Found{" "}
                  <span className="font-semibold text-white">
                    {results.length}
                  </span>{" "}
                  artists
                  {query && <span> for "{query}"</span>}
                </>
              )}
            </p>
            <button className="flex items-center gap-2 px-4 py-2 text-gray-400 hover:bg-[#1a1a1a] rounded-lg lg:hidden">
              <SlidersHorizontal className="w-5 h-5" />
              Filters
            </button>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {results.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg mb-2">No artists found</p>
              <p className="text-gray-600">
                Try adjusting your search or filters
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center text-white">
          Loading...
        </div>
      }
    >
      <SearchContent />
    </Suspense>
  );
}
