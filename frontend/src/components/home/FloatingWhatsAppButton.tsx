'use client';

import { MessageCircle } from 'lucide-react';

export default function FloatingWhatsAppButton() {
    const whatsappMessage = "Hi, I'd like to inquire about booking an artist for my event.";

    return (
        <a
            href={`https://wa.me/923206876442?text=${encodeURIComponent(whatsappMessage)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="fixed bottom-6 right-6 z-50 group"
            aria-label="Contact us on WhatsApp"
        >
            <div className="relative">
                {/* Glowing effect */}
                <div className="absolute inset-0 bg-green-500 rounded-full blur-xl opacity-50 group-hover:opacity-75 transition-opacity duration-300" />

                {/* Button */}
                <div className="relative flex items-center justify-center w-14 h-14 bg-gradient-to-br from-green-500 to-green-600 rounded-full shadow-lg hover:shadow-xl hover:shadow-green-500/50 transition-all duration-300 hover:scale-110">
                    <MessageCircle className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
            </div>
        </a>
    );
}
