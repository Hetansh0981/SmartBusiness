/**
 * Strict Zod Validation Schemas for DukaanOS Storefront Customization
 * Perfectly aligns with the PostgreSQL validate_storefront_config function.
 */

import { z } from 'zod';

// 1. Primitive Sanitizers & Format Validators
const SafeText = (min: number, max: number) =>
  z.string()
    .min(min, { message: `Minimum ${min} characters required` })
    .max(max, { message: `Maximum ${max} characters allowed` });

const SafeUrl = z.string()
  .max(300, { message: 'URL cannot exceed 300 characters' })
  .refine((url) => !url.startsWith('//'), { message: 'Protocol-relative URLs (//) are strictly prohibited' })
  .refine((url) => !/^\s*(javascript|data|vbscript):/i.test(url), { message: 'Unsafe URI scheme detected' })
  .refine(
    (url) => !url || /^https:\/\/[a-zA-Z0-9\-\.]+(\/.*)?$/i.test(url) || /^\/[a-zA-Z0-9_\-\/]*$/.test(url),
    { message: 'URLs must be HTTPS (https://) or internal relative routes starting with /' }
  )
  .nullable();

const HexColor = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Must be a 6-character hex color (#RRGGBB)');

// 2. Global Theme Tokens Schema (Strict)
export const ThemeTokensSchema = z.object({
  primaryColor: HexColor,
  secondaryColor: HexColor,
  backgroundColor: HexColor,
  textColor: HexColor,
  fontFamily: z.enum(['Geist', 'Inter', 'Poppins', 'Playfair', 'DM Sans']),
  buttonStyle: z.enum(['rounded', 'pill', 'sharp']),
  borderRadius: z.enum(['none', 'sm', 'md', 'lg', 'full']),
  sectionSpacing: z.enum(['compact', 'normal', 'spacious']),
}).strict();

// 3. Section Schemas (All Strict)

// Header
export const HeaderSectionSchema = z.object({
  id: z.string().min(3).max(60),
  type: z.literal('header'),
  enabled: z.boolean(),
  props: z.object({
    sticky: z.boolean(),
    showAnnouncement: z.boolean(),
    announcementText: SafeText(0, 100),
    announcementLink: SafeUrl,
    showWhatsAppButton: z.boolean(),
    showLocationBadge: z.boolean(),
    logoStyle: z.enum(['initials', 'text']),
  }).strict(),
}).strict();

// Hero Banner
export const HeroSectionSchema = z.object({
  id: z.string().min(3).max(60),
  type: z.literal('hero'),
  enabled: z.boolean(),
  props: z.object({
    badgeText: SafeText(0, 50),
    headline: SafeText(2, 120),
    tagline: SafeText(0, 300),
    showTrustBadges: z.boolean(),
    backgroundStyle: z.enum(['subtle', 'accent', 'neutral']),
  }).strict(),
}).strict();

// Category Grid
export const CategoryGridSectionSchema = z.object({
  id: z.string().min(3).max(60),
  type: z.literal('category_grid'),
  enabled: z.boolean(),
  props: z.object({
    title: SafeText(0, 60),
    layout: z.enum(['pills', 'cards', 'compact']),
    showItemCount: z.boolean(),
  }).strict(),
}).strict();

// Product Grid
export const ProductGridSectionSchema = z.object({
  id: z.string().min(3).max(60),
  type: z.literal('product_grid'),
  enabled: z.boolean(),
  props: z.object({
    title: SafeText(0, 60),
    columns: z.enum(['2', '3', '4']),
    showSearch: z.boolean(),
    showStockFilter: z.boolean(),
    showDiscountBadge: z.boolean(),
    showMrp: z.boolean(),
  }).strict(),
}).strict();

// Promo Banner
export const PromoBannerSectionSchema = z.object({
  id: z.string().min(3).max(60),
  type: z.literal('promo_banner'),
  enabled: z.boolean(),
  props: z.object({
    headline: SafeText(2, 100),
    subheadline: SafeText(0, 200),
    badgeText: SafeText(0, 40).nullable(),
    couponCode: SafeText(0, 30).nullable(),
    buttonText: SafeText(0, 40).nullable(),
    buttonLink: SafeUrl,
    bannerStyle: z.enum(['saffron', 'emerald', 'charcoal']),
  }).strict(),
}).strict();

// Text and Image Section
export const TextImageSectionSchema = z.object({
  id: z.string().min(3).max(60),
  type: z.literal('text_image'),
  enabled: z.boolean(),
  props: z.object({
    title: SafeText(2, 100),
    body: SafeText(5, 1000),
    imagePosition: z.enum(['left', 'right']),
    imageUrl: SafeUrl,
    buttonText: SafeText(0, 40).nullable(),
    buttonLink: SafeUrl,
  }).strict(),
}).strict();

// Footer
export const FooterSectionSchema = z.object({
  id: z.string().min(3).max(60),
  type: z.literal('footer'),
  enabled: z.boolean(),
  props: z.object({
    showAddress: z.boolean(),
    showWhatsAppSupport: z.boolean(),
    customAboutText: SafeText(0, 300).nullable(),
    showPoweredBy: z.boolean(),
  }).strict(),
}).strict();

// Discriminated Union
export const SectionConfigSchema = z.discriminatedUnion('type', [
  HeaderSectionSchema,
  HeroSectionSchema,
  CategoryGridSectionSchema,
  ProductGridSectionSchema,
  PromoBannerSectionSchema,
  TextImageSectionSchema,
  FooterSectionSchema,
]);

// 4. Root Storefront Configuration Schema (Strict)
export const StorefrontConfigSchema = z.object({
  version: z.number().int().nonnegative().default(1),
  theme: ThemeTokensSchema,
  sections: z.array(SectionConfigSchema).min(1).max(20),
}).strict().superRefine((val, ctx) => {
  const idSet = new Set<string>();
  let headerCount = 0;
  let footerCount = 0;
  let productGridCount = 0;
  let enabledHeaderCount = 0;
  let enabledFooterCount = 0;
  let enabledProductGridCount = 0;

  for (let i = 0; i < val.sections.length; i++) {
    const sec = val.sections[i];
    if (idSet.has(sec.id)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Duplicate section ID "${sec.id}" detected in configuration`,
        path: ['sections', i, 'id'],
      });
    }
    idSet.add(sec.id);

    if (sec.type === 'header') {
      headerCount++;
      if (sec.enabled) enabledHeaderCount++;
    }
    if (sec.type === 'footer') {
      footerCount++;
      if (sec.enabled) enabledFooterCount++;
    }
    if (sec.type === 'product_grid') {
      productGridCount++;
      if (sec.enabled) enabledProductGridCount++;
    }
  }

  if (headerCount !== 1 || enabledHeaderCount !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Storefront configuration must contain exactly one enabled header section',
      path: ['sections'],
    });
  }
  if (footerCount !== 1 || enabledFooterCount !== 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Storefront configuration must contain exactly one enabled footer section',
      path: ['sections'],
    });
  }
  if (productGridCount < 1 || enabledProductGridCount < 1) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Storefront configuration must contain at least one enabled product grid section',
      path: ['sections'],
    });
  }
});

/**
 * Validates a candidate StorefrontConfig against strict schema rules.
 */
export function validateStorefrontConfig(config: unknown) {
  return StorefrontConfigSchema.safeParse(config);
}
