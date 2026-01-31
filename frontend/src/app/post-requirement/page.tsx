'use client';

import { useState, useEffect } from 'react';
import { Send, CheckCircle, Calendar, MapPin, Music, DollarSign, User, Mail, Phone, MessageSquare, Sparkles, ChevronRight, ArrowLeft, Clock, Shield, Star, Zap, PartyPopper, Briefcase, Users, Heart } from 'lucide-react';
import { eventTypes, cities } from '@/lib/mockData';

// Floating particles component for background
const FloatingParticles = () => {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
                <div
                    key={i}
                    className="absolute w-1 h-1 bg-white/20 rounded-full animate-float"
                    style={{
                        left: `${Math.random() * 100}%`,
                        top: `${Math.random() * 100}%`,
                        animationDelay: `${Math.random() * 5}s`,
                        animationDuration: `${5 + Math.random() * 10}s`,
                    }}
                />
            ))}
        </div>
    );
};

// Artist type card component
const ArtistTypeCard = ({ icon: Icon, label, value, selected, onClick, color }: {
    icon: any;
    label: string;
    value: string;
    selected: boolean;
    onClick: () => void;
    color: string;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`relative p-4 rounded-2xl border-2 transition-all duration-300 group flex flex-col items-center gap-2 ${selected
                ? `bg-gradient-to-br ${color} border-transparent shadow-lg scale-105`
                : 'bg-[#0a0a0b]/80 border-gray-800 hover:border-gray-700 hover:bg-[#111]'
            }`}
    >
        <div className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${selected ? 'bg-white/20' : 'bg-gradient-to-br from-gray-800 to-gray-900'
            }`}>
            <Icon className={`w-6 h-6 ${selected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`} />
        </div>
        <span className={`text-sm font-medium ${selected ? 'text-white' : 'text-gray-400 group-hover:text-white'}`}>
            {label}
        </span>
        {selected && (
            <div className="absolute -top-1 -right-1 w-5 h-5 bg-white rounded-full flex items-center justify-center">
                <CheckCircle className="w-4 h-4 text-green-500" />
            </div>
        )}
    </button>
);

// Budget option card
const BudgetCard = ({ range, label, selected, onClick }: {
    range: string;
    label: string;
    selected: boolean;
    onClick: () => void;
}) => (
    <button
        type="button"
        onClick={onClick}
        className={`p-4 rounded-2xl border-2 transition-all duration-300 text-left ${selected
                ? 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500/50 shadow-lg shadow-orange-500/10'
                : 'bg-[#0a0a0b]/80 border-gray-800 hover:border-gray-700'
            }`}
    >
        <div className={`text-lg font-bold mb-1 ${selected ? 'text-white' : 'text-gray-300'}`}>
            {range}
        </div>
        <div className="text-xs text-gray-500">{label}</div>
        {selected && (
            <CheckCircle className="absolute top-3 right-3 w-5 h-5 text-orange-400" />
        )}
    </button>
);

export default function PostRequirementPage() {
    const [step, setStep] = useState(1);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [isAnimating, setIsAnimating] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
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

    // Auto-fill effect for step transitions
    const [showStepContent, setShowStepContent] = useState(true);

    useEffect(() => {
        setShowStepContent(true);
    }, [step]);

    const artistTypes = [
        { icon: Music, label: 'Singer', value: 'singer', color: 'from-purple-500 to-pink-600' },
        { icon: Users, label: 'Band', value: 'musician', color: 'from-blue-500 to-cyan-600' },
        { icon: Zap, label: 'DJ', value: 'dj', color: 'from-yellow-500 to-orange-600' },
        { icon: Heart, label: 'Dancer', value: 'dancer', color: 'from-pink-500 to-rose-600' },
        { icon: Star, label: 'Comedian', value: 'comedian', color: 'from-green-500 to-emerald-600' },
        { icon: Briefcase, label: 'Other', value: 'other', color: 'from-gray-500 to-gray-600' },
    ];

    const budgetOptions = [
        { range: 'Under 50K', label: 'Budget-friendly', value: 'under-50k' },
        { range: '50K - 100K', label: 'Standard', value: '50k-100k' },
        { range: '100K - 300K', label: 'Premium', value: '100k-300k' },
        { range: '300K - 500K', label: 'Luxury', value: '300k-500k' },
        { range: '500K+', label: 'Celebrity', value: '500k+' },
    ];

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const submitData = new FormData();
            Object.entries(formData).forEach(([key, value]) => {
                submitData.append(key, value);
            });

            const response = await fetch('http://localhost:8001/api/submit-requirement', {
                method: 'POST',
                body: submitData
            });

            if (response.ok) {
                setIsSubmitted(true);
            } else {
                alert('Failed to submit request. Please try again.');
            }
        } catch (error) {
            console.error('Error submitting form:', error);
            alert('An error occurred. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const nextStep = () => {
        setShowStepContent(false);
        setIsAnimating(true);
        setTimeout(() => {
            setStep(step + 1);
            setIsAnimating(false);
        }, 200);
    };

    const prevStep = () => {
        setShowStepContent(false);
        setIsAnimating(true);
        setTimeout(() => {
            setStep(step - 1);
            setIsAnimating(false);
        }, 200);
    };

    const stepLabels = ['Event', 'Artist', 'Budget', 'Contact'];
    const totalSteps = 4;

    // Success screen with confetti effect
    if (isSubmitted) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b] relative overflow-hidden">
                <FloatingParticles />

                {/* Success background effects */}
                <div className="absolute inset-0">
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/20 rounded-full blur-3xl animate-pulse" />
                    <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl animate-pulse delay-1000" />
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-radial from-green-500/10 to-transparent rounded-full" />
                </div>

                <div className="relative text-center max-w-lg mx-auto px-6">
                    {/* Animated success icon */}
                    <div className="relative mb-8">
                        <div className="absolute inset-0 bg-green-500/30 blur-3xl rounded-full animate-ping" />
                        <div className="relative w-28 h-28 bg-gradient-to-br from-green-400 via-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-2xl shadow-green-500/40 rotate-3 hover:rotate-0 transition-transform duration-500">
                            <PartyPopper className="w-14 h-14 text-white animate-bounce" />
                        </div>
                    </div>

                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                        You're <span className="bg-gradient-to-r from-green-400 via-emerald-400 to-teal-400 bg-clip-text text-transparent">All Set!</span>
                    </h1>

                    <p className="text-gray-400 text-lg mb-4 leading-relaxed">
                        Your request has been submitted successfully.
                    </p>

                    {/* Timeline preview */}
                    <div className="bg-[#111113]/80 backdrop-blur-xl rounded-2xl border border-gray-800/50 p-6 mb-8">
                        <div className="flex items-center justify-between text-sm mb-4">
                            <span className="text-gray-500">What happens next?</span>
                            <span className="text-green-400 font-medium">24h Response</span>
                        </div>
                        <div className="space-y-3">
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                                    <CheckCircle className="w-4 h-4 text-green-400" />
                                </div>
                                <span className="text-gray-300 text-sm">Request received</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-orange-500/20 flex items-center justify-center">
                                    <Clock className="w-4 h-4 text-orange-400" />
                                </div>
                                <span className="text-gray-400 text-sm">Team reviews your requirements</span>
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="w-8 h-8 rounded-full bg-pink-500/20 flex items-center justify-center">
                                    <Star className="w-4 h-4 text-pink-400" />
                                </div>
                                <span className="text-gray-400 text-sm">Get personalized artist recommendations</span>
                            </div>
                        </div>
                    </div>

                    <a
                        href="/"
                        className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-green-500/30 hover:scale-105 transition-all duration-300"
                    >
                        <ArrowLeft className="w-5 h-5" />
                        Back to Home
                    </a>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#0a0a0b] py-12 sm:py-16 relative overflow-hidden">
            <FloatingParticles />

            {/* Animated background gradients */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -right-40 w-[600px] h-[600px] bg-gradient-to-br from-orange-500/20 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse" />
                <div className="absolute -bottom-40 -left-40 w-[500px] h-[500px] bg-gradient-to-tr from-purple-600/15 via-pink-500/10 to-transparent rounded-full blur-3xl animate-pulse delay-1000" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-orange-500/5 to-transparent rounded-full" />
            </div>

            <div className="max-w-2xl mx-auto px-4 sm:px-6 relative">
                {/* Header */}
                <div className="text-center mb-10">
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-500/10 to-pink-500/10 border border-orange-500/20 rounded-full mb-6">
                        <Sparkles className="w-4 h-4 text-orange-400" />
                        <span className="text-sm font-medium text-orange-300">Book Your Dream Artist</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-bold text-white mb-4 tracking-tight">
                        Let's Plan Your <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-500 bg-clip-text text-transparent">Event</span>
                    </h1>
                    <p className="text-gray-400 text-lg max-w-md mx-auto">
                        Tell us what you need and we'll find the perfect match
                    </p>
                </div>

                {/* Enhanced Progress Steps */}
                <div className="mb-10">
                    <div className="flex items-center justify-between max-w-lg mx-auto relative">
                        {/* Progress line background */}
                        <div className="absolute top-5 left-8 right-8 h-1.5 bg-gray-800/80 rounded-full" />
                        {/* Active progress line with glow */}
                        <div
                            className="absolute top-5 left-8 h-1.5 bg-gradient-to-r from-orange-500 via-pink-500 to-purple-500 rounded-full transition-all duration-500 ease-out shadow-lg shadow-pink-500/30"
                            style={{ width: `${((step - 1) / (totalSteps - 1)) * (100 - 10)}%` }}
                        />

                        {[1, 2, 3, 4].map((s) => (
                            <div key={s} className="relative z-10 flex flex-col items-center gap-2">
                                <div
                                    className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm transition-all duration-300 ${s < step
                                            ? 'bg-gradient-to-br from-green-500 to-emerald-600 text-white shadow-lg shadow-green-500/30'
                                            : s === step
                                                ? 'bg-gradient-to-br from-orange-500 to-pink-600 text-white shadow-xl shadow-pink-500/40 scale-110 ring-4 ring-pink-500/20'
                                                : 'bg-[#1a1a1a] text-gray-500 border border-gray-700'
                                        }`}
                                >
                                    {s < step ? (
                                        <CheckCircle className="w-5 h-5" />
                                    ) : (
                                        s
                                    )}
                                </div>
                                <span className={`text-xs font-medium transition-colors duration-300 ${s <= step ? 'text-white' : 'text-gray-500'
                                    }`}>
                                    {stepLabels[s - 1]}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Form Card */}
                <form onSubmit={handleSubmit} className="relative">
                    {/* Glowing border effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-orange-500/40 via-pink-500/40 to-purple-500/40 rounded-[28px] blur-lg opacity-50 group-hover:opacity-75 transition-opacity" />

                    <div className="relative bg-[#111113]/95 backdrop-blur-xl rounded-3xl border border-gray-800/50 p-8 sm:p-10 shadow-2xl">

                        {/* Step 1: Event Details */}
                        <div className={`transition-all duration-300 ${step === 1 ? 'opacity-100' : 'hidden'} ${isAnimating ? 'opacity-0 translate-x-4' : ''}`}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-orange-500 to-pink-600 flex items-center justify-center shadow-lg shadow-orange-500/30">
                                    <Calendar className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Event Details</h2>
                                    <p className="text-sm text-gray-500">When and where is your event?</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                                        <PartyPopper className="w-4 h-4 text-orange-400" />
                                        What's the occasion? <span className="text-pink-400">*</span>
                                    </label>
                                    <select
                                        name="eventType"
                                        value={formData.eventType}
                                        onChange={handleChange}
                                        required
                                        className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white focus:ring-0 focus:border-orange-500/50 transition-all duration-300 hover:border-gray-700 cursor-pointer appearance-none"
                                        style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
                                    >
                                        <option value="">Select event type</option>
                                        {eventTypes.map((type) => (
                                            <option key={type} value={type}>{type}</option>
                                        ))}
                                    </select>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                                            <Calendar className="w-4 h-4 text-orange-400" />
                                            Date <span className="text-pink-400">*</span>
                                        </label>
                                        <input
                                            type="date"
                                            name="eventDate"
                                            value={formData.eventDate}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white focus:ring-0 focus:border-orange-500/50 transition-all duration-300 hover:border-gray-700 cursor-pointer"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                                            <MapPin className="w-4 h-4 text-orange-400" />
                                            City <span className="text-pink-400">*</span>
                                        </label>
                                        <select
                                            name="eventLocation"
                                            value={formData.eventLocation}
                                            onChange={handleChange}
                                            required
                                            className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white focus:ring-0 focus:border-orange-500/50 transition-all duration-300 hover:border-gray-700 cursor-pointer appearance-none"
                                            style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%23f97316'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'%3E%3C/path%3E%3C/svg%3E")`, backgroundRepeat: 'no-repeat', backgroundPosition: 'right 1rem center', backgroundSize: '1.5rem' }}
                                        >
                                            <option value="">Select city</option>
                                            {cities.map((city) => (
                                                <option key={city} value={city}>{city}</option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <button
                                    type="button"
                                    onClick={nextStep}
                                    disabled={!formData.eventType || !formData.eventDate || !formData.eventLocation}
                                    className="w-full py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
                                >
                                    Continue
                                    <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                </button>
                            </div>
                        </div>

                        {/* Step 2: Artist Type Selection */}
                        <div className={`transition-all duration-300 ${step === 2 ? 'opacity-100' : 'hidden'} ${isAnimating ? 'opacity-0 translate-x-4' : ''}`}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg shadow-purple-500/30">
                                    <Music className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Choose Artist Type</h2>
                                    <p className="text-sm text-gray-500">What kind of performer do you need?</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-3 gap-3">
                                    {artistTypes.map((type) => (
                                        <ArtistTypeCard
                                            key={type.value}
                                            icon={type.icon}
                                            label={type.label}
                                            value={type.value}
                                            color={type.color}
                                            selected={formData.artistType === type.value}
                                            onClick={() => setFormData({ ...formData, artistType: type.value })}
                                        />
                                    ))}
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 py-4 bg-[#1a1a1a] text-gray-300 font-semibold rounded-2xl hover:bg-[#222] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 border border-gray-800"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        disabled={!formData.artistType}
                                        className="flex-1 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Continue
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Step 3: Budget Selection */}
                        <div className={`transition-all duration-300 ${step === 3 ? 'opacity-100' : 'hidden'} ${isAnimating ? 'opacity-0 translate-x-4' : ''}`}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg shadow-green-500/30">
                                    <DollarSign className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Set Your Budget</h2>
                                    <p className="text-sm text-gray-500">How much would you like to spend? (PKR)</p>
                                </div>
                            </div>

                            <div className="space-y-6">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                                    {budgetOptions.map((option) => (
                                        <button
                                            key={option.value}
                                            type="button"
                                            onClick={() => setFormData({ ...formData, budget: option.value })}
                                            className={`relative p-4 rounded-2xl border-2 transition-all duration-300 text-center ${formData.budget === option.value
                                                    ? 'bg-gradient-to-br from-orange-500/20 to-pink-500/20 border-orange-500/50 shadow-lg shadow-orange-500/10'
                                                    : 'bg-[#0a0a0b]/80 border-gray-800 hover:border-gray-700'
                                                }`}
                                        >
                                            <div className={`text-lg font-bold mb-1 ${formData.budget === option.value ? 'text-white' : 'text-gray-300'}`}>
                                                {option.range}
                                            </div>
                                            <div className="text-xs text-gray-500">{option.label}</div>
                                            {formData.budget === option.value && (
                                                <div className="absolute -top-1 -right-1 w-5 h-5 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center">
                                                    <CheckCircle className="w-3 h-3 text-white" />
                                                </div>
                                            )}
                                        </button>
                                    ))}
                                </div>

                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                                        <MessageSquare className="w-4 h-4 text-orange-400" />
                                        Additional Details (Optional)
                                    </label>
                                    <textarea
                                        name="message"
                                        value={formData.message}
                                        onChange={handleChange}
                                        rows={3}
                                        placeholder="Any specific requirements, preferred songs, special requests..."
                                        className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-orange-500/50 transition-all duration-300 hover:border-gray-700 resize-none"
                                    />
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 py-4 bg-[#1a1a1a] text-gray-300 font-semibold rounded-2xl hover:bg-[#222] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 border border-gray-800"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        type="button"
                                        onClick={nextStep}
                                        className="flex-1 py-4 bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-pink-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 group"
                                    >
                                        Continue
                                        <ChevronRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Step 4: Contact Info */}
                        <div className={`transition-all duration-300 ${step === 4 ? 'opacity-100' : 'hidden'} ${isAnimating ? 'opacity-0 translate-x-4' : ''}`}>
                            <div className="flex items-center gap-3 mb-8">
                                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg shadow-blue-500/30">
                                    <User className="w-7 h-7 text-white" />
                                </div>
                                <div>
                                    <h2 className="text-2xl font-bold text-white">Almost Done!</h2>
                                    <p className="text-sm text-gray-500">How can we reach you?</p>
                                </div>
                            </div>

                            <div className="space-y-5">
                                <div className="group">
                                    <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                                        <User className="w-4 h-4 text-blue-400" />
                                        Your Name <span className="text-pink-400">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                        placeholder="Muhammad Ahmed"
                                        className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-700"
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div className="group">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                                            <Mail className="w-4 h-4 text-blue-400" />
                                            Email <span className="text-pink-400">*</span>
                                        </label>
                                        <input
                                            type="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                            required
                                            placeholder="you@email.com"
                                            className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-700"
                                        />
                                    </div>

                                    <div className="group">
                                        <label className="flex items-center gap-2 text-sm font-medium text-gray-300 mb-3">
                                            <Phone className="w-4 h-4 text-blue-400" />
                                            Phone <span className="text-pink-400">*</span>
                                        </label>
                                        <input
                                            type="tel"
                                            name="phone"
                                            value={formData.phone}
                                            onChange={handleChange}
                                            required
                                            placeholder="03XX XXXXXXX"
                                            className="w-full px-5 py-4 bg-[#0a0a0b]/80 border-2 border-gray-800 rounded-2xl text-white placeholder-gray-600 focus:ring-0 focus:border-blue-500/50 transition-all duration-300 hover:border-gray-700"
                                        />
                                    </div>
                                </div>

                                {/* Summary Preview */}
                                <div className="bg-gradient-to-br from-gray-800/30 to-gray-900/30 rounded-2xl p-5 border border-gray-800/50">
                                    <h3 className="text-sm font-medium text-gray-400 mb-3">Booking Summary</h3>
                                    <div className="grid grid-cols-2 gap-3 text-sm">
                                        <div>
                                            <span className="text-gray-500">Event:</span>
                                            <span className="text-white ml-2">{formData.eventType || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Date:</span>
                                            <span className="text-white ml-2">{formData.eventDate || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Location:</span>
                                            <span className="text-white ml-2">{formData.eventLocation || '-'}</span>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Artist:</span>
                                            <span className="text-white ml-2 capitalize">{formData.artistType || '-'}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex gap-4">
                                    <button
                                        type="button"
                                        onClick={prevStep}
                                        className="flex-1 py-4 bg-[#1a1a1a] text-gray-300 font-semibold rounded-2xl hover:bg-[#222] hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-2 border border-gray-800"
                                    >
                                        <ArrowLeft className="w-5 h-5" />
                                        Back
                                    </button>
                                    <button
                                        type="submit"
                                        disabled={isLoading || !formData.name || !formData.email || !formData.phone}
                                        className="flex-1 py-4 bg-gradient-to-r from-green-500 via-emerald-500 to-teal-500 text-white font-semibold rounded-2xl hover:shadow-2xl hover:shadow-green-500/30 hover:scale-[1.02] transition-all duration-300 flex items-center justify-center gap-3 group disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <>
                                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Submitting...
                                            </>
                                        ) : (
                                            <>
                                                <Send className="w-5 h-5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                                Submit Request
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>

                {/* Enhanced Trust indicators */}
                <div className="mt-10 text-center">
                    <div className="inline-flex flex-wrap items-center justify-center gap-4 sm:gap-6 px-6 py-4 bg-[#111113]/60 backdrop-blur-sm rounded-2xl border border-gray-800/50">
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-green-400" />
                            </div>
                            <span className="text-sm text-gray-400">Quick Response</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-gray-700" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
                                <Star className="w-4 h-4 text-orange-400" />
                            </div>
                            <span className="text-sm text-gray-400">500+ Artists</span>
                        </div>
                        <div className="hidden sm:block w-px h-6 bg-gray-700" />
                        <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-lg bg-pink-500/20 flex items-center justify-center">
                                <Shield className="w-4 h-4 text-pink-400" />
                            </div>
                            <span className="text-sm text-gray-400">Secure Booking</span>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0) rotate(0deg); opacity: 0.3; }
                    50% { transform: translateY(-20px) rotate(180deg); opacity: 0.6; }
                }
                .animate-float {
                    animation: float linear infinite;
                }
            `}</style>
        </div>
    );
}
