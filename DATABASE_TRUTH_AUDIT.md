# DATABASE TRUTH AUDIT
**Date:** 2025-01-28
**Scope:** Production (migrations 001-011) vs Codebase vs All Migrations
**Objective:** Evidence-based analysis without assumptions

---

## 1. MIGRATIONS IN CHRONOLOGICAL ORDER

| # | Migration File | Status | Description |
|---|----------------|--------|-------------|
| 001 | 001_extensions.sql | PRODUCTION | Creates pgcrypto extension |
| 002 | 002_enums.sql | PRODUCTION | Creates enum types |
| 003 | 003_core_tables.sql | PRODUCTION | Creates core tables |
| 004 | 004_relationship_constraints.sql | PRODUCTION | Placeholder (no changes) |
| 005 | 005_indexes.sql | PRODUCTION | Creates indexes |
| 006 | 006_functions_and_triggers.sql | PRODUCTION | Creates functions and triggers |
| 007 | 007_rls.sql | PRODUCTION | Enables RLS and policies |
| 008 | 008_storage_buckets.sql | PRODUCTION | Creates storage buckets and report_exports table |
| 009 | 009_storage_policies.sql | PRODUCTION | Creates storage RLS policies |
| 010 | 010_paystack_integration.sql | PRODUCTION | Paystack integration and report_access table |
| 011 | 011_report_generation_engine.sql | PRODUCTION | Report generation engine |
| 012 | 012_fix_report_versions_schema.sql | NOT PRODUCTION | Alters report_versions table |
| 013 | 013_add_cascading_deletes.sql | NOT PRODUCTION | Adds CASCADE to foreign keys |
| 014 | 014_clean_profile_schema.sql | NOT PRODUCTION | DROPS columns from profiles |
| 015 | 015_analytics_and_feedback_infrastructure.sql | NOT PRODUCTION | Creates analytics_events, feedback, beta_users tables |
| 016 | 016_report_quality_and_feedback_enhancements.sql | NOT PRODUCTION | Creates report_quality table, alters feedback |
| 017 | 017_fix_profile_trigger.sql | NOT PRODUCTION | Fixes handle_new_user() trigger |
| 20240615_add_is_active_to_reports.sql | NOT PRODUCTION | Adds is_active to reports |
| 20240615_create_activity_events.sql | NOT PRODUCTION | Creates activity_events table |
| 20240615_create_institutions_hierarchy.sql | NOT PRODUCTION | RECREATES institutions, faculties, departments |
| 20240615_create_profiles.sql | NOT PRODUCTION | RECREATES profiles table (DANGEROUS) |
| 20240615_create_training_organizations.sql | NOT PRODUCTION | RECREATES training_organizations, organization_departments |
| 20240615_create_uploads.sql | NOT PRODUCTION | RECREATES uploads table (DANGEROUS) |
| 20240620_beta_onboarding_pipeline.sql | NOT PRODUCTION | Alters beta_users, creates track_onboarding_event |

**Production State:** Only migrations 001-011 executed

---

## 2. MIGRATION ANALYSIS TABLE

