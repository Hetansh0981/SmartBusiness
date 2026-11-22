'use client';

import React from 'react';
import type { HeroSectionConfig } from '@/types/customizer';

interface HeroInspectorProps {
  section: HeroSectionConfig;
  onChange: (updated: HeroSectionConfig) => void;
}

export default function HeroInspector({ section, onChange }: HeroInspectorProps) {
  const updateProps = (partial: Partial<HeroSectionConfig['props']>) => {
    onChange({
      ...section,
      props: {
        ...section.props,
        ...partial,
      },
    });
  };

  return (
    <div className="space-y-4 text-xs">
      <div>
        <label className="block font-medium text-[#374151] mb-1">Headline</label>
        <input
          type="text"
          value={section.props.headline}
          onChange={(e) => updateProps({ headline: e.target.value })}
          maxLength={120}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Pill Badge Text</label>
        <input
          type="text"
          value={section.props.badgeText}
          onChange={(e) => updateProps({ badgeText: e.target.value })}
          maxLength={50}
          placeholder="e.g. Fresh Daily & Authentic"
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Store Tagline / Description</label>
        <textarea
          rows={3}
          value={section.props.tagline}
          onChange={(e) => updateProps({ tagline: e.target.value })}
          maxLength={300}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c] resize-none"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Background Style</label>
        <select
          value={section.props.backgroundStyle}
          onChange={(e) => updateProps({ backgroundStyle: e.target.value as 'subtle' | 'accent' | 'neutral' })}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        >
          <option value="subtle">Subtle Canvas Light</option>
          <option value="accent">Warm Saffron Tint</option>
          <option value="neutral">Pure White Minimal</option>
        </select>
      </div>

      <div className="pt-2 border-t border-[#f3f4f6]">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show Trust Badges (Verified, COD, Delivery)</span>
          <input
            type="checkbox"
            checked={section.props.showTrustBadges}
            onChange={(e) => updateProps({ showTrustBadges: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
