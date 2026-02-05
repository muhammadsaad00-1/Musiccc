'use client';

import { useState, useEffect } from 'react';
import { Package, Plus, Edit2, Trash2, X, Check, Loader2, Users, Calendar, DollarSign } from 'lucide-react';
import Image from 'next/image';

interface Performer {
    id: string;
    name: string;
    category: string;
    profile_image_url?: string;
}

interface PackageType {
    id: string;
    name: string;
    description: string;
    event_type: string;
    pricing: number;
    features: string[];
    duration: string;
    max_guests: number;
    header_image_url: string;
    is_active: boolean;
    created_at: string;
    performers: Performer[];
    performer_ids?: string[];
}

export default function AdminPackagesPage() {
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [performers, setPerformers] = useState<Performer[]>([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingPackage, setEditingPackage] = useState<PackageType | null>(null);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        event_type: '',
        pricing: '',
        features: [''],
        duration: '',
        max_guests: '',
        is_active: true,
        performer_ids: [] as string[],
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string>('');
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        fetchPackages();
        fetchPerformers();
    }, []);

    const fetchPackages = async () => {
        try {
            const response = await fetch('http://localhost:8000/packages');
            if (response.ok) {
                const data = await response.json();
                setPackages(data);
            }
        } catch (error) {
            console.error('Failed to fetch packages:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPerformers = async () => {
        try {
            const response = await fetch('http://localhost:8000/performers');
            if (response.ok) {
                const data = await response.json();
                setPerformers(data);
            }
        } catch (error) {
            console.error('Failed to fetch performers:', error);
        }
    };

    const handleAddFeature = () => {
        setFormData({ ...formData, features: [...formData.features, ''] });
    };

    const handleFeatureChange = (index: number, value: string) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = value;
        setFormData({ ...formData, features: newFeatures });
    };

    const handleRemoveFeature = (index: number) => {
        const newFeatures = formData.features.filter((_, i) => i !== index);
        setFormData({ ...formData, features: newFeatures });
    };

    const handlePerformerToggle = (performerId: string) => {
        setFormData(prev => ({
            ...prev,
            performer_ids: prev.performer_ids.includes(performerId)
                ? prev.performer_ids.filter(id => id !== performerId)
                : [...prev.performer_ids, performerId]
        }));
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const openAddModal = () => {
        setEditingPackage(null);
        setFormData({
            name: '',
            description: '',
            event_type: '',
            pricing: '',
            features: [''],
            duration: '',
            max_guests: '',
            is_active: true,
            performer_ids: [],
        });
        setImageFile(null);
        setImagePreview('');
        setShowModal(true);
    };

    const openEditModal = (pkg: PackageType) => {
        setEditingPackage(pkg);
        setFormData({
            name: pkg.name,
            description: pkg.description || '',
            event_type: pkg.event_type,
            pricing: pkg.pricing.toString(),
            features: pkg.features.length > 0 ? pkg.features : [''],
            duration: pkg.duration || '',
            max_guests: pkg.max_guests?.toString() || '',
            is_active: pkg.is_active,
            performer_ids: pkg.performer_ids || [],
        });
        setImageFile(null);
        setImagePreview(pkg.header_image_url || '');
        setShowModal(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);

        try {
            const formDataToSend = new FormData();
            formDataToSend.append('name', formData.name);
            formDataToSend.append('description', formData.description);
            formDataToSend.append('event_type', formData.event_type);
            formDataToSend.append('pricing', formData.pricing);
            formDataToSend.append('features', JSON.stringify(formData.features.filter(f => f.trim())));
            formDataToSend.append('duration', formData.duration);
            formDataToSend.append('max_guests', formData.max_guests);
            formDataToSend.append('performer_ids', JSON.stringify(formData.performer_ids));

            if (editingPackage) {
                formDataToSend.append('is_active', formData.is_active.toString());
            }

            if (imageFile) {
                formDataToSend.append('image', imageFile);
            }

            const url = editingPackage
                ? `http://localhost:8000/admin/packages/${editingPackage.id}`
                : 'http://localhost:8000/admin/packages';

            const method = editingPackage ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method,
                body: formDataToSend,
            });

            if (response.ok) {
                await fetchPackages();
                setShowModal(false);
            }
        } catch (error) {
            console.error('Failed to save package:', error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this package?')) return;

        try {
            const response = await fetch(`http://localhost:8000/admin/packages/${id}`, {
                method: 'DELETE',
            });

            if (response.ok) {
                await fetchPackages();
            }
        } catch (error) {
            console.error('Failed to delete package:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-[#0a0a0b] flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-orange-500 animate-spin" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] p-8">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-2">Package Management</h1>
                        <p className="text-gray-400">Manage event packages and their performers</p>
                    </div>
                    <button
                        onClick={openAddModal}
                        className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Package
                    </button>
                </div>

                {/* Packages Table */}
                <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-[#0f0f10] border-b border-gray-800">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Package</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Event Type</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Pricing</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Performers</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Duration</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-300">Status</th>
                                    <th className="px-6 py-4 text-right text-sm font-semibold text-gray-300">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-800">
                                {packages.map((pkg) => (
                                    <tr key={pkg.id} className="hover:bg-[#0f0f10] transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-800">
                                                    {pkg.header_image_url ? (
                                                        <Image
                                                            src={pkg.header_image_url}
                                                            alt={pkg.name}
                                                            fill
                                                            className="object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center">
                                                            <Package className="w-6 h-6 text-gray-600" />
                                                        </div>
                                                    )}
                                                </div>
                                                <div>
                                                    <div className="font-medium text-white">{pkg.name}</div>
                                                    <div className="text-sm text-gray-400">{pkg.features.length} features</div>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-3 py-1 bg-orange-500/10 text-orange-400 text-sm rounded-full">
                                                {pkg.event_type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="text-white font-medium">PKR {pkg.pricing.toLocaleString()}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-1 text-gray-400">
                                                <Users className="w-4 h-4" />
                                                <span className="text-sm">{pkg.performers.length}</span>
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-gray-300">{pkg.duration || 'N/A'}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-3 py-1 text-sm rounded-full ${
                                                pkg.is_active
                                                    ? 'bg-green-500/10 text-green-400'
                                                    : 'bg-gray-500/10 text-gray-400'
                                            }`}>
                                                {pkg.is_active ? 'Active' : 'Inactive'}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center justify-end gap-2">
                                                <button
                                                    onClick={() => openEditModal(pkg)}
                                                    className="p-2 text-blue-400 hover:bg-blue-500/10 rounded-lg transition-colors"
                                                >
                                                    <Edit2 className="w-4 h-4" />
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(pkg.id)}
                                                    className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                                >
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {packages.length === 0 && (
                        <div className="text-center py-12">
                            <Package className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                            <p className="text-gray-400">No packages yet. Create your first package!</p>
                        </div>
                    )}
                </div>
            </div>

            {/* Add/Edit Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
                        <div className="sticky top-0 bg-[#1a1a1a] border-b border-gray-800 px-6 py-4 flex items-center justify-between">
                            <h2 className="text-xl font-bold text-white">
                                {editingPackage ? 'Edit Package' : 'Add New Package'}
                            </h2>
                            <button
                                onClick={() => setShowModal(false)}
                                className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-6">
                            {/* Basic Info */}
                            <div className="grid md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Package Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#0f0f10] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Event Type *
                                    </label>
                                    <input
                                        type="text"
                                        list="event-types"
                                        value={formData.event_type}
                                        onChange={(e) => setFormData({ ...formData, event_type: e.target.value })}
                                        placeholder="Enter or select event type"
                                        className="w-full px-4 py-2 bg-[#0f0f10] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                    <datalist id="event-types">
                                        <option value="Wedding" />
                                        <option value="Birthday" />
                                        <option value="Corporate" />
                                        <option value="Mehendi" />
                                        <option value="Concert" />
                                        <option value="Engagement" />
                                        <option value="Anniversary" />
                                    </datalist>
                                    <p className="mt-1 text-xs text-gray-500">
                                        Select from suggestions or type a custom event type
                                    </p>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Pricing (PKR) *
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.pricing}
                                        onChange={(e) => setFormData({ ...formData, pricing: e.target.value })}
                                        className="w-full px-4 py-2 bg-[#0f0f10] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Duration
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.duration}
                                        onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                                        placeholder="e.g., 4 hours"
                                        className="w-full px-4 py-2 bg-[#0f0f10] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Max Guests
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.max_guests}
                                        onChange={(e) => setFormData({ ...formData, max_guests: e.target.value })}
                                        placeholder="e.g., 200"
                                        className="w-full px-4 py-2 bg-[#0f0f10] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                    />
                                </div>

                                {editingPackage && (
                                    <div className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            id="is_active"
                                            checked={formData.is_active}
                                            onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                            className="w-4 h-4 text-orange-500 bg-[#0f0f10] border-gray-800 rounded focus:ring-orange-500"
                                        />
                                        <label htmlFor="is_active" className="text-sm font-medium text-gray-300">
                                            Package is active
                                        </label>
                                    </div>
                                )}
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={3}
                                    className="w-full px-4 py-2 bg-[#0f0f10] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                />
                            </div>

                            {/* Features */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Package Features
                                </label>
                                <div className="space-y-2">
                                    {formData.features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-2">
                                            <input
                                                type="text"
                                                value={feature}
                                                onChange={(e) => handleFeatureChange(index, e.target.value)}
                                                placeholder="Enter feature"
                                                className="flex-1 px-4 py-2 bg-[#0f0f10] border border-gray-800 rounded-lg text-white focus:outline-none focus:border-orange-500"
                                            />
                                            <button
                                                type="button"
                                                onClick={() => handleRemoveFeature(index)}
                                                className="p-2 text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                                            >
                                                <X className="w-5 h-5" />
                                            </button>
                                        </div>
                                    ))}
                                </div>
                                <button
                                    type="button"
                                    onClick={handleAddFeature}
                                    className="mt-2 text-sm text-orange-400 hover:text-orange-300"
                                >
                                    + Add Feature
                                </button>
                            </div>

                            {/* Header Image */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Header Image {!editingPackage && '*'}
                                </label>
                                <input
                                    type="file"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                    required={!editingPackage}
                                    className="w-full px-4 py-2 bg-[#0f0f10] border border-gray-800 rounded-lg text-white file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-orange-500 file:text-white hover:file:bg-orange-600"
                                />
                                {imagePreview && (
                                    <div className="mt-4 relative w-full h-48 rounded-lg overflow-hidden">
                                        <Image
                                            src={imagePreview}
                                            alt="Preview"
                                            fill
                                            className="object-cover"
                                        />
                                    </div>
                                )}
                            </div>

                            {/* Performers Selection */}
                            <div>
                                <label className="block text-sm font-medium text-gray-300 mb-2">
                                    Select Performers
                                </label>
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-64 overflow-y-auto p-4 bg-[#0f0f10] rounded-lg border border-gray-800">
                                    {performers.map((performer) => (
                                        <label
                                            key={performer.id}
                                            className="flex items-center gap-3 p-3 bg-[#1a1a1a] rounded-lg cursor-pointer hover:bg-[#252525] transition-colors"
                                        >
                                            <input
                                                type="checkbox"
                                                checked={formData.performer_ids.includes(performer.id)}
                                                onChange={() => handlePerformerToggle(performer.id)}
                                                className="w-4 h-4 text-orange-500 bg-[#0f0f10] border-gray-800 rounded focus:ring-orange-500"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <div className="text-white text-sm font-medium truncate">
                                                    {performer.name}
                                                </div>
                                                <div className="text-gray-500 text-xs truncate">
                                                    {performer.category}
                                                </div>
                                            </div>
                                        </label>
                                    ))}
                                </div>
                                <p className="mt-2 text-sm text-gray-500">
                                    {formData.performer_ids.length} performer(s) selected
                                </p>
                            </div>

                            {/* Submit Buttons */}
                            <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-800">
                                <button
                                    type="button"
                                    onClick={() => setShowModal(false)}
                                    className="px-6 py-2 text-gray-400 hover:text-white transition-colors"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={submitting}
                                    className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all disabled:opacity-50"
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="w-4 h-4 animate-spin" />
                                            Saving...
                                        </>
                                    ) : (
                                        <>
                                            <Check className="w-4 h-4" />
                                            {editingPackage ? 'Update Package' : 'Create Package'}
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
