'use client';

import React from 'react';
import { useCart } from '@/lib/cartContext';
import { formatINR } from '@/lib/utils';
import { ShoppingBag, ArrowRight } from 'lucide-react';

interface FloatingCartBarProps {
  themeAccentColor?: string;
}

export default function FloatingCartBar({ themeAccentColor = '#ea580c' }: FloatingCartBarProps) {
  const { itemCount, subtotal, openDrawer } = useCart();

  if (itemCount === 0) return null;

  return (
    <div className="fixed bottom-3 sm:bottom-5 left-1/2 -translate-x-1/2 z-40 max-w-md w-[calc(100%-1.5rem)] animate-in fade-in slide-in-from-bottom-2 duration-200">
      <div
        onClick={openDrawer}
        className="w-full p-2.5 sm:p-3 rounded-lg bg-white border border-[#e5e7eb] shadow-[0_4px_12px_rgba(0,0,0,0.08)] flex items-center justify-between cursor-pointer group hover:border-orange-300 transition-all active:scale-[0.99]"
      >
        <div className="flex items-center gap-2.5">
          <div className="relative w-8 h-8 rounded bg-[#fff7ed] border border-orange-200 flex items-center justify-center text-[#ea580c]">
            <ShoppingBag className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 px-1.5 py-0.2 rounded-full text-[9px] font-bold bg-[#ea580c] text-white font-mono-numbers">
              {itemCount}
            </span>
          </div>

          <div>
            <div className="text-[11px] font-medium text-[#6b7280]">
              {itemCount} {itemCount === 1 ? 'item' : 'items'} in cart
            </div>
            <div className="text-sm font-semibold text-[#111827] font-mono-numbers">
              {formatINR(subtotal)}
            </div>
          </div>
        </div>

        <button
          type="button"
          className="px-3.5 py-1.5 rounded text-xs font-semibold text-white flex items-center gap-1 shadow-xs transition-colors"
          style={{
            backgroundColor: themeAccentColor || 'var(--theme-primary, #ea580c)',
            borderRadius: 'var(--theme-button-radius, 8px)',
          }}
        >
          <span>View Cart</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
