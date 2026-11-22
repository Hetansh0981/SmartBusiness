'use client';

import React, { useState, useMemo } from 'react';
import FloatingCartBar from '@/components/storefront/FloatingCartBar';
import CartDrawer from '@/components/storefront/CartDrawer';
import CheckoutModal from '@/components/storefront/CheckoutModal';
import DynamicSectionRenderer from '@/components/storefront/DynamicSectionRenderer';
import ThemeWrapper from '@/components/storefront/ThemeWrapper';
import { CartProvider } from '@/lib/cartContext';
import { getStorefrontTheme } from '@/lib/storefrontThemes';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';
import type { Locale } from '@/lib/i18n/types';
import type { PublicStore, Category, Product } from '@/types';
import type { StorefrontConfig } from '@/types/customizer';

interface StorefrontViewProps {
  store: PublicStore;
  categories: Category[];
  products: Product[];
  config: StorefrontConfig;
  initialLocale?: Locale;
}

export default function StorefrontView({
  store,
  categories,
  products,
  config,
  initialLocale = 'en',
}: StorefrontViewProps) {
  const storefrontTheme = useMemo(() => getStorefrontTheme(store.category), [store.category]);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);

  const categoryMap = useMemo(() => {
    const map = new Map<string, Category>();
    categories.forEach((c) => map.set(c.id, c));
    return map;
  }, [categories]);

  return (
    <LanguageProvider initialLocale={initialLocale} scope="shopper">
      <CartProvider storeId={store.id}>
        <ThemeWrapper theme={config.theme}>
          <div className="min-h-screen flex flex-col relative pb-20">
            {/* Dynamic Section Renderer */}
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

            {/* Floating Overlays */}
            <FloatingCartBar themeAccentColor={config.theme.primaryColor} />
            <CartDrawer storeName={store.name} themeAccentColor={config.theme.primaryColor} />
            <CheckoutModal store={store} themeAccentColor={config.theme.primaryColor} />
          </div>
        </ThemeWrapper>
      </CartProvider>
    </LanguageProvider>
  );
}
