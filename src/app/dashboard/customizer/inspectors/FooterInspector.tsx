'use client';

import React from 'react';
import type { FooterSectionConfig } from '@/types/customizer';

interface FooterInspectorProps {
  section: FooterSectionConfig;
  onChange: (updated: FooterSectionConfig) => void;
}

export default function FooterInspector({ section, onChange }: FooterInspectorProps) {
  const updateProps = (partial: Partial<FooterSectionConfig['props']>) => {
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
        <label className="block font-medium text-[#374151] mb-1">Custom About Text</label>
        <textarea
          rows={3}
          value={section.props.customAboutText || ''}
          onChange={(e) => updateProps({ customAboutText: e.target.value || null })}
          maxLength={300}
          placeholder="Brief shop statement shown at the bottom of the page..."
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c] resize-none"
        />
      </div>

      <div className="pt-2 border-t border-[#f3f4f6] space-y-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show City & State Address</span>
          <input
            type="checkbox"
            checked={section.props.showAddress}
            onChange={(e) => updateProps({ showAddress: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show WhatsApp Direct Chat Button</span>
          <input
            type="checkbox"
            checked={section.props.showWhatsAppSupport}
            onChange={(e) => updateProps({ showWhatsAppSupport: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show "Powered by DukaanOS" Attribution</span>
          <input
            type="checkbox"
            checked={section.props.showPoweredBy}
            onChange={(e) => updateProps({ showPoweredBy: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
