-- Vemiq Database V1 - Functions and Triggers
-- Migration: 006_functions_and_triggers.sql

-- STEP 1: CREATE is_admin()
-- Purpose: Used later by RLS policies

create or replace function public.is_admin()
returns boolean
language sql
security definer
set search_path = public
as $$
    select exists (
        select 1
        from public.profiles
        where id = auth.uid()
        and role = 'admin'
    );
$$;

-- STEP 2: CREATE update_updated_at_column()
-- Purpose: Automatically update updated_at timestamps

create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- STEP 3: CREATE handle_new_user()
-- Purpose: Automatically create profile after signup
-- Supports: Email signup, Google OAuth, Future providers

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin

    insert into public.profiles (
        id,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at
    )
    values (
        new.id,

        coalesce(
            new.raw_user_meta_data->>'full_name',
            new.raw_user_meta_data->>'name',
            ''
        ),

        new.raw_user_meta_data->>'avatar_url',

        'student',

        now(),
        now()
    )

    on conflict (id) do nothing;

    return new;

end;
$$;

-- STEP 4: CREATE calculate_report_progress()
-- Purpose: Automatically calculate report completion
-- Rules: Completed Sections / Total Sections × 100
-- A section is complete when: content IS NOT NULL AND content <> ''

create or replace function public.calculate_report_progress(
    report_uuid uuid
)
returns integer
language plpgsql
as $$
declare
    total_sections integer;
    completed_sections integer;
begin

    select count(*)
    into total_sections
    from public.report_sections
    where report_id = report_uuid;

    select count(*)
    into completed_sections
    from public.report_sections
    where report_id = report_uuid
      and content is not null
      and trim(content) <> '';

    if total_sections = 0 then
        return 0;
    end if;

    return round(
        (
            completed_sections::numeric
            /
            total_sections::numeric
        ) * 100
    );

end;
$$;

-- STEP 5: CREATE refresh_report_progress()
-- Purpose: Update reports.progress automatically

create or replace function public.refresh_report_progress()
returns trigger
language plpgsql
as $$
begin

    update public.reports
    set progress =
        public.calculate_report_progress(
            coalesce(
                new.report_id,
                old.report_id
            )
        )
    where id =
        coalesce(
            new.report_id,
            old.report_id
        );

    return null;

end;
$$;

-- STEP 6: CREATE UPDATED_AT TRIGGERS
-- Apply to: profiles, training_organizations, organization_knowledge, logbooks, logbook_entries, reports, report_sections

create trigger profiles_updated_at
before update
on public.profiles
for each row
execute function public.update_updated_at_column();

create trigger training_organizations_updated_at
before update
on public.training_organizations
for each row
execute function public.update_updated_at_column();

create trigger organization_knowledge_updated_at
before update
on public.organization_knowledge
for each row
execute function public.update_updated_at_column();

create trigger logbooks_updated_at
before update
on public.logbooks
for each row
execute function public.update_updated_at_column();

create trigger logbook_entries_updated_at
before update
on public.logbook_entries
for each row
execute function public.update_updated_at_column();

create trigger reports_updated_at
before update
on public.reports
for each row
execute function public.update_updated_at_column();

create trigger report_sections_updated_at
before update
on public.report_sections
for each row
execute function public.update_updated_at_column();

-- STEP 7: CREATE AUTH USER TRIGGER

drop trigger if exists on_auth_user_created
on auth.users;

create trigger on_auth_user_created
after insert
on auth.users
for each row
execute function public.handle_new_user();

-- STEP 8: CREATE REPORT PROGRESS TRIGGERS
-- Whenever: report_sections inserted, updated, deleted → Update report progress

create trigger report_progress_after_insert
after insert
on public.report_sections
for each row
execute function public.refresh_report_progress();

create trigger report_progress_after_update
after update
on public.report_sections
for each row
execute function public.refresh_report_progress();

create trigger report_progress_after_delete
after delete
on public.report_sections
for each row
execute function public.refresh_report_progress();
