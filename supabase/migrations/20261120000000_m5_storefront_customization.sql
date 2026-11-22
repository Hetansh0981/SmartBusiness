-- ==============================================================================
-- DukaanOS — Migration: Milestone 5 (Storefront Customization & Visual Editor)
-- File: supabase/migrations/20261120000000_m5_storefront_customization.sql
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. Table Definitions
-- ------------------------------------------------------------------------------

-- Main Store Customizations Table (Current Draft & Active Published Configuration)
create table if not exists public.store_customizations (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  draft_config jsonb not null,
  draft_revision integer not null default 1 check (draft_revision >= 1),
  draft_updated_at timestamp with time zone not null default now(),
  published_config jsonb,
  published_at timestamp with time zone,
  version integer not null default 0 check (version >= 0),
  created_at timestamp with time zone not null default now(),
  updated_at timestamp with time zone not null default now(),

  -- Strictly 1 customization record per store
  constraint store_customizations_store_id_unique unique (store_id)
);

create index if not exists store_customizations_store_id_idx 
  on public.store_customizations (store_id);

-- Automatic updated_at trigger (uses existing public.handle_updated_at from M2)
drop trigger if exists set_store_customizations_updated_at on public.store_customizations;
create trigger set_store_customizations_updated_at
  before update on public.store_customizations
  for each row execute function public.handle_updated_at();


-- Store Customization Version History (Retained Immutable Snapshots)
create table if not exists public.store_customization_versions (
  id uuid primary key default gen_random_uuid(),
  store_id uuid not null references public.stores(id) on delete cascade,
  version integer not null check (version >= 1),
  config jsonb not null,
  published_by uuid references auth.users(id) on delete set null,
  created_at timestamp with time zone not null default now(),

  constraint store_customization_versions_store_version_unique unique (store_id, version)
);

create index if not exists store_customization_versions_lookup_idx 
  on public.store_customization_versions (store_id, version desc);


-- ------------------------------------------------------------------------------
-- 2. Immutability Triggers
-- ------------------------------------------------------------------------------

-- Prevent modifying store_id or record ID on store_customizations
create or replace function public.validate_customization_immutability()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if new.id <> old.id then
    raise exception 'Customization ID cannot be modified' using errcode = '42501';
  end if;
  if new.store_id <> old.store_id then
    raise exception 'Customization store association cannot be modified' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists enforce_customization_immutability on public.store_customizations;
create trigger enforce_customization_immutability
  before update on public.store_customizations
  for each row execute function public.validate_customization_immutability();


-- Prevent ANY update on historical version snapshots (immutable snapshots)
create or replace function public.prevent_version_snapshot_update()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  raise exception 'Historical version snapshots are immutable and cannot be updated' using errcode = '42501';
end;
$$;

drop trigger if exists enforce_version_snapshot_immutability on public.store_customization_versions;
create trigger enforce_version_snapshot_immutability
  before update on public.store_customization_versions
  for each row execute function public.prevent_version_snapshot_update();


-- ------------------------------------------------------------------------------
-- 3. Database-Side Configuration Validator
-- ------------------------------------------------------------------------------

create or replace function public.validate_storefront_config(
  p_config jsonb
)
returns void
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_theme jsonb;
  v_sections jsonb;
  v_sec jsonb;
  v_props jsonb;
  v_sec_id text;
  v_sec_type text;
  v_sec_enabled boolean;
  v_sec_ids text[] := array[]::text[];
  v_header_count int := 0;
  v_footer_count int := 0;
  v_product_grid_count int := 0;
  v_enabled_header_count int := 0;
  v_enabled_footer_count int := 0;
  v_enabled_product_grid_count int := 0;
  v_key text;
  v_val_text text;
  v_unknown_count int;
  v_prop_count int;