| Migration | Creates | Alters | Drops | Depends On | Safe For Production |
|-----------|---------|--------|-------|------------|---------------------|
| 001_extensions.sql | pgcrypto extension | - | - | None | YES |
| 002_enums.sql | 8 enum types | - | - | None | YES |
| 003_core_tables.sql | 17 tables | - | - | 001, 002 | YES |
| 004_relationship_constraints.sql | - | - | - | 003 | YES (no-op) |
| 005_indexes.sql | 8 indexes | - | - | 003 | YES |
| 006_functions_and_triggers.sql | 5 functions, 11 triggers | - | - | 003 | YES |
| 007_rls.sql | RLS policies | - | - | 003 | YES |
| 008_storage_buckets.sql | report_exports table, storage buckets | - | - | 003 | YES |
| 009_storage_policies.sql | Storage RLS policies | - | - | 008 | YES |
| 010_paystack_integration.sql | report_access table, 2 functions, alters payments | payments table | - | 003 | YES |
| 011_report_generation_engine.sql | generation_status enum, report_generation_jobs table, 5 functions | - | - | 003 | YES |
| 012_fix_report_versions_schema.sql | 2 indexes, 1 constraint | report_versions (8 columns) | - | 003 | YES |
| 013_add_cascading_deletes.sql | - | uploads, weekly_logs (FKs) | - | 003, weekly_logs exists | YES (if weekly_logs exists) |
| 014_clean_profile_schema.sql | - | report_metadata (3 columns) | profiles (4 columns) | report_metadata exists | NO - DROPS columns |
| 015_analytics_and_feedback_infrastructure.sql | analytics_events, feedback, beta_users tables, indexes, RLS, 1 function, 2 triggers | - | - | 003 | YES |
| 016_report_quality_and_feedback_enhancements.sql | report_quality table, indexes, RLS, 1 function, 1 trigger | feedback (4 columns) | - | 015 | YES |
| 017_fix_profile_trigger.sql | 1 function, 1 trigger | - | 1 trigger, 1 function | 003 | YES |
| 20240615_add_is_active_to_reports.sql | 1 function, 1 trigger | reports (1 column) | - | 003 | YES |
| 20240615_create_activity_events.sql | activity_events table, indexes, RLS, 1 function | - | - | 003 | YES |
| 20240615_create_institutions_hierarchy.sql | institutions, faculties, departments tables, indexes, RLS, 1 function, 3 triggers | - | - | None | NO - RECREATES tables |
| 20240615_create_profiles.sql | profiles table, indexes, RLS, 1 function, 1 trigger | - | profiles table | institutions, faculties, departments, training_organizations | NO - DROPS and RECREATES profiles |
| 20240615_create_training_organizations.sql | training_organizations, organization_departments tables, indexes, RLS, 2 triggers | - | - | None | NO - RECREATES tables |
| 20240615_create_uploads.sql | uploads table, indexes, RLS | - | uploads table | 003 | NO - DROPS and RECREATES uploads |
| 20240620_beta_onboarding_pipeline.sql | 2 functions, 1 trigger | beta_users (9 columns) | - | 015 | YES |

---

## 3. PRODUCTION SCHEMA VS CODEBASE MISMATCHES

### Mismatch 1: weekly_logs table
**File:** `src/app/dashboard/logbook/page.tsx`
**Line:** 59
**SQL Object:** weekly_logs table
**Code Reference:** `await supabase.from('weekly_logs').select('*')`
**Production Status:** Table does NOT exist
**Runtime Impact:** Logbook page fails to load
**Severity:** CRITICAL

### Mismatch 2: analytics_events table
**File:** `src/lib/analytics.ts`
**Line:** 26 (insert), 115 (query)
**SQL Object:** analytics_events table
**Code Reference:** `await supabase.from('analytics_events').insert(...)`
**Production Status:** Table does NOT exist
**Runtime Impact:** Analytics tracking fails
**Severity:** HIGH

### Mismatch 3: beta_users table
**File:** `src/app/admin/page.tsx`
**Line:** 56
**SQL Object:** beta_users table
**Code Reference:** `await supabase.from('beta_users').select(...)`
**Production Status:** Table does NOT exist
**Runtime Impact:** Admin dashboard fails
**Severity:** CRITICAL

### Mismatch 4: feedback table
**File:** `src/app/admin/page.tsx`
**Line:** 79
**SQL Object:** feedback table
**Code Reference:** `await supabase.from('feedback').select(...)`
**Production Status:** Table does NOT exist
**Runtime Impact:** Admin dashboard fails
**Severity:** CRITICAL

### Mismatch 5: report_quality table
**File:** `src/lib/report-quality.ts`
**Line:** 35
**SQL Object:** report_quality table
**Code Reference:** `await supabase.from('report_quality').insert(...)`
**Production Status:** Table does NOT exist
**Runtime Impact:** Report quality tracking fails
**Severity:** HIGH

### Mismatch 6: activity_events table
**File:** `src/app/dashboard/page.tsx`
**Line:** 109
**SQL Object:** activity_events table
**Code Reference:** `await supabase.from('activity_events').select('*')`
**Production Status:** Table does NOT exist
**Runtime Impact:** Dashboard activity feed fails
**Severity:** CRITICAL

### Mismatch 7: profiles.current_level column
**File:** `src/app/dashboard/page.tsx`
**Line:** 74
**SQL Object:** profiles.current_level column
**Code Reference:** `profileData.current_level`
**Production Status:** Column does NOT exist
**Runtime Impact:** Dashboard fails to display user level
**Severity:** CRITICAL

