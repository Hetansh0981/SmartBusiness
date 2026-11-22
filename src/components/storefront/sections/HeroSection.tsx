'use client';

import React from 'react';
import { Sparkles, ShieldCheck, Truck, Package } from 'lucide-react';
import { useStorefrontPreview } from '@/components/storefront/StorefrontPreviewContext';
import type { HeroSectionProps, ThemeTokens } from '@/types/customizer';
import type { PublicStore } from '@/types';

interface HeroSectionComponentProps {
  id: string;
  props: HeroSectionProps;
  store: PublicStore;
  theme: ThemeTokens;
  productCount: number;
}

export default function HeroSection({
  id,
  props,
  theme,
  productCount,
}: HeroSectionComponentProps) {
  const { isEditorPreview, activeSectionId } = useStorefrontPreview();
  const isSelected = isEditorPreview && activeSectionId === id;

  const bgStyles = {
    subtle: 'bg-[#f9f9ff] border-b border-[#e5e7eb]',
    accent: 'bg-gradient-to-b from-orange-50/50 to-white border-b border-orange-100',
    neutral: 'bg-white border-b border-[#e5e7eb]',
  };

  return (
    <section
      data-section-id={id}
      className={`relative pt-6 sm:pt-10 pb-6 sm:pb-8 transition-all duration-200 ${
        bgStyles[props.backgroundStyle] || bgStyles.subtle
      } ${isSelected ? 'ring-2 ring-[#ea580c] ring-offset-2 z-30' : ''}`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        {props.badgeText && (
          <div
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold mb-3 border shadow-xs"
            style={{
              backgroundColor: 'rgba(255, 237, 213, 0.6)',
              color: theme.primaryColor,
              borderColor: 'rgba(234, 88, 12, 0.2)',
            }}
          >
            <Sparkles className="w-3.5 h-3.5" style={{ color: theme.primaryColor }} />
            <span>{props.badgeText}</span>
          </div>
        )}

        {/* Store Title / Headline */}
        <h1 className="text-2xl sm:text-4xl font-bold text-[#111827] tracking-tight max-w-2xl mx-auto">
          {props.headline}
        </h1>

        {/* Tagline */}
        {props.tagline && (
          <p className="mt-2 text-xs sm:text-sm text-[#4b5563] max-w-lg mx-auto leading-relaxed">
            {props.tagline}
          </p>
        )}

        {/* Trust Badges Bar */}
        {props.showTrustBadges && (
          <div className="mt-5 flex flex-wrap items-center justify-center gap-2 sm:gap-4 text-xs text-[#4b5563]">
            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#e5e7eb] shadow-xs"
              style={{ borderRadius: 'var(--theme-radius, 8px)' }}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
              <span className="text-[#111827] font-medium">Verified Local Merchant</span>
            </div>

            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#e5e7eb] shadow-xs"
              style={{ borderRadius: 'var(--theme-radius, 8px)' }}
            >
              <Truck className="w-3.5 h-3.5 text-[#ea580c]" />
              <span>Cash on Delivery &amp; Pickup</span>
            </div>

            <div
              className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-white border border-[#e5e7eb] shadow-xs font-mono-numbers"
              style={{ borderRadius: 'var(--theme-radius, 8px)' }}
            >
              <Package className="w-3.5 h-3.5 text-[#6b7280]" />
              <span className="text-[#111827] font-semibold">{productCount}</span>
              <span>Items Available</span>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
