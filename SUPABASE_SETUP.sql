-- Run this once in your Supabase SQL Editor
-- Project: bzlkbjwofykferwacwxa

-- =========== LOANS ===========
create table if not exists public.loans (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  borrower_name text,
  amount numeric(12,2) not null check (amount > 0),
  term_months int not null check (term_months > 0),
  interest_rate numeric(5,2) not null default 4.0,
  status text not null default 'pending'
    check (status in ('pending','approved','active','paid','rejected','overdue')),
  created_at timestamptz not null default now(),
  approved_at timestamptz
);

grant select, insert, update, delete on public.loans to authenticated;
grant all on public.loans to service_role;

alter table public.loans enable row level security;

create policy "loans_owner_read" on public.loans for select to authenticated
  using (auth.uid() = user_id);
create policy "loans_owner_insert" on public.loans for insert to authenticated
  with check (auth.uid() = user_id);
-- Admin app is behind passcode, not RLS. To let signed-in admins read/manage all:
create policy "loans_all_read_authed" on public.loans for select to authenticated using (true);
create policy "loans_all_update_authed" on public.loans for update to authenticated using (true);

-- =========== PAYMENTS ===========
create table if not exists public.payments (
  id uuid primary key default gen_random_uuid(),
  loan_id uuid not null references public.loans(id) on delete cascade,
  amount numeric(12,2) not null check (amount > 0),
  method text not null default 'cash',
  note text,
  paid_at timestamptz not null default now(),
  recorded_by uuid references auth.users(id)
);

grant select, insert, update, delete on public.payments to authenticated;
grant all on public.payments to service_role;

alter table public.payments enable row level security;
create policy "payments_read_authed" on public.payments for select to authenticated using (true);
create policy "payments_insert_authed" on public.payments for insert to authenticated with check (true);

-- =========== INVESTMENTS ===========
create table if not exists public.investments (
  id uuid primary key default gen_random_uuid(),
  investor_name text not null,
  amount numeric(12,2) not null check (amount > 0),
  note text,
  created_at timestamptz not null default now()
);

grant select, insert, update, delete on public.investments to authenticated;
grant all on public.investments to service_role;

alter table public.investments enable row level security;
create policy "investments_read_authed" on public.investments for select to authenticated using (true);
create policy "investments_insert_authed" on public.investments for insert to authenticated with check (true);
