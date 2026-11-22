'use client';

import React from 'react';
import { Sparkles, ShieldCheck, MapPin, Truck } from 'lucide-react';
import type { StorefrontTheme } from '@/lib/storefrontThemes';
import type { PublicStore } from '@/types';

interface StorefrontHeroProps {
  store: PublicStore;
  theme: StorefrontTheme;
  productCount: number;
}

export default function StorefrontHero({
  store,
  theme,
  productCount,
}: StorefrontHeroProps) {
  return (
    <section className="relative pt-6 sm:pt-10 pb-6 sm:pb-8 border-b border-[#e5e7eb] bg-[#f9f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Category Pill Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 bg-[#ffedd5] text-[#c2410c] border border-orange-200 shadow-xs">
          <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>{theme.badgeLabel}</span>
        </div>

        {/* Store Title */}
        <h1 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight max-w-2xl mx-auto">
          {store.name}
        </h1>

        {/* Tailored Category Description */}
        <p className="mt-2 text-xs sm:text-sm text-[#4b5563] max-w-lg mx-auto leading-relaxed">
          {theme.tagline}
        </p>

        {/* Trust Badges Bar */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-[#4b5563]">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#e5e7eb] shadow-xs">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span className="text-[#111827] font-medium">Verified Local Merchant</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#e5e7eb] shadow-xs">
            <Truck className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Cash on Delivery &amp; Pickup</span>
          </div>

          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#e5e7eb] shadow-xs font-mono-numbers">
            <span className="text-[#111827] font-semibold">{productCount}</span>
            <span>Items Available</span>
          </div>
        </div>
      </div>
    </section>
  );
}
