'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import CategoryGrid from '@/components/home/CategoryGrid';
import Hero from '@/components/home/Hero';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import OurClients from '@/components/home/OurClients';
import HowItWorks from '@/components/home/HowItWorks';
import WhatsAppCTAGrid from '@/components/home/WhatsAppCTAGrid';
import CTASection from '@/components/home/CTASection';
import SplashScreen from '@/components/ui/SplashScreen';
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
      <CategoryGrid />
      <FeaturedArtists />
      <ClientsMarquee />

      {/* Testimonials — Clients & Artists */}
      <TestimonialsSection />

      {/* Our Corporate Clients */}
      {/* <OurClients /> */}

      <HowItWorks />
      <CTASection />
      <WhatsAppCTAGrid />
      
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
