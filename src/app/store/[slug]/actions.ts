'use server';

import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';

const OrderItemSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  quantity: z.number().int().min(1).max(100),
});

const PlaceOrderSchema = z.object({
  storeId: z.string().uuid('Invalid store ID'),
  idempotencyKey: z.string().min(8).max(128).regex(/^[a-zA-Z0-9_\-]+$/, 'Invalid idempotency key format'),
  customerName: z.string().min(2, 'Name must be at least 2 characters').max(100),
  customerPhone: z.string().min(10, 'Valid Indian phone number is required'),
  deliveryMode: z.enum(['DELIVERY', 'PICKUP']),
  deliveryAddress: z.string().optional().nullable(),
  deliveryCity: z.string().optional().nullable(),
  deliveryState: z.string().optional().nullable(),
  deliveryPincode: z.string().optional().nullable(),
  customerNotes: z.string().max(500).optional().nullable(),
  orderChannel: z.enum(['WEBSITE', 'WHATSAPP']).default('WEBSITE'),
  items: z.array(OrderItemSchema).min(1, 'Cart cannot be empty'),
});

export type PlaceOrderInput = z.infer<typeof PlaceOrderSchema>;

export interface OrderResult {
  success: boolean;
  order?: {
    order_id: string;
    order_reference: string;
    subtotal: number;
    delivery_fee: number;
    total_amount: number;
    delivery_mode: 'DELIVERY' | 'PICKUP';
    status: string;
    payment_status: string;
    payment_method: string;
    order_channel: string;
    created_at: string;
    idempotent?: boolean;
  };
  error?: string;
}

export async function placeOrderAction(input: PlaceOrderInput): Promise<OrderResult> {
  try {
    const validated = PlaceOrderSchema.parse(input);

    // Delivery-specific validations
    if (validated.deliveryMode === 'DELIVERY') {
      if (!validated.deliveryAddress || validated.deliveryAddress.trim().length < 5) {
        return { success: false, error: 'Full delivery address is required (at least 5 characters).' };
      }
      if (!validated.deliveryCity || validated.deliveryCity.trim().length < 2) {
        return { success: false, error: 'City is required for delivery.' };
      }
      if (!validated.deliveryState || validated.deliveryState.trim().length < 2) {
        return { success: false, error: 'State is required for delivery.' };
      }
      if (!validated.deliveryPincode || !/^[1-9][0-9]{5}$/.test(validated.deliveryPincode.trim())) {
        return { success: false, error: 'A valid 6-digit Indian postal PIN code is required.' };
      }
    }

    const supabase = await createClient();

    // Map items to database payload
    const rpcItems = validated.items.map((i) => ({
      product_id: i.productId,
      quantity: i.quantity,
    }));

    const { data, error } = await supabase.rpc('create_order', {
      p_store_id: validated.storeId,
      p_idempotency_key: validated.idempotencyKey,
      p_customer_name: validated.customerName,
      p_customer_phone: validated.customerPhone,
      p_delivery_mode: validated.deliveryMode,
      p_delivery_address: validated.deliveryMode === 'DELIVERY' ? validated.deliveryAddress : null,
      p_delivery_city: validated.deliveryMode === 'DELIVERY' ? validated.deliveryCity : null,
      p_delivery_state: validated.deliveryMode === 'DELIVERY' ? validated.deliveryState : null,
      p_delivery_pincode: validated.deliveryMode === 'DELIVERY' ? validated.deliveryPincode : null,
      p_customer_notes: validated.customerNotes || null,
      p_order_channel: validated.orderChannel,
      p_items: rpcItems,
    });

    if (error) {
      console.error('Create Order RPC Error:', error);
      return { success: false, error: error.message || 'Failed to place order. Please try again.' };
    }

    return {
      success: true,
      order: data,
    };
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return { success: false, error: err.issues[0]?.message || 'Validation error' };
    }
    const message = err instanceof Error ? err.message : 'An unexpected error occurred.';
    return { success: false, error: message };
  }
}
