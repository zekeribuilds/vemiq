# VEMIQ DATABASE FORENSIC AUDIT
**Date:** 2025-01-XX
**Status:** IN PROGRESS

---

## EXECUTIVE SUMMARY

This audit provides a 100% accurate picture of the Vemiq database state based on the explicit statement that **only migrations 001-011 have been executed in production**.

**CRITICAL FINDING:** Significant schema drift exists between production (001-011) and the current codebase which assumes migrations 012-017 and dated 20240615 migrations are applied.

---

## PHASE 1 — SQL FILE INVENTORY

### Numbered Migrations (001-017)

| Migration | Filename | Purpose | Tables Created | Tables Modified | Functions Created | Triggers Created | Policies Created | Dependencies |
|-----------|----------|---------|----------------|-----------------|------------------|------------------|------------------|--------------|
| 001 | 001_extensions.sql | Enable pgcrypto | 0 | 0 | 0 | 0 | 0 | None |
| 002 | 002_enums.sql | Create enums | 0 | 0 | 0 | 0 | 0 | 001 |
| 003 | 003_core_tables.sql | Core tables | 18 | 0 | 0 | 0 | 0 | 001, 002 |
| 004 | 004_relationship_constraints.sql | Constraints (placeholder) | 0 | 0 | 0 | 0 | 0 | 003 |
| 005 | 005_indexes.sql | Performance indexes | 0 | 0 | 0 | 0 | 0 | 003 |
| 006 | 006_functions_and_triggers.sql | Functions & triggers | 0 | 0 | 5 | 11 | 0 | 003 |
| 007 | 007_rls.sql | Row Level Security | 0 | 0 | 0 | 0 | 60+ | 003, 006 |
| 008 | 008_storage_buckets.sql | Storage buckets + report_exports | 1 | 0 | 0 | 0 | 3 | 003 |
| 009 | 009_storage_policies.sql | Storage policies | 0 | 0 | 0 | 0 | 20 | 008 |
| 010 | 010_paystack_integration.sql | Paystack + report_access | 1 | 1 | 2 | 0 | 3 | 003 |
| 011 | 011_report_generation_engine.sql | AI generation | 1 | 0 | 4 | 0 | 4 | 003 |
| 012 | 012_fix_report_versions_schema.sql | Fix report_versions | 0 | 1 | 0 | 0 | 0 | 003 | **NOT EXECUTED** |
| 013 | 013_add_cascading_deletes.sql | Add CASCADE | 0 | 2 | 0 | 0 | 0 | 003 | **NOT EXECUTED** |
| 014 | 014_clean_profile_schema.sql | Clean profiles | 0 | 2 | 0 | 0 | 0 | 003 | **NOT EXECUTED** |
| 015 | 015_analytics_and_feedback_infrastructure.sql | Analytics + feedback | 3 | 1 | 1 | 2 | 12 | 003 | **NOT EXECUTED** |
| 016 | 016_report_quality_and_feedback_enhancements.sql | Report quality | 1 | 1 | 1 | 1 | 3 | 003, 015 | **NOT EXECUTED** |
| 017 | 017_fix_profile_trigger.sql | Fix trigger | 0 | 0 | 1 | 1 | 0 | 003 | **NOT EXECUTED** |

### Dated Migrations (20240615, 20240620)

| Filename | Purpose | Status |
|----------|---------|--------|
| 20240615_create_profiles.sql | Alternative profiles creation | **NOT EXECUTED** |
| 20240615_create_institutions_hierarchy.sql | Alternative institutions | **NOT EXECUTED** |
| 20240615_create_training_organizations.sql | Alternative training orgs | **NOT EXECUTED** |
| 20240615_create_uploads.sql | Alternative uploads | **NOT EXECUTED** |
| 20240615_create_activity_events.sql | Alternative activity_events | **NOT EXECUTED** |
| 20240620_beta_onboarding_pipeline.sql | Beta onboarding | **NOT EXECUTED** |

### Other SQL Files

| Filename | Purpose | Status |
|----------|---------|--------|
| scripts/database-verification.sql | Verification script | Not a migration |

---

## PHASE 2 — EXECUTION HISTORY

### Executed Migrations (Production)

| Migration | Executed? | Reason |
|-----------|-----------|--------|
| 001 | **YES** | User explicitly stated 001-011 executed |
| 002 | **YES** | User explicitly stated 001-011 executed |
| 003 | **YES** | User explicitly stated 001-011 executed |
| 004 | **YES** | User explicitly stated 001-011 executed |
| 005 | **YES** | User explicitly stated 001-011 executed |
| 006 | **YES** | User explicitly stated 001-011 executed |
| 007 | **YES** | User explicitly stated 001-011 executed |
| 008 | **YES** | User explicitly stated 001-011 executed |
| 009 | **YES** | User explicitly stated 001-011 executed |
| 010 | **YES** | User explicitly stated 001-011 executed |
| 011 | **YES** | User explicitly stated 001-011 executed |

### NOT Executed Migrations

| Migration | Executed? | Reason |
|-----------|-----------|--------|
| 012 | **NO** | User stated only 001-011 executed |
| 013 | **NO** | User stated only 001-011 executed |
| 014 | **NO** | User stated only 001-011 executed |
| 015 | **NO** | User stated only 001-011 executed |
| 016 | **NO** | User stated only 001-011 executed |
| 017 | **NO** | User stated only 001-011 executed |
| 20240615_create_profiles.sql | **NO** | Dated migration, not in numbered sequence |
| 20240615_create_institutions_hierarchy.sql | **NO** | Dated migration, not in numbered sequence |
| 20240615_create_training_organizations.sql | **NO** | Dated migration, not in numbered sequence |
| 20240615_create_uploads.sql | **NO** | Dated migration, not in numbered sequence |
| 20240615_create_activity_events.sql | **NO** | Dated migration, not in numbered sequence |
| 20240620_beta_onboarding_pipeline.sql | **NO** | Dated migration, not in numbered sequence |

