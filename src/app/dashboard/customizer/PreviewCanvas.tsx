'use client';

import React, { useState, useMemo } from 'react';
import DynamicSectionRenderer from '@/components/storefront/DynamicSectionRenderer';
import ThemeWrapper from '@/components/storefront/ThemeWrapper';
import FloatingCartBar from '@/components/storefront/FloatingCartBar';
import CartDrawer from '@/components/storefront/CartDrawer';
import {
  StorefrontPreviewProvider,
  StorefrontPreviewCartProvider,
} from '@/components/storefront/StorefrontPreviewContext';
import { getStorefrontTheme } from '@/lib/storefrontThemes';
import type { StorefrontConfig } from '@/types/customizer';
import type { PublicStore, Category, Product } from '@/types';

interface PreviewCanvasProps {
  config: StorefrontConfig;
  store: PublicStore;
  categories: Category[];
  products: Product[];
  viewport: 'desktop' | 'tablet' | 'mobile';
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onInterceptAction: (actionName: string) => void;
}

export default function PreviewCanvas({
  config,
  store,
  categories,
  products,
  viewport,
  activeSectionId,
  onSelectSection,
  onInterceptAction,
}: PreviewCanvasProps) {
  const storefrontTheme = useMemo(() => getStorefrontTheme(store.category), [store.category]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  const isMobile = viewport === 'mobile';
  const isTablet = viewport === 'tablet';

  return (
    <div className="flex-1 bg-[#f3f4f6] overflow-y-auto flex justify-center p-3 sm:p-6 select-none">
      <div
        className={`transition-all duration-300 relative ${
          isMobile
            ? 'w-[375px] max-w-[375px] my-4 rounded-[36px] border-[8px] border-[#1f2937] shadow-2xl overflow-hidden bg-white'
            : isTablet
            ? 'w-[768px] max-w-[768px] my-4 rounded-[24px] border-[6px] border-[#1f2937] shadow-xl overflow-hidden bg-white'
            : 'w-full max-w-6xl my-2 rounded-lg border border-[#e5e7eb] shadow-sm bg-white overflow-hidden'
        }`}
      >
        {/* Mobile Device Island & Camera Notch */}
        {isMobile && (
          <div className="h-6 bg-[#1f2937] w-full flex items-center justify-center sticky top-0 z-50">
            <div className="w-20 h-3.5 bg-black rounded-full" />
          </div>
        )}

        {/* Memory-Only Isolated Preview Providers */}
        <StorefrontPreviewCartProvider>
          <StorefrontPreviewProvider
            isEditorPreview={true}
            activeSectionId={activeSectionId}
            onSelectSection={onSelectSection}
            onInterceptAction={onInterceptAction}
          >
            <ThemeWrapper theme={config.theme}>
              <div className="min-h-[600px] flex flex-col relative pb-16">
                <DynamicSectionRenderer
                  config={config}
                  store={store}
                  categories={categories}
                  products={products}
                  categoryMap={categoryMap}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  storefrontTheme={storefrontTheme}
                />

                {/* Simulated Floating Cart Bar for Visual Verification */}
                <FloatingCartBar themeAccentColor={config.theme.primaryColor} />
                <CartDrawer storeName={store.name} themeAccentColor={config.theme.primaryColor} />
              </div>
            </ThemeWrapper>
          </StorefrontPreviewProvider>
        </StorefrontPreviewCartProvider>
      </div>
    </div>
  );
}
