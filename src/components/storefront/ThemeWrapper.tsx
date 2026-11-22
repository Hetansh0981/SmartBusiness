'use client';

import React from 'react';
import type { ThemeTokens } from '@/types/customizer';

interface ThemeWrapperProps {
  theme: ThemeTokens;
  children: React.ReactNode;
}

export default function ThemeWrapper({ theme, children }: ThemeWrapperProps) {
  // Map border radius token to CSS values
  const radiusMap: Record<ThemeTokens['borderRadius'], string> = {
    none: '0px',
    sm: '4px',
    md: '8px',
    lg: '16px',
    full: '9999px',
  };

  const fontFamilyMap: Record<ThemeTokens['fontFamily'], string> = {
    Geist: 'var(--font-geist-sans), system-ui, sans-serif',
    Inter: 'Inter, system-ui, sans-serif',
    Poppins: 'Poppins, system-ui, sans-serif',
    Playfair: '"Playfair Display", Georgia, serif',
    'DM Sans': '"DM Sans", system-ui, sans-serif',
  };

  // Map button style to button border radius
  const buttonRadiusMap: Record<ThemeTokens['buttonStyle'], string> = {
    sharp: '0px',
    rounded: radiusMap[theme.borderRadius] === '9999px' ? '8px' : radiusMap[theme.borderRadius] || '8px',
    pill: '9999px',
  };

  const cssVariables = {
    '--theme-primary': theme.primaryColor,
    '--theme-secondary': theme.secondaryColor,
    '--theme-bg': theme.backgroundColor,
    '--theme-text': theme.textColor,
    '--theme-radius': radiusMap[theme.borderRadius] || '8px',
    '--theme-button-radius': buttonRadiusMap[theme.buttonStyle] || '8px',
    '--theme-font': fontFamilyMap[theme.fontFamily] || 'system-ui, sans-serif',
  } as React.CSSProperties;

  return (
    <div
      style={cssVariables}
      className="w-full min-h-screen transition-colors duration-200"
      style-font={theme.fontFamily}
    >
      <div style={{ backgroundColor: theme.backgroundColor, color: theme.textColor, fontFamily: 'var(--theme-font)' }}>
        {children}
      </div>
    </div>
  );
}
