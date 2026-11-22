"use client";

import { useEffect } from 'react';
import Lenis from 'lenis';
import Preloader from '@/components/Preloader';
import Nav from '@/components/Nav';
import HeroSection from '@/components/sections/HeroSection';
import LooksSection from '@/components/sections/LooksSection';
import GallerySection from '@/components/sections/GallerySection';
import Footer from '@/components/Footer';

export default function Home() {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
    };
  }, []);

  return (
    <main className="relative w-full min-h-screen">
      <Preloader />
      <Nav />
      <HeroSection />
      <LooksSection />
      <GallerySection />
      <Footer />
    </main>
  );
}
