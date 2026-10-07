import React from 'react';

interface RilaLogoProps {
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  variant?: 'icon' | 'compact' | 'full';
  showSubtitle?: boolean;
  className?: string;
  useImage?: boolean;
}

export const RilaLogo: React.FC<RilaLogoProps> = ({
  size = 'md',
  variant = 'compact',
  showSubtitle = true,
  className = '',
  useImage = false,
}) => {
  const sizeMap = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-14 h-14',
    xl: 'w-20 h-20',
    '2xl': 'w-28 h-28',
  };

  const iconDimension = sizeMap[size] || 'w-10 h-10';

  // Vector SVG rendition matching the official Rila Solutions hexagon emblem with Wi-Fi signal arcs
  const renderVectorIcon = () => (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl bg-slate-950/80 p-1 shadow-lg shadow-emerald-950/40 border border-slate-800 ${iconDimension} ${className}`}
    >
      <svg
        viewBox="0 0 200 200"
        className="w-full h-full drop-shadow-md select-none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Cyber Blue Gradient for R and Left Hexagon */}
          <linearGradient id="rilaBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="100%" stop-color="#0369a1" />
          </linearGradient>

          {/* Emerald Green Gradient for S and Right Hexagon */}
          <linearGradient id="rilaGreenGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#34d399" />
            <stop offset="100%" stop-color="#059669" />
          </linearGradient>

          {/* Hexagon Border Dual-Gradient */}
          <linearGradient id="rilaHexGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#0284c7" />
            <stop offset="50%" stop-color="#06b6d4" />
            <stop offset="100%" stop-color="#10b981" />
          </linearGradient>

          {/* Subtle Glow */}
          <filter id="rilaGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        {/* Outer Hexagon Shield Badge */}
        <path
          d="M 100,10 
             L 175,52 
             L 175,148 
             L 100,190 
             L 25,148 
             L 25,52 
             Z"
          fill="#090d16"
          stroke="url(#rilaHexGrad)"
          strokeWidth="10"
          strokeLinejoin="round"
          filter="url(#rilaGlow)"
        />

        {/* Inside Hexagon Accent Ring */}
        <path
          d="M 100,22 
             L 165,58 
             L 165,142 
             L 100,178 
             L 35,142 
             L 35,58 
             Z"
          fill="none"
          stroke="url(#rilaHexGrad)"
          strokeWidth="2"
          opacity="0.35"
          strokeLinejoin="round"
        />

        {/* Interlocking Monogram: R (Cyber Blue) & S (Emerald Green) */}
        {/* Letter 'R' Geometry */}
        <g fill="none" stroke="url(#rilaBlueGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          {/* R Vertical Stem */}
          <path d="M 68,60 L 68,140" />
          {/* R Upper Loop */}
          <path d="M 68,64 C 95,64 105,75 105,88 C 105,102 92,108 68,108" />
          {/* R Diagonal Leg */}
          <path d="M 88,106 L 112,140" />
        </g>

        {/* Wi-Fi Signal Arcs inside R's upper loop */}
        <g stroke="#38bdf8" fill="none" strokeWidth="4" strokeLinecap="round">
          {/* Small dot */}
          <circle cx="86" cy="88" r="2.5" fill="#38bdf8" stroke="none" />
          {/* Inner arc */}
          <path d="M 80,82 A 9 9 0 0 1 92,82" />
          {/* Outer arc */}
          <path d="M 76,77 A 15 15 0 0 1 96,77" />
        </g>

        {/* Letter 'S' Geometry (Emerald Green) */}
        <g fill="none" stroke="url(#rilaGreenGrad)" strokeWidth="12" strokeLinecap="round" strokeLinejoin="round">
          <path d="M 136,75 C 132,65 116,65 108,72 C 98,80 110,96 122,102 C 136,110 138,124 130,134 C 122,143 104,142 98,135" />
        </g>

        {/* Wi-Fi Signal Arcs radiating from top of S */}
        <g stroke="#34d399" fill="none" strokeWidth="4" strokeLinecap="round">
          {/* Inner wave */}
          <path d="M 124,54 A 12 12 0 0 1 144,64" />
          {/* Middle wave */}
          <path d="M 128,47 A 19 19 0 0 1 154,60" />
          {/* Outer wave */}
          <path d="M 132,40 A 26 26 0 0 1 164,56" />
        </g>
      </svg>
    </div>
  );

  // Raster image alternative
  const renderRasterIcon = () => (
    <div
      className={`relative inline-flex items-center justify-center shrink-0 rounded-2xl overflow-hidden bg-slate-950 p-0.5 border border-slate-800 shadow-lg shadow-emerald-950/40 ${iconDimension} ${className}`}
    >
      <img
        src="/rila-logo.png"
        alt="Rila Solutions Logo"
        className="w-full h-full object-cover rounded-xl"
        onError={(e) => {
          // If image fails to load, replace with vector SVG
          (e.currentTarget as HTMLElement).style.display = 'none';
        }}
      />
    </div>
  );

  const iconElement = useImage ? renderRasterIcon() : renderVectorIcon();

  if (variant === 'icon') {
    return iconElement;
  }

  return (
    <div className="inline-flex items-center gap-3 select-none">
      {iconElement}
      <div className="leading-tight">
        <div className="flex items-center gap-2">
          <span className="font-black text-base sm:text-lg tracking-tight text-white transition">
            RILA <span className="text-emerald-400">SOLUTIONS</span>
          </span>
          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
            CBT PRO
          </span>
        </div>
        {showSubtitle && (
          <p className="text-[11px] text-slate-400 font-medium tracking-wide">
            JAMB UTME Practice Engine & Analytics
          </p>
        )}
      </div>
    </div>
  );
};
