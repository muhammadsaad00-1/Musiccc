"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Upload,
    Youtube,
    Trash2,
    Loader2,
    Plus,
    ImageIcon,
    Film,
    CheckCircle,
    XCircle,
    Play,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface PortfolioItem {
    id: string;
    media_url: string;
    title: string;
    description: string;
    item_type: "image" | "video";
    thumbnail_url: string | null;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

function extractYoutubeId(url: string): string | null {
    const match = url.match(
        /(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))([^&?\s]{11})/
    );
    return match ? match[1] : null;
}

export default function AdminPortfolioPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);

    const [images, setImages] = useState<PortfolioItem[]>([]);
    const [videos, setVideos] = useState<PortfolioItem[]>([]);
    const [loading, setLoading] = useState(true);

    // Image upload state
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imageTitle, setImageTitle] = useState("");
    const [uploadingImage, setUploadingImage] = useState(false);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Video add state
    const [videoUrl, setVideoUrl] = useState("");
    const [videoTitle, setVideoTitle] = useState("");
    const [addingVideo, setAddingVideo] = useState(false);

    // Video playback state
    const [playingVideoId, setPlayingVideoId] = useState<string | null>(null);

    const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    // Auth check
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
        const accessToken = sessionStorage.getItem("adminAccessToken");
        if (isLoggedIn !== "true" || !accessToken) {
            router.push("/admin/login");
        }
    }, [router]);

    const fetchPortfolio = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/portfolio`);
            if (res.ok) {
                const result = await res.json();
                // Handle both paginated and non-paginated responses
                const data: PortfolioItem[] = result.data || result;
                setImages(data.filter((item) => item.item_type === "image"));
                setVideos(data.filter((item) => item.item_type === "video"));
            }
        } catch (e) {
            console.error("Failed to fetch portfolio:", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPortfolio();
    }, []);

    const showFeedback = (type: "success" | "error", msg: string) => {
        setFeedback({ type, msg });
        setTimeout(() => setFeedback(null), 4000);
    };

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setImageFile(file);
        setImagePreview(URL.createObjectURL(file));
        if (!imageTitle) setImageTitle(file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "));
    };

    const handleUploadImage = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || !imageTitle.trim()) return;
        setUploadingImage(true);
        try {
            const form = new FormData();
            form.append("image", imageFile);
            form.append("title", imageTitle.trim());
            form.append("description", "");
            form.append("display_order", "0");
            const res = await fetch(`${API_BASE_URL}/api/admin/portfolio/upload-image`, { method: "POST", body: form });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Upload failed");
            showFeedback("success", "Image uploaded successfully!");
            setImageFile(null);
            setImageTitle("");
            setImagePreview(null);
            if (fileInputRef.current) fileInputRef.current.value = "";
            fetchPortfolio();
        } catch (err: any) {
            showFeedback("error", err.message || "Failed to upload image. Please try again.");
        } finally {
            setUploadingImage(false);
        }
    };

    const handleAddVideo = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!videoUrl.trim()) return;
        const videoId = extractYoutubeId(videoUrl);
        if (!videoId) {
            showFeedback("error", "Please enter a valid YouTube URL.");
            return;
        }
        setAddingVideo(true);
        try {
            const form = new FormData();
            form.append("video_url", videoUrl.trim());
            form.append("title", videoTitle.trim() || "Untitled Video");
            form.append("description", "");
            form.append("thumbnail_url", `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`);
            form.append("display_order", "0");
            const res = await fetch(`${API_BASE_URL}/api/admin/portfolio/upload-video`, { method: "POST", body: form });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Failed to add video");
            showFeedback("success", "Video added to portfolio!");
            setVideoUrl("");
            setVideoTitle("");
            fetchPortfolio();
        } catch (err: any) {
            showFeedback("error", err.message || "Failed to add video. Please try again.");
        } finally {
            setAddingVideo(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Remove this item from the portfolio?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/portfolio/${id}`, { method: "DELETE" });
            const data = await res.json();
            if (!res.ok || !data.success) throw new Error(data.message || "Delete failed");
            showFeedback("success", "Item removed from portfolio.");
            fetchPortfolio();
        } catch (err: any) {
            showFeedback("error", err.message || "Failed to delete item.");
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="p-2 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-2xl font-bold text-white">Portfolio Manager</h1>
                            <p className="text-sm text-gray-500">Manage About Us images & videos</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                        <span>{images.length} images</span>
                        <span className="text-gray-700">·</span>
                        <span>{videos.length} videos</span>
                    </div>
                </div>
            </header>

            {/* Global Feedback Toast */}
            {feedback && (
                <div
                    className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${feedback.type === "success"
                            ? "bg-green-500/10 border-green-500/30 text-green-400"
                            : "bg-red-500/10 border-red-500/30 text-red-400"
                        }`}
                >
                    {feedback.type === "success" ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <XCircle className="w-5 h-5" />
                    )}
                    {feedback.msg}
                </div>
            )}

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
                {/* ── SECTION: Upload Image ── */}
                <section className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center">
                            <ImageIcon className="w-5 h-5 text-orange-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Upload Event Image</h2>
                    </div>
                    <form onSubmit={handleUploadImage} className="p-6">
                        <div className="grid md:grid-cols-2 gap-6 items-start">
                            {/* File Drop Zone */}
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="relative flex flex-col items-center justify-center min-h-[200px] border-2 border-dashed border-gray-700 rounded-xl cursor-pointer hover:border-orange-500/50 hover:bg-orange-500/5 transition-all group"
                            >
                                {imagePreview ? (
                                    <Image
                                        src={imagePreview}
                                        alt="Preview"
                                        fill
                                        className="object-cover rounded-xl"
                                    />
                                ) : (
                                    <>
                                        <Upload className="w-10 h-10 text-gray-600 group-hover:text-orange-400 transition-colors mb-3" />
                                        <p className="text-gray-500 text-sm group-hover:text-gray-400 transition-colors">
                                            Click to select image
                                        </p>
                                        <p className="text-gray-700 text-xs mt-1">JPG, PNG, WEBP up to 10MB</p>
                                    </>
                                )}
                                <input
                                    ref={fileInputRef}
                                    type="file"
                                    accept="image/*"
                                    className="hidden"
                                    onChange={handleImageSelect}
                                />
                            </div>

                            {/* Form Fields */}
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                        Image Title / Reference
                                    </label>
                                    <input
                                        type="text"
                                        value={imageTitle}
                                        onChange={(e) => setImageTitle(e.target.value)}
                                        placeholder="e.g. Wedding at PC Lahore, Corporate Event 2024"
                                        className="w-full px-4 py-3 bg-[#0f0f10] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                                    />
                                    <p className="text-xs text-gray-600 mt-1.5">
                                        This label will appear as a caption on the portfolio image.
                                    </p>
                                </div>

                                {imageFile && (
                                    <div className="p-3 bg-[#0f0f10] rounded-lg border border-gray-800 text-sm">
                                        <p className="text-gray-400">
                                            Selected: <span className="text-white font-medium">{imageFile.name}</span>
                                        </p>
                                        <p className="text-gray-600 text-xs mt-0.5">
                                            {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                                        </p>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    disabled={!imageFile || uploadingImage}
                                    className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                >
                                    {uploadingImage ? (
                                        <Loader2 className="w-5 h-5 animate-spin" />
                                    ) : (
                                        <Upload className="w-5 h-5" />
                                    )}
                                    {uploadingImage ? "Uploading..." : "Upload Image"}
                                </button>
                            </div>
                        </div>
                    </form>
                </section>

                {/* ── SECTION: Add YouTube Video ── */}
                <section className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                        <div className="w-9 h-9 bg-red-500/10 rounded-lg flex items-center justify-center">
                            <Youtube className="w-5 h-5 text-red-400" />
                        </div>
                        <h2 className="text-lg font-semibold text-white">Add YouTube Video</h2>
                    </div>
                    <form onSubmit={handleAddVideo} className="p-6">
                        <div className="grid md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    YouTube URL <span className="text-red-400">*</span>
                                </label>
                                <input
                                    type="url"
                                    value={videoUrl}
                                    onChange={(e) => setVideoUrl(e.target.value)}
                                    placeholder="https://youtube.com/watch?v=..."
                                    className="w-full px-4 py-3 bg-[#0f0f10] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                    Video Title / Label
                                </label>
                                <input
                                    type="text"
                                    value={videoTitle}
                                    onChange={(e) => setVideoTitle(e.target.value)}
                                    placeholder="e.g. Live Performance at Lahore Expo"
                                    className="w-full px-4 py-3 bg-[#0f0f10] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-red-500/50 transition-colors"
                                />
                            </div>
                        </div>
                        {videoUrl && extractYoutubeId(videoUrl) && (
                            <div className="mt-4 p-3 bg-[#0f0f10] rounded-lg border border-gray-800 flex items-center gap-3">
                                <img
                                    src={`https://img.youtube.com/vi/${extractYoutubeId(videoUrl)}/mqdefault.jpg`}
                                    alt="Thumbnail"
                                    className="w-24 h-14 object-cover rounded-lg"
                                />
                                <div>
                                    <p className="text-green-400 text-sm font-medium flex items-center gap-1.5">
                                        <CheckCircle className="w-4 h-4" /> Valid YouTube URL
                                    </p>
                                    <p className="text-gray-500 text-xs mt-0.5">
                                        ID: {extractYoutubeId(videoUrl)}
                                    </p>
                                </div>
                            </div>
                        )}
                        <button
                            type="submit"
                            disabled={!videoUrl.trim() || addingVideo}
                            className="mt-4 flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {addingVideo ? <Loader2 className="w-5 h-5 animate-spin" /> : <Plus className="w-5 h-5" />}
                            {addingVideo ? "Adding..." : "Add Video"}
                        </button>
                    </form>
                </section>

                {/* ── SECTION: Portfolio Images ── */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-orange-400" />
                        Portfolio Images ({images.length})
                    </h2>
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : images.length === 0 ? (
                        <div className="text-center py-12 bg-[#1a1a1a] rounded-2xl border border-gray-800 border-dashed">
                            <ImageIcon className="w-10 h-10 mx-auto text-gray-700 mb-3" />
                            <p className="text-gray-500">No images uploaded yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {images.map((img) => (
                                <div key={img.id} className="group relative bg-[#1a1a1a] rounded-xl overflow-hidden border border-gray-800 hover:border-orange-500/30 transition-all aspect-square">
                                    <Image src={img.media_url} alt={img.title || "Portfolio"} fill className="object-cover" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2 p-2">
                                        {img.title && (
                                            <p className="text-white text-xs text-center font-medium line-clamp-2">{img.title}</p>
                                        )}
                                        <button
                                            onClick={() => handleDelete(img.id)}
                                            className="flex items-center gap-1.5 px-3 py-1.5 bg-red-500/80 hover:bg-red-500 rounded-lg text-white text-xs font-medium transition-colors"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </section>

                {/* ── SECTION: Portfolio Videos ── */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <Film className="w-5 h-5 text-red-400" />
                        Portfolio Videos ({videos.length})
                    </h2>
                    {videos.length === 0 ? (
                        <div className="text-center py-12 bg-[#1a1a1a] rounded-2xl border border-gray-800 border-dashed">
                            <Youtube className="w-10 h-10 mx-auto text-gray-700 mb-3" />
                            <p className="text-gray-500">No videos added yet</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                            {videos.map((video) => {
                                const vidId = extractYoutubeId(video.media_url);
                                const isPlaying = playingVideoId === video.id;
                                return (
                                    <div key={video.id} className="group bg-[#1a1a1a] rounded-xl border border-gray-800 overflow-hidden hover:border-red-500/30 transition-all">
                                        {vidId && (
                                            <div className="relative aspect-video">
                                                {isPlaying ? (
                                                    <iframe
                                                        width="100%"
                                                        height="100%"
                                                        src={`https://www.youtube.com/embed/${vidId}?autoplay=1&modestbranding=1&rel=0`}
                                                        title={video.title}
                                                        frameBorder="0"
                                                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                        allowFullScreen
                                                        className="absolute inset-0 w-full h-full"
                                                    />
                                                ) : (
                                                    <div
                                                        className="absolute inset-0 cursor-pointer"
                                                        onClick={() => setPlayingVideoId(video.id)}
                                                    >
                                                        <img
                                                            src={video.thumbnail_url || `https://img.youtube.com/vi/${vidId}/hqdefault.jpg`}
                                                            alt={video.title}
                                                            className="w-full h-full object-cover"
                                                        />
                                                        <div className="absolute inset-0 bg-black/30 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                                                            <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center group-hover:scale-110 transition-transform shadow-2xl shadow-red-600/50">
                                                                <Play className="w-8 h-8 text-white ml-1" />
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>
                                        )}
                                        <div className="p-3 flex items-center justify-between gap-2">
                                            <div className="min-w-0">
                                                <p className="text-white text-sm font-medium truncate">{video.title || "Untitled"}</p>
                                                <a
                                                    href={video.media_url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-xs text-gray-600 hover:text-orange-400 transition-colors truncate block"
                                                >
                                                    {video.media_url}
                                                </a>
                                            </div>
                                            <button
                                                onClick={() => handleDelete(video.id)}
                                                className="flex-shrink-0 p-2 bg-red-500/10 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </section>
            </main>
        </div>
    );
}
