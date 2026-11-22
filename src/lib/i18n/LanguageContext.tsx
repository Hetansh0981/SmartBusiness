'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import type { Locale, LocaleScope, LanguageContextValue } from './types';
import { enDictionary } from './translations/en';
import { hiDictionary } from './translations/hi';
import { setLocaleCookieAction } from './server';

const LanguageContext = createContext<LanguageContextValue | null>(null);

interface LanguageProviderProps {
  children: React.ReactNode;
  initialLocale?: Locale;
  scope?: LocaleScope;
}

export function LanguageProvider({
  children,
  initialLocale = 'en',
  scope = 'merchant',
}: LanguageProviderProps) {
  const router = useRouter();
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  React.useEffect(() => {
    try {
      const cookieName = scope === 'merchant' ? 'dukaanos_merchant_locale' : 'dukaanos_shopper_locale';
      const match = document.cookie.match(new RegExp(`(^|;\\s*)${cookieName}=([^;]*)`));
      if (match && (match[2] === 'hi' || match[2] === 'en')) {
        setLocaleState(match[2] as Locale);
      }
    } catch {
      // safe fallback
    }
  }, [scope]);

  const dictionary = useMemo(() => {
    return locale === 'hi' ? hiDictionary : enDictionary;
  }, [locale]);

  const setLocale = useCallback(
    async (newLocale: Locale, targetScope: LocaleScope = scope) => {
      setLocaleState(newLocale);
      try {
        await setLocaleCookieAction(newLocale, targetScope);
        router.refresh();
      } catch (err) {
        console.error('Failed to persist locale cookie:', err);
      }
    },
    [router, scope]
  );

  const t = useCallback(
    (key: string, fallback?: string, params?: Record<string, string | number>): string => {
      let translation = dictionary[key] || fallback || key;
      if (params) {
        Object.entries(params).forEach(([paramKey, paramVal]) => {
          translation = translation.replace(new RegExp(`\\{${paramKey}\\}`, 'g'), String(paramVal));
        });
      }
      return translation;
    },
    [dictionary]
  );

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      t,
      isHindi: locale === 'hi',
    }),
    [locale, setLocale, t]
  );

  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    // Fallback if rendered outside provider
    return {
      locale: 'en' as Locale,
      setLocale: async () => {},
      t: (key: string, fallback?: string) => fallback || key,
      isHindi: false,
    };
  }
  return context;
}
