'use client';

import React from 'react';
import type { PromoBannerSectionConfig } from '@/types/customizer';

interface PromoBannerInspectorProps {
  section: PromoBannerSectionConfig;
  onChange: (updated: PromoBannerSectionConfig) => void;
}

export default function PromoBannerInspector({ section, onChange }: PromoBannerInspectorProps) {
  const updateProps = (partial: Partial<PromoBannerSectionConfig['props']>) => {
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
        <label className="block font-medium text-[#374151] mb-1">Banner Visual Theme</label>
        <select
          value={section.props.bannerStyle}
          onChange={(e) => updateProps({ bannerStyle: e.target.value as 'saffron' | 'emerald' | 'charcoal' })}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        >
          <option value="saffron">Warm Saffron Gradient</option>
          <option value="emerald">Emerald Fresh Gradient</option>
          <option value="charcoal">Charcoal Premium Obsidian</option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Badge Tag</label>
        <input
          type="text"
          value={section.props.badgeText || ''}
          onChange={(e) => updateProps({ badgeText: e.target.value || null })}
          maxLength={40}
          placeholder="e.g. Festive Offer"
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Headline</label>
        <input
          type="text"
          value={section.props.headline}
          onChange={(e) => updateProps({ headline: e.target.value })}
          maxLength={100}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Subheadline</label>
        <textarea
          rows={2}
          value={section.props.subheadline}
          onChange={(e) => updateProps({ subheadline: e.target.value })}
          maxLength={200}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c] resize-none"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Coupon Code (Optional)</label>
        <input
          type="text"
          value={section.props.couponCode || ''}
          onChange={(e) => updateProps({ couponCode: e.target.value || null })}
          maxLength={30}
          placeholder="e.g. DIWALI20"
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] font-mono uppercase focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f3f4f6]">
        <div>
          <label className="block font-medium text-[#374151] mb-1">Button Label</label>
          <input
            type="text"
            value={section.props.buttonText || ''}
            onChange={(e) => updateProps({ buttonText: e.target.value || null })}
            maxLength={40}
            placeholder="e.g. Shop Deal"
            className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
          />
        </div>

        <div>
          <label className="block font-medium text-[#374151] mb-1">Button Link</label>
          <input
            type="text"
            value={section.props.buttonLink || ''}
            onChange={(e) => updateProps({ buttonLink: e.target.value || null })}
            maxLength={300}
            placeholder="e.g. /#catalog"
            className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
          />
        </div>
      </div>
    </div>
  );
}
