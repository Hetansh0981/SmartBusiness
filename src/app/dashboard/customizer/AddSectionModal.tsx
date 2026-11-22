'use client';

import React from 'react';
import { X, Tag, FileText, ShoppingBag, Grid, Layout } from 'lucide-react';
import type { SectionConfig } from '@/types/customizer';

interface AddSectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddSection: (newSection: SectionConfig) => void;
  existingSectionCount: number;
}

export default function AddSectionModal({
  isOpen,
  onClose,
  onAddSection,
  existingSectionCount,
}: AddSectionModalProps) {
  if (!isOpen) return null;

  const handleAdd = (type: 'promo_banner' | 'text_image' | 'category_grid' | 'product_grid') => {
    const timestamp = Date.now().toString(36).slice(-4);

    let newSection: SectionConfig;
    if (type === 'promo_banner') {
      newSection = {
        id: `sec_promo_${timestamp}`,
        type: 'promo_banner',
        enabled: true,
        props: {
          headline: 'Special Festive Discount!',
          subheadline: 'Get flat 20% off on all authentic products. Limited period offer.',
          badgeText: 'Festive Deal',
          couponCode: 'FESTIVE20',
          buttonText: 'Claim Offer',
          buttonLink: '#catalog',
          bannerStyle: 'saffron',
        },
      };
    } else if (type === 'text_image') {
      newSection = {
        id: `sec_text_image_${timestamp}`,
        type: 'text_image',
        enabled: true,
        props: {
          title: 'Handcrafted with Tradition',
          body: 'We source the freshest local ingredients and craft every product with authentic techniques passed down through generations.',
          imagePosition: 'right',
          imageUrl: null,
          buttonText: 'Learn More',
          buttonLink: null,
        },
      };
    } else if (type === 'category_grid') {
      newSection = {
        id: `sec_cat_${timestamp}`,
        type: 'category_grid',
        enabled: true,
        props: {
          title: 'Browse Collections',
          layout: 'cards',
          showItemCount: true,
        },
      };
    } else {
      newSection = {
        id: `sec_prod_${timestamp}`,
        type: 'product_grid',
        enabled: true,
        props: {
          title: 'Curated Collection',
          columns: '4',
          showSearch: false,
          showStockFilter: false,
          showDiscountBadge: true,
          showMrp: true,
        },
      };
    }

    onAddSection(newSection);
    onClose();
  };

  const templates = [
    {
      type: 'promo_banner' as const,
      title: 'Promotional Banner',
      description: 'Highlight discounts, flash sales, festive deals, or promo coupon codes.',
      icon: Tag,
      color: 'text-[#ea580c] bg-orange-50 border-orange-200',
    },
    {
      type: 'text_image' as const,
      title: 'Story & Image Block',
      description: 'Showcase your brand heritage, store photos, craft story, and highlights.',
      icon: FileText,
      color: 'text-[#059669] bg-emerald-50 border-emerald-200',
    },
    {
      type: 'category_grid' as const,
      title: 'Category Card Grid',
      description: 'Visual grid cards for your product categories with item counts.',
      icon: Grid,
      color: 'text-blue-600 bg-blue-50 border-blue-200',
    },
    {
      type: 'product_grid' as const,
      title: 'Additional Product Grid',
      description: 'Curated sub-catalog grid for specific collections or items.',
      icon: ShoppingBag,
      color: 'text-purple-600 bg-purple-50 border-purple-200',
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-xl max-w-md w-full overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-orange-100 text-[#ea580c] flex items-center justify-center">
              <Layout className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">Add New Section</h2>
              <p className="text-[11px] text-[#6b7280]">
                Choose a modular block to insert into your storefront ({existingSectionCount}/20)
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#9ca3af] hover:text-[#111827] rounded transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Section List */}
        <div className="p-4 space-y-2.5 max-h-[60vh] overflow-y-auto">
          {templates.map((tpl) => {
            const Icon = tpl.icon;
            return (
              <button
                key={tpl.type}
                type="button"
                onClick={() => handleAdd(tpl.type)}
                className="w-full text-left p-3 rounded-lg border border-[#e5e7eb] hover:border-orange-300 hover:bg-orange-50/20 transition cursor-pointer flex items-start gap-3 group"
              >
                <div className={`w-9 h-9 rounded-lg border flex items-center justify-center flex-shrink-0 ${tpl.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div>
                  <div className="text-xs font-semibold text-[#111827] group-hover:text-[#ea580c] transition-colors">
                    {tpl.title}
                  </div>
                  <div className="text-[11px] text-[#6b7280] leading-relaxed mt-0.5">
                    {tpl.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#e5e7eb] bg-[#f9fafb] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-white border border-[#e5e7eb] text-xs font-medium text-[#4b5563] hover:text-[#111827] cursor-pointer"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
