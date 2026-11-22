'use client';

import React, { useState, useEffect } from 'react';
import { useCart } from '@/lib/cartContext';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { placeOrderAction } from '@/app/store/[slug]/actions';
import { formatINR } from '@/lib/utils';
import { getValidWhatsAppUrl } from '@/lib/whatsapp';
import type { PublicStore } from '@/types';
import {
  X,
  Truck,
  Store,
  CheckCircle2,
  AlertCircle,
  Loader2,
  MessageCircle,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';

interface CheckoutModalProps {
  store: PublicStore;
  themeAccentColor?: string;
}

export default function CheckoutModal({ store, themeAccentColor = '#ea580c' }: CheckoutModalProps) {
  const { t } = useLanguage();
  const { items, subtotal, isCheckoutOpen, closeCheckout, clearCart } = useCart();

  // Form states
  const [deliveryMode, setDeliveryMode] = useState<'DELIVERY' | 'PICKUP'>('DELIVERY');
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [deliveryAddress, setDeliveryAddress] = useState('');
  const [deliveryCity, setDeliveryCity] = useState(store.city || '');
  const [deliveryState, setDeliveryState] = useState(store.state || '');
  const [deliveryPincode, setDeliveryPincode] = useState('');
  const [customerNotes, setCustomerNotes] = useState('');
  const [orderChannel, setOrderChannel] = useState<'WEBSITE' | 'WHATSAPP'>('WEBSITE');

  // Submission state
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  // Completed order snapshot
  const [confirmedOrder, setConfirmedOrder] = useState<{
    order_id: string;
    order_reference: string;
    subtotal: number;
    delivery_fee: number;
    total_amount: number;
    delivery_mode: 'DELIVERY' | 'PICKUP';
    items_count: number;
  } | null>(null);

  // Lock body scroll
  useEffect(() => {
    if (isCheckoutOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isCheckoutOpen]);

  if (!isCheckoutOpen) return null;

  const handleSubmitOrder = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // Client validation
    if (customerName.trim().length < 2) {
      setFormError('Please enter your full name (at least 2 characters).');
      return;
    }

    const cleanPhone = customerPhone.replace(/\D/g, '');
    if (!/^[6-9][0-9]{9}$/.test(cleanPhone)) {
      setFormError('Please enter a valid 10-digit Indian mobile number.');
      return;
    }

    if (deliveryMode === 'DELIVERY') {
      if (deliveryAddress.trim().length < 5) {
        setFormError('Please enter your complete delivery street address.');
        return;
      }
      if (deliveryCity.trim().length < 2) {
        setFormError('City is required.');
        return;
      }
      if (deliveryState.trim().length < 2) {
        setFormError('State is required.');
        return;
      }
      if (!/^[1-9][0-9]{5}$/.test(deliveryPincode.trim())) {
        setFormError('Please enter a valid 6-digit postal PIN code.');
        return;
      }
    }

    if (items.length === 0) {
      setFormError('Your cart is empty.');
      return;
    }

    setIsSubmitting(true);

    try {
      // Generate a collision-resistant idempotency key for this checkout attempt
      const idempotencyKey = `chk_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;

      const res = await placeOrderAction({
        storeId: store.id,
        idempotencyKey,
        customerName: customerName.trim(),
        customerPhone: cleanPhone,
        deliveryMode,
        deliveryAddress: deliveryMode === 'DELIVERY' ? deliveryAddress.trim() : null,
        deliveryCity: deliveryMode === 'DELIVERY' ? deliveryCity.trim() : null,
        deliveryState: deliveryMode === 'DELIVERY' ? deliveryState.trim() : null,
        deliveryPincode: deliveryMode === 'DELIVERY' ? deliveryPincode.trim() : null,
        customerNotes: customerNotes.trim() ? customerNotes.trim() : null,
        orderChannel,
        items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      });

      if (!res.success || !res.order) {
        setFormError(res.error || 'Failed to place order. Please try again.');
        setIsSubmitting(false);
        return;
      }

      // Order created successfully
      const created = res.order;
      setConfirmedOrder({
        order_id: created.order_id,
        order_reference: created.order_reference,
        subtotal: created.subtotal,
        delivery_fee: created.delivery_fee,
        total_amount: created.total_amount,
        delivery_mode: created.delivery_mode,
        items_count: items.reduce((acc, i) => acc + i.quantity, 0),
      });

      // Clear the cart
      clearCart();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Network error. Please try again.';
      setFormError(msg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Build WhatsApp receipt message for customer to send to merchant
  const buildWhatsAppMessage = () => {
    if (!confirmedOrder) return '';
    const cleanPhone = customerPhone.replace(/\D/g, '');
    let msg = `🛍️ *New Order: ${confirmedOrder.order_reference}*\n`;
    msg += `Store: *${store.name}*\n\n`;
    msg += `*Customer:* ${customerName} (+91 ${cleanPhone})\n`;
    msg += `*Mode:* ${confirmedOrder.delivery_mode === 'DELIVERY' ? 'Home Delivery' : 'Self Pickup'}\n`;

    if (confirmedOrder.delivery_mode === 'DELIVERY') {
      msg += `*Address:* ${deliveryAddress}, ${deliveryCity}, ${deliveryState} - ${deliveryPincode}\n`;
    }

    if (customerNotes.trim()) {
      msg += `*Notes:* ${customerNotes.trim()}\n`;
    }

    msg += `\n*Total Amount:* ${formatINR(confirmedOrder.total_amount)} (Cash on Delivery)\n\n`;
    msg += `Please confirm my order. Thank you!`;

    return msg;
  };

  const whatsappReceiptUrl = confirmedOrder
    ? getValidWhatsAppUrl(store.whatsapp_number, buildWhatsAppMessage())
    : null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      {/* Backdrop */}
      <div
        onClick={confirmedOrder ? undefined : closeCheckout}
        className="fixed inset-0 bg-[#111827]/40 backdrop-blur-xs animate-in fade-in duration-150"
      />

      {/* Modal Container */}
      <div className="relative w-full max-w-md bg-white border border-[#e5e7eb] rounded-lg z-10 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.03)] overflow-hidden my-auto animate-in zoom-in-95 duration-150">
        {/* ==================================================================== */}
        {/* STATE A: Order Success Receipt */}
        {/* ==================================================================== */}
        {confirmedOrder ? (
          <div className="p-5 sm:p-6 text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-[#ecfdf5] border border-emerald-200 flex items-center justify-center text-[#059669] mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>

            <div>
              <span className="text-[11px] font-medium uppercase tracking-wider text-[#059669] bg-[#ecfdf5] px-2.5 py-0.5 rounded border border-emerald-200">
                Order Placed Successfully
              </span>
              <h2 className="text-xl font-semibold text-[#111827] mt-2">Order Confirmed!</h2>
              <p className="text-xs text-[#6b7280] mt-0.5">
                Your order has been recorded with <strong className="text-[#111827]">{store.name}</strong>.
              </p>
            </div>

            {/* Order Reference Box */}
            <div className="p-3.5 rounded bg-[#f9fafb] border border-[#e5e7eb] text-left space-y-2 text-xs font-mono-numbers">
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Order Reference</span>
                <span className="font-semibold text-[#ea580c] text-sm">
                  {confirmedOrder.order_reference}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Total Amount</span>
                <span className="font-semibold text-[#111827] text-sm">
                  {formatINR(confirmedOrder.total_amount)}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Payment Mode</span>
                <span className="font-medium text-[#111827]">Cash on Delivery (COD)</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[#6b7280]">Fulfilment</span>
                <span className="font-medium text-[#111827]">
                  {confirmedOrder.delivery_mode === 'DELIVERY' ? 'Home Delivery' : 'Store Pickup'}
                </span>
              </div>
            </div>

            {/* WhatsApp Direct Notification CTA */}
            {whatsappReceiptUrl && (
              <div className="space-y-1.5 pt-1">
                <a
                  href={whatsappReceiptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 px-4 rounded font-medium text-xs sm:text-sm bg-[#059669] hover:bg-[#047857] text-white shadow-xs flex items-center justify-center gap-2 transition cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>Send Order to Merchant on WhatsApp</span>
                </a>
                <p className="text-[11px] text-[#6b7280]">
                  Tap to send your order receipt to {store.name} for immediate order confirmation.
                </p>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                setConfirmedOrder(null);
                closeCheckout();
              }}
              className="w-full py-2 px-3 rounded text-xs font-medium text-[#4b5563] hover:text-[#111827] bg-[#f3f4f6] hover:bg-[#e5e7eb] transition cursor-pointer"
            >
              Back to Storefront
            </button>
          </div>
        ) : (
          /* ==================================================================== */
          /* STATE B: Checkout Form */
          /* ==================================================================== */
          <div>
            {/* Header */}
            <div className="p-4 border-b border-[#e5e7eb] flex items-center justify-between">
              <div>
                <h3 className="text-base font-semibold text-[#111827]">{t('checkout.title')}</h3>
                <p className="text-[11px] text-[#6b7280]">
                  {t('checkout.subtitle')}
                </p>
              </div>
              <button
                type="button"
                onClick={closeCheckout}
                disabled={isSubmitting}
                className="w-7 h-7 rounded text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmitOrder} className="p-4 space-y-3.5 max-h-[75vh] overflow-y-auto">
              {formError && (
                <div className="p-3 rounded bg-[#fef2f2] border border-rose-200 text-[#dc2626] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{formError}</span>
                </div>
              )}

              {/* Delivery Mode Toggle */}
              <div>
                <label className="block text-xs font-medium text-[#4b5563] mb-1.5">
                  Fulfilment Method
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setDeliveryMode('DELIVERY')}
                    className={`p-2.5 rounded border text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      deliveryMode === 'DELIVERY'
                        ? 'border-[#ea580c] bg-[#fff7ed] text-[#ea580c] font-semibold'
                        : 'border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f9fafb]'
                    }`}
                  >
                    <Truck className="w-4 h-4" />
                    <span>Home Delivery</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeliveryMode('PICKUP')}
                    className={`p-2.5 rounded border text-xs font-medium flex items-center justify-center gap-1.5 transition cursor-pointer ${
                      deliveryMode === 'PICKUP'
                        ? 'border-[#ea580c] bg-[#fff7ed] text-[#ea580c] font-semibold'
                        : 'border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f9fafb]'
                    }`}
                  >
                    <Store className="w-4 h-4" />
                    <span>Store Pickup</span>
                  </button>
                </div>
              </div>

              {/* Customer Contact Information */}
              <div className="space-y-2.5">
                <div>
                  <label className="block text-xs font-medium text-[#4b5563] mb-1">
                    {t('checkout.field_name')}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    className="w-full px-2.5 py-1.5 h-9 rounded bg-white border border-[#e5e7eb] text-xs sm:text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/20 transition"
                  />
                </div>

                <div>
                  <label className="block text-xs font-medium text-[#4b5563] mb-1">
                    {t('checkout.field_phone')}
                  </label>
                  <div className="relative flex items-center font-mono-numbers">
                    <span className="absolute left-2.5 text-xs font-medium text-[#6b7280] select-none">
                      +91
                    </span>
                    <input
                      type="tel"
                      required
                      placeholder="9876543210"
                      maxLength={10}
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value.replace(/\D/g, ''))}
                      className="w-full pl-12 pr-2.5 py-1.5 h-9 rounded bg-white border border-[#e5e7eb] text-xs sm:text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/20 transition"
                    />
                  </div>
                </div>
              </div>

              {/* Delivery Address Fields (If Mode = DELIVERY) */}
              {deliveryMode === 'DELIVERY' && (
                <div className="space-y-2.5 pt-2 border-t border-[#f1f3f5]">
                  <div>
                    <label className="block text-xs font-medium text-[#4b5563] mb-1">
                      {t('checkout.field_address')}
                    </label>
                    <textarea
                      required
                      rows={2}
                      placeholder="Flat/House No., Building Name, Street, Landmark"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-2.5 py-1.5 rounded bg-white border border-[#e5e7eb] text-xs sm:text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/20 transition resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs font-medium text-[#4b5563] mb-1">
                        {t('checkout.field_city')}
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryCity}
                        onChange={(e) => setDeliveryCity(e.target.value)}
                        className="w-full px-2.5 py-1.5 h-9 rounded bg-white border border-[#e5e7eb] text-xs text-[#111827] focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-[#4b5563] mb-1">
                        {t('checkout.field_state')}
                      </label>
                      <input
                        type="text"
                        required
                        value={deliveryState}
                        onChange={(e) => setDeliveryState(e.target.value)}
                        className="w-full px-2.5 py-1.5 h-9 rounded bg-white border border-[#e5e7eb] text-xs text-[#111827] focus:outline-none focus:border-[#ea580c]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-[#4b5563] mb-1">
                      {t('checkout.field_pincode')}
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={6}
                      placeholder="e.g. 380009"
                      value={deliveryPincode}
                      onChange={(e) => setDeliveryPincode(e.target.value.replace(/\D/g, ''))}
                      className="w-full px-2.5 py-1.5 h-9 rounded bg-white border border-[#e5e7eb] text-xs text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea580c] font-mono-numbers"
                    />
                  </div>
                </div>
              )}

              {/* Customer Notes */}
              <div>
                <label className="block text-xs font-medium text-[#4b5563] mb-1">
                  Optional Notes for Merchant
                </label>
                <input
                  type="text"
                  placeholder="e.g. Please send extra spicy / Leave at gate"
                  maxLength={500}
                  value={customerNotes}
                  onChange={(e) => setCustomerNotes(e.target.value)}
                  className="w-full px-2.5 py-1.5 h-9 rounded bg-white border border-[#e5e7eb] text-xs text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea580c]"
                />
              </div>

              {/* Payment Notice */}
              <div className="p-3 rounded bg-[#f9fafb] border border-[#e5e7eb] space-y-1.5 font-mono-numbers text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#6b7280]">Payment Method:</span>
                  <span className="font-semibold text-[#111827] flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#059669]" />
                    Cash on Delivery (COD)
                  </span>
                </div>
                <div className="flex items-center justify-between pt-1 border-t border-[#f1f3f5]">
                  <span className="text-[#6b7280]">Delivery Fee:</span>
                  <span className="font-semibold text-[#059669]">FREE</span>
                </div>
                <div className="flex items-center justify-between text-sm font-semibold text-[#111827] pt-1 border-t border-[#f1f3f5]">
                  <span>Total Payable:</span>
                  <span className="text-[#ea580c]">{formatINR(subtotal)}</span>
                </div>
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 rounded font-medium text-xs sm:text-sm text-white bg-[#ea580c] hover:bg-[#c2410c] shadow-xs flex items-center justify-center gap-1.5 transition active:scale-98 disabled:opacity-50 cursor-pointer"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>{t('checkout.placing')}</span>
                  </>
                ) : (
                  <>
                    <span>{t('checkout.confirm_button')} ({formatINR(subtotal)})</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
}
