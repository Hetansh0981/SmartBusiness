import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/DashboardNav';
import CategoryManager from './CategoryManager';
import type { Category } from '@/types';

export const instant = false;

export const metadata: Metadata = {
  title: 'Categories — DukaanOS',
  description: 'Manage product categories for your store.',
};

export default async function CategoriesPage() {
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

  // Fetch categories with product counts
  const { data: rawCategories } = await supabase
    .from('categories')
    .select('*, products(count)')
    .eq('store_id', store.id)
    .order('name', { ascending: true });

  const categories: Category[] = (rawCategories || []).map((cat) => ({
    id: cat.id,
    store_id: cat.store_id,
    name: cat.name,
    slug: cat.slug,
    created_at: cat.created_at,
    updated_at: cat.updated_at,
    product_count: (cat.products as unknown as [{ count: number }])?.[0]?.count ?? 0,
  }));

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col">
      <DashboardNav
        storeName={store.name}
        storeSlug={store.slug}
        userEmail={user.email || ''}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <CategoryManager categories={categories} />
      </main>
    </div>
  );
}
