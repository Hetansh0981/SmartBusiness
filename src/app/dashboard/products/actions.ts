'use server';

import { revalidatePath } from 'next/cache';
import { createClient } from '@/lib/supabase/server';

export interface ProductActionResult {
  error?: string;
  success?: boolean;
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

/**
 * Reusable helper: Strictly verifies user session and returns merchant store
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
 * Helper to upload image to product-images bucket
 */
async function uploadProductImage(
  supabase: Awaited<ReturnType<typeof createClient>>,
  storeId: string,
  file: File
): Promise<string> {
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    throw new Error('Invalid image format. Allowed formats: JPG, PNG, WEBP.');
  }

  if (file.size > MAX_FILE_SIZE) {
    throw new Error('Image size must be 5 MB or smaller.');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg';
  const fileName = `${crypto.randomUUID()}.${ext}`;
  const filePath = `${storeId}/${fileName}`;

  const { error: uploadError } = await supabase.storage
    .from('product-images')
    .upload(filePath, file, {
      contentType: file.type,
      upsert: true,
    });

  if (uploadError) {
    throw new Error(`Image upload failed: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);
  return data.publicUrl;
}

/**
 * Helper to safely extract storage file path from public URL and delete it
 */
async function deleteProductImageFile(
  supabase: Awaited<ReturnType<typeof createClient>>,
  storeId: string,
  imageUrl: string | null
) {
  if (!imageUrl) return;

  try {
    // URL format: .../storage/v1/object/public/product-images/{storeId}/{filename}
    const parts = imageUrl.split('/product-images/');
    if (parts.length > 1) {
      const filePath = parts[1];
      // Only delete if path starts with the merchant's storeId
      if (filePath.startsWith(`${storeId}/`)) {
        await supabase.storage.from('product-images').remove([filePath]);
      }
    }
  } catch {
    // Ignore cleanup error if already removed
  }
}

/**
 * Create a new Product
 */
export async function createProductAction(
  _prevState: ProductActionResult | null,
  formData: FormData
): Promise<ProductActionResult> {
  try {
    const { supabase, store } = await getMerchantStore();

    const name = (formData.get('name') as string)?.trim();
    const rawCategoryId = (formData.get('categoryId') as string)?.trim();
    const categoryId = rawCategoryId && rawCategoryId !== '' ? rawCategoryId : null;
    const rawPrice = formData.get('price') as string;
    const rawMrp = formData.get('mrp') as string;
    const description = (formData.get('description') as string)?.trim() || null;
    const inStock = formData.get('inStock') === 'true';
    const imageFile = formData.get('image') as File | null;

    if (!name || name.length < 2) {
      return { error: 'Product name must be at least 2 characters.' };
    }

    const price = parseFloat(rawPrice);
    if (isNaN(price) || price < 0) {
      return { error: 'Please enter a valid selling price in ₹ (0 or greater).' };
    }

    let mrp: number | null = null;
    if (rawMrp && rawMrp.trim() !== '') {
      mrp = parseFloat(rawMrp);
      if (isNaN(mrp) || mrp < price) {
        return { error: 'MRP cannot be less than the selling price.' };
      }
    }

    let imageUrl: string | null = null;
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      imageUrl = await uploadProductImage(supabase, store.id, imageFile);
    }

    // Insert into products table
    // Notice: Composite foreign key enforces categoryId MUST belong to store.id
    const { error: insertError } = await supabase.from('products').insert({
      store_id: store.id,
      category_id: categoryId,
      name,
      description,
      price,
      mrp,
      image_url: imageUrl,
      in_stock: inStock,
    });

    if (insertError) {
      if (insertError.code === '23503') {
        return { error: 'Selected category does not belong to your store.' };
      }
      return { error: insertError.message };
    }

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to create product' };
  }
}

/**
 * Update an existing Product
 */
export async function updateProductAction(
  _prevState: ProductActionResult | null,
  formData: FormData
): Promise<ProductActionResult> {
  try {
    const { supabase, store } = await getMerchantStore();

    const id = formData.get('id') as string;
    const name = (formData.get('name') as string)?.trim();
    const rawCategoryId = (formData.get('categoryId') as string)?.trim();
    const categoryId = rawCategoryId && rawCategoryId !== '' ? rawCategoryId : null;
    const rawPrice = formData.get('price') as string;
    const rawMrp = formData.get('mrp') as string;
    const description = (formData.get('description') as string)?.trim() || null;
    const inStock = formData.get('inStock') === 'true';
    const imageFile = formData.get('image') as File | null;
    const existingImageUrl = (formData.get('existingImageUrl') as string) || null;

    if (!id || !name || name.length < 2) {
      return { error: 'Valid product name is required.' };
    }

    const price = parseFloat(rawPrice);
    if (isNaN(price) || price < 0) {
      return { error: 'Please enter a valid selling price in ₹.' };
    }

    let mrp: number | null = null;
    if (rawMrp && rawMrp.trim() !== '') {
      mrp = parseFloat(rawMrp);
      if (isNaN(mrp) || mrp < price) {
        return { error: 'MRP cannot be less than the selling price.' };
      }
    }

    let imageUrl = existingImageUrl;
    if (imageFile && imageFile.size > 0 && imageFile.name !== 'undefined') {
      imageUrl = await uploadProductImage(supabase, store.id, imageFile);
      // Clean up previous image if it was replaced
      if (existingImageUrl && existingImageUrl !== imageUrl) {
        await deleteProductImageFile(supabase, store.id, existingImageUrl);
      }
    }

    const { error: updateError } = await supabase
      .from('products')
      .update({
        name,
        category_id: categoryId,
        description,
        price,
        mrp,
        image_url: imageUrl,
        in_stock: inStock,
      })
      .eq('id', id)
      .eq('store_id', store.id);

    if (updateError) {
      if (updateError.code === '23503') {
        return { error: 'Selected category does not belong to your store.' };
      }
      return { error: updateError.message };
    }

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to update product' };
  }
}

/**
 * 1-Click Toggle Stock Availability
 */
export async function toggleStockAction(
  productId: string,
  inStock: boolean
): Promise<ProductActionResult> {
  try {
    const { supabase, store } = await getMerchantStore();

    const { error: updateError } = await supabase
      .from('products')
      .update({ in_stock: inStock })
      .eq('id', productId)
      .eq('store_id', store.id);

    if (updateError) {
      return { error: updateError.message };
    }

    revalidatePath('/dashboard/products');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to toggle stock status' };
  }
}

/**
 * Delete Product (also cleans up stored photo safely)
 */
export async function deleteProductAction(productId: string): Promise<ProductActionResult> {
  try {
    const { supabase, store } = await getMerchantStore();

    // Fetch product to find its image_url
    const { data: product } = await supabase
      .from('products')
      .select('image_url')
      .eq('id', productId)
      .eq('store_id', store.id)
      .single();

    const { error: deleteError } = await supabase
      .from('products')
      .delete()
      .eq('id', productId)
      .eq('store_id', store.id);

    if (deleteError) {
      return { error: deleteError.message };
    }

    // Clean up file if present
    if (product?.image_url) {
      await deleteProductImageFile(supabase, store.id, product.image_url);
    }

    revalidatePath('/dashboard/products');
    revalidatePath('/dashboard/categories');
    revalidatePath('/dashboard');
    return { success: true };
  } catch (err: unknown) {
    return { error: err instanceof Error ? err.message : 'Failed to delete product' };
  }
}
