'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { generateSlug } from '@/lib/utils';

export interface OnboardingActionResult {
  error?: string;
  fieldErrors?: {
    name?: string;
    slug?: string;
    category?: string;
    whatsappNumber?: string;
    city?: string;
    state?: string;
  };
}

export async function createStoreAction(
  _prevState: OnboardingActionResult | null,
  formData: FormData
): Promise<OnboardingActionResult> {
  const supabase = await createClient();

  // Defense in depth: Strictly verify user session server-side
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect('/login');
  }

  const name = (formData.get('name') as string)?.trim();
  const rawSlug = (formData.get('slug') as string)?.trim();
  const category = (formData.get('category') as string)?.trim();
  const rawWhatsApp = (formData.get('whatsappNumber') as string)?.trim();
  const city = (formData.get('city') as string)?.trim();
  const state = (formData.get('state') as string)?.trim();

  const fieldErrors: OnboardingActionResult['fieldErrors'] = {};

  if (!name || name.length < 2) {
    fieldErrors.name = 'Shop name must be at least 2 characters long.';
  }

  const cleanSlug = generateSlug(rawSlug || name || '');
  if (!cleanSlug || cleanSlug.length < 3) {
    fieldErrors.slug = 'Store URL must be at least 3 characters (letters, numbers, hyphens).';
  } else if (!/^[a-z0-9-]+$/.test(cleanSlug)) {
    fieldErrors.slug = 'Store URL can only contain lowercase letters, numbers, and hyphens.';
  }

  if (!category) {
    fieldErrors.category = 'Please select a business category.';
  }

  // Validate Indian WhatsApp mobile number (must be 10 digits)
  const cleanWhatsApp = rawWhatsApp.replace(/\D/g, '');
  if (!cleanWhatsApp || cleanWhatsApp.length !== 10) {
    fieldErrors.whatsappNumber = 'Please enter a valid 10-digit mobile number.';
  }

  if (!city || city.length < 2) {
    fieldErrors.city = 'Please enter your city.';
  }

  if (!state) {
    fieldErrors.state = 'Please select your state.';
  }

  if (Object.keys(fieldErrors).length > 0) {
    return { fieldErrors };
  }

  // Notice: owner_id is completely omitted!
  // PostgreSQL automatically sets owner_id = auth.uid() using the column DEFAULT.
  const { error: insertError } = await supabase.from('stores').insert({
    name,
    slug: cleanSlug,
    category,
    whatsapp_number: cleanWhatsApp,
    city,
    state,
  });

  if (insertError) {
    // Unique violation error in Postgres is code 23505
    if (insertError.code === '23505') {
      if (insertError.message.includes('stores_slug_lower_idx') || insertError.message.includes('slug')) {
        return {
          fieldErrors: {
            slug: `The web address "dukaanos.in/${cleanSlug}" is already taken. Please choose another.`,
          },
        };
      }
      if (insertError.message.includes('stores_owner_id_unique')) {
        // Merchant already has a store
        redirect('/dashboard');
      }
    }

    return {
      error: `Could not save store: ${insertError.message}`,
    };
  }

  redirect('/dashboard');
}
