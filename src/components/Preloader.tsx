"use client";

import React, { useEffect, useState } from 'react';

export default function Preloader() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    // Wait for initial render + small buffer
    const timer = setTimeout(() => {
      setLoaded(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loaded) return null;

  return (
    <div
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-bg-primary transition-opacity duration-800 ease-in-out ${
        loaded ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      <div className="font-serif text-2xl tracking-[0.4em] font-bold text-void mb-6 animate-pulse">
        ERID
      </div>
      <div className="w-[200px] h-[2px] bg-black/10 relative overflow-hidden">
        <div 
          className="absolute top-0 left-0 h-full bg-signal w-0"
          style={{
            animation: 'loadProgress 2s ease-in-out forwards'
          }}
        ></div>
      </div>
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes loadProgress {
          0% { width: 0%; }
          50% { width: 70%; }
          100% { width: 100%; }
        }
      `}} />
    </div>
  );
}
