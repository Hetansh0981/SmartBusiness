/**
 * Adaptive Storefront Theme Engine for DukaanOS
 * Adapts visual personality, colors, gradients, and badges to the store's business category.
 */

export interface StorefrontTheme {
  categoryKey: string;
  categoryLabel: string;
  badgeLabel: string;
  accentColor: string;
  accentBg: string;
  accentBorder: string;
  accentGlow: string;
  headerBg: string;
  heroGradient: string;
  buttonGradient: string;
  pillActiveGradient: string;
  tagline: string;
  iconName: 'utensils' | 'shirt' | 'shopping-basket' | 'smartphone' | 'gem' | 'sparkles' | 'palette' | 'store';
}

const THEMES: Record<string, StorefrontTheme> = {
  bakery_food: {
    categoryKey: 'bakery_food',
    categoryLabel: 'Bakery, Sweets & Cloud Kitchen',
    badgeLabel: 'Fresh Daily & Sweets',
    accentColor: '#f59e0b',
    accentBg: 'rgba(245, 158, 11, 0.1)',
    accentBorder: 'rgba(245, 158, 11, 0.25)',
    accentGlow: 'rgba(245, 158, 11, 0.35)',
    headerBg: '#090807',
    heroGradient: 'radial-gradient(ellipse at top, rgba(245, 158, 11, 0.18), transparent 70%)',
    buttonGradient: 'from-amber-500 via-orange-500 to-amber-600',
    pillActiveGradient: 'from-amber-500 to-orange-500',
    tagline: 'Handcrafted fresh sweets, savory farsan & gourmet delicacies prepared fresh daily.',
    iconName: 'utensils',
  },
  fashion_apparel: {
    categoryKey: 'fashion_apparel',
    categoryLabel: 'Fashion, Ethnic Wear & Boutiques',
    badgeLabel: 'Designer & Ethnic Boutique',
    accentColor: '#f43f5e',
    accentBg: 'rgba(244, 63, 94, 0.1)',
    accentBorder: 'rgba(244, 63, 94, 0.25)',
    accentGlow: 'rgba(244, 63, 94, 0.35)',
    headerBg: '#090708',
    heroGradient: 'radial-gradient(ellipse at top, rgba(244, 63, 94, 0.18), transparent 70%)',
    buttonGradient: 'from-rose-500 via-pink-500 to-rose-600',
    pillActiveGradient: 'from-rose-500 to-pink-500',
    tagline: 'Exclusive festive collection, authentic designer fabrics & custom tailored styles.',
    iconName: 'shirt',
  },
  kirana_grocery: {
    categoryKey: 'kirana_grocery',
    categoryLabel: 'Kirana & Daily Grocery',
    badgeLabel: 'Direct Farm & Daily Fresh',
    accentColor: '#10b981',
    accentBg: 'rgba(16, 185, 129, 0.1)',
    accentBorder: 'rgba(16, 185, 129, 0.25)',
    accentGlow: 'rgba(16, 185, 129, 0.35)',
    headerBg: '#060a08',
    heroGradient: 'radial-gradient(ellipse at top, rgba(16, 185, 129, 0.18), transparent 70%)',
    buttonGradient: 'from-emerald-500 via-teal-500 to-emerald-600',
    pillActiveGradient: 'from-emerald-500 to-teal-500',
    tagline: 'Quality groceries, daily essentials & staple provisions with reliable neighborhood delivery.',
    iconName: 'shopping-basket',
  },
  electronics_mobile: {
    categoryKey: 'electronics_mobile',
    categoryLabel: 'Electronics, Mobile & Hardware',
    badgeLabel: 'Genuine Warranty & Tech',
    accentColor: '#06b6d4',
    accentBg: 'rgba(6, 182, 212, 0.1)',
    accentBorder: 'rgba(6, 182, 212, 0.25)',
    accentGlow: 'rgba(6, 182, 212, 0.35)',
    headerBg: '#06090c',
    heroGradient: 'radial-gradient(ellipse at top, rgba(6, 182, 212, 0.18), transparent 70%)',
    buttonGradient: 'from-cyan-500 via-blue-500 to-cyan-600',
    pillActiveGradient: 'from-cyan-500 to-blue-500',
    tagline: 'Smart gadgets, genuine mobile accessories, repair parts & reliable hardware.',
    iconName: 'smartphone',
  },
  jewelry_accessories: {
    categoryKey: 'jewelry_accessories',
    categoryLabel: 'Jewelry, Accessories & Watches',
    badgeLabel: 'Hallmarked & Artisan Crafted',
    accentColor: '#eab308',
    accentBg: 'rgba(234, 179, 8, 0.1)',
    accentBorder: 'rgba(234, 179, 8, 0.25)',
    accentGlow: 'rgba(234, 179, 8, 0.35)',
    headerBg: '#090806',
    heroGradient: 'radial-gradient(ellipse at top, rgba(234, 179, 8, 0.18), transparent 70%)',
    buttonGradient: 'from-amber-400 via-yellow-500 to-amber-500',
    pillActiveGradient: 'from-amber-400 to-yellow-500',
    tagline: 'Timeless craftsmanship, precious jewelry ornaments & heirloom accessories.',
    iconName: 'gem',
  },
  health_beauty: {
    categoryKey: 'health_beauty',
    categoryLabel: 'Ayurveda, Pharmacy & Personal Care',
    badgeLabel: '100% Pure & Natural',
    accentColor: '#14b8a6',
    accentBg: 'rgba(20, 184, 166, 0.1)',
    accentBorder: 'rgba(20, 184, 166, 0.25)',
    accentGlow: 'rgba(20, 184, 166, 0.35)',
    headerBg: '#060a0a',
    heroGradient: 'radial-gradient(ellipse at top, rgba(20, 184, 166, 0.18), transparent 70%)',
    buttonGradient: 'from-teal-500 via-emerald-500 to-teal-600',
    pillActiveGradient: 'from-teal-500 to-emerald-500',
    tagline: 'Authentic Ayurvedic herbs, certified wellness essentials & natural care products.',
    iconName: 'sparkles',
  },
  home_handicrafts: {
    categoryKey: 'home_handicrafts',
    categoryLabel: 'Home Decor, Gifts & Handicrafts',
    badgeLabel: 'Artisan Heritage & Gifts',
    accentColor: '#ea580c',
    accentBg: 'rgba(234, 88, 12, 0.1)',
    accentBorder: 'rgba(234, 88, 12, 0.25)',
    accentGlow: 'rgba(234, 88, 12, 0.35)',
    headerBg: '#090706',
    heroGradient: 'radial-gradient(ellipse at top, rgba(234, 88, 12, 0.18), transparent 70%)',
    buttonGradient: 'from-orange-500 via-amber-600 to-orange-600',
    pillActiveGradient: 'from-orange-500 to-amber-600',
    tagline: 'Artisan handicrafts, festive gifting collections & handcrafted home accents.',
    iconName: 'palette',
  },
  services_other: {
    categoryKey: 'services_other',
    categoryLabel: 'Local Services & Other Retail',
    badgeLabel: 'Verified Merchant Store',
    accentColor: '#f97316',
    accentBg: 'rgba(249, 115, 22, 0.1)',
    accentBorder: 'rgba(249, 115, 22, 0.25)',
    accentGlow: 'rgba(249, 115, 22, 0.35)',
    headerBg: '#07090e',
    heroGradient: 'radial-gradient(ellipse at top, rgba(249, 115, 22, 0.18), transparent 70%)',
    buttonGradient: 'from-orange-500 via-amber-500 to-orange-600',
    pillActiveGradient: 'from-orange-500 to-amber-500',
    tagline: 'Trusted local retail catalog with direct WhatsApp customer ordering.',
    iconName: 'store',
  },
};

export function getStorefrontTheme(categoryKey?: string): StorefrontTheme {
  if (categoryKey && THEMES[categoryKey]) {
    return THEMES[categoryKey];
  }
  return THEMES.services_other;
}
