import Hero from '@/components/home/Hero';
import CategoryGrid from '@/components/home/CategoryGrid';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import HowItWorks from '@/components/home/HowItWorks';
import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedArtists />
      <ClientsMarquee />
      <HowItWorks />
      <CTASection />
    </>
  );
}
