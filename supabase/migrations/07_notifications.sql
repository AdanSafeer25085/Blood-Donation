-- =====================================================================
-- 07_notifications.sql  —  Per-user notifications
-- Depends on: 02_profiles.sql
-- =====================================================================

create table if not exists public.notifications (
  id          uuid primary key default gen_random_uuid(),
  user_id     uuid not null references public.profiles(id) on delete cascade,
  type        text not null default 'update',   -- urgent | reminder | achievement | update
  title       text not null,
  message     text,
  action      text,                             -- respond | schedule | view | update
  read        boolean not null default false,
  created_at  timestamptz not null default timezone('utc', now())
);

create index if not exists idx_notifications_user_id on public.notifications(user_id);

alter table public.notifications enable row level security;

drop policy if exists "notifications_select_own" on public.notifications;
create policy "notifications_select_own"
  on public.notifications for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "notifications_insert_own" on public.notifications;
create policy "notifications_insert_own"
  on public.notifications for insert
  to authenticated
  with check (auth.uid() = user_id);

drop policy if exists "notifications_update_own" on public.notifications;
create policy "notifications_update_own"
  on public.notifications for update
  to authenticated
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "notifications_delete_own" on public.notifications;
create policy "notifications_delete_own"
  on public.notifications for delete
  to authenticated
  using (auth.uid() = user_id);
