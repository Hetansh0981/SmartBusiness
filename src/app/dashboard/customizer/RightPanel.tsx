'use client';

import React from 'react';
import { Settings, Trash2, Eye, EyeOff, X } from 'lucide-react';
import HeaderInspector from './inspectors/HeaderInspector';
import HeroInspector from './inspectors/HeroInspector';
import CategoryGridInspector from './inspectors/CategoryGridInspector';
import ProductGridInspector from './inspectors/ProductGridInspector';
import PromoBannerInspector from './inspectors/PromoBannerInspector';
import TextImageInspector from './inspectors/TextImageInspector';
import FooterInspector from './inspectors/FooterInspector';
import type { SectionConfig } from '@/types/customizer';

interface RightPanelProps {
  activeSection: SectionConfig | null;
  onUpdateSection: (updated: SectionConfig) => void;
  onDeleteSection: (sectionId: string) => void;
  onClose: () => void;
}

export default function RightPanel({
  activeSection,
  onUpdateSection,
  onDeleteSection,
  onClose,
}: RightPanelProps) {
  if (!activeSection) {
    return (
      <aside className="w-80 border-l border-[#e5e7eb] bg-white flex flex-col items-center justify-center p-6 text-center text-[#9ca3af]">
        <div className="w-10 h-10 rounded-full bg-[#f3f4f6] flex items-center justify-center mb-3 text-[#9ca3af]">
          <Settings className="w-5 h-5 opacity-60" />
        </div>
        <h3 className="text-xs font-semibold text-[#111827] mb-1">No Section Selected</h3>
        <p className="text-[11px] text-[#6b7280] leading-relaxed max-w-[200px]">
          Click any section in the left panel or directly on the canvas to configure its settings.
        </p>
      </aside>
    );
  }

  const isMandatory = activeSection.type === 'header' || activeSection.type === 'footer';

  const sectionTypeLabels: Record<SectionConfig['type'], string> = {
    header: 'Header Navigation',
    hero: 'Hero Banner',
    category_grid: 'Category Grid',
    product_grid: 'Product Grid',
    promo_banner: 'Promo Banner',
    text_image: 'Story & Image',
    footer: 'Store Footer',
  };

  const renderInspector = () => {
    switch (activeSection.type) {
      case 'header':
        return <HeaderInspector section={activeSection} onChange={onUpdateSection} />;
      case 'hero':
        return <HeroInspector section={activeSection} onChange={onUpdateSection} />;
      case 'category_grid':
        return <CategoryGridInspector section={activeSection} onChange={onUpdateSection} />;
      case 'product_grid':
        return <ProductGridInspector section={activeSection} onChange={onUpdateSection} />;
      case 'promo_banner':
        return <PromoBannerInspector section={activeSection} onChange={onUpdateSection} />;
      case 'text_image':
        return <TextImageInspector section={activeSection} onChange={onUpdateSection} />;
      case 'footer':
        return <FooterInspector section={activeSection} onChange={onUpdateSection} />;
      default:
        return null;
    }
  };

  return (
    <aside className="w-80 border-l border-[#e5e7eb] bg-white flex flex-col h-full shadow-xs">
      {/* Header */}
      <div className="px-4 py-3 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#ea580c]">
            Section Settings
          </span>
          <h3 className="text-xs font-bold text-[#111827]">
            {sectionTypeLabels[activeSection.type]}
          </h3>
        </div>

        <div className="flex items-center gap-1">
          {/* Hide/Show Toggle */}
          {!isMandatory && (
            <button
              type="button"
              onClick={() => onUpdateSection({ ...activeSection, enabled: !activeSection.enabled })}
              title={activeSection.enabled ? 'Hide section' : 'Show section'}
              className="p-1 rounded text-[#6b7280] hover:text-[#111827] hover:bg-[#f3f4f6] cursor-pointer"
            >
              {activeSection.enabled ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5 text-amber-500" />}
            </button>
          )}

          {/* Delete Button */}
          {!isMandatory && (
            <button
              type="button"
              onClick={() => onDeleteSection(activeSection.id)}
              title="Delete section"
              className="p-1 rounded text-[#dc2626] hover:bg-red-50 cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#9ca3af] hover:text-[#111827] rounded transition cursor-pointer"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Inspector Body */}
      <div className="p-4 overflow-y-auto flex-1">
        {renderInspector()}
      </div>
    </aside>
  );
}