---

## PHASE 3 — PRODUCTION SCHEMA RECONSTRUCTION (001-011)

### Enums Created (002)

```sql
user_role: ('student', 'admin')
program_type: ('SWEP', 'SIWES')
report_status: ('draft', 'completed')
payment_status: ('pending', 'successful', 'failed')
logbook_status: ('active', 'completed')
source_type: ('text', 'voice', 'image', 'mixed')
file_type: ('image', 'audio', 'pdf', 'document')
chat_role: ('user', 'assistant')
generation_status: ('pending', 'processing', 'completed', 'failed') -- from 011
```

### Tables Created (003)

**Institution System:**
- institutions (id, name, logo_url, state, country, created_at)
- faculties (id, institution_id, name, created_at)
- departments (id, faculty_id, name, created_at)

**Organization System:**
- training_organizations (id, name, address, industry, logo_url, created_at, updated_at)
- organization_departments (id, organization_id, name, created_at)
- organization_knowledge (id, organization_id, overview, history, mission, tools_used, safety_rules, processes, notes, created_at, updated_at)

**User Profiles:**
- profiles (id, full_name, avatar_url, institution_id, faculty_id, department_id, matric_number, academic_session, siwes_coordinator_name, supervisor_name, role, created_at, updated_at)

**Logbook System:**
- logbooks (id, user_id, title, program_type, institution_id, training_organization_id, department_name, start_date, end_date, status, created_at, updated_at)
- logbook_entries (id, logbook_id, user_id, entry_date, week_number, title, activity_description, ai_cleaned_text, source_type, created_at, updated_at)
- logbook_evidence (id, entry_id, user_id, storage_path, file_type, mime_type, created_at)

**Report System:**
- reports (id, user_id, title, report_type, institution_id, training_organization_id, status, progress, created_at, updated_at)
- report_sections (id, report_id, title, content, section_order, ai_generated, created_at, updated_at)
- report_versions (id, report_id, snapshot, created_at)
- report_logbook_entries (report_id, entry_id, created_at)

**Chat System:**
- chat_messages (id, user_id, report_id, role, message, created_at)

**Payments:**
- payments (id, user_id, report_id, amount, currency, status, reference, created_at)

**File Uploads:**
- uploads (id, user_id, file_url, file_type, linked_to, created_at)

**Activity Logs:**
- activity_logs (id, user_id, action, metadata, created_at)

### Tables Created in Later Migrations (NOT IN PRODUCTION)

**From 008:**
- report_exports (id, report_id, user_id, storage_path, version_number, created_at)

**From 010:**
- report_access (id, user_id, report_id, payment_id, unlocked_at, expires_at)

**From 011:**
- report_generation_jobs (id, report_id, section_id, user_id, status, prompt, generated_content, error_message, created_at, completed_at)

**From 015 (NOT EXECUTED):**
- analytics_events (id, user_id, event_type, event_category, event_name, properties, page, referrer, user_agent, ip_address, created_at)
- feedback (id, user_id, type, message, page, status, created_at, updated_at)
- beta_users (id, user_id, status, invited_at, approved_at, approved_by, notes, created_at, updated_at)

**From 016 (NOT EXECUTED):**
- report_quality (id, user_id, report_version_id, edit_level, satisfaction_score, feedback_text, created_at)

### Functions Created (006, 010, 011)

**From 006:**
- is_admin() - Returns boolean if user is admin
- update_updated_at_column() - Auto-updates updated_at
- handle_new_user() - Creates profile on signup
- calculate_report_progress(report_uuid) - Calculates report completion
- refresh_report_progress() - Updates report progress

**From 010:**
- has_report_access(report_uuid) - Checks if user has report access
- is_report_unlocked(report_uuid, user_uuid) - Checks if report is unlocked

**From 011:**
- build_report_context(report_uuid) - Builds context for AI generation
- initialize_report_sections(report_uuid, program_type_param) - Creates default sections
- create_generation_job(report_uuid, section_uuid, prompt_data) - Creates generation job
- update_generation_job_status(job_uuid, status_param, content_param, error_param) - Updates job status
- get_generation_analytics(user_uuid) - Gets generation analytics

### Triggers Created (006)

**Updated At Triggers:**
- profiles_updated_at
- training_organizations_updated_at
- organization_knowledge_updated_at
- logbooks_updated_at
- logbook_entries_updated_at
- reports_updated_at
- report_sections_updated_at

**Auth Trigger:**
- on_auth_user_created (calls handle_new_user())

**Report Progress Triggers:**
- report_progress_after_insert
- report_progress_after_update
- report_progress_after_delete

### Indexes Created (005, 008, 010, 011)

**From 005:**
- idx_profiles_institution
- idx_logbooks_user
- idx_logbook_entries_user
- idx_logbook_entries_logbook
- idx_reports_user
- idx_report_sections_report
- idx_chat_messages_user
- idx_payments_user
- idx_uploads_user

**From 008:**
- idx_report_exports_report
- idx_report_exports_user

**From 010:**
- idx_report_access_user
- idx_report_access_report
- idx_report_access_payment
- idx_payments_paystack_reference
- idx_payments_paystack_transaction_id

**From 011:**
- idx_report_generation_jobs_report
- idx_report_generation_jobs_section
- idx_report_generation_jobs_user
- idx_report_generation_jobs_status
- idx_report_generation_jobs_created_at

