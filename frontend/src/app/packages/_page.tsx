'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Package, Users, Clock, Check, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import { API_BASE_URL } from '@/lib/api';

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
    performers: any[];
}

export default function PackagesPage() {
    const [packages, setPackages] = useState<PackageType[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedEventType, setSelectedEventType] = useState<string>('all');

    useEffect(() => {
        const fetchPackages = async () => {
            setLoading(true);
            try {
                const url = selectedEventType === 'all'
                    ? `${API_BASE_URL}/packages?is_active=true`
                    : `${API_BASE_URL}/packages?event_type=${selectedEventType}&is_active=true`;

                const response = await fetch(url);
                if (response.ok) {
                    const backendPackages = await response.json();
                    setPackages(backendPackages);
                } else {
                    setPackages([]);
                }
            } catch (error) {
                console.error('Failed to fetch packages:', error);
                setPackages([]);
            } finally {
                setLoading(false);
            }
        };

        fetchPackages();
    }, [selectedEventType]);

    const eventTypes = ['all', 'Wedding', 'Birthday', 'Corporate', 'Mehendi', 'Concert'];

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center group-hover:border-purple-500/50 group-hover:bg-purple-500/10 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full text-gray-300 text-sm mb-6 border border-gray-800">
                            <Package className="w-4 h-4 text-purple-400" />
                            <span>All-Inclusive Event Packages</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6">
                            Curated
                            <span className="block bg-gradient-to-r from-purple-400 via-pink-500 to-orange-400 bg-clip-text text-transparent">
                                Event Packages
                            </span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Complete event solutions with handpicked artists and services
                        </p>
                    </div>
                </div>
            </section>

            {/* Filter */}
            <section className="py-8 border-b border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center gap-3 overflow-x-auto pb-2">
                        {eventTypes.map((type) => (
                            <button
                                key={type}
                                onClick={() => setSelectedEventType(type)}
                                className={`px-6 py-2 rounded-full font-medium whitespace-nowrap transition-all ${selectedEventType === type
                                    ? 'bg-gradient-to-r from-purple-500 to-pink-600 text-white shadow-lg shadow-pink-500/30'
                                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-800 hover:border-gray-700'
                                    }`}
                            >
                                {type === 'all' ? 'All Packages' : type}
                            </button>
                        ))}
                    </div>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    {loading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="w-8 h-8 text-purple-500 animate-spin" />
                        </div>
                    ) : packages.length > 0 ? (
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                            {packages.map((pkg) => (
                                <div
                                    key={pkg.id}
                                    className="group bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all duration-300"
                                >
                                    {/* Package Image */}
                                    <div className="relative h-56">
                                        <Image
                                            src={pkg.header_image_url || 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=800'}
                                            alt={pkg.name}
                                            fill
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] to-transparent" />
                                        <div className="absolute top-4 right-4">
                                            <span className="px-3 py-1 bg-purple-500/90 backdrop-blur-sm text-white text-sm rounded-full">
                                                {pkg.event_type}
                                            </span>
                                        </div>
                                    </div>

                                    {/* Package Content */}
                                    <div className="p-6">
                                        <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-purple-400 transition-colors">
                                            {pkg.name}
                                        </h3>
                                        <p className="text-gray-400 text-sm mb-4 line-clamp-2">
                                            {pkg.description}
                                        </p>

                                        {/* Package Info */}
                                        <div className="flex items-center gap-4 mb-4 text-sm text-gray-500">
                                            {pkg.duration && (
                                                <div className="flex items-center gap-1">
                                                    <Clock className="w-4 h-4" />
                                                    <span>{pkg.duration}</span>
                                                </div>
                                            )}
                                            {pkg.max_guests && (
                                                <div className="flex items-center gap-1">
                                                    <Users className="w-4 h-4" />
                                                    <span>Up to {pkg.max_guests}</span>
                                                </div>
                                            )}
                                        </div>

                                        {/* Features */}
                                        <div className="mb-4 space-y-2">
                                            {pkg.features.slice(0, 4).map((feature, index) => (
                                                <div key={index} className="flex items-start gap-2 text-sm">
                                                    <Check className="w-4 h-4 text-green-400 mt-0.5 flex-shrink-0" />
                                                    <span className="text-gray-400">{feature}</span>
                                                </div>
                                            ))}
                                            {pkg.features.length > 4 && (
                                                <p className="text-sm text-gray-500">
                                                    +{pkg.features.length - 4} more features
                                                </p>
                                            )}
                                        </div>

                                        {/* Performers */}
                                        {pkg.performers.length > 0 && (
                                            <div className="mb-4 p-3 bg-[#0f0f10] rounded-lg border border-gray-800">
                                                <div className="flex items-center gap-2 mb-2">
                                                    <Users className="w-4 h-4 text-purple-400" />
                                                    <span className="text-sm font-medium text-purple-400">
                                                        Includes {pkg.performers.length} Artist{pkg.performers.length > 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex flex-wrap gap-1">
                                                    {pkg.performers.slice(0, 3).map((performer, index) => (
                                                        <span
                                                            key={index}
                                                            className="text-xs px-2 py-1 bg-[#1a1a1a] text-gray-400 rounded-full border border-gray-800"
                                                        >
                                                            {performer.name}
                                                        </span>
                                                    ))}
                                                    {pkg.performers.length > 3 && (
                                                        <span className="text-xs px-2 py-1 text-gray-500">
                                                            +{pkg.performers.length - 3} more
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                        {/* Pricing & CTA */}
                                        <div className="flex items-center justify-between pt-4 border-t border-gray-800">
                                            <div>
                                                <div className="text-sm text-gray-500">Starting from</div>
                                                <div className="text-2xl font-bold text-white">
                                                    PKR {pkg.pricing.toLocaleString()}
                                                </div>
                                            </div>
                                            <Link
                                                href={`/post-requirement?package=${pkg.id}`}
                                                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-600 text-white rounded-xl hover:shadow-lg hover:shadow-pink-500/30 transition-all group-hover:translate-x-1"
                                            >
                                                Book Now
                                                <ArrowRight className="w-4 h-4" />
                                            </Link>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="text-center py-20">
                            <Package className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                            <h3 className="text-xl font-semibold text-white mb-2">No packages found</h3>
                            <p className="text-gray-400 mb-8">
                                {selectedEventType === 'all'
                                    ? 'No packages available at the moment'
                                    : `No packages available for ${selectedEventType} events`}
                            </p>
                            <button
                                onClick={() => setSelectedEventType('all')}
                                className="px-6 py-3 bg-purple-500/10 text-purple-400 rounded-lg hover:bg-purple-500/20 transition-colors"
                            >
                                View All Packages
                            </button>
                        </div>
                    )}
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-16 bg-[#0f0f10]">
                <div className="max-w-4xl mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Package?</h2>
                    <p className="text-gray-400 mb-8">
                        Can't find the perfect package? Let us create a customized solution for your event
                    </p>
                    <Link
                        href="/post-requirement"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        Request Custom Package
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </section>
        </div>
    );
}
