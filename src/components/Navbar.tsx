'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';

export default function Navbar() {
  const { t } = useLanguage();
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`sticky top-0 z-50 px-4 sm:px-6 lg:px-8 w-full transition-all duration-300 ${
      isScrolled ? 'bg-elevated/95 backdrop-blur-2xl backdrop-saturate-180 border-b border-hairline' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto relative group">
        {/* Liquid Glass Capsule */}
        <div className={`relative flex items-center justify-between px-3 sm:px-6 h-14 rounded-full ${
          isScrolled
            ? 'bg-elevated/90 border border-hairline shadow-lift'
            : 'bg-canvas/90 backdrop-blur-2xl backdrop-saturate-180 border border-white/10 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.05),0_8px_24px_-12px_rgba(0,0,0,0.4)]'
        }`}>
          {/* Specular Liquid Sheen */}
          <div
            aria-hidden="true"
            className="absolute inset-0 rounded-full pointer-events-none bg-gradient-to-b from-white/[0.04] via-transparent to-black/20"
          />
          {isScrolled && (
            <div
              aria-hidden="true"
              className="absolute top-0 left-8 right-8 h-[1px] bg-gradient-to-r from-transparent via-accent/30 to-transparent pointer-events-none"
            />
          )}

          {/* Left: Brand / Logo */}
          <Link href="/" className="relative z-10 flex items-center gap-2.5 group/logo">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-xs shadow-[0_0_16px_rgba(245,158,11,0.55),inset_0_1px_1px_rgba(255,255,255,0.2)] group-hover/logo:scale-105 transition-transform duration-200">
              D
            </div>
            <span className="text-sm sm:text-base font-bold tracking-tight text-ink flex items-center gap-1.5 drop-shadow-[0_1px_2px_rgba(0,0,0,0.3)]">
              <span>DukaanOS</span>
              <span className="w-1.5 h-1.5 rounded-full bg-accent shadow-[0_0_8px_rgba(245,158,11,0.9)] animate-pulse" />
            </span>
          </Link>

          {/* Center Navigation Links */}
          <nav className="relative z-10 hidden md:flex items-center gap-6 text-xs font-medium text-ash">
            <Link
              href="#features"
              className="hover:text-accent transition-colors duration-200"
            >
              {t('landing.nav_capabilities')}
            </Link>
            <Link
              href="#calculator"
              className="hover:text-accent transition-colors duration-200"
            >
              {t('landing.nav_calculator')}
            </Link>
            <Link
              href="#pricing"
              className="hover:text-accent transition-colors duration-200"
            >
              {t('landing.nav_pricing')}
            </Link>
            <Link
              href="/health"
              className="text-ash hover:text-success transition-colors flex items-center gap-1.5"
            >
              <span className="w-1.5 h-1.5 rounded-full bg-success shadow-[0_0_8px_rgba(79,169,122,0.95)] animate-pulse" />
              <span>{t('landing.nav_system_live')}</span>
            </Link>
          </nav>

          {/* Right Actions & Language Toggle */}
          <div className="relative z-10 flex items-center gap-2 sm:gap-3">
            <LanguageToggle variant="dark" />

            <Link
              href="/login"
              className="hidden sm:inline-block text-xs font-medium text-ash hover:text-ink transition-colors px-3 py-1.5 rounded-full hover:bg-overlay"
            >
              {t('landing.nav_sign_in')}
            </Link>

            <Link href="/signup">
              <button
                type="button"
                className="relative px-3.5 sm:px-4 py-2 rounded-full bg-gradient-to-r from-amber-500 via-amber-600 to-amber-700 hover:from-amber-400 hover:to-amber-600 text-ink font-medium text-xs shadow-[0_0_22px_rgba(245,158,11,0.4),inset_0_1px_1px_rgba(255,255,255,0.2)] transition-all duration-200 cursor-pointer flex items-center gap-1.5 hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>{t('landing.nav_launch_store')}</span>
                <ArrowRight className="w-3.5 h-3.5" aria-hidden="true" />
              </button>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}