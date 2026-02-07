'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ChevronDown, HelpCircle, ArrowRight, MessageCircle, ArrowLeft } from 'lucide-react';
import { faqData } from '@/lib/mockData';

export default function FAQPage() {
    const [openCategory, setOpenCategory] = useState<string | null>(faqData[0]?.category || null);
    const [openQuestion, setOpenQuestion] = useState<number | null>(null);

    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                    >
                        <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
                            <ArrowLeft className="w-4 h-4" />
                        </div>
                        <span className="text-sm font-medium">Back to Home</span>
                    </Link>
                    <div className="text-center">
                        <div className="inline-flex items-center gap-2 px-4 py-2 bg-[#1a1a1a] rounded-full text-gray-300 text-sm mb-6 border border-gray-800">
                            <HelpCircle className="w-4 h-4 text-orange-400" />
                            <span>Got Questions?</span>
                        </div>
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Frequently Asked
                            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-orange-400 bg-clip-text text-transparent"> Questions</span>
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Find answers to common questions about booking artists through Artist Factory
                        </p>
                    </div>
                </div>
            </section>

            {/* FAQ Content */}
            <section className="py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-3 justify-center mb-12">
                        {faqData.map((category) => (
                            <button
                                key={category.category}
                                onClick={() => {
                                    setOpenCategory(category.category);
                                    setOpenQuestion(null);
                                }}
                                className={`px-6 py-3 rounded-full font-medium transition-all ${openCategory === category.category
                                    ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                                    : 'bg-[#1a1a1a] text-gray-400 hover:text-white border border-gray-800'
                                    }`}
                            >
                                {category.category}
                            </button>
                        ))}
                    </div>

                    {/* Questions */}
                    <div className="space-y-4">
                        {faqData
                            .find((cat) => cat.category === openCategory)
                            ?.questions.map((item, index) => (
                                <div
                                    key={index}
                                    className="bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden"
                                >
                                    <button
                                        onClick={() => setOpenQuestion(openQuestion === index ? null : index)}
                                        className="w-full flex items-center justify-between p-6 text-left"
                                    >
                                        <span className="font-semibold text-white pr-4">{item.question}</span>
                                        <ChevronDown
                                            className={`w-5 h-5 text-gray-400 flex-shrink-0 transition-transform ${openQuestion === index ? 'rotate-180' : ''
                                                }`}
                                        />
                                    </button>

                                    {openQuestion === index && (
                                        <div className="px-6 pb-6 border-t border-gray-800 pt-4">
                                            <p className="text-gray-400 leading-relaxed">{item.answer}</p>
                                        </div>
                                    )}
                                </div>
                            ))}
                    </div>
                </div>
            </section>

            {/* Still Have Questions */}
            <section className="py-16">
                <div className="max-w-4xl mx-auto px-4">
                    <div className="bg-gradient-to-br from-[#1a1a1a] to-[#252525] rounded-3xl border border-gray-800 p-12 text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-500/20 to-pink-600/20 rounded-2xl flex items-center justify-center mx-auto mb-6">
                            <MessageCircle className="w-8 h-8 text-orange-400" />
                        </div>
                        <h2 className="text-3xl font-bold text-white mb-4">Still Have Questions?</h2>
                        <p className="text-gray-400 mb-8 max-w-xl mx-auto">
                            Our team is here to help. Reach out and we'll get back to you within 24 hours.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link
                                href="/contact"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-semibold rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Contact Us
                                <ArrowRight className="w-5 h-5" />
                            </Link>
                            <a
                                href="tel:+923001234567"
                                className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-[#2a2a2a] text-white font-semibold rounded-full hover:bg-[#3a3a3a] transition-colors"
                            >
                                Call: +92 300 123 4567
                            </a>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
