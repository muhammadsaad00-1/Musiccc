import Image from 'next/image';
import { Users, Award, Calendar, Heart } from 'lucide-react';

const stats = [
    { icon: <Users className="w-6 h-6" />, value: '500+', label: 'Verified Artists' },
    { icon: <Calendar className="w-6 h-6" />, value: '10,000+', label: 'Events Completed' },
    { icon: <Award className="w-6 h-6" />, value: '50+', label: 'Cities Covered' },
    { icon: <Heart className="w-6 h-6" />, value: '98%', label: 'Client Satisfaction' },
];

export default function AboutPage() {
    return (
        <div className="min-h-screen bg-[#0a0a0b]">
            {/* Hero Section */}
            <section className="relative py-20">
                <div className="absolute inset-0">
                    <div className="absolute top-20 left-10 w-72 h-72 bg-orange-500/10 rounded-full blur-[100px]" />
                    <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />
                </div>
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Our Story
                    </h1>
                    <p className="text-xl text-gray-400 max-w-3xl mx-auto">
                        Connecting Pakistan's finest artists with event organizers to create unforgettable moments.
                    </p>
                </div>
            </section>

            {/* Stats */}
            <section className="py-12 relative z-10">
                <div className="max-w-5xl mx-auto px-4">
                    <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                            {stats.map((stat, index) => (
                                <div key={index} className="text-center">
                                    <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl mb-4">
                                        {stat.icon}
                                    </div>
                                    <div className="text-3xl font-bold text-white mb-1">{stat.value}</div>
                                    <div className="text-gray-500">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Mission Section */}
            <section className="py-16 lg:py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-6">
                                Making Event Planning Effortless
                            </h2>
                            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                                Artist Factory was born from a simple idea: finding the right entertainment for your
                                events shouldn't be stressful. We've built Pakistan's most comprehensive platform
                                connecting talented artists with people who need them.
                            </p>
                            <p className="text-lg text-gray-400 mb-6 leading-relaxed">
                                Whether you're planning a grand wedding in Lahore, a corporate event in Karachi,
                                or a private party in Islamabad, we make it easy to discover, compare, and book
                                the perfect performers.
                            </p>
                            <p className="text-lg text-gray-400 leading-relaxed">
                                Every artist on our platform is carefully vetted to ensure quality, professionalism,
                                and reliability. We're not just a booking platform – we're your partners in creating
                                memorable experiences.
                            </p>
                        </div>
                        <div className="relative">
                            <div className="aspect-square relative rounded-2xl overflow-hidden border border-gray-800">
                                <Image
                                    src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800"
                                    alt="Event performance"
                                    fill
                                    className="object-cover"
                                />
                            </div>
                            <div className="absolute -bottom-6 -left-6 w-48 h-48 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl -z-10" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Values Section */}
            <section className="py-16 lg:py-24 bg-[#0f0f10]">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl sm:text-4xl font-bold text-white text-center mb-12">
                        What We Stand For
                    </h2>
                    <div className="grid md:grid-cols-3 gap-8">
                        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Quality First</h3>
                            <p className="text-gray-500">
                                Every artist is verified and vetted to ensure you get only the best for your event.
                            </p>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Reliability</h3>
                            <p className="text-gray-500">
                                We ensure timely responses and professional service from inquiry to event completion.
                            </p>
                        </div>
                        <div className="bg-[#1a1a1a] rounded-2xl p-8 border border-gray-800">
                            <div className="w-14 h-14 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center mb-6">
                                <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                            </div>
                            <h3 className="text-xl font-semibold text-white mb-3">Community</h3>
                            <p className="text-gray-500">
                                We support and grow Pakistan's creative community by connecting artists with opportunities.
                            </p>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
