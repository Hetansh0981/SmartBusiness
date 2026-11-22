'use client';

import React from 'react';
import type { TextImageSectionConfig } from '@/types/customizer';

interface TextImageInspectorProps {
  section: TextImageSectionConfig;
  onChange: (updated: TextImageSectionConfig) => void;
}

export default function TextImageInspector({ section, onChange }: TextImageInspectorProps) {
  const updateProps = (partial: Partial<TextImageSectionConfig['props']>) => {
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
        <label className="block font-medium text-[#374151] mb-1">Section Title</label>
        <input
          type="text"
          value={section.props.title}
          onChange={(e) => updateProps({ title: e.target.value })}
          maxLength={100}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Story / Body Content</label>
        <textarea
          rows={4}
          value={section.props.body}
          onChange={(e) => updateProps({ body: e.target.value })}
          maxLength={1000}
          placeholder="Share your business origins, craft dedication, and quality promise..."
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c] resize-none"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Image Layout Placement</label>
        <select
          value={section.props.imagePosition}
          onChange={(e) => updateProps({ imagePosition: e.target.value as 'left' | 'right' })}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        >
          <option value="right">Image on Right / Text on Left</option>
          <option value="left">Image on Left / Text on Right</option>
        </select>
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Image URL (HTTPS)</label>
        <input
          type="text"
          value={section.props.imageUrl || ''}
          onChange={(e) => updateProps({ imageUrl: e.target.value || null })}
          maxLength={300}
          placeholder="https://images.unsplash.com/..."
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#f3f4f6]">
        <div>
          <label className="block font-medium text-[#374151] mb-1">Button Label (Optional)</label>
          <input
            type="text"
            value={section.props.buttonText || ''}
            onChange={(e) => updateProps({ buttonText: e.target.value || null })}
            maxLength={40}
            placeholder="e.g. Learn More"
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
