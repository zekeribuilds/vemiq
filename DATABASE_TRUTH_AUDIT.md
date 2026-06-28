# DATABASE TRUTH AUDIT
**Date:** 2025-01-28
**Scope:** Production (migrations 001-011) vs Codebase vs All Migrations
**Method:** Evidence-based analysis, no assumptions

---

## 1. MIGRATIONS IN CHRONOLOGICAL ORDER

| # | Migration File | Status | Creates | Alters | Drops | Dependencies |
|---|----------------|--------|---------|-------|-------|--------------|
| 1 | 001_extensions.sql | PRODUCTION | pgcrypto extension | - | - | - |
| 2 | 002_enums.sql | PRODUCTION | 8 enum types | - | - | - |
| 3 | 003_core_tables.sql | PRODUCTION | 18 tables | - | - | - |
| 4 | 004_relationship_constraints.sql | PRODUCTION | - | - | - | 003 |
| 5 | 005_indexes.sql | PRODUCTION | - | - | - | 003 |
| 6 | 006_functions_and_triggers.sql | PRODUCTION | 5 functions, 11 triggers | - | - | 003 |
| 7 | 007_rls.sql | PRODUCTION | - | - | - | 003 |
| 8 | 008_storage_buckets.sql | PRODUCTION | 1 table, 4 storage buckets | - | - | 003 |
| 9 | 009_storage_policies.sql | PRODUCTION | - | - | - | 008 |
| 10 | 010_paystack_integration.sql | PRODUCTION | 1 table, 2 functions | - | - | 003 |
| 11 | 011_report_generation_engine.sql | PRODUCTION | 1 table, 5 functions | - | - | 003, 010 |
| 12 | 012_fix_report_versions_schema.sql | NOT PRODUCTION | - | report_versions | - | 003 |
| 13 | 013_add_cascading_deletes.sql | NOT PRODUCTION | - | uploads, weekly_logs | - | 003, weekly_logs (missing) |
| 14 | 014_clean_profile_schema.sql | NOT PRODUCTION | - | profiles, report_metadata | profiles columns | 003, report_metadata (missing) |
| 15 | 015_analytics_and_feedback_infrastructure.sql | NOT PRODUCTION | 3 tables | - | - | - |
| 16 | 016_report_quality_and_feedback_enhancements.sql | NOT PRODUCTION | 1 table, 1 function, 1 trigger | feedback | - | 003, 015 |
| 17 | 017_fix_profile_trigger.sql | NOT PRODUCTION | - | - | trigger, function | 003 |
| 18 | 20240615_add_is_active_to_reports.sql | NOT PRODUCTION | 1 function, 1 trigger | reports | - | 003 |
| 19 | 20240615_create_activity_events.sql | NOT PRODUCTION | 1 table, 1 function | - | - | 003 |
| 20 | 20240615_create_institutions_hierarchy.sql | NOT PRODUCTION | 3 tables, 1 function, 3 triggers | - | - | - |
| 21 | 20240615_create_profiles.sql | NOT PRODUCTION | 1 table, 1 function, 1 trigger | - | - | 20 |
| 22 | 20240615_create_training_organizations.sql | NOT PRODUCTION | 2 tables, 2 triggers | - | - | - |
| 23 | 20240615_create_uploads.sql | NOT PRODUCTION | 1 table | - | - | 003 |
| 24 | 20240620_beta_onboarding_pipeline.sql | NOT PRODUCTION | 2 functions, 1 trigger | beta_users | - | 015 |

**Production State:** Migrations 001-011 executed
**Total Migrations:** 24
**Executed in Production:** 11
**Pending:** 13

---

## 2. MIGRATION SAFETY TABLE

