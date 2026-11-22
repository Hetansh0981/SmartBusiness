import type {
  AiDesignProvider,
  SafeProviderStatus,
  BusinessProfile,
  DesignConcept,
  CatalogContext,
  AiConversationMessage,
} from './types';
import type { StorefrontConfig, SectionConfig, ThemeTokens } from '@/types/customizer';
import type { PublicStore } from '@/types';
import { validateStorefrontConfig } from '@/lib/customizer/schema';

export class BasicFallbackDesignProvider implements AiDesignProvider {
  name = 'dukaanos-basic-templates';

  async inspectAvailability(): Promise<SafeProviderStatus> {
    return {
      mode: 'basic',
      provider: 'DukaanOS Basic Designer (Rule-Based Templates)',
      reason: 'MISSING_API_KEY',
      dailyRequestsUsed: 0,
      dailyRequestsLimit: 100,
    };
  }

  async understandBusiness(
    prompt: string,
    existingProfile?: Partial<BusinessProfile>
  ): Promise<{
    isUnderstood: boolean;
    profile?: BusinessProfile;
    followUpQuestion?: string;
    missingFields?: string[];
  }> {
    const text = prompt.trim();
    if (text.length < 15 && (!existingProfile || !existingProfile.businessName)) {
      return {
        isUnderstood: false,
        followUpQuestion:
          'Could you tell me a little more about what your shop sells, where you are located, and the kind of customers you cater to?',
        missingFields: ['category', 'productTypes', 'pricePositioning'],
      };
    }

    const lower = text.toLowerCase();

    // Determine category & price positioning
    const isLuxury =
      lower.includes('luxury') ||
      lower.includes('premium') ||
      lower.includes('bridal') ||
      lower.includes('saree') ||
      lower.includes('jewel') ||
      lower.includes('gold');

    const isOrganic =
      lower.includes('organic') ||
      lower.includes('farm') ||
      lower.includes('ayurveda') ||
      lower.includes('herbal') ||
      lower.includes('health') ||
      lower.includes('dairy');

    const isTech =
      lower.includes('tech') ||
      lower.includes('mobile') ||
      lower.includes('gadget') ||
      lower.includes('electronic');

    const pricePositioning: BusinessProfile['pricePositioning'] = isLuxury
      ? 'luxury'
      : isOrganic
      ? 'premium'
      : 'mid-range';

    const typography: BusinessProfile['typography'] = isLuxury
      ? 'Playfair'
      : isOrganic
      ? 'DM Sans'
      : isTech
      ? 'Inter'
      : 'Poppins';

    const profile: BusinessProfile = {
      businessName: existingProfile?.businessName || 'My Store',
      category: isLuxury ? 'clothing' : isOrganic ? 'groceries' : isTech ? 'electronics' : 'retail',
      productTypes: isLuxury
        ? ['Handcrafted Sarees', 'Bridal Lehengas', 'Traditional Jewelry']
        : isOrganic
        ? ['Organic Produce', 'Herbal Extracts', 'Fresh Cold-Pressed Oils']
        : ['Featured Items', 'Best Sellers', 'New Arrivals'],
      targetAudience: isLuxury
        ? 'Festive shoppers and bridal connoisseurs'
        : isOrganic
        ? 'Health-conscious families'
        : 'Quality seekers',
      pricePositioning,
      brandPersonality: isLuxury
        ? 'Royal, handcrafted, heritage'
        : isOrganic
        ? 'Pure, sustainable, trusted'
        : 'Modern, reliable, value-driven',
      visualStyle: isLuxury ? 'traditional_luxury' : isOrganic ? 'natural_clean' : 'modern_retail',
      preferredColors: isLuxury
        ? ['#800020', '#d97706', '#fffdfa']
        : isOrganic
        ? ['#059669', '#d97706', '#f8faf8']
        : ['#ea580c', '#059669', '#ffffff'],
      typography,
      goals: ['High WhatsApp order conversions', 'Strong regional trust'],
      usps: ['Authentic direct-from-source', 'Fast COD dispatch'],
      languagePreference: lower.includes('hindi') || /[\u0900-\u097F]/.test(text) ? 'hi' : 'en',
    };

    return {
      isUnderstood: true,
      profile,
    };
  }

