import Link from 'next/link';
import Image from 'next/image';
import { Facebook, Instagram, Youtube, Mail, Phone, MapPin, Music, ArrowRight, Star, Heart, Users, Calendar, Linkedin } from 'lucide-react';

// Simple TikTok icon component
const TikTokIcon = ({ className }: { className?: string }) => (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
        <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-5.2 1.74 2.89 2.89 0 012.31-4.64 2.93 2.93 0 01.88.13V9.4a6.84 6.84 0 00-1-.05A6.33 6.33 0 005 20.1a6.34 6.34 0 0010.86-4.43v-7a8.16 8.16 0 004.77 1.52v-3.4a4.85 4.85 0 01-1-.1z" />
    </svg>
);

// Artist categories for footer
const categories = [
    { name: 'Singers', slug: 'singers' },
    { name: 'Qawwals', slug: 'qawwals' },
    { name: 'Live Bands', slug: 'live-bands' },
    { name: 'Bhangra Artists', slug: 'bhangra-artists' },
    { name: 'DJs', slug: 'djs' },
];

// Cities for footer
const cities = [
    { name: 'Lahore', slug: 'lahore' },
    { name: 'Karachi', slug: 'karachi' },
    { name: 'Islamabad', slug: 'islamabad' },
    { name: 'Rawalpindi', slug: 'rawalpindi' },
    { name: 'Faisalabad', slug: 'faisalabad' },
    { name: 'Multan', slug: 'multan' },
];

// Event types
const events = [
    { name: 'Wedding', slug: 'wedding' },
    { name: 'Mehendi', slug: 'mehendi' },
    { name: 'Corporate', slug: 'corporate' },
    { name: 'Concert', slug: 'concert' },
    { name: 'Private Party', slug: 'private-party' },
];

