'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import LogoutButton from '@/app/dashboard/LogoutButton';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import {
  LayoutDashboard,
  ShoppingBag,
  Package,
  Layers,
  Settings,
  ExternalLink,
  Store,
  Palette,
} from 'lucide-react';

export interface DashboardNavProps {
  storeName: string;
  storeSlug: string;
  userEmail: string;
}

export default function DashboardNav({ storeName, storeSlug, userEmail }: DashboardNavProps) {
  const pathname = usePathname();
  const { t } = useLanguage();

  const tabs = [
    { label: t('nav.store', 'Overview'), href: '/dashboard', exact: true, icon: LayoutDashboard },
    { label: t('nav.orders', 'Orders'), href: '/dashboard/orders', exact: false, icon: ShoppingBag },
    { label: t('nav.products', 'Products'), href: '/dashboard/products', exact: false, icon: Package },
    { label: t('nav.categories', 'Categories'), href: '/dashboard/categories', exact: false, icon: Layers },
    { label: t('nav.customizer', 'Customizer'), href: '/dashboard/customizer', exact: false, icon: Palette },
    { label: t('nav.settings', 'Settings'), href: '/dashboard/settings', exact: false, icon: Settings },
  ];

  const isActive = (tab: { href: string; exact: boolean }) => {
    if (!pathname) return false;
    if (tab.exact) {
      return pathname === tab.href;
    }
    return pathname.startsWith(tab.href);
  };

  return (
    <header className="border-b border-[#e5e7eb] bg-white sticky top-0 z-40 shadow-[0_1px_3px_0_rgba(0,0,0,0.02)]">
      {/* Top Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between gap-3">
        {/* Left: Brand & Store Title */}
        <div className="flex items-center gap-3 min-w-0">
          <Link href="/dashboard" className="flex items-center gap-2 group flex-shrink-0">
            <div className="h-7 w-7 rounded bg-[#ea580c] flex items-center justify-center text-white font-bold text-xs shadow-xs transition-transform group-hover:scale-105">
              D
            </div>
            <span className="text-sm font-bold text-[#111827] tracking-tight hidden xs:inline">
              DukaanOS
            </span>
          </Link>

          <span className="text-[#d1d5db]">/</span>

          <div className="flex items-center gap-2 min-w-0">
            <span className="text-sm font-semibold text-[#111827] truncate max-w-[140px] sm:max-w-[220px]">
              {storeName}
            </span>
            <span className="inline-flex items-center px-1.5 py-0.5 rounded-full bg-[#ecfdf5] text-[#059669] text-[11px] font-medium border border-emerald-200">
              <span className="w-1.5 h-1.5 rounded-full bg-[#059669] mr-1 animate-pulse" />
              {t('common.online', 'Live')}
            </span>
          </div>
        </div>

        {/* Right: Language Switcher, Storefront Link & User Info */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          {/* Universal Language Switcher */}
          <LanguageSwitcher scope="merchant" variant="pill" />

          <a
            href={`/store/${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-[#f0f3ff] hover:bg-[#e2e8f8] text-[#ea580c] text-xs font-semibold border border-[#dce2f3] transition-colors"
          >
            <span>{t('nav.view_storefront', 'Live Storefront')}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="hidden md:block text-right">
            <div className="text-xs font-medium text-[#111827] truncate max-w-[140px]">
              {userEmail}
            </div>
          </div>

          <LogoutButton />
        </div>
      </div>

      {/* Secondary Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#f1f3f5] flex items-center justify-between overflow-x-auto py-1.5">
        <nav className="flex space-x-1 p-0.5 rounded-md bg-[#f9fafb]">
          {tabs.map((tab) => {
            const active = isActive(tab);
            const Icon = tab.icon;
            return (
              <Link
                key={tab.href}
                href={tab.href}
                className={`flex items-center gap-1.5 px-3 py-1 rounded text-xs font-medium transition-all select-none ${
                  active
                    ? 'bg-white text-[#ea580c] shadow-xs font-semibold border border-[#e5e7eb]'
                    : 'text-[#4b5563] hover:text-[#111827] hover:bg-[#f3f4f6]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${active ? 'text-[#ea580c]' : 'text-[#6b7280]'}`} />
                <span>{tab.label}</span>
              </Link>
            );
          })}
        </nav>

        {/* Mobile View Storefront Shortcut */}
        <div className="sm:hidden flex items-center">
          <a
            href={`/store/${storeSlug}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-semibold text-[#ea580c] flex items-center gap-1 hover:underline"
          >
            <span>{t('nav.store', 'Store')}</span>
            <ExternalLink className="w-3 h-3" />
          </a>
        </div>
      </div>
    </header>
  );
}
