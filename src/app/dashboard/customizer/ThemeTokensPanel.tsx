'use client';

import React, { useState } from 'react';
import {
  Sparkles,
  Palette,
  Check,
  Wand2,
  ShoppingBag,
  MessageCircle,
  Type,
  Square,
  Layers,
  ArrowRight,
  RefreshCw,
} from 'lucide-react';
import type { ThemeTokens } from '@/types/customizer';

interface ThemeTokensPanelProps {
  theme: ThemeTokens;
  onChange: (updated: ThemeTokens) => void;
}

export interface CuratedThemePreset {
  id: string;
  name: string;
  category: string;
  description: string;
  tokens: ThemeTokens;
}

export const CURATED_THEMES: CuratedThemePreset[] = [
  {
    id: 'amber-editorial',
    name: 'Amber & White Editorial',
    category: 'Claude Design System',
    description: 'Warm cream canvas with rich amber primary CTAs, dark product surface contrast, and editorial typography.',
    tokens: {
      primaryColor: '#d97706',
      secondaryColor: '#181715',
      backgroundColor: '#faf9f5',
      textColor: '#141413',
      fontFamily: 'Playfair',
      buttonStyle: 'rounded',
      borderRadius: 'md',
      sectionSpacing: 'spacious',
    },
  },
  {
    id: 'modern-saffron',
    name: 'Modern Saffron',
    category: 'Retail & Kirana',
    description: 'Vibrant warm saffron with clean emerald accents and friendly Poppins typography.',
    tokens: {
      primaryColor: '#ea580c',
      secondaryColor: '#059669',
      backgroundColor: '#ffffff',
      textColor: '#111827',
      fontFamily: 'Poppins',
      buttonStyle: 'rounded',
      borderRadius: 'md',
      sectionSpacing: 'normal',
    },
  },
  {
    id: 'emerald-ayurveda',
    name: 'Emerald Ayurveda',
    category: 'Organic & Wellness',
    description: 'Fresh herbal emerald with amber accents and soft organic pill buttons.',
    tokens: {
      primaryColor: '#059669',
      secondaryColor: '#d97706',
      backgroundColor: '#f8faf8',
      textColor: '#0f291e',
      fontFamily: 'DM Sans',
      buttonStyle: 'pill',
      borderRadius: 'full',
      sectionSpacing: 'normal',
    },
  },
  {
    id: 'royal-silk',
    name: 'Royal Silk & Bridal',
    category: 'Jewelry & Sarees',
    description: 'Luxurious violet with warm gold accents and elegant Playfair serif typography.',
    tokens: {
      primaryColor: '#7c3aed',
      secondaryColor: '#d97706',
      backgroundColor: '#fffdfa',
      textColor: '#1e1b4b',
      fontFamily: 'Playfair',
      buttonStyle: 'rounded',
      borderRadius: 'sm',
      sectionSpacing: 'spacious',
    },
  },
  {
    id: 'rose-boutique',
    name: 'Rose Boutique',
    category: 'Fashion & Cosmetics',
    description: 'Gentle rose red with soft pink blush background and pill button geometry.',
    tokens: {
      primaryColor: '#e11d48',
      secondaryColor: '#be185d',
      backgroundColor: '#fff1f2',
      textColor: '#4c0519',
      fontFamily: 'Poppins',
      buttonStyle: 'pill',
      borderRadius: 'lg',
      sectionSpacing: 'normal',
    },
  },
  {
    id: 'midnight-slate',
    name: 'Midnight Slate',
    category: 'Tech & Gadgets',
    description: 'Striking amber gold over deep dark slate with sharp geometric modern edges.',
    tokens: {
      primaryColor: '#f59e0b',
      secondaryColor: '#ea580c',
      backgroundColor: '#0f172a',
      textColor: '#f8fafc',
      fontFamily: 'Inter',
      buttonStyle: 'sharp',
      borderRadius: 'none',
      sectionSpacing: 'normal',
    },
  },
  {
    id: 'minimal-studio',
    name: 'Minimal Studio',
    category: 'Apparel & Design',
    description: 'Monochromatic sharp modernism with Swiss-precision Geist typography.',
    tokens: {
      primaryColor: '#18181b',
      secondaryColor: '#71717a',
      backgroundColor: '#ffffff',
      textColor: '#09090b',
      fontFamily: 'Geist',
      buttonStyle: 'sharp',
      borderRadius: 'sm',
      sectionSpacing: 'spacious',
    },
  },
  {
    id: 'indigo-commerce',
    name: 'Indigo Commerce',
    category: 'Hardware & Auto',
    description: 'Trustworthy corporate indigo with cyan accents and balanced retail structure.',
    tokens: {
      primaryColor: '#2563eb',
      secondaryColor: '#0891b2',
      backgroundColor: '#f8fafc',
      textColor: '#0f172a',
      fontFamily: 'Inter',
      buttonStyle: 'rounded',
      borderRadius: 'md',
      sectionSpacing: 'normal',
    },
  },
  {
    id: 'artisanal-warmth',
    name: 'Artisan Cafe',
    category: 'Cafe & Bakery',
    description: 'Warm roasted amber with cozy cream backdrop and editorial serif typography.',
    tokens: {
      primaryColor: '#92400e',
      secondaryColor: '#ea580c',
      backgroundColor: '#fffbeb',
      textColor: '#451a03',
      fontFamily: 'Playfair',
      buttonStyle: 'rounded',
      borderRadius: 'md',
      sectionSpacing: 'normal',
    },
  },
];

