import Link from 'next/link';
import { Check, Star, ArrowRight } from 'lucide-react';
import { eventPackages } from '@/lib/mockData';

export default function PackagesPage() {
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
                        Event
                        <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"> Packages</span>
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Curated entertainment bundles designed for your specific event type. Save time and money with our pre-built packages.
                    </p>
                </div>
            </section>

            {/* Packages Grid */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {eventPackages.map((pkg) => (
                            <div
                                key={pkg.id}
                                className={`relative bg-[#1a1a1a] rounded-3xl border ${pkg.popular ? 'border-orange-500' : 'border-gray-800'
                                    } p-8 hover:border-gray-700 transition-all`}
                            >
                                {/* Popular Badge */}
                                {pkg.popular && (
                                    <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                        <span className="inline-flex items-center gap-1 px-4 py-1 bg-gradient-to-r from-orange-500 to-pink-600 text-white text-sm font-semibold rounded-full">
                                            <Star className="w-4 h-4" />
                                            Most Popular
                                        </span>
                                    </div>
                                )}

                                {/* Event Type Badge */}
                                <div className="inline-block px-3 py-1 bg-[#2a2a2a] text-gray-400 text-xs uppercase tracking-wide rounded-full mb-4">
                                    {pkg.eventType}
                                </div>

                                {/* Package Name */}
                                <h3 className="text-2xl font-bold text-white mb-2">{pkg.name}</h3>
                                <p className="text-gray-500 mb-6">{pkg.description}</p>

                                {/* Price */}
                                <div className="mb-6">
                                    <span className="text-3xl font-bold text-white">{pkg.price}</span>
                                </div>

                                {/* Includes */}
                                <div className="space-y-3 mb-8">
                                    {pkg.includes.map((item, index) => (
                                        <div key={index} className="flex items-start gap-3">
                                            <div className="w-5 h-5 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <Check className="w-3 h-3 text-green-400" />
                                            </div>
                                            <span className="text-gray-300">{item}</span>
                                        </div>
                                    ))}
                                </div>

                                {/* CTA */}
                                <Link
                                    href={`/post-requirement?package=${pkg.slug}`}
                                    className={`block w-full text-center py-4 rounded-full font-semibold transition-all ${pkg.popular
                                            ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white hover:shadow-lg hover:shadow-pink-500/30'
                                            : 'bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]'
                                        }`}
                                >
                                    Book This Package
                                </Link>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Custom Package CTA */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-3xl border border-gray-800 p-12 text-center">
                        <h2 className="text-3xl font-bold text-white mb-4">Need a Custom Package?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Don't see exactly what you need? We can create a customized entertainment package tailored to your specific requirements and budget.
                        </p>
                        <Link
                            href="/post-requirement"
                            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                        >
                            Create Custom Package
                            <ArrowRight className="w-5 h-5" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
}
