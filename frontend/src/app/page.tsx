'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { CheckCircle, Shield, Zap, HeartHandshake, Trophy, Star, Globe } from 'lucide-react';
import CategoryGrid from '@/components/home/CategoryGrid';
import Hero from '@/components/home/Hero';
import EventBannerCarousel from '@/components/home/EventBannerCarousel';
import FeaturedArtists from '@/components/home/FeaturedArtists';
import ClientsMarquee from '@/components/home/ClientsMarquee';
import TestimonialsSection from '@/components/home/TestimonialsSection';
import ArtistVideoTestimonials from '@/components/testimonials/ArtistVideoTestimonials';
import HowItWorks from '@/components/home/HowItWorks';
import HomeGallerySection from '@/components/home/HomeGallerySection';
import HomeBlogSection from '@/components/home/HomeBlogSection';
import SplashScreen from '@/components/ui/SplashScreen';
import ReadyForMomentsCTA from '@/components/home/ReadyForMomentsCTA';
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

  const [activeNeonIndex, setActiveNeonIndex] = useState(0);

  useEffect(() => {
    if (showSplash) return;
    const interval = setInterval(() => {
      setActiveNeonIndex((current) => (current + 1) % whyChooseUs.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [showSplash]);

  const whyChooseUs = [
    { title: "Verified Artists Only", desc: "Every artist on our platform undergoes a rigorous 5-step background and talent verification process.", icon: Shield, color: "text-orange-400", bg: "bg-orange-500/10" },
    { title: "Fast & Reliable Booking", desc: "From initial inquiry to final contract, we've streamlined the process to respect your time and urgency.", icon: Zap, color: "text-blue-400", bg: "bg-blue-500/10" },
    { title: "Global Talent Network", desc: "Access a curated selection of world-class performers, from local legends to international stars.", icon: Globe, color: "text-purple-400", bg: "bg-purple-500/10" },
    { title: "Secure Payments", desc: "Your investment is protected by our transparent payment milestones and escrow-style security.", icon: HeartHandshake, color: "text-pink-400", bg: "bg-pink-500/10" },
    { title: "Elite Production Quality", desc: "We don't just book artists; we ensure the technical rider and production meet the highest standards.", icon: Trophy, color: "text-yellow-400", bg: "bg-yellow-500/10" },
    { title: "White-Glove Support", desc: "Our dedicated booking managers handle every detail so you can focus on enjoying your event.", icon: Star, color: "text-green-400", bg: "bg-green-500/10" },
  ];

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

            {/* ══ WHY CHOOSE US ══════════════════════════════════════════ */}
            <section className="hidden md:block py-24 bg-[#0f0f10] relative overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-gray-800 to-transparent" />
                <div className="absolute inset-0 pointer-events-none overflow-hidden">
                    <div className="absolute -left-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[130px]" />
                    <div className="absolute -right-32 top-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-pink-600/10 rounded-full blur-[130px]" />
                    <div className="absolute bottom-0 left-1/3 w-[350px] h-[200px] bg-purple-600/8 rounded-full blur-[100px]" />
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-gradient-to-r from-orange-500/20 to-pink-600/20 rounded-full text-orange-400 text-sm font-medium mb-6 border border-orange-500/30">
                            ⭐ Performance & Trust
                        </span>
                        <h2 className="text-4xl md:text-5xl font-extrabold text-white mb-4 tracking-tight">
                            The Artist Factory Difference
                        </h2>
                        <p className="text-gray-400 text-lg max-w-2xl mx-auto">
                            We&apos;ve raised the bar for what a premium talent booking platform should look like.
                        </p>
                    </div>

                    {/* Reasons Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
                        {whyChooseUs.map((item, idx) => {
                            const isActive = idx === activeNeonIndex;
                            return (
                                <div
                                    key={item.title}
                                    className={`group relative bg-[#1a1a1a] rounded-2xl p-8 border transition-all duration-1000 hover:-translate-y-2 overflow-hidden ${isActive ? 'border-orange-500/30 shadow-[0_0_30px_-10px_rgba(249,115,22,0.15)]' : 'border-gray-800'}`}
                                >
                                    <div className={`absolute inset-0 transition-opacity duration-1000 bg-gradient-to-br ${item.bg.replace('/10', '/5')} pointer-events-none ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                    <div className={`absolute -inset-px rounded-2xl transition-opacity duration-1000 bg-gradient-to-r ${item.color.replace('text-', 'from-').replace('-400', '-500')} to-transparent blur-sm -z-10 ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`} />
                                    <div className={`w-14 h-14 ${item.bg} rounded-xl flex items-center justify-center mb-6 transition-transform duration-500 shadow-inner ${isActive ? 'scale-110' : 'group-hover:scale-110'}`}>
                                        <item.icon className={`w-7 h-7 ${item.color} drop-shadow-[0_0_8px_rgba(255,255,255,0.3)]`} />
                                    </div>
                                    <h3 className={`text-xl font-bold mb-3 relative z-10 transition-colors duration-500 ${isActive ? 'text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-300' : 'text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-gray-300'}`}>
                                        {item.title}
                                    </h3>
                                    <p className={`leading-relaxed text-sm relative z-10 transition-colors duration-500 ${isActive ? 'text-gray-400' : 'text-gray-500 group-hover:text-gray-400'}`}>
                                        {item.desc}
                                    </p>
                                    <div className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r from-transparent via-orange-500/50 to-transparent w-full transition-transform duration-[3000ms] ease-linear ${isActive ? 'translate-x-[100%]' : 'translate-x-[-100%] group-hover:translate-x-[100%]'}`} />
                                </div>
                            );
                        })}
                    </div>

                    {/* Social Proof Card */}
                    <div className="relative">
                        <div className="bg-gradient-to-br from-[#1a1010] to-[#1a1a1a] border border-orange-500/20 rounded-3xl p-8 md:p-12 overflow-hidden shadow-2xl">
                            <div className="absolute top-0 right-0 w-96 h-96 bg-orange-500/5 rounded-full blur-[120px] pointer-events-none" />
                            <div className="relative z-10 grid md:grid-cols-2 gap-10 items-center">
                                <div>
                                    <span className="inline-flex items-center gap-2 px-3 py-1 bg-orange-500/10 border border-orange-500/20 rounded-full text-orange-400 text-xs font-medium mb-6">
                                        ⭐ When Excellence Is Non-Negotiable
                                    </span>
                                    <h3 className="text-3xl md:text-4xl font-extrabold text-white mb-5 leading-tight">
                                        Clients Choose Us<br />
                                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500">When Stakes Are Highest</span>
                                    </h3>
                                    <p className="text-gray-400 text-lg leading-relaxed mb-6">
                                        Trusted by celebrities, corporations, and elite families for whom <span className="text-white font-semibold">reputation, prestige, and precision</span> are non-negotiable.
                                    </p>
                                    <div className="flex flex-col sm:flex-row gap-4 mt-8">
                                        <Link
                                            href="/post-requirement"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/20 hover:shadow-orange-500/40 hover:-translate-y-0.5 transition-all text-sm"
                                        >
                                            ✨ Get a Premium Proposal
                                        </Link>
                                        <a
                                            href="https://wa.me/923206876442?text=Hi, I'd like to inquire about booking a premium artist for my event."
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/5 border border-white/10 text-white font-bold rounded-xl hover:bg-white/10 hover:border-white/20 transition-all text-sm"
                                        >
                                            💬 Chat on WhatsApp
                                        </a>
                                    </div>
                                </div>
                                <div className="space-y-4 bg-black/20 p-6 md:p-8 rounded-2xl border border-white/5 backdrop-blur-sm">
                                    {[
                                        "Reputation is on the line",
                                        "International guests are attending",
                                        "Production failure is not an option",
                                        "The experience must reflect prestige",
                                    ].map((point) => (
                                        <div key={point} className="flex items-center gap-4 group">
                                            <div className="w-6 h-6 rounded-full bg-orange-500/20 border border-orange-500/40 flex items-center justify-center flex-shrink-0 group-hover:bg-orange-500/30 transition-colors">
                                                <CheckCircle className="w-3.5 h-3.5 text-orange-400" />
                                            </div>
                                            <p className="text-gray-200 font-medium group-hover:text-white transition-colors">{point}</p>
                                        </div>
                                    ))}
                                    <p className="text-orange-500/80 text-sm italic mt-4 font-medium">We operate quietly. We deliver powerfully.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* ══ TESTIMONIALS ══════════════════════════════════════════ */}
            <ArtistVideoTestimonials />
            <TestimonialsSection bgClass="bg-[#0a0a0b]" />

      <HomeGallerySection />
      <HomeBlogSection />

      <HowItWorks />


      {/* ══ FINAL CTA ══════════════════════════════════════════════ */}
      <ReadyForMomentsCTA />

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
