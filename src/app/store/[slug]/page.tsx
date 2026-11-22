import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import StorefrontView from './StorefrontView';
import { getDefaultStorefrontConfig } from '@/lib/customizer/defaultConfig';
import { getShopperLocale } from '@/lib/i18n/server';
import type { PublicStore, Category, Product } from '@/types';
import type { StorefrontConfig } from '@/types/customizer';

export const instant = false;

interface StorePageProps {
  params: Promise<{
    slug: string;
  }>;
}

/**
 * Dynamic Metadata for SEO & Social Previews
 */
export async function generateMetadata({ params }: StorePageProps): Promise<Metadata> {
  await connection();
  const { slug } = await params;
  const supabase = await createClient();

  // Exclude owner_id; fetch only public store details
  const { data: store } = await supabase
    .from('stores')
    .select('name, city, state, is_published')
    .eq('slug', slug)
    .maybeSingle();

  if (!store || !store.is_published) {
    return {
      title: 'Store Not Found — DukaanOS',
      description: 'The requested merchant store could not be found.',
    };
  }

  return {
    title: `${store.name} — Shop Online (${store.city}, ${store.state})`,
    description: `Browse items, check prices in INR, and order directly via WhatsApp from ${store.name} in ${store.city}, ${store.state}.`,
    openGraph: {
      title: store.name,
      description: `Official digital storefront for ${store.name} on DukaanOS.`,
    },
  };
}

export default async function StorePage({ params }: StorePageProps) {
  await connection();
  const { slug } = await params;
  const supabase = await createClient();

  // 1. Fetch store by slug — Strictly omitting owner_id for security
  const { data: storeData } = await supabase
    .from('stores')
    .select('id, name, slug, category, whatsapp_number, city, state, is_published, created_at')
    .eq('slug', slug)
    .maybeSingle();

  // 2. Validate store existence and publication status
  if (!storeData || !storeData.is_published) {
    notFound();
  }

  const store = storeData as PublicStore;

  // 3. Fetch categories, products, and published customization in parallel
  const categoriesPromise = supabase
    .from('categories')
    .select('*')
    .eq('store_id', store.id)
    .order('name', { ascending: true });

  const productsPromise = supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  const customizationPromise = supabase
    .from('store_customizations')
    .select('published_config')
    .eq('store_id', store.id)
    .maybeSingle();

  const [categoriesRes, productsRes, customizationRes] = await Promise.all([
    categoriesPromise,
    productsPromise,
    customizationPromise,
  ]);

  const categories: Category[] = categoriesRes.data || [];
  const products: Product[] = productsRes.data || [];

  // Zero-downtime fallback to category defaults if no customization published yet
  const config: StorefrontConfig =
    (customizationRes.data?.published_config as unknown as StorefrontConfig) ||
    getDefaultStorefrontConfig(store);

  const initialLocale = await getShopperLocale((storeData as any)?.default_language);

  return (
    <StorefrontView
      store={store}
      categories={categories}
      products={products}
      config={config}
      initialLocale={initialLocale}
    />
  );
}
