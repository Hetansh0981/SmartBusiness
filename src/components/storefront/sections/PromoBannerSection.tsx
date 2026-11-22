'use client';

import React from 'react';
import Link from 'next/link';
import { Tag, ArrowRight } from 'lucide-react';
import { useStorefrontPreview } from '@/components/storefront/StorefrontPreviewContext';
import type { PromoBannerSectionProps, ThemeTokens } from '@/types/customizer';

interface PromoBannerSectionComponentProps {
  id: string;
  props: PromoBannerSectionProps;
  theme: ThemeTokens;
}

export default function PromoBannerSection({
  id,
  props,
  theme,
}: PromoBannerSectionComponentProps) {
  const { isEditorPreview, activeSectionId } = useStorefrontPreview();
  const isSelected = isEditorPreview && activeSectionId === id;

  const styleMap = {
    saffron: {
      bg: 'bg-gradient-to-r from-orange-600 via-amber-600 to-orange-500 text-white',
      badge: 'bg-white/20 text-white border-white/30',
      coupon: 'bg-white/10 text-white border-white/25',
      button: 'bg-white text-[#ea580c] hover:bg-orange-50',
    },
    emerald: {
      bg: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white',
      badge: 'bg-white/20 text-white border-white/30',
      coupon: 'bg-white/10 text-white border-white/25',
      button: 'bg-white text-[#059669] hover:bg-emerald-50',
    },
    charcoal: {
      bg: 'bg-[#181e2b] text-white border border-white/10',
      badge: 'bg-white/10 text-slate-200 border-white/15',
      coupon: 'bg-white/5 text-amber-300 border-amber-400/30 font-mono-numbers',
      button: 'bg-[#ea580c] text-white hover:bg-[#c2410c]',
    },
  };

  const currentStyle = styleMap[props.bannerStyle] || styleMap.saffron;

  return (
    <div
      data-section-id={id}
      className={`my-6 rounded-lg p-6 sm:p-8 shadow-sm transition-all duration-200 ${currentStyle.bg} ${
        isSelected ? 'ring-2 ring-[#ea580c] ring-offset-2' : ''
      }`}
      style={{ borderRadius: 'var(--theme-radius, 8px)' }}
    >
      <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="space-y-2">
          {props.badgeText && (
            <div className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${currentStyle.badge}`}>
              <Tag className="w-3.5 h-3.5" />
              <span>{props.badgeText}</span>
            </div>
          )}

          <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
            {props.headline}
          </h2>

          {props.subheadline && (
            <p className="text-xs sm:text-sm opacity-90 max-w-xl leading-relaxed">
              {props.subheadline}
            </p>
          )}

          {props.couponCode && (
            <div className="pt-1 flex items-center gap-2">
              <span className="text-xs opacity-75">Use code at checkout:</span>
              <span className={`px-2.5 py-0.5 rounded text-xs font-bold border tracking-wider font-mono-numbers ${currentStyle.coupon}`}>
                {props.couponCode}
              </span>
            </div>
          )}
        </div>

        {props.buttonText && props.buttonLink && (
          <Link
            href={props.buttonLink}
            className={`px-5 py-2.5 rounded font-semibold text-xs transition flex items-center gap-2 shadow-xs flex-shrink-0 ${currentStyle.button}`}
            style={{ borderRadius: 'var(--theme-button-radius, var(--theme-radius, 8px))' }}
          >
            <span>{props.buttonText}</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        )}
      </div>
    </div>
  );
}
