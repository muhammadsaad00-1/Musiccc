'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { API_BASE_URL } from '@/lib/api';

interface ClientLogo {
    id: string;
    name: string;
    logo_url: string | null;
    display_order: number;
    is_active: boolean;
}

// Mock data shown while loading or if API has no data yet
const mockClients: ClientLogo[] = [
    { id: 'm1', name: 'Jazz', logo_url: null, display_order: 1, is_active: true },
    { id: 'm2', name: 'Telenor', logo_url: null, display_order: 2, is_active: true },
    { id: 'm3', name: 'Pepsi', logo_url: null, display_order: 3, is_active: true },
    { id: 'm4', name: 'Nestle', logo_url: null, display_order: 4, is_active: true },
    { id: 'm5', name: 'HBL', logo_url: null, display_order: 5, is_active: true },
    { id: 'm6', name: 'Unilever', logo_url: null, display_order: 6, is_active: true },
    { id: 'm7', name: 'Engro', logo_url: null, display_order: 7, is_active: true },
    { id: 'm8', name: 'Shell', logo_url: null, display_order: 8, is_active: true },
    { id: 'm9', name: 'PTCL', logo_url: null, display_order: 9, is_active: true },
    { id: 'm10', name: 'Packages', logo_url: null, display_order: 10, is_active: true },
    { id: 'm11', name: 'Servis', logo_url: null, display_order: 11, is_active: true },
    { id: 'm12', name: 'Mobilink', logo_url: null, display_order: 12, is_active: true },
];

export default function OurClients() {
    const [clients, setClients] = useState<ClientLogo[]>(mockClients);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClients = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/api/client-logos`);
                if (res.ok) {
                    const data: ClientLogo[] = await res.json();
                    // If backend returns data, use it; otherwise keep mock data
                    if (Array.isArray(data) && data.length > 0) {
                        setClients(data);
                    }
                }
            } catch {
                // Keep mock data on error
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    return (
        <section className="py-20 lg:py-28 bg-[#0f0f10] relative overflow-hidden">
            {/* Decorative blobs */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[440px] h-[440px] bg-orange-500/18 rounded-full blur-[120px]" />
                <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[440px] h-[440px] bg-pink-600/12 rounded-full blur-[120px]" />
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[500px] h-[200px] bg-orange-600/8 rounded-full blur-[100px]" />
            </div>

            <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-14">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30 tracking-wide">
                        🏆 Trusted By
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                        Our Clients
                    </h2>
                    <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
                        Pakistan&apos;s leading corporations and brands trust Artist Factory to power their events.
                    </p>
                </div>

                {/* Logos Grid — adapts to any number of clients */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4 md:gap-6">
                    {clients.map((client) => (
                        <div
                            key={client.id}
                            className="group flex items-center justify-center bg-[#1a1a1a] border border-gray-800/60 rounded-2xl px-4 py-6 hover:border-orange-500/40 hover:bg-[#1f1f1f] transition-all duration-300 cursor-default min-h-[80px]"
                        >
                            {client.logo_url ? (
                                <Image
                                    src={client.logo_url}
                                    alt={client.name}
                                    width={120}
                                    height={48}
                                    className="object-contain opacity-60 group-hover:opacity-100 transition-opacity duration-300 filter grayscale group-hover:grayscale-0 max-h-12 w-auto"
                                />
                            ) : (
                                <span className="text-gray-500 group-hover:text-orange-400 font-bold text-sm tracking-widest uppercase transition-colors duration-300 text-center leading-tight">
                                    {client.name}
                                </span>
                            )}
                        </div>
                    ))}
                </div>

                {!loading && clients.length === 0 && (
                    <p className="text-center text-gray-600 text-sm mt-10">No clients to display yet.</p>
                )}

                <p className="text-center text-gray-600 text-xs mt-10 tracking-widest uppercase">
                    and many more across Pakistan
                </p>
            </div>
        </section>
    );
}