export default function Footer() {
    return (
        <footer className="relative bg-[#0a0a0b] text-gray-400 overflow-hidden">
            {/* Gradient background decorations */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/5 rounded-full blur-[150px]" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/5 rounded-full blur-[150px]" />
            </div>

            {/* CTA Section */}
            <div className="relative border-t border-gray-800/50">
                <div className="relative py-12">
                    <div className="absolute inset-0 bg-gradient-to-br from-orange-600/10 via-[#0a0a0b] to-pink-600/10" />
                    <div className="absolute top-0 left-1/4 w-96 h-96 bg-orange-500/10 rounded-full blur-[120px]" />
                    <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-pink-600/10 rounded-full blur-[120px]" />

                    <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-8 py-8 px-8 bg-gradient-to-r from-orange-500/10 via-pink-500/5 to-orange-500/10 rounded-3xl border border-orange-500/20 backdrop-blur-sm">
                            <div className="text-center lg:text-left">
                                <h3 className="text-2xl lg:text-3xl font-bold text-white mb-2">
                                    Ready to Create{' '}
                                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-pink-500">
                                        Unforgettable Moments?
                                    </span>
                                </h3>
                                <p className="text-gray-400">
                                    Book verified artists for your next event or tell us your requirements
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link
                                    href="/artists"
                                    className="group flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/25 hover:shadow-orange-500/40 hover:-translate-y-1 transition-all"
                                >
                                    Browse Artists
                                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </Link>
                                <Link
                                    href="/post-requirement"
                                    className="px-8 py-4 bg-[#1a1a1a] border border-gray-700 text-white font-bold rounded-xl hover:bg-[#252525] hover:border-orange-500/30 transition-all text-center"
                                >
                                    Post Requirement
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Footer - 6 Column Grid with colored background */}
            <div className="relative">
                {/* Gradient accent top border */}
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/30 to-transparent" />

                {/* Subtle colored background */}
                <div className="absolute inset-0 bg-gradient-to-b from-[#12111a] to-[#0a0a0b]" />
                <div className="absolute top-0 left-0 w-1/3 h-full bg-gradient-to-r from-purple-900/10 to-transparent" />
                <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-pink-900/10 to-transparent" />

                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 lg:gap-6">

                        {/* Brand - spans 2 cols */}
                        <div className="col-span-2">
                            <Link href="/" className="flex items-center gap-3 mb-6 group">
                                <Image
                                    src="/logo-taf.png"
                                    alt="The Artist Factory"
                                    width={72}
                                    height={72}
                                    className="w-[72px] h-[72px] object-contain"
                                />
                                <div>
                                    <span className="text-xl font-bold text-white block">The Artist Factory</span>
                                    <span className="text-xs text-gray-500">Pakistan's Premier Entertainment</span>
                                </div>
                            </Link>
                            <p className="text-gray-500 mb-6 leading-relaxed text-sm">
                                Connecting you with Pakistan's finest artists for weddings, corporate events, and celebrations.
                            </p>

                            {/* Social icons */}
                            <div className="flex flex-wrap gap-3">
                                <a href="https://www.facebook.com/share/1BkG8r9xrN/" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-gray-800 hover:border-blue-500/50 hover:bg-gradient-to-br hover:from-blue-500/20 hover:to-blue-600/20 transition-all">
                                    <Facebook className="w-4 h-4 text-gray-400 group-hover:text-blue-400 transition-colors" />
                                </a>
                                <a href="https://www.instagram.com/theartistfactoryofficial" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-gray-800 hover:border-pink-500/50 hover:bg-gradient-to-br hover:from-pink-500/20 hover:to-purple-500/20 transition-all">
                                    <Instagram className="w-4 h-4 text-gray-400 group-hover:text-pink-400 transition-colors" />
                                </a>
                                <a href="https://youtube.com/@theartistfactoryofficial" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-gray-800 hover:border-red-500/50 hover:bg-gradient-to-br hover:from-red-500/20 hover:to-orange-500/20 transition-all">
                                    <Youtube className="w-4 h-4 text-gray-400 group-hover:text-red-400 transition-colors" />
                                </a>
                                <a href="https://www.tiktok.com/@theartistfactory" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-gray-800 hover:border-gray-500/50 hover:bg-gradient-to-br hover:from-gray-500/20 hover:to-gray-600/20 transition-all">
                                    <TikTokIcon className="w-4 h-4 text-gray-400 group-hover:text-white transition-colors" />
                                </a>
                                <a href="https://www.linkedin.com/company/artistfactoryofficial/" target="_blank" rel="noopener noreferrer" className="group w-10 h-10 bg-[#1a1a1a] rounded-xl flex items-center justify-center border border-gray-800 hover:border-blue-600/50 hover:bg-gradient-to-br hover:from-blue-600/20 hover:to-blue-700/20 transition-all">
                                    <Linkedin className="w-4 h-4 text-gray-400 group-hover:text-blue-500 transition-colors" />
                                </a>
                            </div>
                        </div>

                        {/* Artists */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Star className="w-4 h-4 text-orange-400" />
                                Artists
                            </h3>
                            <ul className="space-y-2.5">
                                {categories.map((category) => (
                                    <li key={category.slug}>
                                        <Link
                                            href={`/artists/${category.slug}`}
                                            className="text-sm text-gray-500 hover:text-orange-400 transition-colors"
                                        >
                                            {category.name}
                                        </Link>
                                    </li>
                                ))}
                                <li>
                                    <Link href="/artists" className="text-sm text-orange-400 hover:text-orange-300 font-medium transition-colors">
                                        View All →
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        {/* Cities */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <MapPin className="w-4 h-4 text-pink-400" />
                                Cities
                            </h3>
                            <ul className="space-y-2.5">
                                {cities.map((city) => (
                                    <li key={city.slug}>
                                        <Link
                                            href={`/artists?location=${encodeURIComponent(city.name)}`}
                                            className="text-sm text-gray-500 hover:text-pink-400 transition-colors"
                                        >
                                            {city.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Events */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Calendar className="w-4 h-4 text-purple-400" />
                                Events
                            </h3>
                            <ul className="space-y-2.5">
                                {events.map((event) => (
                                    <li key={event.slug}>
                                        <Link
                                            href={`/events/${event.slug}`}
                                            className="text-sm text-gray-500 hover:text-purple-400 transition-colors"
                                        >
                                            {event.name}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Company */}
                        <div>
                            <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                                <Users className="w-4 h-4 text-cyan-400" />
                                Company
                            </h3>
                            <ul className="space-y-2.5">
                                <li>
                                    <Link href="/about" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                                        About Us
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/contact" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                                        Contact
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/testimonials" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                                        Testimonials
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/faq" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                                        FAQs
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/privacy" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                                        Privacy
                                    </Link>
                                </li>
                                <li>
                                    <Link href="/terms" className="text-sm text-gray-500 hover:text-cyan-400 transition-colors">
                                        Terms
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>

                    {/* Contact Info Bar */}
                    <div className="mt-12 pt-8 border-t border-gray-800/50">
                        <div className="flex flex-wrap justify-center gap-6 lg:gap-12 text-sm">
                            <a href="tel:+923001234567" className="flex items-center gap-2 text-gray-500 hover:text-orange-400 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-orange-500/10 flex items-center justify-center">
                                    <Phone className="w-4 h-4 text-orange-400" />
                                </div>
                                <span>+92 300 123 4567</span>
                            </a>
                            <a href="mailto:Theartistfactoryofficial@gmail.com" className="flex items-center gap-2 text-gray-500 hover:text-pink-400 transition-colors">
                                <div className="w-8 h-8 rounded-lg bg-pink-500/10 flex items-center justify-center">
                                    <Mail className="w-4 h-4 text-pink-400" />
                                </div>
                                <span>Theartistfactoryofficial@gmail.com</span>
                            </a>
                            <div className="flex items-center gap-2 text-gray-500">
                                <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center shrink-0">
                                    <MapPin className="w-4 h-4 text-purple-400" />
                                </div>
                                <span>2nd Floor, 67 CCA 1, Phase 6 DHA, LHR</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Bottom Bar with gradient line */}
            <div className="relative border-t border-gray-800/50 bg-[#050508]">
                <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/30 to-transparent" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} Artist Factory. All rights reserved.
                        </p>
                        <div className="flex items-center gap-2 text-gray-600 text-sm">
                            <span>Made with</span>
                            <Heart className="w-4 h-4 text-red-500 fill-red-500 animate-pulse" />
                            <span>in Pakistan</span>
                        </div>
                    </div>
                </div>
            </div>
        </footer>
    );
}
