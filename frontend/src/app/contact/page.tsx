'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin, Send, CheckCircle, ArrowLeft, Star, Navigation } from 'lucide-react';
import FAQSection from '@/components/ui/FAQSection';

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Contact form:', formData);
        setIsSubmitted(true);
    };

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
                        <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                            Get in Touch
                        </h1>
                        <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                            Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                        </p>
                    </div>
                </div>
            </section>

            {/* Content */}
            <section className="py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Contact Info */}
                        <div className="lg:col-span-1 space-y-6">
                            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Mail className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Email Us</h3>
                                        <p className="text-gray-500">Theartistfactoryofficial@gmail.com</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <Phone className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Call Us</h3>
                                        <p className="text-gray-500">+92 300 123 4567</p>
                                        <p className="text-gray-500">+92 42 1234 5678</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-[#1a1a1a] rounded-2xl p-6 border border-gray-800">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500/20 to-pink-600/20 text-orange-400 rounded-xl flex items-center justify-center flex-shrink-0">
                                        <MapPin className="w-6 h-6" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-white mb-1">Visit Us</h3>
                                        <p className="text-gray-500">
                                            2nd Floor, 67 CCA 1<br />
                                            Phase 6, DHA<br />
                                            Opposite Jalal Sons<br />
                                            Lahore, Pakistan
                                        </p>
                                    </div>
                                </div>
                            </div>

                        </div>

                        {/* Contact Form */}
                        <div className="lg:col-span-2">
                            <div className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8">
                                {isSubmitted ? (
                                    <div className="text-center py-12">
                                        <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                                            <CheckCircle className="w-8 h-8 text-green-400" />
                                        </div>
                                        <h2 className="text-2xl font-bold text-white mb-4">Message Sent!</h2>
                                        <p className="text-gray-500">
                                            Thank you for contacting us. We'll get back to you within 24 hours.
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <div className="mb-8">
                                            <h2 className="text-3xl font-bold text-white mb-2">Send us a Message</h2>
                                            <p className="text-gray-500">
                                                Have a question or want to book an artist? Fill out the form below and we'll get back to you shortly.
                                            </p>
                                        </div>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-400 ml-1">
                                                        Your Name <span className="text-orange-500">*</span>
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="John Doe"
                                                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white/10 transition-all outline-none"
                                                    />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-400 ml-1">
                                                        Email Address <span className="text-orange-500">*</span>
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="john@example.com"
                                                        className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white/10 transition-all outline-none"
                                                    />
                                                </div>
                                            </div>



                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-400 ml-1">
                                                    Message <span className="text-orange-500">*</span>
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows={5}
                                                    placeholder="Tell us about your event..."
                                                    className="w-full px-5 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500/50 focus:border-orange-500 focus:bg-white/10 transition-all outline-none resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full px-8 py-4 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-bold rounded-xl hover:shadow-lg hover:shadow-orange-500/20 transition-all flex items-center justify-center gap-2 group"
                                            >
                                                <span>Send Message</span>
                                                <Send className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Map Section */}
            <section className="py-16 border-t border-gray-800/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="relative bg-[#1a1a1a] rounded-2xl border border-gray-800 overflow-hidden h-[500px] shadow-2xl shadow-black/50">
                        {/* Custom Place Card Overlay */}
                        <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 max-w-[320px] hidden sm:block">
                            <div className="flex justify-between items-start gap-4">
                                <div>
                                    <h3 className="font-bold text-gray-900 text-base">Artist Factory</h3>
                                    <p className="text-xs text-gray-600 mt-1">
                                        2nd Floor, 67 CCA 1, Phase 6 DHA<br />
                                        Lahore, Pakistan
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                        <span className="text-orange-500 font-bold text-sm">5.0</span>
                                        <div className="flex text-orange-400">
                                            {[1, 2, 3, 4, 5].map((i) => (
                                                <Star key={i} className="w-3 h-3 fill-current" />
                                            ))}
                                        </div>
                                        <span className="text-blue-500 text-xs hover:underline cursor-pointer ml-1">10 reviews</span>
                                    </div>
                                </div>
                                <a
                                    href="https://www.google.com/maps/dir//2nd+Floor,+67+CCA+1,+Phase+6,+DHA,+Lahore"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex flex-col items-center gap-1 group/dir"
                                >
                                    <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center group-hover/dir:bg-blue-600 transition-colors">
                                        <Navigation className="w-4 h-4 text-white fill-white" />
                                    </div>
                                    <span className="text-[10px] text-blue-500 font-medium">Directions</span>
                                </a>
                            </div>
                            <a
                                href="https://www.google.com/maps?q=67+CCA+1,+Phase+6,+DHA,+Lahore"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-500 text-xs mt-3 block hover:underline"
                            >
                                View larger map
                            </a>
                        </div>

                        <iframe
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3402.5!2d74.450!3d31.467!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDI4JzAyLjMiTiA3NMKwMjcnMDAuMCJF!5e0!3m2!1sen!2s!4v1600000000000!5m2!1sen!2s&q=67+CCA+1,+Phase+6,+DHA,+Lahore"
                            width="100%"
                            height="100%"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                            className="w-full h-full"
                            title="The Artist Factory Location"
                        />
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <FAQSection
                title="Common Questions?"
                subtitle="Find answers to frequently asked questions about contacting us and our services"
                faqs={[
                    {
                        question: "How quickly do you respond to inquiries?",
                        answer: "We typically respond within 24 hours during business days. For urgent matters, please call us directly."
                    },
                    {
                        question: "Can I visit your office?",
                        answer: "Yes! Our office is open Monday to Saturday, 10 AM to 6 PM. We recommend scheduling an appointment for a personalized consultation."
                    },
                    {
                        question: "What information should I include in my inquiry?",
                        answer: "Please include your event type, date, location, budget range, and any specific artist preferences. The more details you provide, the better we can assist you."
                    },
                    {
                        question: "Do you offer phone consultations?",
                        answer: "Absolutely! You can call us during business hours or schedule a callback at your convenience."
                    }
                ]}
            />
        </div>
    );
}
