'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { formatINR } from '@/lib/utils';
import {
  TrendingUp,
  ShoppingBag,
  MessageSquare,
  Sparkles,
  CheckCircle2,
  Package,
  Layers,
  ArrowRight,
  ExternalLink,
  Sliders,
  Smartphone,
  Eye,
  Check,
} from 'lucide-react';

export default function HeroDashboardPreview() {
  const [activeTab, setActiveTab] = useState<'canvas' | 'sections' | 'styles'>('canvas');
  const [whatsappEnabled, setWhatsappEnabled] = useState(true);
  const [codEnabled, setCodEnabled] = useState(true);

  return (
    <div className="relative w-full max-w-5xl mx-auto rounded-lg bg-white border border-[#e5e7eb] shadow-[0_4px_20px_rgba(0,0,0,0.06)] overflow-hidden text-left">
      {/* Top Window Bar */}
      <div className="bg-[#f9fafb] px-4 py-2.5 flex items-center justify-between border-b border-[#e5e7eb] text-xs select-none">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-[#fca5a5] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#fde68a] inline-block" />
          <span className="w-2.5 h-2.5 rounded-full bg-[#a7f3d0] inline-block" />
          <div className="ml-2 hidden sm:flex items-center gap-1 px-2.5 py-0.5 rounded bg-white border border-[#e5e7eb] text-[#6b7280] font-mono-numbers text-[11px]">
            <span>dukaanos.in/studio • Canvas</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[#059669] text-[11px] font-medium flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            Live Preview
          </span>
          <span className="hidden md:inline text-[#9ca3af] text-[11px]">DukaanOS Studio</span>
        </div>
      </div>

      {/* Mode Switcher Tabs */}
      <div className="px-4 py-2 bg-[#f9f9ff] border-b border-[#e5e7eb] flex items-center justify-between gap-2">
        <div className="flex p-0.5 rounded bg-[#e7eefe]">
          <button
            type="button"
            onClick={() => setActiveTab('canvas')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'canvas'
                ? 'bg-white text-[#ea580c] shadow-xs font-semibold'
                : 'text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span>Canvas</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sections')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'sections'
                ? 'bg-white text-[#ea580c] shadow-xs font-semibold'
                : 'text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Sections</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('styles')}
            className={`px-3 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1 ${
              activeTab === 'styles'
                ? 'bg-white text-[#ea580c] shadow-xs font-semibold'
                : 'text-[#4b5563] hover:text-[#111827]'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>Styles</span>
          </button>
        </div>

        <div className="flex items-center gap-1.5">
          <span className="text-[11px] text-[#059669] font-medium flex items-center gap-1">
            <Check className="w-3.5 h-3.5" /> Saved just now
          </span>
        </div>
      </div>

      {/* Main Studio Body: Canvas + Inspector */}
      <div className="p-4 sm:p-6 grid grid-cols-1 md:grid-cols-12 gap-6 bg-[#f9f9ff]">
        {/* Left: Mobile Viewport Frame (360px centered) */}
        <div className="md:col-span-6 flex flex-col items-center">
          <div className="w-full max-w-[340px] rounded-xl bg-white border border-[#e5e7eb] shadow-card overflow-hidden">
            {/* Storefront Miniature Header */}
            <div className="px-3.5 py-2.5 bg-white border-b border-[#e5e7eb] flex items-center justify-between">
              <span className="font-semibold text-xs text-[#ea580c] tracking-tight">Ananya Silks</span>
              <div className="flex items-center gap-2">
                <div className="relative">
                  <ShoppingBag className="w-3.5 h-3.5 text-[#111827]" />
                  <span className="absolute -top-1 -right-1 w-3 h-3 bg-[#ea580c] text-white rounded-full text-[8px] flex items-center justify-center font-bold">2</span>
                </div>
              </div>
            </div>

            {/* Live Storefront Hero Card */}
            <div className="p-3 bg-[#f0f3ff]">
              <div className="relative rounded-lg overflow-hidden bg-white border border-[#e2e8f8] shadow-xs">
                {/* Hero Banner Mock */}
                <div className="relative h-36 bg-gradient-to-t from-[#151c27] to-[#374151] p-3.5 flex flex-col justify-end text-white">
                  <span className="text-[10px] text-[#fed7aa] uppercase tracking-wider font-semibold">Festive Exclusive 2025</span>
                  <p className="text-sm font-semibold leading-tight text-white mt-0.5">The Heirloom Silk Collection</p>
                  <p className="text-[11px] text-white/80 line-clamp-1 mt-0.5">Handwoven pure katan silk sarees</p>
                  <div className="mt-2 flex items-center gap-2">
                    <span className="px-2 py-0.5 bg-[#ea580c] text-white text-[10px] rounded font-semibold inline-flex items-center gap-0.5 shadow-xs">
                      Shop Now &rarr;
                    </span>
                    <span className="text-[10px] text-white/90 bg-black/40 px-1.5 py-0.5 rounded">Flat 15% Off COD</span>
                  </div>
                </div>
              </div>

              {/* Subsections: Category Chips */}
              <div className="mt-2.5 flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
                <span className="px-2 py-0.5 rounded-full bg-[#e2e8f8] text-[#111827] text-[10px] font-medium whitespace-nowrap">✨ Pure Silk</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#4b5563] text-[10px] whitespace-nowrap border border-[#e5e7eb]">Kanchipuram</span>
                <span className="px-2 py-0.5 rounded-full bg-white text-[#4b5563] text-[10px] whitespace-nowrap border border-[#e5e7eb]">Tussar</span>
              </div>

              {/* Mini Product Tile */}
              <div className="mt-2 p-2 bg-white rounded border border-[#e5e7eb] shadow-xs flex items-center gap-2">
                <div className="w-10 h-10 rounded bg-[#f3f4f6] flex items-center justify-center text-[#9ca3af] shrink-0">
                  <Package className="w-5 h-5 text-[#ea580c]" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-xs font-semibold text-[#111827] truncate">Gulabi Zari Bridal Saree</div>
                  <div className="flex items-center gap-1.5 mt-0.5 font-mono-numbers">
                    <span className="text-xs font-semibold text-[#ea580c]">₹14,499</span>
                    <span className="text-[10px] text-[#9ca3af] line-through">₹18,999</span>
                    <span className="text-[9px] px-1 py-0.2 rounded bg-[#ecfdf5] text-[#059669] font-medium">In Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Studio Inspector & Controls */}
        <div className="md:col-span-6 space-y-4">
          <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs space-y-3">
            <div>
              <span className="text-xs font-semibold text-[#111827]">Active Block: Hero Banner</span>
              <p className="text-[11px] text-[#6b7280]">Live edits sync with storefront instantaneously</p>
            </div>

            <div className="space-y-2 text-xs">
              <div>
                <label className="block text-[#4b5563] mb-1 font-medium">Headline Text</label>
                <input
                  type="text"
                  readOnly
                  value="The Heirloom Silk Collection"
                  className="w-full px-2.5 py-1.5 h-8 rounded border border-[#e5e7eb] bg-[#f9fafb] text-[#111827] text-xs font-medium"
                />
              </div>

              <div>
                <label className="block text-[#4b5563] mb-1 font-medium">Theme Accent Palette</label>
                <div className="flex items-center gap-2">
                  <button className="w-6 h-6 rounded-full bg-[#ea580c] ring-2 ring-[#ea580c] ring-offset-2 flex items-center justify-center text-white" title="Royal Saffron">
                    <Check className="w-3 h-3" />
                  </button>
                  <button className="w-6 h-6 rounded-full bg-[#006948]" title="Temple Emerald" />
                  <button className="w-6 h-6 rounded-full bg-[#18181b]" title="Deep Charcoal" />
                  <button className="w-6 h-6 rounded-full bg-[#f8fafc] border border-gray-300" title="Pearl White" />
                </div>
              </div>
            </div>
          </div>

          {/* Smart Merchant Toggles */}
          <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs space-y-3">
            <span className="text-xs font-semibold text-[#111827]">Merchant Channels</span>

            <div className="flex items-center justify-between text-xs pt-1">
              <div>
                <div className="font-medium text-[#111827]">Floating WhatsApp Button</div>
                <div className="text-[11px] text-[#6b7280]">Direct buyer checkout to store mobile number</div>
              </div>
              <button
                type="button"
                onClick={() => setWhatsappEnabled(!whatsappEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors ${
                  whatsappEnabled ? 'bg-[#ea580c]' : 'bg-[#dce2f3]'
                }`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transition mt-0.5 ml-0.5 ${whatsappEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-[#f1f3f5]">
              <div>
                <div className="font-medium text-[#111827]">Cash on Delivery (COD) Tag</div>
                <div className="text-[11px] text-[#6b7280]">Build local buyer trust with 0 upfront payment</div>
              </div>
              <button
                type="button"
                onClick={() => setCodEnabled(!codEnabled)}
                className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border border-transparent transition-colors ${
                  codEnabled ? 'bg-[#ea580c]' : 'bg-[#dce2f3]'
                }`}
              >
                <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-xs transition mt-0.5 ml-0.5 ${codEnabled ? 'translate-x-4' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
