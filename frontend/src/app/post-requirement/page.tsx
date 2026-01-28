'use client';

import { useState } from 'react';
import { Send, CheckCircle } from 'lucide-react';
import { eventTypes, cities } from '@/lib/mockData';

export default function PostRequirementPage() {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [formData, setFormData] = useState({
        eventType: '',
        eventDate: '',
        eventLocation: '',
        budget: '',
        artistType: '',
        name: '',
        email: '',
        phone: '',
        message: '',
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Form submitted:', formData);
        setIsSubmitted(true);
    };

    const nextStep = () => setStep(step + 1);
    const prevStep = () => setStep(step - 1);

    if (isSubmitted) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-[#0a0a0b]">
                <div className="text-center max-w-md mx-auto px-4">
                    <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
                        <CheckCircle className="w-10 h-10 text-green-400" />
                    </div>
                    <h1 className="text-3xl font-bold text-white mb-4">Request Submitted!</h1>
                    <p className="text-gray-400 mb-8">
                        Thank you for your inquiry. Our team will review your requirements and get back to you within 24 hours
                        with artist recommendations.
                    </p>
                    <a
                        href="/"
                        className="inline-block px-8 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                    >
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] py-12">
            <div className="max-w-2xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-10">
                    <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                        Post Your Requirement
                    </h1>
                    <p className="text-gray-400">
                        Tell us about your event and we'll help you find the perfect artists
                    </p>
                </div>

                {/* Progress Steps */}
                <div className="flex items-center justify-center gap-4 mb-10">
                    {[1, 2, 3].map((s) => (
                        <div key={s} className="flex items-center gap-2">
                            <div
                                className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-colors ${s <= step
                                        ? 'bg-gradient-to-r from-orange-500 to-pink-600 text-white'
                                        : 'bg-[#1a1a1a] text-gray-500 border border-gray-700'
                                    }`}
                            >
                                {s}
                            </div>
                            {s < 3 && (
                                <div className={`w-12 h-1 ${s < step ? 'bg-gradient-to-r from-orange-500 to-pink-600' : 'bg-gray-700'}`} />
                            )}
                        </div>
                    ))}
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="bg-[#1a1a1a] rounded-2xl border border-gray-800 p-8">
                    {/* Step 1: Event Details */}
                    {step === 1 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Event Details</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Event Type *</label>
                                <select
                                    name="eventType"
                                    value={formData.eventType}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Select event type</option>
                                    {eventTypes.map((type) => (
                                        <option key={type} value={type}>{type}</option>
                                    ))}
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Event Date *</label>
                                <input
                                    type="date"
                                    name="eventDate"
                                    value={formData.eventDate}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Event Location *</label>
                                <select
                                    name="eventLocation"
                                    value={formData.eventLocation}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Select city</option>
                                    {cities.map((city) => (
                                        <option key={city} value={city}>{city}</option>
                                    ))}
                                </select>
                            </div>

                            <button
                                type="button"
                                onClick={nextStep}
                                className="w-full py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                            >
                                Continue
                            </button>
                        </div>
                    )}

                    {/* Step 2: Artist Preferences */}
                    {step === 2 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Artist Preferences</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Type of Artist Needed *</label>
                                <select
                                    name="artistType"
                                    value={formData.artistType}
                                    onChange={handleChange}
                                    required
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Select artist type</option>
                                    <option value="singer">Singer</option>
                                    <option value="dj">DJ</option>
                                    <option value="musician">Musician/Band</option>
                                    <option value="dancer">Dancer</option>
                                    <option value="comedian">Comedian</option>
                                    <option value="photographer">Photographer</option>
                                    <option value="makeup">Makeup Artist</option>
                                    <option value="other">Other</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Budget Range</label>
                                <select
                                    name="budget"
                                    value={formData.budget}
                                    onChange={handleChange}
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                >
                                    <option value="">Select budget</option>
                                    <option value="under-50k">Under PKR 50,000</option>
                                    <option value="50k-100k">PKR 50,000 - 100,000</option>
                                    <option value="100k-300k">PKR 100,000 - 300,000</option>
                                    <option value="300k-500k">PKR 300,000 - 500,000</option>
                                    <option value="500k+">PKR 500,000+</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Additional Details</label>
                                <textarea
                                    name="message"
                                    value={formData.message}
                                    onChange={handleChange}
                                    rows={4}
                                    placeholder="Any specific requirements or preferences..."
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 py-3 bg-[#2a2a2a] text-gray-300 font-medium rounded-full hover:bg-[#3a3a3a] transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="button"
                                    onClick={nextStep}
                                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all"
                                >
                                    Continue
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Contact Info */}
                    {step === 3 && (
                        <div className="space-y-6">
                            <h2 className="text-xl font-semibold text-white mb-6">Contact Information</h2>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Your Name *</label>
                                <input
                                    type="text"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                    placeholder="Full name"
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Email Address *</label>
                                <input
                                    type="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    placeholder="you@example.com"
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-400 mb-2">Phone Number *</label>
                                <input
                                    type="tel"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    required
                                    placeholder="03XX XXXXXXX"
                                    className="w-full px-4 py-3 bg-[#0a0a0b] border border-gray-700 rounded-xl text-white placeholder-gray-600 focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                />
                            </div>

                            <div className="flex gap-4">
                                <button
                                    type="button"
                                    onClick={prevStep}
                                    className="flex-1 py-3 bg-[#2a2a2a] text-gray-300 font-medium rounded-full hover:bg-[#3a3a3a] transition-colors"
                                >
                                    Back
                                </button>
                                <button
                                    type="submit"
                                    className="flex-1 py-3 bg-gradient-to-r from-orange-500 to-pink-600 text-white font-medium rounded-full hover:shadow-lg hover:shadow-pink-500/30 transition-all flex items-center justify-center gap-2"
                                >
                                    <Send className="w-5 h-5" />
                                    Submit Request
                                </button>
                            </div>
                        </div>
                    )}
                </form>
            </div>
        </div>
    );
}
