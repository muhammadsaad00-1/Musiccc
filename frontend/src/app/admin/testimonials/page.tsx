'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ArrowLeft, Edit2, Trash2, Loader2, X, Upload, Star, Quote, Eye, EyeOff, CheckCircle, XCircle } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface ArtistTestimonial {
    id: string;
    name: string;
    role: string;
    location: string;
    emoji: string;
    photo_url: string | null;
    rating: number;
    review: string;
    is_active: boolean;
}

const defaultEmojis = ['🎵', '🎤', '💃', '🎸', '🎧', '🎼', '🪕', '🎹', '🎻', '🎭', '🎙️', '🥁'];

const emptyForm = {
    name: '',
    role: '',
    location: '',
    review: '',
    rating: 5,
    emoji: '🎵',
    is_active: true,
    photo: null as File | null,
};

interface StarRatingInputProps {
    rating: number;
    onChange: (rating: number) => void;
}

const StarRatingInput = ({ rating, onChange }: StarRatingInputProps) => (
    <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((s) => (
            <button
                key={s}
                type="button"
                onClick={() => onChange(s)}
                className="p-0.5"
            >
                <Star className={`w-6 h-6 ${s <= rating ? 'fill-orange-400 text-orange-400' : 'text-gray-700'}`} />
            </button>
        ))}
    </div>
);

interface TestimonialFormProps {
    formData: typeof emptyForm;
    setFormData: React.Dispatch<React.SetStateAction<typeof emptyForm>>;
    previewUrl: string | null;
    fileInputRef: React.RefObject<HTMLInputElement | null>;
    handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onSubmit: (e: React.FormEvent) => Promise<void>;
    title: string;
    submitting: boolean;
    onClose: () => void;
}

