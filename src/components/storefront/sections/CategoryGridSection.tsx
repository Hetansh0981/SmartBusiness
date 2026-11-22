'use client';

import React from 'react';
import { useStorefrontPreview } from '@/components/storefront/StorefrontPreviewContext';
import type { CategoryGridSectionProps, ThemeTokens } from '@/types/customizer';
import type { Category, Product } from '@/types';

interface CategoryGridSectionComponentProps {
  id: string;
  props: CategoryGridSectionProps;
  categories: Category[];
  products: Product[];
  selectedCategory: string;
  onSelectCategory: (catId: string) => void;
  theme: ThemeTokens;
}

export default function CategoryGridSection({
  id,
  props,
  categories,
  products,
  selectedCategory,
  onSelectCategory,
  theme,
}: CategoryGridSectionComponentProps) {
  const { isEditorPreview, activeSectionId } = useStorefrontPreview();
  const isSelected = isEditorPreview && activeSectionId === id;

  if (categories.length === 0) return null;

  return (
    <div
      data-section-id={id}
      className={`py-3 transition-all duration-200 ${
        isSelected ? 'ring-2 ring-[#ea580c] ring-offset-2 rounded-lg' : ''
      }`}
    >
      {props.title && (
        <h3 className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider mb-2">
          {props.title}
        </h3>
      )}

      {props.layout === 'cards' ? (
        /* Cards Layout */
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-2">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`p-3 rounded border text-left transition cursor-pointer ${
              selectedCategory === 'all'
                ? 'border-transparent text-white shadow-xs'
                : 'bg-white text-[#111827] border-[#e5e7eb] hover:bg-[#f9fafb]'
            }`}
            style={{
              backgroundColor: selectedCategory === 'all' ? theme.primaryColor : undefined,
              borderRadius: 'var(--theme-radius, 8px)',
            }}
          >
            <div className="font-semibold text-xs sm:text-sm">All Items</div>
            {props.showItemCount && (
              <div
                className={`text-[11px] font-mono-numbers mt-0.5 ${
                  selectedCategory === 'all' ? 'text-white/80' : 'text-[#6b7280]'
                }`}
              >
                {products.length} products
              </div>
            )}
          </button>

          {categories.map((c) => {
            const count = products.filter((p) => p.category_id === c.id).length;
            const isCatSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c.id)}
                className={`p-3 rounded border text-left transition cursor-pointer ${
                  isCatSelected
                    ? 'border-transparent text-white shadow-xs'
                    : 'bg-white text-[#111827] border-[#e5e7eb] hover:bg-[#f9fafb]'
                }`}
                style={{
                  backgroundColor: isCatSelected ? theme.primaryColor : undefined,
                  borderRadius: 'var(--theme-radius, 8px)',
                }}
              >
                <div className="font-semibold text-xs sm:text-sm truncate">{c.name}</div>
                {props.showItemCount && (
                  <div
                    className={`text-[11px] font-mono-numbers mt-0.5 ${
                      isCatSelected ? 'text-white/80' : 'text-[#6b7280]'
                    }`}
                  >
                    {count} products
                  </div>
                )}
              </button>
            );
          })}
        </div>
      ) : (
        /* Pills & Compact Horizontal Scroll Strip */
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none scrollbar-none">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1 text-xs font-medium transition cursor-pointer whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'text-white shadow-xs font-semibold'
                : 'bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f9fafb]'
            }`}
            style={{
              backgroundColor: selectedCategory === 'all' ? theme.primaryColor : undefined,
              borderRadius: props.layout === 'compact' ? '4px' : 'var(--theme-button-radius, var(--theme-radius, 8px))',
            }}
          >
            All Items ({products.length})
          </button>

          {categories.map((c) => {
            const count = products.filter((p) => p.category_id === c.id).length;
            const isCatSelected = selectedCategory === c.id;
            return (
              <button
                key={c.id}
                type="button"
                onClick={() => onSelectCategory(c.id)}
                className={`px-3 py-1 text-xs font-medium transition cursor-pointer whitespace-nowrap flex items-center gap-1.5 ${
                  isCatSelected
                    ? 'text-white shadow-xs font-semibold'
                    : 'bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f9fafb]'
                }`}
                style={{
                  backgroundColor: isCatSelected ? theme.primaryColor : undefined,
                  borderRadius: props.layout === 'compact' ? '4px' : 'var(--theme-button-radius, var(--theme-radius, 8px))',
                }}
              >
                <span>{c.name}</span>
                {props.showItemCount && (
                  <span
                    className={`text-[10px] px-1 py-0.2 rounded font-mono-numbers ${
                      isCatSelected ? 'bg-black/20' : 'bg-[#f3f4f6]'
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
