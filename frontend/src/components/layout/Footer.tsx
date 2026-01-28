import Link from 'next/link';
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const categories = [
    { name: 'Singers', slug: 'singers' },
    { name: 'Musicians', slug: 'musicians' },
    { name: 'DJs', slug: 'djs' },
    { name: 'Dancers', slug: 'dancers' },
    { name: 'Comedians', slug: 'comedians' },
    { name: 'Anchors', slug: 'anchors' },
    { name: 'Makeup Artists', slug: 'makeup-artists' },
    { name: 'Photographers', slug: 'photographers' },
];

export default function Footer() {
    return (
        <footer className="bg-[#090810] text-gray-400 border-t border-gray-800">
            {/* Main Footer */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
                    {/* Brand */}
                    <div className="lg:col-span-1">
                        <Link href="/" className="flex items-center space-x-2 mb-4">
                            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-600 rounded-xl flex items-center justify-center">
                                <span className="text-white font-bold text-xl">AF</span>
                            </div>
                            <span className="text-xl font-bold text-white">Artist Factory</span>
                        </Link>
                        <p className="text-gray-500 mb-6 leading-relaxed">
                            Pakistan's premier platform for booking artists and entertainers for your events.
                            From weddings to corporate events, we connect you with the best talent.
                        </p>
                        <div className="flex space-x-4">
                            <a href="#" className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 transition-all">
                                <Facebook className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 transition-all">
                                <Instagram className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 transition-all">
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a href="#" className="w-10 h-10 bg-[#1a1a1a] rounded-full flex items-center justify-center hover:bg-gradient-to-r hover:from-orange-500 hover:to-pink-600 transition-all">
                                <Youtube className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Categories */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Browse Artists</h3>
                        <ul className="space-y-3">
                            {categories.map((category) => (
                                <li key={category.slug}>
                                    <Link
                                        href={`/artists/${category.slug}`}
                                        className="hover:text-white transition-colors"
                                    >
                                        {category.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Quick Links</h3>
                        <ul className="space-y-3">
                            <li>
                                <Link href="/about" className="hover:text-white transition-colors">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/post-requirement" className="hover:text-white transition-colors">
                                    Post Your Requirement
                                </Link>
                            </li>
                            <li>
                                <Link href="/contact" className="hover:text-white transition-colors">
                                    Contact Us
                                </Link>
                            </li>
                            <li>
                                <Link href="/faq" className="hover:text-white transition-colors">
                                    FAQs
                                </Link>
                            </li>
                            <li>
                                <Link href="/privacy" className="hover:text-white transition-colors">
                                    Privacy Policy
                                </Link>
                            </li>
                            <li>
                                <Link href="/terms" className="hover:text-white transition-colors">
                                    Terms of Service
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Contact Info */}
                    <div>
                        <h3 className="text-white font-semibold text-lg mb-4">Contact Us</h3>
                        <ul className="space-y-4">
                            <li className="flex items-start space-x-3">
                                <MapPin className="w-5 h-5 text-orange-500 mt-0.5 flex-shrink-0" />
                                <span>Lahore, Pakistan</span>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Phone className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <a href="tel:+923001234567" className="hover:text-white transition-colors">
                                    +92 300 123 4567
                                </a>
                            </li>
                            <li className="flex items-center space-x-3">
                                <Mail className="w-5 h-5 text-orange-500 flex-shrink-0" />
                                <a href="mailto:info@artistfactory.pk" className="hover:text-white transition-colors">
                                    info@artistfactory.pk
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* Bottom Bar */}
            <div className="border-t border-gray-800">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                        <p className="text-gray-600 text-sm">
                            © {new Date().getFullYear()} Artist Factory. All rights reserved.
                        </p>
                        <p className="text-gray-600 text-sm">
                            Made with ❤️ in Pakistan
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
