'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles, ShieldCheck, ShoppingBag, MessageCircle, Percent, Check, CheckCircle2, Layers, Box, Flame, Wand2 } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import Navbar from '@/components/Navbar';
import AmberField from '@/components/atmosphere/AmberField';

// Import components (they won't use dynamic imports now)
import ProfitLedger from '@/components/ProfitLedger';
import PricingSection from '@/components/PricingSection';
import FooterCTA from '@/components/FooterCTA';

// No framer-motion dynamic imports - using CSS-based reveal animations only

interface MerchantPersona {
  id: string;
  badge: string;
  shopName: string;
  category: string;
  city: string;
  slug: string;
  featuredProduct: {
    name: string;
    price: number;
    mrp: number;
    tag: string;
  };
  sampleOrder: {
    ref: string;
    customer: string;
    item: string;
    amount: number;
    timeAgo: string;
    pincode: string;
  };
  commissionSaved: string;
  monthlyRevenue: number;
}

const PERSONAS: MerchantPersona[] = [
  {
    id: 'fashion',
    badge: 'Boutique & Handloom',
    shopName: 'Jaipur Royal Sarees',
    category: 'Ethnic Wear',
    city: 'Jaipur, Rajasthan',
    slug: 'jaipur-sarees',
    featuredProduct: {
      name: 'Pure Silk Bandhani Saree with Zari Border',
      price: 4850,
      mrp: 6500,
      tag: 'Handcrafted',
    },
    sampleOrder: {
      ref: 'ORD-JPR-8812',
      customer: 'Pooja Agarwal',
      item: '1x Pure Silk Bandhani Saree',
      amount: 4850,
      timeAgo: '4 mins ago',
      pincode: '302001',
    },
    commissionSaved: '₹29,100 / month saved at 0% commission',
    monthlyRevenue: 145000,
  },
  {
    id: 'kirana',
    badge: 'Kirana & Provisions',
    shopName: 'Shiv Kirana & Superstore',
    category: 'Daily Groceries',
    city: 'Ahmedabad, Gujarat',
    slug: 'shiv-kirana',
    featuredProduct: {
      name: 'Sharbati Wheat Flour (10kg Bag)',
      price: 495,
      mrp: 560,
      tag: 'Daily Essential',
    },
    sampleOrder: {
      ref: 'ORD-AHM-4309',
      customer: 'Ramesh Patel',
      item: '1x Sharbati Flour + 2x Desi Ghee',
      amount: 1475,
      timeAgo: 'Just now',
      pincode: '380009',
    },
    commissionSaved: '₹34,500 / month saved vs quick commerce',
    monthlyRevenue: 230000,
  },
  {
    id: 'sweets',
    badge: 'Mithai & Farsan',
    shopName: 'Anand Sweets & Bakery',
    category: 'Traditional Sweets',
    city: 'Indore, MP',
    slug: 'anand-sweets',
    featuredProduct: {
      name: 'Special Kaju Katli Gift Hamper (1kg)',
      price: 1150,
      mrp: 1300,
      tag: 'Fresh Batch',
    },
    sampleOrder: {
      ref: 'ORD-IND-6190',
      customer: 'Sunita Sharma',
      item: '2x Kaju Katli + 1x Khasta Namkeen',
      amount: 2750,
      timeAgo: '12 mins ago',
      pincode: '452001',
    },
    commissionSaved: '₹41,250 / month saved vs food aggregators',
    monthlyRevenue: 165000,
  },
];

type AnimationPreset = '3d-pop' | 'festive-shimmer' | 'gentle-glide' | 'dynamic-float';

const ANIMATION_PRESETS: { id: AnimationPreset; label: string; icon: typeof Box; desc: string }[] = [
  { id: '3d-pop', label: '3D Pop & Depth', icon: Box, desc: 'Perspective elevation & spring response' },
  { id: 'festive-shimmer', label: 'Festive Shimmer', icon: Flame, desc: 'Golden amber light sweep' },
  { id: 'gentle-glide', label: 'Gentle Glide', icon: Wand2, desc: 'Smooth boutique ease-in physics' },
  { id: 'dynamic-float', label: 'Anti-Gravity Float', icon: Layers, desc: 'Rhythmic floating levitation' },
];

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

