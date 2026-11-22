'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';
import { generateSlug } from '@/lib/utils';

export interface CategoryActionResult {
  error?: string;
  success?: boolean;
}

/**
 * Reusable helper: Strictly verifies user session and returns their store
 */
async function getMerchantStore() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    throw new Error('Unauthorized');
  }

  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id, name')
    .eq('owner_id', user.id)
    .single();

  if (storeError || !store) {
    throw new Error('Store not found');
  }

  return { supabase, user, store };
}

/**
 * Create a new category
 */
export async function createCategoryAction(
  _prevState: CategoryActionResult | null,
  formData: FormData
): Promise<CategoryActionResult> {
  try {
    const { supabase, store } = await getMerchantStore();
    const name = (formData.get('name') as string)?.trim();

    if (!name || name.length < 2) {
      return { error: 'Category name must be at least 2 characters.' };
    }

    const slug = generateSlug(name);

    const { error: insertError } = await supabase.from('categories').insert({
      store_id: store.id,
      name,
      slug,
    });

    if (insertError) {
      if (insertError.code === '23505') {
        return { error: `A category named "${name}" already exists in your store.` };
      }
      return { error: insertError.message };
    }

    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to create category' };
  }
}

/**
 * Update / Rename a category
 */
export async function updateCategoryAction(
  _prevState: CategoryActionResult | null,
  formData: FormData
): Promise<CategoryActionResult> {
  try {
    const { supabase, store } = await getMerchantStore();
    const id = formData.get('id') as string;
    const name = (formData.get('name') as string)?.trim();

    if (!id || !name || name.length < 2) {
      return { error: 'Valid category name is required.' };
    }

    const slug = generateSlug(name);

    const { error: updateError } = await supabase
      .from('categories')
      .update({ name, slug })
      .eq('id', id)
      .eq('store_id', store.id);

    if (updateError) {
      if (updateError.code === '23505') {
        return { error: `A category named "${name}" already exists in your store.` };
      }
      return { error: updateError.message };
    }

    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update category' };
  }
}

/**
 * Delete a category safely
 * Foreign key ON DELETE SET NULL (category_id) cleanly disassociates products to Uncategorized.
 */
export async function deleteCategoryAction(categoryId: string): Promise<CategoryActionResult> {
  try {
    const { supabase, store } = await getMerchantStore();

    const { error: deleteError } = await supabase
      .from('categories')
      .delete()
      .eq('id', categoryId)
      .eq('store_id', store.id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to delete category' };
  }
}
