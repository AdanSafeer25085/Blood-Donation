-- =====================================================================
-- 02_profiles.sql  —  User profiles linked to Supabase Auth
-- Depends on: 01_init.sql
--
-- Supabase Auth owns the `auth.users` table (email + password + session).
-- We keep application data in `public.profiles`, one row per auth user,
-- sharing the SAME uuid as the primary key / foreign key.
-- A trigger auto-creates the profile row whenever a user signs up, using
-- the metadata passed to supabase.auth.signUp({ options: { data: {...} } }).
-- =====================================================================

create table if not exists public.profiles (
  id                  uuid primary key references auth.users(id) on delete cascade,
  email               text,
  first_name          text not null default '',
  last_name           text not null default '',
  mobile_number       text not null default '',
  location            text not null default '',
  blood_group         text not null default '',
  bio                 text,
  emergency_contact   text,
  emergency_phone     text,
  medical_conditions  text,
  medications         text,
  allergies           text,
  available           boolean not null default true,
  verified            boolean not null default false,
  created_at          timestamptz not null default timezone('utc', now()),
  updated_at          timestamptz not null default timezone('utc', now())
);

create index if not exists idx_profiles_blood_group on public.profiles(blood_group);
create index if not exists idx_profiles_location    on public.profiles(location);

-- Auto-create a profile row on sign-up, reading the sign-up metadata.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (
    id, email, first_name, last_name, mobile_number, location, blood_group
  )
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', ''),
    coalesce(new.raw_user_meta_data ->> 'last_name', ''),
    coalesce(new.raw_user_meta_data ->> 'mobile_number', ''),
    coalesce(new.raw_user_meta_data ->> 'location', ''),
    coalesce(new.raw_user_meta_data ->> 'blood_group', '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Keep updated_at fresh.
drop trigger if exists trg_profiles_updated_at on public.profiles;
create trigger trg_profiles_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

-- Row Level Security
alter table public.profiles enable row level security;

-- Profiles are a public donor directory (read-only to everyone).
drop policy if exists "profiles_select_all" on public.profiles;
create policy "profiles_select_all"
  on public.profiles for select
  using (true);

-- A user may insert their own profile row (fallback; the trigger normally does it).
drop policy if exists "profiles_insert_own" on public.profiles;
create policy "profiles_insert_own"
  on public.profiles for insert
  with check (auth.uid() = id);

-- A user may update only their own profile.
drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
