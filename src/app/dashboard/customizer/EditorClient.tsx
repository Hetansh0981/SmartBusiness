'use client';

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import EditorToolbar from './EditorToolbar';
import LeftPanel from './LeftPanel';
import RightPanel from './RightPanel';
import PreviewCanvas from './PreviewCanvas';
import VersionHistoryModal from './VersionHistoryModal';
import AiAssistantDrawer from './AiAssistantDrawer';
import { saveDraftAction, publishAction, rollbackAction } from './actions';
import type {
  StorefrontConfig,
  StoreCustomization,
  StoreCustomizationVersion,
  SectionConfig,
  ThemeTokens,
} from '@/types/customizer';
import type { PublicStore, Category, Product } from '@/types';
import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';

interface EditorClientProps {
  store: PublicStore;
  categories: Category[];
  products: Product[];
  initialCustomization: StoreCustomization;
  initialVersions: StoreCustomizationVersion[];
}

export default function EditorClient({
  store,
  categories,
  products,
  initialCustomization,
  initialVersions,
}: EditorClientProps) {
  // 1. History & Config State Machine (Max 50 undo steps)
  const [history, setHistory] = useState<{
    past: StorefrontConfig[];
    present: StorefrontConfig;
    future: StorefrontConfig[];
  }>({
    past: [],
    present: initialCustomization.draft_config,
    future: [],
  });

  const [currentRevision, setCurrentRevision] = useState<number>(
    initialCustomization.draft_revision
  );
  const [version, setVersion] = useState<number>(initialCustomization.version);
  const [versions, setVersions] = useState<StoreCustomizationVersion[]>(initialVersions);
  const [isDirty, setIsDirty] = useState<boolean>(false);

  // 2. Viewport & Active Section Selection
  const [viewport, setViewport] = useState<'desktop' | 'tablet' | 'mobile'>('desktop');
  const [activeSectionId, setActiveSectionId] = useState<string | null>(null);

  // 3. Modals & Loaders
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [isRollingBack, setIsRollingBack] = useState(false);

  // 4. Stale Revision Conflict Modal State
  const [conflictModal, setConflictModal] = useState<{
    isOpen: boolean;
    currentServerRevision?: number;
  }>({ isOpen: false });

  // 5. Toast Feedback State
  const [toast, setToast] = useState<{
    id: number;
    message: string;
    type: 'info' | 'success' | 'error';
  } | null>(null);

  const showToast = useCallback((message: string, type: 'info' | 'success' | 'error' = 'info') => {
    setToast({ id: Date.now(), message, type });
    setTimeout(() => {
      setToast((cur) => (cur?.message === message ? null : cur));
    }, 3500);
  }, []);

  const config = history.present;

  // Active Section for Right Panel
  const activeSection = useMemo(() => {
    if (!activeSectionId) return null;
    return config.sections.find((s) => s.id === activeSectionId) || null;
  }, [config.sections, activeSectionId]);

  // Push new state onto undo history stack
  const pushConfig = useCallback((newConfig: StorefrontConfig) => {
    setHistory((prev) => ({
      past: [...prev.past.slice(-49), prev.present],
      present: newConfig,
      future: [],
    }));
    setIsDirty(true);
  }, []);

  // Undo / Redo
  const canUndo = history.past.length > 0;
  const canRedo = history.future.length > 0;

  const handleUndo = useCallback(() => {
    if (!canUndo) return;
    setHistory((prev) => {
      const previous = prev.past[prev.past.length - 1];
      const newPast = prev.past.slice(0, prev.past.length - 1);
      return {
        past: newPast,
        present: previous,
        future: [prev.present, ...prev.future],
      };
    });
    setIsDirty(true);
  }, [canUndo]);

  const handleRedo = useCallback(() => {
    if (!canRedo) return;
    setHistory((prev) => {
      const next = prev.future[0];
      const newFuture = prev.future.slice(1);
      return {
        past: [...prev.past, prev.present],
        present: next,
        future: newFuture,
      };
    });
    setIsDirty(true);
  }, [canRedo]);

  // Section Manipulations
  const handleUpdateSection = useCallback(
    (updated: SectionConfig) => {
      const updatedSections = config.sections.map((s) => (s.id === updated.id ? updated : s));
      pushConfig({ ...config, sections: updatedSections });
    },
    [config, pushConfig]
  );

  const handleDeleteSection = useCallback(
    (sectionId: string) => {
      const sec = config.sections.find((s) => s.id === sectionId);
      if (sec?.type === 'header' || sec?.type === 'footer') {
        showToast('Header and Footer sections cannot be removed', 'error');
        return;
      }
      const updatedSections = config.sections.filter((s) => s.id !== sectionId);
      if (activeSectionId === sectionId) {
        setActiveSectionId(null);
      }
      pushConfig({ ...config, sections: updatedSections });
      showToast('Section removed', 'info');
    },
    [config, activeSectionId, pushConfig, showToast]
  );

  const handleAddSection = useCallback(
    (newSection: SectionConfig) => {
      if (config.sections.length >= 20) {
        showToast('Maximum 20 sections allowed', 'error');
        return;
      }
      // Insert before footer if footer exists
      const footerIdx = config.sections.findIndex((s) => s.type === 'footer');
      const updatedSections = [...config.sections];
      if (footerIdx !== -1) {
        updatedSections.splice(footerIdx, 0, newSection);
      } else {
        updatedSections.push(newSection);
      }
      pushConfig({ ...config, sections: updatedSections });
      setActiveSectionId(newSection.id);
      showToast('Section added to storefront', 'success');
    },
    [config, pushConfig, showToast]
  );

  const handleReorderSections = useCallback(
    (newSections: SectionConfig[]) => {
      pushConfig({ ...config, sections: newSections });
    },
    [config, pushConfig]
  );

  const handleUpdateTheme = useCallback(
    (updatedTheme: ThemeTokens) => {
      pushConfig({ ...config, theme: updatedTheme });
    },
    [config, pushConfig]
  );

  // Save Draft Action (Optimistic Concurrency Safe)
  const handleSaveDraft = useCallback(async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      const res = await saveDraftAction(store.id, config, currentRevision);

      if (!res.success) {
        if (res.error === 'STALE_REVISION') {
          setConflictModal({ isOpen: true, currentServerRevision: res.current_revision });
        } else {
          showToast(res.error || 'Failed to save draft', 'error');
        }
        return;
      }

      if (res.new_revision) {
        setCurrentRevision(res.new_revision);
      }
      setIsDirty(false);
      showToast('Draft changes saved successfully', 'success');
    } catch (err: any) {
      showToast(err.message || 'Error saving draft', 'error');
    } finally {
      setIsSaving(false);
    }
  }, [store.id, config, currentRevision, isSaving, showToast]);

  // Publish Action (Atomic Single Transaction)
  const handlePublish = useCallback(async () => {
    if (isPublishing) return;
    setIsPublishing(true);
    try {
      const res = await publishAction(store.id, currentRevision, isDirty ? config : undefined);

      if (!res.success) {
        if (res.error === 'STALE_REVISION') {
          setConflictModal({ isOpen: true, currentServerRevision: res.current_revision });
        } else {
          showToast(res.error || 'Failed to publish storefront', 'error');
        }
        return;
      }

      if (res.version) {
        setVersion(res.version);
      }
      if (res.draft_revision) {
        setCurrentRevision(res.draft_revision);
      }
      setIsDirty(false);

      // Refresh version list
      if (res.version) {
        const newSnapshot: StoreCustomizationVersion = {
          id: `local_ver_${res.version}`,
          store_id: store.id,
          version: res.version,
          config: config,
          published_by: null,
          created_at: res.published_at || new Date().toISOString(),
        };
        setVersions((prev) => [newSnapshot, ...prev.slice(0, 49)]);
      }

      showToast(`Storefront published! Version ${res.version} is now live.`, 'success');
    } catch (err: any) {
      showToast(err.message || 'Error publishing storefront', 'error');
    } finally {
      setIsPublishing(false);
    }
  }, [store.id, currentRevision, isDirty, config, isPublishing, showToast]);

  // Rollback Action
  const handleRollback = useCallback(
    async (targetVersion: number) => {
      if (isRollingBack) return;
      setIsRollingBack(true);
      try {
        const res = await rollbackAction(store.id, targetVersion, currentRevision);

        if (!res.success) {
          if (res.error === 'STALE_REVISION') {
            setConflictModal({ isOpen: true, currentServerRevision: res.current_revision });
          } else {
            showToast(res.error || 'Failed to roll back version', 'error');
          }
          return;
        }

        // Find target version config
        const targetSnapshot = versions.find((v) => v.version === targetVersion);
        if (targetSnapshot) {
          setHistory({
            past: [],
            present: targetSnapshot.config,
            future: [],
          });
        }

        if (res.new_version) {
          setVersion(res.new_version);
        }
        if (res.new_draft_revision) {
          setCurrentRevision(res.new_draft_revision);
        }
        setIsDirty(false);
        setIsHistoryOpen(false);

        showToast(
          `Restored Version ${targetVersion}! Live store rolled forward to Version ${res.new_version}.`,
          'success'
        );
      } catch (err: any) {
        showToast(err.message || 'Error executing rollback', 'error');
      } finally {
        setIsRollingBack(false);
      }
    },
    [store.id, currentRevision, versions, isRollingBack, showToast]
  );

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
      }
      // Redo: Ctrl+Shift+Z / Cmd+Shift+Z / Ctrl+Y
      else if (
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y')
      ) {
        e.preventDefault();
        handleRedo();
      }
      // Save: Ctrl+S / Cmd+S
      else if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 's') {
        e.preventDefault();
        handleSaveDraft();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleUndo, handleRedo, handleSaveDraft]);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-[#f9f9ff] text-[#111827]">
      {/* 1. Top Control Bar */}
      <EditorToolbar
        store={store}
        viewport={viewport}
        setViewport={setViewport}
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={handleUndo}
        onRedo={handleRedo}
        isDirty={isDirty}
        isSaving={isSaving}
        isPublishing={isPublishing}
        onSaveDraft={handleSaveDraft}
        onPublish={handlePublish}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenAiDrawer={() => setIsAiDrawerOpen(true)}
        version={version}
      />

      {/* 2. Main 3-Panel Editor Workspace */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Panel: Sections List & Global Theme Tabs */}
        <LeftPanel
          config={config}
          activeSectionId={activeSectionId}
          onSelectSection={(id) => setActiveSectionId(id)}
          onReorderSections={handleReorderSections}
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection}
          onAddSection={handleAddSection}
          onUpdateTheme={handleUpdateTheme}
        />

        {/* Center: Live Storefront Canvas (Desktop or 375px Mobile Frame) */}
        <PreviewCanvas
          config={config}
          store={store}
          categories={categories}
          products={products}
          viewport={viewport}
          activeSectionId={activeSectionId}
          onSelectSection={(id) => setActiveSectionId(id)}
          onInterceptAction={(msg) => showToast(`Preview: ${msg}`, 'info')}
        />

        {/* Right Panel: Contextual Selected Section Settings */}
        <RightPanel
          activeSection={activeSection}
          onUpdateSection={handleUpdateSection}
          onDeleteSection={handleDeleteSection}
          onClose={() => setActiveSectionId(null)}
        />
      </div>

      {/* 3. Version History & Rollback Modal */}
      <VersionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        versions={versions}
        currentVersion={version}
        onRollback={handleRollback}
        isRollingBack={isRollingBack}
      />

      {/* 4. AI Storefront Designer Drawer */}
      <AiAssistantDrawer
        isOpen={isAiDrawerOpen}
        onClose={() => setIsAiDrawerOpen(false)}
        storeId={store.id}
        currentConfig={config}
        onApplyConfig={(newConfig, summary) => {
          pushConfig(newConfig);
          showToast(summary, 'success');
        }}
      />

      {/* 4. Non-Destructive Revision Conflict Modal */}
      {conflictModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs">
          <div className="bg-white rounded-lg border border-[#e5e7eb] shadow-xl max-w-md w-full p-6 text-xs">
            <div className="flex items-center gap-3 mb-3 text-amber-600">
              <AlertTriangle className="w-6 h-6 flex-shrink-0" />
              <h3 className="text-sm font-bold text-[#111827]">
                Concurrent Editing Session Detected
              </h3>
            </div>
            <p className="text-[#4b5563] leading-relaxed mb-4">
              Another browser tab or session updated this storefront draft (Server revision{' '}
              <span className="font-mono font-bold">{conflictModal.currentServerRevision}</span> vs your revision{' '}
              <span className="font-mono font-bold">{currentRevision}</span>).
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => window.location.reload()}
                className="px-3.5 py-1.5 rounded bg-white border border-[#e5e7eb] hover:bg-[#f9fafb] text-[#111827] font-medium cursor-pointer"
              >
                Reload Latest Draft
              </button>
              <button
                type="button"
                onClick={async () => {
                  setConflictModal({ isOpen: false });
                  if (conflictModal.currentServerRevision) {
                    setCurrentRevision(conflictModal.currentServerRevision);
                  }
                  showToast('Revision synchronized. Try saving again.', 'info');
                }}
                className="px-3.5 py-1.5 rounded bg-[#ea580c] hover:bg-[#c2410c] text-white font-semibold cursor-pointer"
              >
                Synchronize &amp; Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 5. Floating Toast Notification */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-50 flex items-center gap-2 px-3.5 py-2.5 rounded-lg bg-[#181e2b] text-white text-xs shadow-lg border border-white/10 animate-in fade-in slide-in-from-bottom-2">
          {toast.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
          {toast.type === 'error' && <AlertTriangle className="w-4 h-4 text-rose-400" />}
          {toast.type === 'info' && <Info className="w-4 h-4 text-blue-400" />}
          <span className="font-medium">{toast.message}</span>
          <button
            type="button"
            onClick={() => setToast(null)}
            className="ml-2 text-white/60 hover:text-white"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
}
