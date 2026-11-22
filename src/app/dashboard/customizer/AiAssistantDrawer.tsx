'use client';

import React, { useState, useEffect, useRef } from 'react';
import type {
  SafeProviderStatus,
  AiConversationMessage,
  DesignConcept,
} from '@/lib/ai/types';
import type { StorefrontConfig } from '@/types/customizer';
import {
  getAiProviderStatusAction,
  getAiConversationAction,
  sendAiPromptAction,
  applyAiConceptAction,
  clearAiConversationAction,
} from '@/lib/ai/actions';
import AiStatusBadge from './AiStatusBadge';
import AiConceptCards from './AiConceptCards';
import {
  Sparkles,
  Send,
  RotateCcw,
  Bot,
  User,
  X,
  Loader2,
  Check,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { useLanguage } from '@/lib/i18n/LanguageContext';

interface AiAssistantDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  storeId: string;
  currentConfig: StorefrontConfig;
  onApplyConfig: (config: StorefrontConfig, summary: string) => void;
}

export default function AiAssistantDrawer({
  isOpen,
  onClose,
  storeId,
  currentConfig,
  onApplyConfig,
}: AiAssistantDrawerProps) {
  const { t } = useLanguage();
  const [status, setStatus] = useState<SafeProviderStatus | null>(null);
  const [messages, setMessages] = useState<AiConversationMessage[]>([]);
  const [stage, setStage] = useState<'understanding' | 'concepts' | 'refining'>('understanding');
  const [concepts, setConcepts] = useState<DesignConcept[]>([]);
  const [selectedConceptId, setSelectedConceptId] = useState<string | null>(null);
  const [inputPrompt, setInputPrompt] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isApplying, setIsApplying] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load provider status and active conversation on drawer open
  useEffect(() => {
    if (!isOpen) return;

    let mounted = true;
    async function loadData() {
      try {
        const [stat, conv] = await Promise.all([
          getAiProviderStatusAction(storeId),
          getAiConversationAction(storeId),
        ]);

        if (!mounted) return;
        setStatus(stat);
        setMessages(conv.messages);
        setStage(conv.stage === 'generated' ? 'refining' : conv.stage);
        setConcepts(conv.concepts);
      } catch (err) {
        console.error('Failed to load AI conversation:', err);
      }
    }

    loadData();
    return () => {
      mounted = false;
    };
  }, [isOpen, storeId]);

  // Scroll to bottom on message updates
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  const handleSendMessage = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const trimmed = inputPrompt.trim();
    if (!trimmed || isLoading) return;

    setIsLoading(true);
    setErrorMsg(null);
    setInputPrompt('');

    try {
      const res = await sendAiPromptAction(storeId, trimmed, currentConfig, stage);

      setMessages((prev) => [...prev, res.userMessage, res.assistantMessage]);
      setStage(res.nextStage);

      if (res.concepts && res.concepts.length > 0) {
        setConcepts(res.concepts);
      }

      if (res.updatedConfig) {
        onApplyConfig(res.updatedConfig, res.assistantMessage.explanation || 'Applied conversational edit');
      }
    } catch (err: unknown) {
      console.error('AI action failed:', err);
      setErrorMsg('Failed to process message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectConcept = async (concept: DesignConcept) => {
    setIsApplying(true);
    setSelectedConceptId(concept.id);
    setErrorMsg(null);

    try {
      const synthesized = await applyAiConceptAction(storeId, concept);
      onApplyConfig(synthesized, `Applied "${concept.name}" design concept`);
      setStage('refining');

      const systemTurn: AiConversationMessage = {
        id: `sys_${Date.now()}`,
        role: 'assistant',
        content: `I have applied the "${concept.name}" concept to your storefront preview! You can now ask me to make any fine-tuned adjustments (e.g., "make buttons pill style", "use a darker background", "move promo banner above products").`,
        stage: 'refining',
        createdAt: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, systemTurn]);
    } catch (err: unknown) {
      console.error('Failed to apply concept:', err);
      setErrorMsg('Could not apply concept. Please retry.');
    } finally {
      setIsApplying(false);
    }
  };

  const handleClearConversation = async () => {
    if (!confirm('Are you sure you want to reset this AI design conversation?')) return;
    setIsLoading(true);
    try {
      await clearAiConversationAction(storeId);
      setMessages([]);
      setConcepts([]);
      setSelectedConceptId(null);
      setStage('understanding');
    } catch (err) {
      console.error('Failed to clear conversation:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full max-w-md bg-white shadow-2xl border-l border-[#e5e7eb] flex flex-col animate-in slide-in-from-right duration-200">
      {/* Top Header */}
      <div className="p-3.5 border-b border-[#e5e7eb] flex items-center justify-between bg-[#f9fafb]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c]">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="font-bold text-[#111827] text-xs sm:text-sm flex items-center gap-1.5">
              <span>{t('ai.title', 'AI Design Assistant')}</span>
            </div>
            <AiStatusBadge status={status} />
          </div>
        </div>

        <div className="flex items-center gap-1">
          {messages.length > 0 && (
            <button
              type="button"
              onClick={handleClearConversation}
              className="p-1.5 text-[#6b7280] hover:text-[#e11d48] rounded transition"
              title={t('ai.restart_conversation', 'Reset conversation')}
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          )}

          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-[#6b7280] hover:text-[#111827] rounded transition"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Messages Feed */}
      <div className="flex-1 overflow-y-auto p-3.5 space-y-3.5 text-xs bg-[#fdfdfd]">
        {/* Welcome Starter if empty */}
        {messages.length === 0 && (
          <div className="p-3.5 rounded-xl border border-orange-100 bg-gradient-to-br from-orange-50/50 to-amber-50/30 text-[#4b5563] space-y-2">
            <div className="font-semibold text-[#ea580c] flex items-center gap-1.5 text-xs">
              <Bot className="w-4 h-4" />
              <span>Describe your business in your own words</span>
            </div>
            <p className="text-[11px] leading-relaxed">
              Tell me about your shop, products, city, and preferred vibe in English, हिन्दी, or Hinglish. I will brainstorm 3 customized creative concepts for your storefront.
            </p>

            <div className="pt-1">
              <div className="text-[10px] font-semibold text-[#6b7280] mb-1">Try asking:</div>
              <div className="space-y-1">
                {[
                  'Handcrafted bridal sarees & jewelry in Jaipur with royal gold & maroon tones',
                  'Organic farm-fresh vegetables and cold-pressed oils with fresh green styling',
                  'Artisan sourdough bakery and coffee shop with warm cozy aesthetic',
                ].map((sample) => (
                  <button
                    key={sample}
                    type="button"
                    onClick={() => {
                      setInputPrompt(sample);
                    }}
                    className="w-full text-left p-1.5 rounded-lg bg-white border border-[#e5e7eb] text-[10px] text-[#374151] hover:border-[#ea580c] hover:text-[#ea580c] transition cursor-pointer"
                  >
                    "{sample}"
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Message Turns */}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role !== 'user' && (
              <div className="w-6 h-6 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c] flex-shrink-0 mt-0.5">
                <Bot className="w-3.5 h-3.5" />
              </div>
            )}

            <div
              className={`max-w-[85%] p-2.5 rounded-xl leading-relaxed text-xs ${
                msg.role === 'user'
                  ? 'bg-[#ea580c] text-white rounded-br-xs shadow-2xs'
                  : 'bg-white border border-[#e5e7eb] text-[#1f2937] rounded-bl-xs shadow-2xs'
              }`}
            >
              <div className="whitespace-pre-wrap">{msg.content}</div>

              {/* Render Concept Cards if present */}
              {msg.concepts && msg.concepts.length > 0 && (
                <div className="mt-3">
                  <AiConceptCards
                    concepts={msg.concepts}
                    selectedConceptId={selectedConceptId}
                    onSelectConcept={handleSelectConcept}
                    isApplying={isApplying}
                  />
                </div>
              )}
            </div>

            {msg.role === 'user' && (
              <div className="w-6 h-6 rounded-full bg-[#1f2937] text-white flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="w-3.5 h-3.5" />
              </div>
            )}
          </div>
        ))}

        {/* Loading Spinner Indicator */}
        {isLoading && (
          <div className="flex gap-2 items-center text-[#6b7280] text-xs italic">
            <div className="w-6 h-6 rounded-full bg-orange-100 border border-orange-200 flex items-center justify-center text-[#ea580c]">
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            </div>
            <span>Analyzing and synthesizing design...</span>
          </div>
        )}

        {/* Error Notice */}
        {errorMsg && (
          <div className="p-2.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{errorMsg}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Bar Form */}
      <form onSubmit={handleSendMessage} className="p-2.5 border-t border-[#e5e7eb] bg-white">
        <div className="relative flex items-center">
          <input
            type="text"
            value={inputPrompt}
            onChange={(e) => setInputPrompt(e.target.value)}
            disabled={isLoading || isApplying}
            placeholder={
              stage === 'refining'
                ? t('ai.refine_placeholder', 'Tell AI what to change (e.g. pill buttons, dark theme)...')
                : t('ai.prompt_placeholder', 'Describe your shop, vibe, or aesthetic...')
            }
            maxLength={1000}
            className="w-full pr-10 pl-3 py-2 rounded-lg border border-[#e5e7eb] text-xs bg-[#f9fafb] text-[#111827] focus:outline-none focus:border-[#ea580c] focus:bg-white transition"
          />

          <button
            type="submit"
            disabled={!inputPrompt.trim() || isLoading || isApplying}
            className="absolute right-1.5 p-1.5 rounded-md bg-[#ea580c] text-white hover:bg-[#c2410c] disabled:opacity-40 transition cursor-pointer"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </div>
      </form>
    </div>
  );
}
