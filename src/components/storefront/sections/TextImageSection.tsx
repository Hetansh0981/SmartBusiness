'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';
import { useStorefrontPreview } from '@/components/storefront/StorefrontPreviewContext';
import type { TextImageSectionProps, ThemeTokens } from '@/types/customizer';

interface TextImageSectionComponentProps {
  id: string;
  props: TextImageSectionProps;
  theme: ThemeTokens;
}

export default function TextImageSection({
  id,
  props,
  theme,
}: TextImageSectionComponentProps) {
  const { isEditorPreview, activeSectionId } = useStorefrontPreview();
  const isSelected = isEditorPreview && activeSectionId === id;

  const isLeft = props.imagePosition === 'left';

  return (
    <section
      data-section-id={id}
      className={`my-8 p-6 sm:p-10 bg-white border border-[#e5e7eb] shadow-xs rounded-lg transition-all duration-200 ${
        isSelected ? 'ring-2 ring-[#ea580c] ring-offset-2' : ''
      }`}
      style={{ borderRadius: 'var(--theme-radius, 8px)' }}
    >
      <div className={`flex flex-col ${isLeft ? 'md:flex-row-reverse' : 'md:flex-row'} items-center gap-8 lg:gap-12`}>
        {/* Text Content */}
        <div className="flex-1 space-y-3 text-left">
          <div
            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-semibold border"
            style={{
              backgroundColor: 'rgba(234, 88, 12, 0.08)',
              color: theme.primaryColor,
              borderColor: 'rgba(234, 88, 12, 0.2)',
            }}
          >
            <Sparkles className="w-3 h-3" />
            <span>Store Story</span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-[#111827] tracking-tight">
            {props.title}
          </h2>

          <p className="text-xs sm:text-sm text-[#4b5563] leading-relaxed whitespace-pre-line">
            {props.body}
          </p>

          {props.buttonText && props.buttonLink && (
            <div className="pt-2">
              <Link
                href={props.buttonLink}
                className="inline-flex items-center gap-1.5 px-4 py-2 text-white font-medium text-xs transition shadow-xs cursor-pointer hover:opacity-95"
                style={{
                  backgroundColor: theme.primaryColor,
                  borderRadius: 'var(--theme-button-radius, var(--theme-radius, 8px))',
                }}
              >
                <span>{props.buttonText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          )}
        </div>

        {/* Image / Illustration */}
        <div className="w-full md:w-1/2 flex justify-center">
          {props.imageUrl ? (
            <div className="relative w-full aspect-4/3 rounded-lg overflow-hidden border border-[#e5e7eb] shadow-xs bg-[#f9fafb]">
              <Image
                src={props.imageUrl}
                alt={props.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                unoptimized
              />
            </div>
          ) : (
            <div className="w-full aspect-4/3 rounded-lg border border-dashed border-[#d1d5db] bg-[#f9fafb] flex flex-col items-center justify-center p-6 text-center text-[#9ca3af]">
              <Sparkles className="w-8 h-8 mb-2 opacity-50" />
              <div className="text-xs font-medium">Add an image in section settings</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
