"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
    ArrowLeft,
    Upload,
    Trash2,
    Loader2,
    Plus,
    ImageIcon,
    Eye,
    EyeOff,
    Pencil,
    Check,
    X,
    Replace,
} from "lucide-react";
import { API_BASE_URL } from "@/lib/api";

interface EventBanner {
    id: string;
    title: string;
    bg_image_url: string;
    whatsapp_message: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
}

export default function AdminEventBannersPage() {
    const router = useRouter();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const replaceImageRef = useRef<HTMLInputElement>(null);

    const [banners, setBanners] = useState<EventBanner[]>([]);
    const [loading, setLoading] = useState(true);

    // Form state (for new banner)
    const [showForm, setShowForm] = useState(false);
    const [title, setTitle] = useState("");
    const [whatsappMessage, setWhatsappMessage] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Edit state
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");
    const [editMessage, setEditMessage] = useState("");
    const [saving, setSaving] = useState(false);
    const [replacingImageId, setReplacingImageId] = useState<string | null>(null);

    const [feedback, setFeedback] = useState<{ type: "success" | "error"; msg: string } | null>(null);

    // Auth check
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
        const accessToken = sessionStorage.getItem("adminAccessToken");
        if (isLoggedIn !== "true" || !accessToken) {
            router.push("/admin/login");
        }
    }, [router]);

    // Fetch banners
    useEffect(() => {
        fetchBanners();
    }, []);

    const fetchBanners = async () => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/event-banners`);
            const result = await res.json();
            if (result.success) {
                setBanners(result.data);
            }
        } catch (error) {
            console.error("Failed to fetch banners:", error);
        } finally {
            setLoading(false);
        }
    };

    // Handle image selection (for new banner)
    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onload = (ev) => setImagePreview(ev.target?.result as string);
            reader.readAsDataURL(file);
        }
    };

    // Create new banner
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!imageFile || !title.trim() || !whatsappMessage.trim()) return;

        setUploading(true);
        try {
            const formData = new FormData();
            formData.append("image", imageFile);
            formData.append("title", title);
            formData.append("whatsapp_message", whatsappMessage);
            formData.append("display_order", String(banners.length));

            const res = await fetch(`${API_BASE_URL}/api/admin/event-banners`, {
                method: "POST",
                body: formData,
            });
            const result = await res.json();

            if (result.success) {
                setFeedback({ type: "success", msg: "Banner created successfully!" });
                setTitle("");
                setWhatsappMessage("");
                setImageFile(null);
                setImagePreview(null);
                setShowForm(false);
                fetchBanners();
            } else {
                setFeedback({ type: "error", msg: result.message || "Failed to create banner" });
            }
        } catch (error) {
            setFeedback({ type: "error", msg: "Network error. Please try again." });
        } finally {
            setUploading(false);
        }
    };

    // Start editing a banner
    const startEdit = (banner: EventBanner) => {
        setEditingId(banner.id);
        setEditTitle(banner.title);
        setEditMessage(banner.whatsapp_message);
    };

    // Cancel editing
    const cancelEdit = () => {
        setEditingId(null);
        setEditTitle("");
        setEditMessage("");
    };

    // Save edit
    const handleSaveEdit = async (bannerId: string) => {
        if (!editTitle.trim() || !editMessage.trim()) return;
        setSaving(true);
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/event-banners/${bannerId}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title: editTitle,
                    whatsapp_message: editMessage,
                }),
            });
            const result = await res.json();
            if (result.success) {
                setBanners((prev) =>
                    prev.map((b) =>
                        b.id === bannerId
                            ? { ...b, title: editTitle, whatsapp_message: editMessage }
                            : b
                    )
                );
                setFeedback({ type: "success", msg: "Banner updated!" });
                cancelEdit();
            } else {
                setFeedback({ type: "error", msg: result.message || "Update failed" });
            }
        } catch (error) {
            setFeedback({ type: "error", msg: "Network error" });
        } finally {
            setSaving(false);
        }
    };

    // Replace image
    const handleReplaceImage = async (bannerId: string, file: File) => {
        setReplacingImageId(bannerId);
        try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await fetch(
                `${API_BASE_URL}/api/admin/event-banners/${bannerId}/replace-image`,
                { method: "POST", body: formData }
            );
            const result = await res.json();
            if (result.success && result.data) {
                setBanners((prev) =>
                    prev.map((b) =>
                        b.id === bannerId ? { ...b, bg_image_url: result.data.bg_image_url } : b
                    )
                );
                setFeedback({ type: "success", msg: "Image replaced!" });
            } else {
                setFeedback({ type: "error", msg: result.message || "Image replace failed" });
            }
        } catch (error) {
            setFeedback({ type: "error", msg: "Network error" });
        } finally {
            setReplacingImageId(null);
        }
    };

    // Toggle active
    const handleToggle = async (banner: EventBanner) => {
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/event-banners/${banner.id}`, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ is_active: !banner.is_active }),
            });
            const result = await res.json();
            if (result.success) {
                setBanners((prev) =>
                    prev.map((b) => (b.id === banner.id ? { ...b, is_active: !b.is_active } : b))
                );
                setFeedback({
                    type: "success",
                    msg: `Banner ${!banner.is_active ? "activated" : "deactivated"}`,
                });
            }
        } catch (error) {
            setFeedback({ type: "error", msg: "Failed to update banner" });
        }
    };

    // Delete banner
    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this banner?")) return;
        try {
            const res = await fetch(`${API_BASE_URL}/api/admin/event-banners/${id}`, {
                method: "DELETE",
            });
            const result = await res.json();
            if (result.success) {
                setBanners((prev) => prev.filter((b) => b.id !== id));
                setFeedback({ type: "success", msg: "Banner deleted" });
            }
        } catch (error) {
            setFeedback({ type: "error", msg: "Failed to delete banner" });
        }
    };

    // Auto-clear feedback
    useEffect(() => {
        if (feedback) {
            const timer = setTimeout(() => setFeedback(null), 4000);
            return () => clearTimeout(timer);
        }
    }, [feedback]);

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-gray-800 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link
                            href="/admin"
                            className="p-2 bg-[#0f0f10] text-gray-400 rounded-lg hover:text-white transition-colors"
                        >
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <div>
                            <h1 className="text-xl font-bold text-white">Event Banners</h1>
                            <p className="text-sm text-gray-500">
                                Manage homepage event carousel cards
                            </p>
                        </div>
                    </div>
                    <Link
                        href="/"
                        className="text-orange-400 hover:text-orange-300 font-medium"
                    >
                        View Site →
                    </Link>
                </div>
            </header>

            {/* Feedback Toast */}
            {feedback && (
                <div
                    className={`fixed top-4 right-4 z-50 px-5 py-3 rounded-xl text-sm font-medium shadow-2xl border animate-slideIn ${
                        feedback.type === "success"
                            ? "bg-green-500/10 text-green-400 border-green-500/30"
                            : "bg-red-500/10 text-red-400 border-red-500/30"
                    }`}
                >
                    {feedback.msg}
                </div>
            )}

            {/* Hidden file input for replacing images */}
            <input
                ref={replaceImageRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                    const file = e.target.files?.[0];
                    const targetId = replaceImageRef.current?.dataset.bannerId;
                    if (file && targetId) {
                        handleReplaceImage(targetId, file);
                    }
                    e.target.value = "";
                }}
            />

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
                {/* Toggle Form Button */}
                <button
                    onClick={() => setShowForm(!showForm)}
                    className={`group flex items-center justify-center gap-3 w-full p-5 rounded-2xl transition-all duration-300 font-semibold text-lg border ${
                        showForm
                            ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white border-transparent shadow-[0_0_20px_rgba(249,115,22,0.3)] scale-[1.01]"
                            : "bg-orange-500/10 border-orange-500/30 text-orange-200 hover:bg-orange-500/20 hover:border-orange-500/60 hover:-translate-y-0.5 hover:text-white"
                    }`}
                >
                    <Plus className={`w-6 h-6 transition-transform duration-300 ${showForm ? "rotate-45" : "group-hover:scale-110"}`} />
                    <span>{showForm ? "Close Form" : "Add New Event Banner"}</span>
                </button>

                {/* Create Form */}
                {showForm && (
                    <section className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden animate-fadeIn">
                        <div className="px-6 py-4 border-b border-gray-800 flex items-center gap-3">
                            <div className="w-9 h-9 bg-orange-500/10 rounded-lg flex items-center justify-center">
                                <ImageIcon className="w-5 h-5 text-orange-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">
                                New Event Banner
                            </h2>
                        </div>
                        <form onSubmit={handleSubmit} className="p-6">
                            <div className="grid md:grid-cols-2 gap-6 items-start">
                                {/* Image Drop Zone */}
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
                                        <div className="flex flex-col items-center text-center p-6 gap-3">
                                            <div className="w-14 h-14 rounded-xl bg-orange-500/10 flex items-center justify-center">
                                                <Upload className="w-7 h-7 text-orange-400" />
                                            </div>
                                            <p className="text-gray-400 text-sm">
                                                Click to upload background image
                                            </p>
                                            <p className="text-gray-600 text-xs">
                                                Wide images (1200×400 or similar) work best
                                            </p>
                                        </div>
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
                                            Banner Title <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            placeholder="e.g. Hire Artists for College Events"
                                            className="w-full px-4 py-3 bg-[#0f0f10] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                                            required
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-400 mb-2">
                                            WhatsApp Booking Message <span className="text-red-400">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            value={whatsappMessage}
                                            onChange={(e) => setWhatsappMessage(e.target.value)}
                                            placeholder="e.g. a college or campus event"
                                            className="w-full px-4 py-3 bg-[#0f0f10] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:outline-none focus:border-orange-500/50 transition-colors"
                                            required
                                        />
                                        <p className="text-xs text-gray-600 mt-1.5">
                                            This completes: &quot;I want to book an artist for [your text]&quot;
                                        </p>
                                    </div>

                                    {imageFile && (
                                        <div className="p-3 bg-[#0f0f10] rounded-lg border border-gray-800 text-sm">
                                            <p className="text-gray-400">
                                                Selected:{" "}
                                                <span className="text-white font-medium">
                                                    {imageFile.name}
                                                </span>
                                            </p>
                                            <p className="text-gray-600 text-xs mt-0.5">
                                                {(imageFile.size / 1024 / 1024).toFixed(2)} MB
                                            </p>
                                        </div>
                                    )}

                                    <button
                                        type="submit"
                                        disabled={!imageFile || !title.trim() || !whatsappMessage.trim() || uploading}
                                        className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                                    >
                                        {uploading ? (
                                            <Loader2 className="w-5 h-5 animate-spin" />
                                        ) : (
                                            <Upload className="w-5 h-5" />
                                        )}
                                        {uploading ? "Creating..." : "Create Banner"}
                                    </button>
                                </div>
                            </div>
                        </form>
                    </section>
                )}

                {/* Banners List */}
                <section>
                    <h2 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                        <ImageIcon className="w-5 h-5 text-orange-400" />
                        All Event Banners ({banners.length})
                    </h2>

                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                        </div>
                    ) : banners.length === 0 ? (
                        <div className="text-center py-20 text-gray-500">
                            <ImageIcon className="w-12 h-12 mx-auto mb-4 opacity-40" />
                            <p className="text-lg">No event banners yet</p>
                            <p className="text-sm mt-1">
                                Click &quot;Add New Event Banner&quot; to get started
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {banners.map((banner) => {
                                const isEditing = editingId === banner.id;
                                const isReplacingImg = replacingImageId === banner.id;

                                return (
                                    <div
                                        key={banner.id}
                                        className={`relative rounded-2xl overflow-hidden border transition-all ${
                                            isEditing
                                                ? "border-orange-500/50 ring-1 ring-orange-500/20"
                                                : banner.is_active
                                                    ? "border-gray-700 hover:border-orange-500/30"
                                                    : "border-gray-800 opacity-60"
                                        }`}
                                    >
                                        {/* Banner Preview */}
                                        <div className="relative h-40 sm:h-48 w-full">
                                            <Image
                                                src={banner.bg_image_url}
                                                alt={banner.title}
                                                fill
                                                className="object-cover"
                                            />
                                            {/* Replacing overlay */}
                                            {isReplacingImg && (
                                                <div className="absolute inset-0 bg-black/70 z-30 flex items-center justify-center">
                                                    <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                                                </div>
                                            )}
                                            {/* Dark overlay for readability */}
                                            <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/60 to-black/30 z-10" />

                                            {/* Content overlay */}
                                            <div className="absolute inset-0 z-20 flex items-center justify-between px-5 sm:px-6 gap-4">
                                                <div className="flex-1 min-w-0">
                                                    {/* Status badges */}
                                                    <div className="flex items-center gap-2 mb-2">
                                                        {banner.is_active ? (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-green-500/20 text-green-400 rounded-full border border-green-500/30">
                                                                Active
                                                            </span>
                                                        ) : (
                                                            <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-gray-700 text-gray-400 rounded-full">
                                                                Inactive
                                                            </span>
                                                        )}
                                                        <span className="text-gray-500 text-xs">
                                                            Order: {banner.display_order}
                                                        </span>
                                                    </div>

                                                    {isEditing ? (
                                                        /* ── EDIT MODE ── */
                                                        <div className="space-y-2.5 max-w-lg">
                                                            <input
                                                                type="text"
                                                                value={editTitle}
                                                                onChange={(e) => setEditTitle(e.target.value)}
                                                                className="w-full px-3 py-2 bg-black/50 backdrop-blur-sm border border-orange-500/40 rounded-lg text-white text-sm font-semibold focus:outline-none focus:border-orange-500"
                                                                placeholder="Banner Title"
                                                                autoFocus
                                                            />
                                                            <div className="flex items-center gap-1.5">
                                                                <span className="text-gray-500 text-xs shrink-0">
                                                                    Book for:
                                                                </span>
                                                                <input
                                                                    type="text"
                                                                    value={editMessage}
                                                                    onChange={(e) => setEditMessage(e.target.value)}
                                                                    className="flex-1 px-3 py-1.5 bg-black/50 backdrop-blur-sm border border-orange-500/40 rounded-lg text-orange-300 text-xs focus:outline-none focus:border-orange-500"
                                                                    placeholder="WhatsApp message"
                                                                />
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        /* ── VIEW MODE ── */
                                                        <>
                                                            <h3 className="text-white text-lg sm:text-xl font-bold font-playfair italic leading-tight max-w-lg truncate">
                                                                {banner.title}
                                                            </h3>
                                                            <p className="text-gray-400 text-xs mt-1 max-w-md truncate">
                                                                WhatsApp: &quot;...book for{" "}
                                                                <span className="text-orange-300">
                                                                    {banner.whatsapp_message}
                                                                </span>
                                                                &quot;
                                                            </p>
                                                        </>
                                                    )}
                                                </div>

                                                {/* Action Buttons */}
                                                <div className="flex items-center gap-1.5 shrink-0">
                                                    {isEditing ? (
                                                        <>
                                                            {/* Save */}
                                                            <button
                                                                onClick={() => handleSaveEdit(banner.id)}
                                                                disabled={saving}
                                                                className="p-2.5 rounded-xl bg-green-500/20 text-green-400 hover:bg-green-500/30 transition-all disabled:opacity-50"
                                                                title="Save Changes"
                                                            >
                                                                {saving ? (
                                                                    <Loader2 className="w-5 h-5 animate-spin" />
                                                                ) : (
                                                                    <Check className="w-5 h-5" />
                                                                )}
                                                            </button>
                                                            {/* Cancel */}
                                                            <button
                                                                onClick={cancelEdit}
                                                                className="p-2.5 rounded-xl bg-gray-800 text-gray-400 hover:bg-gray-700 transition-all"
                                                                title="Cancel"
                                                            >
                                                                <X className="w-5 h-5" />
                                                            </button>
                                                        </>
                                                    ) : (
                                                        <>
                                                            {/* Edit */}
                                                            <button
                                                                onClick={() => startEdit(banner)}
                                                                className="p-2.5 rounded-xl bg-blue-500/15 text-blue-400 hover:bg-blue-500/25 transition-all"
                                                                title="Edit Banner"
                                                            >
                                                                <Pencil className="w-4 h-4" />
                                                            </button>
                                                            {/* Replace Image */}
                                                            <button
                                                                onClick={() => {
                                                                    if (replaceImageRef.current) {
                                                                        replaceImageRef.current.dataset.bannerId = banner.id;
                                                                        replaceImageRef.current.click();
                                                                    }
                                                                }}
                                                                className="p-2.5 rounded-xl bg-purple-500/15 text-purple-400 hover:bg-purple-500/25 transition-all"
                                                                title="Replace Image"
                                                            >
                                                                <Replace className="w-4 h-4" />
                                                            </button>
                                                            {/* Toggle */}
                                                            <button
                                                                onClick={() => handleToggle(banner)}
                                                                className={`p-2.5 rounded-xl transition-all ${
                                                                    banner.is_active
                                                                        ? "bg-green-500/20 text-green-400 hover:bg-green-500/30"
                                                                        : "bg-gray-800 text-gray-500 hover:bg-gray-700"
                                                                }`}
                                                                title={banner.is_active ? "Deactivate" : "Activate"}
                                                            >
                                                                {banner.is_active ? (
                                                                    <Eye className="w-4 h-4" />
                                                                ) : (
                                                                    <EyeOff className="w-4 h-4" />
                                                                )}
                                                            </button>
                                                            {/* Delete */}
                                                            <button
                                                                onClick={() => handleDelete(banner.id)}
                                                                className="p-2.5 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500/20 transition-all"
                                                                title="Delete Banner"
                                                            >
                                                                <Trash2 className="w-4 h-4" />
                                                            </button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
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