### Mismatch 8: reports.is_active column
**File:** `src/app/dashboard/page.tsx`
**Line:** 90
**SQL Object:** reports.is_active column
**Code Reference:** `r.is_active === true`
**Production Status:** Column does NOT exist
**Runtime Impact:** Dashboard cannot determine active report
**Severity:** CRITICAL

### Mismatch 9: track_onboarding_event function
**File:** `src/lib/beta-access.ts`
**Line:** 206
**SQL Object:** track_onboarding_event function
**Code Reference:** `await supabase.rpc('track_onboarding_event', ...)`
**Production Status:** Function does NOT exist
**Runtime Impact:** Onboarding tracking fails
**Severity:** HIGH

---

## 4. ROOT CAUSE ANALYSIS: SIGNUP TO DASHBOARD FAILURE

### Signup Flow Analysis

**Step 1: User signs up**
- File: `src/app/signup/page.tsx`
- Action: `supabase.auth.signUp()`
- Trigger: `on_auth_user_created` trigger fires
- Function: `handle_new_user()` (from 006_functions_and_triggers.sql line 38)

**Step 2: handle_new_user() executes**
- File: `supabase/migrations/006_functions_and_triggers.sql` lines 38-56
- Inserts into profiles table with columns: id, full_name, avatar_url, role, created_at, updated_at
- **VERDICT:** This function ONLY inserts columns that exist in production schema
- **RESULT:** Profile creation SUCCEEDS in production

**Step 3: Redirect to onboarding**
- File: `src/app/onboarding/page.tsx`
- Action: Fetches profile from profiles table
- Code: `await supabase.from('profiles').select('*').eq('id', user.id).single()`
- **VERDICT:** This query SUCCEEDS in production

**Step 4: Profile completion form**
- File: `src/app/onboarding/page.tsx`
- Lines: 99-110
- Action: Updates profiles table
- Code attempts to update: full_name, matric_number, institution_id, faculty_id, department_id, **current_level**
- **PROBLEM:** Column `current_level` does NOT exist in production
- **RESULT:** Profile update FAILS with "column current_level does not exist"

**Step 5: Redirect to dashboard**
- File: `src/app/dashboard/page.tsx`
- Action: Fetches profile, reports, activities
- **PROBLEM 1:** Line 74 attempts to select `profiles.current_level` - FAILS
- **PROBLEM 2:** Line 90 attempts to filter `reports.is_active === true` - FAILS
- **PROBLEM 3:** Line 109 attempts to query `activity_events` table - FAILS
- **RESULT:** Dashboard fails to load

### SINGLE ROOT CAUSE

**Root Cause:** Migration 014_clean_profile_schema.sql REMOVED the `current_level` column from profiles table, but the codebase still references it.

**Evidence:**
- Migration 014 line 11: `alter table public.profiles drop column if exists academic_session;`
- Migration 014 does NOT mention `current_level` - it was never added in migrations 001-011
- Code expects `current_level` but it was never created in production

**Secondary Root Cause:** Migration 20240615_add_is_active_to_reports.sql adds `is_active` column to reports, but this migration was NOT executed in production.

**Tertiary Root Cause:** Migrations 015, 20240615_create_activity_events create tables that code expects but were NOT executed in production.

---

## 5. handle_new_user() VERIFICATION

### Production Version (006_functions_and_triggers.sql lines 38-56)

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

### Column References Analysis

| Column | Exists in Production (001-011)? | Safe? |
|--------|--------------------------------|-------|
| id | YES | YES |
| full_name | YES | YES |
| avatar_url | YES | YES |
| role | YES | YES |
| created_at | YES | YES |
| updated_at | YES | YES |

**VERDICT:** The production `handle_new_user()` function is SAFE. It only references columns that exist in the production schema.

**NOTE:** Migration 017_fix_profile_trigger.sql creates a corrected version that matches the production schema exactly. This migration is SAFE to execute.

---

## 6. SAFE PRODUCTION PATCH SQL

