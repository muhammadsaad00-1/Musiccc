"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import {
  Plus,
  Search,
  Edit2,
  Trash2,
  ArrowLeft,
  Loader2,
  X,
  Upload,
} from "lucide-react";
import { API_BASE_URL } from '@/lib/api';

function ManageArtistsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: [] as string[],
    instagram_url: "",
    youtube_url: "",
    genres: "",
    videos: "",
    popular_songs: "",
  });
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [headerImage, setHeaderImage] = useState<File | null>(null);
  const [galleryImages, setGalleryImages] = useState<File[]>([]);
  const [categories, setCategories] = useState<any[]>([]);

  useEffect(() => {
    fetchArtists();
    fetchCategories();

    // Check for add action in URL
    if (searchParams.get("action") === "add") {
      setShowAddModal(true);
    }
  }, [searchParams]);

  const fetchCategories = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/categories`);
      const result = await response.json();
      // Handle both paginated and non-paginated responses
      const data = result.data || result;
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories:", error);
    }
  };

  const fetchArtists = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/performers?limit=100`);
      const result = await response.json();
      // Handle paginated response - data is in result.data
      const data = result.data || result;
      setArtists(data);
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = artists.filter((artist) =>
    artist.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this artist?")) return;

    try {
      const response = await fetch(
        `${API_BASE_URL}/admin/performers/${id}`,
        {
          method: "DELETE",
        },
      );

      if (response.ok) {
        setArtists(artists.filter((a) => a.id !== id));
      } else {
        alert("Failed to delete artist");
      }
    } catch (error) {
      console.error("Failed to delete artist:", error);
      alert("Failed to delete artist");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      // Add text fields
      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", JSON.stringify(formData.category));
      if (formData.youtube_url)
        formDataToSend.append("youtube_url", formData.youtube_url);

      // Add arrays as JSON strings
      const genres = formData.genres
        .split(",")
        .map((g) => g.trim())
        .filter(Boolean);
      formDataToSend.append("genres", JSON.stringify(genres));

      const videos = formData.videos
        .split(",")
        .map((v) => v.trim())
        .filter(Boolean);
      formDataToSend.append("videos", JSON.stringify(videos));

      const songs = formData.popular_songs
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);
      formDataToSend.append("popular_songs", JSON.stringify(songs));

      // Add images
      if (profileImage) formDataToSend.append("image", profileImage);
      if (headerImage) formDataToSend.append("header_image", headerImage);
      galleryImages.forEach((img) =>
        formDataToSend.append("gallery_images", img),
      );

      const url = showEditModal
        ? `${API_BASE_URL}/admin/performers/${selectedArtist.id}`
        : `${API_BASE_URL}/admin/performers`;

      const method = showEditModal ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        body: formDataToSend,
      });

      if (response.ok) {
        await fetchArtists();
        resetForm();
        setShowAddModal(false);
        setShowEditModal(false);
      } else {
        const errorData = await response.json().catch(() => ({ detail: "Unknown error" }));
        console.error("Server error response:", response.status, errorData);
        alert(`Failed to save artist: ${errorData.detail || "Server error"}`);
      }
    } catch (error) {
      console.error("Network or Fetch error:", error);
      alert("Failed to save artist. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      category: [],
      instagram_url: "",
      youtube_url: "",
      genres: "",
      videos: "",
      popular_songs: "",
    });
    setProfileImage(null);
    setHeaderImage(null);
    setGalleryImages([]);
    setSelectedArtist(null);
  };

  const handleEdit = (artist: any) => {
    setSelectedArtist(artist);
    setFormData({
      name: artist.name || "",
      description: artist.description || "",
      category: Array.isArray(artist.category) ? artist.category : (artist.category ? [artist.category] : []),
      instagram_url: artist.instagram_url || "",
      youtube_url: artist.youtube_url || "",
      genres: artist.genres?.join(", ") || "",
      videos: artist.videos?.join(", ") || "",
      popular_songs: artist.popular_songs?.join(", ") || "",
    });
    setShowEditModal(true);
  };

  return (
    <div className="min-h-screen bg-[#0a0a0b]">
      {/* Header */}
      <header className="bg-[#1a1a1a] border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4">
            <Link href="/admin" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-white">Manage Artists</h1>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search artists..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-[#1a1a1a] border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
            />
          </div>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all"
          >
            <Plus className="w-5 h-5" />
            Add Artist
          </button>
        </div>

        {/* Artists Table */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-[#0f0f10]">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Artist
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Category
                    </th>

                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-800">
                  {filteredArtists.map((artist) => {
                    return (
                      <tr key={artist.id} className="hover:bg-[#2a2a2a]">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <img
                              src={
                                artist.profile_image_url || "/placeholder.png"
                              }
                              alt={artist.name}
                              className="w-10 h-10 rounded-full object-cover"
                            />
                            <div className="ml-4">
                              <div className="text-sm font-medium text-white">
                                {artist.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                ID: {artist.id.slice(0, 8)}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <div className="flex flex-wrap gap-1">
                            {(Array.isArray(artist.category) ? artist.category : [artist.category]).map((cat: string) => (
                              <span key={cat} className="px-2 py-0.5 bg-orange-500/10 text-orange-400 text-xs rounded-full border border-orange-500/20">
                                {cat}
                              </span>
                            ))}
                          </div>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs font-medium bg-green-500/20 text-green-400 rounded-full">
                            Active
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right">
                          <div className="flex justify-end gap-2">
                            <button
                              onClick={() => handleEdit(artist)}
                              className="p-2 text-gray-400 hover:text-orange-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDelete(artist.id)}
                              className="p-2 text-gray-400 hover:text-red-400 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filteredArtists.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No artists found</p>
              </div>
            )}
          </div>
        )}

        {/* Add/Edit Modal */}
        {(showAddModal || showEditModal) && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] flex flex-col">
              <div className="flex items-center justify-between p-6 border-b border-gray-800 shrink-0">
                <h2 className="text-xl font-bold text-white">
                  {showEditModal ? "Edit Artist" : "Add New Artist"}
                </h2>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="overflow-y-auto p-6 space-y-8 custom-scrollbar">
                <form id="artist-form" onSubmit={handleSubmit} className="space-y-8">

                  {/* Section: Basic Information */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Basic Information</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Name <span className="text-red-400">*</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={formData.name}
                          onChange={(e) =>
                            setFormData({ ...formData, name: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                          placeholder="Artist Name"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Categories <span className="text-red-400">*</span>
                        </label>
                        <div className="bg-[#0a0a0b] border border-gray-700 rounded-lg p-3 max-h-48 overflow-y-auto custom-scrollbar">
                          <div className="grid grid-cols-2 gap-2">
                            {categories.map((cat) => (
                              <label
                                key={cat.id}
                                className={`flex items-center gap-2 px-3 py-2 rounded-lg cursor-pointer transition-all ${formData.category.includes(cat.name)
                                  ? 'bg-orange-500/20 border border-orange-500/40'
                                  : 'bg-[#1a1a1b] border border-gray-800 hover:border-gray-600'
                                  }`}
                              >
                                <input
                                  type="checkbox"
                                  checked={formData.category.includes(cat.name)}
                                  onChange={(e) => {
                                    if (e.target.checked) {
                                      setFormData({ ...formData, category: [...formData.category, cat.name] });
                                    } else {
                                      setFormData({ ...formData, category: formData.category.filter((c) => c !== cat.name) });
                                    }
                                  }}
                                  className="w-4 h-4 rounded border-gray-600 text-orange-500 focus:ring-orange-500 bg-[#0a0a0b]"
                                />
                                <span className="text-sm text-white">{cat.name}</span>
                              </label>
                            ))}
                          </div>
                        </div>
                        {formData.category.length === 0 && (
                          <p className="text-xs text-red-400 mt-1">Select at least one category</p>
                        )}
                      </div>

                      {/* Price and Locations removed as per requirements */}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">
                        Description
                      </label>
                      <textarea
                        rows={3}
                        value={formData.description}
                        onChange={(e) =>
                          setFormData({ ...formData, description: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                        placeholder="Bio or details about the artist..."
                      />
                    </div>
                  </div>

                  {/* Section: Socials & Media */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Socials & Media</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Instagram URL
                        </label>
                        <input
                          type="url"
                          value={formData.instagram_url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              instagram_url: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                          placeholder="https://instagram.com/..."
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          YouTube Channel URL
                        </label>
                        <input
                          type="url"
                          value={formData.youtube_url}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              youtube_url: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                          placeholder="https://youtube.com/..."
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-1.5">
                        YouTube Video URLs (comma-separated)
                      </label>
                      <input
                        type="text"
                        placeholder="https://youtube.com/watch?v=..., ..."
                        value={formData.videos}
                        onChange={(e) =>
                          setFormData({ ...formData, videos: e.target.value })
                        }
                        className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                      />
                    </div>
                  </div>

                  {/* Section: Tags */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Tags</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Genres (comma-separated)
                        </label>
                        <input
                          type="text"
                          placeholder="Pop, Rock, Jazz"
                          value={formData.genres}
                          onChange={(e) =>
                            setFormData({ ...formData, genres: e.target.value })
                          }
                          className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Popular Songs (comma-separated)
                        </label>
                        <input
                          type="text"
                          placeholder="Song 1, Song 2"
                          value={formData.popular_songs}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              popular_songs: e.target.value,
                            })
                          }
                          className="w-full px-4 py-2 bg-[#0a0a0b] border border-gray-700 rounded-lg text-white focus:ring-2 focus:ring-orange-500"
                        />
                      </div>
                    </div>
                  </div>


                  {/* Section: Images */}
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-white border-b border-gray-800 pb-2">Images</h3>
                    <div className="grid md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Profile Image{" "}
                          {!showEditModal && (
                            <span className="text-red-400">*</span>
                          )}
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-[#0a0a0b] hover:bg-gray-800 hover:border-orange-500 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-500 group-hover:text-orange-500" />
                              <p className="text-xs text-gray-500 group-hover:text-gray-400">{profileImage ? profileImage.name : "Upload Profile"}</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              required={!showEditModal}
                              className="hidden"
                              onChange={(e) => setProfileImage(e.target.files?.[0] || null)}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Header Image
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-[#0a0a0b] hover:bg-gray-800 hover:border-orange-500 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-500 group-hover:text-orange-500" />
                              <p className="text-xs text-gray-500 group-hover:text-gray-400">{headerImage ? headerImage.name : "Upload Header"}</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              className="hidden"
                              onChange={(e) => setHeaderImage(e.target.files?.[0] || null)}
                            />
                          </label>
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Gallery Images
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-[#0a0a0b] hover:bg-gray-800 hover:border-orange-500 transition-all group">
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-500 group-hover:text-orange-500" />
                              <p className="text-xs text-gray-500 group-hover:text-gray-400">{galleryImages.length > 0 ? `${galleryImages.length} files` : "Upload Gallery"}</p>
                            </div>
                            <input
                              type="file"
                              accept="image/*"
                              multiple
                              className="hidden"
                              onChange={(e) => setGalleryImages(Array.from(e.target.files || []))}
                            />
                          </label>
                        </div>
                      </div>
                    </div>
                  </div>
                </form>
              </div>

              <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-800 shrink-0">
                <button
                  type="button"
                  onClick={() => {
                    setShowAddModal(false);
                    setShowEditModal(false);
                    resetForm();
                  }}
                  className="px-6 py-2.5 bg-gray-800 text-gray-300 font-medium rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  form="artist-form"
                  disabled={submitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50 flex items-center gap-2"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Saving...
                    </>
                  ) : showEditModal ? (
                    "Update Artist"
                  ) : (
                    "Add Artist"
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default function ManageArtistsPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-screen bg-[#0a0a0b]">
        <Loader2 className="w-8 h-8 animate-spin text-orange-500" />
      </div>
    }>
      <ManageArtistsContent />
    </Suspense>
  );
}
