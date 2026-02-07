'use client';

import { useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface BackButtonProps {
    href?: string;
    label?: string;
    className?: string;
}

export default function BackButton({ href, label = 'Back', className = '' }: BackButtonProps) {
    const router = useRouter();

    if (href) {
        return (
            <Link
                href={href}
                className={`inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group ${className}`}
            >
                <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
                    <ArrowLeft className="w-4 h-4" />
                </div>
                <span className="text-sm font-medium">{label}</span>
            </Link>
        );
    }

    return (
        <button
            onClick={() => router.back()}
            className={`inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors group ${className}`}
        >
            <div className="w-8 h-8 rounded-full bg-[#1a1a1a] border border-gray-700 flex items-center justify-center group-hover:border-orange-500/50 group-hover:bg-orange-500/10 transition-all">
                <ArrowLeft className="w-4 h-4" />
            </div>
            <span className="text-sm font-medium">{label}</span>
        </button>
    );
}
