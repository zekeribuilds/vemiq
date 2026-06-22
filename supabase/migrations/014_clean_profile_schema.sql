-- Phase 4B.11 - Clean Profile Schema
-- Migration: 014_clean_profile_schema.sql
-- Purpose: Remove forbidden fields from profiles table

-- Remove subscription_plan (billing was removed in Phase 4B.8)
alter table public.profiles
drop column if exists subscription_plan;

-- Remove academic_session (belongs in report_metadata)
alter table public.profiles
drop column if exists academic_session;

-- Remove siwes_coordinator_name (belongs in report_metadata)
alter table public.profiles
drop column if exists siwes_coordinator_name;

-- Remove supervisor_name (belongs in report_metadata)
alter table public.profiles
drop column if exists supervisor_name;

-- Ensure these fields exist in report_metadata table
alter table public.report_metadata
add column if not exists academic_session text;

alter table public.report_metadata
add column if not exists coordinator_name text;

alter table public.report_metadata
add column if not exists supervisor_name text;
