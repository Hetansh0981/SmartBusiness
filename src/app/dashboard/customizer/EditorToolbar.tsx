'use client';

import React from 'react';
import Link from 'next/link';
import {
  ArrowLeft,
  Undo2,
  Redo2,
  Monitor,
  Tablet,
  Smartphone,
  History,
  ExternalLink,
  Check,
  Loader2,
  Sparkles,
} from 'lucide-react';
import type { PublicStore } from '@/types';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface EditorToolbarProps {
  store: PublicStore;
  viewport: 'desktop' | 'tablet' | 'mobile';
  setViewport: (v: 'desktop' | 'tablet' | 'mobile') => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  isDirty: boolean;
  isSaving: boolean;
  isPublishing: boolean;
  onSaveDraft: () => Promise<void>;
  onPublish: () => Promise<void>;
  onOpenHistory: () => void;
  onOpenAiDrawer: () => void;
  version: number;
}

export default function EditorToolbar({
  store,
  viewport,
  setViewport,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  isDirty,
  isSaving,
  isPublishing,
  onSaveDraft,
  onPublish,
  onOpenHistory,
  onOpenAiDrawer,
  version,
}: EditorToolbarProps) {
  const { t } = useLanguage();

  return (
    <header className="h-14 border-b border-[#e5e7eb] bg-white px-3 sm:px-4 flex items-center justify-between gap-2 sm:gap-3 flex-shrink-0 z-30 shadow-xs">
      {/* Left: Navigation & Store State */}
      <div className="flex items-center gap-2 sm:gap-3">
        <Link
          href="/dashboard"
          className="p-1.5 rounded hover:bg-[#f3f4f6] text-[#6b7280] hover:text-[#111827] transition cursor-pointer"
          title="Back to Merchant Dashboard"
        >
          <ArrowLeft className="w-4 h-4" />
        </Link>

        <div className="flex items-center gap-1.5">
          <span className="text-xs sm:text-sm font-bold text-[#111827] truncate max-w-[120px] sm:max-w-[180px]">
            {store.name}
          </span>
          <span className="text-[#d1d5db]">/</span>
          <span className="text-xs text-[#6b7280] font-medium hidden md:inline">
            {t('customizer.title', 'Storefront Customizer')}
          </span>
        </div>

        {/* Saved / Unsaved Status Pill */}
        <div className="hidden xs:block ml-1">
          {isSaving ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 text-[11px] font-medium border border-blue-200">
              <Loader2 className="w-3 h-3 animate-spin" />
              <span>{t('common.saving', 'Saving...')}</span>
            </span>
          ) : isDirty ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-amber-50 text-amber-700 text-[11px] font-medium border border-amber-200">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              <span>{t('customizer.unsaved_changes', 'Unsaved Draft')}</span>
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200">
              <Check className="w-3 h-3" />
              <span>{t('customizer.all_saved', 'Draft Saved')}</span>
            </span>
          )}
        </div>
      </div>

      {/* Center: Viewport & Undo/Redo Controls */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Undo / Redo */}
        <div className="flex items-center bg-[#f9fafb] border border-[#e5e7eb] rounded p-0.5">
          <button
            type="button"
            disabled={!canUndo}
            onClick={onUndo}
            title={`${t('customizer.undo', 'Undo')} (Ctrl+Z)`}
            className="p-1.5 rounded text-[#4b5563] hover:text-[#111827] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            disabled={!canRedo}
            onClick={onRedo}
            title={`${t('customizer.redo', 'Redo')} (Ctrl+Shift+Z)`}
            className="p-1.5 rounded text-[#4b5563] hover:text-[#111827] hover:bg-white disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="h-4 w-px bg-[#e5e7eb] mx-0.5 hidden sm:block" />

        {/* Viewport Switcher (Desktop, Tablet, Mobile) */}
        <div className="flex items-center bg-[#f9fafb] border border-[#e5e7eb] rounded p-0.5">
          <button
            type="button"
            onClick={() => setViewport('desktop')}
            className={`p-1.5 rounded flex items-center gap-1 text-xs font-medium transition cursor-pointer ${
              viewport === 'desktop'
                ? 'bg-white text-[#ea580c] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
            title={t('customizer.viewport_desktop', 'Desktop View')}
          >
            <Monitor className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Desktop</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('tablet')}
            className={`p-1.5 rounded flex items-center gap-1 text-xs font-medium transition cursor-pointer ${
              viewport === 'tablet'
                ? 'bg-white text-[#ea580c] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
            title={t('customizer.viewport_tablet', 'Tablet (768px)')}
          >
            <Tablet className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Tablet</span>
          </button>

          <button
            type="button"
            onClick={() => setViewport('mobile')}
            className={`p-1.5 rounded flex items-center gap-1 text-xs font-medium transition cursor-pointer ${
              viewport === 'mobile'
                ? 'bg-white text-[#ea580c] shadow-xs'
                : 'text-[#6b7280] hover:text-[#111827]'
            }`}
            title={t('customizer.viewport_mobile', 'Mobile (375px)')}
          >
            <Smartphone className="w-3.5 h-3.5" />
            <span className="hidden lg:inline">Mobile</span>
          </button>
        </div>
      </div>

      {/* Right: AI Designer Trigger, Language, History & Save/Publish Actions */}
      <div className="flex items-center gap-1.5 sm:gap-2">
        {/* Prominent AI Designer Trigger Button */}
        <button
          type="button"
          onClick={onOpenAiDrawer}
          className="inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-gradient-to-r from-orange-50 to-amber-50 border border-orange-200 text-xs font-bold text-[#ea580c] hover:border-orange-300 transition cursor-pointer shadow-xs active:scale-98"
          title="Open AI Storefront Designer"
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ea580c] animate-pulse" />
          <span className="hidden sm:inline">{t('ai.title', 'AI Designer')}</span>
        </button>

        {/* Language Switcher */}
        <LanguageSwitcher scope="merchant" variant="pill" />

        {/* Version History Button */}
        <button
          type="button"
          onClick={onOpenHistory}
          className="hidden md:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-xs font-medium text-[#4b5563] hover:text-[#111827] transition cursor-pointer shadow-xs"
        >
          <History className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>v{version > 0 ? version : 0}</span>
        </button>

        {/* Live Public Link */}
        <a
          href={`/store/${store.slug}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hidden xl:inline-flex items-center gap-1 px-2.5 py-1.5 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-xs font-medium text-[#4b5563] hover:text-[#111827] transition shadow-xs"
          title="Open Live Public Store in New Tab"
        >
          <span>{t('nav.view_storefront', 'Live Store')}</span>
          <ExternalLink className="w-3 h-3" />
        </a>

        {/* Save Draft Button */}
        <button
          type="button"
          disabled={isSaving || isPublishing}
          onClick={onSaveDraft}
          className="px-2.5 sm:px-3 py-1.5 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-xs font-semibold text-[#111827] transition cursor-pointer shadow-xs disabled:opacity-50"
        >
          {t('customizer.save_draft', 'Save Draft')}
        </button>

        {/* Publish Button */}
        <button
          type="button"
          disabled={isSaving || isPublishing}
          onClick={onPublish}
          className="px-3 sm:px-4 py-1.5 rounded bg-[#ea580c] hover:bg-[#c2410c] text-white text-xs font-semibold shadow-xs transition cursor-pointer flex items-center gap-1.5 disabled:opacity-50"
        >
          {isPublishing ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Check className="w-3.5 h-3.5" />
          )}
          <span>{t('customizer.publish', 'Publish')}</span>
        </button>
      </div>
    </header>
  );
}
