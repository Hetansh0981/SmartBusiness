'use client';

import React from 'react';
import { useCart } from '@/lib/cartContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatINR } from '@/lib/utils';
import { getValidWhatsAppUrl } from '@/lib/whatsapp';
import type { Product, Category } from '@/types';
import type { StorefrontTheme } from '@/lib/storefrontThemes';
import {
  MessageCircle,
  Package,
  Plus,
  Minus,
  ShoppingBag,
} from 'lucide-react';

interface ProductCardProps {
  product: Product;
  category?: Category | null;
  storeName: string;
  whatsappNumber: string;
  theme: StorefrontTheme;
}

export default function ProductCard({
  product,
  category,
  storeName,
  whatsappNumber,
  theme,
}: ProductCardProps) {
  const { t } = useLanguage();
  const { addToCart, updateQuantity, getItemQuantity } = useCart();
  const quantityInCart = getItemQuantity(product.id);

  const discountPercent =
    product.mrp && product.mrp > product.price
      ? Math.round(((product.mrp - product.price) / product.mrp) * 100)
      : null;

  // WhatsApp Contextual Message Generation
  const messageText = product.in_stock
    ? `Hi! I'd like to order "${product.name}" (${formatINR(product.price)}) from ${storeName}. Is it available for delivery/pickup?`
    : `Hi! I saw that "${product.name}" is currently out of stock on ${storeName}. When will it be back in stock?`;

  const whatsappUrl = getValidWhatsAppUrl(whatsappNumber, messageText);

  return (
    <div
      className={`group rounded-xl bg-white border transition-all duration-300 flex flex-col justify-between overflow-hidden relative shadow-xs card-3d-hover sheen-glow ${
        product.in_stock
          ? 'border-[#e6dfd8] hover:border-amber-400 hover:shadow-lg'
          : 'border-[#e6dfd8] opacity-75'
      }`}
    >
      <div>
        {/* Photo Container */}
        <div className="relative h-44 sm:h-48 w-full bg-[#f9fafb] overflow-hidden border-b border-[#f1f3f5]">
          {product.image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={product.image_url}
              alt={product.name}
              className={`w-full h-full object-cover transition-transform duration-500 ${
                product.in_stock ? 'group-hover:scale-108' : 'grayscale opacity-70'
              }`}
            />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center text-[#9ca3af]">
              <Package className="w-8 h-8 mb-1 opacity-50 group-hover:scale-110 transition-transform" />
              <span className="text-[10px] font-medium">
                {category?.name || 'Item'}
              </span>
            </div>
          )}

          {/* Stock Status Badge */}
          <div className="absolute top-2.5 left-2.5">
            {product.in_stock ? (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#ecfdf5] text-[#059669] border border-emerald-200 shadow-xs flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
                {t('products.in_stock')}
              </span>
            ) : (
              <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-[#f3f4f6] text-[#6b7280] border border-[#e5e7eb]">
                {t('storefront.sold_out')}
              </span>
            )}
          </div>

          {/* Discount Percentage Badge */}
          {discountPercent && product.in_stock && (
            <div className="absolute top-2.5 right-2.5">
              <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-[#d97706] text-white shadow-xs">
                {discountPercent}% OFF
              </span>
            </div>
          )}
        </div>

        {/* Content Info */}
        <div className="p-3.5 sm:p-4">
          {category && (
            <div className="mb-1">
              <span className="inline-block text-[10px] font-medium uppercase tracking-wider px-2 py-0.5 rounded bg-[#f5f0e8] text-[#6c6a64] border border-[#e6dfd8]">
                {category.name}
              </span>
            </div>
          )}

          <h3 className="text-sm font-semibold text-[#141413] group-hover:text-[#d97706] transition-colors line-clamp-1">
            {product.name}
          </h3>

          {product.description && (
            <p className="mt-1 text-xs text-[#6b7280] line-clamp-2 leading-relaxed">
              {product.description}
            </p>
          )}

          {/* Price Block */}
          <div className="mt-2.5 flex items-baseline gap-2 font-mono-numbers">
            <span className="text-base sm:text-lg font-semibold text-[#111827]">
              {formatINR(product.price)}
            </span>
            {product.mrp && (
              <span className="text-xs text-[#9ca3af] line-through">
                {formatINR(product.mrp)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons: Add to Cart & WhatsApp Order */}
      <div className="p-3.5 sm:p-4 pt-0 space-y-1.5">
        {product.in_stock ? (
          <div>
            {quantityInCart > 0 ? (
              /* Stepper if already in cart */
              <div
                className="w-full py-1 px-2.5 rounded bg-[#ffedd5] border border-orange-200 flex items-center justify-between"
                style={{ borderRadius: 'var(--theme-button-radius, 6px)' }}
              >
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, quantityInCart - 1)}
                  className="w-6 h-6 rounded bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs hover:bg-[#c2410c] transition active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--theme-primary, #ea580c)',
                    borderRadius: 'var(--theme-button-radius, 4px)',
                  }}
                >
                  <Minus className="w-3 h-3" />
                </button>
                <div className="text-xs font-semibold text-[#c2410c] font-mono-numbers">
                  {quantityInCart} {t('storefront.in_cart')}
                </div>
                <button
                  type="button"
                  onClick={() => updateQuantity(product.id, quantityInCart + 1)}
                  className="w-6 h-6 rounded bg-[#ea580c] text-white flex items-center justify-center font-bold text-xs hover:bg-[#c2410c] transition active:scale-95 cursor-pointer"
                  style={{
                    backgroundColor: 'var(--theme-primary, #ea580c)',
                    borderRadius: 'var(--theme-button-radius, 4px)',
                  }}
                >
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            ) : (
              /* Add to Cart CTA */
              <button
                type="button"
                onClick={() => addToCart(product, 1)}
                className="w-full py-2 px-3 rounded font-medium text-xs text-white bg-[#ea580c] hover:bg-[#c2410c] transition-colors flex items-center justify-center gap-1.5 shadow-xs active:scale-98 cursor-pointer"
                style={{
                  backgroundColor: 'var(--theme-primary, #ea580c)',
                  borderRadius: 'var(--theme-button-radius, 6px)',
                }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>{t('storefront.add_to_cart')}</span>
              </button>
            )}

            {/* Direct WhatsApp Quick Order */}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full mt-1 py-1 px-2 rounded text-[11px] font-medium text-[#059669] hover:bg-[#ecfdf5] transition flex items-center justify-center gap-1"
                style={{ borderRadius: 'var(--theme-button-radius, 6px)' }}
              >
                <MessageCircle className="w-3 h-3" />
                <span>{t('storefront.order_whatsapp')}</span>
              </a>
            )}
          </div>
        ) : (
          /* Out of Stock: WhatsApp Enquiry */
          <div>
            <div
              className="w-full py-1.5 px-3 rounded bg-[#f3f4f6] text-center text-xs font-medium text-[#9ca3af] select-none mb-1"
              style={{ borderRadius: 'var(--theme-button-radius, 6px)' }}
            >
              {t('storefront.sold_out')}
            </div>
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full py-1.5 px-3 rounded bg-white hover:bg-[#f9fafb] text-[#4b5563] border border-[#e5e7eb] text-xs font-medium transition flex items-center justify-center gap-1.5"
                style={{ borderRadius: 'var(--theme-button-radius, 6px)' }}
              >
                <MessageCircle className="w-3.5 h-3.5 text-[#6b7280]" />
                <span>{t('storefront.enquire_whatsapp')}</span>
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
