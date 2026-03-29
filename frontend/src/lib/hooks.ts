import { useQuery } from '@tanstack/react-query';
import { API_BASE_URL } from '@/lib/api';

// Generic fetch function
async function fetchAPI(endpoint: string) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

// Hook for fetching categories
export function useCategories() {
  return useQuery({
    queryKey: ['categories'],
    queryFn: () => fetchAPI('/categories'),
  });
}

// Hook for fetching performers with pagination
export function usePerformers(params?: {
  category?: string;
  page?: number;
  limit?: number;
  search?: string;
  featured?: boolean;
}) {
  const searchParams = new URLSearchParams();
  
  if (params?.category) searchParams.set('category', params.category);
  if (params?.page) searchParams.set('page', params.page.toString());
  if (params?.limit) searchParams.set('limit', params.limit.toString());
  if (params?.search) searchParams.set('search', params.search);
  if (params?.featured !== undefined) searchParams.set('featured', params.featured.toString());
  
  const queryString = searchParams.toString();
  const endpoint = `/performers${queryString ? `?${queryString}` : ''}`;
  
  return useQuery({
    queryKey: ['performers', params],
    queryFn: () => fetchAPI(endpoint),
  });
}

// Hook for fetching events
export function useEvents() {
  return useQuery({
    queryKey: ['events'],
    queryFn: () => fetchAPI('/events'),
  });
}

// Hook for fetching packages
export function usePackages(params?: { event_type?: string; is_active?: boolean }) {
  const searchParams = new URLSearchParams();
  
  if (params?.event_type) searchParams.set('event_type', params.event_type);
  if (params?.is_active !== undefined) searchParams.set('is_active', params.is_active.toString());
  
  const queryString = searchParams.toString();
  const endpoint = `/packages${queryString ? `?${queryString}` : ''}`;
  
  return useQuery({
    queryKey: ['packages', params],
    queryFn: () => fetchAPI(endpoint),
  });
}

// Hook for fetching reviews
export function useReviews(limit?: number) {
  const endpoint = limit ? `/api/reviews?limit=${limit}` : '/api/reviews';
  
  return useQuery({
    queryKey: ['reviews', limit],
    queryFn: () => fetchAPI(endpoint),
  });
}

// Hook for fetching artist testimonials
export function useArtistTestimonials() {
  return useQuery({
    queryKey: ['artist-testimonials'],
    queryFn: () => fetchAPI('/api/artist-testimonials'),
  });
}

// Hook for fetching client logos
export function useClientLogos() {
  return useQuery({
    queryKey: ['client-logos'],
    queryFn: () => fetchAPI('/api/client-logos'),
  });
}

// Hook for fetching hero images
export function useHeroImages() {
  return useQuery({
    queryKey: ['hero-images'],
    queryFn: () => fetchAPI('/api/hero-images'),
  });
}

// Hook for fetching stats
export function useStats() {
  return useQuery({
    queryKey: ['stats'],
    queryFn: () => fetchAPI('/api/stats'),
  });
}

// Hook for fetching portfolio
export function usePortfolio() {
  return useQuery({
    queryKey: ['portfolio'],
    queryFn: () => fetchAPI('/api/portfolio'),
  });
}
