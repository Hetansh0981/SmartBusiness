/**
 * Default Category-Aware Storefront Configuration Generator
 * Generates initial configurations matching the merchant's business category.
 */

import { getStorefrontTheme } from '@/lib/storefrontThemes';
import type { StorefrontConfig } from '@/types/customizer';
import type { PublicStore } from '@/types';

export function getDefaultStorefrontConfig(store: PublicStore | { name: string; category: string; city?: string; state?: string }): StorefrontConfig {
  const theme = getStorefrontTheme(store.category);

  return {
    version: 1,
    theme: {
      primaryColor: theme.accentColor || '#ea580c',
      secondaryColor: '#059669',
      backgroundColor: '#f9f9ff',
      textColor: '#111827',
      fontFamily: 'Geist',
      buttonStyle: 'rounded',
      borderRadius: 'md',
      sectionSpacing: 'normal',
    },
    sections: [
      {
        id: 'sec_header_default',
        type: 'header',
        enabled: true,
        props: {
          sticky: true,
          showAnnouncement: false,
          announcementText: 'Welcome to our online store! Fast local delivery available.',
          announcementLink: null,
          showWhatsAppButton: true,
          showLocationBadge: true,
          logoStyle: 'initials',
        },
      },
      {
        id: 'sec_hero_default',
        type: 'hero',
        enabled: true,
        props: {
          badgeText: theme.badgeLabel || 'Verified Merchant Store',
          headline: store.name,
          tagline: theme.tagline || 'Browse our catalog and order directly on WhatsApp with Cash on Delivery.',
          showTrustBadges: true,
          backgroundStyle: 'subtle',
        },
      },
      {
        id: 'sec_cat_default',
        type: 'category_grid',
        enabled: true,
        props: {
          title: 'Shop by Category',
          layout: 'pills',
          showItemCount: true,
        },
      },
      {
        id: 'sec_prod_default',
        type: 'product_grid',
        enabled: true,
        props: {
          title: 'Featured Catalog',
          columns: '4',
          showSearch: true,
          showStockFilter: true,
          showDiscountBadge: true,
          showMrp: true,
        },
      },
      {
        id: 'sec_footer_default',
        type: 'footer',
        enabled: true,
        props: {
          showAddress: true,
          showWhatsAppSupport: true,
          customAboutText: `${store.name} offers authentic, local products delivered straight to your doorstep with Cash on Delivery and direct WhatsApp support.`,
          showPoweredBy: true,
        },
      },
    ],
  };
}