### RLS Policies Created (007, 008, 010, 011)

**From 007:**
- Profiles: Owner only (auth.uid() = id)
- Institutions/Faculties/Departments: Authenticated read, Admin write
- Training Organizations/Organization Departments/Organization Knowledge: Authenticated read, Admin write
- Logbooks/Logbook Entries/Logbook Evidence: Owner only
- Reports/Report Sections/Report Versions/Report Logbook Entries: Owner only (inherited from report)
- Chat Messages: Owner only
- Payments: Owner only (no delete)
- Uploads: Owner only
- Activity Logs: Owner view, Admin view all, Owner/Admin insert

**From 008:**
- report_exports: Owner only (inherited from report)

**From 010:**
- report_access: Owner view/insert, Admin view all

**From 011:**
- report_generation_jobs: Owner view/insert/update, Admin view all

 Storage Buckets Created (008)

- avatars (public)
- institution-assets (public)
- organization-assets (public)
- logbook-files (private)
- report-exports (private)

### Storage Policies Created (009)

- avatars: Public read, Owner write
- institution-assets: Public read, Admin write
- organization-assets: Public read, Admin write
- logbook-files: Owner only
- report-exports: Owner only

---

## PHASE 4 — SCHEMA DRIFT ANALYSIS

### CRITICAL DRIFT: Tables Code Expects But Don't Exist in Production

| Table | Expected By | File Evidence | Severity | Impact |
|-------|-------------|--------------|----------|--------|
| weekly_logs | Multiple files | types/database.ts (line 413+), lib/validation/scorecard.ts (line 88), lib/user-behavior.ts (line 47), hooks/useOfflineSync.ts (line 112), app/dashboard/logbook/[id]/week/[weekId]/page.tsx (line 32) | **CRITICAL** | Logbook week management will FAIL |
| report_metadata | Multiple files | types/database.ts (line 307+), app/dashboard/reports/[id]/page.tsx (line 40), app/api/ai/summarize-logbook/route.ts (line 25), app/dashboard/logbook/[id]/page.tsx (line 29), app/dashboard/logbook/create/page.tsx (line 49) | **CRITICAL** | Report metadata display will FAIL |
| analytics_events | Multiple files | lib/validation/scorecard.ts (line 68), lib/user-behavior.ts (line 26), lib/analytics.ts (line 58), lib/analytics/user-journey.ts (line 42), lib/analytics/retention.ts (line 138), lib/analytics/onboarding.ts (line 187), lib/analytics/north-star.ts (line 126), lib/analytics/funnel.ts (line 46) | **HIGH** | Analytics tracking will FAIL |
| feedback | Multiple files | lib/report-quality.ts (line 35), lib/feedback/prioritization.ts (line 38), components/feedback/FeedbackButton.tsx (line 33) | **HIGH** | Feedback submission will FAIL |
| report_quality | Multiple files | lib/report-quality.ts (line 66), lib/validation/scorecard.ts (line 96) | **MEDIUM** | Report quality tracking will FAIL |
| beta_users | Multiple files | lib/analytics/onboarding.ts (line 138), app/admin/page.tsx (line 302) | **MEDIUM** | Beta user management will FAIL |

### CRITICAL DRIFT: Columns Code Expects But Don't Exist in Production

| Table | Column | Expected By | File Evidence | Severity | Impact |
|-------|--------|-------------|--------------|----------|--------|
| profiles | subscription_plan | types/database.ts (line 24) | **HIGH** | Type mismatch - column doesn't exist in 003 schema |
| profiles | onboarding_completed | types/database.ts (line 25) | **HIGH** | Type mismatch - column doesn't exist in 003 schema |
| profiles | email | types/database.ts (line 16) | **HIGH** | Type mismatch - column doesn't exist in 003 schema (email is in auth.users) |
| profiles | phone_number | types/database.ts (line 19) | **MEDIUM** | Type mismatch - column doesn't exist in 003 schema |
| profiles | academic_level | types/database.ts (line 20) | **MEDIUM** | Type mismatch - column doesn't exist in 003 schema |
| report_versions | user_id | 012 migration (line 7) | **HIGH** | Missing foreign key - cascade deletes won't work |
| report_versions | pdf_path | 012 migration (line 12) | **HIGH** | PDF export tracking will FAIL |
| report_versions | page_count | 012 migration (line 15) | **MEDIUM** | PDF export metadata will FAIL |
| report_versions | amount_paid | 012 migration (line 18) | **HIGH** | Payment tracking will FAIL |
| report_versions | currency | 012 migration (line 21) | **MEDIUM** | Payment tracking will FAIL |
| report_versions | payment_reference | 012 migration (line 24) | **HIGH** | Payment tracking will FAIL |
| report_versions | payment_status | 012 migration (line 27) | **HIGH** | Payment tracking will FAIL |
| report_versions | export_type | 012 migration (line 30) | **MEDIUM** | Export type tracking will FAIL |
| payments | paystack_reference | 010 migration (line 7) | **HIGH** | Paystack integration will FAIL |
| payments | paystack_transaction_id | 010 migration (line 10) | **HIGH** | Paystack integration will FAIL |
| payments | paid_at | 010 migration (line 13) | **MEDIUM** | Payment timing will FAIL |
| payments | gateway_response | 010 migration (line 16) | **MEDIUM** | Payment debugging will FAIL |
| payments | metadata | 010 migration (line 19) | **MEDIUM** | Payment metadata will FAIL |
| uploads | report_id | 013 migration (line 13) | **HIGH** | Upload-report linking will FAIL |
| uploads | file_name | 20240615_create_uploads.sql (line 12) | **MEDIUM** | File tracking will FAIL |
| uploads | mime_type | 20240615_create_uploads.sql (line 13) | **MEDIUM** | File type detection will FAIL |
| uploads | file_size | 20240615_create_uploads.sql (line 14) | **MEDIUM** | File size tracking will FAIL |
| uploads | metadata | 20240615_create_uploads.sql (line 16) | **LOW** | File metadata will FAIL |