  async brainstormConcepts(
    profile: BusinessProfile,
    catalog: CatalogContext
  ): Promise<DesignConcept[]> {
    const isLuxury = profile.pricePositioning === 'luxury';
    const isOrganic = profile.category === 'groceries' || profile.visualStyle === 'natural_clean';

    if (isLuxury) {
      return [
        {
          id: 'concept_royal_heritage',
          name: 'Royal Heritage',
          tagline: 'Timeless Rajasthani Luxury & Craftsmanship',
          philosophy:
            'Celebrates regal Indian heritage with deep maroon, warm gold accents, and elegant Playfair serif typography.',
          colorPalette: {
            primary: '#800020',
            secondary: '#d97706',
            background: '#fffdfa',
            text: '#1a0508',
          },
          typography: 'Playfair',
          buttonStyle: 'rounded',
          borderRadius: 'sm',
          sectionOrder: [
            'header',
            'hero',
            'promo_banner',
            'category_grid',
            'product_grid',
            'text_image',
            'footer',
          ],
          heroConcept: 'Grand heritage headline with royal trust badges and festive announcement',
          promoConcept: 'Bridal consultation & festive booking banner with warm saffron styling',
          mobileDirection: 'Spacious card showcase with gold border accents and focused WhatsApp action',
        },
        {
          id: 'concept_modern_boutique',
          name: 'Modern Minimal Boutique',
          tagline: 'Contemporary Indian Haute Couture',
          philosophy:
            'High-fashion editorial elegance with generous whitespace, muted charcoals, and sharp architectural buttons.',
          colorPalette: {
            primary: '#18181b',
            secondary: '#71717a',
            background: '#ffffff',
            text: '#09090b',
          },
          typography: 'DM Sans',
          buttonStyle: 'sharp',
          borderRadius: 'none',
          sectionOrder: [
            'header',
            'hero',
            'category_grid',
            'product_grid',
            'text_image',
            'footer',
          ],
          heroConcept: 'Clean split story hero emphasizing textile craftsmanship and fine details',
          promoConcept: 'Minimalist private collection announcement',
          mobileDirection: 'Single-column editorial flow with high-contrast sharp buttons',
        },
        {
          id: 'concept_vibrant_celebration',
          name: 'Festive Celebration',
          tagline: 'Warm Saffron & Celebratory Splendor',
          philosophy:
            'Radiant festive Indian energy with warm saffron tones, pill-shaped action buttons, and high-density product discovery.',
          colorPalette: {
            primary: '#ea580c',
            secondary: '#059669',
            background: '#ffffff',
            text: '#111827',
          },
          typography: 'Poppins',
          buttonStyle: 'pill',
          borderRadius: 'full',
          sectionOrder: [
            'header',
            'promo_banner',
            'hero',
            'category_grid',
            'product_grid',
            'footer',
          ],
          heroConcept: 'Celebration greeting with instant WhatsApp order trigger and location verification',
          promoConcept: 'Seasonal discount code with prominent copy button',
          mobileDirection: '2-column responsive grid with quick-tap add-to-cart buttons',
        },
      ];
    }

    if (isOrganic) {
      return [
        {
          id: 'concept_botanic_wellness',
          name: 'Botanic Wellness',
          tagline: 'Pure & Certified Herbal Living',
          philosophy:
            'Fresh herbal greens with warm amber accents, soft pill geometry, and transparent sourcing storytelling.',
          colorPalette: {
            primary: '#059669',
            secondary: '#d97706',
            background: '#f8faf8',
            text: '#0f291e',
          },
          typography: 'DM Sans',
          buttonStyle: 'pill',
          borderRadius: 'full',
          sectionOrder: [
            'header',
            'hero',
            'category_grid',
            'promo_banner',
            'product_grid',
            'text_image',
            'footer',
          ],
          heroConcept: '100% farm-sourced guarantee badge with fresh emerald background gradient',
          promoConcept: 'First-time subscriber wellness discount banner',
          mobileDirection: 'Scrollable category pills with natural organic cards',
        },
        {
          id: 'concept_farm_fresh_direct',
          name: 'Farm Fresh Direct',
          tagline: 'Harvested Daily from Local Orchards',
          philosophy:
            'Earth-toned simplicity prioritizing speed of ordering, clear MRP discounts, and direct farmer WhatsApp chat.',
          colorPalette: {
            primary: '#15803d',
            secondary: '#b45309',
            background: '#ffffff',
            text: '#14532d',
          },
          typography: 'Poppins',
          buttonStyle: 'rounded',
          borderRadius: 'md',
          sectionOrder: [
            'header',
            'promo_banner',
            'hero',
            'category_grid',
            'product_grid',
            'footer',
          ],
          heroConcept: 'Same-day morning delivery promise with trust metrics',
          promoConcept: 'Weekend harvest special coupon banner',
          mobileDirection: 'Dense 2-column grid with clear stock count badges',
        },
        {
          id: 'concept_artisan_apothecary',
          name: 'Artisan Apothecary',
          tagline: 'Small-Batch Handcrafted Remedies',
          philosophy:
            'Heritage apothecary aesthetic with muted olive tones, Playfair Display serif headings, and story-first layout.',
          colorPalette: {
            primary: '#3f6212',
            secondary: '#ca8a04',
            background: '#fefce8',
            text: '#365314',
          },
          typography: 'Playfair',
          buttonStyle: 'rounded',
          borderRadius: 'sm',
          sectionOrder: [
            'header',
            'hero',
            'text_image',
            'category_grid',
            'product_grid',
            'promo_banner',
            'footer',
          ],
          heroConcept: 'Ancestral formula story header with purity guarantee',
          promoConcept: 'Seasonal remedy bundle coupon banner',
          mobileDirection: 'Story section placed prominently above products to build trust',
        },
      ];
    }

    // Default Retail / Kirana Concepts
    return [
      {
        id: 'concept_modern_saffron',
        name: 'Modern Saffron Retail',
        tagline: 'Fast, Friendly Indian Neighborhood Shopping',
        philosophy:
          'Warm saffron primary with emerald trust badges, Poppins friendly typography, and high-converting rounded buttons.',
        colorPalette: {
          primary: '#ea580c',
          secondary: '#059669',
          background: '#ffffff',
          text: '#111827',
        },
        typography: 'Poppins',
        buttonStyle: 'rounded',
        borderRadius: 'md',
        sectionOrder: [
          'header',
          'hero',
          'category_grid',
          'product_grid',
          'promo_banner',
          'text_image',
          'footer',
        ],
        heroConcept: 'Warm neighborhood greeting with live order status badge',
        promoConcept: 'Special festive discount coupon banner with 1-click copy',
        mobileDirection: 'High-contrast mobile buttons with fast category tap filtering',
      },
      {
        id: 'concept_minimal_clean',
        name: 'Minimalist Commerce',
        tagline: 'Distraction-Free Speed & Clarity',
        philosophy:
          'Clean white background with deep slate accents, Swiss-style Geist sans, and sharp modern buttons.',
        colorPalette: {
          primary: '#1e293b',
          secondary: '#ea580c',
          background: '#ffffff',
          text: '#0f172a',
        },
        typography: 'Geist',
        buttonStyle: 'sharp',
        borderRadius: 'sm',
        sectionOrder: [
          'header',
          'hero',
          'category_grid',
          'product_grid',
          'footer',
        ],
        heroConcept: 'Minimalist statement headline with streamlined search bar',
        promoConcept: 'Understated promotional callout banner',
        mobileDirection: 'Compact 4-column item discoverability on mobile viewports',
      },
      {
        id: 'concept_express_bazaar',
        name: 'Express Bazaar',
        tagline: 'High-Velocity Deals & Daily Offers',
        philosophy:
          'High-urgency promotional layout with top promo banner, vibrant capsule buttons, and dense product catalog.',
        colorPalette: {
          primary: '#2563eb',
          secondary: '#059669',
          background: '#f8fafc',
          text: '#0f172a',
        },
        typography: 'Inter',
        buttonStyle: 'pill',
        borderRadius: 'full',
        sectionOrder: [
          'header',
          'promo_banner',
          'hero',
          'category_grid',
          'product_grid',
          'footer',
        ],
        heroConcept: 'Instant COD ordering callout with verified local delivery',
        promoConcept: 'Flash sale banner positioned before the hero banner for maximum visibility',
        mobileDirection: 'Sticky header with prominent floating cart badge',
      },
    ];
  }

