'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

interface ArtistFAQProps {
    artistName: string;
}

export default function ArtistFAQ({ artistName }: ArtistFAQProps) {
    const faqs = [
        {
            question: `What is the booking process for ${artistName}?`,
            answer: "The booking process is simple! Click the 'Request Booking' button to send us your event details. Our team will coordinate with the artist's management for availability and pricing, then get back to you with a formal quote."
        },
        {
            question: `Does ${artistName} travel for out-of-city or international events?`,
            answer: `Yes, ${artistName} is available for destination weddings, corporate events, and concerts globally. Travel and accommodation requirements will be discussed during the booking finalization.`
        },
        {
            question: `How much does it cost to book ${artistName}?`,
            answer: "Pricing varies based on the event type, location, duration of performance, and the artist's current schedule. Please submit a booking request for a customized quote tailored to your specific event."
        },
        {
            question: `How far in advance should I book ${artistName}?`,
            answer: "We recommend booking as early as possible, ideally 3-6 months in advance, especially for peak wedding seasons (December-February) and major holidays, as dates fill up quickly."
        },
        {
            question: `What are the technical requirements for the performance?`,
            answer: `Technical riders (sound, lighting, stage setup) vary by event size. Once your booking is confirmed, we will provide a detailed technical rider to ensure ${artistName}'s performance is flawless.`
        }
    ];

    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
        <section className="py-20 bg-[#0a0a0b] relative border-t border-gray-900">
            {/* Background Decorations */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute top-20 left-10 w-64 h-64 bg-orange-500/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 right-10 w-64 h-64 bg-pink-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-pink-500/10 rounded-full text-orange-400 text-sm font-medium mb-4 border border-orange-500/20">
                        <HelpCircle className="w-4 h-4" />
                        <span>Common Questions</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
                        FAQs regarding <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">{artistName}</span>
                    </h2>
                    <p className="text-gray-400">
                        Everything you need to know about booking and performance details.
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`group bg-[#151515] rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index
                                ? 'border-orange-500/50 shadow-[0_0_20px_rgba(249,115,22,0.1)]'
                                : 'border-gray-800 hover:border-gray-700'
                                }`}
                        >
                            <button
                                onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                className="w-full flex items-center justify-between p-6 text-left"
                            >
                                <span className={`font-semibold text-lg transition-colors ${openIndex === index ? 'text-white' : 'text-gray-300 group-hover:text-white'
                                    }`}>
                                    {faq.question}
                                </span>
                                <ChevronDown
                                    className={`w-5 h-5 text-gray-500 transition-transform duration-300 ${openIndex === index ? 'rotate-180 text-orange-500' : ''
                                        }`}
                                />
                            </button>
                            <div
                                className={`grid transition-[grid-template-rows] duration-300 ease-out ${openIndex === index ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                                    }`}
                            >
                                <div className="overflow-hidden">
                                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-800/50 pt-4">
                                        {faq.answer}
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
