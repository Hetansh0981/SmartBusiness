import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/DashboardNav';
import ProductCatalog from './ProductCatalog';
import type { Product, Category } from '@/types';

export const instant = false;

export const metadata: Metadata = {
  title: 'Products — DukaanOS',
  description: 'Manage products, prices, photos, and stock availability.',
};

export default async function ProductsPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: store } = await supabase
    .from('stores')
    .select('id, name, slug')
    .eq('owner_id', user.id)
    .single();

  if (!store) {
    redirect('/onboarding');
  }

  // Fetch categories for this store
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .eq('store_id', store.id)
    .order('name', { ascending: true });

  const categories: Category[] = categoriesData || [];

  // Fetch products for this store
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  const products: Product[] = productsData || [];

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col">
      <DashboardNav
        storeName={store.name}
        storeSlug={store.slug}
        userEmail={user.email || ''}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <ProductCatalog initialProducts={products} categories={categories} />
      </main>
    </div>
  );
}