### CRITICAL DRIFT: Functions Code Expects But Don't Exist in Production

| Function | Expected By | File Evidence | Severity | Impact |
|----------|-------------|--------------|----------|--------|
| log_activity_event() | 20240615_create_activity_events.sql (line 49) | **MEDIUM** | Activity logging will FAIL |
| update_beta_onboarding_step() | 20240620_beta_onboarding_pipeline.sql (line 24) | **MEDIUM** | Beta onboarding will FAIL |
| track_onboarding_event() | 20240620_beta_onboarding_pipeline.sql (line 65) | **MEDIUM** | Beta onboarding will FAIL |
| calculate_feedback_priority() | 016 migration (line 61) | **LOW** | Feedback prioritization will FAIL |

### CRITICAL DRIFT: Triggers Code Expects But Don't Exist in Production

| Trigger | Expected By | File Evidence | Severity | Impact |
|---------|-------------|--------------|----------|--------|
| feedback_updated_at | 015 migration (line 166) | **LOW** | Feedback timestamps won't auto-update |
| beta_users_updated_at | 015 migration (line 171) | **LOW** | Beta user timestamps won't auto-update |
| beta_users_onboarding_step_trigger | 20240620_beta_onboarding_pipeline.sql (line 59) | **MEDIUM** | Beta onboarding won't auto-update |
| feedback_priority_calculation | 016 migration (line 85) | **LOW** | Feedback priority won't auto-calculate |

### Schema Drift Summary

**CRITICAL Issues (Production Breaking):**
- weekly_logs table missing - logbook week management completely broken
- report_metadata table missing - report metadata display completely broken
- report_versions missing critical columns for PDF export and payment tracking
- payments missing Paystack integration columns
- uploads missing report_id foreign key
- profiles table schema mismatch with TypeScript types

**HIGH Issues (Feature Breaking):**
- analytics_events table missing - analytics tracking completely broken
- feedback table missing - feedback submission completely broken
- TypeScript types don't match production schema

**MEDIUM Issues (Degraded):**
- report_quality table missing - quality tracking degraded
- beta_users table missing - beta user management degraded
- Activity logging functions missing

**LOW Issues (Minor):**
- Auto-update triggers missing for analytics tables
- Feedback prioritization missing

---

## PHASE 5 — PROFILE SYSTEM AUDIT

### Production Profile Schema (from 003)

```sql
CREATE TABLE public.profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    full_name text,
    avatar_url text,
    institution_id uuid references public.institutions(id),
    faculty_id uuid references public.faculties(id),
    department_id uuid references public.departments(id),
    matric_number text,
    academic_session text,
    siwes_coordinator_name text,
    supervisor_name text,
    role user_role not null default 'student',
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now()
);
```

### Production handle_new_user() Function (from 006)

```sql
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    INSERT INTO public.profiles (
        id,
        full_name,
        avatar_url,
        role,
        created_at,
        updated_at
    )
    VALUES (
        NEW.id,
        COALESCE(
            NEW.raw_user_meta_data->>'full_name',
            NEW.raw_user_meta_data->>'name',
            ''
        ),
        NEW.raw_user_meta_data->>'avatar_url',
        'student',
        NOW(),
        NOW()
    )
    ON CONFLICT (id) DO NOTHING;

    RETURN NEW;
END;
$$;
```

### Code-Assumed Profile Schema (from types/database.ts)

```typescript
profiles: {
  Row: {
    id: string
    email: string              // ❌ DOES NOT EXIST IN PRODUCTION
    full_name: string | null
    avatar_url: string | null
    matric_number: string | null
    phone_number: string | null  // ❌ DOES NOT EXIST IN PRODUCTION
    academic_level: string | null  // ❌ DOES NOT EXIST IN PRODUCTION
    institution_id: string | null
    faculty_id: string | null
    department_id: string | null
    subscription_plan: string    // ❌ DOES NOT EXIST IN PRODUCTION
    onboarding_completed: boolean  // ❌ DOES NOT EXIST IN PRODUCTION
    created_at: string
    updated_at: string
  }
}
```

### CRITICAL PROFILE MISMATCHES

| Column | Production (003) | Code Assumes | Severity |
|--------|------------------|--------------|----------|
| email | ❌ DOES NOT EXIST | ✅ EXISTS | **CRITICAL** |
| phone_number | ❌ DOES NOT EXIST | ✅ EXISTS | **HIGH** |
| academic_level | ❌ DOES NOT EXIST | ✅ EXISTS | **HIGH** |
| subscription_plan | ❌ DOES NOT EXIST | ✅ EXISTS | **HIGH** |
| onboarding_completed | ❌ DOES NOT EXIST | ✅ EXISTS | **HIGH** |
| academic_session | ✅ EXISTS | ❌ DOES NOT EXIST | **MEDIUM** |
| siwes_coordinator_name | ✅ EXISTS | ❌ DOES NOT EXIST | **MEDIUM** |
| supervisor_name | ✅ EXISTS | ❌ DOES NOT EXIST | **MEDIUM** |

### handle_new_user() Version Analysis

