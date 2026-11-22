import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import EditorClient from './EditorClient';
import { getCustomizationData } from './actions';
import type { PublicStore, Category, Product } from '@/types';

export const instant = false;

export const metadata: Metadata = {
  title: 'Visual Storefront Editor — DukaanOS',
  description: 'Customize and preview your public digital storefront.',
};

export default async function CustomizerPage() {
  await connection();
  const supabase = await createClient();

  // 1. Authenticate merchant
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect('/login');
  }

  // 2. Fetch merchant's owned store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('id, name, slug, category, whatsapp_number, city, state, is_published, created_at')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (storeError || !store) {
    redirect('/onboarding');
  }

  const publicStore = store as PublicStore;

  // 3. Parallel fetch categories, products, and customization record
  const [categoriesRes, productsRes, customData] = await Promise.all([
    supabase
      .from('categories')
      .select('*')
      .eq('store_id', publicStore.id)
      .order('name', { ascending: true }),
    supabase
      .from('products')
      .select('*')
      .eq('store_id', publicStore.id)
      .order('created_at', { ascending: false }),
    getCustomizationData(publicStore.id),
  ]);

  const categories: Category[] = categoriesRes.data || [];
  const products: Product[] = productsRes.data || [];

  return (
    <EditorClient
      store={publicStore}
      categories={categories}
      products={products}
      initialCustomization={customData.customization}
      initialVersions={customData.versions}
    />
  );
}
