import { Search, Calendar, CheckCircle, Star } from 'lucide-react';

const steps = [
    {
        icon: <Search className="w-8 h-8" />,
        title: 'Search & Browse',
        description: 'Explore our curated selection of verified artists across various categories.',
    },
    {
        icon: <Calendar className="w-8 h-8" />,
        title: 'Check Availability',
        description: 'View artist profiles, portfolios, and check their availability for your event date.',
    },
    {
        icon: <CheckCircle className="w-8 h-8" />,
        title: 'Book & Confirm',
        description: 'Send a booking request with your event details and receive confirmation.',
    },
    {
        icon: <Star className="w-8 h-8" />,
        title: 'Enjoy Your Event',
        description: 'Sit back and enjoy as our professional artists make your event memorable.',
    },
];

export default function HowItWorks() {
    return (
        <section className="py-16 lg:py-24 bg-[#0f0f10]">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Section Header */}
                <div className="text-center mb-16">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        How It Works
                    </h2>
                    <p className="text-lg text-gray-400 max-w-2xl mx-auto">
                        Booking your perfect artist is just a few steps away
                    </p>
                </div>

                {/* Steps */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {steps.map((step, index) => (
                        <div key={index} className="relative">
                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div className="hidden lg:block absolute top-12 left-[60%] w-full h-0.5 bg-gradient-to-r from-gray-700 to-transparent" />
                            )}

                            {/* Step Card */}
                            <div className="relative bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                                {/* Step Number */}
                                <div className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-r from-orange-500 to-pink-600 text-white rounded-full flex items-center justify-center text-sm font-bold">
                                    {index + 1}
                                </div>

                                {/* Icon */}
                                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-500/20 to-pink-600/20 flex items-center justify-center text-orange-400 mb-4">
                                    {step.icon}
                                </div>

                                {/* Content */}
                                <h3 className="text-xl font-semibold text-white mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-gray-500">
                                    {step.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
