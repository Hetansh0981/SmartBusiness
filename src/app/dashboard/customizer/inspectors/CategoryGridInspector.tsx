'use client';

import React from 'react';
import type { CategoryGridSectionConfig } from '@/types/customizer';

interface CategoryGridInspectorProps {
  section: CategoryGridSectionConfig;
  onChange: (updated: CategoryGridSectionConfig) => void;
}

export default function CategoryGridInspector({ section, onChange }: CategoryGridInspectorProps) {
  const updateProps = (partial: Partial<CategoryGridSectionConfig['props']>) => {
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
          maxLength={60}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Display Layout</label>
        <select
          value={section.props.layout}
          onChange={(e) => updateProps({ layout: e.target.value as 'pills' | 'cards' | 'compact' })}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        >
          <option value="pills">Horizontal Scrollable Pills</option>
          <option value="cards">Multi-Column Cards</option>
          <option value="compact">Compact Chip Bar</option>
        </select>
      </div>

      <div className="pt-2 border-t border-[#f3f4f6]">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show Product Counts</span>
          <input
            type="checkbox"
            checked={section.props.showItemCount}
            onChange={(e) => updateProps({ showItemCount: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
