'use client';

import React, { useState, useMemo } from 'react';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { formatINR } from '@/lib/utils';
import { getValidWhatsAppUrl } from '@/lib/whatsapp';
import { updateOrderStatusAction } from './actions';
import type { Order, OrderStatus } from '@/types';
import {
  ShoppingBag,
  Search,
  Truck,
  Store,
  Clock,
  CheckCircle2,
  AlertCircle,
  X,
  MessageCircle,
  ChevronRight,
  TrendingUp,
  Loader2,
} from 'lucide-react';

interface OrdersClientViewProps {
  initialOrders: Order[];
  storeName: string;
}

const STATUS_CONFIG: Record<
  OrderStatus,
  { label: string; bg: string; text: string; border: string; dot: string }
> = {
  PENDING: {
    label: 'Pending',
    bg: 'bg-[#fffbeb]',
    text: 'text-[#d97706]',
    border: 'border-amber-200',
    dot: 'bg-[#d97706]',
  },
  CONFIRMED: {
    label: 'Confirmed',
    bg: 'bg-[#eff6ff]',
    text: 'text-[#2563eb]',
    border: 'border-blue-200',
    dot: 'bg-[#2563eb]',
  },
  PROCESSING: {
    label: 'Processing',
    bg: 'bg-[#f5f3ff]',
    text: 'text-[#7c3aed]',
    border: 'border-purple-200',
    dot: 'bg-[#7c3aed]',
  },
  READY_FOR_PICKUP: {
    label: 'Ready for Pickup',
    bg: 'bg-[#f0fdfa]',
    text: 'text-[#0d9488]',
    border: 'border-teal-200',
    dot: 'bg-[#0d9488]',
  },
  SHIPPED: {
    label: 'Shipped',
    bg: 'bg-[#eef2ff]',
    text: 'text-[#4f46e5]',
    border: 'border-indigo-200',
    dot: 'bg-[#4f46e5]',
  },
  DELIVERED: {
    label: 'Delivered',
    bg: 'bg-[#ecfdf5]',
    text: 'text-[#059669]',
    border: 'border-emerald-200',
    dot: 'bg-[#059669]',
  },
  CANCELLED: {
    label: 'Cancelled',
    bg: 'bg-[#fef2f2]',
    text: 'text-[#dc2626]',
    border: 'border-rose-200',
    dot: 'bg-[#dc2626]',
  },
};

// Permitted status transitions per state
const VALID_NEXT_STATUSES: Record<OrderStatus, OrderStatus[]> = {
  PENDING: ['CONFIRMED', 'CANCELLED'],
  CONFIRMED: ['PROCESSING', 'READY_FOR_PICKUP', 'SHIPPED', 'CANCELLED'],
  PROCESSING: ['READY_FOR_PICKUP', 'SHIPPED', 'CANCELLED'],
  READY_FOR_PICKUP: ['DELIVERED', 'CANCELLED'],
  SHIPPED: ['DELIVERED', 'CANCELLED'],
  DELIVERED: [], // Terminal
  CANCELLED: [], // Terminal
};

