// Artist Factory - TypeScript Types

export interface Category {
    id: number;
    name: string;
    slug: string;
    icon_url?: string;
    description?: string;
    artist_count?: number;
}

export interface Artist {
    id: number;
    name: string;
    slug: string;
    category_id: number;
    category?: Category;
    bio?: string;
    short_bio?: string;
    location: string;
    price_range?: string;
    min_price?: number;
    max_price?: number;
    image_url: string;
    gallery_urls?: string[];
    video_url?: string;
    is_featured: boolean;
    is_verified: boolean;
    performance_duration?: string;
    languages?: string[];
    created_at?: string;
}

export interface Inquiry {
    id: number;
    customer_name: string;
    customer_email: string;
    customer_phone: string;
    event_type: string;
    event_date: string;
    event_location?: string;
    budget?: string;
    message?: string;
    artist_id?: number;
    status: 'pending' | 'contacted' | 'confirmed' | 'cancelled';
    created_at?: string;
}

export interface SearchFilters {
    category?: string;
    location?: string;
    priceRange?: string;
    eventType?: string;
    query?: string;
}

export interface ApiResponse<T> {
    data: T;
    error?: string;
    message?: string;
}
