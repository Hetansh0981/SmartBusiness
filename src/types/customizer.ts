/**
 * TypeScript Definitions for DukaanOS Storefront Customization (Milestone 5)
 */

export interface ThemeTokens {
  primaryColor: string;       // e.g. '#ea580c'
  secondaryColor: string;     // e.g. '#059669'
  backgroundColor: string;    // e.g. '#f9f9ff'
  textColor: string;          // e.g. '#111827'
  fontFamily: 'Geist' | 'Inter' | 'Poppins' | 'Playfair' | 'DM Sans';
  buttonStyle: 'rounded' | 'pill' | 'sharp';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  sectionSpacing: 'compact' | 'normal' | 'spacious';
}

export interface HeaderSectionProps {
  sticky: boolean;
  showAnnouncement: boolean;
  announcementText: string;
  announcementLink: string | null;
  showWhatsAppButton: boolean;
  showLocationBadge: boolean;
  logoStyle: 'initials' | 'text';
}

export interface HeroSectionProps {
  badgeText: string;
  headline: string;
  tagline: string;
  showTrustBadges: boolean;
  backgroundStyle: 'subtle' | 'accent' | 'neutral';
}

export interface CategoryGridSectionProps {
  title: string;
  layout: 'pills' | 'cards' | 'compact';
  showItemCount: boolean;
}

export interface ProductGridSectionProps {
  title: string;
  columns: '2' | '3' | '4';
  showSearch: boolean;
  showStockFilter: boolean;
  showDiscountBadge: boolean;
  showMrp: boolean;
}

export interface PromoBannerSectionProps {
  headline: string;
  subheadline: string;
  badgeText: string | null;
  couponCode: string | null;
  buttonText: string | null;
  buttonLink: string | null;
  bannerStyle: 'saffron' | 'emerald' | 'charcoal';
}

export interface TextImageSectionProps {
  title: string;
  body: string;
  imagePosition: 'left' | 'right';
  imageUrl: string | null;
  buttonText: string | null;
  buttonLink: string | null;
}

export interface FooterSectionProps {
  showAddress: boolean;
  showWhatsAppSupport: boolean;
  customAboutText: string | null;
  showPoweredBy: boolean;
}

export type HeaderSectionConfig = {
  id: string;
  type: 'header';
  enabled: boolean;
  props: HeaderSectionProps;
};

export type HeroSectionConfig = {
  id: string;
  type: 'hero';
  enabled: boolean;
  props: HeroSectionProps;
};

export type CategoryGridSectionConfig = {
  id: string;
  type: 'category_grid';
  enabled: boolean;
  props: CategoryGridSectionProps;
};

export type ProductGridSectionConfig = {
  id: string;
  type: 'product_grid';
  enabled: boolean;
  props: ProductGridSectionProps;
};

export type PromoBannerSectionConfig = {
  id: string;
  type: 'promo_banner';
  enabled: boolean;
  props: PromoBannerSectionProps;
};

export type TextImageSectionConfig = {
  id: string;
  type: 'text_image';
  enabled: boolean;
  props: TextImageSectionProps;
};

export type FooterSectionConfig = {
  id: string;
  type: 'footer';
  enabled: boolean;
  props: FooterSectionProps;
};

export type SectionConfig =
  | HeaderSectionConfig
  | HeroSectionConfig
  | CategoryGridSectionConfig
  | ProductGridSectionConfig
  | PromoBannerSectionConfig
  | TextImageSectionConfig
  | FooterSectionConfig;

export type SectionType = SectionConfig['type'];

export interface StorefrontConfig {
  version: number;
  theme: ThemeTokens;
  sections: SectionConfig[];
}

export interface StoreCustomization {
  id: string;
  store_id: string;
  draft_config: StorefrontConfig;
  draft_revision: number;
  draft_updated_at: string;
  published_config: StorefrontConfig | null;
  published_at: string | null;
  version: number;
  created_at: string;
  updated_at: string;
}

export interface StoreCustomizationVersion {
  id: string;
  store_id: string;
  version: number;
  config: StorefrontConfig;
  published_by: string | null;
  created_at: string;
}
