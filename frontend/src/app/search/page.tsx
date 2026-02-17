"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ArtistCard from "@/components/artists/ArtistCard";
import { Search, Loader2, ArrowLeft } from "lucide-react";
import Link from "next/link";
import FAQSection from "@/components/ui/FAQSection";
import { API_BASE_URL } from '@/lib/api';

// Transform backend performer to frontend artist format
function transformPerformerToArtist(performer: any): any {
  const slug = performer.name?.toLowerCase().replace(/\s+/g, "-") || "";

  return {
    id: performer.id,
    name: performer.name,
    slug: slug,
    category_id: performer.category,
    bio: performer.description || "",
    short_bio: performer.description?.substring(0, 100) || "",
    location: "Pakistan",
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

function SearchContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";

  const [query, setQuery] = useState(initialQuery);
  const [category, setCategory] = useState("");
  const [results, setResults] = useState<any[]>([]);
  const [allPerformers, setAllPerformers] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch all performers from backend
  useEffect(() => {
    async function fetchPerformers() {
      setLoading(true);
      try {
        const response = await fetch(`${API_BASE_URL}/performers`);
        if (response.ok) {
          const performers = await response.json();
          const transformedPerformers = performers.map(
            transformPerformerToArtist,
          );
          setAllPerformers(transformedPerformers);
        } else {
          setAllPerformers([]);
        }
      } catch (error) {
        console.error("Error fetching performers:", error);
        setAllPerformers([]);
      } finally {
        setLoading(false);
      }
    }

    fetchPerformers();
  }, []);

  // Fetch categories from backend
  useEffect(() => {
    async function fetchCategories() {
      try {
        const response = await fetch(`${API_BASE_URL}/categories`);
        if (response.ok) {
          const data = await response.json();
          setCategories(data || []);
        }
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    }

    fetchCategories();
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

    if (category) {
      const cat = categories.find((c) => c.slug === category || c.name === category);
      if (cat) {
        filtered = filtered.filter((artist) => {
          return String(artist.category_id) === cat.name;
        });
      }
    }

    setResults(filtered);
  }, [query, category, allPerformers, categories]);

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Search Header */}
      <section className="bg-[#1a1a1a] border-b border-gray-800 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-6 group"
          >
            <div className="w-8 h-8 rounded-full bg-[#0a0a0b] border border-gray-700 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
              <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">Back to Home</span>
          </Link>
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

            {/* Category */}
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            >
              <option value="">All Categories</option>
              {categories.map((cat) => (
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
                  {query && <span> for &quot;{query}&quot;</span>}
                </>
              )}
            </p>
          </div>

          {/* Grid */}
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-12 h-12 text-orange-500 animate-spin" />
            </div>
          ) : results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {results.map((artist) => (
                <ArtistCard key={artist.id} artist={artist} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 bg-[#1a1a1a] rounded-xl border border-gray-800">
              <p className="text-gray-400 text-lg mb-2">No artists found</p>
              <p className="text-gray-600">
                Try adjusting your search or category filter
              </p>
            </div>
          )}
        </div>
      </section>

      {/* FAQ Section */}
      <FAQSection
        title="Search Help?"
        subtitle="Tips and answers for finding the perfect artist"
        faqs={[
          {
            question: "How do I find the right artist?",
            answer: "Use the search bar to search by name, or filter by category to narrow down results. Click on any artist to view their full profile."
          },
          {
            question: "How do I contact an artist?",
            answer: "Visit an artist's profile page and click the WhatsApp contact button to reach out directly with your event details."
          },
          {
            question: "Why are some artists not showing up?",
            answer: "Artists may not appear if they don't match your search or category filter. Try broadening your search criteria."
          }
        ]}
      />
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