export default function OrdersClientView({ initialOrders, storeName }: OrdersClientViewProps) {
  const { t } = useLanguage();
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('ALL');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  // Sync state if initialOrders changes
  React.useEffect(() => {
    setOrders(initialOrders);
  }, [initialOrders]);

  // Metrics
  const metrics = useMemo(() => {
    const totalOrders = orders.length;
    const pendingOrders = orders.filter((o) => o.status === 'PENDING').length;
    const completedOrders = orders.filter((o) => o.status === 'DELIVERED').length;
    const totalSales = orders
      .filter((o) => o.status !== 'CANCELLED')
      .reduce((sum, o) => sum + Number(o.total_amount), 0);

    return { totalOrders, pendingOrders, completedOrders, totalSales };
  }, [orders]);

  // Filtering
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      // 1. Status Filter
      if (statusFilter !== 'ALL' && order.status !== statusFilter) {
        return false;
      }

      // 2. Search Query
      if (searchQuery.trim() !== '') {
        const query = searchQuery.toLowerCase();
        const matchesRef = order.order_reference.toLowerCase().includes(query);
        const matchesName = order.customer_name.toLowerCase().includes(query);
        const matchesPhone = order.customer_phone.includes(query);
        return matchesRef || matchesName || matchesPhone;
      }

      return true;
    });
  }, [orders, statusFilter, searchQuery]);

  const handleUpdateStatus = async (orderId: string, newStatus: OrderStatus) => {
    setIsUpdatingStatus(true);
    setStatusError(null);

    const res = await updateOrderStatusAction(orderId, newStatus);
    setIsUpdatingStatus(false);

    if (!res.success) {
      setStatusError(res.error || 'Failed to update order status');
      return;
    }

    // Optimistically update local state
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o))
    );

    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight flex items-center gap-2">
            <span>{t('orders.title')}</span>
            <span className="text-[11px] px-2 py-0.5 rounded-full bg-[#ffedd5] text-[#c2410c] font-medium border border-orange-200">
              Live Feed
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-[#4b5563] mt-0.5">
            {t('orders.subtitle')}
          </p>
        </div>
      </div>

      {/* 2. Bento Metrics Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#6b7280]">
              Total Orders
            </div>
            <div className="text-2xl font-semibold text-[#111827] mt-1 font-mono-numbers">{metrics.totalOrders}</div>
          </div>
          <div className="w-9 h-9 rounded bg-[#fff7ed] border border-orange-200 flex items-center justify-center text-[#ea580c]">
            <ShoppingBag className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#6b7280]">
              Pending Action
            </div>
            <div className="text-2xl font-semibold text-[#d97706] mt-1 font-mono-numbers">{metrics.pendingOrders}</div>
          </div>
          <div className="w-9 h-9 rounded bg-[#fffbeb] border border-amber-200 flex items-center justify-center text-[#d97706]">
            <Clock className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#6b7280]">
              Fulfilled Orders
            </div>
            <div className="text-2xl font-semibold text-[#059669] mt-1 font-mono-numbers">{metrics.completedOrders}</div>
          </div>
          <div className="w-9 h-9 rounded bg-[#ecfdf5] border border-emerald-200 flex items-center justify-center text-[#059669]">
            <CheckCircle2 className="w-4 h-4" />
          </div>
        </div>

        <div className="p-4 rounded-lg bg-white border border-[#e5e7eb] shadow-xs flex items-center justify-between">
          <div>
            <div className="text-xs font-medium text-[#6b7280]">
              Gross Volume
            </div>
            <div className="text-2xl font-semibold text-[#111827] mt-1 font-mono-numbers">
              {formatINR(metrics.totalSales)}
            </div>
          </div>
          <div className="w-9 h-9 rounded bg-[#ecfdf5] border border-emerald-200 flex items-center justify-center text-[#059669]">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
      </div>

      {/* 3. Search & Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder={t('orders.search_placeholder')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-8 py-1.5 h-9 rounded bg-white border border-[#e5e7eb] text-xs sm:text-sm text-[#111827] placeholder:text-[#9ca3af] focus:outline-none focus:border-[#ea580c] focus:ring-1 focus:ring-[#ea580c]/20 transition"
            />
            <Search className="w-3.5 h-3.5 text-[#9ca3af] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9ca3af] hover:text-[#111827] p-0.5"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="text-xs text-[#6b7280] self-center">
            Showing <strong className="text-[#111827] font-mono-numbers">{filteredOrders.length}</strong> of{' '}
            <span className="font-mono-numbers">{orders.length}</span> orders
          </div>
        </div>

        {/* Filter Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs select-none scrollbar-none">
          {['ALL', 'PENDING', 'CONFIRMED', 'PROCESSING', 'READY_FOR_PICKUP', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => {
            const isSelected = statusFilter === st;
            const count = st === 'ALL' ? orders.length : orders.filter((o) => o.status === st).length;

            return (
              <button
                key={st}
                type="button"
                onClick={() => setStatusFilter(st)}
                className={`px-2.5 py-1 rounded text-xs font-medium transition cursor-pointer flex items-center gap-1.5 whitespace-nowrap ${
                  isSelected
                    ? 'bg-[#ea580c] text-white shadow-xs font-semibold'
                    : 'bg-white text-[#4b5563] border border-[#e5e7eb] hover:bg-[#f9fafb]'
                }`}
              >
                <span>{st === 'ALL' ? 'All Orders' : STATUS_CONFIG[st as OrderStatus]?.label || st}</span>
                <span className={`text-[10px] px-1 py-0.2 rounded font-mono-numbers ${isSelected ? 'bg-black/20' : 'bg-[#f3f4f6]'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 4. Orders List Table / Card View */}
      {filteredOrders.length === 0 ? (
        <div className="py-16 text-center rounded-lg bg-white border border-[#e5e7eb] p-8 shadow-xs">
          <div className="w-12 h-12 rounded-lg bg-[#f9fafb] border border-[#e5e7eb] flex items-center justify-center text-[#9ca3af] mx-auto mb-3">
            <ShoppingBag className="w-6 h-6 opacity-60" />
          </div>
          <h3 className="text-sm sm:text-base font-semibold text-[#111827] mb-1">No orders found</h3>
          <p className="text-xs text-[#6b7280] max-w-sm mx-auto">
            {searchQuery || statusFilter !== 'ALL'
              ? 'Try adjusting your search query or status filter.'
              : 'When customers place orders from your public storefront, they will appear here in real-time.'}
          </p>
        </div>
      ) : (
        <div className="rounded-lg bg-white border border-[#e5e7eb] shadow-xs overflow-hidden divide-y divide-[#f1f3f5]">
          {filteredOrders.map((order) => {
            const statusCfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.PENDING;
            const itemsSummary =
              order.order_items
                ?.slice(0, 2)
                .map((i) => `${i.quantity}x ${i.product_name}`)
                .join(', ') + ((order.order_items?.length || 0) > 2 ? ' ...' : '');

            const dateStr = new Date(order.created_at).toLocaleString('en-IN', {
              day: 'numeric',
              month: 'short',
              hour: '2-digit',
              minute: '2-digit',
            });

            const customerWhatsApp = getValidWhatsAppUrl(
              order.customer_phone,
              `Hi ${order.customer_name}! This is ${storeName} regarding your order #${order.order_reference}.`
            );

            return (
              <div
                key={order.id}
                onClick={() => setSelectedOrder(order)}
                className="p-4 sm:p-4 hover:bg-[#f9fafb] transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 cursor-pointer group"
              >
                {/* Left: Reference, Customer & Mode */}
                <div className="space-y-1 flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono-numbers text-xs font-semibold text-[#ea580c] bg-[#fff7ed] px-2 py-0.5 rounded border border-orange-200">
                      {order.order_reference}
                    </span>

                    <span
                      className={`text-[11px] font-medium px-2 py-0.5 rounded border flex items-center gap-1 ${statusCfg.bg} ${statusCfg.text} ${statusCfg.border}`}
                    >
                      <span className={`w-1.5 h-1.5 rounded-full ${statusCfg.dot}`} />
                      {statusCfg.label}
                    </span>

                    <span className="text-[11px] text-[#6b7280] flex items-center gap-1 font-mono-numbers">
                      <Clock className="w-3 h-3 text-[#9ca3af]" />
                      {dateStr}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 pt-0.5">
                    <span className="font-medium text-[#111827] text-sm truncate">
                      {order.customer_name}
                    </span>
                    <span className="text-xs text-[#6b7280] font-mono-numbers">
                      +91 {order.customer_phone}
                    </span>
                    <span className="text-[#d1d5db]">&bull;</span>
                    <span className="text-[11px] font-medium text-[#4b5563] flex items-center gap-1">
                      {order.delivery_mode === 'DELIVERY' ? (
                        <>
                          <Truck className="w-3 h-3 text-[#ea580c]" /> Home Delivery
                        </>
                      ) : (
                        <>
                          <Store className="w-3 h-3 text-[#0d9488]" /> Store Pickup
                        </>
                      )}
                    </span>
                  </div>

                  {itemsSummary && (
                    <div className="text-xs text-[#6b7280] truncate">
                      <span className="text-[#9ca3af]">Items:</span> {itemsSummary}
                    </div>
                  )}
                </div>

                {/* Right: Amount & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-3 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-[#f1f3f5]">
                  <div className="text-left sm:text-right">
                    <div className="text-sm sm:text-base font-semibold text-[#111827] font-mono-numbers">
                      {formatINR(order.total_amount)}
                    </div>
                    <div className="text-[10px] font-medium text-[#6b7280] uppercase tracking-wider">
                      {order.payment_method} &bull; {order.payment_status}
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {customerWhatsApp && (
                      <a
                        href={customerWhatsApp || undefined}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={(e) => e.stopPropagation()}
                        className="w-8 h-8 rounded bg-[#ecfdf5] hover:bg-[#d1fae5] text-[#059669] border border-emerald-200 flex items-center justify-center transition"
                        title="Chat with Customer"
                      >
                        <MessageCircle className="w-4 h-4" />
                      </a>
                    )}

                    <div className="w-8 h-8 rounded bg-[#f3f4f6] group-hover:bg-[#e5e7eb] text-[#6b7280] group-hover:text-[#111827] flex items-center justify-center transition">
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* 5. Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
          <div
            onClick={() => setSelectedOrder(null)}
            className="fixed inset-0 bg-[#111827]/40 backdrop-blur-xs animate-in fade-in duration-150"
          />

          <div className="relative w-full max-w-lg bg-white border border-[#e5e7eb] rounded-lg z-10 shadow-[0_20px_25px_-5px_rgba(0,0,0,0.08),0_8px_10px_-6px_rgba(0,0,0,0.03)] overflow-hidden my-auto animate-in zoom-in-95 duration-150 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-4 sm:p-5 border-b border-[#e5e7eb] flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-semibold text-[#111827] font-mono-numbers">
                    {selectedOrder.order_reference}
                  </h3>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded border ${
                      STATUS_CONFIG[selectedOrder.status]?.bg
                    } ${STATUS_CONFIG[selectedOrder.status]?.text} ${
                      STATUS_CONFIG[selectedOrder.status]?.border
                    }`}
                  >
                    {STATUS_CONFIG[selectedOrder.status]?.label}
                  </span>
                </div>
                <p className="text-xs text-[#6b7280] mt-0.5 font-mono-numbers">
                  Placed on {new Date(selectedOrder.created_at).toLocaleString('en-IN')}
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="w-7 h-7 rounded text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] flex items-center justify-center transition cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-4 sm:p-5 space-y-4 overflow-y-auto">
              {statusError && (
                <div className="p-3 rounded bg-[#fef2f2] border border-rose-200 text-[#dc2626] text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{statusError}</span>
                </div>
              )}

              {/* Status Advance Controls */}
              <div className="p-3.5 rounded bg-[#f9fafb] border border-[#e5e7eb] space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-[#374151] uppercase tracking-wider">
                    Update Order Status
                  </span>
                  {isUpdatingStatus && <Loader2 className="w-3.5 h-3.5 animate-spin text-[#ea580c]" />}
                </div>

                {VALID_NEXT_STATUSES[selectedOrder.status].length === 0 ? (
                  <div className="text-xs text-[#6b7280] italic">
                    This order is in a terminal state ({selectedOrder.status}) and cannot transition further.
                  </div>
                ) : (
                  <div className="flex flex-wrap gap-2 pt-1">
                    {VALID_NEXT_STATUSES[selectedOrder.status].map((targetStatus) => {
                      const cfg = STATUS_CONFIG[targetStatus];
                      return (
                        <button
                          key={targetStatus}
                          type="button"
                          disabled={isUpdatingStatus}
                          onClick={() => handleUpdateStatus(selectedOrder.id, targetStatus)}
                          className={`px-2.5 py-1 rounded text-xs font-medium transition flex items-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-50 ${
                            targetStatus === 'CANCELLED'
                              ? 'bg-[#fef2f2] hover:bg-[#fee2e2] text-[#dc2626] border border-rose-200'
                              : 'bg-white hover:bg-[#f9fafb] text-[#ea580c] border border-orange-200 shadow-xs'
                          }`}
                        >
                          <span>Mark as {cfg.label}</span>
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Customer Information Box */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider">
                  Customer &amp; Fulfilment
                </h4>

                <div className="p-3.5 rounded bg-white border border-[#e5e7eb] space-y-2.5 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="text-[#6b7280]">Customer Name:</span>
                    <span className="font-medium text-[#111827]">{selectedOrder.customer_name}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6b7280]">Phone Number:</span>
                    <div className="flex items-center gap-2">
                      <span className="font-mono-numbers text-[#111827] font-medium">
                        +91 {selectedOrder.customer_phone}
                      </span>
                      {getValidWhatsAppUrl(selectedOrder.customer_phone, '') && (
                        <a
                          href={
                            getValidWhatsAppUrl(
                              selectedOrder.customer_phone,
                              `Hi ${selectedOrder.customer_name}! Regarding your order ${selectedOrder.order_reference} on ${storeName}:`
                            ) || undefined
                          }
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-2 py-0.5 rounded bg-[#ecfdf5] text-[#059669] hover:bg-[#d1fae5] font-medium text-[11px] flex items-center gap-1 border border-emerald-200"
                        >
                          <MessageCircle className="w-3 h-3" /> WhatsApp
                        </a>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[#6b7280]">Delivery Mode:</span>
                    <span className="font-medium text-[#111827]">
                      {selectedOrder.delivery_mode === 'DELIVERY' ? 'Home Delivery' : 'Store Pickup'}
                    </span>
                  </div>

                  {selectedOrder.delivery_mode === 'DELIVERY' && selectedOrder.delivery_address && (
                    <div className="pt-2 border-t border-[#f1f3f5] space-y-0.5">
                      <span className="text-[#6b7280] block">Delivery Address:</span>
                      <p className="text-[#111827] font-medium leading-relaxed">
                        {selectedOrder.delivery_address}, {selectedOrder.delivery_city},{' '}
                        {selectedOrder.delivery_state} - {selectedOrder.delivery_pincode}
                      </p>
                    </div>
                  )}

                  {selectedOrder.customer_notes && (
                    <div className="pt-2 border-t border-[#f1f3f5] space-y-0.5">
                      <span className="text-[#6b7280] block">Customer Notes:</span>
                      <p className="text-[#b45309] italic">{selectedOrder.customer_notes}</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Order Items Snapshots */}
              <div className="space-y-1.5">
                <h4 className="text-xs font-semibold text-[#4b5563] uppercase tracking-wider">
                  Order Items ({selectedOrder.order_items?.length || 0})
                </h4>

                <div className="rounded bg-white border border-[#e5e7eb] overflow-hidden divide-y divide-[#f1f3f5]">
                  {selectedOrder.order_items?.map((item) => (
                    <div key={item.id} className="p-3 flex items-center justify-between text-xs">
                      <div>
                        <div className="font-medium text-[#111827]">{item.product_name}</div>
                        <div className="text-[11px] text-[#6b7280] font-mono-numbers">
                          {formatINR(item.price)} &times; {item.quantity}
                        </div>
                      </div>
                      <div className="font-semibold text-[#111827] text-xs font-mono-numbers">
                        {formatINR(item.total)}
                      </div>
                    </div>
                  ))}

                  {/* Totals Breakdown */}
                  <div className="p-3.5 bg-[#f9fafb] space-y-1.5 text-xs font-mono-numbers">
                    <div className="flex items-center justify-between text-[#6b7280]">
                      <span>Subtotal</span>
                      <span className="font-medium text-[#111827]">
                        {formatINR(selectedOrder.subtotal)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-[#6b7280]">
                      <span>Delivery Fee</span>
                      <span className="font-medium text-[#059669]">
                        {Number(selectedOrder.delivery_fee) === 0
                          ? 'FREE'
                          : formatINR(selectedOrder.delivery_fee)}
                      </span>
                    </div>
                    <div className="pt-2 border-t border-[#e5e7eb] flex items-center justify-between text-sm font-semibold text-[#111827]">
                      <span>Total Amount</span>
                      <span className="text-base text-[#ea580c]">
                        {formatINR(selectedOrder.total_amount)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
