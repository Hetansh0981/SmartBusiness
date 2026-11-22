'use server';

import { cookies } from 'next/headers';
import type { Locale, LocaleScope } from './types';
import { enDictionary } from './translations/en';
import { hiDictionary } from './translations/hi';

const MERCHANT_COOKIE = 'dukaanos_merchant_locale';
const SHOPPER_COOKIE = 'dukaanos_shopper_locale';

/**
 * Server-Side Merchant Locale Resolver (Dashboard, Settings, Customizer)
 */
export async function getMerchantLocale(): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(MERCHANT_COOKIE)?.value;
  return raw === 'hi' ? 'hi' : 'en';
}

/**
 * Server-Side Shopper Locale Resolver (Public Storefront & COD Checkout)
 * Priority: 1. Customer Cookie -> 2. Store default_language setting -> 3. 'en'
 */
export async function getShopperLocale(storeDefaultLang?: string | null): Promise<Locale> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(SHOPPER_COOKIE)?.value;
  if (raw === 'hi' || raw === 'en') {
    return raw;
  }
  if (storeDefaultLang === 'hi' || storeDefaultLang === 'en') {
    return storeDefaultLang;
  }
  return 'en';
}

/**
 * Server Action to persist locale in scoped cookies
 */
export async function setLocaleCookieAction(newLocale: Locale, scope: LocaleScope = 'merchant') {
  const cookieStore = await cookies();
  const cookieName = scope === 'merchant' ? MERCHANT_COOKIE : SHOPPER_COOKIE;

  cookieStore.set(cookieName, newLocale, {
    path: '/',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
  });

  return { success: true, locale: newLocale };
}

/**
 * Retrieve dictionary based on locale
 */
export async function getDictionary(locale: Locale) {
  return locale === 'hi' ? hiDictionary : enDictionary;
}
