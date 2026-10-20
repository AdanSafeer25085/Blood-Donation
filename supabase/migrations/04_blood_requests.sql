-- =====================================================================
-- 04_blood_requests.sql  —  Blood requests + donor contacts + responses
-- Depends on: 02_profiles.sql
-- =====================================================================

create table if not exists public.blood_requests (
  id                   uuid primary key default gen_random_uuid(),
  requester_id         uuid references public.profiles(id) on delete set null,
  patient_name         text,
  cnic                 text,
  blood_group          text not null,
  units_needed         integer not null default 1,
  urgency              text not null default 'normal',   -- normal | urgent | critical
  hospital             text not null,
  location             text not null,
  contact_number       text not null,
  needed_by            timestamptz,
  description          text,
  requester_name       text not null,
  relation_to_patient  text not null,
  status               text not null default 'active',   -- active | fulfilled | cancelled | pending
  created_at           timestamptz not null default timezone('utc', now()),
  updated_at           timestamptz not null default timezone('utc', now())
);

create index if not exists idx_blood_requests_blood_group  on public.blood_requests(blood_group);
create index if not exists idx_blood_requests_location     on public.blood_requests(location);
create index if not exists idx_blood_requests_status       on public.blood_requests(status);
create index if not exists idx_blood_requests_requester_id on public.blood_requests(requester_id);

drop trigger if exists trg_blood_requests_updated_at on public.blood_requests;
create trigger trg_blood_requests_updated_at
  before update on public.blood_requests
  for each row execute function public.set_updated_at();

-- Tracks when a requester reaches out to a donor.
create table if not exists public.donor_contacts (
  id            uuid primary key default gen_random_uuid(),
  request_id    uuid references public.blood_requests(id) on delete cascade,
  donor_id      uuid references public.profiles(id) on delete cascade,
  donor_name    text,
  status        text not null default 'sent',            -- sent | responded | completed
  contacted_at  timestamptz not null default timezone('utc', now())
);

create index if not exists idx_donor_contacts_request_id on public.donor_contacts(request_id);
create index if not exists idx_donor_contacts_donor_id   on public.donor_contacts(donor_id);

-- Tracks a donor's response to a request.
create table if not exists public.request_responses (
  id             uuid primary key default gen_random_uuid(),
  request_id     uuid references public.blood_requests(id) on delete cascade,
  donor_id       uuid references public.profiles(id) on delete cascade,
  response_type  text not null,                          -- willing | maybe | cannot
  message        text,
  created_at     timestamptz not null default timezone('utc', now())
);

create index if not exists idx_request_responses_request_id on public.request_responses(request_id);
create index if not exists idx_request_responses_donor_id   on public.request_responses(donor_id);

-- ---------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------
alter table public.blood_requests   enable row level security;
alter table public.donor_contacts   enable row level security;
alter table public.request_responses enable row level security;

-- blood_requests: public read; create when signed in; edit/delete your own.
drop policy if exists "blood_requests_select_all" on public.blood_requests;
create policy "blood_requests_select_all"
  on public.blood_requests for select using (true);

-- Anyone (including anonymous visitors using the public "Request Blood"
-- form) may create a request. Signed-in users may attach their own id;
-- anonymous requests must leave requester_id null.
drop policy if exists "blood_requests_insert_authenticated" on public.blood_requests;
drop policy if exists "blood_requests_insert_any" on public.blood_requests;
create policy "blood_requests_insert_any"
  on public.blood_requests for insert
  with check (requester_id is null or auth.uid() = requester_id);

drop policy if exists "blood_requests_update_own" on public.blood_requests;
create policy "blood_requests_update_own"
  on public.blood_requests for update
  to authenticated
  using (auth.uid() = requester_id)
  with check (auth.uid() = requester_id);

drop policy if exists "blood_requests_delete_own" on public.blood_requests;
create policy "blood_requests_delete_own"
  on public.blood_requests for delete
  to authenticated
  using (auth.uid() = requester_id);

-- donor_contacts: public read; create when signed in.
drop policy if exists "donor_contacts_select_all" on public.donor_contacts;
create policy "donor_contacts_select_all"
  on public.donor_contacts for select using (true);

drop policy if exists "donor_contacts_insert_authenticated" on public.donor_contacts;
create policy "donor_contacts_insert_authenticated"
  on public.donor_contacts for insert to authenticated with check (true);

-- request_responses: public read; create when signed in.
drop policy if exists "request_responses_select_all" on public.request_responses;
create policy "request_responses_select_all"
  on public.request_responses for select using (true);

drop policy if exists "request_responses_insert_authenticated" on public.request_responses;
create policy "request_responses_insert_authenticated"
  on public.request_responses for insert to authenticated with check (true);