export default function ThemeTokensPanel({ theme, onChange }: ThemeTokensPanelProps) {
  const [activeTab, setActiveTab] = useState<'presets' | 'buttons' | 'colors' | 'ai'>('presets');
  const [aiPrompt, setAiPrompt] = useState('');
  const [aiReasoning, setAiReasoning] = useState<string | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const updateTheme = (partial: Partial<ThemeTokens>) => {
    onChange({
      ...theme,
      ...partial,
    });
  };

  const primaryPresets = [
    { label: 'Saffron', hex: '#ea580c' },
    { label: 'Emerald', hex: '#059669' },
    { label: 'Royal Blue', hex: '#2563eb' },
    { label: 'Rose Pink', hex: '#e11d48' },
    { label: 'Amber Gold', hex: '#d97706' },
    { label: 'Charcoal', hex: '#1e293b' },
    { label: 'Violet', hex: '#7c3aed' },
    { label: 'Warm Roast', hex: '#92400e' },
  ];

  // Helper to test if a preset matches the current theme
  const isPresetActive = (presetTokens: ThemeTokens) => {
    return (
      presetTokens.primaryColor.toLowerCase() === theme.primaryColor.toLowerCase() &&
      presetTokens.fontFamily === theme.fontFamily &&
      presetTokens.buttonStyle === theme.buttonStyle &&
      presetTokens.backgroundColor.toLowerCase() === theme.backgroundColor.toLowerCase()
    );
  };

  // AI Theme Synthesis Engine (Simulates Gemini-assisted brand synthesis)
  const handleGenerateAiTheme = (promptText: string) => {
    if (!promptText.trim()) return;
    setIsGenerating(true);
    setAiReasoning(null);

    setTimeout(() => {
      const p = promptText.toLowerCase();
      let synthesized: ThemeTokens;
      let reason: string;

      if (p.includes('sweet') || p.includes('diwali') || p.includes('festive') || p.includes('mithai')) {
        synthesized = {
          primaryColor: '#d97706',
          secondaryColor: '#ea580c',
          backgroundColor: '#fffdf7',
          textColor: '#291804',
          fontFamily: 'Playfair',
          buttonStyle: 'rounded',
          borderRadius: 'lg',
          sectionSpacing: 'normal',
        };
        reason = 'Synthesized a festive Indian holiday palette: warm celebratory saffron-gold with artisanal Playfair serif and welcoming rounded buttons.';
      } else if (p.includes('jewelry') || p.includes('gold') || p.includes('silver') || p.includes('bridal') || p.includes('luxury')) {
        synthesized = {
          primaryColor: '#7c3aed',
          secondaryColor: '#d97706',
          backgroundColor: '#faf5ff',
          textColor: '#1e1b4b',
          fontFamily: 'Playfair',
          buttonStyle: 'rounded',
          borderRadius: 'sm',
          sectionSpacing: 'spacious',
        };
        reason = 'Synthesized a royal bridal boutique aesthetic: regal purple and heritage gold with spacious editorial layout.';
      } else if (p.includes('organic') || p.includes('farm') || p.includes('dairy') || p.includes('veg') || p.includes('ayurveda')) {
        synthesized = {
          primaryColor: '#059669',
          secondaryColor: '#16a34a',
          backgroundColor: '#f6fbf7',
          textColor: '#062d1b',
          fontFamily: 'DM Sans',
          buttonStyle: 'pill',
          borderRadius: 'full',
          sectionSpacing: 'normal',
        };
        reason = 'Synthesized an organic wellness profile: pure botanic greens with friendly capsule pills and clean DM Sans typography.';
      } else if (p.includes('tech') || p.includes('gaming') || p.includes('phone') || p.includes('gadget') || p.includes('electric')) {
        synthesized = {
          primaryColor: '#f59e0b',
          secondaryColor: '#3b82f6',
          backgroundColor: '#0f172a',
          textColor: '#f8fafc',
          fontFamily: 'Inter',
          buttonStyle: 'sharp',
          borderRadius: 'none',
          sectionSpacing: 'normal',
        };
        reason = 'Synthesized a high-performance tech dark mode: high-contrast amber CTA over midnight slate with sharp geometric angles.';
      } else if (p.includes('cafe') || p.includes('coffee') || p.includes('bakery') || p.includes('cake')) {
        synthesized = {
          primaryColor: '#92400e',
          secondaryColor: '#ea580c',
          backgroundColor: '#fffbeb',
          textColor: '#451a03',
          fontFamily: 'Playfair',
          buttonStyle: 'rounded',
          borderRadius: 'md',
          sectionSpacing: 'normal',
        };
        reason = 'Synthesized an artisanal roastery warmth: espresso browns with warm cream backdrop and handcrafted serif typography.';
      } else {
        synthesized = {
          primaryColor: '#ea580c',
          secondaryColor: '#059669',
          backgroundColor: '#ffffff',
          textColor: '#111827',
          fontFamily: 'Poppins',
          buttonStyle: 'rounded',
          borderRadius: 'md',
          sectionSpacing: 'normal',
        };
        reason = `Synthesized a balanced modern commerce identity for "${promptText}" tailored for maximum trust and mobile readability.`;
      }

      onChange(synthesized);
      setAiReasoning(reason);
      setIsGenerating(false);
    }, 400);
  };

  // Button radius visual mapping for the button preview
  const buttonRadiusPreview =
    theme.buttonStyle === 'pill'
      ? '9999px'
      : theme.buttonStyle === 'sharp'
      ? '0px'
      : theme.borderRadius === 'full'
      ? '9999px'
      : theme.borderRadius === 'lg'
      ? '16px'
      : theme.borderRadius === 'sm'
      ? '4px'
      : theme.borderRadius === 'none'
      ? '0px'
      : '8px';

  return (
    <div className="space-y-4 p-3 text-xs">
      {/* Navigation Sub-Tabs */}
      <div className="flex items-center gap-1 p-1 bg-[#f3f4f6] rounded-lg">
        <button
          type="button"
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1 px-2 rounded-md font-semibold text-[11px] transition flex items-center justify-center gap-1 ${
            activeTab === 'presets'
              ? 'bg-white text-[#111827] shadow-xs'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <Palette className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>Themes</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('buttons')}
          className={`flex-1 py-1 px-2 rounded-md font-semibold text-[11px] transition flex items-center justify-center gap-1 ${
            activeTab === 'buttons'
              ? 'bg-white text-[#111827] shadow-xs'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <Square className="w-3.5 h-3.5 text-[#2563eb]" />
          <span>Buttons</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('colors')}
          className={`flex-1 py-1 px-2 rounded-md font-semibold text-[11px] transition flex items-center justify-center gap-1 ${
            activeTab === 'colors'
              ? 'bg-white text-[#111827] shadow-xs'
              : 'text-[#6b7280] hover:text-[#111827]'
          }`}
        >
          <Type className="w-3.5 h-3.5 text-[#059669]" />
          <span>Styles</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-1 px-2 rounded-md font-semibold text-[11px] transition flex items-center justify-center gap-1 ${
            activeTab === 'ai'
              ? 'bg-white text-[#ea580c] shadow-xs'
              : 'text-[#6b7280] hover:text-[#ea580c]'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-[#ea580c]" />
          <span>AI Vibe</span>
        </button>
      </div>

      {/* TAB 1: CURATED THEMES SELECTION */}
      {activeTab === 'presets' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-[#111827]">Curated Store Themes</span>
            <span className="text-[10px] text-[#6b7280]">1-Click Switch</span>
          </div>

          <div className="grid grid-cols-1 gap-2 max-h-[380px] overflow-y-auto pr-1">
            {CURATED_THEMES.map((preset) => {
              const active = isPresetActive(preset.tokens);
              return (
                <div
                  key={preset.id}
                  onClick={() => onChange(preset.tokens)}
                  className={`p-2.5 rounded-lg border transition-all cursor-pointer relative group ${
                    active
                      ? 'border-[#ea580c] bg-orange-50/30 ring-1 ring-[#ea580c]'
                      : 'border-[#e5e7eb] bg-white hover:border-[#d1d5db] hover:shadow-xs'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <div>
                      <div className="font-semibold text-[#111827] flex items-center gap-1.5 text-xs">
                        <span>{preset.name}</span>
                        {active && (
                          <span className="px-1.5 py-0.2 rounded-full bg-[#ea580c] text-white text-[9px] font-bold">
                            Active
                          </span>
                        )}
                      </div>
                      <div className="text-[10px] text-[#6b7280]">{preset.category}</div>
                    </div>

                    {/* Color Swatch Preview */}
                    <div className="flex items-center gap-1 bg-[#f3f4f6] p-1 rounded-md border border-[#e5e7eb]">
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.tokens.primaryColor }}
                        title={`Primary: ${preset.tokens.primaryColor}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.tokens.secondaryColor }}
                        title={`Secondary: ${preset.tokens.secondaryColor}`}
                      />
                      <div
                        className="w-4 h-4 rounded-full border border-black/10 shadow-xs"
                        style={{ backgroundColor: preset.tokens.backgroundColor }}
                        title={`Background: ${preset.tokens.backgroundColor}`}
                      />
                    </div>
                  </div>

                  <p className="text-[11px] text-[#4b5563] leading-relaxed line-clamp-2">
                    {preset.description}
                  </p>

                  <div className="mt-2 pt-2 border-t border-[#f3f4f6] flex items-center justify-between text-[10px] text-[#6b7280]">
                    <span>Font: {preset.tokens.fontFamily}</span>
                    <span className="capitalize">Button: {preset.tokens.buttonStyle}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: BUTTONS CUSTOMISABILITY */}
      {activeTab === 'buttons' && (
        <div className="space-y-4">
          <div>
            <label className="block font-semibold text-[#111827] mb-1.5">
              Button Shape &amp; Geometry
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              {(
                [
                  { style: 'sharp', label: 'Sharp (0px)', desc: 'Modern & Bold' },
                  { style: 'rounded', label: 'Rounded (8px)', desc: 'Standard Retail' },
                  { style: 'pill', label: 'Pill (Full)', desc: 'Friendly Capsule' },
                ] as const
              ).map((btn) => (
                <button
                  key={btn.style}
                  type="button"
                  onClick={() => updateTheme({ buttonStyle: btn.style })}
                  className={`p-2 text-center border rounded-lg transition cursor-pointer ${
                    theme.buttonStyle === btn.style
                      ? 'border-[#ea580c] bg-orange-50/50 text-[#ea580c] font-semibold'
                      : 'border-[#e5e7eb] bg-white text-[#4b5563] hover:bg-[#f9fafb]'
                  }`}
                >
                  <div className="text-xs font-semibold">{btn.label}</div>
                  <div className="text-[10px] opacity-75">{btn.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Interactive Button Preview Card */}
          <div className="p-3 rounded-lg border border-[#e5e7eb] bg-[#f9fafb] space-y-2.5">
            <div className="font-semibold text-[11px] text-[#4b5563] uppercase tracking-wider">
              Live Button Preview
            </div>

            {/* Primary Action Button */}
            <div className="flex flex-col gap-2">
              <button
                type="button"
                className="w-full py-2 px-3 font-semibold text-white shadow-xs flex items-center justify-center gap-2 transition active:scale-98 cursor-default"
                style={{
                  backgroundColor: theme.primaryColor,
                  borderRadius: buttonRadiusPreview,
                  fontFamily: `var(--theme-font, inherit)`,
                }}
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Cart — ₹199</span>
              </button>

              {/* Secondary WhatsApp Button */}
              <button
                type="button"
                className="w-full py-1.5 px-3 font-medium bg-[#ecfdf5] border border-emerald-200 text-[#059669] flex items-center justify-center gap-1.5 transition cursor-default"
                style={{
                  borderRadius: buttonRadiusPreview,
                  fontFamily: `var(--theme-font, inherit)`,
                }}
              >
                <MessageCircle className="w-3.5 h-3.5" />
                <span>Order on WhatsApp</span>
              </button>
            </div>

            <div className="text-[10px] text-[#6b7280] italic text-center">
              Active shape: <strong className="capitalize">{theme.buttonStyle}</strong> ({buttonRadiusPreview})
            </div>
          </div>

          {/* Card Border Radius Setting */}
          <div className="pt-2 border-t border-[#f3f4f6]">
            <label className="block font-semibold text-[#111827] mb-1.5">
              Card &amp; Container Corner Radius
            </label>
            <select
              value={theme.borderRadius}
              onChange={(e) => updateTheme({ borderRadius: e.target.value as ThemeTokens['borderRadius'] })}
              className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
            >
              <option value="none">None (0px - Sharp Corners)</option>
              <option value="sm">Small (4px - Subtle)</option>
              <option value="md">Medium (8px - Balanced Retail)</option>
              <option value="lg">Large (16px - Soft Organic)</option>
              <option value="full">Full (Capsule Enclosures)</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB 3: COLORS & STYLES (DETAILED TOKENS) */}
      {activeTab === 'colors' && (
        <div className="space-y-4">
          {/* Primary Accent Color */}
          <div>
            <label className="block font-semibold text-[#111827] mb-1">
              Primary Brand Color
            </label>
            <div className="flex items-center gap-2 mb-2">
              <input
                type="color"
                value={theme.primaryColor}
                onChange={(e) => updateTheme({ primaryColor: e.target.value })}
                className="w-7 h-7 rounded border border-[#e5e7eb] cursor-pointer p-0 bg-transparent"
              />
              <input
                type="text"
                value={theme.primaryColor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('#') && val.length <= 7) {
                    updateTheme({ primaryColor: val });
                  }
                }}
                maxLength={7}
                className="w-24 px-2 py-1 rounded border border-[#e5e7eb] text-xs font-mono uppercase bg-white text-[#111827]"
              />
            </div>

            {/* Quick Swatches */}
            <div className="flex flex-wrap gap-1.5">
              {primaryPresets.map((preset) => (
                <button
                  key={preset.hex}
                  type="button"
                  onClick={() => updateTheme({ primaryColor: preset.hex })}
                  title={preset.label}
                  className={`w-5 h-5 rounded-full border transition-transform cursor-pointer ${
                    theme.primaryColor.toLowerCase() === preset.hex.toLowerCase()
                      ? 'scale-110 ring-2 ring-[#ea580c] ring-offset-1 border-white'
                      : 'border-black/10 hover:scale-105'
                  }`}
                  style={{ backgroundColor: preset.hex }}
                />
              ))}
            </div>
          </div>

          {/* Secondary Color */}
          <div className="pt-2 border-t border-[#f3f4f6]">
            <label className="block font-semibold text-[#111827] mb-1">
              Secondary / Trust Accent
            </label>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={theme.secondaryColor}
                onChange={(e) => updateTheme({ secondaryColor: e.target.value })}
                className="w-7 h-7 rounded border border-[#e5e7eb] cursor-pointer p-0 bg-transparent"
              />
              <input
                type="text"
                value={theme.secondaryColor}
                onChange={(e) => {
                  const val = e.target.value;
                  if (val.startsWith('#') && val.length <= 7) {
                    updateTheme({ secondaryColor: val });
                  }
                }}
                maxLength={7}
                className="w-24 px-2 py-1 rounded border border-[#e5e7eb] text-xs font-mono uppercase bg-white text-[#111827]"
              />
            </div>
          </div>

          {/* Typography Font Family */}
          <div className="pt-2 border-t border-[#f3f4f6]">
            <label className="block font-semibold text-[#111827] mb-1">
              Typography Font
            </label>
            <select
              value={theme.fontFamily}
              onChange={(e) => updateTheme({ fontFamily: e.target.value as ThemeTokens['fontFamily'] })}
              className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
            >
              <option value="Geist">Geist (Modern Clean Sans)</option>
              <option value="Inter">Inter (Neutral Precision)</option>
              <option value="Poppins">Poppins (Friendly Geometric)</option>
              <option value="Playfair">Playfair Display (Elegant Serif)</option>
              <option value="DM Sans">DM Sans (Minimalist Contemporary)</option>
            </select>
          </div>

          {/* Section Vertical Spacing */}
          <div className="pt-2 border-t border-[#f3f4f6]">
            <label className="block font-semibold text-[#111827] mb-1">
              Section Spacing
            </label>
            <select
              value={theme.sectionSpacing}
              onChange={(e) => updateTheme({ sectionSpacing: e.target.value as ThemeTokens['sectionSpacing'] })}
              className="w-full px-2.5 py-1.5 rounded border border-[#e5e7eb] bg-white text-[#111827] focus:outline-none focus:border-[#ea580c]"
            >
              <option value="compact">Compact (High Item Density)</option>
              <option value="normal">Normal (Balanced Retail)</option>
              <option value="spacious">Spacious (Editorial Boutique)</option>
            </select>
          </div>
        </div>
      )}

      {/* TAB 4: AI THEME PERSONALIZATION ASSISTANT */}
      {activeTab === 'ai' && (
        <div className="space-y-3">
          <div className="p-3 rounded-lg border border-orange-200 bg-gradient-to-br from-orange-50/60 to-amber-50/40">
            <div className="flex items-center gap-1.5 font-semibold text-[#ea580c] mb-1">
              <Sparkles className="w-4 h-4 text-[#ea580c]" />
              <span>DukaanOS AI Theme Personalizer</span>
            </div>
            <p className="text-[11px] text-[#4b5563] leading-relaxed">
              Describe your store type, festival, or brand vibe. AI will craft a custom palette, typography, and button architecture.
            </p>
          </div>

          {/* Prompt Input */}
          <div>
            <label className="block font-semibold text-[#111827] mb-1">
              Describe your business vibe or festival:
            </label>
            <div className="relative">
              <textarea
                value={aiPrompt}
                onChange={(e) => setAiPrompt(e.target.value)}
                placeholder="e.g. Diwali festive sweets shop with royal gold accents..."
                rows={2}
                className="w-full px-2.5 py-1.5 rounded-lg border border-[#e5e7eb] text-xs bg-white text-[#111827] focus:outline-none focus:border-[#ea580c] resize-none"
              />
            </div>
          </div>

          {/* One-Click Prompt Suggestions */}
          <div>
            <div className="text-[10px] text-[#6b7280] font-medium mb-1">Quick Suggestions:</div>
            <div className="flex flex-wrap gap-1">
              {[
                '🪔 Diwali Sweets',
                '💎 Royal Jewelry',
                '🌿 Organic Farm',
                '📱 Tech Gadgets',
                '☕ Artisan Cafe',
                '👗 Ethnic Wear',
              ].map((chip) => (
                <button
                  key={chip}
                  type="button"
                  onClick={() => {
                    setAiPrompt(chip);
                    handleGenerateAiTheme(chip);
                  }}
                  className="px-2 py-0.5 rounded-full border border-[#e5e7eb] bg-white text-[10px] text-[#4b5563] hover:border-[#ea580c] hover:text-[#ea580c] transition cursor-pointer"
                >
                  {chip}
                </button>
              ))}
            </div>
          </div>

          {/* Generate Button */}
          <button
            type="button"
            disabled={!aiPrompt.trim() || isGenerating}
            onClick={() => handleGenerateAiTheme(aiPrompt)}
            className="w-full py-2 px-3 rounded-lg font-semibold text-xs text-white bg-[#ea580c] hover:bg-[#c2410c] disabled:opacity-50 transition flex items-center justify-center gap-1.5 shadow-xs cursor-pointer"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                <span>Synthesizing Theme Tokens...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-3.5 h-3.5" />
                <span>Generate &amp; Apply AI Theme</span>
              </>
            )}
          </button>

          {/* AI Reasoning Note */}
          {aiReasoning && (
            <div className="p-2.5 rounded-md border border-emerald-200 bg-[#ecfdf5] text-[11px] text-[#065f46] animate-in fade-in duration-200">
              <div className="font-semibold flex items-center gap-1 mb-0.5">
                <Check className="w-3 h-3 text-[#059669]" />
                <span>AI Palette Applied</span>
              </div>
              <p className="text-[10px] leading-relaxed opacity-90">{aiReasoning}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
