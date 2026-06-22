-- Vemiq Database V1 - Report Generation Engine
-- Migration: 011_report_generation_engine.sql

-- STEP 1: CREATE generation_status ENUM

create type generation_status as enum (
    'pending',
    'processing',
    'completed',
    'failed'
);

-- STEP 2: CREATE report_generation_jobs TABLE

create table public.report_generation_jobs (
    id uuid primary key default gen_random_uuid(),

    report_id uuid not null
        references public.reports(id)
        on delete cascade,

    section_id uuid not null
        references public.report_sections(id)
        on delete cascade,

    user_id uuid not null
        references auth.users(id)
        on delete cascade,

    status generation_status not null default 'pending',

    prompt jsonb,

    generated_content text,

    error_message text,

    created_at timestamptz not null default now(),

    completed_at timestamptz
);

-- STEP 3: ENABLE RLS ON report_generation_jobs

alter table public.report_generation_jobs enable row level security;

-- STEP 4: CREATE RLS POLICIES FOR report_generation_jobs
-- Ownership inherited from report

create policy "Users can view own report_generation_jobs"
on public.report_generation_jobs for select
using (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can insert own report_generation_jobs"
on public.report_generation_jobs for insert
with check (
    exists (
        select 1
        from public.reports r
        where r.id = report_id
        and r.user_id = auth.uid()
    )
);

create policy "Users can update own report_generation_jobs"
on public.report_generation_jobs for update
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

create policy "Admins can view all report_generation_jobs"
on public.report_generation_jobs for select
using (public.is_admin());

-- STEP 5: CREATE INDEXES FOR report_generation_jobs

create index idx_report_generation_jobs_report
on public.report_generation_jobs(report_id);

create index idx_report_generation_jobs_section
on public.report_generation_jobs(section_id);

create index idx_report_generation_jobs_user
on public.report_generation_jobs(user_id);

create index idx_report_generation_jobs_status
on public.report_generation_jobs(status);

create index idx_report_generation_jobs_created_at
on public.report_generation_jobs(created_at);

-- STEP 6: CREATE HELPER FUNCTION TO BUILD REPORT CONTEXT

create or replace function public.build_report_context(report_uuid uuid)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    context jsonb := '{}'::jsonb;
    report_record record;
    profile_record record;
    institution_record record;
    organization_record record;
    org_knowledge_record record;
    linked_entries jsonb;
    existing_sections jsonb;
begin

    -- Fetch report details
    select * into report_record
    from public.reports
    where id = report_uuid;

    -- Fetch user profile
    select * into profile_record
    from public.profiles
    where id = report_record.user_id;

    -- Fetch institution if available
    if profile_record.institution_id is not null then
        select * into institution_record
        from public.institutions
        where id = profile_record.institution_id;
    end if;

    -- Fetch training organization if available
    if report_record.training_organization_id is not null then
        select * into organization_record
        from public.training_organizations
        where id = report_record.training_organization_id;

        -- Fetch organization knowledge
        select row_to_json(ok.*) into org_knowledge_record
        from public.organization_knowledge ok
        where ok.organization_id = organization_record.id;
    end if;

    -- Fetch linked logbook entries
    select coalesce(jsonb_agg(
        jsonb_build_object(
            'id', le.id,
            'entry_date', le.entry_date,
            'week_number', le.week_number,
            'title', le.title,
            'activity_description', le.activity_description,
            'ai_cleaned_text', le.ai_cleaned_text,
            'source_type', le.source_type
        )
    ), '[]'::jsonb) into linked_entries
    from public.report_logbook_entries rle
    join public.logbook_entries le on le.id = rle.entry_id
    where rle.report_id = report_uuid;

    -- Fetch existing report sections
    select coalesce(jsonb_agg(
        jsonb_build_object(
            'id', rs.id,
            'title', rs.title,
            'content', rs.content,
            'section_order', rs.section_order,
            'ai_generated', rs.ai_generated
        )
    ), '[]'::jsonb) into existing_sections
    from public.report_sections rs
    where rs.report_id = report_uuid
    order by rs.section_order;

    -- Build context
    context := context || jsonb_build_object(
        'report', jsonb_build_object(
            'id', report_record.id,
            'title', report_record.title,
            'report_type', report_record.report_type,
            'status', report_record.status,
            'progress', report_record.progress
        ),
        'user_profile', jsonb_build_object(
            'id', profile_record.id,
            'full_name', profile_record.full_name,
            'matric_number', profile_record.matric_number,
            'academic_session', profile_record.academic_session,
            'siwes_coordinator_name', profile_record.siwes_coordinator_name,
            'supervisor_name', profile_record.supervisor_name,
            'role', profile_record.role
        ),
        'institution', case when institution_record is not null then
            jsonb_build_object(
                'id', institution_record.id,
                'name', institution_record.name,
                'state', institution_record.state,
                'country', institution_record.country
            )
        else null end,
        'training_organization', case when organization_record is not null then
            jsonb_build_object(
                'id', organization_record.id,
                'name', organization_record.name,
                'address', organization_record.address,
                'industry', organization_record.industry
            )
        else null end,
        'organization_knowledge', org_knowledge_record,
        'linked_logbook_entries', linked_entries,
        'existing_sections', existing_sections
    );

    return context;

end;
$$;

-- STEP 7: CREATE FUNCTION TO INITIALIZE DEFAULT SECTIONS FOR NEW REPORT

create or replace function public.initialize_report_sections(report_uuid uuid, program_type_param program_type)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin

    if program_type_param = 'SWEP' then
        -- SWEP Structure
        insert into public.report_sections (report_id, title, content, section_order, ai_generated)
        values
            (report_uuid, 'Chapter 1: Introduction', null, 1, false),
            (report_uuid, 'Chapter 2: Description of Organization', null, 2, false),
            (report_uuid, 'Chapter 3: Activities Carried Out', null, 3, false),
            (report_uuid, 'Chapter 4: Challenges and Lessons Learned', null, 4, false),
            (report_uuid, 'Chapter 5: Conclusion', null, 5, false);
    elsif program_type_param = 'SIWES' then
        -- SIWES Structure
        insert into public.report_sections (report_id, title, content, section_order, ai_generated)
        values
            (report_uuid, 'Chapter 1: Introduction', null, 1, false),
            (report_uuid, 'Chapter 2: Organization Profile', null, 2, false),
            (report_uuid, 'Chapter 3: Work Performed', null, 3, false),
            (report_uuid, 'Chapter 4: Observations and Challenges', null, 4, false),
            (report_uuid, 'Chapter 5: Conclusion and Recommendations', null, 5, false);
    end if;

end;
$$;

-- STEP 8: CREATE FUNCTION TO CREATE REPORT GENERATION JOB

create or replace function public.create_generation_job(
    report_uuid uuid,
    section_uuid uuid,
    prompt_data jsonb
)
returns uuid
language plpgsql
security definer
set search_path = public
as $$
declare
    job_id uuid;
begin

    insert into public.report_generation_jobs (
        report_id,
        section_id,
        user_id,
        status,
        prompt
    )
    values (
        report_uuid,
        section_uuid,
        auth.uid(),
        'pending',
        prompt_data
    )
    returning id into job_id;

    return job_id;

end;
$$;

-- STEP 9: CREATE FUNCTION TO UPDATE GENERATION JOB STATUS

create or replace function public.update_generation_job_status(
    job_uuid uuid,
    status_param generation_status,
    content_param text default null,
    error_param text default null
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin

    update public.report_generation_jobs
    set
        status = status_param,
        generated_content = content_param,
        error_message = error_param,
        completed_at = case when status_param in ('completed', 'failed') then now() else null end
    where id = job_uuid;

end;
$$;

-- STEP 10: CREATE FUNCTION TO GET GENERATION ANALYTICS

create or replace function public.get_generation_analytics(user_uuid uuid default null)
returns jsonb
language plpgsql
security definer
set search_path = public
as $$
declare
    analytics jsonb := '{}'::jsonb;
    user_filter text := '';
begin

    if user_uuid is not null then
        user_filter := 'and user_id = ''' || user_uuid::text || '''';
    end if;

    execute format('
        select jsonb_build_object(
            ''total_generations'', count(*),
            ''completed_generations'', count(*) filter (where status = ''completed''),
            ''failed_generations'', count(*) filter (where status = ''failed''),
            ''pending_generations'', count(*) filter (where status = ''pending''),
            ''processing_generations'', count(*) filter (where status = ''processing''),
            ''average_generation_time_seconds'', extract(epoch from avg(completed_at - created_at)) filter (where completed_at is not null)
        )
        from public.report_generation_jobs
        where 1=1 %s
    ', user_filter) into analytics;

    return analytics;

end;
$$;