**Production Version (006):**
- Inserts: id, full_name, avatar_url, role, created_at, updated_at
- Uses: raw_user_meta_data (correct Supabase field name)
- Error handling: ON CONFLICT DO NOTHING
- No exception handling

**Code-Assumed Version (017 - NOT EXECUTED):**
- Same insert structure
- Uses: raw_user_meta_data (correct)
- Error handling: ON CONFLICT DO NOTHING
- **ADDITIONAL:** Exception handling with RAISE WARNING

**Alternative Version (20240615_create_profiles.sql - NOT EXECUTED):**
- Inserts: id, full_name, institution_id, faculty_id, department_id, program, academic_session, training_organization_id
- Uses: raw_user_metadata (INCORRECT - should be raw_user_meta_data)
- Error handling: undefined_table exception
- Complex institution matching logic

### Signup Flow Failure Points

**CRITICAL FAILURE:**
1. Code expects `profiles.email` column - **DOES NOT EXIST** in production
   - Impact: Any code querying `profiles.email` will fail
   - Evidence: types/database.ts line 16

2. Code expects `profiles.subscription_plan` column - **DOES NOT EXIST** in production
   - Impact: Any code checking subscription plan will fail
   - Evidence: types/database.ts line 24

3. Code expects `profiles.onboarding_completed` column - **DOES NOT EXIST** in production
   - Impact: Onboarding flow will fail
   - Evidence: types/database.ts line 25

**MEDIUM FAILURE:**
4. Code expects `profiles.academic_session` to be in report_metadata - **DOES NOT EXIST** in production
   - Impact: Report metadata display will fail
   - Evidence: 014 migration tries to move this to report_metadata but wasn't executed

### Onboarding Flow Failure Points

**CRITICAL FAILURE:**
1. Onboarding completion check uses `profiles.onboarding_completed` - **DOES NOT EXIST**
   - Impact: Onboarding status cannot be tracked
   - Evidence: types/database.ts line 25

2. Beta user tracking uses `beta_users` table - **DOES NOT EXIST** in production
   - Impact: Beta onboarding pipeline completely broken
   - Evidence: 015 migration not executed

### Dashboard/Profile Page Failure Points

**CRITICAL FAILURE:**
1. Profile page displays `profiles.email` - **DOES NOT EXIST**
   - Impact: Profile page will fail to load
   - Evidence: types/database.ts line 16

2. Profile page displays `profiles.phone_number` - **DOES NOT EXIST**
   - Impact: Phone number field will fail
   - Evidence: types/database.ts line 19

3. Profile page displays `profiles.academic_level` - **DOES NOT EXIST**
   - Impact: Academic level field will fail
   - Evidence: types/database.ts line 20

**MEDIUM FAILURE:**
4. Profile page expects `profiles.siwes_coordinator_name` - **EXISTS in production but not in types**
   - Impact: TypeScript type mismatch
   - Evidence: 003 schema has it, types don't

5. Profile page expects `profiles.supervisor_name` - **EXISTS in production but not in types**
   - Impact: TypeScript type mismatch
   - Evidence: 003 schema has it, types don't

---

## PHASE 6 — AUTHENTICATION AUDIT

### Signup Flow

**Production State (001-011):**
- ✅ pgcrypto extension enabled (001)
- ✅ profiles table exists (003)
- ✅ handle_new_user() function exists (006)
- ✅ on_auth_user_created trigger exists (006)
- ✅ RLS policies on profiles (007)

**Code Expectations:**
- ❌ Expects profiles.email column - **DOES NOT EXIST**
- ❌ Expects profiles.subscription_plan column - **DOES NOT EXIST**
- ❌ Expects profiles.onboarding_completed column - **DOES NOT EXIST**

**Failure Points:**
1. **CRITICAL:** Signup will succeed but subsequent profile queries will fail if they reference non-existent columns
2. **HIGH:** TypeScript types don't match production schema - type errors at compile time
3. **MEDIUM:** Onboarding completion cannot be tracked

### Email Confirmation

**Production State:**
- ✅ Supabase Auth handles email confirmation
- ✅ No custom database logic required

**Code Expectations:**
- None specific to database schema

**Failure Points:**
- None identified

### Login

**Production State:**
- ✅ Supabase Auth handles login
- ✅ profiles table linked via auth.users.id

**Code Expectations:**
- ❌ Expects profiles.email column - **DOES NOT EXIST**

**Failure Points:**
1. **HIGH:** Login will succeed but profile queries referencing email will fail

### Session Creation

**Production State:**
- ✅ Supabase Auth handles sessions
- ✅ RLS policies use auth.uid()

**Code Expectations:**
- None specific to database schema

**Failure Points:**
- None identified

### Session Refresh

**Production State:**
- ✅ Supabase Auth handles refresh
- ✅ RLS policies use auth.uid()

**Code Expectations:**
- None specific to database schema

**Failure Points:**
- None identified

### Protected Routes

**Production State:**
- ✅ RLS policies enforce row-level security
- ✅ is_admin() function exists (006)

**Code Expectations:**
- ✅ Matches production

**Failure Points:**
- None identified

### Middleware

**Production State:**
- ✅ RLS policies enforce security at database level
- ✅ No custom middleware required

**Code Expectations:**
- None specific to database schema

**Failure Points:**
- None identified

---

## PHASE 7 — VEMIQ FEATURE COMPATIBILITY AUDIT

### Student Profile

**Production Status:** PARTIAL

**Supported:**
- ✅ Basic profile creation (id, full_name, avatar_url, role)
- ✅ Institution/faculty/department linking
- ✅ Matric number
- ✅ Academic session

