
"use client";

import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import EridGallery from '@/components/ui/EridGallery';

// Pull all images from Look 06 as the base of the gallery, then supplement
const GALLERY_IMAGES = [
  // Look 06 images to ensure the first one matches the traveler!
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150924/c4xli86n2ocibmqx0nxa.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150928/o4qyi3w9oqngdcnopwzg.jpg', 
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150931/grpfcmaahvuvpoflhppo.jpg',
  // And the rest...
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150864/ltsey7jv4yer4mpla0fe.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150861/nar6uiwrufdjenq6jked.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150874/mwvvtxtwj2m9wlkqh5yh.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150886/kcz3zquesr98xpsdxfm8.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150902/kswsxmtkbligwjvsovgq.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150913/d9dje905snc4qt4iecaj.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150909/ne6t02iw87crszhn2bvf.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150891/lbpfqruhiv2gnjy6zzi8.jpg',
  'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150857/p8bajc1r1qixawao3s8q.jpg',
];

export default function GallerySection() {
  const containerRef = useRef<HTMLElement>(null);
  
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (containerRef.current) {
      // The smooth transition: scrub the background color of the wrapper
      // We will actually animate the body or a specific wrapper, but since we can't easily reach LooksSection from here without global state,
      // we animate the container itself, but using a very tall negative margin overlay!
      
      ScrollTrigger.create({
        trigger: containerRef.current,
        start: 'top bottom', // When Gallery just peeks in
        end: 'top top',      // When Gallery hits the top
        scrub: true,
        animation: gsap.fromTo([containerRef.current, '#looks'], 
          { backgroundColor: '#f4f4f0' }, 
          { backgroundColor: '#000000', ease: 'none' }
        )
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return (
    <section ref={containerRef} id="gallery" className="relative w-full h-screen ">
      <EridGallery images={GALLERY_IMAGES} />
      
      {/* Overlay text */}
      <div className="absolute bottom-16 left-1/2 -translate-x-1/2 z-20 text-center pointer-events-none">
        <p className="font-serif text-[#f4f4f0] text-sm md:text-base tracking-[0.2em] italic mb-6 animate-pulse opacity-80">
          The Archives
        </p>
      </div>
    </section>
  );
}
