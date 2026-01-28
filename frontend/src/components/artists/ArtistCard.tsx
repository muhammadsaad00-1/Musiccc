import Link from 'next/link';
import Image from 'next/image';
import { MapPin, Clock, CheckCircle } from 'lucide-react';
import { Artist } from '@/types';

interface ArtistCardProps {
    artist: Artist;
}

export default function ArtistCard({ artist }: ArtistCardProps) {
    return (
        <Link
            href={`/artist/${artist.slug}`}
            className="group bg-[#1a1a1a] rounded-3xl overflow-hidden border border-gray-800 hover:border-gray-700 transition-all duration-300 card-glow"
        >
            {/* Image Container */}
            <div className="relative aspect-[4/3] overflow-hidden">
                <Image
                    src={artist.image_url}
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
                    {artist.short_bio || artist.bio?.substring(0, 80)}
                </p>

                {/* Meta Info */}
                <div className="flex flex-wrap items-center gap-3 text-sm text-gray-400 mb-3">
                    <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{artist.location}</span>
                    </div>
                    {artist.performance_duration && (
                        <div className="flex items-center gap-1">
                            <Clock className="w-4 h-4" />
                            <span>{artist.performance_duration}</span>
                        </div>
                    )}
                </div>

                {/* Languages */}
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

                {/* Price & CTA */}
                <div className="flex items-center justify-between pt-3 border-t border-gray-800">
                    {artist.price_range && (
                        <span className="text-sm text-gray-400">
                            {artist.price_range}
                        </span>
                    )}
                    <span className="px-4 py-2 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-medium rounded-full group-hover:shadow-lg group-hover:shadow-pink-500/30 transition-all">
                        See Price & Book
                    </span>
                </div>
            </div>
        </Link>
    );
}
