'use client';

import { useState } from 'react';
import { Mail, Phone, MapPin, Send, CheckCircle } from 'lucide-react';

export default function ContactPage() {
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        subject: '',
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
                <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
                        Get in Touch
                    </h1>
                    <p className="text-xl text-gray-400 max-w-2xl mx-auto">
                        Have questions? We'd love to hear from you. Send us a message and we'll respond as soon as possible.
                    </p>
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
                                        <p className="text-gray-500">info@artistfactory.pk</p>
                                        <p className="text-gray-500">support@artistfactory.pk</p>
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
                                            Gulberg III, Lahore<br />
                                            Punjab, Pakistan
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
                                        <h2 className="text-2xl font-bold text-white mb-6">Send us a Message</h2>
                                        <form onSubmit={handleSubmit} className="space-y-6">
                                            <div className="grid sm:grid-cols-2 gap-6">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Your Name *
                                                    </label>
                                                    <input
                                                        type="text"
                                                        name="name"
                                                        value={formData.name}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-400 mb-2">
                                                        Email Address *
                                                    </label>
                                                    <input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Subject *
                                                </label>
                                                <select
                                                    name="subject"
                                                    value={formData.subject}
                                                    onChange={handleChange}
                                                    required
                                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                                >
                                                    <option value="">Select a subject</option>
                                                    <option value="booking">Booking Inquiry</option>
                                                    <option value="artist">Artist Registration</option>
                                                    <option value="support">Support</option>
                                                    <option value="feedback">Feedback</option>
                                                    <option value="other">Other</option>
                                                </select>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-400 mb-2">
                                                    Message *
                                                </label>
                                                <textarea
                                                    name="message"
                                                    value={formData.message}
                                                    onChange={handleChange}
                                                    required
                                                    rows={5}
                                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-500 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                                />
                                            </div>

                                            <button
                                                type="submit"
                                                className="w-full sm:w-auto px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
                                            >
                                                <Send className="w-5 h-5" />
                                                Send Message
                                            </button>
                                        </form>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
}
