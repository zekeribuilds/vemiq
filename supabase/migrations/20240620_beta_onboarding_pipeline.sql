-- Phase 4B.14 - Beta Launch Preparation
-- Migration: 20240620_beta_onboarding_pipeline.sql
-- Purpose: Enhance beta_users table with onboarding pipeline tracking

-- Add onboarding pipeline tracking columns to beta_users
alter table public.beta_users
add column if not exists waitlist_joined_at timestamp with time zone,
add column if not exists account_created_at timestamp with time zone,
add column if not exists profile_completed_at timestamp with time zone,
add column if not exists first_logbook_created_at timestamp with time zone,
add column if not exists first_report_created_at timestamp with time zone,
add column if not exists first_export_at timestamp with time zone,
add column if not exists onboarding_step text default 'waitlist',
add column if not exists conversion_rate numeric default 0,
add column if not exists department text,
add column if not exists institution text,
add column if not exists referral_source text;

-- Add index for onboarding_step
create index if not exists idx_beta_users_onboarding_step on public.beta_users(onboarding_step);
create index if not exists idx_beta_users_conversion on public.beta_users(conversion_rate);

-- Update onboarding_step trigger function
create or replace function public.update_beta_onboarding_step()
returns trigger
language plpgsql
as $$
begin
    -- Calculate onboarding step based on completed milestones
    if new.first_export_at is not null then
        new.onboarding_step := 'exported';
        new.conversion_rate := 100;
    elsif new.first_report_created_at is not null then
        new.onboarding_step := 'report_created';
        new.conversion_rate := 85.7;
    elsif new.first_logbook_created_at is not null then
        new.onboarding_step := 'logbook_created';
        new.conversion_rate := 71.4;
    elsif new.profile_completed_at is not null then
        new.onboarding_step := 'profile_completed';
        new.conversion_rate := 57.1;
    elsif new.account_created_at is not null then
        new.onboarding_step := 'account_created';
        new.conversion_rate := 42.8;
    elsif new.approved_at is not null then
        new.onboarding_step := 'approved';
        new.conversion_rate := 28.5;
    elsif new.waitlist_joined_at is not null then
        new.onboarding_step := 'waitlist';
        new.conversion_rate := 14.2;
    end if;
    
    return new;
end;
$$;

-- Create trigger for automatic onboarding step updates
drop trigger if exists beta_users_onboarding_step_trigger on public.beta_users;
create trigger beta_users_onboarding_step_trigger
before insert or update on public.beta_users
for each row
execute function public.update_beta_onboarding_step();

-- Create function to track onboarding events
create or replace function public.track_onboarding_event(
    p_user_id uuid,
    p_event_type text
)
returns void
language plpgsql
security definer
as $$
declare
    v_beta_user record;
begin
    -- Get or create beta user record
    select * into v_beta_user
    from public.beta_users
    where user_id = p_user_id;
    
    if not found then
        insert into public.beta_users (user_id, status, waitlist_joined_at)
        values (p_user_id, 'pending', now());
    end if;
    
    -- Update appropriate timestamp based on event type
    case p_event_type
        when 'account_created' then
            update public.beta_users
            set account_created_at = now()
            where user_id = p_user_id;
        when 'profile_completed' then
            update public.beta_users
            set profile_completed_at = now()
            where user_id = p_user_id;
        when 'first_logbook_created' then
            update public.beta_users
            set first_logbook_created_at = now()
            where user_id = p_user_id;
        when 'first_report_created' then
            update public.beta_users
            set first_report_created_at = now()
            where user_id = p_user_id;
        when 'first_export' then
            update public.beta_users
            set first_export_at = now()
            where user_id = p_user_id;
    end case;
end;
$$;

-- Grant execute permission on tracking function
grant execute on function public.track_onboarding_event to authenticated;
