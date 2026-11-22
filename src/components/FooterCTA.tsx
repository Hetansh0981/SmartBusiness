'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageToggle from '@/components/LanguageToggle';
import { ArrowRight, ShieldCheck, Heart } from 'lucide-react';
import dynamic from 'next/dynamic';

const Motion = dynamic(() => import('framer-motion').then(m => m.motion), { ssr: false });

export default function FooterCTA() {
  const { t } = useLanguage();
  const [shopName, setShopName] = useState('');

  return (
    <footer className="relative border-t border-hairline bg-canvas">
      {/* 1. Large Direct Invitation Banner with 3D Depth & Sheen */}
      <Motion
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12 perspective-1000"
      >
        <div className="rounded-2xl bg-elevated text-ink p-8 sm:p-12 border border-hairline relative overflow-hidden shadow-xl card-3d-hover sheen-glow group">
          <div className="max-w-2xl">
            <h2 className="text-3xl sm:text-5xl font-display tracking-normal text-ink leading-tight">
              {t('landing.footer_headline')}
            </h2>
            <p className="mt-4 text-base text-ash leading-relaxed font-body">
              {t('landing.footer_subtitle')}
            </p>

            {/* Shop Setup Input */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                window.location.href = `/signup?shop=${encodeURIComponent(shopName.trim())}`;
              }}
              className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-2 max-w-lg"
            >
              <input
                type="text"
                placeholder={t('landing.footer_input_placeholder')}
                value={shopName}
                onChange={(e) => setShopName(e.target.value)}
                className="flex-1 px-4 py-3 rounded-xl bg-canvas border border-hairline text-ink text-xs sm:text-sm placeholder:text-fog focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/30 transition"
              />
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-accent hover:bg-accent-strong text-ink font-semibold text-xs sm:text-sm transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm whitespace-nowrap active:scale-[0.98] hover:shadow-[0_0_24px_rgba(245,158,11,0.4)] group/btn duration-200"
              >
                <span>{t('landing.footer_btn_launch')}</span>
                <ArrowRight className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </form>
          </div>
        </div>

        {/* 2. Structured Footer Metadata */}
        <div className="pt-10 mt-8 border-t border-hairline flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-fog">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-white font-bold text-[10px]">
              D
            </div>
            <span className="font-semibold text-ink">DukaanOS</span>
            <span className="text-fog">&bull;</span>
            <span>{t('landing.footer_brand_tag')}</span>
          </div>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <LanguageToggle variant="dark" />

            <Link href="/health" className="hover:text-ink transition flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
              <span>{t('landing.footer_all_operational')}</span>
            </Link>
            <Link href="/login" className="hover:text-ink transition">
              {t('landing.footer_merchant_login')}
            </Link>
            <Link href="/signup" className="hover:text-accent transition font-semibold text-accent">
              {t('landing.footer_create_free')}
            </Link>
          </div>
        </div>
      </Motion>
    </footer>
  );
}