// Artist Factory - API Service Layer
// This will connect to FastAPI backend when ready

import { Artist, Category, Inquiry, SearchFilters } from '@/types';

//export const API_BASE_URL = 'https:///artistfactorybackend-340951229057.us-central1.run.app';
export const API_BASE_URL = 'http://127.0.0.1:8000';
//  // Use this during development, switch to actual URL when backend is deployed

// Helper function for API calls
async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
            'Content-Type': 'application/json',
            ...options?.headers,
        },
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.status}`);
    }

    return response.json();
}

// Categories
export const categoriesApi = {
    getAll: () => fetchApi<Category[]>('/categories'),
    getBySlug: (slug: string) => fetchApi<Category>(`/categories/${slug}`),
};

// Artists
export const artistsApi = {
    getAll: () => fetchApi<Artist[]>('/artists'),
    getById: (id: number) => fetchApi<Artist>(`/artists/${id}`),
    getBySlug: (slug: string) => fetchApi<Artist>(`/artists/slug/${slug}`),
    getByCategory: (categorySlug: string) => fetchApi<Artist[]>(`/artists/category/${categorySlug}`),
    getFeatured: () => fetchApi<Artist[]>('/artists/featured'),
    search: (filters: SearchFilters) => {
        const params = new URLSearchParams();
        if (filters.query) params.append('q', filters.query);
        if (filters.category) params.append('category', filters.category);
        if (filters.location) params.append('location', filters.location);
        if (filters.priceRange) params.append('price', filters.priceRange);
        return fetchApi<Artist[]>(`/artists/search?${params.toString()}`);
    },
};

// Inquiries
export const inquiriesApi = {
    create: (data: Partial<Inquiry>) =>
        fetchApi<Inquiry>('/inquiries', {
            method: 'POST',
            body: JSON.stringify(data),
        }),
    getAll: () => fetchApi<Inquiry[]>('/admin/inquiries'),
};