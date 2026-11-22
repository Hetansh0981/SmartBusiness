'use client';

import React from 'react';
import type { HeaderSectionConfig } from '@/types/customizer';

interface HeaderInspectorProps {
  section: HeaderSectionConfig;
  onChange: (updated: HeaderSectionConfig) => void;
}

export default function HeaderInspector({ section, onChange }: HeaderInspectorProps) {
  const updateProps = (partial: Partial<HeaderSectionConfig['props']>) => {
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
        <label className="block font-medium text-[#374151] mb-1">Logo Presentation</label>
        <select
          value={section.props.logoStyle}
          onChange={(e) => updateProps({ logoStyle: e.target.value as 'initials' | 'text' })}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        >
          <option value="initials">Store Initial Badge + Name</option>
          <option value="text">Store Name Only</option>
        </select>
      </div>

      <div className="pt-2 border-t border-[#f3f4f6] space-y-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Sticky Navigation Bar</span>
          <input
            type="checkbox"
            checked={section.props.sticky}
            onChange={(e) => updateProps({ sticky: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show City & State Location</span>
          <input
            type="checkbox"
            checked={section.props.showLocationBadge}
            onChange={(e) => updateProps({ showLocationBadge: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show Direct WhatsApp Button</span>
          <input
            type="checkbox"
            checked={section.props.showWhatsAppButton}
            onChange={(e) => updateProps({ showWhatsAppButton: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>
      </div>

      <div className="pt-3 border-t border-[#f3f4f6] space-y-3">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Top Announcement Bar</span>
          <input
            type="checkbox"
            checked={section.props.showAnnouncement}
            onChange={(e) => updateProps({ showAnnouncement: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>

        {section.props.showAnnouncement && (
          <div className="space-y-2 pl-2 border-l-2 border-orange-200">
            <div>
              <label className="block text-[11px] text-[#6b7280] mb-0.5">Announcement Message</label>
              <input
                type="text"
                value={section.props.announcementText}
                onChange={(e) => updateProps({ announcementText: e.target.value })}
                maxLength={100}
                placeholder="e.g. Free delivery on orders above ₹500!"
                className="w-full px-2 py-1 rounded border border-[#e5e7eb] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#ea580c]"
              />
            </div>

            <div>
              <label className="block text-[11px] text-[#6b7280] mb-0.5">Optional Link URL</label>
              <input
                type="text"
                value={section.props.announcementLink || ''}
                onChange={(e) => updateProps({ announcementLink: e.target.value || null })}
                maxLength={300}
                placeholder="e.g. /#catalog or https://..."
                className="w-full px-2 py-1 rounded border border-[#e5e7eb] bg-white text-[#111827] text-xs focus:outline-none focus:border-[#ea580c]"
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
