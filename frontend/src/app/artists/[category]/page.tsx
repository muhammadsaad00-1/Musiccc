"use client";

import { useEffect, useState } from "react";
import { notFound } from "next/navigation";
import ArtistCard from "@/components/artists/ArtistCard";
import { mockCategories, mockArtists } from "@/lib/mockData";
import { SlidersHorizontal, Loader2 } from "lucide-react";
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
};

// Transform backend performer data to frontend Artist format
function transformPerformerToArtist(
  performer: any,
  categoryId: number,
): Artist {
  return {
    id: performer.id,
    name: performer.name,
    slug: performer.name.toLowerCase().replace(/\s+/g, "-"),
    category_id: categoryId,
    bio: performer.description,
    short_bio: performer.description?.substring(0, 100),
    location: performer.locations?.[0] || "Pakistan",
    price_range: performer.price
      ? `PKR ${performer.price.toLocaleString()}`
      : undefined,
    image_url:
      performer.profile_image_url ||
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400",
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
  const [error, setError] = useState<string | null>(null);

  const category = mockCategories.find((c) => c.slug === categorySlug);

  useEffect(() => {
    async function fetchArtists() {
      if (!category) return;

      setLoading(true);
      try {
        // Get the backend category name from the slug
        const backendCategoryName = categorySlugToBackendName[categorySlug];

        // Fetch from backend API
        const response = await fetch(
          `http://localhost:8000/performers?category=${encodeURIComponent(backendCategoryName || "")}`,
        );

        if (response.ok) {
          const backendPerformers = await response.json();

          // Transform backend data to frontend format
          const backendArtists = backendPerformers.map((p: any) =>
            transformPerformerToArtist(p, category.id),
          );

          // Also include mock artists for this category
          const mockCategoryArtists = mockArtists.filter(
            (a) => a.category_id === category.id,
          );

          // Combine backend and mock artists (backend first)
          setArtists([...backendArtists, ...mockCategoryArtists] as Artist[]);
        } else {
          // Fallback to mock data only
          const mockCategoryArtists = mockArtists.filter(
            (a) => a.category_id === category.id,
          );
          setArtists(mockCategoryArtists as Artist[]);
        }
      } catch (err) {
        console.error("Error fetching artists:", err);
        // Fallback to mock data on error
        const mockCategoryArtists = mockArtists.filter(
          (a) => a.category_id === category.id,
        );
        setArtists(mockCategoryArtists as Artist[]);
      } finally {
        setLoading(false);
      }
    }

    fetchArtists();
  }, [categorySlug, category]);

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
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Book {category.name}
          </h1>
          <p className="text-lg text-gray-400 max-w-2xl mx-auto">
            {category.description}
          </p>
          <p className="text-gray-500 mt-4">
            {loading ? "Loading..." : `${artists.length} artists available`}
          </p>
        </div>
      </section>

      {/* Content */}
      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <aside className="lg:w-64 flex-shrink-0">
              <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 p-6 sticky top-24">
                <div className="flex items-center gap-2 mb-6">
                  <SlidersHorizontal className="w-5 h-5 text-gray-400" />
                  <h2 className="font-semibold text-white">Filters</h2>
                </div>

                {/* Location Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Location
                  </label>
                  <select className="w-full px-3 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">All Cities</option>
                    <option value="lahore">Lahore</option>
                    <option value="karachi">Karachi</option>
                    <option value="islamabad">Islamabad</option>
                    <option value="rawalpindi">Rawalpindi</option>
                  </select>
                </div>

                {/* Price Range Filter */}
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Price Range
                  </label>
                  <select className="w-full px-3 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                    <option value="">Any Budget</option>
                    <option value="0-50000">Under PKR 50,000</option>
                    <option value="50000-100000">PKR 50,000 - 100,000</option>
                    <option value="100000-300000">PKR 100,000 - 300,000</option>
                    <option value="300000+">PKR 300,000+</option>
                  </select>
                </div>

                {/* Verified Only */}
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="verified"
                    className="w-4 h-4 text-orange-500 bg-[#0a0a0b] border-gray-700 rounded focus:ring-orange-500"
                  />
                  <label htmlFor="verified" className="text-sm text-gray-400">
                    Verified Artists Only
                  </label>
                </div>
              </div>
            </aside>

            {/* Artists Grid */}
            <div className="flex-1">
              {/* Results Header */}
              <div className="flex items-center justify-between mb-6">
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
                <select className="px-3 py-2 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                  <option>Sort by: Featured</option>
                  <option>Price: Low to High</option>
                  <option>Price: High to Low</option>
                  <option>Most Recent</option>
                </select>
              </div>

              {/* Grid */}
              {loading ? (
                <div className="flex items-center justify-center py-16">
                  <div className="text-center">
                    <Loader2 className="w-10 h-10 text-orange-500 animate-spin mx-auto mb-4" />
                    <p className="text-gray-400">Loading artists...</p>
                  </div>
                </div>
              ) : artists.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                  {artists.map((artist) => (
                    <ArtistCard key={artist.id} artist={artist} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
                  <p className="text-gray-400 text-lg">
                    No artists found in this category yet.
                  </p>
                  <p className="text-gray-600 mt-2">
                    Check back soon or try a different category.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
