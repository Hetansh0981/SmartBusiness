'use client';

import React from 'react';
import Link from 'next/link';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Check, ArrowRight } from 'lucide-react';
import dynamic from 'next/dynamic';

const Motion = dynamic(() => import('framer-motion').then(m => m.motion), { ssr: false });

export default function PricingSection() {
  const { t } = useLanguage();

  const plans = [
    {
      id: 'starter',
      name: t('landing.plan_free_name'),
      price: t('landing.plan_free_price'),
      period: t('landing.plan_free_period'),
      description: t('landing.plan_free_desc'),
      features: [
        t('landing.plan_free_f1'),
        t('landing.plan_free_f2'),
        t('landing.plan_free_f3'),
        t('landing.plan_free_f4'),
        t('landing.plan_free_f5'),
        t('landing.plan_free_f6'),
        t('landing.plan_free_f7'),
      ],
      isPrimary: false,
      ctaText: t('landing.plan_free_cta'),
      ctaHref: '/signup',
    },
    {
      id: 'pro',
      name: t('landing.plan_pro_name'),
      price: t('landing.plan_pro_price'),
      period: t('landing.plan_pro_period'),
      recommendedTag: t('landing.plan_pro_recommended'),
      description: t('landing.plan_pro_desc'),
      features: [
        t('landing.plan_pro_f1'),
        t('landing.plan_pro_f2'),
        t('landing.plan_pro_f3'),
        t('landing.plan_pro_f4'),
        t('landing.plan_pro_f5'),
        t('landing.plan_pro_f6'),
        t('landing.plan_pro_f7'),
      ],
      isPrimary: true,
      ctaText: t('landing.plan_pro_cta'),
      ctaHref: '/signup',
    },
  ];

  return (
    <section id="pricing" className="relative py-24 sm:py-28 border-t border-hairline">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Heading */}
        <div className="max-w-2xl mb-12 text-center">
          <Motion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-raised border border-hairline text-accent text-xs font-semibold mb-6"
          >
            <span>{t('landing.pricing_badge')}</span>
          </Motion>

          <Motion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display text-ink tracking-normal leading-tight text-balance"
          >
            <h2>{t('landing.pricing_title')}</h2>
          </Motion>

          <Motion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-6 text-base text-ash leading-relaxed font-body text-center max-w-2xl mx-auto text-balance"
          >
            <p>{t('landing.pricing_subtitle')}</p>
          </Motion>
        </div>

        {/* 2-Tier Pricing Comparison with 3D Depth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 items-stretch perspective-1000">
          {plans.map((plan, idx) => (
            <Motion
              key={plan.id}
              initial={{ opacity: 0, y: 30, scale: 0.98 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: idx * 0.15 }}
              className={`rounded-2xl p-6 sm:p-8 flex flex-col justify-between border transition-all card-3d-hover ${
                plan.isPrimary
                  ? 'bg-elevated text-ink border-accent/40 shadow-xl sheen-glow group'
                  : 'bg-raised text-ink border-hairline group'
              }`}
            >
              <div>
                {/* Plan Header */}
                <div className={`flex items-center justify-between pb-4 mb-5 border-b ${
                  plan.isPrimary ? 'border-accent/20' : 'border-hairline'
                }`}>
                  <h3 className="text-xl sm:text-2xl font-display tracking-normal">
                    {plan.name}
                  </h3>
                  {plan.isPrimary && (
                    <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-accent/10 text-accent border border-accent/20 shadow-xs">
                      {plan.recommendedTag || 'Recommended for Retail'}
                    </span>
                  )}
                </div>

                {/* Price Display */}
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="text-3xl sm:text-4xl font-bold font-mono-numbers text-ink">
                    {plan.price}
                  </span>
                  <span className={`text-xs ${plan.isPrimary ? 'text-ash' : 'text-fog'}`}>
                    {plan.period}
                  </span>
                </div>

                <p className={`text-xs sm:text-sm leading-relaxed mb-6 ${plan.isPrimary ? 'text-ash' : 'text-fog'}`}>
                  {plan.description}
                </p>

                {/* Feature Bullet Points */}
                <ul className="space-y-3 mb-8 text-xs font-medium">
                  {plan.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2.5 group/feat">
                      <Check className={`w-4 h-4 shrink-0 mt-0.5 group-hover/feat:scale-125 transition-transform ${plan.isPrimary ? 'text-accent' : 'text-fog'}`} aria-hidden="true" />
                      <span className={plan.isPrimary ? 'text-ink/90' : 'text-ash'}>
                        {feat}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Call to Action Button with Hover Light */}
              <Link href={plan.ctaHref}>
                <button
                  type="button"
                  className={`w-full py-3 px-4 rounded-xl font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-[0.98] ${
                    plan.isPrimary
                      ? 'bg-accent hover:bg-accent-strong text-ink hover:shadow-[0_0_24px_rgba(245,158,11,0.4)] duration-200'
                      : 'bg-canvas hover:bg-overlay text-ink border border-hairline'
                  }`}
                >
                  <span>{plan.ctaText}</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
                </button>
              </Link>
            </Motion>
          ))}
        </div>
      </div>
    </section>
  );
}