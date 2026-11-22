/**
 * Core TypeScript definitions for DukaanOS
 */

export interface Store {
  id: string;
  owner_id: string;
  name: string;
  slug: string;
  category: string;
  whatsapp_number: string;
  city: string;
  state: string;
  is_published: boolean;
  default_language?: 'en' | 'hi';
  created_at: string;
  updated_at: string;
}

/**
 * Public store representation for anonymous shoppers
 * NOTE: owner_id is strictly omitted
 */
export interface PublicStore {
  id: string;
  name: string;
  slug: string;
  category: string;
  whatsapp_number: string;
  city: string;
  state: string;
  is_published: boolean;
  default_language?: 'en' | 'hi';
  created_at: string;
}

export interface Category {
  id: string;
  store_id: string;
  name: string;
  slug: string;
  created_at: string;
  updated_at: string;
  product_count?: number;
}

export interface Product {
  id: string;
  store_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  price: number;
  mrp: number | null;
  image_url: string | null;
  in_stock: boolean;
  created_at: string;
  updated_at: string;
  category?: Category | null;
}

export type OrderStatus =
  | 'PENDING'
  | 'CONFIRMED'
  | 'PROCESSING'
  | 'READY_FOR_PICKUP'
  | 'SHIPPED'
  | 'DELIVERED'
  | 'CANCELLED';

export type PaymentMethod = 'COD' | 'ONLINE';
export type PaymentStatus = 'PENDING' | 'PAID' | 'FAILED';
export type OrderChannel = 'WEBSITE' | 'WHATSAPP';
export type DeliveryMode = 'DELIVERY' | 'PICKUP';

export interface OrderItem {
  id: string;
  order_id: string;
  store_id: string;
  product_id: string | null;
  product_name: string;
  price: number;
  quantity: number;
  total: number;
  created_at: string;
}

export interface Order {
  id: string;
  store_id: string;
  order_reference: string;
  idempotency_key: string | null;
  customer_name: string;
  customer_phone: string;
  delivery_mode: DeliveryMode;
  delivery_address: string | null;
  delivery_city: string | null;
  delivery_state: string | null;
  delivery_pincode: string | null;
  customer_notes: string | null;
  order_channel: OrderChannel;
  payment_method: PaymentMethod;
  payment_status: PaymentStatus;
  status: OrderStatus;
  subtotal: number;
  delivery_fee: number;
  total_amount: number;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  imageUrl?: string | null;
  quantity: number;
}
