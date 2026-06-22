-- Vemiq Database V1 - Row Level Security (RLS)
-- Migration: 007_rls.sql

-- STEP 1: ENABLE RLS ON ALL TABLES

alter table public.profiles enable row level security;
alter table public.institutions enable row level security;
alter table public.faculties enable row level security;
alter table public.departments enable row level security;
alter table public.training_organizations enable row level security;
alter table public.organization_departments enable row level security;
alter table public.organization_knowledge enable row level security;
alter table public.logbooks enable row level security;
alter table public.logbook_entries enable row level security;
alter table public.logbook_evidence enable row level security;
alter table public.reports enable row level security;
alter table public.report_sections enable row level security;
alter table public.report_versions enable row level security;
alter table public.report_logbook_entries enable row level security;
alter table public.chat_messages enable row level security;
alter table public.payments enable row level security;
alter table public.uploads enable row level security;
alter table public.activity_logs enable row level security;

-- STEP 2: PROFILES POLICIES
-- Owner only: auth.uid() = id

create policy "Users can view own profile"
on public.profiles for select
using (auth.uid() = id);

create policy "Users can insert own profile"
on public.profiles for insert
with check (auth.uid() = id);

create policy "Users can update own profile"
on public.profiles for update
using (auth.uid() = id)
with check (auth.uid() = id);

-- STEP 3: PUBLIC REFERENCE DATA POLICIES
-- Authenticated users: SELECT
-- Admins: INSERT, UPDATE, DELETE

-- institutions

create policy "Authenticated users can view institutions"
on public.institutions for select
using (auth.role() = 'authenticated');

create policy "Admins can insert institutions"
on public.institutions for insert
with check (public.is_admin());

create policy "Admins can update institutions"
on public.institutions for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete institutions"
on public.institutions for delete
using (public.is_admin());

-- faculties

create policy "Authenticated users can view faculties"
on public.faculties for select
using (auth.role() = 'authenticated');

create policy "Admins can insert faculties"
on public.faculties for insert
with check (public.is_admin());

create policy "Admins can update faculties"
on public.faculties for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete faculties"
on public.faculties for delete
using (public.is_admin());

-- departments

create policy "Authenticated users can view departments"
on public.departments for select
using (auth.role() = 'authenticated');

create policy "Admins can insert departments"
on public.departments for insert
with check (public.is_admin());

create policy "Admins can update departments"
on public.departments for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete departments"
on public.departments for delete
using (public.is_admin());

-- training_organizations

create policy "Authenticated users can view training_organizations"
on public.training_organizations for select
using (auth.role() = 'authenticated');

create policy "Admins can insert training_organizations"
on public.training_organizations for insert
with check (public.is_admin());

create policy "Admins can update training_organizations"
on public.training_organizations for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete training_organizations"
on public.training_organizations for delete
using (public.is_admin());

-- organization_departments

create policy "Authenticated users can view organization_departments"
on public.organization_departments for select
using (auth.role() = 'authenticated');

create policy "Admins can insert organization_departments"
on public.organization_departments for insert
with check (public.is_admin());

create policy "Admins can update organization_departments"
on public.organization_departments for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete organization_departments"
on public.organization_departments for delete
using (public.is_admin());

-- organization_knowledge

create policy "Authenticated users can view organization_knowledge"
on public.organization_knowledge for select
using (auth.role() = 'authenticated');

create policy "Admins can insert organization_knowledge"
on public.organization_knowledge for insert
with check (public.is_admin());

create policy "Admins can update organization_knowledge"
on public.organization_knowledge for update
using (public.is_admin())
with check (public.is_admin());

create policy "Admins can delete organization_knowledge"
on public.organization_knowledge for delete
using (public.is_admin());

-- STEP 4: USER-OWNED DATA POLICIES
-- Owner only: auth.uid() = user_id or inherited ownership

-- logbooks

create policy "Users can view own logbooks"
on public.logbooks for select
using (auth.uid() = user_id);

