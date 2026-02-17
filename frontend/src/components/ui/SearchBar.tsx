'use client';

import { useState, useEffect } from 'react';
import { Search, Music } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { API_BASE_URL } from '@/lib/api';

interface SearchBarProps {
    size?: 'default' | 'large';
    showCategory?: boolean;
    className?: string;
    autoFocus?: boolean;
    onSearch?: () => void;
}

export default function SearchBar({ size = 'default', showCategory = true, className = '', autoFocus = false, onSearch }: SearchBarProps) {
    const router = useRouter();
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('');
    const [categories, setCategories] = useState<{ id: number; name: string; slug: string }[]>([]);

    // Fetch categories from backend
    useEffect(() => {
        async function fetchCategories() {
            try {
                const response = await fetch(`${API_BASE_URL}/categories`);
                if (response.ok) {
                    const data = await response.json();
                    setCategories(data || []);
                }
            } catch (error) {
                console.error('Error fetching categories:', error);
            }
        }
        fetchCategories();
    }, []);

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        const params = new URLSearchParams();
        if (query) params.append('q', query);
        if (category) params.append('category', category);

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

            {/* Category Dropdown */}
            {showCategory && (
                <>
                    <div className="w-px h-8 bg-gray-700" />
                    <div className="flex items-center px-3">
                        <Music className={`text-gray-500 flex-shrink-0 ${isLarge ? 'w-6 h-6' : 'w-5 h-5'}`} />
                        <select
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            className={`
                bg-transparent border-none outline-none text-white cursor-pointer appearance-none
                ${isLarge ? 'px-3 py-3 text-lg' : 'px-2 py-2 text-sm'}
                ${!category ? 'text-gray-500' : 'text-white'}
              `}
                            style={{ minWidth: '120px' }}
                        >
                            <option value="" className="bg-[#1a1a1a] text-gray-500">Category</option>
                            {categories.map((cat) => (
                                <option key={cat.id} value={cat.slug || cat.name} className="bg-[#1a1a1a] text-white">
                                    {cat.name}
                                </option>
                            ))}
                        </select>
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
