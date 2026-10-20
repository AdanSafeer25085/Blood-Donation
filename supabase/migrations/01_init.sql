-- =====================================================================
-- 01_init.sql  —  Extensions + shared helpers
-- Run this FIRST in the Supabase SQL Editor (new project).
-- Safe to re-run (idempotent).
-- =====================================================================

-- gen_random_uuid() lives in pgcrypto.
create extension if not exists pgcrypto;

-- Shared trigger function: keeps an `updated_at` column current on UPDATE.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;
