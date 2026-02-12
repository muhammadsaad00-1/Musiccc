import CategoryGrid from '@/components/home/CategoryGrid';
import Hero from '@/components/home/Hero';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
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

      {/* Customer Reviews Section */}
      <section className="py-20 lg:py-32 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30 tracking-wide">
              ⭐ Testimonials
            </span>
            <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-6 tracking-tight">
              What Our Clients Say
            </h2>
            <p className="text-gray-400 text-lg max-w-2xl mx-auto leading-relaxed">
              Real stories from real organizers who found their perfect match on Artist Factory.
            </p>
          </div>
          <ReviewsCarousel />
        </div>
      </section>

      <HowItWorks />
      <CTASection />
      <WhatsAppCTAGrid />
    </>
  );
}
