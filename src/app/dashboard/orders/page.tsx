import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { connection } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import DashboardNav from '@/components/DashboardNav';
import OrdersClientView from './OrdersClientView';
import type { Order } from '@/types';

export const instant = false;

export const metadata: Metadata = {
  title: 'Orders Management — DukaanOS',
  description: 'Manage, track and fulfil customer orders for your digital storefront.',
};

export default async function OrdersPage() {
  await connection();
  const supabase = await createClient();

  // 1. Authenticate merchant
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login');
  }

  // 2. Fetch merchant store
  const { data: store, error: storeError } = await supabase
    .from('stores')
    .select('*')
    .eq('owner_id', user.id)
    .maybeSingle();

  if (!store || storeError) {
    redirect('/onboarding');
  }

  // 3. Fetch all orders with associated items
  // Note: Scoped strictly to store.id and protected by RLS
  const { data: ordersData, error: ordersError } = await supabase
    .from('orders')
    .select('*, order_items(*)')
    .eq('store_id', store.id)
    .order('created_at', { ascending: false });

  if (ordersError) {
    console.error('Failed to fetch orders:', ordersError);
  }

  const orders: Order[] = (ordersData as Order[]) || [];

  return (
    <div className="min-h-screen bg-[#f9f9ff] text-[#151c27] flex flex-col">
      {/* Top Merchant Navigation */}
      <DashboardNav
        storeName={store.name}
        storeSlug={store.slug}
        userEmail={user.email || ''}
      />

      {/* Main Content Workspace */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        <OrdersClientView initialOrders={orders} storeName={store.name} />
      </main>
    </div>
  );
}
