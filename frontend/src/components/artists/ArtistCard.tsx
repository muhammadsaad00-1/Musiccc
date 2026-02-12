'use client';

import Link from 'next/link';
import Image from 'next/image';
import { MapPin, CheckCircle, PhoneOutgoing } from 'lucide-react';
import { Artist } from '@/types';

interface ArtistCardProps {
    artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
    // Handle both backend and mock data structures
    const imageUrl = artist.image_url || artist.profile_image_url || 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=400';
    const artistSlug = artist.slug || artist.name?.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const location = artist.location || (artist.locations && artist.locations[0]) || 'Pakistan';
    const shortBio = artist.short_bio || artist.description || artist.bio?.substring(0, 80);



    return (
        <Link
            href={`/artist/${artistSlug}`}
            className="group bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-800 hover:border-orange-500/40 transition-all duration-300 card-glow hover:shadow-lg hover:shadow-orange-500/5"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={imageUrl}
                    alt={artist.name}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-transparent to-transparent" />

                {/* Badges */}
                <div className="absolute top-3 left-3 flex gap-2">
                    {artist.is_featured && (
                        <span className="px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-xs font-semibold rounded-full">
                            Featured
                        </span>
                    )}
                    {artist.is_verified && (
                        <span className="px-2 py-1 bg-[#1a1a1a]/90 backdrop-blur-sm text-green-400 text-xs font-semibold rounded-full flex items-center gap-1 border border-gray-700">
                            <CheckCircle className="w-3 h-3" />
                            Verified
                        </span>
                    )}
                </div>
            </div>

            {/* Content */}
            <div className="p-5">
                {/* Name */}
                <h3 className="text-lg font-bold text-white group-hover:text-orange-400 transition-colors mb-1">
                    {artist.name}
                </h3>

                {/* Short Bio */}
                <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                    {shortBio}
                </p>

                {/* Location */}
                <div className="flex items-center gap-1 text-sm text-gray-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{location}</span>
                </div>

                {/* Languages/Genres */}
                {artist.languages && artist.languages.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 mb-4">
                        {artist.languages.slice(0, 3).map((lang) => (
                            <span
                                key={lang}
                                className="px-2 py-0.5 bg-[#2a2a2a] text-gray-400 text-xs rounded-full"
                            >
                                {lang}
                            </span>
                        ))}
                    </div>
                )}

                {/* CTA Buttons */}
                <div className="flex items-center gap-2 pt-3 border-t border-gray-800">
                    <span className="flex-1 text-center py-2 text-sm font-medium text-gray-300 bg-[#2a2a2a] rounded-full group-hover:bg-orange-500/10 group-hover:text-orange-400 transition-all">
                        View Profile
                    </span>
                    <a
                        onClick={(e) => e.stopPropagation()}
                        target="_blank"
                        rel="noopener noreferrer"
                        href={`https://wa.me/923206876442?text=${encodeURIComponent(`Hi, I'm interested in booking ${artist.name} for an event. Could you please share the details?`)}`}
                        className="flex items-center gap-1.5 px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium rounded-full hover:shadow-lg hover:shadow-green-500/30 transition-all z-10"
                        title="Contact on WhatsApp"
                    >
                        <PhoneOutgoing className="w-3.5 h-3.5" />
                        WhatsApp
                    </a>
                </div>
            </div>
        </Link>
    );
}
