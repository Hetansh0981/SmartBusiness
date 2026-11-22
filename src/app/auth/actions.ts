'use server';

import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';

export interface AuthActionResult {
  error?: string;
  success?: boolean;
  requiresEmailConfirmation?: boolean;
}

/**
 * Handle Merchant Registration
 */
export async function signUpAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both email and password.' };
  }

  if (password.length < 6) {
    return { error: 'Password must be at least 6 characters long.' };
  }

  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return { error: error.message };
  }

  // Check if email confirmation is required by Supabase project settings
  if (data?.user && (!data.session || data.user.identities?.length === 0)) {
    // In Supabase, if email confirmation is enabled, session is null until verified.
    return { success: true, requiresEmailConfirmation: true };
  }

  // If email confirmation is disabled, user is immediately logged in
  redirect('/onboarding');
}

/**
 * Handle Merchant Login
 */
export async function loginAction(
  _prevState: AuthActionResult | null,
  formData: FormData
): Promise<AuthActionResult> {
  const email = (formData.get('email') as string)?.trim();
  const password = formData.get('password') as string;

  if (!email || !password) {
    return { error: 'Please enter both your email and password.' };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { error: 'Invalid email or password. Please try again.' };
  }

  // Check if merchant already has a store setup
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (store) {
      redirect('/dashboard');
    }
  }

  redirect('/onboarding');
}

/**
 * Handle Merchant Logout
 */
export async function logoutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect('/login');
}
