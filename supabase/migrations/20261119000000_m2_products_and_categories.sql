-- ==============================================================================
-- DukaanOS — Migration: Milestone 2 (Products, Categories, Triggers & Storage)
-- File: supabase/migrations/20261119000000_m2_products_and_categories.sql
-- ==============================================================================

-- 1. Reusable Trigger Function for Automatic updated_at
create or replace function public.handle_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Apply updated_at trigger to existing stores table
drop trigger if exists set_stores_updated_at on public.stores;
create trigger set_stores_updated_at
  before update on public.stores
  for each row execute function public.handle_updated_at();


-- 2. Create Categories Table
create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  name text not null,
  slug text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,

  -- Required for the composite foreign key from products
  constraint categories_store_id_id_unique unique (store_id, id)
);

-- Case-insensitive uniqueness for Category Name & Slug per store
create unique index if not exists categories_store_name_lower_idx
  on public.categories (store_id, lower(name));

create unique index if not exists categories_store_slug_lower_idx
  on public.categories (store_id, lower(slug));

create index if not exists categories_store_id_idx
  on public.categories (store_id);

-- updated_at trigger for categories
drop trigger if exists set_categories_updated_at on public.categories;
create trigger set_categories_updated_at
  before update on public.categories
  for each row execute function public.handle_updated_at();


-- 3. Create Products Table with Composite Foreign Key
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  category_id uuid,
  name text not null,
  description text,
  price numeric(10, 2) not null check (price >= 0),
  mrp numeric(10, 2) check (mrp is null or mrp >= price),
  image_url text,
  in_stock boolean not null default true,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,

  -- COMPOSITE FOREIGN KEY (PostgreSQL 15+):
  -- Sets ONLY category_id to NULL on category deletion, preventing NOT NULL violations on store_id
  constraint products_store_category_fkey
    foreign key (store_id, category_id)
    references public.categories (store_id, id)
    on delete set null (category_id)
);

-- Targeted Performance Indexes
create index if not exists products_store_id_idx
  on public.products (store_id);

create index if not exists products_store_category_idx
  on public.products (store_id, category_id);

create index if not exists products_store_stock_idx
  on public.products (store_id, in_stock);

-- updated_at trigger for products
drop trigger if exists set_products_updated_at on public.products;
create trigger set_products_updated_at
  before update on public.products
  for each row execute function public.handle_updated_at();


-- 4. Enable Row Level Security (RLS)
alter table public.categories enable row level security;
alter table public.products enable row level security;

-- 5. Explicit Table Permissions (No anonymous access; only authenticated and service_role)
grant usage on schema public to authenticated, service_role;

grant select, insert, update, delete on table public.categories to authenticated;
grant all on table public.categories to service_role;

grant select, insert, update, delete on table public.products to authenticated;
grant all on table public.products to service_role;


-- 6. RLS Policies: Categories (Idempotent)
drop policy if exists "Merchants manage their own categories" on public.categories;
create policy "Merchants manage their own categories"
  on public.categories for all
  to authenticated
  using (store_id in (select id from public.stores where owner_id = auth.uid()))
  with check (store_id in (select id from public.stores where owner_id = auth.uid()));


-- 7. RLS Policies: Products (Idempotent)
drop policy if exists "Merchants manage their own products" on public.products;
create policy "Merchants manage their own products"
  on public.products for all
  to authenticated
  using (store_id in (select id from public.stores where owner_id = auth.uid()))
  with check (store_id in (select id from public.stores where owner_id = auth.uid()));


-- 8. Supabase Storage Bucket for Product Images (with 5 MB & MIME type enforcement at storage layer)
insert into storage.buckets (
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types
)
values (
  'product-images',
  'product-images',
  true,
  5242880,
  array['image/jpeg', 'image/png', 'image/webp']
)
on conflict (id) do update
set
  public = true,
  file_size_limit = 5242880,
  allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp'];


-- 9. Storage RLS Policies (Safe Text Comparison, No Fragile UUID Casting)
-- Public read access: Required so product images load on public storefronts and previews
drop policy if exists "Public product images are viewable by everyone" on storage.objects;
create policy "Public product images are viewable by everyone"
  on storage.objects for select
  using (bucket_id = 'product-images');

-- Insert: Validate first folder path matches merchant's store ID (as text)
drop policy if exists "Merchants can upload product images to their own store" on storage.objects;
create policy "Merchants can upload product images to their own store"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] in (
      select id::text from public.stores where owner_id = auth.uid()
    )
  );

-- Update: Required for upsert image replacements (both using & with check)
drop policy if exists "Merchants can update their own product images" on storage.objects;
create policy "Merchants can update their own product images"
  on storage.objects for update
  to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] in (
      select id::text from public.stores where owner_id = auth.uid()
    )
  )
  with check (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] in (
      select id::text from public.stores where owner_id = auth.uid()
    )
  );

-- Delete: Allow merchants to clean up their own images
drop policy if exists "Merchants can delete their own product images" on storage.objects;
create policy "Merchants can delete their own product images"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'product-images'
    and (storage.foldername(name))[1] in (
      select id::text from public.stores where owner_id = auth.uid()
    )
  );
