-- =====================================================================
-- 03_reviews.sql  —  Reviews left on donor profiles
-- Depends on: 02_profiles.sql
-- =====================================================================

create table if not exists public.reviews (
  id          uuid primary key default gen_random_uuid(),
  donor_id    uuid not null references public.profiles(id) on delete cascade,
  author_id   uuid references public.profiles(id) on delete set null,
  review      text not null,
  created_at  timestamptz not null default timezone('utc', now())
);

create index if not exists idx_reviews_donor_id on public.reviews(donor_id);

alter table public.reviews enable row level security;

drop policy if exists "reviews_select_all" on public.reviews;
create policy "reviews_select_all"
  on public.reviews for select
  using (true);

-- Only signed-in users can leave reviews.
drop policy if exists "reviews_insert_authenticated" on public.reviews;
create policy "reviews_insert_authenticated"
  on public.reviews for insert
  to authenticated
  with check (true);
