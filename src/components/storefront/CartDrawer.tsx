'use client';

import React, { useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatINR } from '@/lib/utils';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Package } from 'lucide-react';

interface CartDrawerProps {
  storeName: string;
  themeAccentColor?: string;
}

export default function CartDrawer({ storeName, themeAccentColor = '#ea580c' }: CartDrawerProps) {
  const { t } = useLanguage();
  const {
    items,
    subtotal,
    itemCount,
    isDrawerOpen,
    closeDrawer,
    updateQuantity,
    removeFromCart,
    clearCart,
    openCheckout,
  } = useCart();

  // Close on Escape
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isDrawerOpen) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isDrawerOpen, closeDrawer]);

  // Lock body scroll when drawer is open
  useEffect(() => {
    if (isDrawerOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isDrawerOpen]);

  if (!isDrawerOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        className="fixed inset-0 bg-[#111827]/40 backdrop-blur-xs animate-in fade-in duration-150"
      />

      {/* Drawer Container */}
      <div className="relative w-full max-w-md bg-white border-l border-[#e5e7eb] h-full flex flex-col z-10 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.03)] animate-in slide-in-from-right duration-200">
        {/* Drawer Header */}
        <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded bg-[#fff7ed] border border-orange-200 flex items-center justify-center text-[#ea580c]">
              <ShoppingBag className="w-3.5 h-3.5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">{t('cart.title', 'Your Cart')}</h2>
              <p className="text-[11px] text-[#6b7280]">
                {storeName} &bull; {itemCount} {itemCount === 1 ? t('storefront.cart_single_item', 'item') : t('storefront.cart', 'items')}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            {items.length > 0 && (
              <button
                type="button"
                onClick={clearCart}
                className="text-[11px] font-medium text-[#6b7280] hover:text-[#dc2626] px-2 py-0.5 rounded hover:bg-[#fef2f2] transition cursor-pointer"
              >
                {t('cart.clear', 'Clear')}
              </button>
            )}
            <button
              type="button"
              onClick={closeDrawer}
              className="w-7 h-7 rounded text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] flex items-center justify-center transition cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="flex-1 overflow-y-auto p-4 divide-y divide-[#f1f3f5]">
          {items.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center justify-center">
              <div className="w-12 h-12 rounded-lg bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] mb-3">
                <ShoppingBag className="w-6 h-6 opacity-60" />
              </div>
              <h3 className="text-sm font-semibold text-[#111827] mb-1">{t('cart.empty_title', 'Your cart is empty')}</h3>
              <p className="text-xs text-[#6b7280] max-w-xs mb-4">
                {t('cart.empty_desc', 'Explore items in the catalog and add them to your cart to place an order.')}
              </p>
              <button
                type="button"
                onClick={closeDrawer}
                className="px-3.5 py-1.5 rounded bg-[#f3f4f6] hover:bg-[#e5e7eb] text-[#111827] text-xs font-medium transition cursor-pointer"
              >
                Continue Browsing
              </button>
            </div>
          ) : (
            items.map((item) => (
              <div key={item.productId} className="py-3.5 first:pt-0 last:pb-0 flex items-center gap-3">
                {/* Thumbnail */}
                <div className="w-12 h-12 rounded bg-[#f9fafb] border border-[#e5e7eb] overflow-hidden shrink-0 flex items-center justify-center">
                  {item.imageUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={item.imageUrl} alt={item.name} className="w-full h-full object-cover" />
                  ) : (
                    <Package className="w-5 h-5 text-[#9ca3af]" />
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs sm:text-sm font-medium text-[#111827] truncate">{item.name}</h4>
                  <div className="text-[11px] text-[#6b7280] mt-0.5 font-mono-numbers">
                    {formatINR(item.price)} each
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 mt-1.5">
                    <div className="flex items-center bg-[#f9fafb] border border-[#e5e7eb] rounded overflow-hidden">
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#6b7280] hover:text-[#111827] hover:bg-[#e5e7eb] transition cursor-pointer"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="w-6 text-center text-xs font-semibold text-[#111827] font-mono-numbers select-none">
                        {item.quantity}
                      </span>
                      <button
                        type="button"
                        onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                        className="w-5 h-5 flex items-center justify-center text-[#6b7280] hover:text-[#111827] hover:bg-[#e5e7eb] transition cursor-pointer"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => removeFromCart(item.productId)}
                      className="text-[#9ca3af] hover:text-[#dc2626] p-0.5 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                {/* Line Total */}
                <div className="text-right shrink-0">
                  <div className="text-xs sm:text-sm font-semibold text-[#111827] font-mono-numbers">
                    {formatINR(item.price * item.quantity)}
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Drawer Footer */}
        {items.length > 0 && (
          <div className="p-4 border-t border-[#e5e7eb] bg-[#f9fafb] space-y-3 font-mono-numbers">
            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-[#6b7280]">
                <span>{t('cart.subtotal', 'Subtotal')}</span>
                <span className="font-medium text-[#111827]">{formatINR(subtotal)}</span>
              </div>
              <div className="flex items-center justify-between text-[#6b7280]">
                <span>{t('cart.delivery', 'Delivery Charges')}</span>
                <span className="font-medium text-[#059669]">{t('cart.delivery_free', 'FREE')}</span>
              </div>
              <div className="pt-2 border-t border-[#e5e7eb] flex items-center justify-between text-sm font-semibold text-[#111827]">
                <span>{t('cart.total', 'Total Amount')}</span>
                <span className="text-base text-[#ea580c]">{formatINR(subtotal)}</span>
              </div>
            </div>

            <button
              type="button"
              onClick={openCheckout}
              className="w-full py-2.5 px-4 rounded font-medium text-xs sm:text-sm text-white bg-[#ea580c] hover:bg-[#c2410c] shadow-xs flex items-center justify-center gap-1.5 active:scale-98 transition-colors cursor-pointer"
            >
              <span>{t('cart.checkout_button', 'Proceed to Checkout')}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