| Migration | Creates | Alters | Drops | Depends On | Safe For Production | Reason |
|------------|----------|---------|-------|------------|---------------------|--------|
| 012_fix_report_versions_schema.sql | - | report_versions | - | 003 | SAFE | Adds columns with IF NOT EXISTS |
| 013_add_cascading_deletes.sql | - | uploads, weekly_logs | - | 003, weekly_logs | UNSAFE | References weekly_logs which doesn't exist in production |
| 014_clean_profile_schema.sql | - | profiles, report_metadata | profiles columns | 003, report_metadata | UNSAFE | References report_metadata which doesn't exist in production; DROPS columns |
| 015_analytics_and_feedback_infrastructure.sql | analytics_events, feedback, beta_users | - | - | - | SAFE | Creates new tables with IF NOT EXISTS |
| 016_report_quality_and_feedback_enhancements.sql | report_quality | feedback | - | 003, 015 | SAFE | Adds columns with IF NOT EXISTS, creates new table |
| 017_fix_profile_trigger.sql | - | - | trigger, function | 003 | SAFE | Replaces broken trigger/function, matches production schema |
| 20240615_add_is_active_to_reports.sql | 1 function, 1 trigger | reports | - | 003 | SAFE | Adds column with IF NOT EXISTS |
| 20240615_create_activity_events.sql | activity_events | - | - | 003 | SAFE | Creates new table with IF NOT EXISTS |
| 20240615_create_institutions_hierarchy.sql | institutions, faculties, departments | - | - | - | UNSAFE | Recreates existing tables from 003, will cause conflict |
| 20240615_create_profiles.sql | profiles | - | - | 20 | UNSAFE | Recreates existing table from 003, will cause conflict |
| 20240615_create_training_organizations.sql | training_organizations, organization_departments | - | - | - | UNSAFE | Recreates existing tables from 003, will cause conflict |
| 20240615_create_uploads.sql | uploads | - | - | 003 | UNSAFE | Recreates existing table from 003, will cause conflict |
| 20240620_beta_onboarding_pipeline.sql | 2 functions, 1 trigger | beta_users | - | 015 | SAFE | Adds columns with IF NOT EXISTS |

**Safe for Production:** 7 migrations
**Unsafe for Production:** 6 migrations

---

## 3. PRODUCTION VS CODEBASE MISMATCHES

### Missing Tables (Production → Codebase)

| Table | Referenced By | File | Line | Runtime Impact | Severity |
|-------|---------------|------|------|----------------|----------|
| weekly_logs | dashboard/logbook/page.tsx | src/app/dashboard/logbook/page.tsx | 59 | Logbook page fails to load | CRITICAL |
| analytics_events | lib/user-behavior.ts, admin/page.tsx | src/lib/user-behavior.ts | 26, 82, 115 | Analytics tracking fails | HIGH |
| beta_users | admin/page.tsx, lib/beta-access.ts | src/app/admin/page.tsx | 56 | Admin dashboard fails | CRITICAL |
| feedback | admin/page.tsx | src/app/admin/page.tsx | 79, 80, 152 | Admin dashboard fails | CRITICAL |
| report_quality | lib/report-quality.ts | src/lib/report-quality.ts | 35, 66 | Report quality tracking fails | HIGH |
| activity_events | dashboard/page.tsx | src/app/dashboard/page.tsx | 109 | Dashboard activity feed fails | CRITICAL |

### Missing Columns (Production → Codebase)

| Table | Column | Referenced By | File | Line | Runtime Impact | Severity |
|-------|--------|---------------|------|------|----------------|----------|
| profiles | current_level | dashboard/page.tsx, dashboard/profile/page.tsx, onboarding/page.tsx | src/app/dashboard/page.tsx | 74 | Dashboard fails to load | CRITICAL |
| reports | is_active | dashboard/page.tsx | src/app/dashboard/page.tsx | 90 | Dashboard fails to load | CRITICAL |

### Missing Functions (Production → Codebase)

| Function | Referenced By | File | Line | Runtime Impact | Severity |
|----------|---------------|------|------|----------------|----------|
| track_onboarding_event | lib/beta-access.ts, onboarding/page.tsx | src/lib/beta-access.ts | 206 | Onboarding tracking fails | CRITICAL |

---

## 4. ROOT CAUSE ANALYSIS: SIGNUP FAILURE

### Evidence Chain

1. **User signs up** → `src/app/signup/page.tsx` calls `supabase.auth.signUp()`
2. **Auth creates user** → Triggers `on_auth_user_created` trigger (migration 006)
3. **Trigger calls handle_new_user()** → Function defined in `006_functions_and_triggers.sql` line 38
4. **Function inserts into profiles** → Columns: id, full_name, avatar_url, role, created_at, updated_at
5. **Profile created successfully** → User redirected to `/onboarding`
6. **Onboarding page loads** → `src/app/onboarding/page.tsx` line 41-45 queries profiles
7. **Onboarding attempts update** → `src/app/onboarding/page.tsx` line 99-110 updates profiles with `current_level`
8. **UPDATE FAILS** → Column `current_level` does not exist in production profiles table

### Single Root Cause

**Column `profiles.current_level` does not exist in production.**

**Evidence:**
- Production schema (migration 003): profiles table has 13 columns, NO `current_level`
- Code expects: `src/app/onboarding/page.tsx` line 107 attempts to update `current_level`
- Error: `column "current_level" of relation "profiles" does not exist`