  async synthesizeStorefrontConfig(
    concept: DesignConcept,
    store: PublicStore,
    catalog: CatalogContext
  ): Promise<StorefrontConfig> {
    const theme: ThemeTokens = {
      primaryColor: concept.colorPalette.primary,
      secondaryColor: concept.colorPalette.secondary,
      backgroundColor: concept.colorPalette.background,
      textColor: concept.colorPalette.text,
      fontFamily: concept.typography,
      buttonStyle: concept.buttonStyle,
      borderRadius: concept.borderRadius,
      sectionSpacing: 'normal',
    };

    // Construct section configs strictly matching the M5 capability contract
    const sectionBuilders: Record<string, SectionConfig> = {
      header: {
        id: 'sec_header_main',
        type: 'header',
        enabled: true,
        props: {
          sticky: true,
          showAnnouncement: true,
          announcementText: `Special Offers & Free Delivery in ${store.city || 'your area'}!`,
          announcementLink: null,
          showWhatsAppButton: true,
          showLocationBadge: true,
          logoStyle: 'text',
        },
      },
      hero: {
        id: 'sec_hero_main',
        type: 'hero',
        enabled: true,
        props: {
          badgeText: concept.tagline.slice(0, 50),
          headline: `Welcome to ${store.name}`,
          tagline: `Order authentic ${catalog.category} items with Cash on Delivery and direct WhatsApp updates.`,
          showTrustBadges: true,
          backgroundStyle:
            concept.colorPalette.primary === '#800020'
              ? 'accent'
              : concept.colorPalette.background !== '#ffffff'
              ? 'subtle'
              : 'neutral',
        },
      },
      category_grid: {
        id: 'sec_category_nav',
        type: 'category_grid',
        enabled: true,
        props: {
          title: 'Browse Collections',
          layout: concept.buttonStyle === 'pill' ? 'pills' : 'cards',
          showItemCount: true,
        },
      },
      product_grid: {
        id: 'sec_product_catalog',
        type: 'product_grid',
        enabled: true,
        props: {
          title: 'Featured Products',
          columns: concept.colorPalette.primary === '#800020' ? '2' : '3',
          showSearch: true,
          showStockFilter: true,
          showDiscountBadge: true,
          showMrp: true,
        },
      },
      promo_banner: {
        id: 'sec_promo_special',
        type: 'promo_banner',
        enabled: true,
        props: {
          headline: 'Festive Season Savings',
          subheadline: `Get 10% off your entire order from ${store.name}. Limited time!`,
          badgeText: 'Special Offer',
          couponCode: 'SAVE10',
          buttonText: 'Order on WhatsApp',
          buttonLink: '/products',
          bannerStyle:
            concept.colorPalette.primary === '#059669' || concept.colorPalette.primary === '#15803d'
              ? 'emerald'
              : concept.colorPalette.primary === '#18181b'
              ? 'charcoal'
              : 'saffron',
        },
      },
      text_image: {
        id: 'sec_story_about',
        type: 'text_image',
        enabled: true,
        props: {
          title: `Craftsmanship at ${store.name}`,
          body: `We are proud to serve ${store.city || 'India'} with dedicated attention to quality, authentic products, and customer satisfaction. Thank you for shopping local with DukaanOS!`,
          imagePosition: 'right',
          imageUrl: null,
          buttonText: 'Enquire on WhatsApp',
          buttonLink: '/products',
        },
      },
      footer: {
        id: 'sec_footer_main',
        type: 'footer',
        enabled: true,
        props: {
          showAddress: true,
          showWhatsAppSupport: true,
          customAboutText: `${store.name} — Handcrafted with precision on DukaanOS. Cash on Delivery available across ${store.city || 'India'}.`,
          showPoweredBy: true,
        },
      },
    };

    // Arrange sections according to concept sectionOrder
    const sections: SectionConfig[] = [];
    concept.sectionOrder.forEach((secType) => {
      if (sectionBuilders[secType]) {
        sections.push(sectionBuilders[secType]);
      }
    });

    // Ensure mandatory header and footer are present
    if (!sections.some((s) => s.type === 'header')) {
      sections.unshift(sectionBuilders.header);
    }
    if (!sections.some((s) => s.type === 'footer')) {
      sections.push(sectionBuilders.footer);
    }
    if (!sections.some((s) => s.type === 'product_grid')) {
      sections.splice(2, 0, sectionBuilders.product_grid);
    }

    const config: StorefrontConfig = {
      version: 1,
      theme,
      sections,
    };

    // Pre-validate via strict Zod
    const validation = validateStorefrontConfig(config);
    if (!validation.success) {
      throw new Error(`Synthesized configuration failed Zod validation: ${validation.error}`);
    }

    return config;
  }

