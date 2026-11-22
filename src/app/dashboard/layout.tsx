import React from 'react';
import { getMerchantLocale } from '@/lib/i18n/server';
import { LanguageProvider } from '@/lib/i18n/LanguageContext';

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const initialLocale = await getMerchantLocale();

  return (
    <LanguageProvider initialLocale={initialLocale} scope="merchant">
      {children}
    </LanguageProvider>
  );
}