create policy "Users can insert own logbooks"
on public.logbooks for insert
with check (auth.uid() = user_id);

create policy "Users can update own logbooks"
on public.logbooks for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own logbooks"
on public.logbooks for delete
using (auth.uid() = user_id);

-- logbook_entries

create policy "Users can view own logbook_entries"
on public.logbook_entries for select
using (auth.uid() = user_id);

create policy "Users can insert own logbook_entries"
on public.logbook_entries for insert
with check (auth.uid() = user_id);

create policy "Users can update own logbook_entries"
on public.logbook_entries for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own logbook_entries"
on public.logbook_entries for delete
using (auth.uid() = user_id);

-- logbook_evidence
-- Ownership inherited through logbook_entries

create policy "Users can view own logbook_evidence"
on public.logbook_evidence for select
using (
    exists (
        select 1
        from public.logbook_entries le
        where le.id = entry_id
        and le.user_id = auth.uid()
    )
);

create policy "Users can insert own logbook_evidence"
on public.logbook_evidence for insert
with check (auth.uid() = user_id);

create policy "Users can update own logbook_evidence"
on public.logbook_evidence for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own logbook_evidence"
on public.logbook_evidence for delete
using (auth.uid() = user_id);

-- reports

create policy "Users can view own reports"
on public.reports for select
using (auth.uid() = user_id);

create policy "Users can insert own reports"
on public.reports for insert
with check (auth.uid() = user_id);

create policy "Users can update own reports"
on public.reports for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own reports"
on public.reports for delete
using (auth.uid() = user_id);

-- report_sections
-- Ownership inherited from report

create policy "Users can view own report_sections"
on public.report_sections for select
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can insert own report_sections"
on public.report_sections for insert
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can update own report_sections"
on public.report_sections for update
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can delete own report_sections"
on public.report_sections for delete
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

-- report_versions
-- Ownership inherited from report

create policy "Users can view own report_versions"
on public.report_versions for select
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can insert own report_versions"
on public.report_versions for insert
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can update own report_versions"
on public.report_versions for update
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can delete own report_versions"
on public.report_versions for delete
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

-- report_logbook_entries
-- Ownership inherited from report

create policy "Users can view own report_logbook_entries"
on public.report_logbook_entries for select
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can insert own report_logbook_entries"
on public.report_logbook_entries for insert
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can update own report_logbook_entries"
on public.report_logbook_entries for update
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
)
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can delete own report_logbook_entries"
on public.report_logbook_entries for delete
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

-- chat_messages

create policy "Users can view own chat_messages"
on public.chat_messages for select
using (auth.uid() = user_id);

create policy "Users can insert own chat_messages"
on public.chat_messages for insert
with check (auth.uid() = user_id);

create policy "Users can update own chat_messages"
on public.chat_messages for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own chat_messages"
on public.chat_messages for delete
using (auth.uid() = user_id);

-- payments

create policy "Users can view own payments"
on public.payments for select
using (auth.uid() = user_id);

create policy "Users can insert own payments"
on public.payments for insert
with check (auth.uid() = user_id);

create policy "Users can update own payments"
on public.payments for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- No delete policy for payments

-- uploads

create policy "Users can view own uploads"
on public.uploads for select
using (auth.uid() = user_id);

create policy "Users can insert own uploads"
on public.uploads for insert
with check (auth.uid() = user_id);

create policy "Users can update own uploads"
on public.uploads for update
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

create policy "Users can delete own uploads"
on public.uploads for delete
using (auth.uid() = user_id);

-- activity_logs
-- User: auth.uid() = user_id
-- Admin: public.is_admin() for full visibility

create policy "Users can view own activity_logs"
on public.activity_logs for select
using (auth.uid() = user_id);

create policy "Admins can view all activity_logs"
on public.activity_logs for select
using (public.is_admin());

create policy "Users can insert own activity_logs"
on public.activity_logs for insert
with check (auth.uid() = user_id);

create policy "Admins can insert activity_logs"
on public.activity_logs for insert
with check (public.is_admin());
