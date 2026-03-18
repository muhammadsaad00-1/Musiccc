"use client";

import { useState, useEffect, Suspense, useRef, useCallback } from "react";
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
  GripVertical,
  Image as ImageIcon,
} from "lucide-react";
import { API_BASE_URL } from '@/lib/api';
import ImageCropper from '@/components/ui/ImageCropper';

function ManageArtistsContent() {
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [artists, setArtists] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedArtist, setSelectedArtist] = useState<any>(null);
  const [submitting, setSubmitting] = useState(false);
  const [reordering, setReordering] = useState(false);

  // Drag state
  const [dragIndex, setDragIndex] = useState<number | null>(null);
  const [dragOverIndex, setDragOverIndex] = useState<number | null>(null);

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

  // Image Cropper State
  const [cropperOpen, setCropperOpen] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string>('');
  const [cropType, setCropType] = useState<'profile' | 'header' | 'gallery'>('profile');
  const profileInputRef = useRef<HTMLInputElement>(null);
  const headerInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

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
      const data = result.data || result;
      // Sort by display_order client-side as well
      data.sort((a: any, b: any) => (a.display_order || 999) - (b.display_order || 999));
      setArtists(data);
    } catch (error) {
      console.error("Failed to fetch artists:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredArtists = searchQuery
    ? artists.filter((artist) =>
      artist.name.toLowerCase().includes(searchQuery.toLowerCase()),
    )
    : artists;

  // ─── Drag-and-Drop Handlers ───
  const handleDragStart = (e: React.DragEvent, index: number) => {
    setDragIndex(index);
    e.dataTransfer.effectAllowed = "move";
    // Make the drag image slightly transparent
    const row = e.currentTarget as HTMLElement;
    row.style.opacity = "0.5";
  };

  const handleDragEnd = (e: React.DragEvent) => {
    const row = e.currentTarget as HTMLElement;
    row.style.opacity = "1";
    setDragIndex(null);
    setDragOverIndex(null);
  };

  const handleDragOver = (e: React.DragEvent, index: number) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    if (dragOverIndex !== index) {
      setDragOverIndex(index);
    }
  };

  const handleDrop = async (e: React.DragEvent, dropIndex: number) => {
    e.preventDefault();
    if (dragIndex === null || dragIndex === dropIndex) {
      setDragIndex(null);
      setDragOverIndex(null);
      return;
    }

    // Reorder the local array
    const newArtists = [...artists];
    const [draggedItem] = newArtists.splice(dragIndex, 1);
    newArtists.splice(dropIndex, 0, draggedItem);

    // Assign sequential display_order values (1, 2, 3, ...)
    const orders = newArtists.map((artist, idx) => ({
      id: artist.id,
      display_order: idx + 1,
    }));

    // Update local state immediately for snappy UX
    const updatedArtists = newArtists.map((artist, idx) => ({
      ...artist,
      display_order: idx + 1,
    }));
    setArtists(updatedArtists);
    setDragIndex(null);
    setDragOverIndex(null);

    // Send to backend
    setReordering(true);
    try {
      const response = await fetch(`${API_BASE_URL}/admin/performers/reorder`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orders }),
      });
      const result = await response.json();
      if (!result.success) {
        alert(result.message || "Failed to save order");
        await fetchArtists(); // Revert on failure
      }
    } catch (error) {
      console.error("Failed to reorder:", error);
      alert("Failed to save order");
      await fetchArtists(); // Revert on failure
    } finally {
      setReordering(false);
    }
  };

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

    // Validate profile image for new artists
    if (!showEditModal && !profileImage) {
      alert('Please upload a profile image');
      return;
    }

    setSubmitting(true);

    try {
      const formDataToSend = new FormData();

      formDataToSend.append("name", formData.name);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("category", JSON.stringify(formData.category));
      if (formData.youtube_url)
        formDataToSend.append("youtube_url", formData.youtube_url);

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

  // ─── Image Cropper Handlers ───
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'profile' | 'header' | 'gallery') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setImageToCrop(reader.result as string);
      setCropType(type);
      setCropperOpen(true);
    };
    reader.readAsDataURL(file);

    // Reset the input value so the same file can be selected again
    e.target.value = '';
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    // Convert blob to File
    const fileName = `cropped-${Date.now()}.jpg`;
    const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });

    if (cropType === 'profile') {
      setProfileImage(croppedFile);
    } else if (cropType === 'header') {
      setHeaderImage(croppedFile);
    } else if (cropType === 'gallery') {
      setGalleryImages(prev => [...prev, croppedFile]);
    }

    setCropperOpen(false);
    setImageToCrop('');
  };

  const handleCropCancel = () => {
    setCropperOpen(false);
    setImageToCrop('');
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
            <div>
              <h1 className="text-2xl font-bold text-white">Manage Artists</h1>
              <p className="text-xs text-gray-500 mt-0.5">
                Drag rows to reorder • Changes save automatically
              </p>
            </div>
            {reordering && (
              <div className="flex items-center gap-2 ml-4 px-3 py-1 bg-orange-500/10 border border-orange-500/30 rounded-full">
                <Loader2 className="w-3.5 h-3.5 text-orange-400 animate-spin" />
                <span className="text-xs text-orange-400">Saving order...</span>
              </div>
            )}
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
                    <th className="px-2 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-10">

                    </th>
                    <th className="px-3 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                      #
                    </th>
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
                  {filteredArtists.map((artist, index) => {
                    const isDragOver = dragOverIndex === index;
                    const isDragging = dragIndex === index;
                    return (
                      <tr
                        key={artist.id}
                        draggable={!searchQuery}
                        onDragStart={(e) => handleDragStart(e, index)}
                        onDragEnd={handleDragEnd}
                        onDragOver={(e) => handleDragOver(e, index)}
                        onDrop={(e) => handleDrop(e, index)}
                        className={`transition-colors ${isDragging
                            ? "opacity-50 bg-orange-500/5"
                            : isDragOver
                              ? "bg-orange-500/10 border-t-2 border-t-orange-500"
                              : "hover:bg-[#2a2a2a]"
                          } ${!searchQuery ? "cursor-grab active:cursor-grabbing" : ""}`}
                      >
                        <td className="px-2 py-4 text-center">
                          {!searchQuery && (
                            <GripVertical className="w-4 h-4 text-gray-600 mx-auto" />
                          )}
                        </td>
                        <td className="px-3 py-4 text-center">
                          <span className="text-xs font-mono text-gray-500">
                            {artist.display_order || index + 1}
                          </span>
                        </td>
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
                          <div
                            onClick={() => profileInputRef.current?.click()}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-[#0a0a0b] hover:bg-gray-800 hover:border-orange-500 transition-all group relative overflow-hidden"
                          >
                            {profileImage ? (
                              <>
                                <img
                                  src={URL.createObjectURL(profileImage)}
                                  alt="Preview"
                                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                                />
                                <div className="relative z-10 flex flex-col items-center">
                                  <ImageIcon className="w-6 h-6 mb-1 text-green-400" />
                                  <p className="text-xs text-green-400 font-medium">Image Selected</p>
                                  <p className="text-xs text-gray-500 mt-1">Click to change</p>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-500 group-hover:text-orange-500" />
                                <p className="text-xs text-gray-500 group-hover:text-gray-400">Upload Profile</p>
                              </div>
                            )}
                          </div>
                          <input
                            ref={profileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageSelect(e, 'profile')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Header Image
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <div
                            onClick={() => headerInputRef.current?.click()}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-[#0a0a0b] hover:bg-gray-800 hover:border-orange-500 transition-all group relative overflow-hidden"
                          >
                            {headerImage ? (
                              <>
                                <img
                                  src={URL.createObjectURL(headerImage)}
                                  alt="Preview"
                                  className="absolute inset-0 w-full h-full object-cover opacity-50"
                                />
                                <div className="relative z-10 flex flex-col items-center">
                                  <ImageIcon className="w-6 h-6 mb-1 text-green-400" />
                                  <p className="text-xs text-green-400 font-medium">Image Selected</p>
                                  <p className="text-xs text-gray-500 mt-1">Click to change</p>
                                </div>
                              </>
                            ) : (
                              <div className="flex flex-col items-center justify-center pt-5 pb-6">
                                <Upload className="w-8 h-8 mb-2 text-gray-500 group-hover:text-orange-500" />
                                <p className="text-xs text-gray-500 group-hover:text-gray-400">Upload Header</p>
                              </div>
                            )}
                          </div>
                          <input
                            ref={headerInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageSelect(e, 'header')}
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">
                          Gallery Images
                        </label>
                        <div className="flex items-center justify-center w-full">
                          <div
                            onClick={() => galleryInputRef.current?.click()}
                            className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-700 border-dashed rounded-lg cursor-pointer bg-[#0a0a0b] hover:bg-gray-800 hover:border-orange-500 transition-all group"
                          >
                            <div className="flex flex-col items-center justify-center pt-5 pb-6">
                              <Upload className="w-8 h-8 mb-2 text-gray-500 group-hover:text-orange-500" />
                              <p className="text-xs text-gray-500 group-hover:text-gray-400">
                                {galleryImages.length > 0 ? `${galleryImages.length} file${galleryImages.length > 1 ? 's' : ''} selected` : "Upload Gallery"}
                              </p>
                              {galleryImages.length > 0 && (
                                <p className="text-xs text-green-400 mt-1">Click to add more</p>
                              )}
                            </div>
                          </div>
                          <input
                            ref={galleryInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => handleImageSelect(e, 'gallery')}
                          />
                        </div>
                        {galleryImages.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2">
                            {galleryImages.map((img, idx) => (
                              <div key={idx} className="relative group">
                                <img
                                  src={URL.createObjectURL(img)}
                                  alt={`Gallery ${idx + 1}`}
                                  className="w-16 h-16 object-cover rounded-lg border border-gray-700"
                                />
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setGalleryImages(galleryImages.filter((_, i) => i !== idx));
                                  }}
                                  className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                >
                                  <X className="w-3 h-3 text-white" />
                                </button>
                              </div>
                            ))}
                          </div>
                        )}
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

        {/* Image Cropper Modal */}
        {cropperOpen && (
          <ImageCropper
            image={imageToCrop}
            onCropComplete={handleCropComplete}
            onCancel={handleCropCancel}
            aspectRatio={cropType === 'profile' ? 1 : cropType === 'header' ? 16 / 9 : 4 / 3}
            cropShape={cropType === 'profile' ? 'round' : 'rect'}
          />
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
