-- Phase 4B.13 - Report Quality and Feedback Enhancements
-- Migration: 016_report_quality_and_feedback_enhancements.sql
-- Purpose: Add report quality tracking and feedback prioritization

-- Add columns to feedback table for prioritization
alter table public.feedback
add column if not exists impact_score integer default 0;

alter table public.feedback
add column if not exists frequency_score integer default 0;

alter table public.feedback
add column if not exists priority_score integer default 0;

alter table public.feedback
add column if not exists priority_level text default 'medium';

-- Create report_quality table
create table if not exists public.report_quality (
    id uuid default gen_random_uuid() primary key,
    user_id uuid references auth.users(id) on delete cascade,
    report_version_id uuid references public.report_versions(id) on delete cascade,
    edit_level text not null, -- no_edits, minor_edits, moderate_edits, major_edits
    satisfaction_score integer, -- 1-5
    feedback_text text,
    created_at timestamp with time zone default now()
);

-- Add indexes for feedback prioritization
create index if not exists idx_feedback_priority on public.feedback(priority_level);
create index if not exists idx_feedback_priority_score on public.feedback(priority_score desc);

-- Add indexes for report_quality
create index if not exists idx_report_quality_user on public.report_quality(user_id);
create index if not exists idx_report_quality_report on public.report_quality(report_version_id);
create index if not exists idx_report_quality_edit_level on public.report_quality(edit_level);

-- Enable RLS on report_quality
alter table public.report_quality enable row level security;

-- RLS policies for report_quality
create policy "Users can view their own report quality"
on public.report_quality for select
using (auth.uid() = user_id);

create policy "Users can insert their own report quality"
on public.report_quality for insert
with check (auth.uid() = user_id);

create policy "Admins can view all report quality"
on public.report_quality for select
using (
    exists (
        select 1 from public.profiles
        where profiles.id = auth.uid()
        and profiles.role = 'admin'
    )
);

-- Function to calculate priority score
create or replace function public.calculate_feedback_priority()
returns trigger
language plpgsql
as $$
begin
    -- Calculate priority score based on impact and frequency
    new.priority_score := (new.impact_score * 0.7) + (new.frequency_score * 0.3);
    
    -- Set priority level based on score
    if new.priority_score >= 80 then
        new.priority_level := 'critical';
    elsif new.priority_score >= 60 then
        new.priority_level := 'high';
    elsif new.priority_score >= 40 then
        new.priority_level := 'medium';
    else
        new.priority_level := 'low';
    end if;
    
    return new;
end;
$$;

-- Trigger for priority calculation
create trigger feedback_priority_calculation
before insert or update on public.feedback
for each row
execute function public.calculate_feedback_priority();
