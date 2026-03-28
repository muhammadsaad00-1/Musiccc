'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryGrid from '@/components/home/CategoryGrid';
import Hero from '@/components/home/Hero';
import EventBannerCarousel from '@/components/home/EventBannerCarousel';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import OurClients from '@/components/home/OurClients';
import HowItWorks from '@/components/home/HowItWorks';
import HomeGallerySection from '@/components/home/HomeGallerySection';
import HomeBlogSection from '@/components/home/HomeBlogSection';
import WhatsAppCTAGrid from '@/components/home/WhatsAppCTAGrid';
import FeaturesSection from '@/components/home/FeatureSection';
import SplashScreen from '@/components/ui/SplashScreen';
import FloatingWhatsAppButton from '@/components/home/FloatingWhatsAppButton';
import InstagramFeed from '@/components/home/InstagramFeed';
import { useCategories, usePerformers, useHeroImages, useStats } from '@/lib/hooks';

export default function Home() {
  const [showSplash, setShowSplash] = useState(true);
  const [minTimeElapsed, setMinTimeElapsed] = useState(false);

  // Fetch critical data for the homepage
  const { isLoading: categoriesLoading } = useCategories();
  const { isLoading: performersLoading } = usePerformers({ limit: 50 });
  const { isLoading: heroImagesLoading } = useHeroImages();
  const { isLoading: statsLoading } = useStats();

  // Check if all critical data is loaded
  const allDataLoaded = !categoriesLoading && !performersLoading && !heroImagesLoading && !statsLoading;

  // Ensure splash screen shows for minimum 1.5 seconds for smooth UX
  useEffect(() => {
    const timer = setTimeout(() => {
      setMinTimeElapsed(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  // Hide splash screen when data is loaded AND minimum time has elapsed
  useEffect(() => {
    if (allDataLoaded && minTimeElapsed) {
      // Add small delay for smooth transition
      const timer = setTimeout(() => {
        setShowSplash(false);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [allDataLoaded, minTimeElapsed]);

  if (showSplash) {
    return <SplashScreen />;
  }

  return (
    <div className="animate-fadeIn">
      <Hero />
      <EventBannerCarousel />

      <CategoryGrid />
      <FeaturedArtists />

      <ClientsMarquee />
      <TestimonialsSection />

      <HomeGallerySection />
      <HomeBlogSection />

      <HowItWorks />


      <WhatsAppCTAGrid />
      <FloatingWhatsAppButton />
      {/*<InstagramFeed />*/}

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-fadeIn {
          animation: fadeIn 0.6s ease-in;
        }
      `}</style>
    </div>
  );
}