**Impact:** User can sign up and profile is created, but onboarding fails when attempting to complete profile. User cannot reach dashboard.

---

## 5. handle_new_user() VERIFICATION

### Production Version (Migration 006)

**File:** `supabase/migrations/006_functions_and_triggers.sql`
**Lines:** 38-56

```sql
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
```

**Columns Referenced:** id, full_name, avatar_url, role, created_at, updated_at

**Verification:** ALL columns exist in production profiles table (migration 003 lines 75-94)

**Result:** ✅ SAFE - handle_new_user() in production does NOT reference non-existent columns

### Conflicting Version (Migration 20240615_create_profiles.sql)

**File:** `supabase/migrations/20240615_create_profiles.sql`
**Lines:** 58-109

**Columns Referenced:** institution_id, faculty_id, department_id, program, academic_session, training_organization_id

**Verification:** These columns DO NOT exist in production profiles table

**Result:** ❌ BROKEN - This migration's handle_new_user() references non-existent columns

**Fix:** Migration 017_fix_profile_trigger.sql corrects this by reverting to production-safe version

---

## 6. SAFE PRODUCTION PATCH SQL

```sql
-- ============================================================================
-- SAFE PRODUCTION PATCH SQL
-- ============================================================================
-- Purpose: Add missing objects to production without data loss
-- Safe to execute: YES
-- Test in staging first
-- ============================================================================

-- SECTION 1: Add missing columns
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS current_level TEXT;
ALTER TABLE public.reports ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT FALSE;

-- SECTION 2: Create missing tables
CREATE TABLE IF NOT EXISTS public.analytics_events (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.beta_users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
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

CREATE TABLE IF NOT EXISTS public.report_quality (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    report_version_id UUID REFERENCES public.report_versions(id) ON DELETE CASCADE,
    edit_level TEXT NOT NULL,
    satisfaction_score INTEGER,
    feedback_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

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

-- SECTION 3: Create missing functions
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
            UPDATE public.beta_users SET account_created_at = NOW() WHERE user_id = p_user_id;
        WHEN 'profile_completed' THEN
            UPDATE public.beta_users SET profile_completed_at = NOW() WHERE user_id = p_user_id;
        WHEN 'first_logbook_created' THEN
            UPDATE public.beta_users SET first_logbook_created_at = NOW() WHERE user_id = p_user_id;
        WHEN 'first_report_created' THEN
            UPDATE public.beta_users SET first_report_created_at = NOW() WHERE user_id = p_user_id;
        WHEN 'first_export' THEN
            UPDATE public.beta_users SET first_export_at = NOW() WHERE user_id = p_user_id;
    END CASE;
END;
$$;

GRANT EXECUTE ON FUNCTION public.track_onboarding_event TO authenticated;

-- SECTION 4: Add indexes (performance)
CREATE INDEX IF NOT EXISTS idx_analytics_events_user ON public.analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_type ON public.analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_category ON public.analytics_events(event_category);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created ON public.analytics_events(created_at);
CREATE INDEX IF NOT EXISTS idx_beta_users_user ON public.beta_users(user_id);
CREATE INDEX IF NOT EXISTS idx_beta_users_status ON public.beta_users(status);
CREATE INDEX IF NOT EXISTS idx_feedback_user ON public.feedback(user_id);
CREATE INDEX IF NOT EXISTS idx_feedback_status ON public.feedback(status);
CREATE INDEX IF NOT EXISTS idx_report_quality_user ON public.report_quality(user_id);
CREATE INDEX IF NOT EXISTS idx_activity_events_user_created_at ON public.activity_events(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_weekly_logs_user ON public.weekly_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_weekly_logs_report ON public.weekly_logs(report_id);

-- SECTION 5: Enable RLS on new tables
ALTER TABLE public.analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.beta_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.report_quality ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.activity_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weekly_logs ENABLE ROW LEVEL SECURITY;

-- SECTION 6: Create RLS policies
CREATE POLICY IF NOT EXISTS "Users can view their own analytics events"
ON public.analytics_events FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own analytics events"
ON public.analytics_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view their own beta status"
ON public.beta_users FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Admins can view all beta users"
ON public.beta_users FOR SELECT USING (
    EXISTS (SELECT 1 FROM public.profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

CREATE POLICY IF NOT EXISTS "Users can view their own feedback"
ON public.feedback FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own feedback"
ON public.feedback FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view their own report quality"
ON public.report_quality FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert their own report quality"
ON public.report_quality FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own activity events"
ON public.activity_events FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own activity events"
ON public.activity_events FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can view own weekly_logs"
ON public.weekly_logs FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY IF NOT EXISTS "Users can insert own weekly_logs"
ON public.weekly_logs FOR INSERT WITH CHECK (auth.uid() = user_id);
```

