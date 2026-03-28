'use client';

import { useEffect, ReactNode } from 'react';
import Lenis from 'lenis';

interface SmoothScrollProps {
  children: ReactNode;
}

export default function SmoothScroll({ children }: SmoothScrollProps) {
  useEffect(() => {
    // Initialize Lenis
    const lenis = new Lenis({
        lerp: 0.1, // Smoothness (0-1)
        wheelMultiplier: 1,
        touchMultiplier: 2,
        infinite: false,
    });

    // Request Animation Frame for Lenis
    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    // Initial scroll setup to prevent sticky feeling
    window.scrollTo(0, 0);

    return () => {
      lenis.destroy();
    };
  }, []);

  return <>{children}</>;
}
