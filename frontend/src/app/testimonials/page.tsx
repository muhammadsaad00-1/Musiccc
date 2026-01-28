import Image from 'next/image';
import Link from 'next/link';
import { Star, MapPin, Quote, ArrowRight } from 'lucide-react';
import { testimonials } from '@/lib/mockData';

export default function TestimonialsPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Success
                        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"> Stories</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        See how we've helped make events unforgettable across Pakistan
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 border-b border-gray-800">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="grid grid-cols-3 gap-8 text-center">
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">10,000+</div>
                            <div className="text-gray-500">Events Completed</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">98%</div>
                            <div className="text-gray-500">Satisfaction Rate</div>
                        </div>
                        <div>
                            <div className="text-4xl font-bold text-white mb-2">4.9</div>
                            <div className="text-gray-500 flex items-center justify-center gap-1">
                                <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                                Average Rating
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {testimonials.map((testimonial) => (
                            <div
                                key={testimonial.id}
                                className="bg-[#1a1a1a] rounded-3xl border border-gray-800 overflow-hidden hover:border-gray-700 transition-all"
                            >
                                {/* Image */}
                                <div className="relative h-48">
                                    <Image
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        fill
                                        className="object-cover"
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a] via-[#1a1a1a]/30 to-transparent" />

                                    {/* Event Badge */}
                                    <div className="absolute top-4 left-4 px-3 py-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-medium rounded-full">
                                        {testimonial.event}
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-6">
                                    {/* Rating */}
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(testimonial.rating)].map((_, i) => (
                                            <Star key={i} className="w-5 h-5 text-yellow-400 fill-yellow-400" />
                                        ))}
                                    </div>

                                    {/* Quote */}
                                    <div className="relative mb-6">
                                        <Quote className="absolute -top-2 -left-2 w-8 h-8 text-orange-500/30" />
                                        <p className="text-gray-300 leading-relaxed pl-4">
                                            "{testimonial.testimonial}"
                                        </p>
                                    </div>

                                    {/* Author */}
                                    <div className="border-t border-gray-800 pt-4">
                                        <p className="font-semibold text-white">{testimonial.name}</p>
                                        <p className="text-sm text-gray-500 flex items-center gap-1">
                                            <MapPin className="w-3 h-3" />
                                            {testimonial.location} • {testimonial.date}
                                        </p>
                                        <p className="text-sm text-orange-400 mt-1">
                                            Booked: {testimonial.artistBooked}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-r from-orange-500 via-pink-600 to-orange-500 bg-size-200 animate-gradient rounded-3xl p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Ready to Create Your Success Story?</h2>
                        <p className="text-white/90 mb-8 max-w-xl mx-auto">
                            Join thousands of happy customers who've made their events unforgettable with Artist Factory
                        </p>
                        <Link
                            href="/post-requirement"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-gray-900 font-semibold rounded-full hover:bg-gray-100 transition-colors shadow-lg"
                        >
                            Get Started Today
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