**NOT Supported:**
- ❌ Email field (code expects it, doesn't exist)
- ❌ Phone number (code expects it, doesn't exist)
- ❌ Academic level (code expects it, doesn't exist)
- ❌ Subscription plan (code expects it, doesn't exist)
- ❌ Onboarding completed flag (code expects it, doesn't exist)

**Impact:** Profile display and editing will fail for non-existent columns

---

### Institutions

**Production Status:** YES

**Supported:**
- ✅ institutions table (003)
- ✅ faculties table (003)
- ✅ departments table (003)
- ✅ Proper foreign key relationships
- ✅ RLS policies (007)

**NOT Supported:**
- None identified

**Impact:** None

---

### Faculties

**Production Status:** YES

**Supported:**
- ✅ faculties table (003)
- ✅ Institution linking
- ✅ RLS policies (007)

**NOT Supported:**
- None identified

**Impact:** None

---

### Departments

**Production Status:** YES

**Supported:**
- ✅ departments table (003)
- ✅ Faculty linking
- ✅ Institution linking
- ✅ RLS policies (007)

**NOT Supported:**
- None identified

**Impact:** None

---

### Reports

**Production Status:** PARTIAL

**Supported:**
- ✅ reports table (003)
- ✅ report_sections table (003)
- ✅ report_versions table (003)
- ✅ report_logbook_entries junction table (003)
- ✅ Report progress calculation (006)
- ✅ RLS policies (007)

**NOT Supported:**
- ❌ report_metadata table (code expects it, doesn't exist)
- ❌ report_versions missing critical columns (user_id, pdf_path, page_count, payment fields)
- ❌ report_exports table (exists in 008 but code may expect different schema)

**Impact:** Report metadata display will fail, PDF export tracking will fail

---

### Report Sections

**Production Status:** YES

**Supported:**
- ✅ report_sections table (003)
- ✅ Auto progress calculation (006)
- ✅ RLS policies (007)

**NOT Supported:**
- None identified

**Impact:** None

---

### Logbooks

**Production Status:** PARTIAL

**Supported:**
- ✅ logbooks table (003)
- ✅ logbook_entries table (003)
- ✅ logbook_evidence table (003)
- ✅ RLS policies (007)

**NOT Supported:**
- ❌ weekly_logs table (code expects it, doesn't exist)
- ❌ uploads table missing report_id foreign key

**Impact:** Weekly log management will completely fail

---

### Weekly Logs

**Production Status:** NO

**Supported:**
- ❌ weekly_logs table DOES NOT EXIST in production

**NOT Supported:**
- ❌ Entire weekly_logs system missing

**Impact:** COMPLETE FAILURE - Weekly log management completely broken

**Evidence:**
- types/database.ts line 413+
- lib/validation/scorecard.ts line 88
- lib/user-behavior.ts line 47
- hooks/useOfflineSync.ts line 112
- app/dashboard/logbook/[id]/week/[weekId]/page.tsx line 32

---

### Uploads

**Production Status:** PARTIAL

**Supported:**
- ✅ uploads table (003)
- ✅ Storage buckets (008)
- ✅ Storage policies (009)
- ✅ RLS policies (007)

**NOT Supported:**
- ❌ uploads.report_id foreign key (added in 013, not executed)
- ❌ uploads.file_name column (in 20240615 version, not executed)
- ❌ uploads.mime_type column (in 20240615 version, not executed)
- ❌ uploads.file_size column (in 20240615 version, not executed)

**Impact:** Upload-report linking will fail, file metadata tracking degraded

---

### AI Chat

**Production Status:** YES

**Supported:**
- ✅ chat_messages table (003)
- ✅ report_generation_jobs table (011)
- ✅ build_report_context function (011)
- ✅ initialize_report_sections function (011)
- ✅ create_generation_job function (011)
- ✅ update_generation_job_status function (011)
- ✅ get_generation_analytics function (011)
- ✅ RLS policies (007, 011)

**NOT Supported:**
- None identified

**Impact:** None

---

### PDF Export

**Production Status:** PARTIAL

**Supported:**
- ✅ report_exports table (008)
- ✅ Storage bucket for PDFs (008)
- ✅ Storage policies (009)

**NOT Supported:**
- ❌ report_versions missing PDF export columns (pdf_path, page_count, export_type)
- ❌ report_versions missing payment tracking columns

**Impact:** PDF export metadata tracking will fail, payment integration will fail

---

### Payments

**Production Status:** PARTIAL

**Supported:**
- ✅ payments table (003)
- ✅ report_access table (010)
- ✅ has_report_access function (010)
- ✅ is_report_unlocked function (010)
- ✅ RLS policies (007, 010)

**NOT Supported:**
- ❌ payments missing Paystack columns (paystack_reference, paystack_transaction_id, paid_at, gateway_response, metadata)
- ❌ report_versions missing payment columns (amount_paid, currency, payment_reference, payment_status)

**Impact:** Paystack integration will completely fail, payment tracking will fail

---

### Activity Events

**Production Status:** NO

**Supported:**
- ❌ analytics_events table DOES NOT EXIST in production
- ❌ activity_events table exists but code expects analytics_events

**NOT Supported:**
- ❌ Entire analytics_events system missing
- ❌ log_activity_event function missing

**Impact:** COMPLETE FAILURE - Analytics tracking completely broken

**Evidence:**
- lib/validation/scorecard.ts line 68
- lib/user-behavior.ts line 26
- lib/analytics.ts line 58
- lib/analytics/user-journey.ts line 42
- lib/analytics/retention.ts line 138
- lib/analytics/onboarding.ts line 187
- lib/analytics/north-star.ts line 126
- lib/analytics/funnel.ts line 46

---

### Dashboard Metrics

**Production Status:** PARTIAL

**Supported:**
- ✅ activity_logs table (003)
- ✅ RLS policies (007)

**NOT Supported:**
- ❌ analytics_events table missing (code expects it)
- ❌ weekly_logs table missing (code expects it)
- ❌ report_quality table missing (code expects it)

**Impact:** Dashboard metrics will fail for analytics, weekly logs, and report quality

---

## PHASE 8 — MIGRATION GAP REPORT

### Migration 012 — Fix report_versions Schema

**Executed:** NO

**Safe to Apply:** YES

**Risk Level:** MEDIUM

**Dependencies:** 003

**Purpose:** Add missing critical fields for export reliability

**Changes:**
- Add user_id foreign key to report_versions
- Add pdf_path, page_count, amount_paid, currency, payment_reference, payment_status, export_type columns
- Add indexes

**Recommendation:** APPLY - Required for PDF export and payment tracking

---

### Migration 013 — Add Cascading Deletes

**Executed:** NO

**Safe to Apply:** YES

**Risk Level:** LOW

**Dependencies:** 003

**Purpose:** Add ON DELETE CASCADE to prevent orphaned records

**Changes:**
- Add CASCADE to uploads.report_id
- Add CASCADE to weekly_logs.report_id
- Make uploads.user_id and uploads.report_id NOT NULL

**Recommendation:** APPLY WITH CAUTION - weekly_logs table doesn't exist in production, will fail
**Action Required:** Create weekly_logs table first or remove weekly_logs references from migration

---

### Migration 014 — Clean Profile Schema

**Executed:** NO

**Safe to Apply:** NO

**Risk Level:** HIGH

**Dependencies:** 003

**Purpose:** Remove forbidden fields from profiles table

**Changes:**
- Drop subscription_plan column (doesn't exist in production)
- Drop academic_session column (EXISTS in production)
- Drop siwes_coordinator_name column (EXISTS in production)
- Drop supervisor_name column (EXISTS in production)
- Add columns to report_metadata table (doesn't exist in production)

**Recommendation:** DO NOT APPLY - Will drop columns that exist in production and reference non-existent table
**Action Required:** Create report_metadata table first, review column drops

---

### Migration 015 — Analytics and Feedback Infrastructure

**Executed:** NO

**Safe to Apply:** YES

**Risk Level:** LOW

**Dependencies:** 003

**Purpose:** Create tables for analytics, feedback, and beta access control

**Changes:**
- Create analytics_events table
- Create feedback table
- Create beta_users table
- Create indexes, RLS policies, triggers

**Recommendation:** APPLY - Required for analytics and feedback features

---

### Migration 016 — Report Quality and Feedback Enhancements

**Executed:** NO

**Safe to Apply:** YES

**Risk Level:** LOW

**Dependencies:** 003, 015

**Purpose:** Add report quality tracking and feedback prioritization

**Changes:**
- Add columns to feedback table
- Create report_quality table
- Create indexes, RLS policies, function, trigger

**Recommendation:** APPLY - Requires 015 applied first

---

### Migration 017 — Fix Profile Trigger

**Executed:** NO

**Safe to Apply:** YES

**Risk Level:** LOW

**Dependencies:** 003

**Purpose:** Fix handle_new_user() trigger to match actual profiles table schema

**Changes:**
- Drop and recreate handle_new_user() function
- Add exception handling

**Recommendation:** APPLY - Improves error handling, no schema changes

---

### Dated Migration 20240615_create_profiles.sql

**Executed:** NO

**Safe to Apply:** NO

**Risk Level:** CRITICAL

**Dependencies:** 003

**Purpose:** Alternative profiles creation

**Changes:**
- Recreates profiles table with different schema
- Uses incorrect field name (raw_user_metadata instead of raw_user_meta_data)

**Recommendation:** DO NOT APPLY - Conflicts with 003, uses incorrect field names

---

### Dated Migration 20240615_create_institutions_hierarchy.sql

**Executed:** NO

**Safe to Apply:** NO

**Risk Level:** CRITICAL

**Dependencies:** 003

**Purpose:** Alternative institutions hierarchy

**Changes:**
- Recreates institutions, faculties, departments tables
- Different schema than 003

**Recommendation:** DO NOT APPLY - Conflicts with 003

---

### Dated Migration 20240615_create_training_organizations.sql

**Executed:** NO

**Safe to Apply:** NO

**Risk Level:** CRITICAL

**Dependencies:** 003

**Purpose:** Alternative training organizations

**Changes:**
- Recreates training_organizations, organization_departments tables
- Different schema than 003

**Recommendation:** DO NOT APPLY - Conflicts with 003

---

### Dated Migration 20240615_create_uploads.sql

**Executed:** NO

**Safe to Apply:** NO

**Risk Level:** CRITICAL

**Dependencies:** 003

**Purpose:** Alternative uploads

**Changes:**
- Recreates uploads table
- Different schema than 003
- Adds report_id foreign key (good but conflicts)

**Recommendation:** DO NOT APPLY - Conflicts with 003, extract report_id changes instead

---

### Dated Migration 20240615_create_activity_events.sql

**Executed:** NO

**Safe to Apply:** NO

**Risk Level:** CRITICAL

**Dependencies:** 003

**Purpose:** Alternative activity_events

**Changes:**
- Creates activity_events table (different from analytics_events)
- Adds log_activity_event function

**Recommendation:** DO NOT APPLY - Code expects analytics_events, not activity_events

---

### Dated Migration 20240620_beta_onboarding_pipeline.sql

**Executed:** NO

**Safe to Apply:** YES

**Risk Level:** LOW

**Dependencies:** 015

**Purpose:** Enhance beta_users table with onboarding pipeline tracking

**Changes:**
- Add onboarding tracking columns to beta_users
- Create update_beta_onboarding_step function
- Create track_onboarding_event function

**Recommendation:** APPLY - Requires 015 applied first

---

## PHASE 9 — RECOVERY PLAN

### Actual Production State

**Database Schema:** Migrations 001-011 only

**Tables Present:**
- institutions, faculties, departments
- training_organizations, organization_departments, organization_knowledge
- profiles (with 003 schema)
- logbooks, logbook_entries, logbook_evidence
- reports, report_sections, report_versions (minimal schema)
- report_logbook_entries
- chat_messages
- payments (minimal schema)
- uploads (minimal schema)
- activity_logs
- report_exports

**Tables Missing:**
- weekly_logs (CRITICAL)
- report_metadata (CRITICAL)
- analytics_events (HIGH)
- feedback (HIGH)
- report_quality (MEDIUM)
- beta_users (MEDIUM)

**Columns Missing:**
- profiles: email, phone_number, academic_level, subscription_plan, onboarding_completed
- report_versions: user_id, pdf_path, page_count, amount_paid, currency, payment_reference, payment_status, export_type
- payments: paystack_reference, paystack_transaction_id, paid_at, gateway_response, metadata
- uploads: report_id foreign key, file_name, mime_type, file_size, metadata

### Missing Migrations

**Critical (Must Apply):**
1. Create weekly_logs table
2. Create report_metadata table
3. Migration 012 (fix report_versions)
4. Migration 015 (analytics and feedback)

**High Priority (Should Apply):**
5. Migration 010 (Paystack integration - already executed but verify)
6. Migration 013 (cascading deletes - fix weekly_logs reference)
7. Migration 016 (report quality)

**Medium Priority (Consider):**
8. Migration 017 (fix profile trigger)
9. Migration 20240620_beta_onboarding_pipeline (if beta program active)

**Do Not Apply:**
- Migration 014 (will break production)
- All 20240615 dated migrations (conflict with 003)

### Critical Schema Drift

**CRITICAL - Production Breaking:**
1. weekly_logs table completely missing
2. report_metadata table completely missing
3. TypeScript types don't match production schema
4. Code references non-existent columns

**HIGH - Feature Breaking:**
5. analytics_events table missing
6. feedback table missing
7. Paystack columns missing from payments
8. PDF export columns missing from report_versions

**MEDIUM - Degraded:**
9. report_quality table missing
10. beta_users table missing
11. uploads missing report_id foreign key

### Required Fixes

**Immediate (Production Breaking):**
1. Create weekly_logs table with proper schema
2. Create report_metadata table with proper schema
3. Update TypeScript types to match production schema
4. Fix code to not reference non-existent columns

**Short-term (Feature Breaking):**
5. Apply migration 015 to create analytics_events and feedback
6. Apply migration 012 to fix report_versions
7. Apply migration 010 to add Paystack columns (verify already applied)

**Medium-term (Degraded):**
8. Apply migration 016 for report_quality
9. Fix migration 013 to remove weekly_logs reference, then apply
10. Apply migration 017 for better error handling

### Safe Migration Order

**Phase 1 - Critical Tables:**
1. Create weekly_logs table (new migration)
2. Create report_metadata table (new migration)
3. Update TypeScript types to match production

**Phase 2 - Fix Existing Schema:**
4. Apply migration 012 (report_versions)
5. Apply migration 013 (cascading deletes - modified to remove weekly_logs)
6. Apply migration 017 (profile trigger)

**Phase 3 - Add Missing Features:**
7. Apply migration 015 (analytics and feedback)
8. Apply migration 016 (report quality)
9. Apply migration 20240620_beta_onboarding_pipeline (if needed)

**Phase 4 - Cleanup:**
10. Review and apply migration 014 if safe after creating report_metadata

### Rollback Strategy

**Before Each Migration:**
1. Create database backup
2. Test migration on staging environment
3. Verify migration doesn't break existing queries

**Rollback Plan:**
- For table creation: DROP TABLE if migration fails
- For column addition: ALTER TABLE DROP COLUMN if migration fails
- For function changes: Restore previous function definition
- For RLS changes: Restore previous policies

### Risk Assessment

**CRITICAL RISK:**
- Applying migration 014 will drop columns that exist in production
- Applying 20240615 dated migrations will recreate tables with wrong schema
- Code currently references non-existent tables and columns

**HIGH RISK:**
- weekly_logs and report_metadata tables are missing but heavily used in code
- TypeScript types don't match production schema
- Paystack integration may not work without 010

**MEDIUM RISK:**
- Analytics and feedback features won't work without 015
- PDF export metadata incomplete without 012
- Cascading deletes incomplete without 013

**LOW RISK:**
- Profile trigger improvement (017)
- Report quality tracking (016)
- Beta onboarding (20240620)

---

## CONCLUSION

**Production Database State:** Migrations 001-011 only

**Critical Issues:**
1. weekly_logs table missing - logbook week management completely broken
2. report_metadata table missing - report metadata display completely broken
3. TypeScript types don't match production schema
4. Code references non-existent columns and tables

**Recommended Actions:**
1. Create weekly_logs and report_metadata tables immediately
2. Update TypeScript types to match production
3. Apply migrations 012, 015, 016, 017 in safe order
4. Fix migration 013 to remove weekly_logs reference
5. Do NOT apply migration 014 or dated 20240615 migrations

**Success Criteria:**
- All tables code expects exist in production
- TypeScript types match production schema
- No code references non-existent columns
- All migrations applied safely with rollback plan
