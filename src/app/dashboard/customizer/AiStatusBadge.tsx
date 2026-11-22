'use client';

import React from 'react';
import type { SafeProviderStatus } from '@/lib/ai/types';
import { Sparkles, Bot, AlertCircle, Clock } from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AiStatusBadgeProps {
  status: SafeProviderStatus | null;
  className?: string;
}

export default function AiStatusBadge({ status, className = '' }: AiStatusBadgeProps) {
  const { t } = useLanguage();
  const mode = status?.mode || 'basic';

  if (mode === 'ai') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[#059669] text-[11px] font-semibold ${className}`}
        title={`Generative AI Active: Model ${status?.model || 'Gemini'}`}
      >
        <span className="w-1.5 h-1.5 rounded-full bg-[#059669] animate-pulse" />
        <Sparkles className="w-3 h-3 text-[#059669]" />
        <span>{t('ai.mode_ai', 'AI Mode (Gemini)')}</span>
      </div>
    );
  }

  if (mode === 'rate_limited') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-amber-50 border border-amber-200 text-[#d97706] text-[11px] font-semibold ${className}`}
        title="Hourly or daily AI request limit reached. Falling back to Basic Templates."
      >
        <Clock className="w-3 h-3 text-[#d97706]" />
        <span>{t('ai.mode_rate_limited', 'AI Rate Limited')}</span>
      </div>
    );
  }

  if (mode === 'unavailable') {
    return (
      <div
        className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-rose-50 border border-rose-200 text-[#e11d48] text-[11px] font-semibold ${className}`}
        title="AI service temporarily offline or timed out. Falling back to Basic Templates."
      >
        <AlertCircle className="w-3 h-3 text-[#e11d48]" />
        <span>{t('ai.mode_unavailable', 'AI Offline')}</span>
      </div>
    );
  }

  // Basic Mode
  return (
    <div
      className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-[#f3f4f6] border border-[#e5e7eb] text-[#4b5563] text-[11px] font-semibold ${className}`}
      title="Basic Mode: Add GEMINI_API_KEY in .env.local to enable Real AI Generation"
    >
      <Bot className="w-3 h-3 text-[#6b7280]" />
      <span>{t('ai.mode_basic', 'Basic Mode (Templates)')}</span>
    </div>
  );
}