export default function HomePage() {
  const { t } = useLanguage();

  // Scroll-triggered animations using CSS + IntersectionObserver
  const pillarsRef = useRef<HTMLDivElement>(null);
  const headerRef = useRef<HTMLDivElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const headerEl = headerRef.current;
    const pillarsEl = pillarsRef.current;

    const headerObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      { threshold: 0.1, rootMargin: '-100px' }
    );

    if (headerEl) headerObserver.observe(headerEl);

    let pillarsObserver: IntersectionObserver | null = null;
    const timeouts: ReturnType<typeof setTimeout>[] = [];

    if (pillarsEl) {
      pillarsObserver = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('is-visible');
            }
          });
        },
        { threshold: 0.1 }
      );

      pillarsEl.querySelectorAll('.rounded-2xl').forEach((el, i) => {
        const timeoutId = setTimeout(() => pillarsObserver?.observe(el), i * 100);
        timeouts.push(timeoutId);
      });
    }

    return () => {
      timeouts.forEach(clearTimeout);
      headerObserver.disconnect();
      pillarsObserver?.disconnect();
    };
  }, []);

  return (
    <div className="min-h-screen bg-canvas text-ink relative overflow-x-hidden selection:bg-accent/30 selection:text-cream">
      {/* Atmospheric WebGL Shader Field */}
      <AmberField intensity="hero" />

      {/* CSS Atmospheric Fallback (always rendered underneath) */}
      <div className="fixed inset-0 atmosphere pointer-events-none" aria-hidden="true" />

      {/* Navbar */}
      <Navbar />

      {/* Hero Section with 3D Reveal and Ambient Lighting */}
      <section className="relative pt-16 sm:pt-24 pb-20 sm:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

          {/* Trust Notice with Floating Animation */}
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-raised border border-hairline mb-8 text-xs text-ash animate-float-slow hover:border-accent/40 transition-colors"
          >
            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
            <span className="font-semibold text-ink">{t('landing.hero_badge_platform')}</span>
            <span className="text-fog">|</span>
            <span className="text-accent font-medium">{t('landing.hero_badge_zero_commission')}</span>
          </div>

          {/* Unified Bold Headline */}
          <div
            ref={headerRef}
            className="text-center"
          >
            <h1 className="text-4xl sm:text-6xl lg:text-7xl font-display text-ink tracking-normal leading-[1.04] max-w-4xl mx-auto text-balance">
              {t('landing.hero_title').split(' ').slice(0, -1).join(' ')}
              <br />
              <span className="text-cream-gradient">{t('landing.hero_title').split(' ').pop()}</span>
            </h1>
          </div>

          {/* Subtitle */}
          <div className="mt-6 text-base sm:text-lg text-ash max-w-2xl mx-auto leading-relaxed font-body text-center text-balance">
            <p>{t('landing.hero_subtitle')}</p>
          </div>

          {/* Action Row */}
          <div className="mt-10 flex flex-wrap justify-center items-center gap-3.5">
            <Link href="/signup">
              <button
                type="button"
                className="relative px-6 py-3.5 rounded-xl bg-accent hover:bg-accent-strong text-ink font-medium text-xs sm:text-sm shadow-sm transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-[0.98] group hover:shadow-[0_0_30px_rgba(245,158,11,0.4)]"
              >
                <span>{t('landing.hero_cta_create')}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </button>
            </Link>

            <Link href="/store/shiv-kirana" target="_blank">
              <button
                type="button"
                className="px-6 py-3.5 rounded-xl bg-raised hover:bg-overlay text-ink font-medium text-xs sm:text-sm border border-hairline shadow-xs transition-all duration-200 cursor-pointer flex items-center gap-2 active:scale-[0.98] hover:border-accent/40"
              >
                <span>{t('landing.hero_cta_demo')}</span>
              </button>
            </Link>
          </div>

          {/* Quick Real Stats Bar */}
          <div className="mt-12 pt-8 border-t border-hairline max-w-2xl mx-auto flex items-center justify-around text-xs text-ash">
            <div className="hover:scale-105 transition-transform">
              <span className="font-bold text-ink font-mono-numbers block text-sm sm:text-base">0%</span>
              <span>{t('landing.hero_stat_zero_cut')}</span>
            </div>
            <div className="w-[1px] h-6 bg-hairline" />
            <div className="hover:scale-105 transition-transform">
              <span className="font-bold text-ink font-mono-numbers block text-sm sm:text-base">{t('landing.hero_stat_catalog_time')}</span>
              <span>{t('landing.hero_stat_catalog_setup')}</span>
            </div>
            <div className="w-[1px] h-6 bg-hairline" />
            <div className="hover:scale-105 transition-transform">
              <span className="font-bold text-ink font-mono-numbers block text-sm sm:text-base">{t('landing.hero_stat_cod')}</span>
              <span>{t('landing.hero_stat_pin')}</span>
            </div>
          </div>
        </div>

        {/* Centerpiece: Interactive Live Merchant Terminal in 3D Perspective */}
        <div
          ref={terminalRef}
          className="mt-12 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 perspective-1500"
        >
          <HeroMerchantTerminal />
        </div>
      </section>

      {/* Pillars of Indian Commerce */}
      <section id="features" className="relative py-24 sm:py-28 border-t border-hairline">
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Section Header */}
          <div className="max-w-3xl mb-16 text-center">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-raised border border-hairline text-accent text-xs font-semibold mb-6">
              <Sparkles className="w-3.5 h-3.5 text-accent" aria-hidden="true" />
              <span>{t('landing.engine_badge')}</span>
            </div>

            <h2 className="text-3xl sm:text-5xl font-display text-ink tracking-normal leading-tight text-balance">
              {t('landing.engine_title')}
            </h2>

            <p className="mt-6 text-base text-ash leading-relaxed font-body text-center max-w-2xl mx-auto text-balance">
              {t('landing.engine_subtitle')}
            </p>
          </div>

          {/* 2x2 Distinctive Capability Grid with 3D Elevation & Sheen */}
          <div ref={pillarsRef} className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 perspective-1000">
            {PILLARS.map((pillar, idx) => (
              <div
                key={pillar.id}
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

                  {/* Real Concrete Feature List */}
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
                    <div className="font-semibold text-ink">{t(pillar.previewSnippet.title)}</div>
                    <div className="text-ash text-[11px] mt-0.5">{t(pillar.previewSnippet.price)}</div>
                  </div>
                  <span className="px-2.5 py-1 rounded-md text-[11px] font-semibold border transition-transform group-hover:scale-105 bg-accent/10 text-accent border-accent/20">
                    {t(pillar.previewSnippet.status)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Margin Ledger Calculator */}
      <ProfitLedger />

      {/* Honest 2-Tier Pricing */}
      <PricingSection />

      {/* Closing Call to Action */}
      <FooterCTA />
    </div>
  );
}

// Re-export the HeroMerchantTerminal component with improved 3D effects
function HeroMerchantTerminal() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>('fashion');
  const [orderSent, setOrderSent] = useState(false);
  const [orderCount, setOrderCount] = useState(1);
  const [animPreset, setAnimPreset] = useState<AnimationPreset>('3d-pop');
  const [is3DStage, setIs3DStage] = useState(false);

  const terminalRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (is3DStage) return;
    const card = terminalRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * -4;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const active = PERSONAS.find((p) => p.id === selectedId) || PERSONAS[0];

  const getPersonaBadge = (id: string) => t(`landing.persona_${id}_badge`, PERSONAS.find(p => p.id === id)?.badge || '');
  const getPersonaName = (id: string) => t(`landing.persona_${id}_name`, PERSONAS.find(p => p.id === id)?.shopName || '');
  const getPersonaCategory = (id: string) => t(`landing.persona_${id}_category`, PERSONAS.find(p => p.id === id)?.category || '');
  const getPersonaCity = (id: string) => t(`landing.persona_${id}_city`, PERSONAS.find(p => p.id === id)?.city || '');
  const getPersonaProduct = (id: string) => t(`landing.persona_${id}_product`, PERSONAS.find(p => p.id === id)?.featuredProduct.name || '');
  const getPersonaTag = (id: string) => t(`landing.persona_${id}_tag`, PERSONAS.find(p => p.id === id)?.featuredProduct.tag || '');
  const getPersonaSaved = (id: string) => t(`landing.persona_${id}_saved`, PERSONAS.find(p => p.id === id)?.commissionSaved || '');

  const getPresetLabel = (id: AnimationPreset) => {
    switch (id) {
      case '3d-pop': return t('landing.terminal_preset_3d');
      case 'festive-shimmer': return t('landing.terminal_preset_shimmer');
      case 'gentle-glide': return t('landing.terminal_preset_glide');
      case 'dynamic-float': return t('landing.terminal_preset_float');
    }
  };

  const handleTestOrder = () => {
    setOrderSent(true);
    setOrderCount((prev) => prev + 1);
    setTimeout(() => setOrderSent(false), 4500);
  };

  const getPresetCardClass = () => {
    switch (animPreset) {
      case '3d-pop': return 'anim-3d-pop card-3d-hover';
      case 'festive-shimmer': return 'anim-festive-shimmer sheen-glow';
      case 'gentle-glide': return 'anim-gentle-glide';
      case 'dynamic-float': return 'anim-dynamic-float';
      default: return 'card-3d-hover';
    }
  };

  return (
    <div className="relative w-full max-w-7xl mx-auto perspective-1200">

      {/* Animation & 3D Stage Toolbar */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2.5 px-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-[11px] font-semibold text-fog uppercase tracking-wider mr-1 hidden sm:inline">
            {t('landing.terminal_motion_label')}
          </span>
          {ANIMATION_PRESETS.map((preset) => {
            const isSelected = animPreset === preset.id;
            const Icon = preset.icon;
            return (
              <button
                key={preset.id}
                type="button"
                onClick={() => setAnimPreset(preset.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition cursor-pointer flex items-center gap-1.5 border active:scale-95 ${
                  isSelected
                    ? 'bg-elevated text-ink border-accent/40 shadow-xs'
                    : 'bg-raised hover:bg-overlay text-ash border-hairline'
                }`}
                title={preset.desc}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-accent' : 'text-fog'}`} aria-hidden="true" />
                <span>{getPresetLabel(preset.id)}</span>
              </button>
            );
          })}
        </div>

        {/* 3D Isometric View Toggle */}
        <button
          type="button"
          onClick={() => setIs3DStage(!is3DStage)}
          className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 border active:scale-95 ${
            is3DStage
              ? 'bg-accent text-ink border-accent-strong shadow-sm'
              : 'bg-raised hover:bg-overlay text-ash border-hairline'
          }`}
        >
          <Box className="w-3.5 h-3.5" aria-hidden="true" />
          <span>{is3DStage ? t('landing.terminal_view_flat') : t('landing.terminal_view_3d')}</span>
        </button>
      </div>

      {/* Outer Counter Shell with 3D Tilt Transform */}
      <div
        ref={terminalRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        style={{
          transform: is3DStage
            ? 'perspective(1400px) rotateX(12deg) rotateY(-8deg) scale(0.97)'
            : `perspective(1000px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
          transition: is3DStage ? 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)' : 'transform 0.15s ease-out',
        }}
        className="rounded-2xl bg-elevated text-ink p-2.5 sm:p-3.5 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-hairline transition-shadow duration-300 preserve-3d"
      >

        {/* Terminal Header & Mode Selectors */}
        <div className="p-3 sm:p-4 rounded-xl bg-overlay/50 border border-hairline flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-accent animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-ink">{t('landing.terminal_live_counter')}</span>
            <span className="text-xs text-ash hidden sm:inline">&mdash; {t('landing.terminal_counter_desc')}</span>
          </div>

          {/* Interactive Shop Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-canvas/50 border border-hairline overflow-x-auto scrollbar-none">
            {PERSONAS.map((p) => {
              const isSelected = p.id === selectedId;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => {
                    setSelectedId(p.id);
                    setOrderSent(false);
                  }}
                  className={`px-3 py-1.5 rounded-md text-xs font-medium transition cursor-pointer whitespace-nowrap ${
                    isSelected
                      ? 'bg-accent text-ink shadow-sm font-semibold'
                      : 'text-ash hover:text-ink hover:bg-overlay'
                  }`}
                >
                  {getPersonaBadge(p.id)}
                </button>
              );
            })}
          </div>
        </div>

        {/* Counter Main Display: Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 p-2 sm:p-3">

          {/* Left Column (7 cols): Storefront Preview Card */}
          <div className="lg:col-span-7 rounded-xl bg-canvas border border-hairline p-5 flex flex-col justify-between">
            <div>
              {/* Store Identity Bar */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-hairline">
                <div>
                  <span className="text-[11px] font-semibold text-accent uppercase tracking-wider block mb-0.5">
                    {getPersonaCategory(active.id)} &bull; {getPersonaCity(active.id)}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display text-ink tracking-normal">
                    {getPersonaName(active.id)}
                  </h3>
                  <span className="text-xs text-ash font-mono-numbers">
                    dukaanos.in/store/{active.slug}
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-success/15 text-success border border-success/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-success" />
                    {t('landing.terminal_open_orders')}
                  </span>
                  <div className="mt-1 text-[11px] text-ash font-mono-numbers">
                    {t('landing.terminal_cod_whatsapp')}
                  </div>
                </div>
              </div>

              {/* Live Featured Item Box with Active Animation Preset */}
              <div className={`mt-4 p-4 rounded-xl bg-overlay/50 border border-hairline flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${getPresetCardClass()}`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-overlay text-ash">
                    {getPersonaTag(active.id)}
                  </span>
                  <h4 className="text-sm font-semibold text-ink">
                    {getPersonaProduct(active.id)}
                  </h4>
                  <div className="flex items-baseline gap-2 font-mono-numbers">
                    <span className="text-base font-bold text-ink">
                      ₹{active.featuredProduct.price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-xs text-ash line-through">
                      ₹{active.featuredProduct.mrp.toLocaleString('en-IN')}
                    </span>
                    <span className="text-[11px] font-semibold text-accent">
                      {Math.round(((active.featuredProduct.mrp - active.featuredProduct.price) / active.featuredProduct.mrp) * 100)}% off
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestOrder}
                  className="px-4 py-2.5 rounded-lg bg-accent hover:bg-accent-strong text-ink font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap hover:shadow-[0_0_18px_rgba(245,158,11,0.4)] duration-200"
                >
                  <ShoppingBag className="w-3.5 h-3.5" aria-hidden="true" />
                  <span>{t('landing.terminal_test_order')}</span>
                </button>
              </div>

              {/* Commission Freedom Banner in Amber/Emerald */}
              <div className="mt-3 p-3 rounded-lg bg-accent/10 border border-accent/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-accent shrink-0" aria-hidden="true" />
                  <span className="text-amber-200 font-medium">
                    {getPersonaSaved(active.id)}
                  </span>
                </div>
                <span className="text-accent font-mono-numbers font-semibold">
                  0% Fee
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-hairline flex items-center justify-between text-xs text-ash">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-accent" aria-hidden="true" />
                {t('landing.terminal_direct_settlement')}
              </span>
              <Link
                href="/store/shiv-kirana"
                target="_blank"
                className="text-ink hover:text-accent font-medium transition inline-flex items-center gap-1 group"
              >
                <span>{t('landing.terminal_full_demo')}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" aria-hidden="true" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): Live Dispatch Receipt & WhatsApp Ticket */}
          <div className="lg:col-span-5 rounded-xl bg-canvas border border-hairline p-5 flex flex-col justify-between">
            <div>
              {/* Receipt Heading */}
              <div className="flex items-center justify-between pb-3 border-b border-hairline">
                <span className="text-xs font-semibold text-ash">
                  {t('landing.terminal_incoming_slip')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-accent/20 text-accent font-mono-numbers">
                    #{orderCount} Placed
                  </span>
                  <span className="text-[11px] font-mono-numbers text-accent font-medium">
                    {orderSent ? t('landing.terminal_placed_just_now') : active.sampleOrder.timeAgo}
                  </span>
                </div>
              </div>

              {/* The Physical Paper Order Ticket with 3D Slide & Pop Stamp */}
              <div
                key={orderSent ? `ticket-active-${orderCount}` : `ticket-idle`}
                className={`mt-3 p-4 rounded-lg bg-elevated text-ink shadow-md border border-hairline space-y-3 relative overflow-hidden ${
                  orderSent ? 'animate-receipt-3d' : ''
                }`}
              >
                {/* 3D Stamp on Order Confirmation */}
                {orderSent && (
                  <div className="absolute top-3 right-3 z-20 pointer-events-none animate-stamp-3d">
                    <div className="px-2.5 py-1 rounded border-2 border-success bg-success/10 text-success font-bold text-[11px] tracking-wider uppercase shadow-md rotate-[-8deg]">
                      {t('landing.terminal_verified_cod')}
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-ash font-mono-numbers">
                      {active.sampleOrder.ref}
                    </span>
                    <h5 className="text-xs font-bold text-ink">
                      {active.sampleOrder.customer}
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-accent/10 text-accent border border-accent/20">
                    {t('landing.terminal_pay_on_delivery')}
                  </span>
                </div>

                <div className="py-2 border-y border-dashed border-hairline text-xs font-mono-numbers space-y-1">
                  <div className="flex justify-between font-medium text-ink">
                    <span>{getPersonaProduct(active.id)}</span>
                    <span>₹{active.sampleOrder.amount.toLocaleString('en-IN')}</span>
                  </div>
                  <div className="flex justify-between text-ash text-[11px]">
                    <span>{t('landing.terminal_delivery_pin')} {active.sampleOrder.pincode}</span>
                    <span className="text-success font-bold">{t('landing.terminal_free_delivery')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono-numbers text-xs font-bold">
                  <span>{t('landing.terminal_total_due')}</span>
                  <span className="text-sm text-accent">
                    ₹{active.sampleOrder.amount.toLocaleString('en-IN')}
                  </span>
                </div>

                {/* Instant WhatsApp Order Slip CTA */}
                <div className="pt-1">
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Hi! I have placed order ${active.sampleOrder.ref} for ${active.sampleOrder.item} (₹${active.sampleOrder.amount.toLocaleString('en-IN')}) on ${active.shopName}. Please confirm delivery to PIN ${active.sampleOrder.pincode}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-md bg-accent hover:bg-accent-strong text-white font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" aria-hidden="true" />
                    <span>{t('landing.terminal_send_whatsapp')}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Metrics Underneath */}
            <div className="mt-4 pt-3 border-t border-hairline grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded bg-overlay/50 border border-hairline">
                <span className="text-[10px] text-ash block">{t('landing.terminal_avg_fulfillment')}</span>
                <span className="text-sm font-bold text-ink font-mono-numbers">{t('landing.terminal_fulfillment_time')}</span>
              </div>
              <div className="p-2.5 rounded bg-overlay/50 border border-hairline">
                <span className="text-[10px] text-ash block">{t('landing.terminal_platform_commission')}</span>
                <span className="text-sm font-bold text-accent font-mono-numbers">₹0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feedback Toast Notification on Button Click */}
        {orderSent && (
          <div className="mx-3 mb-2 p-3 rounded-xl bg-accent text-ink text-xs font-semibold flex items-center justify-between shadow-xl animate-toast-in">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-ink" aria-hidden="true" />
              <span>{t('landing.terminal_simulated_order')}</span>
            </div>
            <span className="text-ink/80 font-mono-numbers text-[11px]">0.3s response</span>
          </div>
        )}
      </div>
    </div>
  );
}