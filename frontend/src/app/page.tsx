import CategoryGrid from '@/components/home/CategoryGrid';
import Hero from '@/components/home/Hero';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import ReviewsCarousel from '@/components/home/ReviewsCarousel';
import HowItWorks from '@/components/home/HowItWorks';

import CTASection from '@/components/home/CTASection';

export default function Home() {
  return (
    <>
      <Hero />
      <CategoryGrid />
      <FeaturedArtists />

      <ClientsMarquee />

      {/* Customer Reviews Section */}
      <section className="py-16 lg:py-24 bg-[#0a0a0b]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <span className="inline-flex items-center gap-2 px-3 py-1 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm mb-4 border border-orange-500/30">
              ⭐ Testimonials
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-3">
              What Our Clients Say
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              Don&apos;t just take our word for it - hear from event organizers who booked artists through us
            </p>
          </div>
          <ReviewsCarousel />
        </div>
      </section>

      <HowItWorks />
      <CTASection />
    </>
  );
}
