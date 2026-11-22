-- ==============================================================================
-- DukaanOS — Milestone 6: AI Storefront Designer & Complete Hindi Support
-- Migration: 20261120000001_m6_ai_designer_and_i18n.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Storefront Default Language Column on public.stores
-- ------------------------------------------------------------------------------

alter table public.stores
  add column if not exists default_language text not null default 'en'
  check (default_language in ('en', 'hi'));


-- ------------------------------------------------------------------------------
-- 2. Table: store_ai_conversations
-- ------------------------------------------------------------------------------

create table if not exists public.store_ai_conversations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null unique references public.stores(id) on delete cascade,
  merchant_id uuid not null references auth.users(id) on delete cascade,
  stage text not null default 'understanding' check (stage in ('understanding', 'concepts', 'generated', 'refining')),
  business_profile jsonb not null default '{}'::jsonb,
  concepts jsonb not null default '[]'::jsonb,
  selected_concept_id text,
  messages jsonb not null default '[]'::jsonb,
  daily_request_count integer not null default 0,
  daily_request_date date not null default current_date,
  language_preference text not null default 'en' check (language_preference in ('en', 'hi', 'hinglish')),
  created_at timestamptz not null default timezone('utc'::text, now()),
  updated_at timestamptz not null default timezone('utc'::text, now()),
  constraint check_messages_array check (jsonb_typeof(messages) = 'array')
);

create index if not exists idx_store_ai_conversations_store_id
  on public.store_ai_conversations (store_id);


-- ------------------------------------------------------------------------------
-- 3. Database Ownership & Payload Limits Trigger
-- ------------------------------------------------------------------------------

create or replace function public.validate_ai_conversation_ownership()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_owner_id uuid;
begin
  -- 1. Verify authenticated user
  if (select auth.uid()) is null then
    raise exception 'Unauthorized: Authentication required' using errcode = '42501';
  end if;

  -- 2. Verify store ownership at the database level
  select owner_id into v_owner_id
  from public.stores
  where id = new.store_id;

  if not found then
    raise exception 'Store record does not exist' using errcode = 'P0002';
  end if;

  if v_owner_id is distinct from (select auth.uid()) then
    raise exception 'Unauthorized: Store ownership mismatch' using errcode = '42501';
  end if;

  -- 3. Enforce merchant_id as the authenticated user (ignore any browser input)
  new.merchant_id := (select auth.uid());
  new.updated_at := pg_catalog.now();

  -- 4. Enforce conversation message count limit (max 50 messages)
  if pg_catalog.jsonb_array_length(new.messages) > 50 then
    raise exception 'Conversation exceeds maximum limit of 50 messages' using errcode = '22000';
  end if;

  -- 5. Enforce payload size limit (max 512 KB)
  if pg_catalog.pg_column_size(new.messages) > 524288 then
    raise exception 'Conversation messages payload exceeds 512 KB limit' using errcode = '22000';
  end if;

  return new;
end;
$$;

drop trigger if exists enforce_ai_conversation_ownership on public.store_ai_conversations;
create trigger enforce_ai_conversation_ownership
  before insert or update on public.store_ai_conversations
  for each row execute function public.validate_ai_conversation_ownership();


-- ------------------------------------------------------------------------------
-- 4. Exact Grants & Row Level Security (RLS) Policies
-- ------------------------------------------------------------------------------

-- Revoke all permissions from public and anonymous users
revoke all on table public.store_ai_conversations from public, anon;
grant select, insert, update, delete on table public.store_ai_conversations to authenticated;

alter table public.store_ai_conversations enable row level security;

-- 1. SELECT Policy (Owner-Scoped)
drop policy if exists "Merchants can read own store conversation" on public.store_ai_conversations;
create policy "Merchants can read own store conversation"
  on public.store_ai_conversations for select
  to authenticated
  using (
    merchant_id = (select auth.uid()) and
    store_id in (select id from public.stores where owner_id = (select auth.uid()))
  );

-- 2. INSERT Policy (Owner-Scoped)
drop policy if exists "Merchants can insert own store conversation" on public.store_ai_conversations;
create policy "Merchants can insert own store conversation"
  on public.store_ai_conversations for insert
  to authenticated
  with check (
    merchant_id = (select auth.uid()) and
    store_id in (select id from public.stores where owner_id = (select auth.uid()))
  );

-- 3. UPDATE Policy (Owner-Scoped with both USING and WITH CHECK)
drop policy if exists "Merchants can update own store conversation" on public.store_ai_conversations;
create policy "Merchants can update own store conversation"
  on public.store_ai_conversations for update
  to authenticated
  using (
    merchant_id = (select auth.uid()) and
    store_id in (select id from public.stores where owner_id = (select auth.uid()))
  )
  with check (
    merchant_id = (select auth.uid()) and
    store_id in (select id from public.stores where owner_id = (select auth.uid()))
  );

-- 4. DELETE Policy (Owner-Scoped for Clean Reset)
drop policy if exists "Merchants can delete own store conversation" on public.store_ai_conversations;
create policy "Merchants can delete own store conversation"
  on public.store_ai_conversations for delete
  to authenticated
  using (
    merchant_id = (select auth.uid()) and
    store_id in (select id from public.stores where owner_id = (select auth.uid()))
  );