---

## 7. DANGEROUS SQL - MUST NOT EXECUTE

### Migration 013_add_cascading_deletes.sql
**Reason:** References `weekly_logs` table which doesn't exist in production
**Danger:** Will fail with "relation weekly_logs does not exist"
**Status:** ❌ DO NOT EXECUTE

### Migration 014_clean_profile_schema.sql
**Reason:** 
- References `report_metadata` table which doesn't exist in production
- DROPS columns from profiles (subscription_plan, academic_session, siwes_coordinator_name, supervisor_name)
**Danger:** Will fail with "relation report_metadata does not exist"; potential data loss
**Status:** ❌ DO NOT EXECUTE

### Migration 20240615_create_institutions_hierarchy.sql
**Reason:** Recreates `institutions`, `faculties`, `departments` tables
**Danger:** Will fail with "relation institutions already exists"
**Status:** ❌ DO NOT EXECUTE

### Migration 20240615_create_profiles.sql
**Reason:** Recreates `profiles` table with different schema
**Danger:** Will fail with "relation profiles already exists"; would delete all user data if forced
**Status:** ❌ DO NOT EXECUTE

### Migration 20240615_create_training_organizations.sql
**Reason:** Recreates `training_organizations`, `organization_departments` tables
**Danger:** Will fail with "relation training_organizations already exists"
**Status:** ❌ DO NOT EXECUTE

### Migration 20240615_create_uploads.sql
**Reason:** Recreates `uploads` table with different schema
**Danger:** Will fail with "relation uploads already exists"; would delete all upload data if forced
**Status:** ❌ DO NOT EXECUTE

---

## 8. EXACT MIGRATION ORDER FOR PRODUCTION

To make production match codebase safely, execute in this order:

### Phase 1: Immediate Critical Fixes (Execute First)
1. **Add current_level to profiles** (manual SQL in Section 6)
2. **Add is_active to reports** (manual SQL in Section 6)
3. **Create weekly_logs table** (manual SQL in Section 6)
4. **Create activity_events table** (manual SQL in Section 6)
5. **Create analytics_events table** (manual SQL in Section 6)
6. **Create beta_users table** (manual SQL in Section 6)
7. **Create feedback table** (manual SQL in Section 6)
8. **Create report_quality table** (manual SQL in Section 6)
9. **Create track_onboarding_event function** (manual SQL in Section 6)

### Phase 2: Safe Migrations (Execute After Phase 1)
10. **012_fix_report_versions_schema.sql** - SAFE (adds columns to report_versions)
11. **015_analytics_and_feedback_infrastructure.sql** - SAFE (creates tables, already done manually but can run)
12. **016_report_quality_and_feedback_enhancements.sql** - SAFE (adds columns to feedback, creates report_quality)
13. **017_fix_profile_trigger.sql** - SAFE (fixes handle_new_user to match production schema)
14. **20240615_add_is_active_to_reports.sql** - SAFE (adds is_active, already done manually)
15. **20240615_create_activity_events.sql** - SAFE (creates activity_events, already done manually)
16. **20240620_beta_onboarding_pipeline.sql** - SAFE (adds columns to beta_users)

### Phase 3: NEVER EXECUTE (Skip These)
- ❌ 013_add_cascading_deletes.sql (depends on weekly_logs which was missing)
- ❌ 014_clean_profile_schema.sql (depends on report_metadata which doesn't exist, DROPS columns)
- ❌ 20240615_create_institutions_hierarchy.sql (recreates existing tables)
- ❌ 20240615_create_profiles.sql (recreates existing table)
- ❌ 20240615_create_training_organizations.sql (recreates existing tables)
- ❌ 20240615_create_uploads.sql (recreates existing table)

---

## SUMMARY

**Production State:** Migrations 001-011 executed
**Codebase Expects:** Tables, columns, and functions from migrations 012+
**Root Cause of Signup Failure:** Missing `profiles.current_level` column
**handle_new_user() Status:** ✅ SAFE in production (migration 006 version)
**Safe Migrations:** 7 (012, 015, 016, 017, 20240615_add_is_active, 20240615_activity_events, 20240620_beta)
**Dangerous Migrations:** 6 (013, 014, 20240615_institutions, 20240615_profiles, 20240615_training, 20240615_uploads)

**Recommended Action:** Execute manual SQL patch (Section 6) first, then safe migrations in Phase 2 order. Skip all dangerous migrations in Phase 3.
