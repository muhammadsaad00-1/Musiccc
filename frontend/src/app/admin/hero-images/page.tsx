'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { ImageIcon, Plus, Edit2, Trash2, Save, X, EyeOff, Loader2, Upload, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';
import ImageCropper from '@/components/ui/ImageCropper';

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
    setImageFile,
    onImageSelect
}: {
    formData: Partial<HeroImage>;
    setFormData: (data: Partial<HeroImage>) => void;
    onSubmit: () => void;
    onCancel: () => void;
    isSubmitting: boolean;
    imageFile: File | null;
    setImageFile: (file: File | null) => void;
    onImageSelect: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
    const imageInputRef = useRef<HTMLInputElement>(null);

    return (
        <div className="bg-[#1a1a1c] border border-gray-800 rounded-2xl p-6 md:p-8 shadow-2xl w-full">
            <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <ImageIcon className="w-5 h-5 text-orange-500" />
                    {formData.id ? 'Edit Hero Image' : 'Upload New Hero Image'}
                </h3>
                <button
                    onClick={onCancel}
                    className="text-gray-400 hover:text-white transition-colors p-2 bg-gray-800/50 hover:bg-gray-800 rounded-lg"
                >
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="space-y-6">
                {/* Image Upload/Preview */}
                <div>
                    <label className="text-sm font-medium text-gray-300 block mb-2">
                        Hero Image{!formData.id && '*'}
                        {formData.id && ' (click to replace)'}
                    </label>

                    {/* Show current image when editing preview */}
                    {formData.id && formData.image_url && !imageFile && (
                        <div className="mb-4 relative aspect-[21/9] w-full rounded-xl overflow-hidden border border-gray-700 shadow-inner group">
                            <Image src={formData.image_url} alt="Current" fill className="object-cover transition-transform group-hover:scale-105" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer" onClick={() => imageInputRef.current?.click()}>
                                <p className="text-white font-medium bg-black/60 px-4 py-2 rounded-lg backdrop-blur-sm">Click to replace image</p>
                            </div>
                        </div>
                    )}

                    {/* Upload button */}
                    <div
                        onClick={() => imageInputRef.current?.click()}
                        className="bg-[#111] border-2 border-dashed border-gray-700 rounded-xl p-8 flex flex-col items-center justify-center cursor-pointer hover:border-orange-500/50 hover:bg-white/[0.02] transition-all group relative overflow-hidden"
                    >
                        {imageFile ? (
                            <>
                                <img
                                    src={URL.createObjectURL(imageFile)}
                                    alt="Preview"
                                    className="absolute inset-0 w-full h-full object-cover opacity-30"
                                />
                                <div className="relative z-10 flex flex-col items-center p-4 bg-black/60 rounded-xl backdrop-blur-md border border-gray-700">
                                    <ImageIcon className="w-8 h-8 mb-2 text-green-400" />
                                    <p className="text-sm text-green-400 font-bold tracking-wide">New Image Selected</p>
                                    <p className="text-xs text-gray-400 mt-1">Click to change</p>
                                </div>
                            </>
                        ) : (!formData.id && (
                            <div className="flex flex-col items-center">
                                <div className="w-16 h-16 bg-gray-800/50 rounded-full flex items-center justify-center mb-4 group-hover:bg-orange-500/20 group-hover:text-orange-400 transition-colors">
                                    <Upload className="w-8 h-8 text-gray-500 group-hover:text-orange-400" />
                                </div>
                                <p className="text-sm font-medium text-gray-300 mb-1">Upload Hero Image</p>
                                <p className="text-xs text-gray-500">
                                    Recommended format: PNG or JPG (21:9 Aspect Ratio)
                                </p>
                            </div>
                        ))}
                    </div>
                    <input
                        ref={imageInputRef}
                        type="file"
                        accept="image/*"
                        onChange={onImageSelect}
                        className="hidden"
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Title */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Title (optional)</label>
                        <input
                            type="text"
                            value={formData.title || ''}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                            placeholder="e.g., Featured Event"
                        />
                    </div>

                    {/* Subtitle */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Subtitle (optional)</label>
                        <input
                            type="text"
                            value={formData.subtitle || ''}
                            onChange={(e) => setFormData({ ...formData, subtitle: e.target.value })}
                            className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                            placeholder="e.g., Corporate Excellence"
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                    {/* Display Order */}
                    <div>
                        <label className="text-sm font-medium text-gray-300 block mb-2">Display Order</label>
                        <input
                            type="number"
                            value={formData.display_order || 0}
                            onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 0 })}
                            className="w-full bg-[#111] text-white px-4 py-3 rounded-xl border border-gray-700 focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500 transition-colors"
                        />
                        <p className="text-xs text-gray-500 mt-2">Lower numbers appear first</p>
                    </div>

                    {/* Active Status */}
                    {formData.id && (
                        <div className="pt-6">
                            <label className="flex items-center gap-3 cursor-pointer p-3 rounded-xl border border-gray-700 bg-[#111] hover:border-gray-600 transition-colors">
                                <div className="relative">
                                    <input
                                        type="checkbox"
                                        checked={formData.is_active ?? true}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="sr-only"
                                    />
                                    <div className={`block w-10 h-6 rounded-full transition-colors ${formData.is_active !== false ? 'bg-orange-500' : 'bg-gray-600'}`}></div>
                                    <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${formData.is_active !== false ? 'transform translate-x-4' : ''}`}></div>
                                </div>
                                <span className="text-white font-medium">Image is {formData.is_active !== false ? 'Active' : 'Hidden'}</span>
                            </label>
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex gap-4 pt-4 mt-8 border-t border-gray-800">
                    <button
                        onClick={onCancel}
                        disabled={isSubmitting}
                        className="px-6 py-3 bg-transparent border border-gray-700 text-gray-300 rounded-xl hover:bg-gray-800 hover:text-white transition-colors disabled:opacity-50 font-medium"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onSubmit}
                        disabled={isSubmitting || (!formData.id && !imageFile)}
                        className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white px-6 py-3 rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none font-bold"
                    >
                        {isSubmitting ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                {formData.id ? 'Save Changes' : 'Upload Image'}
                            </>
                        )}
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

    // Image Cropper State
    const [cropperOpen, setCropperOpen] = useState(false);
    const [imageToCrop, setImageToCrop] = useState<string>('');


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
                const result = await response.json();
                // Handle both paginated and non-paginated responses
                const data = result.data || result;
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
                // Update existing image
                formBody.append('title', formData.title || '');
                formBody.append('subtitle', formData.subtitle || '');
                formBody.append('display_order', String(formData.display_order || 0));
                formBody.append('is_active', String(formData.is_active ?? true));

                // Add new image if selected
                if (imageFile) {
                    formBody.append('image', imageFile);
                }

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
                    setImageFile(null);
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

    const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = () => {
            setImageToCrop(reader.result as string);
            setCropperOpen(true);
        };
        reader.readAsDataURL(file);

        // Reset the input value so the same file can be selected again
        e.target.value = '';
    };

    const handleCropComplete = (croppedBlob: Blob) => {
        // Convert blob to File
        const fileName = `hero-image-${Date.now()}.jpg`;
        const croppedFile = new File([croppedBlob], fileName, { type: 'image/jpeg' });

        setImageFile(croppedFile);
        setCropperOpen(false);
        setImageToCrop('');
    };

    const handleCropCancel = () => {
        setCropperOpen(false);
        setImageToCrop('');
    };

    const handleEdit = (image: HeroImage) => {
        setFormData(image);
        setImageFile(null); // Reset image file when editing
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
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Header */}
            <header className="bg-[#1a1a1a] border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                    <div className="flex items-center gap-4">
                        <Link href="/admin" className="text-gray-400 hover:text-white">
                            <ArrowLeft className="w-5 h-5" />
                        </Link>
                        <h1 className="text-2xl font-bold text-white">Manage Hero Images</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Actions Bar */}
                <div className="flex justify-between items-center mb-6">
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                        >
                            <Plus className="w-5 h-5" />
                            Add Hero Image
                        </button>
                    )}
                </div>

                {/* Form Modal */}
                {showForm && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div
                            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
                            onClick={handleCancel}
                            aria-hidden="true"
                        />
                        <div className="relative z-10 w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-3xl hide-scrollbar shadow-2xl animate-fade-in-up">
                            <HeroImageForm
                                formData={formData}
                                setFormData={setFormData}
                                onSubmit={handleSubmit}
                                onCancel={handleCancel}
                                isSubmitting={isSubmitting}
                                imageFile={imageFile}
                                setImageFile={setImageFile}
                                onImageSelect={handleImageSelect}
                            />
                        </div>
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
            </main>

            {/* Image Cropper Modal */}
            {cropperOpen && (
                <ImageCropper
                    image={imageToCrop}
                    onCropComplete={handleCropComplete}
                    onCancel={handleCropCancel}
                    aspectRatio={21 / 9}
                    cropShape="rect"
                />
            )}
        </div>
    );
}
