-- =====================================================================
-- 05_donation_centers.sql  —  Hospitals / blood-donation centers
-- Depends on: 01_init.sql
-- =====================================================================

create table if not exists public.donation_centers (
  id            uuid primary key default gen_random_uuid(),
  name          text not null,
  location      text not null,
  address       text,
  rating        numeric(2,1) default 4.5,
  reviews_count integer default 0,
  created_at    timestamptz not null default timezone('utc', now())
);

alter table public.donation_centers enable row level security;

drop policy if exists "donation_centers_select_all" on public.donation_centers;
create policy "donation_centers_select_all"
  on public.donation_centers for select using (true);

-- Seed a few centers so the scheduler has options (only if table is empty).
insert into public.donation_centers (name, location, address, rating, reviews_count)
select * from (values
  ('City General Hospital',        'Downtown, Karachi',  'Main Rd, Karachi',   4.8, 156),
  ('Regional Medical Center',      'North Karachi',      'Block 5, Karachi',   4.6,  89),
  ('Aga Khan University Hospital', 'Karachi, Pakistan',  'Stadium Rd, Karachi',4.9, 320),
  ('Shaukat Khanum Hospital',      'Lahore, Pakistan',   'Johar Town, Lahore', 4.7, 210),
  ('Services Hospital',            'Lahore, Pakistan',   'Jail Rd, Lahore',    4.4, 134)
) as seed(name, location, address, rating, reviews_count)
where not exists (select 1 from public.donation_centers);
