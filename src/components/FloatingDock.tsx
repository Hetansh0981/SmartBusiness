'use client';

import React from 'react';
import Link from 'next/link';
import {
  LayoutDashboard,
  Package,
  Layers,
  MessageSquare,
  Settings,
  Bell,
  Sparkles,
  ExternalLink,
} from 'lucide-react';

interface FloatingDockProps {
  activeTab?: 'overview' | 'products' | 'categories' | 'orders' | 'settings';
  storeSlug?: string;
  isInteractive?: boolean;
}

export default function FloatingDock({
  activeTab = 'products',
  storeSlug = 'ambica-dalwada',
  isInteractive = true,
}: FloatingDockProps) {
  const items = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard, href: '/dashboard' },
    { id: 'products', label: 'Products', icon: Package, href: '/dashboard/products' },
    { id: 'categories', label: 'Categories', icon: Layers, href: '/dashboard/categories' },
    { id: 'orders', label: 'Orders', icon: MessageSquare, href: '/dashboard' },
    { id: 'settings', label: 'Settings', icon: Settings, href: '/dashboard/settings' },
  ];

  return (
    <div className="w-full flex justify-center py-2 select-none">
      <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-2xl bg-[#090d15]/85 backdrop-blur-2xl border border-white/[0.12] shadow-[0_20px_50px_rgba(0,0,0,0.85),0_0_20px_rgba(255,92,0,0.12)] transition-all duration-300">
        {/* Brand Logo with Glowing Sun Dot */}
        <Link
          href="/"
          className="flex items-center gap-1.5 pr-2.5 sm:pr-3.5 border-r border-white/[0.08] group"
        >
          <span className="text-xs sm:text-sm font-extrabold tracking-tight text-white flex items-center gap-1">
            DukaanOS
            <span className="w-2 h-2 rounded-full bg-gradient-to-tr from-orange-500 to-amber-400 shadow-[0_0_8px_#ff7a00] animate-pulse" />
          </span>
        </Link>

        {/* Navigation Items */}
        <div className="flex items-center gap-1">
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            const content = (
              <span
                className={`flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold transition-all duration-200 cursor-pointer ${
                  isActive
                    ? 'bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-[0_0_15px_rgba(255,92,0,0.45)]'
                    : 'text-slate-400 hover:text-white hover:bg-white/[0.06]'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-white' : 'text-slate-400'}`} />
                <span className="hidden md:inline">{item.label}</span>
              </span>
            );

            return isInteractive ? (
              <Link key={item.id} href={item.href}>
                {content}
              </Link>
            ) : (
              <div key={item.id}>{content}</div>
            );
          })}
        </div>

        {/* Right Action: Store Pill & Notification Bell */}
        <div className="flex items-center gap-2 pl-2 sm:pl-3 border-l border-white/[0.08]">
          <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/25 text-[11px] font-medium text-emerald-400">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>dukaanos.in/{storeSlug}</span>
          </div>

          <button
            type="button"
            className="w-7 h-7 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 hover:text-white flex items-center justify-center transition border border-white/[0.06] cursor-pointer"
            title="Notifications"
          >
            <Bell className="w-3.5 h-3.5" />
          </button>

          {/* User Avatar */}
          <div className="w-7 h-7 rounded-xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white font-bold text-[11px] flex items-center justify-center shadow-[0_0_10px_rgba(255,92,0,0.3)]">
            A
          </div>
        </div>
      </div>
    </div>
  );
}
