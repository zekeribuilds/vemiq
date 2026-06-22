-- Vemiq Database V1 - Paystack Integration Layer
-- Migration: 010_paystack_integration.sql

-- STEP 1: IMPROVE payments TABLE

alter table public.payments
add column if not exists paystack_reference text unique;

alter table public.payments
add column if not exists paystack_transaction_id bigint;

alter table public.payments
add column if not exists paid_at timestamptz;

alter table public.payments
add column if not exists gateway_response text;

alter table public.payments
add column if not exists metadata jsonb;

-- STEP 2: CREATE report_access TABLE

create table public.report_access (
    id uuid primary key default gen_random_uuid(),

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    report_id uuid not null
        references public.reports(id)
        on delete cascade,

    payment_id uuid not null
        references public.payments(id)
        on delete cascade,

    unlocked_at timestamptz not null default now(),

    expires_at timestamptz,

    unique(user_id, report_id)
);

-- STEP 3: ENABLE RLS ON report_access

alter table public.report_access enable row level security;

-- STEP 4: CREATE RLS POLICIES FOR report_access
-- Ownership inherited from report

create policy "Users can view own report_access"
on public.report_access for select
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can insert own report_access"
on public.report_access for insert
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Admins can view all report_access"
on public.report_access for select
using (public.is_admin());

-- STEP 5: CREATE INDEXES FOR report_access

create index idx_report_access_user
on public.report_access(user_id);

create index idx_report_access_report
on public.report_access(report_id);

create index idx_report_access_payment
on public.report_access(payment_id);

-- STEP 6: CREATE INDEX FOR payments PAYSTACK COLUMNS

create index idx_payments_paystack_reference
on public.payments(paystack_reference);

create index idx_payments_paystack_transaction_id
on public.payments(paystack_transaction_id);

-- STEP 7: CREATE HELPER FUNCTION TO CHECK REPORT ACCESS

create or replace function public.has_report_access(report_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.report_access ra
        where ra.report_id = report_uuid
        and ra.user_id = auth.uid()
        and (ra.expires_at is null or ra.expires_at > now())
    );
$$;

-- STEP 8: CREATE HELPER FUNCTION TO CHECK IF PAYMENT ALREADY UNLOCKED REPORT

create or replace function public.is_report_unlocked(report_uuid uuid, user_uuid uuid)
returns boolean
language sql
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.report_access ra
        where ra.report_id = report_uuid
        and ra.user_id = user_uuid
    );
$$;
