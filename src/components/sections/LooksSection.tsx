
"use client";

import React, { useRef, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { HoverSlider, HoverSliderImageWrap, HoverSliderImage, useHoverSliderContext } from '@/components/ui/HoverSlider';

const LOOKS = [
  { 
    id: '01', 
    title: 'Distressed Knit & Denim Shorts', 
    desc: 'Structured lines meeting organic forms in the outdoor landscape.', 
    images: ['https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150864/ltsey7jv4yer4mpla0fe.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150861/nar6uiwrufdjenq6jked.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150857/p8bajc1r1qixawao3s8q.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150869/k7j8bmietei6i5nnspgw.jpg'] 
  },
  { 
    id: '02', 
    title: 'Orange Puffer Bolero', 
    desc: 'High-impact bright puffy bolero sleeves over a crochet corset with balaclava.', 
    images: ['https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150874/mwvvtxtwj2m9wlkqh5yh.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150878/ykdlg8gjmrj0fyk79qmm.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150882/oz6hfwkqlzppjolvfhl5.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150898/ivjejcyai0wjp1o2noij.jpg'] 
  },
  { 
    id: '03', 
    title: 'Colorblock Cropped Jacket', 
    desc: 'Utility re-contextualized. Two-tone cropped jacket with structured bag.', 
    images: ['https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150886/kcz3zquesr98xpsdxfm8.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150891/lbpfqruhiv2gnjy6zzi8.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150895/xj5f1awtf9lmvgossa3c.jpg'] 
  },
  { 
    id: '04', 
    title: 'Glossy Burgundy Bomber', 
    desc: 'Deep plum cropped bomber paired with a flowing black pleated maxi skirt.', 
    images: ['https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150902/kswsxmtkbligwjvsovgq.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150905/qoeg5p3pppkevx8hpls0.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150909/ne6t02iw87crszhn2bvf.jpg'] 
  },
  { 
    id: '05', 
    title: 'Tasseled Tunic & Coral Puff', 
    desc: 'Artisanal cream mini dress with long fringe and contrasting voluminous coral sleeves.', 
    images: ['https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150913/d9dje905snc4qt4iecaj.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150916/cnod4bbu5i2okwhhdd37.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150920/klc5m8mu6ammepuhoibx.jpg'] 
  },
  { 
    id: '06', 
    title: 'Distressed Knit Cape', 
    desc: 'Sculptural off-white open-knit poncho draped over sleek tailored trousers.', 
    images: ['https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150924/c4xli86n2ocibmqx0nxa.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150928/o4qyi3w9oqngdcnopwzg.jpg', 'https://res.cloudinary.com/dn72rhl1a/image/upload/q_auto,f_jpg,w_800/v1789150931/grpfcmaahvuvpoflhppo.jpg'] 
  },
];

const InteractiveRow = ({ images, children, className }: any) => {
  const { activeSlide, changeSlide } = useHoverSliderContext();
  const rowRef = useRef<HTMLDivElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const isMouseControlActive = useRef(false);
  const mouseTimeout = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    
    if (rowRef.current) {
      ScrollTrigger.create({
        trigger: rowRef.current,
        start: 'top 70%', // Start cycling when row is 70% down the screen
        end: 'bottom 30%', // Finish cycling when row leaves top 30%
        onUpdate: (self) => {
          // If mouse is currently moving over the element, let the mouse control it!
          if (!isMouseControlActive.current) {
            const total = images.length;
            let newIndex = Math.floor(self.progress * total);
            if (newIndex >= total) newIndex = total - 1;
            if (newIndex < 0) newIndex = 0;
            if (newIndex !== activeSlide) {
              changeSlide(newIndex);
            }
          }
        }
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach(t => {
        if (t.vars.trigger === rowRef.current) t.kill();
      });
    };
  }, [images.length, activeSlide, changeSlide]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!rowRef.current) return;
    
    // Mouse takes priority over scroll physics
    isMouseControlActive.current = true;
    if (mouseTimeout.current) clearTimeout(mouseTimeout.current);
    mouseTimeout.current = setTimeout(() => {
      isMouseControlActive.current = false;
    }, 500);

    const { top, height } = rowRef.current.getBoundingClientRect();
    const y = e.clientY - top;
    const segmentHeight = height / images.length;
    let newIndex = Math.floor(y / segmentHeight);
    if (newIndex >= images.length) newIndex = images.length - 1;
    if (newIndex < 0) newIndex = 0;
    
    if (newIndex !== activeSlide) {
      changeSlide(newIndex);
    }
  };

  return (
    <div 
      ref={rowRef}
      className={`relative group ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
    >
      {children}

      {/* Vertical Indicator Segments - Always slightly visible, fully opaque on hover */}
      <div className={`absolute left-4 md:left-auto md:right-0 lg:-right-8 top-1/2 -translate-y-1/2 flex flex-col gap-2 z-50 transition-opacity duration-300 ${isHovering ? 'opacity-100' : 'opacity-40'}`}>
        {images.map((_: any, imgIdx: number) => (
          <div 
            key={imgIdx} 
            className={`w-1.5 rounded-full transition-all duration-300 ${imgIdx === activeSlide ? 'h-8 bg-[#1a1a1a]' : 'h-2 bg-[#1a1a1a]/20'}`} 
          />
        ))}
      </div>
    </div>
  );
};

const LookItem = ({ look, isEven, index }: { look: any; isEven: boolean; index: number }) => {
  return (
    <HoverSlider>
      <InteractiveRow images={look.images} className={`relative flex flex-col ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'} items-center gap-12 md:gap-24 w-full cursor-ns-resize`}>
        
        {/* Number Background */}
        <div className={`absolute top-1/2 -translate-y-1/2 ${isEven ? 'left-0' : 'right-0'} font-serif font-bold text-[15rem] md:text-[25rem] text-[#1a1a1a] opacity-[0.03] pointer-events-none select-none z-0 tracking-tighter leading-none`}>
          {look.id}
        </div>

        {/* Image Wrap (Passive container now) */}
        <HoverSliderImageWrap id={look.id === '06' ? 'look-06-image' : undefined} className="w-full md:w-3/5 h-[60vh] md:h-[80vh] relative z-10 pointer-events-none">
          {look.images.map((src: string, imgIdx: number) => (
            <HoverSliderImage 
              key={src}
              index={imgIdx} 
              imageUrl={src} 
            />
          ))}
        </HoverSliderImageWrap>

        {/* Text */}
        <div className={`w-full md:w-2/5 relative z-10 ${isEven ? 'text-left' : 'text-left md:text-right'} pointer-events-none`}>
          <p className="font-serif text-xs tracking-[0.3em] uppercase text-[#1a1a1a] opacity-60 mb-4">Look — {look.id}</p>
          <h3 className="font-serif font-bold text-3xl md:text-5xl text-[#1a1a1a] mb-6">{look.title}</h3>
          <p className={`font-sans text-[#4a4a4a] font-light leading-relaxed max-w-[400px] ${isEven ? '' : 'md:ml-auto'}`}>
            {look.desc}
          </p>
        </div>
      </InteractiveRow>
    </HoverSlider>
  );
};

export default function LooksSection() {
  return (
    <section id="looks" className="py-24 bg-[#f4f4f0] overflow-hidden">
      <div className="max-w-[1400px] mx-auto px-6 md:px-12">
        <div className="text-center mb-32">
          <p className="font-serif text-[0.6rem] tracking-[0.4em] uppercase text-[#1a1a1a] opacity-60 mb-4">Editorial 01</p>
          <h2 className="font-serif font-bold text-4xl md:text-6xl text-[#1a1a1a]">The Looks</h2>
        </div>

        <div className="flex flex-col gap-32 md:gap-48">
          {LOOKS.map((look, index) => (
            <LookItem key={look.id} look={look} isEven={index % 2 === 0} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
