import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function CTASection() {
    return (
        <section className="py-16 lg:py-24 bg-[#0a0a0b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-size-200 animate-gradient">
                    {/* Decorative Elements */}
                    <div className="absolute top-0 left-0 w-64 h-64 bg-white/10 rounded-full -translate-x-1/2 -translate-y-1/2" />
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-black/10 rounded-full translate-x-1/3 translate-y-1/3" />

                    {/* Content */}
                    <div className="relative z-10 px-5 py-10 sm:px-8 sm:py-16 lg:px-16 lg:py-20 text-center">
                        <h2 className="text-2xl sm:text-4xl lg:text-5xl font-bold text-white mb-4 md:mb-6">
                            Ready to Make Your Event
                            <span className="block">Unforgettable?</span>
                        </h2>
                        <p className="text-base sm:text-xl text-white/90 max-w-2xl mx-auto mb-8 md:mb-10">
                            Tell us about your event and we'll help you find the perfect artists.
                            Get multiple quotes from verified performers.
                        </p>
                        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-3 sm:gap-4">
                            <Link
                                href="/post-requirement"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg shadow-black/20 text-base"
                            >
                                Post Your Requirement
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <Link
                                href="/artists"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-black/20 text-white font-semibold rounded-full hover:bg-black/30 transition-colors border border-white/30 text-base"
                            >
                                Browse Artists
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}
