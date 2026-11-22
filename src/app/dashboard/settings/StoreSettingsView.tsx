'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { deleteStoreAction, toggleStorePublicationAction, updateStoreDefaultLanguageAction } from './actions';
import { useLanguage } from '@/lib/i18n/LanguageContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Button, Input, Modal, Badge, Switch } from '@/components/ui';
import { STORE_CATEGORIES } from '@/lib/constants';
import { formatPhoneNumber } from '@/lib/whatsapp';
import type { Store } from '@/types';
import {
  Store as StoreIcon,
  AlertTriangle,
  Trash2,
  ExternalLink,
  ShieldAlert,
  Globe,
  CheckCircle2,
} from 'lucide-react';

interface StoreSettingsViewProps {
  store: Store;
}

export default function StoreSettingsView({ store }: StoreSettingsViewProps) {
  const { t } = useLanguage();
  const [isPublished, setIsPublished] = useState(store.is_published ?? true);
  const [defaultLang, setDefaultLang] = useState<'en' | 'hi'>((store.default_language as 'en' | 'hi') || 'en');
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [confirmName, setConfirmName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isPending, startTransition] = useTransition();

  const handleLanguageChange = (lang: 'en' | 'hi') => {
    setDefaultLang(lang);
    setErrorMessage('');
    setSuccessMessage('');
    startTransition(async () => {
      const res = await updateStoreDefaultLanguageAction(lang);
      if (res?.error) {
        setErrorMessage(res.error);
      } else {
        setSuccessMessage(lang === 'hi' ? 'स्टोरफ्रंट की डिफ़ॉल्ट भाषा हिन्दी सेट की गई!' : 'Storefront default language set to English!');
      }
    });
  };

  const categoryLabel =
    STORE_CATEGORIES.find((c) => c.value === store.category)?.label || store.category;

  const handleTogglePublication = () => {
    const nextState = !isPublished;
    setIsPublished(nextState);
    setErrorMessage('');
    setSuccessMessage('');

    startTransition(async () => {
      const res = await toggleStorePublicationAction(nextState);
      if (res?.error) {
        setIsPublished(!nextState);
        setErrorMessage(res.error);
      } else {
        setSuccessMessage(
          nextState
            ? 'Store is now LIVE and publicly visible!'
            : 'Store is now in DRAFT mode (hidden from public visitors).'
        );
      }
    });
  };

  const handleDeleteStore = () => {
    setErrorMessage('');

    startTransition(async () => {
      const res = await deleteStoreAction(confirmName);
      if (res?.error) {
        setErrorMessage(res.error);
      } else if (res?.success) {
        window.location.href = '/onboarding';
      }
    });
  };

  const isDeleteNameMatching = confirmName.trim() === store.name.trim();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-0.5">
          <h1 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight">
            {t('settings.title')}
          </h1>
          <span className="px-2 py-0.5 rounded text-xs font-medium bg-[#f3f4f6] text-[#4b5563] border border-[#e5e7eb]">
            Configuration
          </span>
        </div>
        <p className="text-xs sm:text-sm text-[#4b5563]">
          {t('settings.subtitle')}
        </p>
      </div>

      {/* Status Banners */}
      {successMessage && (
        <div className="p-3 rounded bg-[#ecfdf5] border border-emerald-200 text-[#059669] text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{successMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setSuccessMessage('')}
            className="text-[#059669] hover:text-black"
          >
            &times;
          </button>
        </div>
      )}

      {errorMessage && (
        <div className="p-3 rounded bg-[#fef2f2] border border-rose-200 text-[#dc2626] text-xs font-medium flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
          <button
            type="button"
            onClick={() => setErrorMessage('')}
            className="text-[#dc2626] hover:text-black"
          >
            &times;
          </button>
        </div>
      )}

      {/* 1. Store Profile Details */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base font-semibold text-[#111827] flex items-center gap-2">
            <StoreIcon className="w-4 h-4 text-[#ea580c]" />
            <span>General Information</span>
          </CardTitle>
          <CardDescription>
            Your store details displayed to customers on your public website.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded bg-[#f9fafb] border border-[#e5e7eb]">
              <span className="text-[11px] text-[#6b7280] uppercase tracking-wider block mb-0.5">
                Shop Name
              </span>
              <span className="text-sm font-semibold text-[#111827]">{store.name}</span>
            </div>

            <div className="p-3 rounded bg-[#f9fafb] border border-[#e5e7eb]">
              <span className="text-[11px] text-[#6b7280] uppercase tracking-wider block mb-0.5">
                Retail Category
              </span>
              <span className="text-sm font-semibold text-[#111827]">{categoryLabel}</span>
            </div>

            <div className="p-3 rounded bg-[#f9fafb] border border-[#e5e7eb]">
              <span className="text-[11px] text-[#6b7280] uppercase tracking-wider block mb-0.5">
                WhatsApp Orders
              </span>
              <span className="text-sm font-semibold text-[#059669] font-mono-numbers">
                {formatPhoneNumber(store.whatsapp_number)}
              </span>
            </div>

            <div className="p-3 rounded bg-[#f9fafb] border border-[#e5e7eb]">
              <span className="text-[11px] text-[#6b7280] uppercase tracking-wider block mb-0.5">
                Location
              </span>
              <span className="text-sm font-semibold text-[#111827]">
                {store.city}, {store.state}
              </span>
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs border-t border-[#f1f3f5]">
            <span className="text-[#6b7280]">Public Store Address:</span>
            <a
              href={`/store/${store.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#ea580c] hover:underline font-mono-numbers text-xs font-semibold flex items-center gap-1"
            >
              <span>dukaanos.in/store/{store.slug}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </CardContent>
      </Card>

      {/* 2. Store Visibility / Publication Status */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base font-semibold text-[#111827] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#ea580c]" />
            <span>Storefront Visibility</span>
          </CardTitle>
          <CardDescription>
            Control whether your storefront is publicly accessible to shoppers.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between p-3.5 rounded bg-[#f9fafb] border border-[#e5e7eb]">
            <div>
              <div className="flex items-center gap-2 mb-0.5">
                <span className="font-semibold text-xs sm:text-sm text-[#111827]">
                  {isPublished ? 'Store is Live' : 'Store is in Draft'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-medium ${
                    isPublished
                      ? 'bg-[#ecfdf5] text-[#059669] border border-emerald-200'
                      : 'bg-[#fffbeb] text-[#d97706] border border-amber-200'
                  }`}
                >
                  {isPublished ? 'Publicly Visible' : 'Hidden from Public'}
                </span>
              </div>
              <p className="text-xs text-[#6b7280]">
                {isPublished
                  ? 'Shoppers can visit your link and place orders via Cart, COD & WhatsApp.'
                  : 'Visitors will see a 404 page until you publish.'}
              </p>
            </div>

            <Switch
              checked={isPublished}
              onChange={handleTogglePublication}
              disabled={isPending}
              aria-label="Toggle store publication"
            />
          </div>
        </CardContent>
      </Card>

      {/* 3. Storefront Default Language */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm sm:text-base font-semibold text-[#111827] flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#ea580c]" />
            <span>{t('settings.default_language')}</span>
          </CardTitle>
          <CardDescription>
            {t('settings.default_language_desc')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <button
              type="button"
              onClick={() => handleLanguageChange('en')}
              disabled={isPending}
              className={`p-3.5 rounded border text-left transition flex items-center justify-between cursor-pointer ${
                defaultLang === 'en'
                  ? 'border-[#ea580c] bg-[#fff7ed] shadow-xs'
                  : 'border-[#e5e7eb] bg-white hover:bg-[#f9fafb]'
              }`}
            >
              <div>
                <span className="text-sm font-semibold text-[#111827] block">English</span>
                <span className="text-xs text-[#6b7280]">Default for English-speaking shoppers</span>
              </div>
              {defaultLang === 'en' && (
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
              )}
            </button>

            <button
              type="button"
              onClick={() => handleLanguageChange('hi')}
              disabled={isPending}
              className={`p-3.5 rounded border text-left transition flex items-center justify-between cursor-pointer ${
                defaultLang === 'hi'
                  ? 'border-[#ea580c] bg-[#fff7ed] shadow-xs'
                  : 'border-[#e5e7eb] bg-white hover:bg-[#f9fafb]'
              }`}
            >
              <div>
                <span className="text-sm font-semibold text-[#111827] block font-hindi">हिन्दी (Hindi)</span>
                <span className="text-xs text-[#6b7280]">हिन्दी भाषी ग्राहकों के लिए डिफ़ॉल्ट</span>
              </div>
              {defaultLang === 'hi' && (
                <span className="w-2 h-2 rounded-full bg-[#ea580c]" />
              )}
            </button>
          </div>
        </CardContent>
      </Card>

      {/* 3. DANGER ZONE: Delete Store and Create New One */}
      <Card className="border-rose-200 bg-white">
        <CardHeader>
          <div className="flex items-center gap-1.5 text-[#dc2626] mb-0.5">
            <ShieldAlert className="w-4 h-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Danger Zone</span>
          </div>
          <CardTitle className="text-sm sm:text-base font-semibold text-[#111827]">
            Delete Store &amp; Start Fresh
          </CardTitle>
          <CardDescription className="text-[#6b7280]">
            Permanently remove this store, all associated categories, products, and uploaded images.
            You will be redirected to the Store Setup Wizard to launch a brand new store immediately.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="p-3.5 rounded bg-[#fef2f2] border border-rose-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <div>
              <div className="text-xs sm:text-sm font-semibold text-[#111827]">Delete &ldquo;{store.name}&rdquo;</div>
              <div className="text-xs text-[#dc2626]">
                This action is irreversible. All catalog items will be permanently erased.
              </div>
            </div>

            <Button
              variant="danger"
              size="sm"
              onClick={() => {
                setConfirmName('');
                setErrorMessage('');
                setIsDeleteModalOpen(true);
              }}
              className="shrink-0"
            >
              <Trash2 className="w-3.5 h-3.5 mr-1" />
              <span>Delete Store</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => !isPending && setIsDeleteModalOpen(false)}
        title="Delete Store Permanently?"
        description="This action cannot be undone. All products, categories, photos, and settings will be wiped out immediately."
        maxWidth="md"
        footer={
          <>
            <Button
              variant="secondary"
              onClick={() => setIsDeleteModalOpen(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="danger"
              onClick={handleDeleteStore}
              disabled={!isDeleteNameMatching || isPending}
              isLoading={isPending}
            >
              I Understand, Delete Store
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          {errorMessage && (
            <div className="p-3 rounded bg-[#fef2f2] border border-rose-200 text-[#dc2626] text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <div className="p-3 rounded bg-[#fef2f2] border border-rose-200 text-[#dc2626] text-xs leading-relaxed">
            Please type <strong className="text-[#111827] underline">{store.name}</strong> to confirm you want to delete this store.
          </div>

          <Input
            placeholder={store.name}
            value={confirmName}
            onChange={(e) => setConfirmName(e.target.value)}
            autoFocus
            helperText={
              isDeleteNameMatching ? (
                <span className="text-[#059669] font-medium flex items-center gap-1 mt-1">
                  <CheckCircle2 className="w-3.5 h-3.5" /> Name confirmed. You may now delete.
                </span>
              ) : (
                <span className="text-[#6b7280] text-[11px] mt-1 block">
                  Match is case-sensitive.
                </span>
              )
            }
          />
        </div>
      </Modal>
    </div>
  );
}
