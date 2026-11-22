'use client';

import React from 'react';

export default function SolarArc() {
  return (
    <div className="relative w-full max-w-5xl mx-auto flex items-center justify-center pointer-events-none select-none overflow-visible">
      {/* 1. Deep Atmospheric Orange Corona Glow */}
      <div className="absolute -top-32 w-[900px] h-[550px] bg-[radial-gradient(ellipse_at_center,_rgba(255,92,0,0.28),_rgba(234,88,12,0.12)_40%,_transparent_72%)] blur-3xl animate-solar-pulse" />

      {/* 2. Secondary Intense Core Halo */}
      <div className="absolute -top-10 w-[600px] h-[300px] bg-[radial-gradient(ellipse_at_center,_rgba(255,140,0,0.35),_transparent_65%)] blur-2xl" />

      {/* 3. The Photorealistic 3D Metallic & Orange Torus Arc */}
      <div className="relative w-[820px] h-[340px] overflow-hidden">
        {/* SVG Arc with Specular Chrome Rim + Fiery Core */}
        <svg
          viewBox="0 0 820 400"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="w-full h-full drop-shadow-[0_0_35px_rgba(255,92,0,0.45)]"
        >
          <defs>
            {/* Fiery Solar Radiant Gradient */}
            <linearGradient id="solarGlow" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#7c2d12" stopOpacity="0.2" />
              <stop offset="20%" stopColor="#ea580c" stopOpacity="0.8" />
              <stop offset="50%" stopColor="#ff7a00" stopOpacity="1" />
              <stop offset="80%" stopColor="#ea580c" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#7c2d12" stopOpacity="0.2" />
            </linearGradient>

            {/* Specular Chrome Outer Bevel */}
            <linearGradient id="chromeOuter" x1="0%" y1="100%" x2="0%" y2="0%">
              <stop offset="0%" stopColor="#090d16" />
              <stop offset="40%" stopColor="#27272a" />
              <stop offset="70%" stopColor="#71717a" />
              <stop offset="90%" stopColor="#e4e4e7" />
              <stop offset="100%" stopColor="#ffffff" />
            </linearGradient>

            {/* Inner Metallic Bevel */}
            <linearGradient id="metallicBevel" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#ff9a3d" />
              <stop offset="50%" stopColor="#ff5c00" />
              <stop offset="100%" stopColor="#18181b" />
            </linearGradient>

            {/* Subtle Horizon Fade */}
            <linearGradient id="fadeBottom" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="70%" stopColor="#ffffff" stopOpacity="1" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
            </linearGradient>
            <mask id="bottomMask">
              <rect width="820" height="400" fill="url(#fadeBottom)" />
            </mask>
          </defs>

          {/* Outer Chrome Ring Layer */}
          <path
            d="M 60 360 C 60 140, 760 140, 760 360"
            stroke="url(#chromeOuter)"
            strokeWidth="36"
            strokeLinecap="round"
            mask="url(#bottomMask)"
            opacity="0.85"
          />

          {/* Inner Fiery Glowing Solar Core Ring */}
          <path
            d="M 85 360 C 85 165, 735 165, 735 360"
            stroke="url(#solarGlow)"
            strokeWidth="24"
            strokeLinecap="round"
            mask="url(#bottomMask)"
          />

          {/* Precision Specular Highlight Line (Razor Sharp Light Edge) */}
          <path
            d="M 96 360 C 96 178, 724 178, 724 360"
            stroke="#fed7aa"
            strokeWidth="3"
            strokeLinecap="round"
            mask="url(#bottomMask)"
            opacity="0.9"
            className="filter drop-shadow-[0_0_8px_#ffedd5]"
          />

          {/* Atmospheric Inner Rim Fill Glow */}
          <ellipse
            cx="410"
            cy="360"
            rx="290"
            ry="140"
            fill="url(#solarGlow)"
            opacity="0.12"
            className="blur-xl"
          />
        </svg>

        {/* Ambient Floating Sparkles / Particles */}
        <div className="absolute top-1/4 left-1/3 w-1.5 h-1.5 rounded-full bg-amber-300 blur-[0.5px] animate-pulse" />
        <div className="absolute top-1/3 right-1/4 w-1 h-1 rounded-full bg-orange-300 blur-[0.5px] animate-pulse delay-700" />
        <div className="absolute top-1/6 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-white blur-[1px] animate-pulse delay-300" />
      </div>
    </div>
  );
}
