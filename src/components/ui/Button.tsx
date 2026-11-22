import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export default function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button
      className={`inline-block py-[15px] px-[38px] border border-void bg-transparent text-void font-sans text-[0.7rem] font-medium tracking-[0.2em] uppercase cursor-pointer transition-all duration-300 hover:bg-signal hover:border-signal hover:text-white hover:shadow-[0_8px_30px_rgba(183,26,33,0.25)] ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
