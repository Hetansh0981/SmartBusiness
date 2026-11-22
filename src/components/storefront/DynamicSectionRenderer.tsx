'use client';

import React, { useMemo } from 'react';
import HeaderSection from './sections/HeaderSection';
import HeroSection from './sections/HeroSection';
import CategoryGridSection from './sections/CategoryGridSection';
import ProductGridSection from './sections/ProductGridSection';
import PromoBannerSection from './sections/PromoBannerSection';
import TextImageSection from './sections/TextImageSection';
import FooterSection from './sections/FooterSection';
import type { StorefrontConfig, SectionConfig } from '@/types/customizer';
import type { PublicStore, Category, Product } from '@/types';
import type { StorefrontTheme } from '@/lib/storefrontThemes';

interface DynamicSectionRendererProps {
  config: StorefrontConfig;
  store: PublicStore;
  categories: Category[];
  products: Product[];
  categoryMap: Map<string, Category>;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  inStockOnly: boolean;
  setInStockOnly: (v: boolean) => void;
  selectedCategory: string;
  setSelectedCategory: (c: string) => void;
  storefrontTheme: StorefrontTheme;
}

export default function DynamicSectionRenderer({
  config,
  store,
  categories,
  products,
  categoryMap,
  searchQuery,
  setSearchQuery,
  inStockOnly,
  setInStockOnly,
  selectedCategory,
  setSelectedCategory,
  storefrontTheme,
}: DynamicSectionRendererProps) {
  // Category-filtered products passed into ProductGrid
  const categoryFilteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;
    return products.filter((p) => p.category_id === selectedCategory);
  }, [products, selectedCategory]);

  return (
    <div className="flex flex-col min-h-screen">
      {config.sections.map((section: SectionConfig) => {
        if (!section.enabled) return null;

        switch (section.type) {
          case 'header':
            return (
              <HeaderSection
                key={section.id}
                id={section.id}
                props={section.props}
                store={store}
                theme={config.theme}
              />
            );

          case 'hero':
            return (
              <HeroSection
                key={section.id}
                id={section.id}
                props={section.props}
                store={store}
                theme={config.theme}
                productCount={products.length}
              />
            );

          case 'category_grid':
            return (
              <div key={section.id} className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <CategoryGridSection
                  id={section.id}
                  props={section.props}
                  categories={categories}
                  products={products}
                  selectedCategory={selectedCategory}
                  onSelectCategory={setSelectedCategory}
                  theme={config.theme}
                />
              </div>
            );

          case 'product_grid':
            return (
              <main key={section.id} className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8">
                <ProductGridSection
                  id={section.id}
                  props={section.props}
                  store={store}
                  products={categoryFilteredProducts}
                  categoryMap={categoryMap}
                  searchQuery={searchQuery}
                  setSearchQuery={setSearchQuery}
                  inStockOnly={inStockOnly}
                  setInStockOnly={setInStockOnly}
                  selectedCategory={selectedCategory}
                  setSelectedCategory={setSelectedCategory}
                  theme={config.theme}
                  storefrontTheme={storefrontTheme}
                />
              </main>
            );

          case 'promo_banner':
            return (
              <div key={section.id} className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <PromoBannerSection
                  id={section.id}
                  props={section.props}
                  theme={config.theme}
                />
              </div>
            );

          case 'text_image':
            return (
              <div key={section.id} className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
                <TextImageSection
                  id={section.id}
                  props={section.props}
                  theme={config.theme}
                />
              </div>
            );

          case 'footer':
            return (
              <FooterSection
                key={section.id}
                id={section.id}
                props={section.props}
                store={store}
                theme={config.theme}
              />
            );

          default:
            return null;
        }
      })}
    </div>
  );
}