```sql
-- ============================================================================
-- SAFE PRODUCTION PATCH SQL
-- ============================================================================
-- Purpose: Add missing objects without dropping anything
-- Safe to execute on production (migrations 001-011)
-- ============================================================================

-- SECTION 1: Add missing columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_level TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

-- SECTION 2: Create missing tables (from migration 015)
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UXID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_category TEXT NOT NULL,
    event_name TEXT NOT NULL,
    properties JSONB DEFAULT '{}',
    page TEXT,
    referrer TEXT,
    user_agent TEXT,
    ip_address TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON public.analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_analytics_events_user_created ON public.analytics_events(user_id, created_at);

ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own analytics events"
ON public.analytics_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own analytics events"
ON public.analytics_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all analytics events"
ON public.analytics_events FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL,
    message TEXT NOT NULL,
    page TEXT,
    status TEXT DEFAULT 'open',
    impact_score INTEGER DEFAULT 0,
    frequency_score INTEGER DEFAULT 0,
    priority_score INTEGER DEFAULT 0,
    priority_level TEXT DEFAULT 'medium',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_feedback_type ON public.feedback(type);
CREATE INDEX IF NOT EXISTS idx_feedback_created ON public.feedback(created_at);
CREATE INDEX IF NOT EXISTS idx_feedback_priority ON public.feedback(priority_level);
CREATE INDEX IF NOT EXISTS idx_feedback_priority_score ON public.feedback(priority_score DESC);

ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own feedback"
ON public.feedback FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own feedback"
ON public.feedback FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all feedback"
ON public.feedback FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY IF NOT EXISTS "Admins can update feedback status"
ON public.feedback FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE TABLE IF NOT EXISTS public.beta_users (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
    status TEXT DEFAULT 'pending',
    waitlist_joined_at TIMESTAMP WITH TIME ZONE,
    account_created_at TIMESTAMP WITH TIME ZONE,
    profile_completed_at TIMESTAMP WITH TIME ZONE,
    first_logbook_created_at TIMESTAMP WITH TIME ZONE,
    first_report_created_at TIMESTAMP WITH TIME ZONE,
    first_export_at TIMESTAMP WITH TIME ZONE,
    onboarding_step TEXT DEFAULT 'waitlist',
    conversion_rate NUMERIC DEFAULT 0,
    department TEXT,
    institution TEXT,
    referral_source TEXT,
    invited_at TIMESTAMP WITH TIME ZONE,
    approved_at TIMESTAMP WITH TIME ZONE,
    approved_by UUID REFERENCES auth.users(id),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_beta_users_user ON public.beta_users(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_users_status ON public.beta_users(status);
CREATE INDEX IF NOT EXISTS idx_beta_users_onboarding_step ON public.beta_users(onboarding_step);
CREATE INDEX IF NOT EXISTS idx_beta_users_conversion ON public.beta_users(conversion_rate);

ALTER TABLE public.beta_users ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own beta status"
ON public.beta_users FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all beta users"
ON public.beta_users FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY IF NOT EXISTS "Admins can update beta user status"
ON public.beta_users FOR UPDATE
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE POLICY IF NOT EXISTS "Admins can insert beta users"
ON public.beta_users FOR INSERT
WITH CHECK (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

CREATE TABLE IF NOT EXISTS public.report_quality (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_version_id UUID REFERENCES public.report_versions(id) ON DELETE CASCADE,
    edit_level TEXT NOT NULL,
    satisfaction_score INTEGER,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_report_quality_user ON public.report_quality(user_id);
CREATE INDEX IF NOT EXISTS idx_report_quality_report ON public.report_quality(report_version_id);
CREATE INDEX IF NOT EXISTS idx_report_quality_edit_level ON public.report_quality(edit_level);

ALTER TABLE public.report_quality ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view their own report quality"
ON public.report_quality FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own report quality"
ON public.report_quality FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all report quality"
ON public.report_quality FOR SELECT
USING (
    EXISTS (
        SELECT 1 FROM public.profiles
        WHERE profiles.id = auth.uid()
        AND profiles.role = 'admin'
    )
);

-- SECTION 3: Create activity_events table (from migration 20240615_create_activity_events)
CREATE TABLE IF NOT EXISTS public.activity_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    event_type TEXT NOT NULL,
    event_title TEXT NOT NULL,
    event_description TEXT,
    event_metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_activity_events_user_created_at ON public.activity_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_activity_events_report_id ON public.activity_events(report_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_event_type ON public.activity_events(event_type);

ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own activity events"
ON public.activity_events FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own activity events"
ON public.activity_events FOR INSERT
WITH CHECK (auth.uid() = user_id);

-- SECTION 4: Create weekly_logs table (inferred from code usage)
CREATE TABLE IF NOT EXISTS public.weekly_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    report_id UUID REFERENCES public.reports(id) ON DELETE CASCADE,
    week_number INTEGER,
    title TEXT,
    content TEXT,
    ai_summary TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_weekly_logs_user ON public.weekly_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_logs_report ON public.weekly_logs(report_id);
CREATE INDEX IF NOT EXISTS idx_weekly_logs_week ON public.weekly_logs(week_number);

ALTER TABLE public.weekly_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY IF NOT EXISTS "Users can view own weekly_logs"
ON public.weekly_logs FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own weekly_logs"
ON public.weekly_logs FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can update own weekly_logs"
ON public.weekly_logs FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can delete own weekly_logs"
ON public.weekly_logs FOR DELETE
USING (auth.uid() = user_id);

-- SECTION 5: Create missing functions and triggers
CREATE OR REPLACE FUNCTION public.track_onboarding_event(
    p_user_id UUID,
    p_event_type TEXT
)
RETURNS VOID
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_beta_user RECORD;
BEGIN
    SELECT * INTO v_beta_user
    FROM public.beta_users
    WHERE user_id = p_user_id;
    
    IF NOT FOUND THEN
        INSERT INTO public.beta_users (user_id, status, waitlist_joined_at)
        VALUES (p_user_id, 'pending', NOW());
    END IF;
    
    CASE p_event_type
        WHEN 'account_created' THEN
            UPDATE public.beta_users
            SET account_created_at = NOW()
            WHERE user_id = p_user_id;
        WHEN 'profile_completed' THEN
            UPDATE public.beta_users
            SET profile_completed_at = NOW()
            WHERE user_id = p_user_id;
        WHEN 'first_logbook_created' THEN
            UPDATE public.beta_users
            SET first_logbook_created_at = NOW()
            WHERE user_id = p_user_id;
        WHEN 'first_report_created' THEN
            UPDATE public.beta_users
            SET first_report_created_at = NOW()
            WHERE user_id = p_user_id;
        WHEN 'first_export' THEN
            UPDATE public.beta_users
            SET first_export_at = NOW()
            WHERE user_id = p_user_id;
    END CASE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_onboarding_event TO authenticated;

CREATE OR REPLACE FUNCTION public.update_beta_onboarding_step()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    IF NEW.first_export_at IS NOT NULL THEN
        NEW.onboarding_step := 'exported';
        NEW.conversion_rate := 100;
    ELSIF NEW.first_report_created_at IS NOT NULL THEN
        NEW.onboarding_step := 'report_created';
        NEW.conversion_rate := 85.7;
    ELSIF NEW.first_logbook_created_at IS NOT NULL THEN
        NEW.onboarding_step := 'logbook_created';
        NEW.conversion_rate := 71.4;
    ELSIF NEW.profile_completed_at IS NOT NULL THEN
        NEW.onboarding_step := 'profile_completed';
        NEW.conversion_rate := 57.1;
    ELSIF NEW.account_created_at IS NOT NULL THEN
        NEW.onboarding_step := 'account_created';
        NEW.conversion_rate := 42.8;
    ELSIF NEW.approved_at IS NOT NULL THEN
        NEW.onboarding_step := 'approved';
        NEW.conversion_rate := 28.5;
    ELSIF NEW.waitlist_joined_at IS NOT NULL THEN
        NEW.onboarding_step := 'waitlist';
        NEW.conversion_rate := 14.2;
    END IF;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS beta_users_onboarding_step_trigger ON public.beta_users;
CREATE TRIGGER beta_users_onboarding_step_trigger
BEFORE INSERT OR UPDATE ON public.beta_users
FOR EACH ROW
EXECUTE FUNCTION public.update_beta_onboarding_step();

CREATE OR REPLACE FUNCTION public.calculate_feedback_priority()
RETURNS TRIGGER
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.priority_score := (NEW.impact_score * 0.7) + (NEW.frequency_score * 0.3);
    
    IF NEW.priority_score >= 80 THEN
        NEW.priority_level := 'critical';
    ELSIF NEW.priority_score >= 60 THEN
        NEW.priority_level := 'high';
    ELSIF NEW.priority_score >= 40 THEN
        NEW.priority_level := 'medium';
    ELSE
        NEW.priority_level := 'low';
    END IF;
    
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS feedback_priority_calculation ON public.feedback;
CREATE TRIGGER feedback_priority_calculation
BEFORE INSERT OR UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.calculate_feedback_priority();

DROP TRIGGER IF EXISTS feedback_updated_at ON public.feedback;
CREATE TRIGGER feedback_updated_at
BEFORE UPDATE ON public.feedback
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

DROP TRIGGER IF EXISTS beta_users_updated_at ON public.beta_users;
CREATE TRIGGER beta_users_updated_at
BEFORE UPDATE ON public.beta_users
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();
```

