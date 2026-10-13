-- ============================================================================
--  CATERING MOLDOVA — SUPABASE SCHEMA  (paste into Supabase -> SQL Editor -> Run)
--  Safe to run twice: everything uses IF NOT EXISTS / OR REPLACE / ON CONFLICT.
--  After this file, run 02-seed.sql once (cities, categories, example firms).
-- ============================================================================

create extension if not exists "unaccent";
create extension if not exists "pg_trgm";

-- ---------------------------------------------------------------- helpers ---
create or replace function public.slugify(input text) returns text
language sql immutable as $$
  select trim(both '-' from regexp_replace(lower(unaccent(coalesce(input, ''))), '[^a-z0-9]+', '-', 'g'));
$$;

create or replace function public.touch_updated_at() returns trigger
language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end $$;

-- ----------------------------------------------------------------- tables ---

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  role text not null default 'firm' check (role in ('firm', 'admin')),
  full_name text,
  created_at timestamptz not null default now()
);

create table if not exists public.cities (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_ro text not null,
  name_ru text not null default '',
  name_en text not null default '',
  region_ro text,
  region_ru text,
  region_en text,
  lat numeric(9, 6),
  lng numeric(9, 6),
  population integer,
  priority integer not null default 0,
  active boolean not null default true,
  seo_intro_ro text,
  seo_intro_ru text,
  created_at timestamptz not null default now()
);

