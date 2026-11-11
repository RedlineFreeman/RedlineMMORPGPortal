import React from 'react';
import { Season } from '../types';

interface SeasonalAccumulationProps {
  season: Season;
  variant?: 'card' | 'wide' | 'button' | 'log' | 'nav';
  className?: string;
}

export const SeasonalAccumulation: React.FC<SeasonalAccumulationProps> = ({
  season,
  variant = 'card',
  className = '',
}) => {
  if (season === 'winter') {
    const isButton = variant === 'button' || variant === 'log';
    const isNav = variant === 'nav';

    if (isButton) {
      // Natural soft snow caps that sit perfectly contoured across buttons without being cut off
      return (
        <div
          className={`absolute -top-2 -left-1.5 -right-1.5 pointer-events-none z-30 select-none overflow-visible ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 160 16"
            preserveAspectRatio="none"
            className="w-full h-3.5 filter drop-shadow-[0_2px_4px_rgba(186,230,253,0.5)] overflow-visible"
          >
            <defs>
              <linearGradient id="snowCapGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="65%" stopColor="#f0f9ff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
              <linearGradient id="snowCapShadow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#bfdbfe" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#60a5fa" stopOpacity="0" />
              </linearGradient>
            </defs>

            {/* Soft shadow base */}
            <path
              d="M0,16 
                 C8,8 18,10 32,8 
                 C48,5 64,11 80,7 
                 C96,4 112,10 128,7 
                 C142,9 152,8 160,16 Z"
              fill="url(#snowCapShadow)"
              transform="translate(0, 1)"
            />

            {/* Smooth snow cushion with organic rounded mounds, gently draping over the rounded corners */}
            <path
              d="M0,16 
                 C4,10 12,5 24,7 
                 C36,9 48,3 62,5 
                 C76,7 86,2 100,4 
                 C114,6 126,2 138,5 
                 C148,4 156,10 160,16 Z"
              fill="url(#snowCapGrad)"
            />

            {/* Hanging miniature soft drops */}
            <path d="M38,15 Q40,19 42,15 Z" fill="#ffffff" />
            <path d="M96,15 Q98,20 100,15 Z" fill="#ffffff" />
            <path d="M130,15 Q131.5,18.5 133,15 Z" fill="#ffffff" />

            {/* Frost sparkles */}
            <circle cx="28" cy="6.5" r="1" fill="#ffffff" />
            <circle cx="82" cy="4" r="1.2" fill="#ffffff" />
            <circle cx="122" cy="4.5" r="1" fill="#ffffff" />
          </svg>
        </div>
      );
    }

    if (isNav) {
      return (
        <div
          className={`absolute -top-2.5 left-0 right-0 pointer-events-none z-30 select-none overflow-visible ${className}`}
          aria-hidden="true"
        >
          <svg
            viewBox="0 0 800 20"
            preserveAspectRatio="none"
            className="w-full h-3.5 filter drop-shadow-[0_2px_4px_rgba(186,230,253,0.4)]"
          >
            <defs>
              <linearGradient id="snowNavGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#ffffff" />
                <stop offset="70%" stopColor="#f0f9ff" />
                <stop offset="100%" stopColor="#dbeafe" />
              </linearGradient>
            </defs>
            <path
              d="M0,20 
                 Q40,8 80,12 
                 Q140,4 200,11 
                 Q260,3 320,10 
                 Q380,5 440,11 
                 Q500,3 560,9 
                 Q620,4 680,11 
                 Q740,6 800,13 
                 L800,20 L0,20 Z"
              fill="url(#snowNavGrad)"
            />
          </svg>
        </div>
      );
    }

    // Default for Cards & Wide Containers
    return (
      <div
        className={`absolute -top-3.5 -left-1 -right-1 pointer-events-none z-30 select-none overflow-visible ${className}`}
        aria-hidden="true"
      >
        <svg
          viewBox="0 0 400 24"
          preserveAspectRatio="none"
          className="w-full h-4 sm:h-5 filter drop-shadow-[0_2px_5px_rgba(186,230,253,0.45)] overflow-visible"
        >
          <defs>
            <linearGradient id="snowCardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="60%" stopColor="#f8fafc" />
              <stop offset="100%" stopColor="#e0f2fe" />
            </linearGradient>
            <linearGradient id="icicleCardGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#ffffff" />
              <stop offset="100%" stopColor="#bae6fd" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Smooth curved snow bank covering the card's top edge */}
          <path
            d="M0,24 
               C8,14 20,8 40,11 
               C65,4 95,14 125,8 
               C155,3 185,12 215,7 
               C245,3 275,13 305,8 
               C335,4 365,12 385,8 
               C395,10 398,16 400,24 Z"
            fill="url(#snowCardGrad)"
          />

          {/* Hanging little icicles */}
          <path d="M48,24 L51,30 L54,24 Z" fill="url(#icicleCardGrad)" />
          <path d="M140,24 L142.5,29 L145,24 Z" fill="url(#icicleCardGrad)" />
          <path d="M260,24 L262.5,31 L265,24 Z" fill="url(#icicleCardGrad)" />
          <path d="M345,24 L347.5,29 L350,24 Z" fill="url(#icicleCardGrad)" />

          {/* Frost glints */}
          <circle cx="95" cy="8" r="1.3" fill="#ffffff" />
          <circle cx="215" cy="6" r="1.5" fill="#ffffff" />
          <circle cx="305" cy="7" r="1.3" fill="#ffffff" />
        </svg>
      </div>
    );
  }

  if (season === 'autumn') {
    const isButton = variant === 'button' || variant === 'log';

    return (
      <div
        className={`absolute -top-3 right-1 sm:right-2 pointer-events-none z-30 select-none flex items-center ${className}`}
        aria-hidden="true"
      >
        <svg
          width={isButton ? '32' : '42'}
          height={isButton ? '16' : '20'}
          viewBox="0 0 42 20"
          className="filter drop-shadow-[0_1px_3px_rgba(0,0,0,0.6)]"
        >
          {/* Amber oak leaf */}
          <g transform="translate(3, 3) rotate(-16) scale(0.72)">
            <path
              d="M10,0 C14,5 18,3 18,8 C18,12 14,14 10,20 C6,14 2,12 2,8 C2,3 6,5 10,0 Z"
              fill="#d97706"
            />
            <line x1="10" y1="2" x2="10" y2="18" stroke="#78350f" strokeWidth="1" />
          </g>

          {/* Crimson maple leaf */}
          <g transform="translate(16, 2) rotate(22) scale(0.78)">
            <path
              d="M10,0 C13,4 17,4 19,7 C17,9 19,13 16,14 C14,16 12,20 10,20 C8,20 6,16 4,14 C1,13 3,9 1,7 C3,4 7,4 10,0 Z"
              fill="#e11d48"
            />
            <line x1="10" y1="2" x2="10" y2="18" stroke="#881337" strokeWidth="1" />
          </g>

          {/* Golden birch leaf */}
          <g transform="translate(26, 4) rotate(6) scale(0.7)">
            <ellipse cx="8" cy="8" rx="8" ry="5" fill="#eab308" />
            <line x1="1" y1="8" x2="15" y2="8" stroke="#854d0e" strokeWidth="0.8" />
          </g>
        </svg>
      </div>
    );
  }

  if (season === 'spring') {
    return (
      <div
        className={`absolute -top-2 right-2 pointer-events-none z-30 select-none flex items-center ${className}`}
        aria-hidden="true"
      >
        <svg width="30" height="16" viewBox="0 0 30 16" className="filter drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]">
          <ellipse cx="8" cy="7" rx="5.5" ry="3.2" fill="#fbcfe8" transform="rotate(-15 8 7)" />
          <ellipse cx="18" cy="6" rx="6" ry="3.5" fill="#f472b6" opacity="0.9" transform="rotate(22 18 6)" />
          <ellipse cx="24" cy="8" rx="4" ry="2.5" fill="#fdf2f8" transform="rotate(-8 24 8)" />
        </svg>
      </div>
    );
  }

  return null;
};
