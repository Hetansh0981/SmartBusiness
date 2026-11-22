'use client';

import React from 'react';
import Link from 'next/link';
import { AlertCircle, RotateCcw, ArrowLeft } from 'lucide-react';

export default function StoreError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/20 flex items-center justify-center mx-auto mb-6 text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>

        <h1 className="text-xl sm:text-2xl font-bold text-white mb-2">
          Unable to Load Storefront
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 leading-relaxed">
          We experienced a temporary glitch while retrieving this store&apos;s catalog. Please try reloading the page.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-white/[0.08] hover:bg-white/[0.12] text-white font-bold text-xs transition flex items-center justify-center gap-2 cursor-pointer border border-white/[0.1]"
          >
            <RotateCcw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>DukaanOS Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
