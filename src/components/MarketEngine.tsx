'use client';

import React from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  ShoppingBag,
  Percent,
  Sparkles,
  Check,
  MessageCircle,
} from 'lucide-react';
import { motion } from 'framer-motion';

const PILLARS = [
  {
    id: 'catalog',
    title: 'landing.engine_pillar_1_title',
    description: 'landing.engine_pillar_1_desc',
    highlight: 'landing.engine_pillar_1_highlight',
    features: [
      'landing.engine_pillar_1_f1',
      'landing.engine_pillar_1_f2',
      'landing.engine_pillar_1_f3',
    ],
    previewSnippet: {
      title: 'Sharbati Wheat Flour (10kg)',
      price: '₹495',
      status: 'In Stock',
      statusColor: 'bg-success/10 text-success border-success/20',
    },
    icon: ShoppingBag,
    color: 'from-amber-500 to-amber-600',
  },
  {
    id: 'checkout',
    title: 'landing.engine_pillar_2_title',
    description: 'landing.engine_pillar_2_desc',
    highlight: 'landing.engine_pillar_2_highlight',
    features: [
      'landing.engine_pillar_2_f1',
      'landing.engine_pillar_2_f2',
      'landing.engine_pillar_2_f3',
    ],
    previewSnippet: {
      title: 'Order ORD-JPR-8812',
      price: '₹4,850 • COD',
      status: 'Ready for Dispatch',
      statusColor: 'bg-accent/10 text-accent border-accent/20',
    },
    icon: MessageCircle,
    color: 'from-emerald-500 to-emerald-600',
  },
  {
    id: 'commission',
    title: 'landing.engine_pillar_3_title',
    description: 'landing.engine_pillar_3_desc',
    highlight: 'landing.engine_pillar_3_highlight',
    features: [
      'landing.engine_pillar_3_f1',
      'landing.engine_pillar_3_f2',
      'landing.engine_pillar_3_f3',
    ],
    previewSnippet: {
      title: 'Monthly Order Volume: ₹2,40,000',
      price: '₹0 Commission Paid',
      status: '₹48,000 Saved vs Aggregators',
      statusColor: 'bg-accent/10 text-accent border-accent/20 font-bold',
    },
    icon: Percent,
    color: 'from-amber-500 to-amber-700',
  },
  {
    id: 'ai-designer',
    title: 'landing.engine_pillar_4_title',
    description: 'landing.engine_pillar_4_desc',
    highlight: 'landing.engine_pillar_4_highlight',
    features: [
      'landing.engine_pillar_4_f1',
      'landing.engine_pillar_4_f2',
      'landing.engine_pillar_4_f3',
    ],
    previewSnippet: {
      title: 'Concept: Royal Heritage Boutique',
      price: 'Playfair • Deep Maroon • Pill Buttons',
      status: 'हिन्दी एवं English Available',
      statusColor: 'bg-accent/10 text-accent border-accent/20',
    },
    icon: Sparkles,
    color: 'from-orange-500 to-amber-600',
  },
];

export default function MarketEngine() {
  const { t } = useLanguage();

  return (
    <section id="features" className="relative py-24 sm:py-28 border-t border-hairline">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header (Claude-inspired typography) */}
        <div className="max-w-3xl mb-16 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-raised border border-hairline text-accent text-xs font-semibold mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
            <span>{t('landing.engine_badge')}</span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
            className="text-3xl sm:text-5xl font-display text-ink tracking-normal leading-tight text-balance"
          >
            <h2>{t('landing.engine_title')}</h2>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.2 }}
            className="mt-6 text-base text-ash leading-relaxed font-body text-center max-w-2xl mx-auto text-balance"
          >
            <p>{t('landing.engine_subtitle')}</p>
          </motion.div>
        </div>

        {/* 2x2 Distinctive Capability Grid with 3D Elevation & Sheen */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 perspective-1000">
          {PILLARS.map((pillar, idx) => (
            <motion.div
              key={pillar.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-100px' }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: idx * 0.1 }}
              className="rounded-2xl bg-raised border border-hairline p-6 sm:p-8 flex flex-col justify-between card-3d-hover sheen-glow shadow-lift group"
            >
              <div>
                {/* Structural Category Label */}
                <div className="flex items-center justify-between pb-4 border-b border-hairline mb-5">
                  <span className="text-xs font-bold text-accent bg-accent/10 px-2 py-0.5 rounded border border-accent/20">
                    Pillar {idx + 1}
                  </span>
                  <span className="text-xs text-ash font-medium">
                    {t(pillar.highlight)}
                  </span>
                </div>

                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${pillar.color} flex items-center justify-center text-white`}>
                    <pillar.icon className="w-5 h-5" aria-hidden="true" />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-display text-ink mb-2 tracking-normal group-hover:text-accent transition-colors">
                    {t(pillar.title)}
                  </h3>
                </div>

                <p className="text-sm text-ash leading-relaxed mb-6">
                  {t(pillar.description)}
                </p>

                {/* Real Concrete Feature List with micro-interaction */}
                <ul className="space-y-2.5 mb-6 text-xs text-ink font-medium">
                  {pillar.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-start gap-2 group/item">
                      <Check className="w-4 h-4 text-accent shrink-0 mt-0.5 group-hover/item:scale-110 transition-transform" aria-hidden="true" />
                      <span>{t(feat)}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Concrete Artifact / Micro-Snippet Preview */}
              <div className="p-3.5 rounded-xl bg-elevated border border-hairline flex items-center justify-between font-mono-numbers text-xs shadow-xs group-hover:border-accent/40 transition-colors">
                <div>
                  <div className="font-semibold text-ink">{pillar.previewSnippet.title}</div>
                  <div className="text-ash text-[11px] mt-0.5">{pillar.previewSnippet.price}</div>
                </div>
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-transform group-hover:scale-105 ${pillar.previewSnippet.statusColor}`}>
                  {pillar.previewSnippet.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}