-- Phase 4B.11 - Add Cascading Deletes
-- Migration: 013_add_cascading_deletes.sql
-- Purpose: Add ON DELETE CASCADE to prevent orphaned records

-- Add foreign key constraint with CASCADE for uploads.report_id
-- First, drop any existing foreign key constraint if it exists
alter table public.uploads
drop constraint if exists uploads_report_id_fkey;

-- Add proper foreign key with CASCADE
alter table public.uploads
add constraint uploads_report_id_fkey
foreign key (report_id)
references public.reports(id)
on delete cascade;

-- Add foreign key constraint with CASCADE for weekly_logs.report_id
-- First, drop any existing foreign key constraint if it exists
alter table public.weekly_logs
drop constraint if exists weekly_logs_report_id_fkey;

-- Add proper foreign key with CASCADE
alter table public.weekly_logs
add constraint weekly_logs_report_id_fkey
foreign key (report_id)
references public.reports(id)
on delete cascade;

-- Ensure user_id is NOT NULL on uploads
alter table public.uploads
alter column user_id set not null;

-- Ensure report_id is NOT NULL on uploads
alter table public.uploads
alter column report_id set not null;
