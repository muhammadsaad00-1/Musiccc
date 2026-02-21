'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImageIcon, Plus, Edit2, Trash2, Save, X, EyeOff, Loader2, Upload } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface HeroImage {
    id: string;
    image_url: string;
    title?: string;
    subtitle?: string;
    display_order: number;
    is_active: boolean;
    created_at: string;
}

// Form Component (Moved outside to prevent focus loss)
function HeroImageForm({
    formData,
    setFormData,
    onSubmit,
    onCancel,
    isSubmitting,
    imageFile,
    setImageFile
}: {
    formData: Partial<HeroImage>;
    setFormData: (data: Partial<HeroImage>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
}) {
    const [preview, setPreview] = useState<string | null>(null);

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreview(URL.createObjectURL(file));
        }
    };

    return (
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-white mb-4">
                {formData.id ? 'Edit Hero Image Details' : 'Upload New Hero Image'}
            </h3>
            <div className="space-y-4">
                {/* Image Upload - Only for new images */}
                {!formData.id && (
                    <div>
                        <label className="text-sm text-gray-400 block mb-2">Hero Image*</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleFileSelect}
                            className="w-full bg-[#111] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:bg-orange-500/20 file:text-orange-400"
                        />
                        {preview && (
                            <div className="mt-3 relative aspect-[21/9] w-full rounded-lg overflow-hidden">
                                <Image src={preview} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>
                )}

                {/* Title */}
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Title (optional)</label>
                    <input
                        type="text"
                        value={formData.title || ''}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full bg-[#111] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                        placeholder="e.g., Featured Event"
                    />
                </div>

                {/* Subtitle */}
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Subtitle (optional)</label>
                    <input
                        type="text"
                        value={formData.subtitle || ''}
                        onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                        className="w-full bg-[#111] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                        placeholder="e.g., Corporate Excellence"
                    />
                </div>

                {/* Display Order */}
                <div>
                    <label className="text-sm text-gray-400 block mb-2">Display Order</label>
                    <input
                        type="number"
                        value={formData.display_order || 0}
                        onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                        className="w-full bg-[#111] text-white px-4 py-2 rounded-lg border border-gray-700 focus:border-orange-500 focus:outline-none"
                    />
                </div>

                {/* Active Status */}
                {formData.id && (
                    <div>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={formData.is_active ?? true}
                                onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                className="text-orange-500 focus:ring-orange-500 rounded"
                            />
                            <span className="text-white text-sm">Active</span>
                        </label>
                    </div>
                )}

                {/* Actions */}
                <div className="flex gap-3 pt-2">
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting || (!formData.id && !imageFile)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-2.5 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4" />
                                {formData.id ? 'Update' : 'Upload'}
                            </>
                        )}
                    </button>
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-2.5 border border-gray-700 text-gray-400 rounded-lg hover:border-gray-600 hover:text-white transition-colors disabled:opacity-50"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default function AdminHeroImagesPage() {
    const router = useRouter();
    const [images, setImages] = useState<HeroImage[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [formData, setFormData] = useState<Partial<HeroImage>>({
        display_order: 0,
        is_active: true
    });
    const [adminUsername, setAdminUsername] = useState("");


    useEffect(() => {
        const checkAuth = async () => {
      const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
      const accessToken = sessionStorage.getItem("adminAccessToken");

      if (isLoggedIn !== "true" || !accessToken) {
        router.push("/admin/login");
        return;
      }

      // Verify token with backend
      try {
        const response = await fetch(`${API_BASE_URL}/api/admin/verify`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            access_token: accessToken,
          }),
        });

        const data = await response.json();

        if (!data.success) {
          // Session invalid, redirect to login
          sessionStorage.clear();
          router.push("/admin/login");
          return;
        }

        setAdminUsername(sessionStorage.getItem("adminUsername") || "Admin");
      } catch (error) {
        console.error("Auth verification failed:", error);
        sessionStorage.clear();
        router.push("/admin/login");
        return;
      }
    };
    checkAuth();
        fetchImages();
    }, []);

    const fetchImages = async () => {
        try {
            setLoading(true);
            
            const token = sessionStorage.getItem("adminAccessToken");
            if (!token) {
                router.push('/admin/login');
                return;
            }

            const response = await fetch(`${API_BASE_URL}/api/hero-images`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.ok) {
                const data = await response.json();
                setImages(data);
            }
        } catch (error) {
            console.error('Error fetching hero images:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async () => {
        setIsSubmitting(true);
        try {
            const token = sessionStorage.getItem("adminAccessToken");
            const formBody = new FormData();
            
            if (formData.id) {
                // Update existing image (text fields only)
                formBody.append('title', formData.title || '');
                formBody.append('subtitle', formData.subtitle || '');
                formBody.append('display_order', String(formData.display_order || 0));
                formBody.append('is_active', String(formData.is_active ?? true));

                const response = await fetch(`${API_BASE_URL}/api/admin/hero-images/${formData.id}`, {
                    method: 'PUT',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formBody
                });

                const result = await response.json();
                if (result.success) {
                    alert(result.message);
                    setShowForm(false);
                    setFormData({ display_order: 0, is_active: true });
                    fetchImages();
                } else {
                    alert(result.message || 'Update failed');
                }
            } else {
                // Upload new image
                if (!imageFile) {
                    alert('Please select an image');
                    return;
                }

                formBody.append('image', imageFile);
                formBody.append('title', formData.title || '');
                formBody.append('subtitle', formData.subtitle || '');
                formBody.append('display_order', String(formData.display_order || 0));

                const response = await fetch(`${API_BASE_URL}/api/admin/hero-images`, {
                    method: 'POST',
                    headers: { 'Authorization': `Bearer ${token}` },
                    body: formBody
                });

                const result = await response.json();
                if (result.success) {
                    alert(result.message);
                    setShowForm(false);
                    setFormData({ display_order: 0, is_active: true });
                    setImageFile(null);
                    fetchImages();
                } else {
                    alert(result.message || 'Upload failed');
                }
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (image: HeroImage) => {
        setFormData(image);
        setShowForm(true);
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this hero image?')) return;

        try {
            const token = sessionStorage.getItem("adminAccessToken");
            const response = await fetch(`${API_BASE_URL}/api/admin/hero-images/${id}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });

            const result = await response.json();
            if (result.success) {
                alert(result.message);
                fetchImages();
            } else {
                alert(result.message || 'Delete failed');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred');
        }
    };

    const handleCancel = () => {
        setShowForm(false);
        setFormData({ display_order: 0, is_active: true });
        setImageFile(null);
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Hero Images Management</h1>
                        <p className="text-gray-400">Manage carousel images for the homepage hero section</p>
                    </div>
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-lg hover:opacity-90 transition-opacity"
                        >
                            <Plus className="w-5 h-5" />
                            Add Hero Image
                        </button>
                    )}
                </div>

                {/* Form */}
                {showForm && (
                    <div className="mb-8">
                        <HeroImageForm
                            formData={formData}
                            setFormData={setFormData}
                            onSubmit={handleSubmit}
                            onCancel={handleCancel}
                            isSubmitting={isSubmitting}
                            imageFile={imageFile}
                            setImageFile={setImageFile}
                        />
                    </div>
                )}

                {/* Images Grid */}
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
                    </div>
                ) : images.length === 0 ? (
                    <div className="text-center py-20">
                        <ImageIcon className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                        <p className="text-gray-400">No hero images yet</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {images.map((image) => (
                            <div
                                key={image.id}
                                className="bg-[#1a1a1a] border border-gray-800 rounded-xl overflow-hidden hover:border-orange-500/30 transition-all group"
                            >
                                {/* Image Preview */}
                                <div className="relative aspect-[21/9] bg-[#111]">
                                    <Image
                                        src={image.image_url}
                                        alt={image.title || 'Hero image'}
                                        fill
                                        className="object-cover"
                                    />
                                    {!image.is_active && (
                                        <div className="absolute top-2 right-2">
                                            <span className="px-2 py-1 bg-red-500/70 text-white text-xs rounded flex items-center gap-1">
                                                <EyeOff className="w-3 h-3" />
                                                Inactive
                                            </span>
                                        </div>
                                    )}
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <h3 className="text-white font-semibold mb-1">
                                        {image.title || 'Untitled'}
                                    </h3>
                                    {image.subtitle && (
                                        <p className="text-gray-400 text-sm mb-3">{image.subtitle}</p>
                                    )}
                                    <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                                        <span>Order: {image.display_order}</span>
                                        <span>{new Date(image.created_at).toLocaleDateString()}</span>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(image)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-blue-500/20 text-blue-400 px-4 py-2 rounded-lg hover:bg-blue-500/30 transition-colors text-sm"
                                        >
                                            <Edit2 className="w-3.5 h-3.5" />
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => handleDelete(image.id)}
                                            className="flex-1 flex items-center justify-center gap-2 bg-red-500/20 text-red-400 px-4 py-2 rounded-lg hover:bg-red-500/30 transition-colors text-sm"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
