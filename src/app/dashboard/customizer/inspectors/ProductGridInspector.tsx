'use client';

import React from 'react';
import type { ProductGridSectionConfig } from '@/types/customizer';

interface ProductGridInspectorProps {
  section: ProductGridSectionConfig;
  onChange: (updated: ProductGridSectionConfig) => void;
}

export default function ProductGridInspector({ section, onChange }: ProductGridInspectorProps) {
  const updateProps = (partial: Partial<ProductGridSectionConfig['props']>) => {
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
        <label className="block font-medium text-[#374151] mb-1">Grid Heading</label>
        <input
          type="text"
          value={section.props.title}
          onChange={(e) => updateProps({ title: e.target.value })}
          maxLength={60}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        />
      </div>

      <div>
        <label className="block font-medium text-[#374151] mb-1">Desktop Grid Columns</label>
        <select
          value={section.props.columns}
          onChange={(e) => updateProps({ columns: e.target.value as '2' | '3' | '4' })}
          className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
        >
          <option value="2">2 Columns (Large Cards)</option>
          <option value="3">3 Columns (Standard)</option>
          <option value="4">4 Columns (Dense Catalog)</option>
        </select>
      </div>

      <div className="pt-2 border-t border-[#f3f4f6] space-y-2">
        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show Product Search Bar</span>
          <input
            type="checkbox"
            checked={section.props.showSearch}
            onChange={(e) => updateProps({ showSearch: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show "In Stock Only" Filter</span>
          <input
            type="checkbox"
            checked={section.props.showStockFilter}
            onChange={(e) => updateProps({ showStockFilter: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show Percentage Discount Badges</span>
          <input
            type="checkbox"
            checked={section.props.showDiscountBadge}
            onChange={(e) => updateProps({ showDiscountBadge: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>

        <label className="flex items-center justify-between cursor-pointer">
          <span className="font-medium text-[#374151]">Show Crossed-Out MRP Prices</span>
          <input
            type="checkbox"
            checked={section.props.showMrp}
            onChange={(e) => updateProps({ showMrp: e.target.checked })}
            className="rounded text-[#ea580c] focus:ring-0 cursor-pointer"
          />
        </label>
      </div>
    </div>
  );
}
