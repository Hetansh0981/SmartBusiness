'use server';

import { createClient } from '@/lib/supabase/server';
import { StorefrontConfigSchema } from '@/lib/customizer/schema';
import { getDefaultStorefrontConfig } from '@/lib/customizer/defaultConfig';
import type { StorefrontConfig, StoreCustomization, StoreCustomizationVersion } from '@/types/customizer';
import type { Store } from '@/types';

/**
 * Verify merchant owns store and return user & store
 */
async function verifyStoreOwner(storeId: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    throw new Error('Authentication required');
  }

  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('id', storeId)
    .eq('owner_id', user.id)
    .single();

  if (error || !store) {
    throw new Error('Unauthorized: Store not found or not owned by user');
  }

  return { supabase, user, store: store as Store };
}

/**
 * Load or initialize customization record for store
 */
export async function getCustomizationData(storeId: string) {
  const { supabase, store } = await verifyStoreOwner(storeId);

  const defaultConfig = getDefaultStorefrontConfig(store);

  // Call the atomic get_or_init RPC
  const { data, error } = await supabase.rpc('get_or_init_store_customization', {
    p_store_id: storeId,
    p_default_config: defaultConfig,
  });

  if (error) {
    throw new Error(`Failed to initialize customization: ${error.message}`);
  }

  // Fetch version history (up to 50 snapshots)
  const { data: versions } = await supabase
    .from('store_customization_versions')
    .select('*')
    .eq('store_id', storeId)
    .order('version', { ascending: false })
    .limit(50);

  return {
    customization: data as StoreCustomization,
    versions: (versions || []) as StoreCustomizationVersion[],
  };
}

/**
 * Optimistically save draft configuration
 */
export async function saveDraftAction(
  storeId: string,
  config: StorefrontConfig,
  expectedRevision: number
) {
  const { supabase } = await verifyStoreOwner(storeId);

  // Validate on server via strict Zod
  const validatedConfig = StorefrontConfigSchema.parse(config);

  const { data, error } = await supabase.rpc('save_draft_customization', {
    p_store_id: storeId,
    p_draft_config: validatedConfig,
    p_expected_revision: expectedRevision,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as { success: boolean; new_revision?: number; error?: string; current_revision?: number };
}

/**
 * Atomically publish storefront configuration in single transaction
 */
export async function publishAction(
  storeId: string,
  expectedRevision: number,
  draftConfig?: StorefrontConfig
) {
  const { supabase } = await verifyStoreOwner(storeId);

  let validatedConfig: StorefrontConfig | null = null;
  if (draftConfig) {
    validatedConfig = StorefrontConfigSchema.parse(draftConfig);
  }

  const { data, error } = await supabase.rpc('publish_store_customization', {
    p_store_id: storeId,
    p_expected_revision: expectedRevision,
    p_draft_config: validatedConfig,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as {
    success: boolean;
    version?: number;
    draft_revision?: number;
    published_at?: string;
    error?: string;
    current_revision?: number;
  };
}

/**
 * Atomically roll back to historical snapshot (rolls forward to N+1)
 */
export async function rollbackAction(
  storeId: string,
  targetVersion: number,
  expectedRevision: number
) {
  const { supabase } = await verifyStoreOwner(storeId);

  const { data, error } = await supabase.rpc('rollback_store_customization', {
    p_store_id: storeId,
    p_target_version: targetVersion,
    p_expected_revision: expectedRevision,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return data as {
    success: boolean;
    restored_from_version?: number;
    new_version?: number;
    new_draft_revision?: number;
    published_at?: string;
    error?: string;
    current_revision?: number;
  };
}

/**
 * Fetch latest version snapshots for store
 */
export async function getVersionsAction(storeId: string) {
  const { supabase } = await verifyStoreOwner(storeId);

  const { data: versions, error } = await supabase
    .from('store_customization_versions')
    .select('*')
    .eq('store_id', storeId)
    .order('version', { ascending: false })
    .limit(50);

  if (error) {
    throw new Error(`Failed to fetch version history: ${error.message}`);
  }

  return (versions || []) as StoreCustomizationVersion[];
}
