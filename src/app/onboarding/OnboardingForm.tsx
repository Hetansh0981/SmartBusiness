'use client';

import React, { useState, useActionState } from 'react';
import { createStoreAction, type OnboardingActionResult } from './actions';
import { Button, Input, Select, Card, CardContent } from '@/components/ui';
import { STORE_CATEGORIES, INDIAN_STATES } from '@/lib/constants';
import { generateSlug } from '@/lib/utils';

export default function OnboardingForm() {
  const [shopName, setShopName] = useState('');
  const [slug, setSlug] = useState('');
  const [isSlugManuallyEdited, setIsSlugManuallyEdited] = useState(false);

  const [state, formAction, isPending] = useActionState<OnboardingActionResult | null, FormData>(
    createStoreAction,
    null
  );

  const handleShopNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setShopName(val);
    if (!isSlugManuallyEdited) {
      setSlug(generateSlug(val));
    }
  };

  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsSlugManuallyEdited(true);
    setSlug(generateSlug(e.target.value));
  };

  return (
    <Card className="max-w-xl w-full mx-auto shadow-xs border-[#e5e7eb] bg-white">
      <CardContent className="p-6 sm:p-8">
        <div className="mb-6">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#ffedd5] border border-orange-200 text-[#c2410c] text-xs font-semibold mb-2">
            <span>Step 1 of 1</span> &bull; <span>Store Setup</span>
          </div>
          <h1 className="text-xl sm:text-2xl font-semibold text-[#111827] tracking-tight">
            Tell us about your shop
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-[#4b5563]">
            We will use these details to generate your digital storefront and configure your WhatsApp orders.
          </p>
        </div>

        {state?.error && (
          <div className="mb-4 p-3 rounded bg-[#fef2f2] border border-rose-200 text-[#dc2626] text-xs font-medium flex items-center gap-2">
            <span>{state.error}</span>
          </div>
        )}

        <form action={formAction} className="space-y-4">
          {/* Shop Name */}
          <Input
            label="Shop or Business Name"
            name="name"
            placeholder="e.g. Sharma Sweets & Namkeen"
            value={shopName}
            onChange={handleShopNameChange}
            required
            error={state?.fieldErrors?.name}
            helperText="The public name displayed at the top of your website."
          />

          {/* Store URL / Slug */}
          <Input
            label="Your Store Web Address (URL)"
            name="slug"
            placeholder="sharma-sweets"
            value={slug}
            onChange={handleSlugChange}
            required
            leftAddon="dukaanos.in/"
            error={state?.fieldErrors?.slug}
            helperText="Your customers will visit this link to browse and order from your store."
          />

          {/* Business Category */}
          <Select
            label="Business Category"
            name="category"
            required
            placeholder="Select your store category..."
            options={[...STORE_CATEGORIES]}
            error={state?.fieldErrors?.category}
            helperText="Helps us tailor your storefront layout and order flows."
          />

          {/* WhatsApp Mobile Number */}
          <Input
            label="WhatsApp Business Mobile Number"
            name="whatsappNumber"
            type="tel"
            placeholder="9876543210"
            required
            leftAddon="+91"
            maxLength={10}
            error={state?.fieldErrors?.whatsappNumber}
            helperText="Customer orders will be sent directly to this WhatsApp number."
          />

          {/* City and State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <Input
              label="City / Town"
              name="city"
              placeholder="e.g. Jaipur"
              required
              error={state?.fieldErrors?.city}
            />

            <Select
              label="State / Union Territory"
              name="state"
              required
              placeholder="Select State..."
              options={[...INDIAN_STATES]}
              error={state?.fieldErrors?.state}
            />
          </div>

          <div className="pt-3 border-t border-[#f1f3f5] flex items-center justify-end">
            <Button
              type="submit"
              variant="primary"
              size="md"
              className="w-full sm:w-auto"
              isLoading={isPending}
            >
              Create My Store &rarr;
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
