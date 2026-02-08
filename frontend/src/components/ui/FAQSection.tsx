'use client';

import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

interface FAQ {
    question: string;
    answer: string;
}

interface FAQSectionProps {
    title?: string;
    subtitle?: string;
    faqs?: FAQ[];
    showContactLink?: boolean;
}

// Default FAQs for general use
export const generalFAQs: FAQ[] = [
    {
        question: "How do I book an artist for my event?",
        answer: "Simply browse through our verified artists, select the one you like, and click on 'Book Now' or 'Send Inquiry'. You can also post your requirements and we'll match you with the perfect artist."
    },
    {
        question: "What is the typical booking process?",
        answer: "1. Browse and select an artist. 2. Send an inquiry with your event details. 3. Receive a quote and confirm details. 4. Make payment to confirm booking. 5. Enjoy your event! We handle all the coordination."
    },
    {
        question: "Are all artists verified?",
        answer: "Yes! Every artist on our platform goes through a verification process. We check their background, past performances, and client reviews to ensure quality and professionalism."
    },
    {
        question: "What types of events do you cater to?",
        answer: "We cater to all types of events including weddings, corporate events, private parties, concerts, mehendi ceremonies, birthday celebrations, and more. Our diverse artist pool ensures we have the perfect match for any occasion."
    },
    {
        question: "Can I request a custom performance?",
        answer: "Absolutely! Most artists are flexible and can customize their performance based on your event theme, song requests, or specific requirements. Discuss this with the artist during the booking process."
    },
    {
        question: "What if I need to cancel or reschedule?",
        answer: "We understand plans can change. Our cancellation policy varies by artist, but most offer flexibility if you notify them in advance. Check the specific terms during booking or contact our support team."
    }
];

export default function FAQSection({
    title = "Got Questions?",
    subtitle = "Everything you need to know about our services",
    faqs = generalFAQs,
    showContactLink = true
}: FAQSectionProps) {
    return (
        <section className="py-16 lg:py-24 relative">
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-20 right-10 w-72 h-72 bg-purple-600/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-20 left-10 w-80 h-80 bg-orange-500/5 rounded-full blur-[120px]" />
            </div>

            <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-500/20 to-pink-600/20 rounded-full text-purple-400 text-sm font-medium mb-4 border border-purple-500/30">
                        <span className="text-lg">❓</span>
                        <span>Frequently Asked Questions</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        {title.split(' ').slice(0, -1).join(' ')}{' '}
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-500">
                            {title.split(' ').slice(-1)[0]}
                        </span>
                    </h2>
                    <p className="text-gray-400 max-w-2xl mx-auto">
                        {subtitle}
                    </p>
                </div>

                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <details
                            key={index}
                            className="group bg-gradient-to-r from-[#1a1a1a] to-[#151515] rounded-2xl border border-gray-800/50 overflow-hidden hover:border-purple-500/30 transition-all"
                        >
                            <summary className="flex items-center justify-between p-6 cursor-pointer list-none">
                                <span className="font-semibold text-white group-hover:text-purple-400 transition-colors pr-4">
                                    {faq.question}
                                </span>
                                <ChevronDown className="w-5 h-5 text-gray-500 group-open:rotate-180 transition-transform flex-shrink-0" />
                            </summary>
                            <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-gray-800/50 pt-4">
                                {faq.answer}
                            </div>
                        </details>
                    ))}
                </div>

                {showContactLink && (
                    <div className="text-center mt-12">
                        <p className="text-gray-500 mb-4">Still have questions?</p>
                        <Link
                            href="/contact"
                            className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 font-medium transition-colors"
                        >
                            Contact our support team
                            <span className="text-lg">→</span>
                        </Link>
                    </div>
                )}
            </div>
        </section>
    );
}
