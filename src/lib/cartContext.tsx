'use client';

import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import type { CartItem, Product } from '@/types';

interface CartContextValue {
  items: CartItem[];
  subtotal: number;
  itemCount: number;
  addToCart: (product: Product, qty?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  isCheckoutOpen: boolean;
  openCheckout: () => void;
  closeCheckout: () => void;
  getItemQuantity: (productId: string) => number;
}

const CartContext = createContext<CartContextValue | null>(null);

interface CartProviderProps {
  children: React.ReactNode;
  storeId?: string;
  isMemoryOnly?: boolean;
  initialItems?: CartItem[];
}

export function CartProvider({
  children,
  storeId = 'default',
  isMemoryOnly = false,
  initialItems = [],
}: CartProviderProps) {
  const [items, setItems] = useState<CartItem[]>(initialItems);
  const [isMounted, setIsMounted] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState(false);

  const storageKey = useMemo(() => `dukaanos_cart_${storeId}`, [storeId]);

  // 1. Hydrate from localStorage once mounted (skip if memory-only)
  useEffect(() => {
    setIsMounted(true);
    if (isMemoryOnly) return;
    try {
      const stored = localStorage.getItem(storageKey);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setItems(parsed);
        }
      }
    } catch {
      // Ignore parse/storage errors
    }
  }, [storageKey, isMemoryOnly]);

  // 2. Persist to localStorage whenever items change (client-only, skip if memory-only)
  useEffect(() => {
    if (!isMounted || isMemoryOnly) return;
    try {
      localStorage.setItem(storageKey, JSON.stringify(items));
    } catch {
      // Ignore quota/storage errors
    }
  }, [items, storageKey, isMounted, isMemoryOnly]);

  // Computed values
  const subtotal = useMemo(() => {
    return items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  }, [items]);

  const itemCount = useMemo(() => {
    return items.reduce((acc, item) => acc + item.quantity, 0);
  }, [items]);

  const getItemQuantity = useCallback(
    (productId: string) => {
      const item = items.find((i) => i.productId === productId);
      return item ? item.quantity : 0;
    },
    [items]
  );

  const addToCart = useCallback(
    (product: Product, qty = 1) => {
      if (!product.in_stock) return;

      setItems((prev) => {
        const existingIndex = prev.findIndex((i) => i.productId === product.id);
        if (existingIndex > -1) {
          const updated = [...prev];
          const newQty = Math.min(100, updated[existingIndex].quantity + qty);
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: newQty,
          };
          return updated;
        } else {
          return [
            ...prev,
            {
              productId: product.id,
              name: product.name,
              price: product.price,
              imageUrl: product.image_url,
              quantity: Math.min(100, Math.max(1, qty)),
            },
          ];
        }
      });
    },
    []
  );

  const updateQuantity = useCallback((productId: string, quantity: number) => {
    setItems((prev) => {
      if (quantity <= 0) {
        return prev.filter((i) => i.productId !== productId);
      }
      return prev.map((item) =>
        item.productId === productId ? { ...item, quantity: Math.min(100, quantity) } : item
      );
    });
  }, []);

  const removeFromCart = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.productId !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
    if (isMemoryOnly) return;
    try {
      localStorage.removeItem(storageKey);
    } catch {
      // Ignore
    }
  }, [storageKey, isMemoryOnly]);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const openCheckout = useCallback(() => {
    setIsDrawerOpen(false);
    setIsCheckoutOpen(true);
  }, []);
  const closeCheckout = useCallback(() => setIsCheckoutOpen(false), []);

  return (
    <CartContext.Provider
      value={{
        items,
        subtotal,
        itemCount,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        isCheckoutOpen,
        openCheckout,
        closeCheckout,
        getItemQuantity,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
