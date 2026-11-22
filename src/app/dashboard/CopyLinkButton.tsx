'use client';

import { useState } from 'react';
import { Button } from '@/components/ui';
import { Copy, Check } from 'lucide-react';

export default function CopyLinkButton({ slug }: { slug: string }) {
  const [copied, setCopied] = useState(false);

  const fullUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/store/${slug}`
    : `https://dukaanos.in/store/${slug}`;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(fullUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
    }
  };

  return (
    <Button
      variant={copied ? 'secondary' : 'primary'}
      size="sm"
      onClick={handleCopy}
      className={
        copied
          ? 'text-[#059669] border-emerald-200 bg-[#ecfdf5]'
          : ''
      }
    >
      {copied ? (
        <>
          <Check className="w-3.5 h-3.5 text-[#059669]" />
          <span>Link Copied</span>
        </>
      ) : (
        <>
          <Copy className="w-3.5 h-3.5" />
          <span>Copy Store Link</span>
        </>
      )}
    </Button>
  );
}
