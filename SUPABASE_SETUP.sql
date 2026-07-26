-- =====================================================================
-- PINOY PONDO — Supabase setup
-- Run this ONCE in your Supabase SQL Editor (Project → SQL → New query).
-- Safe to re-run.
-- =====================================================================

-- ---------- PROFILES (borrower KYC + admin approval status) ----------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  first_name text,
  last_name text,
  full_name text,
  dob date,
  mobile text,
  email text,
  address text,
  employer text,
  job_title text,
  employment_type text,
  monthly_income numeric,
  years_employed numeric,
  office_address text,
  id_type text,
  id_number text,
  id_photo_url text,
  selfie_url text,
  approval_status text not null default 'pending', -- pending | approved | rejected
  approved_at timestamptz,
  rejected_reason text,
  created_at timestamptz not null default now()
);

grant select, insert, update on public.profiles to authenticated;
grant all on public.profiles to service_role;

alter table public.profiles enable row level security;

drop policy if exists "profiles self read" on public.profiles;
create policy "profiles self read" on public.profiles for select
  to authenticated using (auth.uid() = id);

drop policy if exists "profiles self insert" on public.profiles;
create policy "profiles self insert" on public.profiles for insert
  to authenticated with check (auth.uid() = id);

drop policy if exists "profiles self update" on public.profiles;
create policy "profiles self update" on public.profiles for update
  to authenticated using (auth.uid() = id);

-- Admin console reads/updates approvals with the anon key (there is no
-- Supabase admin auth in-app; access is gated by the ADMIN_08 passcode).
drop policy if exists "profiles anon read" on public.profiles;
create policy "profiles anon read" on public.profiles for select
  to anon using (true);

drop policy if exists "profiles anon update" on public.profiles;
create policy "profiles anon update" on public.profiles for update
  to anon using (true) with check (true);

grant select, update on public.profiles to anon;

-- ---------- LOANS ----------
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  borrower_name text,
  amount numeric not null,
  term_months int not null,
  interest_rate numeric not null default 4.0,
  status text not null default 'pending',
  approved_at timestamptz,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.loans to authenticated, anon;
grant all on public.loans to service_role;
alter table public.loans enable row level security;
drop policy if exists "loans all" on public.loans;
create policy "loans all" on public.loans for all to anon, authenticated using (true) with check (true);

-- ---------- PAYMENTS ----------
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references public.loans(id) on delete cascade,
  amount numeric not null,
  method text not null default 'cash',
  note text,
  recorded_by uuid,
  paid_at timestamptz not null default now()
);
grant select, insert, update, delete on public.payments to authenticated, anon;
grant all on public.payments to service_role;
alter table public.payments enable row level security;
drop policy if exists "payments all" on public.payments;
create policy "payments all" on public.payments for all to anon, authenticated using (true) with check (true);

-- ---------- INVESTMENTS ----------
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  investor_name text not null,
  amount numeric not null,
  note text,
  created_at timestamptz not null default now()
);
grant select, insert, update, delete on public.investments to authenticated, anon;
grant all on public.investments to service_role;
alter table public.investments enable row level security;
drop policy if exists "investments all" on public.investments;
create policy "investments all" on public.investments for all to anon, authenticated using (true) with check (true);

-- ---------- STORAGE BUCKET for ID photos ----------
insert into storage.buckets (id, name, public)
values ('ids', 'ids', true)
on conflict (id) do update set public = true;

drop policy if exists "ids public read" on storage.objects;
create policy "ids public read" on storage.objects for select
  to anon, authenticated using (bucket_id = 'ids');

drop policy if exists "ids authenticated upload" on storage.objects;
create policy "ids authenticated upload" on storage.objects for insert
  to authenticated with check (bucket_id = 'ids');

drop policy if exists "ids anon upload" on storage.objects;
create policy "ids anon upload" on storage.objects for insert
  to anon with check (bucket_id = 'ids');
