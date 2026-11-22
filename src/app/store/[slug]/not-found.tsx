import React from 'react';
import Link from 'next/link';
import { Store, ArrowLeft } from 'lucide-react';

export default function StoreNotFound() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col items-center justify-center p-6 text-center">
      {/* Background Glow */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-[radial-gradient(ellipse_at_center,_rgba(249,115,22,0.15),_transparent_70%)] blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto">
        <div className="w-16 h-16 rounded-2xl bg-[#0c1017] border border-white/[0.08] flex items-center justify-center mx-auto mb-6 text-orange-400 shadow-[0_0_20px_rgba(255,92,0,0.2)]">
          <Store className="w-8 h-8 opacity-70" />
        </div>

        <span className="text-xs font-bold text-orange-400 uppercase tracking-widest px-3 py-1 rounded-full bg-orange-500/10 border border-orange-500/20 mb-4 inline-block">
          404 &bull; Store Unavailable
        </span>

        <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight mt-2 mb-3">
          Shop Not Found
        </h1>

        <p className="text-xs sm:text-sm text-slate-400 mb-8 leading-relaxed">
          The storefront you are looking for does not exist, has changed its web address, or is currently unpublished by the shop owner.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold text-xs shadow-md hover:shadow-[0_0_20px_rgba(255,92,0,0.4)] transition flex items-center justify-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go to DukaanOS Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
