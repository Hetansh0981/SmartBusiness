'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, MessageCircle, ShoppingBag } from 'lucide-react';
import { getValidWhatsAppUrl } from '@/lib/whatsapp';
import { useCart } from '@/lib/cartContext';
import type { StorefrontTheme } from '@/lib/storefrontThemes';
import type { PublicStore } from '@/types';

interface StorefrontHeaderProps {
  store: PublicStore;
  theme: StorefrontTheme;
}

export default function StorefrontHeader({ store, theme }: StorefrontHeaderProps) {
  const { itemCount, openDrawer } = useCart();

  const whatsappUrl = getValidWhatsAppUrl(
    store.whatsapp_number,
    `Hi ${store.name}! I am browsing your online store on DukaanOS and have an enquiry.`
  );

  return (
    <header className="sticky top-0 z-40 border-b border-[#e5e7eb] bg-white/95 backdrop-blur-md shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
        {/* Left: Store Brand Logo & Name */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded bg-[#ea580c] flex items-center justify-center font-bold text-white text-sm shadow-xs"
          >
            {store.name.charAt(0).toUpperCase()}
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-sm sm:text-base font-semibold text-[#111827] tracking-tight line-clamp-1">
                {store.name}
              </h1>
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            </div>
            <div className="text-[11px] text-[#6b7280] flex items-center gap-1">
              <MapPin className="w-3 h-3 text-[#9ca3af]" />
              <span>
                {store.city}, {store.state}
              </span>
            </div>
          </div>
        </div>

        {/* Right: Cart, Status & WhatsApp Contact Button */}
        <div className="flex items-center gap-2">
          <div className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-emerald-200 text-[11px] font-medium text-[#059669]">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
            <span>Taking Orders</span>
          </div>

          {/* Cart Icon Button */}
          <button
            type="button"
            onClick={openDrawer}
            className="relative p-1.5 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-[#111827] transition active:scale-95 cursor-pointer flex items-center gap-1.5 px-2.5 shadow-xs"
            aria-label="View Cart"
          >
            <ShoppingBag className="w-4 h-4 text-[#ea580c]" />
            <span className="text-xs font-semibold text-[#111827] hidden xs:inline">Cart</span>
            {itemCount > 0 && (
              <span className="px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-[#ea580c] text-white shadow-xs font-mono-numbers">
                {itemCount}
              </span>
            )}
          </button>

          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1 rounded bg-[#ecfdf5] hover:bg-[#d1fae5] border border-emerald-200 text-[#059669] font-medium text-xs transition flex items-center gap-1.5 shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">WhatsApp</span>
            </a>
          )}
        </div>
      </div>
    </header>
  );
}
