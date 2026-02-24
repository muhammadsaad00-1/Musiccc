'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function SplashScreen() {
  const [dots, setDots] = useState('');

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? '' : prev + '.'));
    }, 500);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0a0a0b]">
      {/* Animated background gradient */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-purple-900/20 rounded-full blur-[120px] animate-pulse" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-orange-900/20 rounded-full blur-[100px] animate-pulse delay-1000" />
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center space-y-8">
        {/* Logo */}
        <div className="relative group">
          <div className="absolute -inset-2 bg-gradient-to-r from-orange-500 to-pink-600 rounded-full blur-xl opacity-30 group-hover:opacity-50 animate-pulse"></div>
          <div className="relative bg-[#0a0a0b] rounded-full p-4 border-2 border-white/10">
            <Image
              src="/logo-taf.png"
              alt="The Artist Factory"
              width={100}
              height={100}
              className="w-24 h-24 object-contain animate-pulse"
              priority
            />
          </div>
        </div>

        {/* Brand name */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-white tracking-tight">
            The Artist Factory
          </h1>
          <p className="text-sm text-orange-400 italic font-medium tracking-wide">
            Bringing stars to your event!
          </p>
        </div>

        {/* Loading indicator */}
        <div className="flex items-center space-x-2">
          <div className="flex space-x-1">
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
            <div className="w-2 h-2 bg-orange-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
          </div>
        </div>

        {/* Loading text */}
        <p className="text-gray-400 text-sm font-medium">
          Loading amazing artists{dots}
        </p>

        {/* Progress bar */}
        <div className="w-64 h-1 bg-white/10 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-orange-500 to-pink-600 rounded-full animate-[shimmer_2s_ease-in-out_infinite]"></div>
        </div>
      </div>

      <style jsx>{`
        @keyframes shimmer {
          0% {
            width: 0%;
            margin-left: 0%;
          }
          50% {
            width: 70%;
            margin-left: 15%;
          }
          100% {
            width: 0%;
            margin-left: 100%;
          }
        }
      `}</style>
    </div>
  );
}