begin
  -- 1. Root Structure
  if p_config is null or pg_catalog.jsonb_typeof(p_config) <> 'object' then
    raise exception 'Storefront configuration must be a valid JSON object' using errcode = '22000';
  end if;

  select count(*) into v_unknown_count
  from pg_catalog.jsonb_object_keys(p_config) as k
  where k not in ('version', 'theme', 'sections');

  if v_unknown_count > 0 then
    raise exception 'Root configuration contains unknown properties' using errcode = '22000';
  end if;

  v_theme := p_config->'theme';
  v_sections := p_config->'sections';

  if v_theme is null or pg_catalog.jsonb_typeof(v_theme) <> 'object' then
    raise exception 'Configuration must contain a valid "theme" object' using errcode = '22000';
  end if;

  if v_sections is null or pg_catalog.jsonb_typeof(v_sections) <> 'array' then
    raise exception 'Configuration must contain a valid "sections" array' using errcode = '22000';
  end if;

  if pg_catalog.jsonb_array_length(v_sections) < 1 or pg_catalog.jsonb_array_length(v_sections) > 20 then
    raise exception 'Configuration must contain between 1 and 20 sections' using errcode = '22000';
  end if;

  -- 2. Theme Token Validation (Strict 8 properties)
  select count(*) into v_unknown_count
  from pg_catalog.jsonb_object_keys(v_theme) as k
  where k not in (
    'primaryColor', 'secondaryColor', 'backgroundColor', 'textColor',
    'fontFamily', 'buttonStyle', 'borderRadius', 'sectionSpacing'
  );

  if v_unknown_count > 0 then
    raise exception 'Theme object contains unknown properties' using errcode = '22000';
  end if;

  select count(*) into v_prop_count from pg_catalog.jsonb_object_keys(v_theme);
  if v_prop_count <> 8 then
    raise exception 'Theme object is missing required properties (must contain exactly 8)' using errcode = '22000';
  end if;

  if (v_theme->>'primaryColor') is null or (v_theme->>'primaryColor') !~ '^#[0-9a-fA-F]{6}$' or
     (v_theme->>'secondaryColor') is null or (v_theme->>'secondaryColor') !~ '^#[0-9a-fA-F]{6}$' or
     (v_theme->>'backgroundColor') is null or (v_theme->>'backgroundColor') !~ '^#[0-9a-fA-F]{6}$' or
     (v_theme->>'textColor') is null or (v_theme->>'textColor') !~ '^#[0-9a-fA-F]{6}$' then
    raise exception 'Theme colors must be valid 6-character hex strings (#RRGGBB)' using errcode = '22000';
  end if;

  if (v_theme->>'fontFamily') not in ('Geist', 'Inter', 'Poppins', 'Playfair', 'DM Sans') then
    raise exception 'Invalid theme fontFamily: %', v_theme->>'fontFamily' using errcode = '22000';
  end if;

  if (v_theme->>'buttonStyle') not in ('rounded', 'pill', 'sharp') then
    raise exception 'Invalid theme buttonStyle: %', v_theme->>'buttonStyle' using errcode = '22000';
  end if;

  if (v_theme->>'borderRadius') not in ('none', 'sm', 'md', 'lg', 'full') then
    raise exception 'Invalid theme borderRadius: %', v_theme->>'borderRadius' using errcode = '22000';
  end if;

  if (v_theme->>'sectionSpacing') not in ('compact', 'normal', 'spacious') then
    raise exception 'Invalid theme sectionSpacing: %', v_theme->>'sectionSpacing' using errcode = '22000';
  end if;

  -- 3. Sections Array & Section-Specific Property Validation
  for v_sec in select * from pg_catalog.jsonb_array_elements(v_sections)
  loop
    if pg_catalog.jsonb_typeof(v_sec) <> 'object' then
      raise exception 'Each item in "sections" must be a JSON object' using errcode = '22000';
    end if;

    select count(*) into v_unknown_count
    from pg_catalog.jsonb_object_keys(v_sec) as k
    where k not in ('id', 'type', 'enabled', 'props');

    if v_unknown_count > 0 then
      raise exception 'Section contains unknown properties' using errcode = '22000';
    end if;

    select count(*) into v_prop_count from pg_catalog.jsonb_object_keys(v_sec);
    if v_prop_count <> 4 then
      raise exception 'Each section must contain id, type, enabled, and props' using errcode = '22000';
    end if;

    v_sec_id := v_sec->>'id';
    v_sec_type := v_sec->>'type';

    if v_sec_id is null or pg_catalog.length(v_sec_id) < 3 or pg_catalog.length(v_sec_id) > 60 then
      raise exception 'Section ID must be between 3 and 60 characters' using errcode = '22000';
    end if;

    if v_sec_id = any(v_sec_ids) then
      raise exception 'Duplicate section ID "%" detected in configuration', v_sec_id using errcode = '22000';
    end if;
    v_sec_ids := array_append(v_sec_ids, v_sec_id);

    if pg_catalog.jsonb_typeof(v_sec->'enabled') <> 'boolean' then
      raise exception 'Section "enabled" property must be a boolean' using errcode = '22000';
    end if;
    v_sec_enabled := (v_sec->>'enabled')::boolean;

    v_props := v_sec->'props';
    if v_props is null or pg_catalog.jsonb_typeof(v_props) <> 'object' then
      raise exception 'Section "props" must be a JSON object' using errcode = '22000';
    end if;

    if v_sec_type = 'header' then
      v_header_count := v_header_count + 1;
      if v_sec_enabled then v_enabled_header_count := v_enabled_header_count + 1; end if;

      select count(*) into v_unknown_count from pg_catalog.jsonb_object_keys(v_props) as k
      where k not in ('sticky', 'showAnnouncement', 'announcementText', 'announcementLink', 'showWhatsAppButton', 'showLocationBadge', 'logoStyle');
      if v_unknown_count > 0 then raise exception 'Header props contain unknown properties' using errcode = '22000'; end if;

      if pg_catalog.length(coalesce(v_props->>'announcementText', '')) > 100 then
        raise exception 'Header announcementText exceeds 100 characters' using errcode = '22000';
      end if;
      if (v_props->>'logoStyle') not in ('initials', 'text') then
        raise exception 'Invalid logoStyle in header' using errcode = '22000';
      end if;

    elsif v_sec_type = 'hero' then
      select count(*) into v_unknown_count from pg_catalog.jsonb_object_keys(v_props) as k
      where k not in ('badgeText', 'headline', 'tagline', 'showTrustBadges', 'backgroundStyle');
      if v_unknown_count > 0 then raise exception 'Hero props contain unknown properties' using errcode = '22000'; end if;

      if pg_catalog.length(coalesce(v_props->>'headline', '')) < 2 or pg_catalog.length(coalesce(v_props->>'headline', '')) > 120 then
        raise exception 'Hero headline must be between 2 and 120 characters' using errcode = '22000';
      end if;
      if pg_catalog.length(coalesce(v_props->>'tagline', '')) > 300 then
        raise exception 'Hero tagline exceeds 300 characters' using errcode = '22000';
      end if;
      if (v_props->>'backgroundStyle') not in ('subtle', 'accent', 'neutral') then
        raise exception 'Invalid backgroundStyle in hero' using errcode = '22000';
      end if;

    elsif v_sec_type = 'category_grid' then
      select count(*) into v_unknown_count from pg_catalog.jsonb_object_keys(v_props) as k
      where k not in ('title', 'layout', 'showItemCount');
      if v_unknown_count > 0 then raise exception 'Category grid props contain unknown properties' using errcode = '22000'; end if;

      if pg_catalog.length(coalesce(v_props->>'title', '')) > 60 then
        raise exception 'Category grid title exceeds 60 characters' using errcode = '22000';
      end if;
      if (v_props->>'layout') not in ('pills', 'cards', 'compact') then
        raise exception 'Invalid layout in category grid' using errcode = '22000';
      end if;

    elsif v_sec_type = 'product_grid' then
      v_product_grid_count := v_product_grid_count + 1;
      if v_sec_enabled then v_enabled_product_grid_count := v_enabled_product_grid_count + 1; end if;

      select count(*) into v_unknown_count from pg_catalog.jsonb_object_keys(v_props) as k
      where k not in ('title', 'columns', 'showSearch', 'showStockFilter', 'showDiscountBadge', 'showMrp');
      if v_unknown_count > 0 then raise exception 'Product grid props contain unknown properties' using errcode = '22000'; end if;

      if pg_catalog.length(coalesce(v_props->>'title', '')) > 60 then
        raise exception 'Product grid title exceeds 60 characters' using errcode = '22000';
      end if;
      if (v_props->>'columns') not in ('2', '3', '4') then
        raise exception 'Invalid columns in product grid' using errcode = '22000';
      end if;

    elsif v_sec_type = 'promo_banner' then
      select count(*) into v_unknown_count from pg_catalog.jsonb_object_keys(v_props) as k
      where k not in ('headline', 'subheadline', 'badgeText', 'couponCode', 'buttonText', 'buttonLink', 'bannerStyle');
      if v_unknown_count > 0 then raise exception 'Promo banner props contain unknown properties' using errcode = '22000'; end if;

      if pg_catalog.length(coalesce(v_props->>'headline', '')) < 2 or pg_catalog.length(coalesce(v_props->>'headline', '')) > 100 then
        raise exception 'Promo headline must be between 2 and 100 characters' using errcode = '22000';
      end if;
      if (v_props->>'bannerStyle') not in ('saffron', 'emerald', 'charcoal') then
        raise exception 'Invalid bannerStyle in promo banner' using errcode = '22000';
      end if;

    elsif v_sec_type = 'text_image' then
      select count(*) into v_unknown_count from pg_catalog.jsonb_object_keys(v_props) as k
      where k not in ('title', 'body', 'imagePosition', 'imageUrl', 'buttonText', 'buttonLink');
      if v_unknown_count > 0 then raise exception 'Text/image props contain unknown properties' using errcode = '22000'; end if;

      if pg_catalog.length(coalesce(v_props->>'title', '')) < 2 or pg_catalog.length(coalesce(v_props->>'title', '')) > 100 then
        raise exception 'Text/image title must be between 2 and 100 characters' using errcode = '22000';
      end if;
      if pg_catalog.length(coalesce(v_props->>'body', '')) < 5 or pg_catalog.length(coalesce(v_props->>'body', '')) > 1000 then
        raise exception 'Text/image body must be between 5 and 1000 characters' using errcode = '22000';
      end if;
      if (v_props->>'imagePosition') not in ('left', 'right') then
        raise exception 'Invalid imagePosition in text/image section' using errcode = '22000';
      end if;

    elsif v_sec_type = 'footer' then
      v_footer_count := v_footer_count + 1;
      if v_sec_enabled then v_enabled_footer_count := v_enabled_footer_count + 1; end if;

      select count(*) into v_unknown_count from pg_catalog.jsonb_object_keys(v_props) as k
      where k not in ('showAddress', 'showWhatsAppSupport', 'customAboutText', 'showPoweredBy');
      if v_unknown_count > 0 then raise exception 'Footer props contain unknown properties' using errcode = '22000'; end if;

      if pg_catalog.length(coalesce(v_props->>'customAboutText', '')) > 300 then
        raise exception 'Footer customAboutText exceeds 300 characters' using errcode = '22000';
      end if;

    else
      raise exception 'Unsupported section type "%"', v_sec_type using errcode = '22000';
    end if;

    -- URL Property Validation Across All Sections
    for v_key, v_val_text in select * from pg_catalog.jsonb_each_text(v_props)
    loop
      if v_key ~* '(url|link)' and v_val_text is not null and v_val_text <> '' then
        if pg_catalog.length(v_val_text) > 300 then
          raise exception 'URL property "%" exceeds 300 characters', v_key using errcode = '22000';
        end if;
        if v_val_text ~* '^\s*//' then
          raise exception 'Protocol-relative URLs (//) are strictly prohibited' using errcode = '22000';
        end if;
        if v_val_text ~* '^\s*(javascript|data|vbscript):' then
          raise exception 'Unsafe URI scheme detected in property "%"', v_key using errcode = '22000';
        end if;
        if v_val_text !~* '^https://' and v_val_text !~* '^/[a-zA-Z0-9_\-\/]*$' then
          raise exception 'URLs must be HTTPS (https://) or internal routes starting with /' using errcode = '22000';
        end if;
      end if;
    end loop;
  end loop;

  -- 4. Mandatory Section Invariants: Exactly 1 Header, Exactly 1 Footer, >= 1 Product Grid
  if v_header_count <> 1 or v_enabled_header_count <> 1 then
    raise exception 'Storefront configuration must contain exactly one enabled header section' using errcode = '22000';
  end if;

  if v_footer_count <> 1 or v_enabled_footer_count <> 1 then
    raise exception 'Storefront configuration must contain exactly one enabled footer section' using errcode = '22000';
  end if;

  if v_product_grid_count < 1 or v_enabled_product_grid_count < 1 then
    raise exception 'Storefront configuration must contain at least one enabled product grid section' using errcode = '22000';
  end if;
