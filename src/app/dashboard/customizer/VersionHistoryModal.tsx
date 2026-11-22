'use client';

import React from 'react';
import { History, RotateCcw, X, CheckCircle2, Calendar } from 'lucide-react';
import type { StoreCustomizationVersion } from '@/types/customizer';

interface VersionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  versions: StoreCustomizationVersion[];
  currentVersion: number;
  onRollback: (targetVersion: number) => Promise<void>;
  isRollingBack: boolean;
}

export default function VersionHistoryModal({
  isOpen,
  onClose,
  versions,
  currentVersion,
  onRollback,
  isRollingBack,
}: VersionHistoryModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-xl max-w-lg w-full max-h-[80vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-5 py-4 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded bg-orange-100 text-[#ea580c] flex items-center justify-center">
              <History className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-[#111827]">Version History</h2>
              <p className="text-[11px] text-[#6b7280]">
                Retaining the latest {Math.min(50, versions.length)} published snapshots
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1 text-[#9ca3af] hover:text-[#111827] rounded transition cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Versions List */}
        <div className="p-5 overflow-y-auto space-y-2.5 flex-1 divide-y divide-[#f3f4f6]">
          {versions.length === 0 ? (
            <div className="py-8 text-center text-xs text-[#6b7280]">
              No published version history available yet.
            </div>
          ) : (
            versions.map((ver) => {
              const isCurrent = ver.version === currentVersion;
              const date = new Date(ver.created_at).toLocaleString('en-IN', {
                dateStyle: 'medium',
                timeStyle: 'short',
              });

              return (
                <div
                  key={ver.id}
                  className="pt-2.5 first:pt-0 flex items-center justify-between gap-3 text-xs"
                >
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#111827] font-mono-numbers">
                        Version {ver.version}
                      </span>
                      {isCurrent && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.2 rounded-full bg-[#ecfdf5] text-[#059669] text-[10px] font-semibold border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3" />
                          Live Now
                        </span>
                      )}
                    </div>
                    <div className="text-[11px] text-[#6b7280] flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-[#9ca3af]" />
                      <span>{date}</span>
                      <span>&bull;</span>
                      <span>{ver.config?.sections?.length || 0} sections</span>
                    </div>
                  </div>

                  {!isCurrent && (
                    <button
                      type="button"
                      disabled={isRollingBack}
                      onClick={() => onRollback(ver.version)}
                      className="px-2.5 py-1 rounded bg-white hover:bg-[#f9fafb] border border-[#e5e7eb] text-[#111827] text-xs font-medium transition cursor-pointer flex items-center gap-1 shadow-xs disabled:opacity-50"
                    >
                      <RotateCcw className="w-3 h-3 text-[#ea580c]" />
                      <span>Rollback</span>
                    </button>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="px-5 py-3 border-t border-[#e5e7eb] bg-[#f9fafb] flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1.5 rounded bg-white border border-[#e5e7eb] text-xs font-medium text-[#4b5563] hover:text-[#111827] cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