const TestimonialForm = ({ 
    formData, 
    setFormData, 
    previewUrl, 
    fileInputRef, 
    handleFileChange, 
    onSubmit, 
    title, 
    submitting, 
    onClose 
}: TestimonialFormProps) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-lg my-4">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <Quote className="w-5 h-5 text-orange-400" />
                    {title}
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white"><X className="w-5 h-5" /></button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
                {/* Name + Role */}
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Artist Name *</label>
                        <input
                            type="text" required value={formData.name}
                            onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                            className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
                            placeholder="e.g. Ustad Ali"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-400 mb-1.5">Role / Category *</label>
                        <input
                            type="text" required value={formData.role}
                            onChange={(e) => setFormData((f) => ({ ...f, role: e.target.value }))}
                            className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
                            placeholder="e.g. Classical Vocalist"
                        />
                    </div>
                </div>

                {/* Location */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Location</label>
                    <input
                        type="text" value={formData.location}
                        onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                        className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
                        placeholder="e.g. Lahore"
                    />
                </div>

                {/* Review */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Testimonial Text *</label>
                    <textarea
                        required rows={4} value={formData.review}
                        onChange={(e) => setFormData((f) => ({ ...f, review: e.target.value }))}
                        className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500 resize-none"
                        placeholder="Write the artist's testimonial…"
                    />
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Rating</label>
                    <StarRatingInput rating={formData.rating} onChange={(r) => setFormData((f) => ({ ...f, rating: r }))} />
                </div>

                {/* Emoji fallback */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">Emoji (shown if no photo)</label>
                    <div className="flex flex-wrap gap-2">
                        {defaultEmojis.map((em) => (
                            <button
                                key={em} type="button"
                                onClick={() => setFormData((f) => ({ ...f, emoji: em }))}
                                className={`w-10 h-10 rounded-lg text-xl flex items-center justify-center transition-all ${formData.emoji === em ? 'bg-orange-500/20 ring-2 ring-orange-500' : 'bg-[#0f0f10] hover:bg-[#252525]'}`}
                            >
                                {em}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Photo upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Artist Photo <span className="text-gray-600">(optional)</span></label>
                    {previewUrl && (
                        <div className="mb-3 flex items-center gap-3">
                            <Image src={previewUrl} alt="Photo preview" width={56} height={56} className="w-14 h-14 rounded-full object-cover ring-2 ring-orange-500/30" />
                            <button type="button" onClick={() => { setFormData((f) => ({ ...f, photo: null })); }} className="text-xs text-red-400 hover:text-red-300">Remove</button>
                        </div>
                    )}
                    <button
                        type="button" onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-orange-500/50 hover:text-orange-400 transition-all flex items-center justify-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {formData.photo ? formData.photo.name : 'Upload photo (JPG / PNG / WebP)'}
                    </button>
                    <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />
                </div>

                {/* Active toggle */}
                <label className="flex items-center gap-3 cursor-pointer">
                    <div
                        onClick={() => setFormData((f) => ({ ...f, is_active: !f.is_active }))}
                        className={`w-11 h-6 rounded-full transition-colors ${formData.is_active ? 'bg-orange-500' : 'bg-gray-700'} relative`}
                    >
                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${formData.is_active ? 'translate-x-5' : ''}`} />
                    </div>
                    <span className="text-sm text-gray-300">{formData.is_active ? 'Visible on website' : 'Hidden from website'}</span>
                </label>

                <div className="flex gap-3 pt-2">
                    <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">Cancel</button>
                    <button
                        type="submit" disabled={submitting}
                        className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold hover:opacity-90 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                        {submitting ? 'Saving…' : 'Save'}
                    </button>
                </div>
            </form>
        </div>
    </div>
);

export default function ManageTestimonialsPage() {
    const router = useRouter();
    const [testimonials, setTestimonials] = useState<ArtistTestimonial[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selected, setSelected] = useState<ArtistTestimonial | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [toast, setToast] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

    // Auth check
    useEffect(() => {
        const isLoggedIn = sessionStorage.getItem("adminLoggedIn");
        const accessToken = sessionStorage.getItem("adminAccessToken");
        if (isLoggedIn !== "true" || !accessToken) {
            router.push("/admin/login");
        }
    }, [router]);

    const showToast = (type: 'success' | 'error', message: string) => {
        setToast({ type, message });
        setTimeout(() => setToast(null), 4000);
    };

    const fetchTestimonials = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/admin/artist-testimonials`);
            if (!res.ok) throw new Error('Failed to fetch');
            setTestimonials(await res.json());
        } catch (err) {
            setError('Failed to load testimonials');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchTestimonials(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFormData((f) => ({ ...f, photo: file }));
        if (file) setPreviewUrl(URL.createObjectURL(file));
    };

    const openAdd = () => {
        setFormData({ ...emptyForm });
        setPreviewUrl(null);
        setShowAddModal(true);
    };

    const openEdit = (t: ArtistTestimonial) => {
        setSelected(t);
        setFormData({ name: t.name, role: t.role, location: t.location, review: t.review, rating: t.rating, emoji: t.emoji, is_active: t.is_active, photo: null });
        setPreviewUrl(t.photo_url);
        setShowEditModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelected(null);
        setPreviewUrl(null);
    };

    const buildBody = () => {
        const body = new FormData();
        body.append('name', formData.name);
        body.append('role', formData.role);
        body.append('location', formData.location);
        body.append('review', formData.review);
        body.append('rating', String(formData.rating));
        body.append('emoji', formData.emoji);
        body.append('is_active', String(formData.is_active));
        if (formData.photo) body.append('photo', formData.photo);
        return body;
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim() || !formData.review.trim()) return;
        try {
            setSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/admin/artist-testimonials`, { method: 'POST', body: buildBody() });
            const data = await res.json();
            if (data.success) {
                await fetchTestimonials();
                closeModals();
                showToast('success', 'Testimonial created successfully!');
            } else {
                showToast('error', data.message || 'Failed to create testimonial');
            }
        } catch (err) {
            console.error(err);
            showToast('error', 'Error creating testimonial. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selected) return;
        try {
            setSubmitting(true);
            const res = await fetch(`${API_BASE_URL}/admin/artist-testimonials/${selected.id}`, { method: 'PUT', body: buildBody() });
            const data = await res.json();
            if (data.success) {
                await fetchTestimonials();
                closeModals();
                showToast('success', 'Testimonial updated successfully!');
            } else {
                showToast('error', data.message || 'Failed to update testimonial');
            }
        } catch (err) {
            console.error(err);
            showToast('error', 'Error updating testimonial. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this testimonial? This cannot be undone.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/artist-testimonials/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) {
                setTestimonials((t) => t.filter((x) => x.id !== id));
                showToast('success', 'Testimonial deleted successfully');
            } else {
                showToast('error', data.message || 'Failed to delete testimonial');
            }
        } catch (err) {
            console.error(err);
            showToast('error', 'Error deleting testimonial. Please try again.');
        }
    };

    const toggleActive = async (t: ArtistTestimonial) => {
        try {
            const body = new FormData();
            body.append('is_active', String(!t.is_active));
            const res = await fetch(`${API_BASE_URL}/admin/artist-testimonials/${t.id}`, { method: 'PUT', body });
            const data = await res.json();
            if (data.success) {
                setTestimonials((arr) => arr.map((x) => x.id === t.id ? { ...x, is_active: !x.is_active } : x));
                showToast('success', `Testimonial ${!t.is_active ? 'shown' : 'hidden'} successfully`);
            } else {
                showToast('error', data.message || 'Failed to update visibility');
            }
        } catch (err) {
            console.error(err);
            showToast('error', 'Error updating visibility. Please try again.');
        }
    };

    return (
        <div className="min-h-screen bg-[#0a0a0b] p-6">
            {/* Toast Notification */}
            {toast && (
                <div className={`fixed top-4 right-4 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
                    toast.type === 'success' 
                        ? 'bg-green-500/10 border-green-500/30 text-green-400' 
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                }`}>
                    {toast.type === 'success' ? (
                        <CheckCircle className="w-5 h-5" />
                    ) : (
                        <XCircle className="w-5 h-5" />
                    )}
                    {toast.message}
                </div>
            )}

            <div className="max-w-6xl mx-auto">
                {/* Back link */}
                <div className="mb-8">
                    <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors w-fit">
                        <ArrowLeft className="w-4 h-4" /> Back to Dashboard
                    </Link>
                </div>

                {/* Page header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-white mb-1 flex items-center gap-3">
                            <Quote className="w-8 h-8 text-orange-400" />
                            Artist Testimonials
                        </h1>
                        <p className="text-gray-400">Manage testimonials shown in the &quot;Artist Testimonials&quot; tab.</p>
                    </div>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-xl hover:opacity-90 transition-all"
                    >
                        <Plus className="w-4 h-4" /> Add Testimonial
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20"><Loader2 className="w-8 h-8 text-orange-400 animate-spin" /></div>
                ) : error ? (
                    <div className="text-center py-20 text-red-400">{error}</div>
                ) : testimonials.length === 0 ? (
                    <div className="text-center py-20">
                        <Quote className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No testimonials yet.</p>
                        <button onClick={openAdd} className="mt-4 text-orange-400 hover:text-orange-300 font-medium">+ Add first testimonial</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                        {testimonials.map((t) => (
                            <div key={t.id} className="relative bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 flex flex-col gap-3 hover:border-gray-700 transition-all">
                                {/* Active badge */}
                                <span className={`absolute top-4 right-4 px-2 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${t.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>
                                    {t.is_active ? 'Visible' : 'Hidden'}
                                </span>

                                {/* Stars */}
                                <div className="flex gap-0.5">
                                    {[1, 2, 3, 4, 5].map((s) => (
                                        <Star key={s} className={`w-3.5 h-3.5 ${s <= t.rating ? 'fill-orange-400 text-orange-400' : 'text-gray-700'}`} />
                                    ))}
                                </div>

                                {/* Review text */}
                                <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">{t.review}</p>

                                {/* Author */}
                                <div className="flex items-center gap-2.5 mt-auto pt-3 border-t border-gray-800/60">
                                    {t.photo_url ? (
                                        <Image src={t.photo_url} alt={t.name} width={36} height={36} className="w-9 h-9 rounded-full object-cover ring-2 ring-orange-500/20" />
                                    ) : (
                                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center text-base">
                                            {t.emoji || '🎵'}
                                        </div>
                                    )}
                                    <div>
                                        <p className="text-white font-semibold text-sm">{t.name}</p>
                                        <p className="text-gray-600 text-xs">{t.role} · {t.location}</p>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2 border-t border-gray-800/40">
                                    <button onClick={() => toggleActive(t)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-gray-500 hover:text-white hover:bg-[#252525] transition-all">
                                        {t.is_active ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                                        {t.is_active ? 'Hide' : 'Show'}
                                    </button>
                                    <button onClick={() => openEdit(t)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-gray-500 hover:text-blue-400 hover:bg-blue-400/10 transition-all">
                                        <Edit2 className="w-3 h-3" /> Edit
                                    </button>
                                    <button onClick={() => handleDelete(t.id)} className="flex-1 flex items-center justify-center gap-1 py-1.5 rounded-lg text-xs text-gray-500 hover:text-red-400 hover:bg-red-400/10 transition-all">
                                        <Trash2 className="w-3 h-3" /> Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Modals */}
            {showAddModal && (
                <TestimonialForm
                    formData={formData}
                    setFormData={setFormData}
                    previewUrl={previewUrl}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    onSubmit={handleAdd}
                    title="Add Artist Testimonial"
                    submitting={submitting}
                    onClose={closeModals}
                />
            )}
            {showEditModal && (
                <TestimonialForm
                    formData={formData}
                    setFormData={setFormData}
                    previewUrl={previewUrl}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    onSubmit={handleEdit}
                    title="Edit Artist Testimonial"
                    submitting={submitting}
                    onClose={closeModals}
                />
            )}
        </div>
    );
}
