'use client';

import React from 'react';
import Link from 'next/link';
import {
  Sparkles,
  Zap,
  ShieldCheck,
  Smartphone,
  TrendingUp,
  MessageSquare,
  Package,
  Layers,
  ArrowRight,
  CheckCircle2,
} from 'lucide-react';

export default function BentoFeatures() {
  return (
    <section className="py-16 relative z-10 bg-[#f9f9ff]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#ffedd5] border border-orange-200 text-[#c2410c] text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
            <span>Built for Modern Indian Retail</span>
          </div>

          <h2 className="text-2xl sm:text-4xl font-semibold text-[#111827] tracking-tight leading-tight">
            Engineered for Speed.{' '}
            <span className="text-[#ea580c]">
              Designed for Clarity.
            </span>
          </h2>
          <p className="mt-2 text-[#4b5563] text-xs sm:text-sm leading-relaxed">
            Everything your local shop needs to take online orders—from 1-tap cart checkout to atomic inventory tracking.
          </p>
        </div>

        {/* 4-Card Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-stretch">
          {/* Bento Card 1: Balance & Live WhatsApp Orders */}
          <div className="md:col-span-4 rounded-lg bg-white border border-[#e5e7eb] p-5 flex flex-col justify-between shadow-xs hover:border-orange-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                  Settlements
                </span>
                <span className="w-2 h-2 rounded-full bg-[#059669] animate-pulse" />
              </div>

              <h3 className="text-base font-semibold text-[#111827] mb-1">
                Direct UPI &amp; Cash Settlements
              </h3>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Zero waiting periods or aggregator holdbacks. 100% of order amounts settle directly into your bank or upon Cash on Delivery.
              </p>
            </div>

            <div className="mt-5 p-3 rounded bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-between font-mono-numbers">
              <span className="text-xs text-[#6b7280]">Settled GMV</span>
              <span className="text-sm font-semibold text-[#059669]">₹42,500</span>
            </div>
          </div>

          {/* Bento Card 2: 1-Tap Cart & Checkout */}
          <div className="md:col-span-8 rounded-lg bg-white border border-[#e5e7eb] p-5 flex flex-col justify-between shadow-xs hover:border-orange-300 transition-colors">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-[#ea580c] uppercase tracking-wider">
                  Orders &amp; Checkout System
                </span>
                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#ecfdf5] text-[#059669] border border-emerald-200">
                  Milestone 4 Live
                </span>
              </div>

              <h3 className="text-lg sm:text-xl font-semibold text-[#111827] mb-1">
                High-Speed Shopping Cart &amp; Indian Checkout
              </h3>
              <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed max-w-xl">
                Multi-product cart drawer with instant quantity increments, server-authoritative pricing validation, home delivery or store pickup toggles, and WhatsApp receipt generation.
              </p>
            </div>

            <div className="mt-5 grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-2.5 rounded bg-[#f9fafb] border border-[#e5e7eb] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="text-[#111827] font-medium">Atomic PostgreSQL RPC</span>
              </div>
              <div className="p-2.5 rounded bg-[#f9fafb] border border-[#e5e7eb] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="text-[#111827] font-medium">Idempotency Protection</span>
              </div>
              <div className="p-2.5 rounded bg-[#f9fafb] border border-[#e5e7eb] flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#059669] shrink-0" />
                <span className="text-[#111827] font-medium">Strict Tenant RLS</span>
              </div>
            </div>
          </div>

          {/* Bento Card 3: Instant Catalog Management */}
          <div className="md:col-span-6 rounded-lg bg-white border border-[#e5e7eb] p-5 flex flex-col justify-between shadow-xs hover:border-orange-300 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Package className="w-4 h-4 text-[#ea580c]" />
                <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                  Catalog Manager
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-1">
                1-Click Stock Toggle &amp; Category Structuring
              </h3>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Update stock status in real-time right from your smartphone. Group inventory into neat categories like Dry Fruits, Sweets, or Namkeen with instant customer synchronization.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f1f3f5] flex items-center justify-between text-xs text-[#6b7280]">
              <span>Unlimited Products &bull; Cloud Photo Storage</span>
              <Link href="/dashboard/products" className="text-[#ea580c] font-medium hover:underline flex items-center gap-0.5">
                Manage Catalog &rarr;
              </Link>
            </div>
          </div>

          {/* Bento Card 4: Storefront Precision */}
          <div className="md:col-span-6 rounded-lg bg-white border border-[#e5e7eb] p-5 flex flex-col justify-between shadow-xs hover:border-orange-300 transition-colors">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <Smartphone className="w-4 h-4 text-[#059669]" />
                <span className="text-xs font-semibold text-[#6b7280] uppercase tracking-wider">
                  Storefront Precision
                </span>
              </div>
              <h3 className="text-base font-semibold text-[#111827] mb-1">
                Sub-Second Mobile Load Speeds
              </h3>
              <p className="text-xs text-[#4b5563] leading-relaxed">
                Clean, accessible UI optimized for 3G/4G networks across Tier-2 and Tier-3 Indian cities. Built on Next.js 16 and Turbopack for instantaneous page transitions.
              </p>
            </div>

            <div className="mt-4 pt-3 border-t border-[#f1f3f5] flex items-center justify-between text-xs text-[#6b7280]">
              <span>Zero bloated dependencies</span>
              <span className="text-[#059669] font-medium font-mono-numbers">100/100 Core Web Vitals</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
