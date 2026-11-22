-- ==============================================================================
-- DukaanOS — Database Schema (Milestone 1)
-- Run this in your Supabase SQL Editor (Dashboard -> SQL Editor -> New Query)
-- ==============================================================================

-- 1. Create the Stores Table
create table if not exists public.stores (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  slug text not null,
  category text not null,
  whatsapp_number text not null,
  city text not null,
  state text not null,
  created_at timestamp with time zone default now() not null,
  updated_at timestamp with time zone default now() not null,

  -- Enforce strictly 1 store per merchant for MVP
  constraint stores_owner_id_unique unique (owner_id)
);

-- 2. Case-Insensitive Unique Index on Slug
-- Guarantees "Sharma-Sweets" and "sharma-sweets" cannot be taken by different merchants
create unique index if not exists stores_slug_lower_idx on public.stores (lower(slug));

-- 3. Enable PostgreSQL Row Level Security (RLS)
alter table public.stores enable row level security;

-- 4. Grant Permissions to Supabase Application Roles
grant usage on schema public to anon, authenticated, service_role;
grant all on table public.stores to authenticated;
grant all on table public.stores to service_role;
grant select on table public.stores to anon;

-- 5. RLS Security Policies
-- Policy: Merchants can read only their own store
create policy "Merchants can view their own store"
  on public.stores for select
  using (auth.uid() = owner_id);

-- Policy: Merchants can insert their own store (owner_id is automatically auth.uid())
create policy "Merchants can insert their own store"
  on public.stores for insert
  with check (auth.uid() = owner_id);

-- Policy: Merchants can update only their own store
create policy "Merchants can update their own store"
  on public.stores for update
  using (auth.uid() = owner_id)
  with check (auth.uid() = owner_id);
