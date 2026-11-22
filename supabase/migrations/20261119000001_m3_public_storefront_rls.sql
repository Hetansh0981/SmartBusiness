-- ==============================================================================
-- DukaanOS — Migration: Milestone 3 (Publication Status, Column Security & Public RLS)
-- File: supabase/migrations/20261119000001_m3_public_storefront_rls.sql
-- ==============================================================================

-- 1. Add Publication Status with DEFAULT false (Safer for new stores)
alter table public.stores 
  add column if not exists is_published boolean not null default false;

-- Explicitly publish existing store(s) created during Milestones 1 and 2
update public.stores 
  set is_published = true 
  where is_published = false;

-- High-speed partial index for slug lookups on published stores only
create index if not exists stores_slug_published_idx 
  on public.stores (slug) 
  where is_published = true;


-- 2. FIX TABLE GRANTS & ENFORCE COLUMN-LEVEL SECURITY
grant usage on schema public to anon;

-- REVOKE the broad table-level SELECT granted to anon in Milestone 1
revoke select on table public.stores from anon;

-- GRANT SELECT ONLY on non-sensitive public storefront columns.
-- 'owner_id' is deliberately EXCLUDED.
grant select (
  id,
  name,
  slug,
  category,
  whatsapp_number,
  city,
  state,
  is_published,
  created_at
) on table public.stores to anon;

-- Grant SELECT on categories and products to anon (rows filtered by RLS below)
grant select on table public.categories to anon;
grant select on table public.products to anon;


-- 3. ROW LEVEL SECURITY POLICIES: Stores
-- Rule: Anonymous visitors can view a store ONLY if it is published
drop policy if exists "Public can view published stores" on public.stores;
create policy "Public can view published stores"
  on public.stores for select
  to anon
  using (is_published = true);

-- Re-assert merchant store access for authenticated users (regardless of is_published)
drop policy if exists "Merchants can view their own store" on public.stores;
create policy "Merchants can view their own store"
  on public.stores for select
  to authenticated
  using (auth.uid() = owner_id);

-- Rule: Merchants can delete their own store (allows deleting store to create a new one)
drop policy if exists "Merchants can delete their own store" on public.stores;
create policy "Merchants can delete their own store"
  on public.stores for delete
  to authenticated
  using (auth.uid() = owner_id);


-- 4. ROW LEVEL SECURITY POLICIES: Categories
-- Rule: Anonymous visitors can view categories ONLY if the parent store is published
drop policy if exists "Public can view published store categories" on public.categories;
create policy "Public can view published store categories"
  on public.categories for select
  to anon
  using (
    store_id in (
      select id from public.stores where is_published = true
    )
  );


-- 5. ROW LEVEL SECURITY POLICIES: Products
-- Rule: Anonymous visitors can view products ONLY if the parent store is published
drop policy if exists "Public can view published store products" on public.products;
create policy "Public can view published store products"
  on public.products for select
  to anon
  using (
    store_id in (
      select id from public.stores where is_published = true
    )
  );
