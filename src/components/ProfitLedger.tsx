'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { ArrowRight, Check, X, ShieldCheck } from 'lucide-react';
import dynamic from 'next/dynamic';

const Motion = dynamic(() => import('framer-motion').then(m => m.motion), { ssr: false });

export default function ProfitLedger() {
  const { t } = useLanguage();
  const [monthlySales, setMonthlySales] = useState<number>(150000);

  // Industry average: 22% commission + 2.36% PG fee = 24.36%
  const aggregatorCut = Math.round(monthlySales * 0.22);
  const paymentGatewayCut = Math.round(monthlySales * 0.0236);
  const totalAggregatorLoss = aggregatorCut + paymentGatewayCut;
  const merchantRetainedDukaanOS = monthlySales;
  const merchantRetainedAggregator = monthlySales - totalAggregatorLoss;

  return (
    <section id="calculator" className="relative py-24 sm:py-28 border-t border-hairline">
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
            <span>{t('landing.calc_badge')}</span>
          </Motion>

          <Motion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display text-ink tracking-normal leading-tight text-balance"
          >
            <h2>{t('landing.calc_title')}</h2>
          </Motion>

          <Motion
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-6 text-base text-ash leading-relaxed font-body text-center max-w-2xl mx-auto text-balance"
          >
            <p>{t('landing.calc_subtitle')}</p>
          </Motion>
        </div>

        {/* Interactive Calculator Ledger Card */}
        <Motion
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          className="rounded-2xl bg-raised border border-hairline p-6 sm:p-8 shadow-lift card-3d-hover sheen-glow"
        >

          {/* Slider Control */}
          <div className="space-y-3 pb-8 border-b border-hairline">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">
                {t('landing.calc_monthly_volume')}
              </span>
              <span className="text-xl sm:text-2xl font-bold text-accent font-mono-numbers">
                {formatINR(monthlySales)}
              </span>
            </div>

            <input
              type="range"
              min={25000}
              max={1000000}
              step={25000}
              value={monthlySales}
              onChange={(e) => setMonthlySales(Number(e.target.value))}
              className="w-full h-2 bg-canvas rounded-lg appearance-none cursor-pointer accent-accent"
            />

            <div className="flex justify-between text-xs text-fog font-mono-numbers">
              <span>₹25,000 / month</span>
              <span>₹5,00,000 / month</span>
              <span>₹10,00,000 / month</span>
            </div>
          </div>

          {/* Comparison Ledger Columns with 3D Depth */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 perspective-800">

            {/* Column A: Traditional Delivery Aggregators */}
            <Motion
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-xl bg-canvas border border-hairline space-y-3 card-3d-hover group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-hairline">
                <span className="text-xs font-semibold text-ash">
                  {t('landing.calc_aggregator_platform')}
                </span>
                <span className="text-xs font-bold text-danger bg-danger/10 px-2 py-0.5 rounded border border-danger/20">
                  {t('landing.calc_cut_badge')}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono-numbers">
                <div className="flex justify-between text-ash">
                  <span>{t('landing.calc_gross_sales')}</span>
                  <span>{formatINR(monthlySales)}</span>
                </div>
                <div className="flex justify-between text-danger">
                  <span>{t('landing.calc_commission_cut')}</span>
                  <span>- {formatINR(aggregatorCut)}</span>
                </div>
                <div className="flex justify-between text-danger">
                  <span>{t('landing.calc_gateway_fees')}</span>
                  <span>- {formatINR(paymentGatewayCut)}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-hairline flex justify-between items-baseline font-mono-numbers">
                <span className="text-xs font-semibold text-ink">{t('landing.calc_you_receive')}</span>
                <span className="text-lg font-bold text-ink">
                  {formatINR(merchantRetainedAggregator)}
                </span>
              </div>
            </Motion>

            {/* Column B: DukaanOS Commerce */}
            <Motion
              initial={{ opacity: 0, y: 20, rotateX: -10 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
              className="p-5 rounded-xl bg-accent/5 border border-accent/20 space-y-3 card-3d-hover sheen-glow group"
            >
              <div className="flex items-center justify-between pb-2 border-b border-accent/20">
                <span className="text-xs font-semibold text-accent">
                  {t('landing.calc_dukaanos_title')}
                </span>
                <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                  {t('landing.calc_zero_comm_badge')}
                </span>
              </div>

              <div className="space-y-2 text-xs font-mono-numbers">
                <div className="flex justify-between text-ink">
                  <span>{t('landing.calc_gross_sales')}</span>
                  <span>{formatINR(monthlySales)}</span>
                </div>
                <div className="flex justify-between text-accent">
                  <span>{t('landing.calc_order_commission')}</span>
                  <span>₹0.00</span>
                </div>
                <div className="flex justify-between text-accent">
                  <span>{t('landing.calc_cash_upi_settle')}</span>
                  <span>{t('landing.calc_direct_settle')}</span>
                </div>
              </div>

              <div className="pt-3 border-t border-accent/20 flex justify-between items-baseline font-mono-numbers">
                <span className="text-xs font-semibold text-ink">{t('landing.calc_you_receive')}</span>
                <span className="text-lg font-bold text-accent group-hover:scale-105 transition-transform origin-right">
                  {formatINR(merchantRetainedDukaanOS)}
                </span>
              </div>
            </Motion>
          </div>

          {/* Net Savings Callout */}
          <Motion
            initial={{ opacity: 0, y: 20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-8 p-5 rounded-xl bg-elevated text-ink border border-hairline flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sheen-glow shadow-xl"
          >
            <div>
              <span className="text-xs text-ash block">{t('landing.calc_extra_profit')}</span>
              <span className="text-xl sm:text-2xl font-bold text-accent font-mono-numbers">
                {formatINR(totalAggregatorLoss)} {t('landing.calc_per_month')} ({formatINR(totalAggregatorLoss * 12)} {t('landing.calc_per_year')})
              </span>
            </div>

            <Link href="/signup">
              <button
                type="button"
                className="px-5 py-2.5 rounded-lg bg-accent hover:bg-accent-strong text-ink font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 whitespace-nowrap shadow-sm active:scale-[0.98] group hover:shadow-[0_0_20px_rgba(245,158,11,0.4)] duration-200"
              >
                <span>{t('landing.calc_keep_margins')}</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </Link>
          </Motion>
        </Motion>
      </div>
    </section>
  );
}