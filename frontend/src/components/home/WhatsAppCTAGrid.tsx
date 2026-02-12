'use client';

import { MessageCircle, ArrowRight, Calendar, Music, PartyPopper } from 'lucide-react';
import Link from 'next/link';

const ctaCards = [
    {
        heading: "Looking to Book an Artist?",
        description: "Tell us your event details and we'll connect you with the perfect performer.",
        buttonText: "Chat on WhatsApp",
        whatsappMessage: "Hi, I'm looking to book an artist for my event. Could you help me with the details?",
        icon: Music,
        gradient: "from-orange-500/10 to-pink-600/10",
        borderColor: "border-orange-500/20 hover:border-orange-500/40",
    },
    {
        heading: "Planning a Wedding?",
        description: "From Mehendi nights to grand receptions — we've got the perfect entertainment lined up.",
        buttonText: "Chat on WhatsApp",
        whatsappMessage: "Hi, I'm planning a wedding and need entertainment options. Can you help?",
        icon: PartyPopper,
        gradient: "from-pink-500/10 to-purple-600/10",
        borderColor: "border-pink-500/20 hover:border-pink-500/40",
    },
    {
        heading: "Organising a Corporate Event?",
        description: "Elevate your brand events with top-tier performers and entertainers.",
        buttonText: "Chat on WhatsApp",
        whatsappMessage: "Hi, I'm organising a corporate event and would like to discuss artist booking options.",
        icon: Calendar,
        gradient: "from-purple-500/10 to-blue-600/10",
        borderColor: "border-purple-500/20 hover:border-purple-500/40",
    },
];

export default function WhatsAppCTAGrid() {
    return (
        <section className="py-16 lg:py-24 bg-[#0a0a0b]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-14">
                    <span className="inline-flex items-center gap-2 px-4 py-1.5 bg-green-500/10 rounded-full text-green-400 text-sm mb-4 border border-green-500/20">
                        <MessageCircle className="w-4 h-4" />
                        Quick Connect
                    </span>
                    <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-4">
                        Got Questions?{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                            Let&apos;s Talk
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto text-lg">
                        Reach out to us directly on WhatsApp — we respond within minutes
                    </p>
                </div>

                {/* CTA Cards Grid */}
                <div className="grid md:grid-cols-3 gap-6">
                    {ctaCards.map((card, index) => {
                        const Icon = card.icon;
                        return (
                            <div
                                key={index}
                                className={`relative bg-[#1a1a1a] rounded-2xl p-8 border ${card.borderColor} transition-all duration-300 hover:shadow-lg hover:-translate-y-1 group`}
                            >
                                {/* Gradient background glow */}
                                <div className={`absolute inset-0 bg-gradient-to-br ${card.gradient} rounded-2xl opacity-50`} />

                                <div className="relative z-10">
                                    {/* Icon */}
                                    <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center mb-5">
                                        <Icon className="w-7 h-7 text-orange-400" />
                                    </div>

                                    {/* Text */}
                                    <h3 className="text-xl font-bold text-white mb-3">
                                        {card.heading}
                                    </h3>
                                    <p className="text-gray-400 text-sm leading-relaxed mb-6">
                                        {card.description}
                                    </p>

                                    {/* WhatsApp Button */}
                                    <a
                                        href={`https://wa.me/923206876442?text=${encodeURIComponent(card.whatsappMessage)}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#0a0a0b] border border-green-500/40 text-green-400 font-medium rounded-xl transition-all hover:border-green-400 hover:shadow-[0_0_16px_rgba(34,197,94,0.25)] hover:text-green-300 text-sm"
                                    >
                                        <MessageCircle className="w-4 h-4" />
                                        {card.buttonText}
                                    </a>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Bottom CTA */}
                <div className="text-center mt-10">
                    <p className="text-gray-500 mb-4">Or submit your requirements directly</p>
                    <Link
                        href="/post-requirement"
                        className="inline-flex items-center gap-2 px-7 py-3.5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-full hover:shadow-xl hover:shadow-orange-500/25 transition-all"
                    >
                        Post Your Requirement
                        <ArrowRight className="w-5 h-5" />
                    </Link>
                </div>
            </div>
        </section>
    );
}
