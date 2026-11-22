'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Globe } from 'lucide-react';

interface LanguageToggleProps {
  className?: string;
  variant?: 'dark' | 'light';
}

export default function LanguageToggle({
  className = '',
  variant = 'dark',
}: LanguageToggleProps) {
  const { locale, setLocale } = useLanguage();

  const isDark = variant === 'dark';

  return (
    <div
      role="group"
      aria-label="Language selection"
      className={`inline-flex items-center p-0.5 rounded-full transition-all ${
        isDark
          ? 'bg-black/30 border border-white/15 shadow-inner'
          : 'bg-[#faf9f5] border border-[#e6dfd8] shadow-xs'
      } text-[11px] font-medium ${className}`}
    >
      <button
        type="button"
        onClick={() => setLocale('en')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
          locale === 'en'
            ? 'bg-[#d97706] text-white shadow-xs font-semibold'
            : isDark
            ? 'text-neutral-300 hover:text-white'
            : 'text-[#6c6a64] hover:text-[#141413]'
        }`}
        title="Switch to English"
      >
        <span>EN</span>
      </button>

      <button
        type="button"
        onClick={() => setLocale('hi')}
        className={`px-2.5 py-1 rounded-full transition-all cursor-pointer flex items-center gap-1 active:scale-95 ${
          locale === 'hi'
            ? 'bg-[#d97706] text-white shadow-xs font-semibold'
            : isDark
            ? 'text-neutral-300 hover:text-white'
            : 'text-[#6c6a64] hover:text-[#141413]'
        }`}
        title="हिन्दी भाषा चुनें"
      >
        <span>हिन्दी</span>
      </button>
    </div>
  );
}
