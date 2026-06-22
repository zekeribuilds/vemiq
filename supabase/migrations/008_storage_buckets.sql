-- Vemiq Database V1 - Storage Buckets and report_exports Table
-- Migration: 008_storage_buckets.sql

-- STEP 1: CREATE report_exports TABLE

create table public.report_exports (
    id uuid primary key default gen_random_uuid(),

    report_id uuid not null
        references public.reports(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    storage_path text not null,

    version_number integer not null,

    created_at timestamptz not null default now()
);

-- STEP 2: ENABLE RLS ON report_exports

alter table public.report_exports enable row level security;

-- STEP 3: CREATE RLS POLICIES FOR report_exports
-- Ownership inherited from report

create policy "Users can view own report_exports"
on public.report_exports for select
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can insert own report_exports"
on public.report_exports for insert
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can delete own report_exports"
on public.report_exports for delete
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

-- STEP 4: CREATE STORAGE BUCKETS

-- avatars bucket
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- institution-assets bucket
insert into storage.buckets (id, name, public)
values ('institution-assets', 'institution-assets', true)
on conflict (id) do nothing;

-- organization-assets bucket
insert into storage.buckets (id, name, public)
values ('organization-assets', 'organization-assets', true)
on conflict (id) do nothing;

-- logbook-files bucket
insert into storage.buckets (id, name, public)
values ('logbook-files', 'logbook-files', false)
on conflict (id) do nothing;

-- report-exports bucket
insert into storage.buckets (id, name, public)
values ('report-exports', 'report-exports', false)
on conflict (id) do nothing;

-- STEP 5: CREATE INDEX FOR report_exports

create index idx_report_exports_report
on public.report_exports(report_id);

create index idx_report_exports_user
on public.report_exports(user_id);
