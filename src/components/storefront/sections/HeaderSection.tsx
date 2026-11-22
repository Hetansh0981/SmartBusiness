'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, MessageCircle, ShoppingBag, ExternalLink } from 'lucide-react';
import { getValidWhatsAppUrl } from '@/lib/whatsapp';
import { useCart } from '@/lib/cartContext';
import { useStorefrontPreview } from '@/components/storefront/StorefrontPreviewContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import type { HeaderSectionProps, ThemeTokens } from '@/types/customizer';
import type { PublicStore } from '@/types';

interface HeaderSectionComponentProps {
  id: string;
  props: HeaderSectionProps;
  store: PublicStore;
  theme: ThemeTokens;
}

export default function HeaderSection({ id, props, store, theme }: HeaderSectionComponentProps) {
  const { isEditorPreview, activeSectionId } = useStorefrontPreview();
  const { t } = useLanguage();
  const cart = useCart();

  const whatsappUrl = getValidWhatsAppUrl(
    store.whatsapp_number,
    `Hi ${store.name}! I am browsing your online store on DukaanOS and have an enquiry.`
  );

  const isSelected = isEditorPreview && activeSectionId === id;

  return (
    <div
      data-section-id={id}
      className={`w-full transition-all duration-200 relative ${
        props.sticky ? 'sticky top-0 z-40' : 'relative z-10'
      } ${isSelected ? 'ring-2 ring-[#ea580c] ring-offset-1 z-50' : ''}`}
    >
      {/* 1. Announcement Bar (Optional) */}
      {props.showAnnouncement && props.announcementText && (
        <div
          className="text-center py-1.5 px-4 text-xs font-medium text-white transition-colors"
          style={{ backgroundColor: theme.primaryColor }}
        >
          {props.announcementLink ? (
            <Link
              href={props.announcementLink}
              className="hover:underline inline-flex items-center gap-1 justify-center"
            >
              <span>{props.announcementText}</span>
              <ExternalLink className="w-3 h-3 opacity-80" />
            </Link>
          ) : (
            <span>{props.announcementText}</span>
          )}
        </div>
      )}

      {/* 2. Main Store Header */}
      <header className="border-b border-[#e5e7eb] bg-white/95 backdrop-blur-md shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
          {/* Left: Brand Identity */}
          <div className="flex items-center gap-2.5">
            {props.logoStyle === 'initials' ? (
              <div
                className="w-8 h-8 rounded flex items-center justify-center font-bold text-white text-sm shadow-xs transition-colors"
                style={{ backgroundColor: theme.primaryColor, borderRadius: 'var(--theme-radius, 8px)' }}
              >
                {store.name.charAt(0).toUpperCase()}
              </div>
            ) : null}

            <div>
              <div className="flex items-center gap-1.5">
                <h1 className="text-sm sm:text-base font-semibold text-[#111827] tracking-tight line-clamp-1">
                  {store.name}
                </h1>
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              </div>

              {props.showLocationBadge && (
                <div className="text-[11px] text-[#6b7280] flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-[#9ca3af]" />
                  <span>
                    {store.city}, {store.state}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded-full bg-[#ecfdf5] border border-emerald-200 text-[11px] font-medium text-[#059669]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
              <span>{t('storefront.taking_orders', 'Taking Orders')}</span>
            </div>

            {/* Shopper Language Switcher */}
            <LanguageSwitcher scope="shopper" variant="compact" />

            {/* Cart Button */}
            <button
              type="button"
              onClick={cart.openDrawer}
              className="relative p-1.5 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-[#111827] transition active:scale-95 cursor-pointer flex items-center gap-1.5 px-2.5 shadow-xs"
              style={{ borderRadius: 'var(--theme-button-radius, var(--theme-radius, 8px))' }}
              aria-label={t('storefront.view_cart', 'View Cart')}
            >
              <ShoppingBag className="w-4 h-4" style={{ color: theme.primaryColor }} />
              <span className="text-xs font-semibold text-[#111827] hidden xs:inline">{t('storefront.cart', 'Cart')}</span>
              {cart.itemCount > 0 && (
                <span
                  className="px-1.5 py-0.2 rounded-full text-[10px] font-bold text-white shadow-xs font-mono-numbers"
                  style={{ backgroundColor: theme.primaryColor }}
                >
                  {cart.itemCount}
                </span>
              )}
            </button>

            {/* WhatsApp Contact */}
            {props.showWhatsAppButton && whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="px-3 py-1 rounded bg-[#ecfdf5] hover:bg-[#d1fae5] border border-emerald-200 text-[#059669] font-medium text-xs transition flex items-center gap-1.5 shadow-xs"
                style={{ borderRadius: 'var(--theme-button-radius, var(--theme-radius, 8px))' }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">WhatsApp</span>
              </a>
            )}
          </div>
        </div>
      </header>
    </div>
  );
}
