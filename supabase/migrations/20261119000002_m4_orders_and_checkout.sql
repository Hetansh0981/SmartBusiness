-- ==============================================================================
-- DukaanOS — Migration: Milestone 4 (Hardened Orders, Items, Concurrency & RPC)
-- File: supabase/migrations/20261119000002_m4_orders_and_checkout.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table Definitions (Idempotent & Migration-Safe)
-- ------------------------------------------------------------------------------

-- Orders Table
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  -- ON DELETE RESTRICT prevents accidental or silent deletion of stores with historical legal orders
  store_id uuid not null references public.stores(id) on delete restrict,
  order_reference text not null unique,
  idempotency_key text,
  customer_name text not null,
  customer_phone text not null,
  delivery_mode text not null default 'DELIVERY' check (delivery_mode in ('DELIVERY', 'PICKUP')),
  delivery_address text,
  delivery_city text,
  delivery_state text,
  delivery_pincode text,
  customer_notes text,
  order_channel text not null default 'WEBSITE' check (order_channel in ('WEBSITE', 'WHATSAPP')),
  payment_method text not null default 'COD' check (payment_method in ('COD', 'ONLINE')),
  payment_status text not null default 'PENDING' check (payment_status in ('PENDING', 'PAID', 'FAILED')),
  status text not null default 'PENDING' check (status in (
    'PENDING',
    'CONFIRMED',
    'PROCESSING',
    'READY_FOR_PICKUP',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED'
  )),
  subtotal numeric(10, 2) not null check (subtotal >= 0),
  delivery_fee numeric(10, 2) not null default 0.00 check (delivery_fee >= 0),
  total_amount numeric(10, 2) not null check (total_amount >= 0),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now()
);

-- Idempotent constraint management (prevents 42710 "already exists" errors)
alter table public.orders drop constraint if exists orders_total_amount_check;
alter table public.orders drop constraint if exists orders_total_calculation_check;
alter table public.orders add constraint orders_total_calculation_check 
  check (total_amount = (subtotal + delivery_fee));

alter table public.orders drop constraint if exists orders_id_store_id_unique cascade;
alter table public.orders add constraint orders_id_store_id_unique 
  unique (id, store_id);

-- Clean up any legacy single-column idempotency unique constraint if present
alter table public.orders drop constraint if exists orders_idempotency_key_key;
alter table public.orders drop constraint if exists orders_idempotency_key_unique;
drop index if exists public.orders_idempotency_idx;

-- Partial composite unique index on (store_id, idempotency_key) to isolate idempotency per store
create unique index if not exists orders_store_idempotency_key_idx 
  on public.orders (store_id, idempotency_key) 
  where idempotency_key is not null;

create index if not exists orders_store_id_idx on public.orders (store_id);
create index if not exists orders_store_status_idx on public.orders (store_id, status);
create index if not exists orders_created_at_idx on public.orders (created_at desc);

-- Automatic updated_at trigger (uses existing public.handle_updated_at from M2)
drop trigger if exists set_orders_updated_at on public.orders;
create trigger set_orders_updated_at
  before update on public.orders
  for each row execute function public.handle_updated_at();


-- Order Items Table
create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null,
  store_id uuid not null,
  -- Product references: on delete set null preserves immutable financial snapshots
  product_id uuid references public.products(id) on delete set null,
  product_name text not null,
  price numeric(10, 2) not null check (price >= 0),
  quantity integer not null check (quantity > 0),
  total numeric(10, 2) not null check (total >= 0),
  created_at timestamp with time zone not null default now()
);

-- Composite foreign key guarantees an item strictly belongs to the same store as its order
alter table public.order_items drop constraint if exists fk_order_items_order_store;
alter table public.order_items add constraint fk_order_items_order_store
  foreign key (order_id, store_id)
  references public.orders (id, store_id)
  on delete cascade;

