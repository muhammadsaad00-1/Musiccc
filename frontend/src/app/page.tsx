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

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedArtists />
      <ClientsMarquee />

      {/* Testimonials — Clients & Artists */}
      <TestimonialsSection />

      {/* Our Corporate Clients */}
      <OurClients />

      <HowItWorks />
      <CTASection />
      <WhatsAppCTAGrid />
    </>
  );
}
