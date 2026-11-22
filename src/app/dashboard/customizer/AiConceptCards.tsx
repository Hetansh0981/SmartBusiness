'use client';

import React from 'react';
import type { DesignConcept } from '@/lib/ai/types';
import { Sparkles, Check, ArrowRight, Palette, Layers } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AiConceptCardsProps {
  concepts: DesignConcept[];
  selectedConceptId?: string | null;
  onSelectConcept: (concept: DesignConcept) => void;
  isApplying?: boolean;
}

export default function AiConceptCards({
  concepts,
  selectedConceptId,
  onSelectConcept,
  isApplying = false,
}: AiConceptCardsProps) {
  const { t } = useLanguage();

  if (!concepts || concepts.length === 0) return null;

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between text-xs font-semibold text-[#111827]">
        <span className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>{t('ai.stage_concepts', 'Creative Design Concepts')}</span>
        </span>
        <span className="text-[10px] text-[#6b7280]">Select one to apply</span>
      </div>

      <div className="grid grid-cols-1 gap-2.5">
        {concepts.map((concept, idx) => {
          const isSelected = selectedConceptId === concept.id;

          return (
            <div
              key={concept.id || idx}
              className={`p-3 rounded-xl border transition-all duration-200 relative group text-xs ${
                isSelected
                  ? 'border-[#ea580c] bg-orange-50/20 ring-1 ring-[#ea580c] shadow-xs'
                  : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:shadow-xs'
              }`}
            >
              {/* Concept Header */}
              <div className="flex items-start justify-between gap-2 mb-2">
                <div>
                  <div className="font-bold text-[#111827] text-sm flex items-center gap-1.5">
                    <span>{concept.name}</span>
                    {isSelected && (
                      <span className="px-1.5 py-0.2 rounded-full bg-[#ea580c] text-white text-[9px] font-bold">
                        Applied
                      </span>
                    )}
                  </div>
                  <div className="text-[11px] text-[#ea580c] font-medium mt-0.5">
                    {concept.tagline}
                  </div>
                </div>

                {/* Color Swatch Pill */}
                <div className="flex items-center gap-1 bg-[#f9fafb] p-1 rounded-lg border border-[#e5e7eb] shadow-2xs">
                  <div
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: concept.colorPalette.primary }}
                    title={`Primary: ${concept.colorPalette.primary}`}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: concept.colorPalette.secondary }}
                    title={`Secondary: ${concept.colorPalette.secondary}`}
                  />
                  <div
                    className="w-4 h-4 rounded-full border border-black/10"
                    style={{ backgroundColor: concept.colorPalette.background }}
                    title={`Background: ${concept.colorPalette.background}`}
                  />
                </div>
              </div>

              {/* Design Philosophy */}
              <p className="text-[11px] text-[#4b5563] leading-relaxed mb-2.5">
                {concept.philosophy}
              </p>

              {/* Badges: Typography & Button Geometry */}
              <div className="flex flex-wrap items-center gap-1.5 text-[10px] text-[#4b5563] mb-3">
                <span className="px-2 py-0.5 rounded-md bg-[#f3f4f6] font-medium border border-[#e5e7eb]">
                  Font: <strong>{concept.typography}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#f3f4f6] font-medium border border-[#e5e7eb] capitalize">
                  Buttons: <strong>{concept.buttonStyle}</strong>
                </span>
                <span className="px-2 py-0.5 rounded-md bg-[#f3f4f6] font-medium border border-[#e5e7eb] capitalize">
                  Radius: <strong>{concept.borderRadius}</strong>
                </span>
              </div>

              {/* Apply Action Button */}
              <button
                type="button"
                disabled={isApplying}
                onClick={() => onSelectConcept(concept)}
                className={`w-full py-1.5 px-3 rounded-lg font-semibold text-xs transition flex items-center justify-center gap-1.5 cursor-pointer shadow-xs active:scale-98 ${
                  isSelected
                    ? 'bg-[#ecfdf5] border border-emerald-300 text-[#059669]'
                    : 'bg-[#ea580c] hover:bg-[#c2410c] text-white'
                }`}
              >
                {isSelected ? (
                  <>
                    <Check className="w-3.5 h-3.5" />
                    <span>Applied to Store Preview</span>
                  </>
                ) : (
                  <>
                    <span>{t('ai.btn_apply', 'Apply Concept to Store')}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
