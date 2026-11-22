import React from 'react';

export default function StoreLoading() {
  return (
    <div className="min-h-screen bg-[#07090e] text-slate-100 flex flex-col animate-pulse">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-white/[0.08] px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-white/[0.06]" />
          <div className="space-y-1.5">
            <div className="w-32 h-4 rounded-md bg-white/[0.08]" />
            <div className="w-20 h-3 rounded-md bg-white/[0.04]" />
          </div>
        </div>
        <div className="w-24 h-8 rounded-xl bg-white/[0.06]" />
      </div>

      {/* Hero Skeleton */}
      <div className="pt-10 pb-8 px-4 text-center border-b border-white/[0.06]">
        <div className="w-28 h-5 rounded-full bg-white/[0.06] mx-auto mb-3" />
        <div className="w-64 sm:w-80 h-8 rounded-xl bg-white/[0.08] mx-auto mb-3" />
        <div className="w-48 h-4 rounded-md bg-white/[0.04] mx-auto" />
      </div>

      {/* Catalog Skeleton */}
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-8 py-6 space-y-6">
        {/* Search Bar Skeleton */}
        <div className="w-full max-w-md h-10 rounded-2xl bg-white/[0.04]" />

        {/* Category Pills Skeleton */}
        <div className="flex gap-2">
          <div className="w-20 h-7 rounded-xl bg-white/[0.06]" />
          <div className="w-24 h-7 rounded-xl bg-white/[0.04]" />
          <div className="w-28 h-7 rounded-xl bg-white/[0.04]" />
        </div>

        {/* Product Cards Skeleton Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-5">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-3xl bg-[#0c1017] border border-white/[0.06] overflow-hidden"
            >
              <div className="h-48 w-full bg-white/[0.03]" />
              <div className="p-4 space-y-3">
                <div className="w-16 h-4 rounded bg-white/[0.06]" />
                <div className="w-40 h-5 rounded bg-white/[0.08]" />
                <div className="w-24 h-6 rounded bg-white/[0.06]" />
                <div className="w-full h-10 rounded-xl bg-white/[0.04]" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
