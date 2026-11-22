import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/DashboardNav';
import StoreSettingsView from './StoreSettingsView';

export const instant = false;

export const metadata: Metadata = {
  title: 'Store Settings — DukaanOS',
  description: 'Manage store visibility, options, and settings.',
};

export default async function SettingsPage() {
  await connection();

  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  const { data: store, error } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!store || error) {
    redirect('/onboarding');
  }

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col">
      <DashboardNav
        storeName={store.name}
        storeSlug={store.slug}
        userEmail={user.email || ''}
      />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <StoreSettingsView store={store} />
      </main>
    </div>
  );
}
