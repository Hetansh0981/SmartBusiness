'use client';

import React from 'react';
import Link from 'next/link';
import { MessageCircle, MapPin, ShieldCheck } from 'lucide-react';
import { getValidWhatsAppUrl, formatPhoneNumber } from '@/lib/whatsapp';
import type { StorefrontTheme } from '@/lib/storefrontThemes';
import type { PublicStore } from '@/types';

interface StorefrontFooterProps {
  store: PublicStore;
  theme: StorefrontTheme;
}

export default function StorefrontFooter({ store, theme }: StorefrontFooterProps) {
  const whatsappUrl = getValidWhatsAppUrl(
    store.whatsapp_number,
    `Hi ${store.name}! I have a question regarding your store on DukaanOS.`
  );

  return (
    <footer className="border-t border-[#e5e7eb] bg-white pt-8 pb-12 text-xs text-[#6b7280]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 border-b border-[#f1f3f5]">
          {/* Shop Info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-sm sm:text-base font-semibold text-[#111827]">{store.name}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669]" />
            </div>
            <p className="text-[#6b7280] flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-[#9ca3af]" />
              <span>
                {store.city}, {store.state} &bull; Direct WhatsApp &amp; COD Orders
              </span>
            </p>
          </div>

          {/* WhatsApp Support Button */}
          {whatsappUrl && (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 rounded bg-[#ecfdf5] hover:bg-[#d1fae5] border border-emerald-200 text-[#059669] font-medium text-xs flex items-center gap-1.5 transition shadow-xs"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Chat with Shop: {formatPhoneNumber(store.whatsapp_number)}</span>
            </a>
          )}
        </div>

        {/* Bottom Attribution */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-[#9ca3af]">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
            <span>Verified Merchant Store &bull; Cash on Delivery &amp; Self Pickup</span>
          </div>

          <div className="flex items-center gap-1">
            <span>Powered by</span>
            <Link
              href="/"
              className="text-[#111827] hover:text-[#ea580c] font-semibold transition flex items-center gap-1"
            >
              <span>DukaanOS</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
