-- Vemiq Database V1 - Core Tables
-- Migration: 003_core_tables.sql

-- INSTITUTION SYSTEM

create table public.institutions (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    logo_url text,
    state text,
    country text default 'Nigeria',
    created_at timestamptz not null default now()
);

create table public.faculties (
    id uuid primary key default gen_random_uuid(),
    institution_id uuid not null
        references public.institutions(id)
        on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    unique(institution_id, name)
);

create table public.departments (
    id uuid primary key default gen_random_uuid(),
    faculty_id uuid not null
        references public.faculties(id)
        on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    unique(faculty_id, name)
);

-- ORGANIZATION SYSTEM

create table public.training_organizations (
    id uuid primary key default gen_random_uuid(),
    name text not null unique,
    address text,
    industry text,
    logo_url text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.organization_departments (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null
        references public.training_organizations(id)
        on delete cascade,
    name text not null,
    created_at timestamptz not null default now(),
    unique(organization_id, name)
);

create table public.organization_knowledge (
    id uuid primary key default gen_random_uuid(),
    organization_id uuid not null
        references public.training_organizations(id)
        on delete cascade,
    overview text,
    history text,
    mission text,
    tools_used text,
    safety_rules text,
    processes text,
    notes text,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- USER PROFILES

create table public.profiles (
    id uuid primary key
        references auth.users(id)
        on delete cascade,
    full_name text,
    avatar_url text,
    institution_id uuid
        references public.institutions(id),
    faculty_id uuid
        references public.faculties(id),
    department_id uuid
        references public.departments(id),
    matric_number text,
    academic_session text,
    siwes_coordinator_name text,
    supervisor_name text,
    role user_role not null default 'student',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

-- LOGBOOK SYSTEM

create table public.logbooks (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null
        references auth.users(id)
        on delete cascade,
    title text not null,
    program_type program_type not null,
    institution_id uuid
        references public.institutions(id),
    training_organization_id uuid
        references public.training_organizations(id),
    department_name text,
    start_date date,
    end_date date,
    status logbook_status not null default 'active',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.logbook_entries (
    id uuid primary key default gen_random_uuid(),
    logbook_id uuid not null
        references public.logbooks(id)
        on delete cascade,
    user_id uuid not null
        references auth.users(id)
        on delete cascade,
    entry_date date not null,
    week_number integer,
    title text,
    activity_description text not null,
    ai_cleaned_text text,
    source_type source_type not null default 'text',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.logbook_evidence (
    id uuid primary key default gen_random_uuid(),
    entry_id uuid not null
        references public.logbook_entries(id)
        on delete cascade,
    user_id uuid not null
        references auth.users(id)
        on delete cascade,
    storage_path text not null,
    file_type file_type not null,
    mime_type text,
    created_at timestamptz not null default now()
);

-- REPORT SYSTEM

create table public.reports (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null
        references auth.users(id)
        on delete cascade,
    title text not null,
    report_type program_type not null,
    institution_id uuid
        references public.institutions(id),
    training_organization_id uuid
        references public.training_organizations(id),
    status report_status not null default 'draft',
    progress integer not null default 0
        check (progress >= 0 and progress <= 100),
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.report_sections (
    id uuid primary key default gen_random_uuid(),
    report_id uuid not null
        references public.reports(id)
        on delete cascade,
    title text not null,
    content text,
    section_order integer not null,
    ai_generated boolean not null default false,
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);

create table public.report_versions (
    id uuid primary key default gen_random_uuid(),
    report_id uuid not null
        references public.reports(id)
        on delete cascade,
    snapshot jsonb,
    created_at timestamptz not null default now()
);

create table public.report_logbook_entries (
    report_id uuid not null
        references public.reports(id)
        on delete cascade,
    entry_id uuid not null
        references public.logbook_entries(id)
        on delete cascade,
    created_at timestamptz not null default now(),
    primary key (
        report_id,
        entry_id
    )
);

-- CHAT SYSTEM

create table public.chat_messages (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null
        references auth.users(id)
        on delete cascade,
    report_id uuid
        references public.reports(id)
        on delete cascade,
    role chat_role not null,
    message text not null,
    created_at timestamptz not null default now()
);

-- PAYMENTS

create table public.payments (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null
        references auth.users(id)
        on delete cascade,
    report_id uuid
        references public.reports(id),
    amount integer not null,
    currency text not null default 'NGN',
    status payment_status not null default 'pending',
    reference text unique,
    created_at timestamptz not null default now()
);

-- FILE UPLOADS

create table public.uploads (
    id uuid primary key default gen_random_uuid(),
    user_id uuid not null
        references auth.users(id)
        on delete cascade,
    file_url text not null,
    file_type text,
    linked_to text,
    created_at timestamptz not null default now()
);

-- ACTIVITY LOGS

create table public.activity_logs (
    id uuid primary key default gen_random_uuid(),
    user_id uuid
        references auth.users(id)
        on delete set null,
    action text not null,
    metadata jsonb,
    created_at timestamptz not null default now()
);
