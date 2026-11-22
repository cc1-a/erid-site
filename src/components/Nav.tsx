"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex justify-between items-center transition-all duration-400 px-6 md:px-16 ${
        scrolled ? 'py-4 bg-bg-primary/90 backdrop-blur-md border-b border-void/10' : 'py-8 bg-transparent'
      }`}
    >
      <Link href="/" className="font-serif font-bold tracking-[0.15em] text-base text-void z-10">
        ERID
      </Link>
      
      <div className="flex gap-6 md:gap-9 items-center z-10">
        <Link href="#looks" className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-mid hover:text-void transition-colors">
          Looks
        </Link>
        <Link href="#products" className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-mid hover:text-void transition-colors">
          Bags
        </Link>
        <Link href="#cardholders" className="font-sans text-xs font-medium tracking-[0.18em] uppercase text-mid hover:text-void transition-colors">
          Accessories
        </Link>
      </div>
    </nav>
  );
}
