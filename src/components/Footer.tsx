import React from 'react';

export default function Footer() {
  return (
    <footer className="flex flex-col md:flex-row justify-between items-center px-8 md:px-20 py-8 border-t border-black/10 bg-bg-primary gap-3 md:gap-0">
      <span className="font-serif text-xs tracking-[0.3em] uppercase font-bold text-void">
        ERID
      </span>
      <span className="font-serif text-[0.7rem] tracking-[0.1em] text-mid italic">
        Step back. Feel the ground.
      </span>
    </footer>
  );
}
