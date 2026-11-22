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
import { BasicFallbackDesignProvider } from './BasicFallbackDesignProvider';

export class GeminiAiDesignProvider implements AiDesignProvider {
  name = 'google-gemini';
  private fallback = new BasicFallbackDesignProvider();

  private getModel(): string {
    return process.env.GEMINI_MODEL || 'gemini-2.0-flash';
  }

  private getApiKey(): string | undefined {
    return process.env.GEMINI_API_KEY;
  }

  private getTimeoutMs(): number {
    return parseInt(process.env.GEMINI_API_TIMEOUT_MS || '15000', 10);
  }

  async inspectAvailability(): Promise<SafeProviderStatus> {
    const key = this.getApiKey();
    if (!key) {
      return {
        mode: 'basic',
        provider: 'DukaanOS Basic Designer (Offline Templates)',
        reason: 'MISSING_API_KEY',
        dailyRequestsUsed: 0,
        dailyRequestsLimit: 100,
      };
    }

    return {
      mode: 'ai',
      provider: 'Google Gemini',
      model: this.getModel(),
      dailyRequestsUsed: 0,
      dailyRequestsLimit: 30,
    };
  }

  private async callGeminiJson<T>(systemPrompt: string, userPrompt: string): Promise<T> {
    const apiKey = this.getApiKey();
    if (!apiKey) {
      throw new Error('MISSING_API_KEY');
    }

    const model = this.getModel();
    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.getTimeoutMs());

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [{ text: `${systemPrompt}\n\nUSER REQUEST:\n${userPrompt}` }],
            },
          ],
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
            responseMimeType: 'application/json',
          },
        }),
        signal: controller.signal,
      });

      clearTimeout(timeout);

      if (response.status === 429) {
        throw new Error('RATE_LIMITED');
      }

      if (!response.ok) {
        throw new Error(`PROVIDER_ERROR_${response.status}`);
      }

      const data = await response.json();
      const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!rawText) {
        throw new Error('EMPTY_GEMINI_RESPONSE');
      }

      return JSON.parse(rawText) as T;
    } catch (err: unknown) {
      clearTimeout(timeout);
      if (err instanceof Error && err.name === 'AbortError') {
        throw new Error('PROVIDER_TIMEOUT');
      }
      throw err;
    }
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
    const key = this.getApiKey();
    if (!key) {
      return this.fallback.understandBusiness(prompt, existingProfile);
    }

    const systemPrompt = `You are the DukaanOS Lead Brand & Storefront Architect for Indian local businesses.
Analyze the merchant's input in English, Hindi, or Hinglish.
Extract structured information into a complete BusinessProfile JSON.
Available Typography: "Geist", "Inter", "Poppins", "Playfair", "DM Sans".
Price positioning: "budget", "mid-range", "premium", or "luxury".
Language preference: "en", "hi", or "hinglish".
If crucial information is missing (less than 10 words or lacks business type), set isUnderstood: false and provide a polite followUpQuestion in the merchant's language.

Expected JSON output format:
{
  "isUnderstood": boolean,
  "followUpQuestion": string or null,
  "missingFields": string[],
  "profile": {
    "businessName": string,
    "category": string,
    "productTypes": string[],
    "targetAudience": string,
    "pricePositioning": "budget" | "mid-range" | "premium" | "luxury",
    "brandPersonality": string,
    "visualStyle": string,
    "preferredColors": string[],
    "typography": "Geist" | "Inter" | "Poppins" | "Playfair" | "DM Sans",
    "goals": string[],
    "usps": string[],
    "languagePreference": "en" | "hi" | "hinglish"
  }
}`;

    try {
      const res = await this.callGeminiJson<{
        isUnderstood: boolean;
        followUpQuestion?: string | null;
        missingFields?: string[];
        profile?: BusinessProfile;
      }>(systemPrompt, prompt);

      return {
        isUnderstood: res.isUnderstood,
        followUpQuestion: res.followUpQuestion || undefined,
        missingFields: res.missingFields || [],
        profile: res.profile,
      };
    } catch (err) {
      console.warn('Gemini understandBusiness fallback triggered:', err);
      return this.fallback.understandBusiness(prompt, existingProfile);
    }
  }

  async brainstormConcepts(
    profile: BusinessProfile,
    catalog: CatalogContext
  ): Promise<DesignConcept[]> {
    const key = this.getApiKey();
    if (!key) {
      return this.fallback.brainstormConcepts(profile, catalog);
    }

    const systemPrompt = `You are DukaanOS Chief Creative Director. Generate exactly 3 genuinely differentiated design concepts for this Indian merchant.
Concepts MUST differ substantially in:
1. Layout Composition & Section Order: choose valid permutations of ["header", "hero", "promo_banner", "category_grid", "product_grid", "text_image", "footer"]
2. Typography: "Playfair" (Heritage/Luxury), "DM Sans" (Clean Minimal), "Poppins" (Friendly Retail), "Inter" (Tech/Precision), "Geist" (Modernist).
3. Button styles: "sharp" (0px), "rounded" (8px), "pill" (9999px).
4. Border Radii: "none", "sm", "md", "lg", "full".
5. Color palettes: valid 6-char hex codes (#RRGGBB).

Expected JSON:
{
  "concepts": [
    {
      "id": "concept_1",
      "name": string,
      "tagline": string,
      "philosophy": string,
      "colorPalette": { "primary": "#RRGGBB", "secondary": "#RRGGBB", "background": "#RRGGBB", "text": "#RRGGBB" },
      "typography": "Geist" | "Inter" | "Poppins" | "Playfair" | "DM Sans",
      "buttonStyle": "rounded" | "pill" | "sharp",
      "borderRadius": "none" | "sm" | "md" | "lg" | "full",
      "sectionOrder": string[],
      "heroConcept": string,
      "promoConcept": string,
      "mobileDirection": string
    }
  ]
}`;

    const userPrompt = `Store: ${catalog.storeName} (${catalog.city}, ${catalog.state})
Category: ${catalog.category}
Profile: ${JSON.stringify(profile)}
Sample Categories: ${catalog.categories.map((c) => c.name).join(', ')}
Sample Products: ${catalog.sampleProducts.map((p) => p.name).join(', ')}`;

    try {
      const res = await this.callGeminiJson<{ concepts: DesignConcept[] }>(systemPrompt, userPrompt);
      if (Array.isArray(res.concepts) && res.concepts.length >= 3) {
        return res.concepts.slice(0, 3);
      }
      return this.fallback.brainstormConcepts(profile, catalog);
    } catch (err) {
      console.warn('Gemini brainstormConcepts fallback triggered:', err);
      return this.fallback.brainstormConcepts(profile, catalog);
    }
  }

  async synthesizeStorefrontConfig(
    concept: DesignConcept,
    store: PublicStore,
    catalog: CatalogContext
  ): Promise<StorefrontConfig> {
    // The synthesis must strictly match the database schema and renderer capability contract.
    // BasicFallbackDesignProvider has the certified 100% Zod-validated template mapping.
    return this.fallback.synthesizeStorefrontConfig(concept, store, catalog);
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
    const key = this.getApiKey();
    if (!key) {
      return this.fallback.refineStorefrontConfig(currentConfig, instruction, history);
    }

    const systemPrompt = `You are DukaanOS Storefront Assistant. The merchant wants to refine their storefront configuration.
You must return the updated StorefrontConfig JSON and a concise explanation.
Allowed fonts: "Geist", "Inter", "Poppins", "Playfair", "DM Sans".
Allowed buttons: "rounded", "pill", "sharp".
Allowed radii: "none", "sm", "md", "lg", "full".
Allowed spacing: "compact", "normal", "spacious".
Allowed banner styles: "saffron", "emerald", "charcoal".
Allowed hero background: "subtle", "accent", "neutral".
Allowed columns: "2", "3", "4".
Colors must be 6-character hex strings #RRGGBB.
Never change product prices, stock, or store ownership.

Expected JSON:
{
  "updatedConfig": StorefrontConfig,
  "explanation": string,
  "patchSummary": string
}`;

    const userPrompt = `Current Config:\n${JSON.stringify(currentConfig)}\n\nMerchant Instruction: "${instruction}"`;

    try {
      const res = await this.callGeminiJson<{
        updatedConfig: StorefrontConfig;
        explanation: string;
        patchSummary: string;
      }>(systemPrompt, userPrompt);

      const validation = validateStorefrontConfig(res.updatedConfig);
      if (validation.success) {
        return res;
      }
      console.warn('Gemini patch failed Zod validation, delegating to rule-based patch:', validation.error);
      return this.fallback.refineStorefrontConfig(currentConfig, instruction, history);
    } catch (err) {
      console.warn('Gemini refineStorefrontConfig fallback triggered:', err);
      return this.fallback.refineStorefrontConfig(currentConfig, instruction, history);
    }
  }
}
