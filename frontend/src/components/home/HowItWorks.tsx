'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, Calendar, CheckCircle, Star, ArrowRight } from 'lucide-react';

const steps = [
    {
        icon: <Search className="w-8 h-8" />,
        title: 'Search & Discover',
        description: 'Browse our curated list of verified artists. Filter by genre, location, or budget to find your perfect match.',
    },
    {
        icon: <Calendar className="w-8 h-8" />,
        title: 'Check Availability',
        description: 'View artist profiles, watch performance videos, and check their calendar for your event date.',
    },
    {
        icon: <CheckCircle className="w-8 h-8" />,
        title: 'Book & Secure',
        description: 'Send a booking request directly. Once accepted, secure your artist with a safe deposit.',
    },
    {
        icon: <Star className="w-8 h-8" />,
        title: 'Enjoy the Show',
        description: 'Sit back and relax. Our professional artists will deliver an unforgettable performance for your guests.',
    },
];

export default function HowItWorks() {
    const [activeStep, setActiveStep] = useState(0);
    const [isVisible, setIsVisible] = useState(false);
    const [hasStarted, setHasStarted] = useState(false);
    const sectionRef = useRef<HTMLElement>(null);

    // Intersection Observer to start animation when section is in view
    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasStarted) {
                    setIsVisible(true);
                    setHasStarted(true);
                }
            },
            { threshold: 0.3 }
        );

        if (sectionRef.current) {
            observer.observe(sectionRef.current);
        }

        return () => observer.disconnect();
    }, [hasStarted]);

    // Sequential Animation Logic
    useEffect(() => {
        if (!isVisible) return;

        const interval = setInterval(() => {
            setActiveStep((prev) => {
                if (prev < steps.length - 1) return prev + 1;
                clearInterval(interval);
                return prev;
            });
        }, 2500); // 2.5 seconds per step for slower, more deliberate pacing

        return () => clearInterval(interval);
    }, [isVisible]);

    return (
        <section ref={sectionRef} className="py-14 md:py-24 bg-[#080809] overflow-hidden relative">

            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[10%] left-[5%] w-96 h-96 bg-orange-600/5 rounded-full blur-[100px]" />
                <div className="absolute bottom-[10%] right-[5%] w-96 h-96 bg-pink-600/5 rounded-full blur-[100px]" />
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                {/* Section Header */}
                <div className="text-center mb-10 md:mb-20">
                    <h2 className="text-3xl md:text-5xl font-bold text-white mb-4 md:mb-6 tracking-tight">
                        Your Event, <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-600">Perfectly Orchestrated</span>
                    </h2>
                    <p className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto leading-relaxed">
                        From discovery to applause, we've streamlined the process to ensure a seamless experience for you and your guests.
                    </p>
                </div>

                {/* Steps Container */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-8 mb-12 md:mb-20">
                    {steps.map((step, index) => {
                        const isActive = index <= activeStep;
                        const isCurrent = index === activeStep;

                        return (
                            <div key={index} className="relative group">
                                {/* Connector Arrow (Desktop) */}
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-16 -right-4 w-8 z-20 transform translate-x-1/2">
                                        <ArrowRight
                                            className={`w-6 h-6 transition-all duration-1000 ${isActive && index !== activeStep
                                                    ? 'text-orange-500 opacity-100 translate-x-0'
                                                    : 'text-gray-800 opacity-30 -translate-x-2'
                                                }`}
                                        />
                                    </div>
                                )}

                                {/* Step Card */}
                                <div
                                    className={`relative p-5 sm:p-8 rounded-3xl h-full transition-all duration-700 border ${isActive
                                            ? 'bg-[#121212] border-orange-500/30 shadow-[0_0_30px_-10px_rgba(249,115,22,0.15)]'
                                            : 'bg-[#0f0f10] border-gray-800/50 opacity-40 grayscale'
                                        }`}
                                >
                                    {/* Drawing Border Effect for Current Step */}
                                    {isCurrent && (
                                        <div className="absolute inset-0 rounded-3xl overflow-hidden pointer-events-none">
                                            <svg className="absolute inset-0 w-full h-full">
                                                <rect
                                                    x="2" y="2"
                                                    width="99%" height="98%"
                                                    rx="22" ry="22"
                                                    fill="none"
                                                    stroke="#f97316"
                                                    strokeWidth="2"
                                                    strokeDasharray="1000"
                                                    strokeDashoffset="1000"
                                                    className="animate-draw-border"
                                                />
                                            </svg>
                                        </div>
                                    )}

                                    {/* Step Number Badge */}
                                    <div className={`absolute -top-4 -left-4 w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg border-4 border-[#080809] transition-all duration-500 ${isActive
                                            ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white scale-100'
                                            : 'bg-gray-800 text-gray-500 scale-90'
                                        }`}>
                                        {index + 1}
                                    </div>

                                    {/* Icon */}
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-all duration-700 ${isActive
                                            ? 'bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rotate-0'
                                            : 'bg-gray-800/30 text-gray-600 -rotate-12'
                                        }`}>
                                        {step.icon}
                                    </div>

                                    {/* Content */}
                                    <div className={`transition-all duration-1000 delay-300 ${isActive ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
                                        }`}>
                                        <h3 className={`text-xl font-bold mb-3 ${isActive ? 'text-white' : 'text-gray-500'}`}>
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-400 text-sm leading-relaxed">
                                            {step.description}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* CTA Button */}
                <div className={`text-center transition-all duration-1000 delay-[500ms] ${activeStep === steps.length - 1 ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                    }`}>
                    <Link
                        href="/post-requirement"
                        className="inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-full text-base md:text-lg shadow-lg hover:shadow-orange-500/40 hover:-translate-y-1 transition-all group w-full sm:w-auto justify-center"
                    >
                        <span>Start Your Booking</span>
                        <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <p className="mt-4 text-sm text-gray-500">No hidden fees. Secure payments.</p>
                </div>
            </div>

            <style jsx>{`
                @keyframes draw-border {
                    from { stroke-dashoffset: 1000; }
                    to { stroke-dashoffset: 0; }
                }
                .animate-draw-border {
                    animation: draw-border 2.5s ease-out forwards;
                }
            `}</style>
        </section>
    );
}
