'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

/**
 * Permanently deletes the merchant's store, categories, products, and images.
 * Redirects the merchant to /onboarding to create a fresh store.
 */
export async function deleteStoreAction(confirmationName: string) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in to delete a store.' };
  }

  // 1. Fetch store owned by user
  const { data: store, error: fetchError } = await supabase
    .from('stores')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (fetchError || !store) {
    return { error: 'Store not found or you do not have permission to delete it.' };
  }

  // 2. Strict confirmation check
  if (confirmationName.trim() !== store.name.trim()) {
    return { error: `Store name does not match. Please type "${store.name}" exactly to confirm.` };
  }

  // 3a. Clean up all stored images for this store in Supabase Storage
  try {
    const { data: files } = await supabase.storage
      .from('product-images')
      .list(store.id);

    if (files && files.length > 0) {
      const pathsToDelete = files.map((f) => `${store.id}/${f.name}`);
      await supabase.storage.from('product-images').remove(pathsToDelete);
    }
  } catch (storageErr) {
    console.error('Failed to clean up product images during store deletion:', storageErr);
  }

  // 3b. Delete all products first (eliminates any foreign key cascade conflicts)
  const { error: prodDeleteErr } = await supabase
    .from('products')
    .delete()
    .eq('store_id', store.id);

  if (prodDeleteErr) {
    console.error('[deleteStoreAction] Failed to delete products:', prodDeleteErr);
    return { error: `Failed to remove store products: ${prodDeleteErr.message}` };
  }

  // 3c. Delete all categories second
  const { error: catDeleteErr } = await supabase
    .from('categories')
    .delete()
    .eq('store_id', store.id);

  if (catDeleteErr) {
    console.error('[deleteStoreAction] Failed to delete categories:', catDeleteErr);
    return { error: `Failed to remove store categories: ${catDeleteErr.message}` };
  }

  // 4. Delete store record
  const { error: deleteError } = await supabase
    .from('stores')
    .delete()
    .eq('id', store.id)
    .eq('owner_id', user.id);

  if (deleteError) {
    console.error('[deleteStoreAction] Failed to delete store record:', deleteError);
    return { error: `Failed to delete store: ${deleteError.message}` };
  }

  // 5. Revalidate all cached paths
  revalidatePath('/dashboard');
  revalidatePath('/dashboard/products');
  revalidatePath('/dashboard/categories');
  revalidatePath('/dashboard/settings');
  revalidatePath('/onboarding');

  return { success: true };
}

/**
 * Toggles whether the store is publicly visible or in draft mode
 */
export async function toggleStorePublicationAction(nextPublishedState: boolean) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in.' };
  }

  const { error } = await supabase
    .from('stores')
    .update({ is_published: nextPublishedState })
    .eq('owner_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  return { success: true };
}

/**
 * Updates the storefront's default language (en / hi) presented to first-time shoppers.
 */
export async function updateStoreDefaultLanguageAction(language: 'en' | 'hi') {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: 'You must be logged in.' };
  }

  if (language !== 'en' && language !== 'hi') {
    return { error: 'Invalid language selection' };
  }

  const { error } = await supabase
    .from('stores')
    .update({ default_language: language })
    .eq('owner_id', user.id);

  if (error) {
    return { error: error.message };
  }

  revalidatePath('/dashboard');
  revalidatePath('/dashboard/settings');
  return { success: true };
}
