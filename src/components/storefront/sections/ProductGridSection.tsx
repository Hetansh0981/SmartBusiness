'use client';

import React from 'react';
import { Search, X, RotateCcw, ShoppingBag } from 'lucide-react';
import ProductCard from '@/components/storefront/ProductCard';
import { useStorefrontPreview } from '@/components/storefront/StorefrontPreviewContext';
import type { ProductGridSectionProps, ThemeTokens } from '@/types/customizer';
import type { Product, Category, PublicStore } from '@/types';
import type { StorefrontTheme } from '@/lib/storefrontThemes';

interface ProductGridSectionComponentProps {
  id: string;
  props: ProductGridSectionProps;
  store: PublicStore;
  products: Product[];
  categoryMap: Map<string, Category>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  theme: ThemeTokens;
  storefrontTheme: StorefrontTheme;
}

export default function ProductGridSection({
  id,
  props,
  store,
  products,
  categoryMap,
  searchQuery,
  setSearchQuery,
  inStockOnly,
  setInStockOnly,
  setSelectedCategory,
  theme,
  storefrontTheme,
}: ProductGridSectionComponentProps) {
  const { isEditorPreview, activeSectionId } = useStorefrontPreview();
  const isSelected = isEditorPreview && activeSectionId === id;

  // Filter products based on search and in-stock
  const filtered = products.filter((p) => {
    const matchesSearch =
      searchQuery.trim() === '' ||
      p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (p.description && p.description.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStock = !props.showStockFilter || !inStockOnly || p.in_stock;

    return matchesSearch && matchesStock;
  });

  const columnClasses = {
    '2': 'grid-cols-1 sm:grid-cols-2',
    '3': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    '4': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div
      data-section-id={id}
      className={`py-4 space-y-4 transition-all duration-200 ${
        isSelected ? 'ring-2 ring-[#ea580c] ring-offset-2 rounded-lg' : ''
      }`}
    >
      {/* Top Filter Bar (Search + In Stock Toggle) */}
      {(props.showSearch || props.showStockFilter) && (
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {props.showSearch && (
            <div className="relative flex-1 max-w-md">
              <input
                type="text"
                placeholder="Search products by name or keywords..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-8 py-1.5 h-9 bg-white border border-[#e5e7eb] text-xs sm:text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:ring-1 transition shadow-xs"
                style={{
                  borderRadius: 'var(--theme-radius, 8px)',
                  borderColor: '#e5e7eb',
                }}
              />
              <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#111827] p-0.5 cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          )}

          {props.showStockFilter && (
            <label
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-[#e5e7eb] text-xs text-[#4b5563] cursor-pointer select-none self-start sm:self-auto shadow-xs"
              style={{ borderRadius: 'var(--theme-radius, 8px)' }}
            >
              <input
                type="checkbox"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="rounded border-[#e5e7eb] text-[#ea580c] focus:ring-0 cursor-pointer"
              />
              <span className="font-medium text-xs text-[#111827]">In Stock Only</span>
            </label>
          )}
        </div>
      )}

      {/* Section Title */}
      {props.title && (
        <div className="flex items-center justify-between">
          <h2 className="text-base sm:text-lg font-bold text-[#111827] tracking-tight">
            {props.title}
          </h2>
          <span className="text-xs text-[#6b7280] font-mono-numbers">
            {filtered.length} {filtered.length === 1 ? 'item' : 'items'}
          </span>
        </div>
      )}

      {/* Product Grid / Filtered Empty State */}
      {filtered.length === 0 ? (
        <div className="py-16 text-center max-w-sm mx-auto">
          <div className="w-12 h-12 rounded-lg bg-white border border-[#e5e7eb] shadow-xs flex items-center justify-center mx-auto mb-3 text-[#9ca3af]">
            <ShoppingBag className="w-5 h-5 opacity-60" />
          </div>
          <h3 className="text-sm font-semibold text-[#111827] mb-1">No Matching Products</h3>
          <p className="text-xs text-[#6b7280] mb-4 leading-relaxed">
            No products match your search or selected filters.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setInStockOnly(false);
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-[#111827] text-xs font-medium shadow-xs transition cursor-pointer"
            style={{ borderRadius: 'var(--theme-radius, 8px)' }}
          >
            <RotateCcw className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Reset All Filters</span>
          </button>
        </div>
      ) : (
        <div className={`grid ${columnClasses[props.columns] || columnClasses['4']} gap-4`}>
          {filtered.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              category={product.category_id ? categoryMap.get(product.category_id) : null}
              storeName={store.name}
              whatsappNumber={store.whatsapp_number}
              theme={storefrontTheme}
            />
          ))}
        </div>
      )}
    </div>
  );
}
