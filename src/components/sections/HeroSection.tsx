
"use client";

import React, { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

export default function HeroSection() {
  const [mounted, setMounted] = useState(false);
  const containerRef = useRef<HTMLElement>(null);
  const textRef = useRef<HTMLHeadingElement>(null);
  const tunnelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    
    gsap.registerPlugin(ScrollTrigger);
    
    if (textRef.current && containerRef.current && tunnelRef.current) {
      // Zoom into text effect
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: 'top top',
          end: '+=100px', // Exact pixel match based on user's debug value!
          pin: true,
          scrub: 1,
        }
      });

      // Scale the text up massively into the letter 'I'
      tl.to(textRef.current, {
        scale: 120, // Mathematically scaled to match the speed they liked at 0.373
        transformOrigin: '65% 50%',
        duration: 1,
        ease: 'power2.inOut',
      }, 0);
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} id="hero" className="relative w-full h-screen overflow-hidden bg-[#000000] flex items-center justify-center">
      {/* 3D Gallery Tunnel Layer */}
      <div ref={tunnelRef} className="absolute inset-0 z-0">
        <iframe
          src="/compositions/gallery-tunnel.html"
          className="w-full h-full border-none pointer-events-none"
          title="Gallery Tunnel Background"
        />
      </div>

      {/* Noise overlay for cinematic feel */}
      <div className="absolute inset-0 z-10 pointer-events-none opacity-10 mix-blend-overlay" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\"0 0 256 256\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"n\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.9\" numOctaves=\"4\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23n)\"/%3E%3C/svg%3E")' }}></div>

      {/* Foreground Layer - Zooming Text */}
      <div className="relative z-20 w-full h-full flex flex-col items-center justify-center pointer-events-none">
        <h1 
          ref={textRef}
          className="font-serif font-bold text-[#f4f4f0] leading-none tracking-tighter"
          style={{ fontSize: '20vw' }}
        >
          ERID
        </h1>
      </div>

      {/* Tagline */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <p className="font-serif text-white text-sm md:text-base tracking-[0.2em] italic mb-6 animate-pulse opacity-80">
          Step back. Feel the ground.
        </p>
        <div className="w-[1px] h-12 bg-white/20 mx-auto overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[#b81e21] origin-top animate-scroll-indicator"></div>
        </div>
      </div>
    </section>
  );
}
