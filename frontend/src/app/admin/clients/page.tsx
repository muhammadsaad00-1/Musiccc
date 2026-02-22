'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Plus, ArrowLeft, Edit2, Trash2, Loader2, X, Upload, Building2, Eye, EyeOff } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

interface ClientLogo {
    id: string;
    name: string;
    logo_url: string | null;
    display_order: number;
    is_active: boolean;
}

const emptyForm = {
    name: '',
    display_order: 0,
    is_active: true,
    image: null as File | null,
};

interface ClientFormProps {
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

const ClientForm = ({ formData, setFormData, previewUrl, fileInputRef, handleFileChange, onSubmit, title, submitting, onClose }: ClientFormProps) => (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-[#1a1a1a] border border-gray-800 rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-gray-800">
                <h2 className="text-white font-bold text-lg flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-orange-400" />
                    {title}
                </h2>
                <button onClick={onClose} className="text-gray-400 hover:text-white">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <form onSubmit={onSubmit} className="p-6 space-y-5">
                {/* Name */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Client / Brand Name *</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                        className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-2.5 text-white placeholder-gray-600 focus:outline-none focus:border-orange-500"
                        placeholder="e.g. Jazz, Telenor"
                    />
                </div>

                {/* Display order */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Display Order</label>
                    <input
                        type="number"
                        min={0}
                        value={formData.display_order}
                        onChange={(e) => setFormData((f) => ({ ...f, display_order: Number(e.target.value) }))}
                        className="w-full bg-[#0f0f10] border border-gray-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-orange-500"
                    />
                    <p className="text-xs text-gray-600 mt-1">Lower number = shown first</p>
                </div>

                {/* Logo upload */}
                <div>
                    <label className="block text-sm font-medium text-gray-400 mb-1.5">Logo Image</label>
                    {previewUrl && (
                        <div className="mb-3 p-3 bg-[#0f0f10] rounded-xl border border-gray-800 flex items-center justify-center">
                            <Image src={previewUrl} alt="Logo preview" width={160} height={60} className="max-h-14 object-contain" />
                        </div>
                    )}
                    <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full py-3 border-2 border-dashed border-gray-700 rounded-xl text-gray-400 hover:border-orange-500/50 hover:text-orange-400 transition-all flex items-center justify-center gap-2"
                    >
                        <Upload className="w-4 h-4" />
                        {formData.image ? formData.image.name : 'Upload logo (PNG / SVG / WebP)'}
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
                    <button type="button" onClick={onClose} className="flex-1 py-2.5 rounded-xl border border-gray-700 text-gray-400 hover:text-white transition-colors">
                        Cancel
                    </button>
                    <button
                        type="submit"
                        disabled={submitting}
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

export default function ManageClientsPage() {
    const [clients, setClients] = useState<ClientLogo[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedClient, setSelectedClient] = useState<ClientLogo | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({ ...emptyForm });
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const res = await fetch(`${API_BASE_URL}/admin/client-logos`);
            if (!res.ok) throw new Error('Failed to fetch clients');
            setClients(await res.json());
        } catch (err) {
            setError('Failed to load clients');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchClients(); }, []);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setFormData((f) => ({ ...f, image: file }));
        if (file) setPreviewUrl(URL.createObjectURL(file));
    };

    const openAdd = () => {
        setFormData({ ...emptyForm });
        setPreviewUrl(null);
        setShowAddModal(true);
    };

    const openEdit = (client: ClientLogo) => {
        setSelectedClient(client);
        setFormData({ name: client.name, display_order: client.display_order, is_active: client.is_active, image: null });
        setPreviewUrl(client.logo_url);
        setShowEditModal(true);
    };

    const closeModals = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setSelectedClient(null);
        setPreviewUrl(null);
    };

    const handleAdd = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name.trim()) return;
        try {
            setSubmitting(true);
            const body = new FormData();
            body.append('name', formData.name);
            body.append('display_order', String(formData.display_order));
            body.append('is_active', String(formData.is_active));
            if (formData.image) body.append('logo', formData.image);

            const res = await fetch(`${API_BASE_URL}/admin/client-logos`, { method: 'POST', body });
            const data = await res.json();
            if (data.success) { await fetchClients(); closeModals(); }
            else alert(data.message || 'Failed to create client');
        } catch (err) {
            console.error(err);
            alert('Error creating client');
        } finally {
            setSubmitting(false);
        }
    };

    const handleEdit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!selectedClient) return;
        try {
            setSubmitting(true);
            const body = new FormData();
            if (formData.name) body.append('name', formData.name);
            body.append('display_order', String(formData.display_order));
            body.append('is_active', String(formData.is_active));
            if (formData.image) body.append('logo', formData.image);

            const res = await fetch(`${API_BASE_URL}/admin/client-logos/${selectedClient.id}`, { method: 'PUT', body });
            const data = await res.json();
            if (data.success) { await fetchClients(); closeModals(); }
            else alert(data.message || 'Failed to update client');
        } catch (err) {
            console.error(err);
            alert('Error updating client');
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm('Delete this client? This cannot be undone.')) return;
        try {
            const res = await fetch(`${API_BASE_URL}/admin/client-logos/${id}`, { method: 'DELETE' });
            const data = await res.json();
            if (data.success) setClients((c) => c.filter((x) => x.id !== id));
            else alert('Failed to delete client');
        } catch (err) {
            console.error(err);
            alert('Error deleting client');
        }
    };

    const toggleActive = async (client: ClientLogo) => {
        try {
            const body = new FormData();
            body.append('is_active', String(!client.is_active));
            const res = await fetch(`${API_BASE_URL}/admin/client-logos/${client.id}`, { method: 'PUT', body });
            const data = await res.json();
            if (data.success) setClients((c) => c.map((x) => x.id === client.id ? { ...x, is_active: !x.is_active } : x));
        } catch (err) {
            console.error(err);
        }
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
                        <h1 className="text-2xl font-bold text-white">Manage Client Logos</h1>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="flex items-center justify-between mb-6">
                    <p className="text-gray-400">Manage client logos shown in the &quot;Our Clients&quot; section</p>
                    <button
                        onClick={openAdd}
                        className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-lg hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        <Plus className="w-5 h-5" />
                        Add Client
                    </button>
                </div>

                {/* Content */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Loader2 className="w-8 h-8 text-orange-400 animate-spin" />
                    </div>
                ) : error ? (
                    <div className="text-center py-20 text-red-400">{error}</div>
                ) : clients.length === 0 ? (
                    <div className="text-center py-20">
                        <Building2 className="w-12 h-12 text-gray-700 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No clients yet.</p>
                        <button onClick={openAdd} className="mt-4 text-orange-400 hover:text-orange-300 font-medium">
                            + Add your first client
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                        {clients.map((client) => (
                            <div key={client.id} className="bg-[#1a1a1a] border border-gray-800 rounded-2xl p-5 flex flex-col gap-4 hover:border-gray-700 transition-all">
                                {/* Logo preview */}
                                <div className="h-20 bg-[#0f0f10] rounded-xl flex items-center justify-center border border-gray-800/50">
                                    {client.logo_url ? (
                                        <Image src={client.logo_url} alt={client.name} width={140} height={56} className="max-h-14 object-contain" />
                                    ) : (
                                        <span className="text-gray-600 font-bold tracking-widest uppercase text-sm">{client.name}</span>
                                    )}
                                </div>

                                {/* Info */}
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-white font-semibold">{client.name}</p>
                                        <p className="text-gray-600 text-xs mt-0.5">Order: {client.display_order}</p>
                                    </div>
                                    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${client.is_active ? 'bg-green-500/10 text-green-400' : 'bg-gray-700/50 text-gray-500'}`}>
                                        {client.is_active ? 'Visible' : 'Hidden'}
                                    </span>
                                </div>

                                {/* Actions */}
                                <div className="flex gap-2 pt-2 border-t border-gray-800/60">
                                    <button
                                        onClick={() => toggleActive(client)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-gray-400 hover:text-white hover:bg-[#252525] transition-all"
                                        title={client.is_active ? 'Hide from website' : 'Show on website'}
                                    >
                                        {client.is_active ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                                        {client.is_active ? 'Hide' : 'Show'}
                                    </button>
                                    <button
                                        onClick={() => openEdit(client)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-gray-400 hover:text-blue-400 hover:bg-blue-400/10 transition-all"
                                    >
                                        <Edit2 className="w-3.5 h-3.5" />
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(client.id)}
                                        className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-xs text-gray-400 hover:text-red-400 hover:bg-red-400/10 transition-all"
                                    >
                                        <Trash2 className="w-3.5 h-3.5" />
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Modals */}
                {showAddModal && (
                <ClientForm
                    formData={formData}
                    setFormData={setFormData}
                    previewUrl={previewUrl}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    onSubmit={handleAdd}
                    title="Add Corporate Client"
                    submitting={submitting}
                    onClose={closeModals}
                />
            )}
            {showEditModal && (
                <ClientForm
                    formData={formData}
                    setFormData={setFormData}
                    previewUrl={previewUrl}
                    fileInputRef={fileInputRef}
                    handleFileChange={handleFileChange}
                    onSubmit={handleEdit}
                    title="Edit Corporate Client"
                    submitting={submitting}
                    onClose={closeModals}
                />
            )}
        </main>
        </div>
    );
}