create table if not exists public.categories (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  kind text not null default 'event' check (kind in ('event', 'service')),
  name_ro text not null,
  name_ru text not null default '',
  name_en text not null default '',
  description_ro text,
  description_ru text,
  description_en text,
  icon text,
  priority integer not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.taxonomies (
  id uuid primary key default gen_random_uuid(),
  kind text not null check (kind in ('cuisine', 'dietary')),
  slug text not null,
  name_ro text not null,
  name_ru text not null default '',
  name_en text not null default '',
  active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (kind, slug)
);

create table if not exists public.firms (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid references auth.users (id) on delete cascade,
  owner_email text,
  name text not null,
  slug text unique not null,
  tagline_ro text,
  tagline_ru text,
  description_ro text,
  description_ru text,
  city text,
  region text,
  address text,
  phone text,
  whatsapp text,
  email text,
  website text,
  logo_url text,
  gallery jsonb not null default '[]'::jsonb,
  price_from numeric(10, 2),
  currency text not null default 'MDL',
  min_guests integer,
  max_guests integer,
  cuisines text[] not null default '{}',
  event_types text[] not null default '{}',
  dietary text[] not null default '{}',
  map_lat numeric(9, 6),
  map_lng numeric(9, 6),
  rating_avg numeric(3, 2) not null default 0,
  rating_count integer not null default 0,
  verified boolean not null default false,
  published boolean not null default false,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  rejection_reason text,
  seo_title text,
  source_url text,
  source_note text,
  seo_description_ro text,
  seo_description_ru text,
  views integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists firms_owner_unique on public.firms (owner_id) where owner_id is not null;
create index if not exists firms_public_idx on public.firms (status, published, city);
create index if not exists firms_name_trgm on public.firms using gin (name gin_trgm_ops);

create table if not exists public.services (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms (id) on delete cascade,
  title_ro text not null,
  title_ru text,
  description_ro text,
  description_ru text,
  category text,
  price numeric(10, 2),
  price_type text not null default 'per_person'
    check (price_type in ('per_person', 'per_event', 'per_hour', 'fixed', 'on_request')),
  unit text,
  image_url text,
  active boolean not null default true,
  sort integer not null default 0,
  created_at timestamptz not null default now()
);
create index if not exists services_firm_idx on public.services (firm_id, active);

create table if not exists public.inquiries (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms (id) on delete cascade,
  name text not null,
  email text not null,
  phone text,
  event_date date,
  guests integer,
  message text not null,
  status text not null default 'new' check (status in ('new', 'read', 'replied', 'archived', 'spam')),
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists inquiries_firm_idx on public.inquiries (firm_id, created_at desc);
create index if not exists inquiries_ip_idx on public.inquiries (ip_hash, created_at desc);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  firm_id uuid not null references public.firms (id) on delete cascade,
  author_name text not null,
  rating integer not null check (rating between 1 and 5),
  title text,
  body text,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected', 'spam')),
  ip_hash text,
  created_at timestamptz not null default now()
);
create index if not exists reviews_firm_idx on public.reviews (firm_id, status);

create table if not exists public.settings (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

-- (is_admin is defined after the tables because SQL functions are validated at CREATE time)
create or replace function public.is_admin() returns boolean
language sql stable security definer set search_path = public as $$
  select exists (select 1 from public.profiles p where p.id = auth.uid() and p.role = 'admin');
$$;

-- --------------------------------------------------------------- triggers ---
drop trigger if exists firms_touch on public.firms;
create trigger firms_touch before update on public.firms for each row execute function public.touch_updated_at();

create or replace function public.unique_firm_slug(base text) returns text
language plpgsql stable as $$
declare s text; i integer := 0;
begin
  s := coalesce(nullif(public.slugify(base), ''), 'firma');
  loop
    if not exists (select 1 from public.firms f where f.slug = s) then return s; end if;
    i := i + 1;
    s := coalesce(nullif(public.slugify(base), ''), 'firma') || '-' || i;
  end loop;
end $$;

-- Slug + protected columns + owner email, enforced server-side.
create or replace function public.firms_before_write() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_authed boolean;
begin
  v_authed := auth.uid() is not null;
  if tg_op = 'INSERT' then
    new.slug := coalesce(nullif(public.slugify(new.slug), ''), public.unique_firm_slug(new.name));
    if exists (select 1 from public.firms f where f.slug = new.slug) then
      new.slug := public.unique_firm_slug(new.name);
    end if;
    new.owner_email := coalesce(nullif(btrim(new.owner_email), ''), (select u.email from auth.users u where u.id = new.owner_id));
    if v_authed and not public.is_admin() then
      new.status := 'pending';
      new.verified := false;
    end if;
    return new;
  end if;

  -- UPDATE
  new.slug := coalesce(nullif(public.slugify(new.slug), ''), old.slug);
  if new.slug <> old.slug and exists (select 1 from public.firms f where f.slug = new.slug and f.id <> new.id) then
    new.slug := public.unique_firm_slug(new.name);
  end if;
  if v_authed and not public.is_admin() then
    new.status := old.status;
    new.verified := old.verified;
    new.rating_avg := old.rating_avg;
    new.rating_count := old.rating_count;
    new.views := old.views;
    new.owner_id := old.owner_id;
    new.owner_email := old.owner_email;
    new.rejection_reason := old.rejection_reason;
  end if;
  return new;
end $$;

drop trigger if exists firms_before_write on public.firms;
create trigger firms_before_write before insert or update on public.firms for each row execute function public.firms_before_write();

-- New account -> profile row (+ firm row when registering as a company).
create or replace function public.handle_new_user() returns trigger
language plpgsql security definer set search_path = public as $$
declare v_firm text; v_city text; v_phone text;
begin
  insert into public.profiles (id, role, full_name)
  values (new.id, 'firm', coalesce(new.raw_user_meta_data ->> 'full_name', ''))
  on conflict (id) do nothing;

  v_firm := nullif(btrim(coalesce(new.raw_user_meta_data ->> 'firm_name', '')), '');
  if v_firm is not null then
    v_city := coalesce(nullif(btrim(new.raw_user_meta_data ->> 'city'), ''), 'chisinau');
    v_phone := nullif(btrim(coalesce(new.raw_user_meta_data ->> 'phone', '')), '');
    insert into public.firms (owner_id, owner_email, name, slug, city, phone, status, published, currency)
    values (new.id, new.email, v_firm, public.unique_firm_slug(v_firm), v_city, v_phone, 'pending', false, 'MDL')
    on conflict (owner_id) where owner_id is not null do nothing;
  end if;
  return new;
end $$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert on auth.users for each row execute function public.handle_new_user();

-- Role can only be changed by an administrator (or directly in SQL).
create or replace function public.profiles_before_write() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if tg_op = 'UPDATE' and auth.uid() is not null and not public.is_admin() then
    new.role := old.role;   -- signed-in users cannot promote themselves
  end if;
  return new;
end $$;
drop trigger if exists profiles_before_write on public.profiles;
create trigger profiles_before_write before update on public.profiles for each row execute function public.profiles_before_write();

-- Public reviews always start as pending.
create or replace function public.reviews_before_insert() returns trigger
language plpgsql security definer set search_path = public as $$
begin
  if auth.uid() is null then return new; end if;   -- service role / SQL editor keeps the given status
  if not public.is_admin() then new.status := 'pending'; end if;
  return new;
end $$;
drop trigger if exists reviews_before_insert on public.reviews;
create trigger reviews_before_insert before insert on public.reviews for each row execute function public.reviews_before_insert();

-- Keep firms.rating_avg / rating_count in sync with approved reviews.
create or replace function public.recalc_firm_rating() returns trigger
language plpgsql security definer set search_path = public as $$
declare fid uuid;
begin
  fid := coalesce(new.firm_id, old.firm_id);
  update public.firms f set
    rating_avg = coalesce((select round(avg(r.rating)::numeric, 2) from public.reviews r where r.firm_id = fid and r.status = 'approved'), 0),
    rating_count = coalesce((select count(*) from public.reviews r where r.firm_id = fid and r.status = 'approved'), 0)
  where f.id = fid;
  return coalesce(new, old);
end $$;
drop trigger if exists reviews_recalc on public.reviews;
create trigger reviews_recalc after insert or update or delete on public.reviews for each row execute function public.recalc_firm_rating();

-- View counter used by /api/view
create or replace function public.increment_firm_views(firm_slug text) returns integer
language sql security definer as $$
  update public.firms set views = coalesce(views, 0) + 1 where slug = firm_slug returning views;
$$;

-- -------------------------------------------------------------------- RLS ---
alter table public.profiles enable row level security;
alter table public.cities enable row level security;
alter table public.categories enable row level security;
alter table public.taxonomies enable row level security;
alter table public.firms enable row level security;
alter table public.services enable row level security;
alter table public.inquiries enable row level security;
alter table public.reviews enable row level security;
alter table public.settings enable row level security;

drop policy if exists profiles_read on public.profiles;
create policy profiles_read on public.profiles for select to authenticated
  using (id = auth.uid() or public.is_admin());
drop policy if exists profiles_write on public.profiles;
create policy profiles_write on public.profiles for update to authenticated
  using (id = auth.uid() or public.is_admin()) with check (id = auth.uid() or public.is_admin());

drop policy if exists cities_read on public.cities;
create policy cities_read on public.cities for select to anon, authenticated using (true);
drop policy if exists cities_write on public.cities;
create policy cities_write on public.cities for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists categories_read on public.categories;
create policy categories_read on public.categories for select to anon, authenticated using (true);
drop policy if exists categories_write on public.categories;
create policy categories_write on public.categories for all to authenticated using (public.is_admin()) with check (public.is_admin());

drop policy if exists taxonomies_read on public.taxonomies;
create policy taxonomies_read on public.taxonomies for select to anon, authenticated using (true);
drop policy if exists taxonomies_write on public.taxonomies;
create policy taxonomies_write on public.taxonomies for all to authenticated using (public.is_admin()) with check (public.is_admin());

-- Public browsing: approved + published only.
drop policy if exists firms_read_public on public.firms;
create policy firms_read_public on public.firms for select to anon, authenticated
  using ((status = 'approved' and published) or owner_id = auth.uid() or public.is_admin());
drop policy if exists firms_insert on public.firms;
create policy firms_insert on public.firms for insert to authenticated
  with check (owner_id = auth.uid());
drop policy if exists firms_update on public.firms;
create policy firms_update on public.firms for update to authenticated
  using (owner_id = auth.uid() or public.is_admin()) with check (owner_id = auth.uid() or public.is_admin());
drop policy if exists firms_delete on public.firms;
create policy firms_delete on public.firms for delete to authenticated
  using (owner_id = auth.uid() or public.is_admin());

drop policy if exists services_read on public.services;
create policy services_read on public.services for select to anon, authenticated
  using (active or public.is_admin() or exists (select 1 from public.firms f where f.id = firm_id and f.owner_id = auth.uid()));
drop policy if exists services_write on public.services;
create policy services_write on public.services for all to authenticated
  using (exists (select 1 from public.firms f where f.id = firm_id and (f.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.firms f where f.id = firm_id and (f.owner_id = auth.uid() or public.is_admin())));

-- Inquiries are inserted ONLY by the server (service role, bypasses RLS).
drop policy if exists inquiries_read on public.inquiries;
create policy inquiries_read on public.inquiries for select to authenticated
  using (exists (select 1 from public.firms f where f.id = firm_id and (f.owner_id = auth.uid() or public.is_admin())));
drop policy if exists inquiries_write on public.inquiries;
create policy inquiries_write on public.inquiries for update to authenticated
  using (exists (select 1 from public.firms f where f.id = firm_id and (f.owner_id = auth.uid() or public.is_admin())))
  with check (exists (select 1 from public.firms f where f.id = firm_id and (f.owner_id = auth.uid() or public.is_admin())));
drop policy if exists inquiries_delete on public.inquiries;
create policy inquiries_delete on public.inquiries for delete to authenticated
  using (exists (select 1 from public.firms f where f.id = firm_id and (f.owner_id = auth.uid() or public.is_admin())));

drop policy if exists reviews_read on public.reviews;
create policy reviews_read on public.reviews for select to anon, authenticated
  using (status = 'approved' or exists (select 1 from public.firms f where f.id = firm_id and (f.owner_id = auth.uid() or public.is_admin())));
drop policy if exists reviews_insert on public.reviews;
create policy reviews_insert on public.reviews for insert to anon, authenticated with check (true);
drop policy if exists reviews_write on public.reviews;
create policy reviews_write on public.reviews for update to authenticated
  using (public.is_admin() or exists (select 1 from public.firms f where f.id = firm_id and f.owner_id = auth.uid()))
  with check (public.is_admin() or exists (select 1 from public.firms f where f.id = firm_id and f.owner_id = auth.uid()));
drop policy if exists reviews_delete on public.reviews;
create policy reviews_delete on public.reviews for delete to authenticated
  using (public.is_admin() or exists (select 1 from public.firms f where f.id = firm_id and f.owner_id = auth.uid()));

drop policy if exists settings_read on public.settings;
create policy settings_read on public.settings for select to anon, authenticated using (true);
drop policy if exists settings_write on public.settings;
create policy settings_write on public.settings for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

-- ----------------------------------------------------------------- storage ---
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists media_public_read on storage.objects;
create policy media_public_read on storage.objects for select to anon, authenticated
  using (bucket_id = 'media');
drop policy if exists media_owner_write on storage.objects;
create policy media_owner_write on storage.objects for insert to authenticated
  with check (bucket_id = 'media' and (storage.foldername(name))[2] = auth.uid()::text or public.is_admin());
drop policy if exists media_owner_update on storage.objects;
create policy media_owner_update on storage.objects for update to authenticated
  using (bucket_id = 'media' and ((storage.foldername(name))[2] = auth.uid()::text or public.is_admin()));
drop policy if exists media_owner_delete on storage.objects;
create policy media_owner_delete on storage.objects for delete to authenticated
  using (bucket_id = 'media' and ((storage.foldername(name))[2] = auth.uid()::text or public.is_admin()));

-- ------------------------------------------------------- API role grants ---
-- Supabase projects normally grant these via default privileges; declaring
-- them explicitly keeps this file safe on any project. Row Level Security
-- (above) still controls WHICH rows each role can touch.
grant usage on schema public to anon, authenticated, service_role;
grant all on all tables in schema public to anon, authenticated, service_role;
grant all on all sequences in schema public to anon, authenticated, service_role;
alter default privileges in schema public grant all on tables to anon, authenticated, service_role;
alter default privileges in schema public grant all on sequences to anon, authenticated, service_role;

-- ============================================================================
--  USEFUL ONE-OFF COMMANDS (run in SQL Editor when needed)
--
--  Make yourself admin (replace the e-mail):
--    update public.profiles set role = 'admin'
--    where id = (select id from auth.users where email = 'you@example.com');
--
--  Delete the example companies:
--    delete from public.firms where slug like 'demo-%';
--
--  Approve everything pending (not recommended):
--    update public.firms set status = 'approved', published = true where status = 'pending';
-- ============================================================================
