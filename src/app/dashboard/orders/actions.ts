'use server';

import { createClient } from '@/lib/supabase/server';
import { revalidatePath } from 'next/cache';
import type { OrderStatus } from '@/types';

export async function updateOrderStatusAction(
  orderId: string,
  newStatus: OrderStatus
): Promise<{ success: boolean; error?: string }> {
  try {
    const supabase = await createClient();

    // 1. Verify merchant authentication
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return { success: false, error: 'Unauthorized. Please sign in.' };
    }

    // 2. Fetch merchant store
    const { data: store } = await supabase
      .from('stores')
      .select('id')
      .eq('owner_id', user.id)
      .maybeSingle();

    if (!store) {
      return { success: false, error: 'Store not found.' };
    }

    // 3. Update order status
    // Note: Column-level permissions and trigger ensure ONLY 'status' can be modified
    // and only valid status machine transitions are accepted.
    const { error } = await supabase
      .from('orders')
      .update({ status: newStatus })
      .eq('id', orderId)
      .eq('store_id', store.id);

    if (error) {
      console.error('Update Order Status Error:', error);
      return { success: false, error: error.message || 'Failed to update order status.' };
    }

    revalidatePath('/dashboard/orders');
    revalidatePath('/dashboard');

    return { success: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return { success: false, error: message };
  }
}