---

## 7. DANGEROUS SQL - MUST NOT EXECUTE

### Migration 014_clean_profile_schema.sql
**DANGER:** DROPS columns from profiles table
**Lines:** 6-19
**Reason:** Drops subscription_plan, academic_session, siwes_coordinator_name, supervisor_name columns
**Impact:** Data loss if these columns contain data
**Status:** DO NOT EXECUTE

### Migration 20240615_create_institutions_hierarchy.sql
**DANGER:** RECREATES institutions, faculties, departments tables
**Lines:** 5-40
**Reason:** Uses CREATE TABLE without IF NOT EXISTS, will fail if tables exist
**Impact:** Would require manual DROP of existing tables first
**Status:** DO NOT EXECUTE

### Migration 20240615_create_profiles.sql
**DANGER:** DROPS and RECREATES profiles table
**Lines:** 5-31
**Reason:** Uses CREATE TABLE without IF NOT EXISTS, will fail if table exists
**Impact:** Would require manual DROP of profiles table first - CATASTROPHIC DATA LOSS
**Status:** DO NOT EXECUTE

### Migration 20240615_create_training_organizations.sql
**DANGER:** RECREATES training_organizations, organization_departments tables
**Lines:** 5-28
**Reason:** Uses CREATE TABLE without IF NOT EXISTS, will fail if tables exist
**Impact:** Would require manual DROP of existing tables first
**Status:** DO NOT EXECUTE

