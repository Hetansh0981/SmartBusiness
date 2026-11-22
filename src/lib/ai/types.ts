/**
 * DukaanOS Milestone 6 — AI Storefront Designer Type Definitions
 */

import type { StorefrontConfig, SectionType, ThemeTokens } from '@/types/customizer';
import type { PublicStore, Category, Product } from '@/types';

export type AiProviderMode = 'ai' | 'basic' | 'unavailable' | 'rate_limited';

export interface SafeProviderStatus {
  mode: AiProviderMode;
  provider: string;
  model?: string;
  reason?: string;
  dailyRequestsUsed: number;
  dailyRequestsLimit: number;
}

export interface BusinessProfile {
  businessName: string;
  category: string;
  productTypes: string[];
  targetAudience: string;
  pricePositioning: 'budget' | 'mid-range' | 'premium' | 'luxury';
  brandPersonality: string;
  visualStyle: string;
  preferredColors: string[];
  typography: 'Geist' | 'Inter' | 'Poppins' | 'Playfair' | 'DM Sans';
  goals: string[];
  usps: string[];
  languagePreference: 'en' | 'hi' | 'hinglish';
  restrictions?: string[];
}

export interface DesignConcept {
  id: string;
  name: string;
  tagline: string;
  philosophy: string;
  colorPalette: {
    primary: string;
    secondary: string;
    background: string;
    text: string;
  };
  typography: 'Geist' | 'Inter' | 'Poppins' | 'Playfair' | 'DM Sans';
  buttonStyle: 'rounded' | 'pill' | 'sharp';
  borderRadius: 'none' | 'sm' | 'md' | 'lg' | 'full';
  sectionOrder: SectionType[];
  heroConcept: string;
  promoConcept: string;
  mobileDirection: string;
}

export interface AiConversationMessage {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  stage: 'understanding' | 'concepts' | 'refining';
  createdAt: string;
  concepts?: DesignConcept[];
  missingFields?: string[];
  explanation?: string;
}

export interface CatalogContext {
  storeName: string;
  category: string;
  city: string;
  state: string;
  categories: Array<{ id: string; name: string }>;
  sampleProducts: Array<{ name: string; price: number; description?: string | null }>;
}

export interface AiDesignProvider {
  name: string;
  inspectAvailability(): Promise<SafeProviderStatus>;

  understandBusiness(
    prompt: string,
    existingProfile?: Partial<BusinessProfile>
  ): Promise<{
    isUnderstood: boolean;
    profile?: BusinessProfile;
    followUpQuestion?: string;
    missingFields?: string[];
  }>;

  brainstormConcepts(
    profile: BusinessProfile,
    catalog: CatalogContext
  ): Promise<DesignConcept[]>;

  synthesizeStorefrontConfig(
    concept: DesignConcept,
    store: PublicStore,
    catalog: CatalogContext
  ): Promise<StorefrontConfig>;

  refineStorefrontConfig(
    currentConfig: StorefrontConfig,
    instruction: string,
    history: AiConversationMessage[]
  ): Promise<{
    updatedConfig: StorefrontConfig;
    explanation: string;
    patchSummary: string;
  }>;
}
