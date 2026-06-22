-- Phase 4B.12 - Analytics and Feedback Infrastructure
-- Migration: 015_analytics_and_feedback_infrastructure.sql
-- Purpose: Create tables for analytics, feedback, and beta access control

-- Create analytics_events table
create table if not exists public.analytics_events (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    event_type text not null,
    event_category text not null, -- acquisition, activation, usage, revenue, retention
    event_name text not null,
    properties jsonb default '{}',
    page text,
    referrer text,
    user_agent text,
    ip_address text,
    created_at timestamp with time zone default now()
);

-- Create feedback table
create table if not exists public.feedback (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    type text not null, -- bug_report, feature_request, general_feedback
    message text not null,
    page text,
    status text default 'open', -- open, reviewed, resolved
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create beta_users table
create table if not exists public.beta_users (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade unique,
    status text default 'pending', -- pending, approved, rejected
    invited_at timestamp with time zone,
    approved_at timestamp with time zone,
    approved_by uuid references auth.users(id),
    notes text,
    created_at timestamp with time zone default now(),
    updated_at timestamp with time zone default now()
);

-- Create indexes for analytics_events
create index idx_analytics_events_user on public.analytics_events(user_id);
create index idx_analytics_events_type on public.analytics_events(event_type);
create index idx_analytics_events_category on public.analytics_events(event_category);
create index idx_analytics_events_created on public.analytics_events(created_at);
create index idx_analytics_events_user_created on public.analytics_events(user_id, created_at);

-- Create indexes for feedback
create index idx_feedback_user on public.feedback(user_id);
create index idx_feedback_status on public.feedback(status);
create index idx_feedback_type on public.feedback(type);
create index idx_feedback_created on public.feedback(created_at);

-- Create indexes for beta_users
create index idx_beta_users_user on public.beta_users(user_id);
create index idx_beta_users_status on public.beta_users(status);

-- Enable RLS on analytics_events
alter table public.analytics_events enable row level security;

-- RLS policies for analytics_events
create policy "Users can view their own analytics events"
on public.analytics_events for select
using (auth.uid() = user_id);

create policy "Users can insert their own analytics events"
on public.analytics_events for insert
with check (auth.uid() = user_id);

create policy "Admins can view all analytics events"
on public.analytics_events for select
using (
    exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
);

-- Enable RLS on feedback
alter table public.feedback enable row level security;

-- RLS policies for feedback
create policy "Users can view their own feedback"
on public.feedback for select
using (auth.uid() = user_id);

create policy "Users can insert their own feedback"
on public.feedback for insert
with check (auth.uid() = user_id);

create policy "Admins can view all feedback"
on public.feedback for select
using (
    exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
);

create policy "Admins can update feedback status"
on public.feedback for update
using (
    exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
);

-- Enable RLS on beta_users
alter table public.beta_users enable row level security;

-- RLS policies for beta_users
create policy "Users can view their own beta status"
on public.beta_users for select
using (auth.uid() = user_id);

create policy "Admins can view all beta users"
on public.beta_users for select
using (
    exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
);

create policy "Admins can update beta user status"
on public.beta_users for update
using (
    exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
);

create policy "Admins can insert beta users"
on public.beta_users for insert
with check (
    exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
);

-- Function to update updated_at timestamp
create or replace function public.update_updated_at_column()
returns trigger
language plpgsql
as $$
begin
    new.updated_at = now();
    return new;
end;
$$;

-- Triggers for updated_at
create trigger feedback_updated_at
before update on public.feedback
for each row
execute function public.update_updated_at_column();

create trigger beta_users_updated_at
before update on public.beta_users
for each row
execute function public.update_updated_at_column();
