-- =====================================================================
-- 06_donations.sql  —  Donation history & scheduled appointments
-- Depends on: 02_profiles.sql, 05_donation_centers.sql
--
-- A single table holds both completed donations and scheduled
-- appointments, distinguished by `status`. Dashboard stats, history,
-- eligibility and the scheduler all read from here.
-- =====================================================================

create table if not exists public.donations (
  id           uuid primary key default gen_random_uuid(),
  donor_id     uuid not null references public.profiles(id) on delete cascade,
  center_id    uuid references public.donation_centers(id) on delete set null,
  hospital     text,
  donation_date date not null default (timezone('utc', now()))::date,
  donation_time text,
  status       text not null default 'scheduled',  -- scheduled | completed | cancelled
  volume       integer default 450,
  points       integer default 0,
  lives_saved  integer default 0,
  notes        text,
  certificate  boolean default false,
  created_at   timestamptz not null default timezone('utc', now()),
  updated_at   timestamptz not null default timezone('utc', now())
);

create index if not exists idx_donations_donor_id on public.donations(donor_id);
create index if not exists idx_donations_status   on public.donations(status);
create index if not exists idx_donations_date      on public.donations(donation_date);

drop trigger if exists trg_donations_updated_at on public.donations;
create trigger trg_donations_updated_at
  before update on public.donations
  for each row execute function public.set_updated_at();

alter table public.donations enable row level security;

-- Donations are private to the donor.
drop policy if exists "donations_select_own" on public.donations;
create policy "donations_select_own"
  on public.donations for select
  to authenticated
  using (auth.uid() = donor_id);

drop policy if exists "donations_insert_own" on public.donations;
create policy "donations_insert_own"
  on public.donations for insert
  to authenticated
  with check (auth.uid() = donor_id);

drop policy if exists "donations_update_own" on public.donations;
create policy "donations_update_own"
  on public.donations for update
  to authenticated
  using (auth.uid() = donor_id)
  with check (auth.uid() = donor_id);
