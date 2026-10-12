import React from 'react';

interface LogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl' | 'hero';
  variant?: 'full' | 'mark-only' | 'stacked';
  theme?: 'dark' | 'light';
  className?: string;
  showSubtitle?: boolean;
}

export const Logo: React.FC<LogoProps> = ({
  size = 'md',
  variant = 'full',
  theme = 'dark',
  className = '',
  showSubtitle = true,
}) => {
  // Dimensions for the icon mark
  const dimensions = {
    sm: { box: 32, text: 'text-base', sub: 'text-[9px]', gap: 'gap-2' },
    md: { box: 40, text: 'text-lg', sub: 'text-[10px]', gap: 'gap-2.5' },
    lg: { box: 52, text: 'text-2xl', sub: 'text-xs', gap: 'gap-3.5' },
    xl: { box: 68, text: 'text-3xl', sub: 'text-xs', gap: 'gap-4' },
    hero: { box: 96, text: 'text-5xl', sub: 'text-sm', gap: 'gap-5' },
  }[size];

  return (
    <div className={`inline-flex items-center ${dimensions.gap} select-none ${className}`}>
      {/* 
        THE BUKRA FINANCIAL BRAND MARK:
        - Symbolizes a large monetary unit/coin cleanly slashed & divided into 3 equal, accessible installment segments.
        - The precision diagonal slashes represent taking a heavy single lump-sum and splitting it into transparent, zero-interest slices.
        - The overall silhouette simultaneously forms the letter "B" and a currency crest.
        - Colors: Deep Forest Green (#14532D) & Vibrant Tech Green (#22C55E).
      */}
      <div
        className="relative shrink-0 flex items-center justify-center transition-transform duration-200 group-hover:scale-105"
        style={{ width: dimensions.box, height: dimensions.box }}
      >
        <svg
          viewBox="0 0 64 64"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-sm"
        >
          <defs>
            {/* Primary Forest Green Linear Gradient (#14532D to #22C55E) */}
            <linearGradient id="forest_emerald_grad" x1="6" y1="6" x2="58" y2="58" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#14532D" /> {/* Deep Forest Green */}
              <stop offset="55%" stopColor="#166534" />
              <stop offset="100%" stopColor="#22C55E" /> {/* Vibrant Tech Green */}
            </linearGradient>

            {/* Accent Vibrant Green Gradient */}
            <linearGradient id="vibrant_slash_grad" x1="20" y1="12" x2="54" y2="48" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#22C55E" />
              <stop offset="100%" stopColor="#4ADE80" />
            </linearGradient>

            {/* Inner Glow / Coin Rim */}
            <radialGradient id="coin_ambient" cx="50%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#22C55E" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#14532D" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Background Badge: Subtle, ultra-clean rounded square container */}
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="16"
            fill="url(#forest_emerald_grad)"
          />
          <rect
            x="2"
            y="2"
            width="60"
            height="60"
            rx="16"
            fill="url(#coin_ambient)"
          />

          {/* Outer Coin Perimeter Ring - subtle engraved currency detail */}
          <circle
            cx="32"
            cy="32"
            r="23"
            stroke="#22C55E"
            strokeWidth="1.2"
            strokeOpacity="0.35"
            strokeDasharray="2 3"
          />

          {/* 
            THE SPLIT / SLASH MONOGRAM (Letter 'B' formed by 3 sliced monetary segments):
            1. Vertical Anchor Pillar (Financial Stability / Trust):
          */}
          <rect
            x="16"
            y="15"
            width="6"
            height="34"
            rx="3"
            fill="#FFFFFF"
          />

          {/* 
            2. Upper Monetary Arc (Segment 1 / Down Payment):
            Sliced diagonally to demonstrate division of the whole
          */}
          <path
            d="M24 15H36C40.9706 15 45 18.5817 45 23C45 27.4183 40.9706 31 36 31H24V15Z"
            fill="#FFFFFF"
          />
          {/* Active Emerald Core inside Segment 1 */}
          <path
            d="M25 19H34.5C36.9853 19 39 20.7909 39 23C39 25.2091 36.9853 27 34.5 27H25V19Z"
            fill="#14532D"
          />

          {/* 
            3. The Precision Slash (Negative Space Cutting Line):
            A clean 45-degree incision that visually slashes the big amount into pieces
          */}
          <path
            d="M13 36L48 24"
            stroke="url(#forest_emerald_grad)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />

          {/* 
            4. Lower Monetary Arc (Segment 2 & 3 / Future Installments):
            Slightly larger, dynamic arc illustrating flexible payments over time
          */}
          <path
            d="M24 33H38C43.5228 33 48 37.0294 48 42C48 46.9706 43.5228 51 38 51H24V33Z"
            fill="#FFFFFF"
          />
          {/* Active Vibrant Green Core inside Segment 2/3 */}
          <path
            d="M25 37H36.5C39.5376 37 42 39.2386 42 42C42 44.7614 39.5376 47 36.5 47H25V37Z"
            fill="url(#vibrant_slash_grad)"
          />

          {/* 
            5. Slashed Fraction Beads (Visual indicators of 3 equal installments):
            Three aligned dots showing equal parts: 1/3, 2/3, 3/3
          */}
          <circle cx="28.5" cy="42" r="1.75" fill="#FFFFFF" />
          <circle cx="33.5" cy="42" r="1.75" fill="#FFFFFF" />
          <circle cx="38.5" cy="42" r="1.75" fill="#FFFFFF" />
        </svg>
      </div>

      {/* Typographic Lockup */}
      {variant !== 'mark-only' && (
        <div className={`flex ${variant === 'stacked' ? 'flex-col items-center text-center' : 'flex-col'} leading-none`}>
          <div className="flex items-baseline">
            <span
              className={`font-black tracking-tight font-sans ${dimensions.text} ${
                theme === 'light' ? 'text-white' : 'text-[#14532D]'
              }`}
            >
              Bukra
            </span>
            <span className="text-[#22C55E] font-black ml-0.5 text-xs">.rw</span>
          </div>

          {showSubtitle && (
            <div className="flex items-center gap-1 mt-0.5">
              <span
                className={`font-bold tracking-wider uppercase ${dimensions.sub} text-[#166534] dark:text-[#22C55E]`}
              >
                Buy Now · Pay Later
              </span>
              <span className="inline-block w-1 h-1 rounded-full bg-[#22C55E]" />
              <span className={`font-semibold ${dimensions.sub} text-neutral-500`}>
                0% Interest
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

/**
 * High-Resolution Standalone Brand Card / Showcase Component
 * Demonstrates the design philosophy: Money slashed into equal manageable pieces.
 */
export const LogoConceptShowcase: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-6 md:p-8 shadow-xl max-w-xl mx-auto space-y-6">
      <div className="flex items-start justify-between border-b border-neutral-100 pb-4">
        <div>
          <span className="text-xs font-mono font-bold text-[#14532D] bg-[#DCFCE7] px-2 py-0.5 rounded">
            BRAND IDENTITY SPECIFICATION
          </span>
          <h3 className="text-xl font-extrabold text-[#14532D] mt-1.5">
            Bukra Brand Identity & Symbolism
          </h3>
          <p className="text-xs text-neutral-500">
            Tech & Modern · Classic & Elegant · Forest Green Palette
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-neutral-700 text-sm font-semibold p-1"
          >
            ✕
          </button>
        )}
      </div>

      {/* Main Large Showcase on clean plain background */}
      <div className="bg-neutral-50 rounded-2xl p-8 flex flex-col items-center justify-center border border-neutral-200/80">
        <Logo size="hero" variant="full" />
      </div>

      {/* Design Concept Breakdown Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
          <div className="w-6 h-6 rounded-md bg-[#14532D] text-white flex items-center justify-center font-bold text-xs mb-2">
            1
          </div>
          <strong className="block text-neutral-900 mb-1">The Monetary Token</strong>
          <span className="text-neutral-600 text-[11px] leading-relaxed">
            A classic coin and currency shield representing capital, price tag, and trusted liquidity.
          </span>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
          <div className="w-6 h-6 rounded-md bg-[#22C55E] text-white flex items-center justify-center font-bold text-xs mb-2">
            2
          </div>
          <strong className="block text-neutral-900 mb-1">The Precision Slash</strong>
          <span className="text-neutral-600 text-[11px] leading-relaxed">
            A clean dynamic cut slashes the big lump-sum expense into accessible, equal monthly pieces.
          </span>
        </div>

        <div className="p-3.5 bg-neutral-50 rounded-xl border border-neutral-200">
          <div className="w-6 h-6 rounded-md bg-[#166534] text-white flex items-center justify-center font-bold text-xs mb-2">
            3
          </div>
          <strong className="block text-neutral-900 mb-1">The "B" Monogram</strong>
          <span className="text-neutral-600 text-[11px] leading-relaxed">
            The 3 divided segments harmoniously align to form Bukra’s signature letter 'B'.
          </span>
        </div>
      </div>

      {/* Color Palette Swatches */}
      <div className="p-4 bg-white rounded-xl border border-neutral-200 space-y-2">
        <span className="text-xs font-bold text-neutral-800 uppercase tracking-wider block">
          Official Forest Green Palette
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono">
          <div className="p-2 rounded-lg bg-[#14532D] text-white flex flex-col justify-between h-16">
            <span>Primary Deep</span>
            <span className="font-bold">#14532D</span>
          </div>
          <div className="p-2 rounded-lg bg-[#166534] text-white flex flex-col justify-between h-16">
            <span>Forest Mid</span>
            <span className="font-bold">#166534</span>
          </div>
          <div className="p-2 rounded-lg bg-[#22C55E] text-neutral-950 flex flex-col justify-between h-16">
            <span>Tech Emerald</span>
            <span className="font-bold">#22C55E</span>
          </div>
          <div className="p-2 rounded-lg bg-[#DCFCE7] text-[#14532D] border border-[#22C55E]/40 flex flex-col justify-between h-16">
            <span>Mint Tint</span>
            <span className="font-bold">#DCFCE7</span>
          </div>
        </div>
      </div>
    </div>
  );
};
