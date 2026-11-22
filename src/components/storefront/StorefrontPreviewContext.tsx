'use client';

import React, { createContext, useContext, useState, useMemo, useCallback } from 'react';
import type { CartItem } from '@/types';

interface PreviewContextValue {
  isEditorPreview: boolean;
  activeSectionId: string | null;
  onSelectSection?: (sectionId: string) => void;
  onInterceptAction: (actionName: string) => void;
}

const StorefrontPreviewContext = createContext<PreviewContextValue>({
  isEditorPreview: false,
  activeSectionId: null,
  onSelectSection: undefined,
  onInterceptAction: () => {},
});

export const useStorefrontPreview = () => useContext(StorefrontPreviewContext);

export function StorefrontPreviewProvider({
  isEditorPreview,
  activeSectionId = null,
  onSelectSection,
  onInterceptAction,
  children,
}: {
  isEditorPreview: boolean;
  activeSectionId?: string | null;
  onSelectSection?: (sectionId: string) => void;
  onInterceptAction?: (actionName: string) => void;
  children: React.ReactNode;
}) {
  const handleIntercept = useCallback(
    (actionName: string) => {
      if (onInterceptAction) {
        onInterceptAction(actionName);
      }
    },
    [onInterceptAction]
  );

  return (
    <StorefrontPreviewContext.Provider
      value={{
        isEditorPreview,
        activeSectionId,
        onSelectSection,
        onInterceptAction: handleIntercept,
      }}
    >
      <div
        className="w-full relative"
        onClickCapture={(e) => {
          if (!isEditorPreview) return;
          const target = e.target as HTMLElement;

          // Check if an anchor or action button was clicked
          const anchor = target.closest('a');
          if (anchor) {
            e.preventDefault();
            e.stopPropagation();
            handleIntercept(`Navigation to ${anchor.getAttribute('href') || 'link'} intercepted`);
            return;
          }

          // Check if clicking inside a selectable section
          const sectionEl = target.closest('[data-section-id]');
          if (sectionEl && onSelectSection) {
            const secId = sectionEl.getAttribute('data-section-id');
            if (secId) {
              onSelectSection(secId);
            }
          }
        }}
        onSubmitCapture={(e) => {
          if (!isEditorPreview) return;
          e.preventDefault();
          e.stopPropagation();
          handleIntercept('Checkout or Form submission intercepted in preview mode');
        }}
        onKeyDownCapture={(e) => {
          if (!isEditorPreview) return;
          // Trap Enter / Space on links or forms to prevent submission
          if (e.key === 'Enter' || e.key === ' ') {
            const target = e.target as HTMLElement;
            if (target.tagName === 'A' || target.tagName === 'FORM') {
              e.preventDefault();
              e.stopPropagation();
              handleIntercept('Keyboard trigger intercepted in preview mode');
            }
          }
        }}
      >
        {children}
      </div>
    </StorefrontPreviewContext.Provider>
  );
}

import { CartProvider } from '@/lib/cartContext';

/**
 * Memory-Only Cart Provider for Editor Preview
 * Delegates to the unified CartProvider with isMemoryOnly={true}.
 * Guarantees zero reads/writes to localStorage and zero real order creations.
 */
export const PreviewCartContext = createContext<any>(null);

export function StorefrontPreviewCartProvider({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider isMemoryOnly storeId="customizer-preview">
      {children}
    </CartProvider>
  );
}
