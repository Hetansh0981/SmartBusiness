'use client';

import React, { useState } from 'react';
import {
  Layers,
  Palette,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  Plus,
  Trash2,
  Layout,
  Tag,
  FileText,
  ShoppingBag,
  Grid,
} from 'lucide-react';
import ThemeTokensPanel from './ThemeTokensPanel';
import AddSectionModal from './AddSectionModal';
import type { StorefrontConfig, SectionConfig, ThemeTokens } from '@/types/customizer';

interface LeftPanelProps {
  config: StorefrontConfig;
  activeSectionId: string | null;
  onSelectSection: (sectionId: string) => void;
  onReorderSections: (newSections: SectionConfig[]) => void;
  onUpdateSection: (updated: SectionConfig) => void;
  onDeleteSection: (sectionId: string) => void;
  onAddSection: (newSection: SectionConfig) => void;
  onUpdateTheme: (updatedTheme: ThemeTokens) => void;
}

export default function LeftPanel({
  config,
  activeSectionId,
  onSelectSection,
  onReorderSections,
  onUpdateSection,
  onDeleteSection,
  onAddSection,
  onUpdateTheme,
}: LeftPanelProps) {
  const [activeTab, setActiveTab] = useState<'sections' | 'theme'>('sections');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  const getSectionIcon = (type: SectionConfig['type']) => {
    switch (type) {
      case 'header':
      case 'footer':
        return Layout;
      case 'hero':
        return Layout;
      case 'category_grid':
        return Grid;
      case 'product_grid':
        return ShoppingBag;
      case 'promo_banner':
        return Tag;
      case 'text_image':
        return FileText;
      default:
        return Layout;
    }
  };

  const getSectionTitle = (sec: SectionConfig) => {
    switch (sec.type) {
      case 'header':
        return 'Header Navigation';
      case 'hero':
        return `Hero: ${sec.props.headline || 'Banner'}`;
      case 'category_grid':
        return sec.props.title || 'Category Grid';
      case 'product_grid':
        return sec.props.title || 'Product Grid';
      case 'promo_banner':
        return sec.props.headline ? `Promo: ${sec.props.headline}` : 'Promotional Banner';
      case 'text_image':
        return sec.props.title ? `Story: ${sec.props.title}` : 'Story & Image';
      case 'footer':
        return 'Store Footer';
      default:
        return (sec as any).id || 'Section';
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= config.sections.length) return;

    const updated = [...config.sections];
    const [moved] = updated.splice(index, 1);
    updated.splice(targetIndex, 0, moved);
    onReorderSections(updated);
  };

  return (
    <aside className="w-72 border-r border-[#e5e7eb] bg-white flex flex-col h-full shadow-xs">
      {/* Tab Switcher */}
      <div className="flex border-b border-[#e5e7eb] bg-[#f9fafb]">
        <button
          type="button"
          onClick={() => setActiveTab('sections')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
            activeTab === 'sections'
              ? 'border-[#ea580c] text-[#ea580c] bg-white'
              : 'border-transparent text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Sections</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('theme')}
          className={`flex-1 py-2.5 text-xs font-semibold flex items-center justify-center gap-1.5 border-b-2 transition cursor-pointer ${
            activeTab === 'theme'
              ? 'border-[#ea580c] text-[#ea580c] bg-white'
              : 'border-transparent text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          <span>Theme Styling</span>
        </button>
      </div>

      {/* Tab Body */}
      <div className="flex-1 overflow-y-auto">
        {activeTab === 'theme' ? (
          <ThemeTokensPanel theme={config.theme} onChange={onUpdateTheme} />
        ) : (
          <div className="p-3 space-y-1.5">
            {config.sections.map((sec, idx) => {
              const Icon = getSectionIcon(sec.type);
              const isSelected = activeSectionId === sec.id;
              const isMandatory = sec.type === 'header' || sec.type === 'footer';

              return (
                <div
                  key={sec.id}
                  className={`group flex items-center justify-between p-2 rounded-lg border text-xs transition ${
                    isSelected
                      ? 'border-[#ea580c] bg-orange-50/40 text-[#111827] shadow-xs'
                      : 'border-[#e5e7eb] bg-white text-[#374151] hover:bg-[#f9fafb]'
                  } ${!sec.enabled ? 'opacity-60 bg-gray-50' : ''}`}
                >
                  {/* Left: Reorder & Title */}
                  <div
                    className="flex items-center gap-2 flex-1 min-w-0 cursor-pointer"
                    onClick={() => onSelectSection(sec.id)}
                  >
                    <Icon className={`w-3.5 h-3.5 flex-shrink-0 ${isSelected ? 'text-[#ea580c]' : 'text-[#6b7280]'}`} />
                    <span className="truncate font-medium text-[11px] sm:text-xs">
                      {getSectionTitle(sec)}
                    </span>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-0.5 ml-2">
                    {/* Reorder Buttons */}
                    <button
                      type="button"
                      disabled={idx === 0}
                      onClick={() => moveSection(idx, 'up')}
                      className="p-1 text-[#9ca3af] hover:text-[#111827] disabled:opacity-20 cursor-pointer"
                      title="Move Up"
                    >
                      <ChevronUp className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={idx === config.sections.length - 1}
                      onClick={() => moveSection(idx, 'down')}
                      className="p-1 text-[#9ca3af] hover:text-[#111827] disabled:opacity-20 cursor-pointer"
                      title="Move Down"
                    >
                      <ChevronDown className="w-3 h-3" />
                    </button>

                    {/* Hide / Show Toggle (Mandatory sections cannot be hidden) */}
                    {!isMandatory ? (
                      <button
                        type="button"
                        onClick={() => onUpdateSection({ ...sec, enabled: !sec.enabled })}
                        className="p-1 text-[#9ca3af] hover:text-[#111827] cursor-pointer"
                        title={sec.enabled ? 'Hide Section' : 'Show Section'}
                      >
                        {sec.enabled ? <Eye className="w-3 h-3" /> : <EyeOff className="w-3 h-3 text-amber-500" />}
                      </button>
                    ) : null}

                    {/* Delete Section */}
                    {!isMandatory ? (
                      <button
                        type="button"
                        onClick={() => onDeleteSection(sec.id)}
                        className="p-1 text-[#9ca3af] hover:text-red-600 cursor-pointer"
                        title="Delete Section"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    ) : null}
                  </div>
                </div>
              );
            })}

            {/* Add Section Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={() => setIsAddModalOpen(true)}
                disabled={config.sections.length >= 20}
                className="w-full py-2 px-3 rounded-lg border border-dashed border-[#d1d5db] hover:border-[#ea580c] hover:bg-orange-50/20 text-[#ea580c] text-xs font-semibold flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-50"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Section</span>
              </button>
            </div>
          </div>
        )}
      </div>

      <AddSectionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddSection={onAddSection}
        existingSectionCount={config.sections.length}
      />
    </aside>
  );
}
