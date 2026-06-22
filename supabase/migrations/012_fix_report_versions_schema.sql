-- Phase 4B.11 - Fix report_versions Schema
-- Migration: 012_fix_report_versions_schema.sql
-- Purpose: Add missing critical fields for export reliability

-- Add missing columns to report_versions
alter table public.report_versions
add column if not exists user_id uuid
    references auth.users(id)
    on delete cascade;

alter table public.report_versions
add column if not exists pdf_path text;

alter table public.report_versions
add column if not exists page_count integer;

alter table public.report_versions
add column if not exists amount_paid numeric;

alter table public.report_versions
add column if not exists currency text default 'NGN';

alter table public.report_versions
add column if not exists payment_reference text;

alter table public.report_versions
add column if not exists payment_status text default 'pending';

alter table public.report_versions
add column if not exists export_type text;

-- Add index for user_id on report_versions
create index if not exists idx_report_versions_user
on public.report_versions(user_id);

-- Add index for payment_reference on report_versions
create index if not exists idx_report_versions_payment_reference
on public.report_versions(payment_reference);

-- Add unique constraint on payment_reference to prevent duplicates
alter table public.report_versions
add constraint report_versions_payment_reference_unique
unique (payment_reference);
