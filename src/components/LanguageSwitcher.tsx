'use client';

import React, { useTransition } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import type { LocaleScope } from '@/lib/i18n/types';
import { Languages, Loader2 } from 'lucide-react';

interface LanguageSwitcherProps {
  scope?: LocaleScope;
  className?: string;
  variant?: 'pill' | 'select' | 'compact';
}

export default function LanguageSwitcher({
  scope = 'merchant',
  className = '',
  variant = 'pill',
}: LanguageSwitcherProps) {
  const { locale, setLocale, isHindi } = useLanguage();
  const [isPending, startTransition] = useTransition();

  const handleToggle = () => {
    const nextLocale = isHindi ? 'en' : 'hi';
    startTransition(async () => {
      await setLocale(nextLocale, scope);
    });
  };

  if (variant === 'compact') {
    return (
      <button
        type="button"
        onClick={handleToggle}
        disabled={isPending}
        className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium border border-[#e5e7eb] bg-white hover:bg-[#f9fafb] text-[#374151] transition cursor-pointer disabled:opacity-60 ${className}`}
        title={isHindi ? 'Switch to English' : 'हिन्दी में बदलें'}
      >
        {isPending ? (
          <Loader2 className="w-3 h-3 animate-spin text-[#ea580c]" />
        ) : (
          <Languages className="w-3 h-3 text-[#ea580c]" />
        )}
        <span className="font-semibold">{isHindi ? 'English' : 'हिन्दी'}</span>
      </button>
    );
  }

  return (
    <div
      className={`inline-flex items-center p-0.5 rounded-full border border-[#e5e7eb] bg-[#f9fafb] text-[11px] font-semibold select-none shadow-2xs ${className}`}
    >
      <button
        type="button"
        onClick={() => {
          if (locale !== 'en') {
            startTransition(async () => {
              await setLocale('en', scope);
            });
          }
        }}
        disabled={isPending}
        className={`px-2 py-0.5 rounded-full transition cursor-pointer flex items-center gap-1 ${
          locale === 'en'
            ? 'bg-white text-[#111827] shadow-xs font-bold'
            : 'text-[#6b7280] hover:text-[#111827]'
        }`}
      >
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => {
          if (locale !== 'hi') {
            startTransition(async () => {
              await setLocale('hi', scope);
            });
          }
        }}
        disabled={isPending}
        className={`px-2 py-0.5 rounded-full transition cursor-pointer flex items-center gap-1 ${
          locale === 'hi'
            ? 'bg-[#ea580c] text-white shadow-xs font-bold'
            : 'text-[#6b7280] hover:text-[#111827]'
        }`}
      >
        <span>हिन्दी</span>
      </button>
    </div>
  );
}
