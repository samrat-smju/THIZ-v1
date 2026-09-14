import React from 'react';
import { useStore } from '../../context/StoreContext';

interface ThizLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  showTagline?: boolean;
}

export const ThizLogo: React.FC<ThizLogoProps> = ({
  className = '',
  size = 'md',
  showTagline = true,
}) => {
  const { siteSettings } = useStore();

  const logoType = siteSettings.logoType || 'monogram';
  const logoUrl = siteSettings.logoUrl;

  const sizeClasses = {
    sm: { icon: 'w-7 h-7', text: 'text-lg', sub: 'text-[8px]' },
    md: { icon: 'w-9 h-9', text: 'text-xl', sub: 'text-[9px]' },
    lg: { icon: 'w-12 h-12', text: 'text-2xl', sub: 'text-[10px]' },
  }[size];

  return (
    <div className={`flex items-center gap-2.5 ${className}`}>
      {logoType === 'image' && logoUrl ? (
        <img
          src={logoUrl}
          alt={siteSettings.businessName}
          className={`${sizeClasses.icon} object-contain rounded-lg border border-white/10`}
        />
      ) : logoType === 'text' ? (
        <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center font-serif font-black text-white text-sm">
          TZ
        </div>
      ) : (
        /* Monogram Vector matching the THIZ brand identity */
        <div
          className={`${sizeClasses.icon} relative rounded-xl bg-gradient-to-br from-[#dfdbd5] to-[#c7c2bb] p-1 flex items-center justify-center shadow-lg shadow-black/40 shrink-0 group-hover:scale-105 transition-transform overflow-hidden`}
        >
          <svg
            viewBox="0 0 100 100"
            className="w-full h-full"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Flourish Wave Top Right */}
            <path
              d="M32 30 C45 28, 65 24, 76 33 C72 31, 55 30, 43 33 Z"
              fill="#2b2d31"
            />
            {/* Flourish Wave Left Wing */}
            <path
              d="M44 45 C36 38, 30 38, 28 40 C34 40, 40 43, 44 45 Z"
              fill="#2b2d31"
            />
            {/* Flourish Lower Swirl (S/Z Curve) */}
            <path
              d="M57 48 C64 48, 70 52, 70 58 C70 65, 62 70, 59 71 C65 68, 68 63, 67 58 C66 54, 62 50, 57 49 Z"
              fill="#2b2d31"
            />
            {/* Serif Letter T / Left Column */}
            <rect x="42" y="32" width="4" height="28" fill="#2b2d31" />
            <rect x="40" y="52" width="5" height="8" fill="#2b2d31" />
            {/* Letter H Right Column with Serifs */}
            <rect x="53" y="36" width="4" height="25" fill="#2b2d31" />
            {/* Top Serif H */}
            <rect x="50" y="36" width="10" height="2.5" fill="#2b2d31" />
            {/* Bottom Serifs */}
            <rect x="40" y="58" width="8" height="2.5" fill="#2b2d31" />
            <rect x="50" y="59" width="10" height="2.5" fill="#2b2d31" />
            {/* Center "THIZ" Brand Typography */}
            <text
              x="50"
              y="49"
              textAnchor="middle"
              fill="#18191c"
              fontFamily="Georgia, serif"
              fontWeight="900"
              fontSize="8.5"
              letterSpacing="2"
            >
              THIZ
            </text>
          </svg>
        </div>
      )}

      {/* Brand Name & Tagline */}
      <div className="flex flex-col">
        <span className={`font-extrabold ${sizeClasses.text} tracking-tight text-white transition-colors`}>
          {siteSettings.businessName || 'THIZ'}
        </span>
        {showTagline && (
          <span className={`${sizeClasses.sub} tracking-[0.25em] text-[#ff5722] uppercase font-bold -mt-0.5`}>
            {siteSettings.tagline || 'Precision Goods'}
          </span>
        )}
      </div>
    </div>
  );
};