end;
$$;

revoke all on function public.validate_storefront_config(jsonb) from public, anon, authenticated;


-- ------------------------------------------------------------------------------
-- 4. PostgreSQL RPC Functions (Mutations Strictly Via RPCs)
-- ------------------------------------------------------------------------------

-- RPC 1: get_or_init_store_customization
create or replace function public.get_or_init_store_customization(
  p_store_id uuid,
  p_default_config jsonb
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_store record;
  v_customization record;
begin
  -- 1. Store Row Lock & NULL-Safe Ownership Verification
  select id, owner_id into v_store
  from public.stores
  where id = p_store_id
  for share;

  if not found
     or (select auth.uid()) is null
     or v_store.owner_id is distinct from (select auth.uid()) then
    raise exception 'Unauthorized store access' using errcode = '42501';
  end if;

  -- 2. Validate Default Configuration Structure
  perform public.validate_storefront_config(p_default_config);

  -- 3. Concurrent Safe Initialization
  insert into public.store_customizations (
    store_id,
    draft_config,
    draft_revision,
    draft_updated_at,
    published_config,
    published_at,
    version
  ) values (
    p_store_id,
    p_default_config,
    1,
    pg_catalog.now(),
    null,
    null,
    0
  )
  on conflict (store_id) do nothing;

  -- 4. Return Authoritative Row
  select * into v_customization
  from public.store_customizations
  where store_id = p_store_id;

  return pg_catalog.jsonb_build_object(
    'id', v_customization.id,
    'store_id', v_customization.store_id,
    'draft_config', v_customization.draft_config,
    'draft_revision', v_customization.draft_revision,
    'draft_updated_at', v_customization.draft_updated_at,
    'published_config', v_customization.published_config,
    'published_at', v_customization.published_at,
    'version', v_customization.version
  );
end;
$$;


-- RPC 2: save_draft_customization
create or replace function public.save_draft_customization(
  p_store_id uuid,
  p_draft_config jsonb,
  p_expected_revision integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_store record;
  v_customization record;
begin
  -- 1. Non-NULL Revision Requirement
  if p_expected_revision is null then
    raise exception 'expected_revision cannot be null' using errcode = '22000';
  end if;

  -- 2. Store Row Lock & NULL-Safe Ownership Verification
  select id, owner_id into v_store
  from public.stores
  where id = p_store_id
  for share;

  if not found
     or (select auth.uid()) is null
     or v_store.owner_id is distinct from (select auth.uid()) then
    raise exception 'Unauthorized store access' using errcode = '42501';
  end if;

  -- 3. Database-Side Config Validation
  perform public.validate_storefront_config(p_draft_config);

  -- 4. Lock Customization Row and Compare Revision
  select * into v_customization
  from public.store_customizations
  where store_id = p_store_id
  for update;

  if not found then
    raise exception 'Customization record does not exist for store %', p_store_id using errcode = 'P0002';
  end if;

  if v_customization.draft_revision is distinct from p_expected_revision then
    return pg_catalog.jsonb_build_object(
      'success', false,
      'error', 'STALE_REVISION',
      'current_revision', v_customization.draft_revision,
      'expected_revision', p_expected_revision
    );
  end if;

  -- 5. Atomic Update
  update public.store_customizations
  set draft_config = p_draft_config,
      draft_revision = v_customization.draft_revision + 1,
      draft_updated_at = pg_catalog.now(),
      updated_at = pg_catalog.now()
  where store_id = p_store_id;

  return pg_catalog.jsonb_build_object(
    'success', true,
    'new_revision', v_customization.draft_revision + 1,
    'draft_updated_at', pg_catalog.now()
  );
end;
$$;


-- RPC 3: publish_store_customization
create or replace function public.publish_store_customization(
  p_store_id uuid,
  p_expected_revision integer,
  p_draft_config jsonb default null
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_store record;
  v_customization record;
  v_final_config jsonb;
  v_new_version integer;
  v_new_draft_revision integer;
begin
  -- 1. Non-NULL Revision Requirement
  if p_expected_revision is null then
    raise exception 'expected_revision cannot be null' using errcode = '22000';
  end if;

  -- 2. Store Row Lock & NULL-Safe Ownership Verification
  select id, owner_id into v_store
  from public.stores
  where id = p_store_id
  for share;

  if not found
     or (select auth.uid()) is null
     or v_store.owner_id is distinct from (select auth.uid()) then
    raise exception 'Unauthorized store access' using errcode = '42501';
  end if;

  -- 3. Lock Customization Row
  select * into v_customization
  from public.store_customizations
  where store_id = p_store_id
  for update;

  if not found then
    raise exception 'Customization record does not exist for store %', p_store_id using errcode = 'P0002';
  end if;

  -- 4. Optimistic Concurrency Check
  if v_customization.draft_revision is distinct from p_expected_revision then
    return pg_catalog.jsonb_build_object(
      'success', false,
      'error', 'STALE_REVISION',
      'current_revision', v_customization.draft_revision,
      'expected_revision', p_expected_revision
    );
  end if;

  -- 5. Prepare and validate final configuration
  if p_draft_config is not null then
    v_final_config := p_draft_config;
    v_new_draft_revision := v_customization.draft_revision + 1;
  else
    v_final_config := v_customization.draft_config;
    v_new_draft_revision := v_customization.draft_revision;
  end if;

  perform public.validate_storefront_config(v_final_config);

  -- 6. Strict Version Invariant Check
  if (v_customization.version > 0 and v_customization.published_config is null) or
     (v_customization.version = 0 and v_customization.published_config is not null) then
    raise exception 'Inconsistent version state detected in store % (version: %, published_config present: %)',
      p_store_id, v_customization.version, (v_customization.published_config is not null) using errcode = '22000';
  end if;

  if v_customization.version = 0 and v_customization.published_config is null then
    v_new_version := 1;
  else
    v_new_version := v_customization.version + 1;
  end if;

  -- 7. Atomic Store Customization Update
  update public.store_customizations
  set draft_config = v_final_config,
      draft_revision = v_new_draft_revision,
      draft_updated_at = pg_catalog.now(),
      published_config = v_final_config,
      published_at = pg_catalog.now(),
      version = v_new_version,
      updated_at = pg_catalog.now()
  where store_id = p_store_id;

  -- 8. Insert Retained Snapshot
  insert into public.store_customization_versions (
    store_id,
    version,
    config,
    published_by
  ) values (
    p_store_id,
    v_new_version,
    v_final_config,
    (select auth.uid())
  );

  -- 9. Retain latest 50 versions per store
  delete from public.store_customization_versions
  where store_id = p_store_id
    and id not in (
      select id from public.store_customization_versions
      where store_id = p_store_id
      order by version desc
      limit 50
    );

  return pg_catalog.jsonb_build_object(
    'success', true,
    'version', v_new_version,
    'draft_revision', v_new_draft_revision,
    'published_at', pg_catalog.now()
  );
end;
$$;


-- RPC 4: rollback_store_customization
create or replace function public.rollback_store_customization(
  p_store_id uuid,
  p_target_version integer,
  p_expected_revision integer
)
returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_store record;
  v_customization record;
  v_target_version_record record;
  v_new_version integer;
  v_new_draft_revision integer;
begin
  -- 1. Input Requirements
  if p_expected_revision is null then
    raise exception 'expected_revision cannot be null' using errcode = '22000';
  end if;
  if p_target_version is null or p_target_version < 1 then
    raise exception 'Invalid target_version' using errcode = '22000';
  end if;

  -- 2. Store Row Lock & NULL-Safe Ownership Verification
  select id, owner_id into v_store
  from public.stores
  where id = p_store_id
  for share;

  if not found
     or (select auth.uid()) is null
     or v_store.owner_id is distinct from (select auth.uid()) then
    raise exception 'Unauthorized store access' using errcode = '42501';
  end if;

  -- 3. Lock Customization Row
  select * into v_customization
  from public.store_customizations
  where store_id = p_store_id
  for update;

  if not found then
    raise exception 'Customization record does not exist for store %', p_store_id using errcode = 'P0002';
  end if;

  -- 4. Optimistic Concurrency Check
  if v_customization.draft_revision is distinct from p_expected_revision then
    return pg_catalog.jsonb_build_object(
      'success', false,
      'error', 'STALE_REVISION',
      'current_revision', v_customization.draft_revision,
      'expected_revision', p_expected_revision
    );
  end if;

  -- 5. Version Invariant Check
  if (v_customization.version > 0 and v_customization.published_config is null) or
     (v_customization.version = 0 and v_customization.published_config is not null) then
    raise exception 'Inconsistent version state detected in store %', p_store_id using errcode = '22000';
  end if;

  -- 6. Verify Target Snapshot Exists
  select * into v_target_version_record
  from public.store_customization_versions
  where store_id = p_store_id and version = p_target_version;

  if not found then
    raise exception 'Target version % does not exist for this store', p_target_version using errcode = 'P0002';
  end if;

  perform public.validate_storefront_config(v_target_version_record.config);

  v_new_version := v_customization.version + 1;
  v_new_draft_revision := v_customization.draft_revision + 1;

  -- 7. Roll Forward: Update Customization
  update public.store_customizations
  set published_config = v_target_version_record.config,
      draft_config = v_target_version_record.config,
      published_at = pg_catalog.now(),
      version = v_new_version,
      draft_revision = v_new_draft_revision,
      draft_updated_at = pg_catalog.now(),
      updated_at = pg_catalog.now()
  where store_id = p_store_id;

  -- 8. Insert New Append-Only Snapshot
  insert into public.store_customization_versions (
    store_id,
    version,
    config,
    published_by
  ) values (
    p_store_id,
    v_new_version,
    v_target_version_record.config,
    (select auth.uid())
  );

  -- 9. Retain Latest 50 Versions Per Store
  delete from public.store_customization_versions
  where store_id = p_store_id
    and id not in (
      select id from public.store_customization_versions
      where store_id = p_store_id
      order by version desc
      limit 50
    );

  return pg_catalog.jsonb_build_object(
    'success', true,
    'restored_from_version', p_target_version,
    'new_version', v_new_version,
    'new_draft_revision', v_new_draft_revision,
    'published_at', pg_catalog.now()
  );
end;
$$;

-- Revoke default execution and grant strictly to authenticated
revoke all on function public.get_or_init_store_customization(uuid, jsonb) from public, anon;
grant execute on function public.get_or_init_store_customization(uuid, jsonb) to authenticated;

revoke all on function public.save_draft_customization(uuid, jsonb, integer) from public, anon;
grant execute on function public.save_draft_customization(uuid, jsonb, integer) to authenticated;

revoke all on function public.publish_store_customization(uuid, integer, jsonb) from public, anon;
grant execute on function public.publish_store_customization(uuid, integer, jsonb) to authenticated;

revoke all on function public.rollback_store_customization(uuid, integer, integer) from public, anon;
grant execute on function public.rollback_store_customization(uuid, integer, integer) to authenticated;


-- ------------------------------------------------------------------------------
-- 5. Exact Table Grants & Row Level Security Policies
-- ------------------------------------------------------------------------------

-- 1. Full Table-Level and Column-Level Privilege Revocation
revoke all on table public.store_customizations from public, anon, authenticated;
revoke all on table public.store_customization_versions from public, anon, authenticated;

revoke all (id, store_id, draft_config, draft_revision, draft_updated_at, published_config, published_at, version, created_at, updated_at)
  on table public.store_customizations from public, anon, authenticated;

revoke all (id, store_id, version, config, published_by, created_at)
  on table public.store_customization_versions from public, anon, authenticated;

-- 2. Column-Level Grant for Anonymous Shoppers (Public Storefront Renderer)
grant select (id, store_id, published_config, published_at, version) 
  on table public.store_customizations to anon;

-- 3. Table-Level Grants for Authenticated Merchants (SELECT only)
grant select on table public.store_customizations to authenticated;
grant select on table public.store_customization_versions to authenticated;

-- 4. Enable Row Level Security
alter table public.store_customizations enable row level security;
alter table public.store_customization_versions enable row level security;

-- 5. Row Level Security Policies
drop policy if exists "Anon can view published store customizations" on public.store_customizations;
create policy "Anon can view published store customizations"
  on public.store_customizations for select
  to anon
  using (
    published_config is not null and
    store_id in (
      select id from public.stores where is_published = true
    )
  );

drop policy if exists "Merchants can view own store customization" on public.store_customizations;
create policy "Merchants can view own store customization"
  on public.store_customizations for select
  to authenticated
  using (
    store_id in (
      select id from public.stores where owner_id = (select auth.uid())
    )
  );

drop policy if exists "Merchants can view own version history" on public.store_customization_versions;
create policy "Merchants can view own version history"
  on public.store_customization_versions for select
  to authenticated
  using (
    store_id in (
      select id from public.stores where owner_id = (select auth.uid())
    )
  );
