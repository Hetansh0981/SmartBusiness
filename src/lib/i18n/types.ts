/**
 * Internationalization (i18n) Type Definitions for DukaanOS
 * Complete English & Hindi Compatibility across Merchant & Shopper experiences
 */

export type Locale = 'en' | 'hi';

export type LocaleScope = 'merchant' | 'shopper';

export interface LanguageContextValue {
  locale: Locale;
  setLocale: (newLocale: Locale, scope?: LocaleScope) => Promise<void>;
  t: (key: string, fallback?: string, params?: Record<string, string | number>) => string;
  isHindi: boolean;
}

export type TranslationDictionary = Record<string, string>;