create index if not exists order_items_order_id_idx on public.order_items (order_id);
create index if not exists order_items_store_id_idx on public.order_items (store_id);


-- ------------------------------------------------------------------------------
-- 2. Security Triggers & Status Machine
-- ------------------------------------------------------------------------------

create or replace function public.validate_order_update_trigger()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  -- Enforce complete immutability of core relationship, identification, and financial data
  if new.id <> old.id then
    raise exception 'Order ID cannot be modified' using errcode = '42501';
  end if;

  if new.store_id <> old.store_id then
    raise exception 'Order store association cannot be modified' using errcode = '42501';
  end if;

  if new.order_reference <> old.order_reference then
    raise exception 'Order reference cannot be modified' using errcode = '42501';
  end if;

  if new.idempotency_key is distinct from old.idempotency_key then
    raise exception 'Idempotency key cannot be modified' using errcode = '42501';
  end if;

  if new.customer_name <> old.customer_name or new.customer_phone <> old.customer_phone then
    raise exception 'Customer details cannot be modified' using errcode = '42501';
  end if;

  if new.delivery_mode <> old.delivery_mode or
     new.delivery_address is distinct from old.delivery_address or
     new.delivery_city is distinct from old.delivery_city or
     new.delivery_state is distinct from old.delivery_state or
     new.delivery_pincode is distinct from old.delivery_pincode or
     new.customer_notes is distinct from old.customer_notes then
    raise exception 'Delivery details cannot be modified' using errcode = '42501';
  end if;

  if new.subtotal <> old.subtotal or new.delivery_fee <> old.delivery_fee or new.total_amount <> old.total_amount then
    raise exception 'Financial snapshot amounts cannot be modified' using errcode = '42501';
  end if;

  if new.payment_method <> old.payment_method then
    raise exception 'Payment method cannot be modified' using errcode = '42501';
  end if;

  -- Payment status cannot be altered directly by merchants in Milestone 4
  if new.payment_status <> old.payment_status then
    raise exception 'Merchants cannot modify payment_status directly' using errcode = '42501';
  end if;

  if new.order_channel <> old.order_channel then
    raise exception 'Order channel cannot be modified' using errcode = '42501';
  end if;

  if new.created_at <> old.created_at then
    raise exception 'Order creation timestamp cannot be modified' using errcode = '42501';
  end if;

  -- Finite State Machine for Order Lifecycle
  if old.status <> new.status then
    -- Terminal states cannot transition further
    if old.status in ('DELIVERED', 'CANCELLED') then
      raise exception 'Cannot transition order from terminal state % to %', old.status, new.status using errcode = '22000';
    end if;

    -- Permitted transition whitelist
    if old.status = 'PENDING' and new.status not in ('CONFIRMED', 'CANCELLED') then
      raise exception 'Pending orders can only transition to CONFIRMED or CANCELLED' using errcode = '22000';
    elsif old.status = 'CONFIRMED' and new.status not in ('PROCESSING', 'READY_FOR_PICKUP', 'SHIPPED', 'CANCELLED') then
      raise exception 'Confirmed orders can only transition to PROCESSING, READY_FOR_PICKUP, SHIPPED or CANCELLED' using errcode = '22000';
    elsif old.status = 'PROCESSING' and new.status not in ('READY_FOR_PICKUP', 'SHIPPED', 'CANCELLED') then
      raise exception 'Processing orders can only transition to READY_FOR_PICKUP, SHIPPED or CANCELLED' using errcode = '22000';
    elsif old.status = 'READY_FOR_PICKUP' and new.status not in ('DELIVERED', 'CANCELLED') then
      raise exception 'Ready orders can only transition to DELIVERED or CANCELLED' using errcode = '22000';
    elsif old.status = 'SHIPPED' and new.status not in ('DELIVERED', 'CANCELLED') then
      raise exception 'Shipped orders can only transition to DELIVERED or CANCELLED' using errcode = '22000';
    end if;
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_order_update_safety on public.orders;
create trigger enforce_order_update_safety
  before update on public.orders
  for each row execute function public.validate_order_update_trigger();

