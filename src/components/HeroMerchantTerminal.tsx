'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  ShoppingBag,
  MessageCircle,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Percent,
  Sparkles,
  Layers,
  Wand2,
  Box,
  Flame,
  Check,
} from 'lucide-react';

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

const ANIMATION_PRESETS: { id: AnimationPreset; label: string; icon: typeof Sparkles; desc: string }[] = [
  { id: '3d-pop', label: '3D Pop & Depth', icon: Box, desc: 'Perspective elevation & spring response' },
  { id: 'festive-shimmer', label: 'Festive Shimmer', icon: Flame, desc: 'Golden amber light sweep' },
  { id: 'gentle-glide', label: 'Gentle Glide', icon: Wand2, desc: 'Smooth boutique ease-in physics' },
  { id: 'dynamic-float', label: 'Anti-Gravity Float', icon: Layers, desc: 'Rhythmic floating levitation' },
];

export default function HeroMerchantTerminal() {
  const { t } = useLanguage();
  const [selectedId, setSelectedId] = useState<string>('fashion');
  const [orderSent, setOrderSent] = useState(false);
  const [orderCount, setOrderCount] = useState(1);
  const [animPreset, setAnimPreset] = useState<AnimationPreset>('3d-pop');
  const [is3DStage, setIs3DStage] = useState(false);

  // 3D Mouse Tilt Tracking
  const terminalRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (is3DStage) return;
    const card = terminalRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Calculate tilt within -4deg to +4deg
    const rotateX = ((y - centerY) / centerY) * -3.5;
    const rotateY = ((x - centerX) / centerX) * 3.5;
    setTilt({ x: rotateX, y: rotateY });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  const active = PERSONAS.find((p) => p.id === selectedId) || PERSONAS[0];

  const getPersonaBadge = (id: string) => t(`landing.persona_${id}_badge`, active.badge);
  const getPersonaName = (id: string) => t(`landing.persona_${id}_name`, active.shopName);
  const getPersonaCategory = (id: string) => t(`landing.persona_${id}_category`, active.category);
  const getPersonaCity = (id: string) => t(`landing.persona_${id}_city`, active.city);
  const getPersonaProduct = (id: string) => t(`landing.persona_${id}_product`, active.featuredProduct.name);
  const getPersonaTag = (id: string) => t(`landing.persona_${id}_tag`, active.featuredProduct.tag);
  const getPersonaSaved = (id: string) => t(`landing.persona_${id}_saved`, active.commissionSaved);

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

  // Preset class mapping
  const getPresetCardClass = () => {
    switch (animPreset) {
      case '3d-pop':
        return 'anim-3d-pop card-3d-hover';
      case 'festive-shimmer':
        return 'anim-festive-shimmer sheen-glow';
      case 'gentle-glide':
        return 'anim-gentle-glide';
      case 'dynamic-float':
        return 'anim-dynamic-float';
      default:
        return 'card-3d-hover';
    }
  };

  return (
    <div className="relative w-full max-w-5xl mx-auto perspective-1200">
      
      {/* Animation & 3D Stage Toolbar */}
      <div className="mb-3.5 flex flex-wrap items-center justify-between gap-2.5 px-2">
        <div className="flex items-center gap-1.5 overflow-x-auto scrollbar-none py-1">
          <span className="text-[11px] font-semibold text-[#6c6a64] uppercase tracking-wider mr-1 hidden sm:inline">
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
                    ? 'bg-[#181715] text-[#faf9f5] border-amber-500/40 shadow-xs'
                    : 'bg-white hover:bg-neutral-50 text-[#141413] border-[#e6dfd8]'
                }`}
                title={preset.desc}
              >
                <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-amber-400' : 'text-[#d97706]'}`} />
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
              ? 'bg-[#d97706] text-white border-amber-600 shadow-sm'
              : 'bg-white hover:bg-neutral-50 text-[#141413] border-[#e6dfd8]'
          }`}
        >
          <Box className="w-3.5 h-3.5" />
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
        className="rounded-2xl bg-[#181715] text-[#faf9f5] p-2.5 sm:p-3.5 shadow-[0_30px_60px_-15px_rgba(24,23,21,0.35)] border border-[#262420] transition-shadow duration-300 preserve-3d"
      >
        
        {/* Terminal Header & Mode Selectors */}
        <div className="p-3 sm:p-4 rounded-xl bg-white/[0.04] border border-white/[0.08] flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
            <span className="text-xs font-semibold tracking-wide text-white">{t('landing.terminal_live_counter')}</span>
            <span className="text-xs text-white/50 hidden sm:inline">&mdash; {t('landing.terminal_counter_desc')}</span>
          </div>

          {/* Interactive Shop Type Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-lg bg-black/40 border border-white/10 overflow-x-auto scrollbar-none">
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
                      ? 'bg-[#d97706] text-white shadow-sm font-semibold'
                      : 'text-white/70 hover:text-white hover:bg-white/5'
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
          <div className="lg:col-span-7 rounded-xl bg-[#1f1e1b] border border-white/10 p-5 flex flex-col justify-between">
            <div>
              {/* Store Identity Bar */}
              <div className="flex items-start justify-between gap-3 pb-4 border-b border-white/10">
                <div>
                  <span className="text-[11px] font-semibold text-[#f59e0b] uppercase tracking-wider block mb-0.5">
                    {getPersonaCategory(active.id)} &bull; {getPersonaCity(active.id)}
                  </span>
                  <h3 className="text-xl sm:text-2xl font-display text-white tracking-normal">
                    {getPersonaName(active.id)}
                  </h3>
                  <span className="text-xs text-white/60 font-mono-numbers">
                    dukaanos.in/store/{active.slug}
                  </span>
                </div>

                <div className="text-right">
                  <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {t('landing.terminal_open_orders')}
                  </span>
                  <div className="mt-1 text-[11px] text-white/50 font-mono-numbers">
                    {t('landing.terminal_cod_whatsapp')}
                  </div>
                </div>
              </div>

              {/* Live Featured Item Box with Active Animation Preset */}
              <div className={`mt-4 p-4 rounded-xl bg-white/[0.03] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${getPresetCardClass()}`}>
                <div className="space-y-1">
                  <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-white/10 text-white/80">
                    {getPersonaTag(active.id)}
                  </span>
                  <h4 className="text-sm font-semibold text-white">
                    {getPersonaProduct(active.id)}
                  </h4>
                  <div className="flex items-baseline gap-2 font-mono-numbers">
                    <span className="text-base font-bold text-white">
                      {formatINR(active.featuredProduct.price)}
                    </span>
                    <span className="text-xs text-white/40 line-through">
                      {formatINR(active.featuredProduct.mrp)}
                    </span>
                    <span className="text-[11px] font-semibold text-[#f59e0b]">
                      {Math.round(((active.featuredProduct.mrp - active.featuredProduct.price) / active.featuredProduct.mrp) * 100)}% off
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={handleTestOrder}
                  className="px-4 py-2.5 rounded-lg bg-[#d97706] hover:bg-[#b45309] text-white font-semibold text-xs transition cursor-pointer flex items-center justify-center gap-1.5 shadow-sm active:scale-95 whitespace-nowrap hover:shadow-[0_0_18px_rgba(217,119,6,0.5)] duration-200"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  <span>{t('landing.terminal_test_order')}</span>
                </button>
              </div>

              {/* Commission Freedom Banner in Amber/Emerald */}
              <div className="mt-3 p-3 rounded-lg bg-amber-950/30 border border-amber-500/30 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Percent className="w-4 h-4 text-amber-400 shrink-0" />
                  <span className="text-amber-200 font-medium">
                    {getPersonaSaved(active.id)}
                  </span>
                </div>
                <span className="text-amber-400 font-mono-numbers font-semibold">
                  0% Fee
                </span>
              </div>
            </div>

            {/* Bottom Actions */}
            <div className="pt-4 mt-4 border-t border-white/10 flex items-center justify-between text-xs text-white/60">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-[#f59e0b]" />
                {t('landing.terminal_direct_settlement')}
              </span>
              <Link
                href="/store/shiv-kirana"
                target="_blank"
                className="text-white hover:text-amber-400 font-medium transition inline-flex items-center gap-1 group"
              >
                <span>{t('landing.terminal_full_demo')}</span>
                <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Right Column (5 cols): Live Dispatch Receipt & WhatsApp Ticket */}
          <div className="lg:col-span-5 rounded-xl bg-[#1f1e1b] border border-white/10 p-5 flex flex-col justify-between">
            <div>
              {/* Receipt Heading */}
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <span className="text-xs font-semibold text-white/80">
                  {t('landing.terminal_incoming_slip')}
                </span>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 font-mono-numbers">
                    #{orderCount} Placed
                  </span>
                  <span className="text-[11px] font-mono-numbers text-amber-400 font-medium">
                    {orderSent ? t('landing.terminal_placed_just_now') : active.sampleOrder.timeAgo}
                  </span>
                </div>
              </div>

              {/* The Physical Paper Order Ticket with 3D Slide & Pop Stamp */}
              <div
                key={orderSent ? `ticket-active-${orderCount}` : `ticket-idle`}
                className={`mt-3 p-4 rounded-lg bg-white text-[#141413] shadow-md border border-[#e6dfd8] space-y-3 relative overflow-hidden ${
                  orderSent ? 'animate-receipt-3d' : ''
                }`}
              >
                {/* 3D Stamp on Order Confirmation */}
                {orderSent && (
                  <div className="absolute top-3 right-3 z-20 pointer-events-none animate-stamp-3d">
                    <div className="px-2.5 py-1 rounded border-2 border-emerald-600 bg-emerald-50 text-emerald-700 font-bold text-[11px] tracking-wider uppercase shadow-md rotate-[-8deg]">
                      {t('landing.terminal_verified_cod')}
                    </div>
                  </div>
                )}

                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold text-neutral-500 font-mono-numbers">
                      {active.sampleOrder.ref}
                    </span>
                    <h5 className="text-xs font-bold text-neutral-900">
                      {active.sampleOrder.customer}
                    </h5>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-50 text-amber-900 border border-amber-200">
                    {t('landing.terminal_pay_on_delivery')}
                  </span>
                </div>

                <div className="py-2 border-y border-dashed border-[#e6dfd8] text-xs font-mono-numbers space-y-1">
                  <div className="flex justify-between font-medium text-neutral-800">
                    <span>{getPersonaProduct(active.id)}</span>
                    <span>{formatINR(active.sampleOrder.amount)}</span>
                  </div>
                  <div className="flex justify-between text-neutral-500 text-[11px]">
                    <span>{t('landing.terminal_delivery_pin')} {active.sampleOrder.pincode}</span>
                    <span className="text-emerald-700 font-bold">{t('landing.terminal_free_delivery')}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-mono-numbers text-xs font-bold">
                  <span>{t('landing.terminal_total_due')}</span>
                  <span className="text-sm text-[#d97706]">
                    {formatINR(active.sampleOrder.amount)}
                  </span>
                </div>

                {/* Instant WhatsApp Order Slip CTA */}
                <div className="pt-1">
                  <a
                    href={`https://wa.me/919876543210?text=${encodeURIComponent(
                      `Hi! I have placed order ${active.sampleOrder.ref} for ${active.sampleOrder.item} (${formatINR(
                        active.sampleOrder.amount
                      )}) on ${active.shopName}. Please confirm delivery to PIN ${active.sampleOrder.pincode}.`
                    )}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full py-2 px-3 rounded-md bg-[#057a55] hover:bg-[#046848] text-white font-medium text-xs flex items-center justify-center gap-1.5 transition cursor-pointer shadow-sm hover:scale-[1.01] active:scale-[0.98]"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{t('landing.terminal_send_whatsapp')}</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Quick Metrics Underneath */}
            <div className="mt-4 pt-3 border-t border-white/10 grid grid-cols-2 gap-2 text-center">
              <div className="p-2.5 rounded bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-white/50 block">{t('landing.terminal_avg_fulfillment')}</span>
                <span className="text-sm font-bold text-white font-mono-numbers">{t('landing.terminal_fulfillment_time')}</span>
              </div>
              <div className="p-2.5 rounded bg-white/[0.03] border border-white/5">
                <span className="text-[10px] text-white/50 block">{t('landing.terminal_platform_commission')}</span>
                <span className="text-sm font-bold text-amber-400 font-mono-numbers">₹0.00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Live Feedback Toast Notification on Button Click */}
        {orderSent && (
          <div className="mx-3 mb-2 p-3 rounded-xl bg-amber-600 text-white text-xs font-semibold flex items-center justify-between shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-white" />
              <span>{t('landing.terminal_simulated_order')}</span>
            </div>
            <span className="text-white/80 font-mono-numbers text-[11px]">0.3s response</span>
          </div>
        )}
      </div>
    </div>
  );
}