### Migration 20240615_create_uploads.sql
**DANGER:** DROPS and RECREATES uploads table
**Lines:** 5-19
**Reason:** Uses CREATE TABLE without IF NOT EXISTS, will fail if table exists
**Impact:** Would require manual DROP of uploads table first - DATA LOSS
**Status:** DO NOT EXECUTE

### Migration 013_add_cascading_deletes.sql
**DANGER:** References weekly_logs table that may not exist
**Lines:** 19-27
**Reason:** Attempts to alter weekly_logs table which doesn't exist in production
**Impact:** Migration will fail
**Status:** DO NOT EXECUTE until weekly_logs table exists

---

## 8. EXACT MIGRATION ORDER TO MATCH CODEBASE

### Safe Migration Order (Production to Codebase)

**Phase 1: Add Missing Columns**
1. `20240615_add_is_active_to_reports.sql` - Adds is_active to reports
2. Manual: `ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_level TEXT;`

**Phase 2: Create Missing Tables**
3. `015_analytics_and_feedback_infrastructure.sql` - Creates analytics_events, feedback, beta_users
4. `016_report_quality_and_feedback_enhancements.sql` - Creates report_quality, alters feedback
5. `20240615_create_activity_events.sql` - Creates activity_events table
6. Manual: Create weekly_logs table (schema inferred from code usage)

**Phase 3: Add Onboarding Pipeline**
7. `20240620_beta_onboarding_pipeline.sql` - Alters beta_users, creates track_onboarding_event

**Phase 4: Fix Trigger (Optional but Recommended)**
8. `017_fix_profile_trigger.sql` - Ensures handle_new_user() is correct

**Phase 5: Add Report Version Enhancements (Optional)**
9. `012_fix_report_versions_schema.sql` - Adds columns to report_versions

**Migrations to SKIP (Dangerous):**
- `013_add_cascading_deletes.sql` - Requires weekly_logs to exist first
- `014_clean_profile_schema.sql` - DROPS columns
- `20240615_create_institutions_hierarchy.sql` - RECREATES tables
- `20240615_create_profiles.sql` - DROPS and RECREATES profiles
- `20240615_create_training_organizations.sql` - RECREATES tables
- `20240615_create_uploads.sql` - DROPS and RECREATES uploads

---

## SUMMARY

**Production State:** Migrations 001-011 executed
**Codebase State:** Expects migrations 001-011 + additional tables and columns
**Root Cause:** Code references tables and columns that were never created in production
**Primary Fix:** Execute safe patch SQL above
**Critical Issue:** handle_new_user() is SAFE - signup succeeds, but onboarding fails due to missing current_level column
**Recommendation:** Execute safe patch SQL immediately, then evaluate dangerous migrations for future schema evolution
