'use client';

import { useState } from 'react';
import { Search, MapPin } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface SearchBarProps {
    size?: 'default' | 'large';
    showLocation?: boolean;
    className?: string;
    autoFocus?: boolean;
    onSearch?: () => void;
}

export default function SearchBar({ size = 'default', showLocation = true, className = '', autoFocus = false, onSearch }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [location, setLocation] = useState('');

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (location) params.append('location', location);

        if (onSearch) onSearch();
        router.push(`/search?${params.toString()}`);
    };

    const isLarge = size === 'large';

    return (
        <form
            onSubmit={handleSearch}
            className={`
        flex items-center bg-[#1a1a1a] rounded-full border border-gray-700 overflow-hidden
        ${isLarge ? 'p-2' : 'p-1'}
        ${className}
      `}
        >
            {/* Search Input */}
            <div className="flex items-center flex-1 px-4">
                <Search className={`text-gray-500 flex-shrink-0 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
                <input
                    type="text"
                    autoFocus={autoFocus}
                    placeholder="Search for artists, singers, DJs..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    className={`
            w-full bg-transparent border-none outline-none placeholder-gray-500 text-white
            ${isLarge ? 'px-4 py-3 text-lg' : 'px-3 py-2'}
          `}
                />
            </div>

            {/* Location Input */}
            {showLocation && (
                <>
                    <div className="w-px h-8 bg-gray-700" />
                    <div className="flex items-center px-4">
                        <MapPin className={`text-gray-500 flex-shrink-0 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
                        <input
                            type="text"
                            placeholder="City"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            className={`
                w-24 sm:w-32 bg-transparent border-none outline-none placeholder-gray-500 text-white
                ${isLarge ? 'px-3 py-3 text-lg' : 'px-2 py-2'}
              `}
                        />
                    </div>
                </>
            )}

            {/* Search Button */}
            <button
                type="submit"
                className={`
          bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-full 
          hover:shadow-lg hover:shadow-pink-500/30 transition-all duration-300
          ${isLarge ? 'px-8 py-4 text-lg' : 'px-6 py-2.5'}
        `}
            >
                Search
            </button>
        </form>
    );
}