  async refineStorefrontConfig(
    currentConfig: StorefrontConfig,
    instruction: string,
    history: AiConversationMessage[]
  ): Promise<{
    updatedConfig: StorefrontConfig;
    explanation: string;
    patchSummary: string;
  }> {
    const text = instruction.toLowerCase();
    const updatedTheme: ThemeTokens = { ...currentConfig.theme };
    let updatedSections: SectionConfig[] = [...currentConfig.sections];
    const patches: string[] = [];

    // 1. Button Geometry Patching
    if (text.includes('pill') || text.includes('capsule')) {
      updatedTheme.buttonStyle = 'pill';
      updatedTheme.borderRadius = 'full';
      patches.push('Changed button shape to capsule pill with full border radius');
    } else if (text.includes('sharp') || text.includes('square')) {
      updatedTheme.buttonStyle = 'sharp';
      updatedTheme.borderRadius = 'none';
      patches.push('Changed button shape to sharp geometric edges (0px)');
    } else if (text.includes('round') && !text.includes('background')) {
      updatedTheme.buttonStyle = 'rounded';
      updatedTheme.borderRadius = 'md';
      patches.push('Changed button shape to standard retail rounded (8px)');
    }

    // 2. Background Treatment Patching
    if (text.includes('dark') || text.includes('night') || text.includes('black')) {
      updatedTheme.backgroundColor = '#0f172a';
      updatedTheme.textColor = '#f8fafc';
      patches.push('Applied dark slate background treatment with high-contrast text');
    } else if (text.includes('white') || text.includes('light') || text.includes('clean')) {
      updatedTheme.backgroundColor = '#ffffff';
      updatedTheme.textColor = '#111827';
      patches.push('Applied clean white background treatment');
    } else if (text.includes('ivory') || text.includes('cream')) {
      updatedTheme.backgroundColor = '#fffdfa';
      updatedTheme.textColor = '#1a0508';
      patches.push('Applied warm royal ivory background');
    }

    // 3. Color Palette Patching
    if (text.includes('saffron') || text.includes('orange')) {
      updatedTheme.primaryColor = '#ea580c';
      patches.push('Updated primary accent to warm Saffron (#ea580c)');
    } else if (text.includes('emerald') || text.includes('green')) {
      updatedTheme.primaryColor = '#059669';
      patches.push('Updated primary accent to Emerald (#059669)');
    } else if (text.includes('maroon') || text.includes('burgundy')) {
      updatedTheme.primaryColor = '#800020';
      patches.push('Updated primary accent to Royal Maroon (#800020)');
    } else if (text.includes('gold') || text.includes('amber')) {
      updatedTheme.secondaryColor = '#d97706';
      patches.push('Updated secondary accent to Warm Gold (#d97706)');
    }

    // 4. Typography Patching
    if (text.includes('serif') || text.includes('playfair') || text.includes('luxury font')) {
      updatedTheme.fontFamily = 'Playfair';
      patches.push('Switched typography to Playfair Display serif');
    } else if (text.includes('sans') || text.includes('modern font') || text.includes('geist')) {
      updatedTheme.fontFamily = 'Geist';
      patches.push('Switched typography to modern Geist sans-serif');
    } else if (text.includes('poppins') || text.includes('friendly')) {
      updatedTheme.fontFamily = 'Poppins';
      patches.push('Switched typography to friendly Poppins');
    }

    // 5. Section Reordering Patching
    if (text.includes('promo') && (text.includes('above') || text.includes('before') || text.includes('top'))) {
      const promoIndex = updatedSections.findIndex((s) => s.type === 'promo_banner');
      if (promoIndex > -1) {
        const [promoSec] = updatedSections.splice(promoIndex, 1);
        // Insert right after header (index 1)
        updatedSections.splice(1, 0, promoSec);
        patches.push('Moved promotional banner to the top right below the header');
      }
    } else if (text.includes('product') && (text.includes('column') || text.includes('smaller') || text.includes('compact'))) {
      updatedSections = updatedSections.map((s) => {
        if (s.type === 'product_grid') {
          return {
            ...s,
            props: {
              ...s.props,
              columns: '4',
            },
          };
        }
        return s;
      });
      patches.push('Updated product showcase to 4-column compact density');
    }

    if (patches.length === 0) {
      patches.push(`Applied customized styling adjustments based on "${instruction}"`);
    }

    const updatedConfig: StorefrontConfig = {
      ...currentConfig,
      theme: updatedTheme,
      sections: updatedSections,
    };

    // Validate patch with strict Zod
    const validation = validateStorefrontConfig(updatedConfig);
    if (!validation.success) {
      throw new Error(`Refined configuration failed Zod validation: ${validation.error}`);
    }

    return {
      updatedConfig,
      explanation: patches.join('. ') + '.',
      patchSummary: patches[0],
    };
  }
}