revoke all on function public.validate_order_update_trigger() from public, anon, authenticated;


-- ------------------------------------------------------------------------------
-- 3. Hardened Atomic Order Creation RPC Function
-- ------------------------------------------------------------------------------

create or replace function public.create_order(
  p_store_id uuid,
  p_idempotency_key text,
  p_customer_name text,
  p_customer_phone text,
  p_delivery_mode text,
  p_delivery_address text default null,
  p_delivery_city text default null,
  p_delivery_state text default null,
  p_delivery_pincode text default null,
  p_customer_notes text default null,
  p_order_channel text default 'WEBSITE',
  p_items jsonb default '[]'::jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_store record;
  v_existing_order record;
  v_clean_phone text;
  v_clean_name text;
  v_clean_idempotency text;
  v_clean_notes text;
  v_clean_address text;
  v_clean_city text;
  v_clean_state text;
  v_clean_pincode text;
  v_subtotal numeric(10, 2) := 0.00;
  v_delivery_fee numeric(10, 2) := 0.00;
  v_total_amount numeric(10, 2) := 0.00;
  v_order_reference text;
  v_order_id uuid;
  v_cart_item record;
  v_product record;
  v_line_total numeric(10, 2);
  v_attempts int := 0;
  v_validated_items jsonb := '[]'::jsonb;
  v_raw_item jsonb;
begin
  -- 1. Input Sanitization & Format Checks
  v_clean_name := pg_catalog.btrim(coalesce(p_customer_name, ''));
  v_clean_idempotency := nullif(pg_catalog.btrim(coalesce(p_idempotency_key, '')), '');
  v_clean_notes := nullif(pg_catalog.btrim(coalesce(p_customer_notes, '')), '');

  -- 2. Customer Name Validation (2 to 100 characters)
  if pg_catalog.length(v_clean_name) < 2 or pg_catalog.length(v_clean_name) > 100 then
    raise exception 'Customer name must be between 2 and 100 characters' using errcode = '22000';
  end if;

  -- 3. Indian Mobile Number Validation
  -- Accept 10 digits beginning with 6-9, or 12 digits beginning with 91 followed by a 10-digit number starting with 6-9
  v_clean_phone := pg_catalog.regexp_replace(coalesce(p_customer_phone, ''), '\D', '', 'g');
  if v_clean_phone ~ '^91[6-9][0-9]{9}$' then
    v_clean_phone := pg_catalog.substr(v_clean_phone, 3, 10);
  elsif v_clean_phone !~ '^[6-9][0-9]{9}$' then
    raise exception 'Valid Indian mobile number is required (10 digits starting with 6, 7, 8, or 9)' using errcode = '22000';
  end if;

  -- 4. Idempotency Key Validation (8 to 128 chars, alphanumeric, hyphens, underscores)
  if v_clean_idempotency is not null then
    if pg_catalog.length(v_clean_idempotency) < 8 or pg_catalog.length(v_clean_idempotency) > 128 then
      raise exception 'Idempotency key must be between 8 and 128 characters' using errcode = '22000';
    end if;
    if v_clean_idempotency !~ '^[a-zA-Z0-9_\-]+$' then
      raise exception 'Idempotency key contains invalid characters' using errcode = '22000';
    end if;
  end if;

  -- 5. Customer Notes Length Validation (Max 500 characters)
  if v_clean_notes is not null and pg_catalog.length(v_clean_notes) > 500 then
    raise exception 'Customer notes cannot exceed 500 characters' using errcode = '22000';
  end if;

  -- 6. Delivery Mode & Address Validation
  if p_delivery_mode not in ('DELIVERY', 'PICKUP') then
    raise exception 'Invalid delivery mode: %', p_delivery_mode using errcode = '22000';
  end if;

  if p_delivery_mode = 'DELIVERY' then
    v_clean_address := pg_catalog.btrim(coalesce(p_delivery_address, ''));
    v_clean_city := pg_catalog.btrim(coalesce(p_delivery_city, ''));
    v_clean_state := pg_catalog.btrim(coalesce(p_delivery_state, ''));
    v_clean_pincode := pg_catalog.btrim(coalesce(p_delivery_pincode, ''));

    if pg_catalog.length(v_clean_address) < 5 or pg_catalog.length(v_clean_address) > 300 then
      raise exception 'Delivery address must be between 5 and 300 characters' using errcode = '22000';
    end if;
    if pg_catalog.length(v_clean_city) < 2 or pg_catalog.length(v_clean_city) > 100 then
      raise exception 'City must be between 2 and 100 characters' using errcode = '22000';
    end if;
    if pg_catalog.length(v_clean_state) < 2 or pg_catalog.length(v_clean_state) > 100 then
      raise exception 'State must be between 2 and 100 characters' using errcode = '22000';
    end if;
    if v_clean_pincode !~ '^[1-9][0-9]{5}$' then
      raise exception 'Valid 6-digit Indian postal PIN code is required' using errcode = '22000';
    end if;
  else
    v_clean_address := null;
    v_clean_city := null;
    v_clean_state := null;
    v_clean_pincode := null;
  end if;

  -- 7. Order Channel Validation
  if p_order_channel not in ('WEBSITE', 'WHATSAPP') then
    raise exception 'Invalid order channel: %', p_order_channel using errcode = '22000';
  end if;

  -- 8. Concurrency-Safe Store-Isolated Idempotency Lock & Lookup
  if v_clean_idempotency is not null then
    -- Transaction-scoped advisory lock serializes concurrent duplicate requests for this specific store & key
    perform pg_catalog.pg_advisory_xact_lock(
      pg_catalog.hashtext(p_store_id::text),
      pg_catalog.hashtext(v_clean_idempotency)
    );

    -- Composite query: checks both store_id and idempotency_key
    select 
      o.id, o.order_reference, o.subtotal, o.delivery_fee, o.total_amount,
      o.delivery_mode, o.status, o.payment_status, o.payment_method, o.order_channel, o.created_at
    into v_existing_order
    from public.orders o
    where o.store_id = p_store_id
      and o.idempotency_key = v_clean_idempotency;

    if found then
      return pg_catalog.jsonb_build_object(
        'success', true,
        'idempotent', true,
        'order_id', v_existing_order.id,
        'order_reference', v_existing_order.order_reference,
        'subtotal', v_existing_order.subtotal,
        'delivery_fee', v_existing_order.delivery_fee,
        'total_amount', v_existing_order.total_amount,
        'delivery_mode', v_existing_order.delivery_mode,
        'status', v_existing_order.status,
        'payment_status', v_existing_order.payment_status,
        'payment_method', v_existing_order.payment_method,
        'order_channel', v_existing_order.order_channel,
        'created_at', v_existing_order.created_at
      );
    end if;
  end if;

  -- 9. Store Existence & Publication Validation
  select s.id, s.is_published, s.name into v_store
  from public.stores s
  where s.id = p_store_id;

  if not found then
    raise exception 'Store with ID % does not exist', p_store_id using errcode = 'P0002';
  end if;

  if not v_store.is_published then
    raise exception 'Store is currently unpublished and not accepting orders' using errcode = 'P0003';
  end if;

  -- 10. Order Items Payload Structure Validation
  if p_items is null or pg_catalog.jsonb_typeof(p_items) <> 'array' or pg_catalog.jsonb_array_length(p_items) = 0 then
    raise exception 'Cart must contain at least one item' using errcode = '22000';
  end if;

  if pg_catalog.jsonb_array_length(p_items) > 50 then
    raise exception 'Cart cannot exceed 50 items' using errcode = '22000';
  end if;

  for v_raw_item in select * from pg_catalog.jsonb_array_elements(p_items)
  loop
    if not (v_raw_item ? 'product_id' and v_raw_item ? 'quantity') then
      raise exception 'Each cart item must have product_id and quantity' using errcode = '22000';
    end if;
    if (v_raw_item->>'product_id') !~ '^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$' then
      raise exception 'Invalid product UUID format' using errcode = '22000';
    end if;
    if (v_raw_item->>'quantity') !~ '^[1-9][0-9]*$' then
      raise exception 'Item quantity must be a positive integer' using errcode = '22000';
    end if;
  end loop;

  -- 11. Combine Duplicate Product IDs & Lock Rows FOR SHARE in Deterministic Order
  for v_cart_item in (
    select 
      (raw_item->>'product_id')::uuid as product_id,
      sum((raw_item->>'quantity')::int)::int as quantity
    from pg_catalog.jsonb_array_elements(p_items) as raw_item
    group by (raw_item->>'product_id')::uuid
    order by (raw_item->>'product_id')::uuid asc
  ) loop
    if v_cart_item.quantity < 1 or v_cart_item.quantity > 100 then
      raise exception 'Combined item quantity must be between 1 and 100' using errcode = '22000';
    end if;

    -- Row-level FOR SHARE lock prevents concurrent price updates or deletions until checkout completes
    select p.id, p.store_id, p.name, p.price, p.in_stock
    into v_product
    from public.products p
    where p.id = v_cart_item.product_id
    for share;

    if not found then
      raise exception 'Product % does not exist', v_cart_item.product_id using errcode = 'P0002';
    end if;

    if v_product.store_id <> p_store_id then
      raise exception 'Security violation: Product % does not belong to store %', v_cart_item.product_id, p_store_id using errcode = '42501';
    end if;

    if not v_product.in_stock then
      raise exception 'Product "%" is currently out of stock', v_product.name using errcode = '22000';
    end if;

    -- Compute line total using authoritative locked product price
    v_line_total := pg_catalog.round((v_product.price * v_cart_item.quantity)::numeric, 2);
    v_subtotal := v_subtotal + v_line_total;

    -- Buffer validated item snapshot to ensure subtotal and order_items use identical values
    v_validated_items := v_validated_items || pg_catalog.jsonb_build_object(
      'product_id', v_product.id,
      'product_name', v_product.name,
      'price', v_product.price,
      'quantity', v_cart_item.quantity,
      'total', v_line_total
    );
  end loop;

  -- Server computes delivery fee and authoritative total
  v_delivery_fee := 0.00;
  v_total_amount := v_subtotal + v_delivery_fee;

  -- 12. Unique Collision-Resistant Order Reference Generation (DK-YYMM-XXXXXX)
  loop
    v_attempts := v_attempts + 1;
    v_order_reference := 'DK-' || pg_catalog.to_char(pg_catalog.now(), 'YYMM') || '-' || pg_catalog.upper(pg_catalog.substr(pg_catalog.md5(pg_catalog.gen_random_uuid()::text), 1, 6));

    exit when not exists (
      select 1 from public.orders where order_reference = v_order_reference
    );

    if v_attempts > 5 then
      v_order_reference := 'DK-' || pg_catalog.to_char(pg_catalog.now(), 'YYMM') || '-' || pg_catalog.upper(pg_catalog.substr(pg_catalog.md5(pg_catalog.clock_timestamp()::text || pg_catalog.gen_random_uuid()::text), 1, 8));
      exit;
    end if;
  end loop;

  -- 13. Atomic Order Insertion
  insert into public.orders (
    store_id,
    order_reference,
    idempotency_key,
    customer_name,
    customer_phone,
    delivery_mode,
    delivery_address,
    delivery_city,
    delivery_state,
    delivery_pincode,
    customer_notes,
    order_channel,
    payment_method,
    payment_status,
    status,
    subtotal,
    delivery_fee,
    total_amount
  ) values (
    p_store_id,
    v_order_reference,
    v_clean_idempotency,
    v_clean_name,
    v_clean_phone,
    p_delivery_mode,
    v_clean_address,
    v_clean_city,
    v_clean_state,
    v_clean_pincode,
    v_clean_notes,
    p_order_channel,
    'COD',
    'PENDING',
    'PENDING',
    v_subtotal,
    v_delivery_fee,
    v_total_amount
  ) returning id into v_order_id;

  -- 14. Atomic Order Items Insertion from Validated Buffer
  for v_cart_item in select * from pg_catalog.jsonb_to_recordset(v_validated_items) as (
    product_id uuid,
    product_name text,
    price numeric(10, 2),
    quantity int,
    total numeric(10, 2)
  ) loop
    insert into public.order_items (
      order_id,
      store_id,
      product_id,
      product_name,
      price,
      quantity,
      total
    ) values (
      v_order_id,
      p_store_id,
      v_cart_item.product_id,
      v_cart_item.product_name,
      v_cart_item.price,
      v_cart_item.quantity,
      v_cart_item.total
    );
  end loop;

  -- 15. Return Sanitized Order Confirmation Summary
  return pg_catalog.jsonb_build_object(
    'success', true,
    'idempotent', false,
    'order_id', v_order_id,
    'order_reference', v_order_reference,
    'subtotal', v_subtotal,
    'delivery_fee', v_delivery_fee,
    'total_amount', v_total_amount,
    'delivery_mode', p_delivery_mode,
    'status', 'PENDING',
    'payment_status', 'PENDING',
    'payment_method', 'COD',
    'order_channel', p_order_channel,
    'created_at', pg_catalog.now()
  );
end;
$$;


-- ------------------------------------------------------------------------------
-- 4. Explicit Permissions, Grants & Revocations
-- ------------------------------------------------------------------------------

-- Explicitly revoke default execution on create_order from PUBLIC
revoke execute on function public.create_order(
  uuid, text, text, text, text, text, text, text, text, text, text, jsonb
) from public;

-- Grant execution strictly to the intended anon and authenticated roles
grant execute on function public.create_order(
  uuid, text, text, text, text, text, text, text, text, text, text, jsonb
) to anon, authenticated;

-- Revoke all table-level access from PUBLIC, anon, and authenticated
revoke all on table public.orders from public, anon, authenticated;
revoke all on table public.order_items from public, anon, authenticated;

-- Grant authenticated merchants SELECT on orders and order_items
grant select on table public.orders to authenticated;
grant select on table public.order_items to authenticated;

-- Grant authenticated merchants UPDATE strictly on the (status) column
-- (updated_at is handled internally by the handle_updated_at trigger)
grant update (status) on table public.orders to authenticated;


-- ------------------------------------------------------------------------------
-- 5. Row Level Security Policies
-- ------------------------------------------------------------------------------

alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "Merchants can view orders for their own stores" on public.orders;
create policy "Merchants can view orders for their own stores"
  on public.orders for select
  to authenticated
  using (
    store_id in (
      select id from public.stores where owner_id = (select auth.uid())
    )
  );

drop policy if exists "Merchants can update order status for their own stores" on public.orders;
create policy "Merchants can update order status for their own stores"
  on public.orders for update
  to authenticated
  using (
    store_id in (
      select id from public.stores where owner_id = (select auth.uid())
    )
  )
  with check (
    store_id in (
      select id from public.stores where owner_id = (select auth.uid())
    )
  );

drop policy if exists "Merchants can view order items for their own stores" on public.order_items;
create policy "Merchants can view order items for their own stores"
  on public.order_items for select
  to authenticated
  using (
    store_id in (
      select id from public.stores where owner_id = (select auth.uid())
    )
  );
