# TRIGGER FORENSICS REPORT
**Date:** 2025-01-XX
**Based on:** All CREATE FUNCTION and CREATE TRIGGER statements in migrations
**Purpose:** Analyze all database functions and triggers for correctness and versioning

---

## EXECUTIVE SUMMARY

**Total Functions:** 15
**Total Triggers:** 18
**Broken Functions:** 1 (handle_new_user in 20240615_create_profiles.sql)
**Fixed Functions:** 1 (handle_new_user in 017_fix_profile_trigger.sql)
**Function Version Conflicts:** 3 (update_updated_at_column, handle_new_user)
**Missing in Production:** 6 functions, 6 triggers

**Overall Assessment:** CRITICAL. Production is missing 6 functions and 6 triggers that the code expects. The handle_new_user function had a critical bug that was fixed in migration 017.

---

## FUNCTION INVENTORY

### Functions in Production (001-011)

#### 1. is_admin()
- **Source:** 006_functions_and_triggers.sql:7-19
- **Purpose:** Check if current user is admin
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** boolean
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** profiles table
- **RLS Dependency:** Used by RLS policies
- **Risk:** LOW

#### 2. update_updated_at_column()
- **Source:** 006_functions_and_triggers.sql:24-32
- **Purpose:** Automatically update updated_at timestamps
- **Security:** Default
- **Returns:** trigger
- **Production Status:** EXISTS (Version 1)
- **Latest Version:** Version 3 (20240615_create_institutions_hierarchy.sql:63-69)
- **Version Differences:**
  - Production: `new.updated_at = now()`
  - Latest: `new.updated_at = TIMEZONE('utc'::text, NOW())`
- **Impact:** Minor - timestamp format difference
- **Risk:** LOW
- **Recommendation:** Apply latest version for UTC consistency

#### 3. handle_new_user()
- **Source:** 006_functions_and_triggers.sql:38-76
- **Purpose:** Automatically create profile after signup
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** trigger
- **Production Status:** EXISTS (Version 1)
- **Latest Version:** Version 3 (017_fix_profile_trigger.sql:13-49)
- **Version History:**
  - Version 1 (006): Inserts id, full_name, avatar_url, role, created_at, updated_at - CORRECT
  - Version 2 (20240615_create_profiles): BROKEN - inserts non-existent columns
  - Version 3 (017): Fixed to match production schema
- **Columns Inserted (Production):** id, full_name, avatar_url, role, created_at, updated_at
- **Columns Inserted (Broken Version 2):** id, full_name, institution_id, faculty_id, department_id, program, academic_session, training_organization_id
- **Impact:** Version 2 would fail signup, Version 3 fixes it
- **Risk:** HIGH if Version 2 applied
- **Recommendation:** Apply migration 017_fix_profile_trigger.sql

#### 4. calculate_report_progress()
- **Source:** 006_functions_and_triggers.sql:83-119
- **Purpose:** Calculate report completion percentage
- **Security:** Default
- **Returns:** integer
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Logic:** Completed Sections / Total Sections × 100
- **Dependencies:** report_sections table
- **Risk:** LOW

#### 5. refresh_report_progress()
- **Source:** 006_functions_and_triggers.sql:124-147
- **Purpose:** Update reports.progress automatically
- **Security:** Default
- **Returns:** trigger
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** calculate_report_progress(), reports table
- **Risk:** LOW

#### 6. has_report_access()
- **Source:** 010_paystack_integration.sql:99-112
- **Purpose:** Check if user has access to report
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** boolean
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** report_access table
- **Risk:** LOW

#### 7. is_report_unlocked()
- **Source:** 010_paystack_integration.sql:116-128
- **Purpose:** Check if payment unlocked report
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** boolean
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** report_access, payments tables
- **Risk:** LOW

#### 8. build_report_context()
- **Source:** 011_report_generation_engine.sql:114-232
- **Purpose:** Build report context for AI generation
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** jsonb
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** reports, profiles, institutions, training_organizations, organization_knowledge, report_logbook_entries, logbook_entries, report_sections tables
- **Risk:** LOW

#### 9. initialize_report_sections()
- **Source:** 011_report_generation_engine.sql:236-265
- **Purpose:** Initialize default sections for new report
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** void
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** report_sections table
- **Risk:** LOW

#### 10. create_generation_job()
- **Source:** 011_report_generation_engine.sql:269-302
- **Purpose:** Create report generation job
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** uuid
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** report_generation_jobs table
- **Risk:** LOW

#### 11. update_generation_job_status()
- **Source:** 011_report_generation_engine.sql:306-328
- **Purpose:** Update generation job status
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** void
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** report_generation_jobs table
- **Risk:** LOW

#### 12. get_generation_analytics()
- **Source:** 011_report_generation_engine.sql:332-363
- **Purpose:** Get generation analytics
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** jsonb
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Dependencies:** report_generation_jobs table
- **Risk:** LOW

### Functions Missing in Production

#### 13. ensure_single_active_report()
- **Source:** 20240615_add_is_active_to_reports.sql:18-28
- **Purpose:** Ensure only one active report per user
- **Security:** Default
- **Returns:** trigger
- **Production Status:** MISSING
- **Latest Version:** EXISTS
- **Dependencies:** reports table, reports.is_active column
- **Impact:** No enforcement of single active report
- **Risk:** MEDIUM
- **Migration:** 20240615_add_is_active_to_reports.sql

#### 14. update_beta_onboarding_step()
- **Source:** 20240620_beta_onboarding_pipeline.sql:24-55
- **Purpose:** Automatically update onboarding step based on milestones
- **Security:** Default
- **Returns:** trigger
- **Production Status:** MISSING
- **Latest Version:** EXISTS
- **Dependencies:** beta_users table
- **Impact:** Onboarding funnel tracking fails
- **Risk:** HIGH
- **Migration:** 20240620_beta_onboarding_pipeline.sql

#### 15. track_onboarding_event()
- **Source:** 20240620_beta_onboarding_pipeline.sql:65-110
- **Purpose:** Track onboarding events and update timestamps
- **Security:** SECURITY DEFINER
- **Returns:** void
- **Production Status:** MISSING
- **Latest Version:** EXISTS
- **Dependencies:** beta_users table
- **Impact:** Onboarding event tracking fails
- **Risk:** HIGH
- **Migration:** 20240620_beta_onboarding_pipeline.sql

#### 16. calculate_feedback_priority()
- **Source:** 016_report_quality_and_feedback_enhancements.sql (implied from trigger)
- **Purpose:** Calculate feedback priority score
- **Security:** Default
- **Returns:** trigger
- **Production Status:** MISSING
- **Latest Version:** EXISTS
- **Dependencies:** feedback table
- **Impact:** Feedback prioritization fails
- **Risk:** MEDIUM
- **Migration:** 016_report_quality_and_feedback_enhancements.sql

---

## TRIGGER INVENTORY

### Triggers in Production (001-011)

#### 1. profiles_updated_at
- **Source:** 006_functions_and_triggers.sql:152-156
- **Table:** profiles
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

#### 2. training_organizations_updated_at
- **Source:** 006_functions_and_triggers.sql:158-162
- **Table:** training_organizations
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** EXISTS
- **Latest Version:** CONFLICT - 20240615 recreates
- **Risk:** LOW

#### 3. organization_knowledge_updated_at
- **Source:** 006_functions_and_triggers.sql:164-168
- **Table:** organization_knowledge
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

#### 4. logbooks_updated_at
- **Source:** 006_functions_and_triggers.sql:170-174
- **Table:** logbooks
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

#### 5. logbook_entries_updated_at
- **Source:** 006_functions_and_triggers.sql:176-180
- **Table:** logbook_entries
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

#### 6. reports_updated_at
- **Source:** 006_functions_and_triggers.sql:182-186
- **Table:** reports
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

#### 7. report_sections_updated_at
- **Source:** 006_functions_and_triggers.sql:188-192
- **Table:** report_sections
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

#### 8. on_auth_user_created
- **Source:** 006_functions_and_triggers.sql:199-203
- **Table:** auth.users
- **Timing:** AFTER INSERT
- **Function:** handle_new_user()
- **Production Status:** EXISTS (Version 1)
- **Latest Version:** Version 3 (017_fix_profile_trigger.sql:52-55)
- **Version History:**
  - Version 1 (006): Uses correct handle_new_user function
  - Version 2 (20240615): Uses broken handle_new_user function
  - Version 3 (017): Uses fixed handle_new_user function
- **Impact:** Version 2 would break signup, Version 3 fixes it
- **Risk:** HIGH if Version 2 applied
- **Recommendation:** Apply migration 017_fix_profile_trigger.sql

#### 9. report_progress_after_insert
- **Source:** 006_functions_and_triggers.sql:208-212
- **Table:** report_sections
- **Timing:** AFTER INSERT
- **Function:** refresh_report_progress()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

#### 10. report_progress_after_update
- **Source:** 006_functions_and_triggers.sql:214-218
- **Table:** report_sections
- **Timing:** AFTER UPDATE
- **Function:** refresh_report_progress()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

#### 11. report_progress_after_delete
- **Source:** 006_functions_and_triggers.sql:220-224
- **Table:** report_sections
- **Timing:** AFTER DELETE
- **Function:** refresh_report_progress()
- **Production Status:** EXISTS
- **Latest Version:** UNCHANGED
- **Risk:** LOW

### Triggers Missing in Production

#### 12. single_active_report_trigger
- **Source:** 20240615_add_is_active_to_reports.sql:32-34
- **Table:** reports
- **Timing:** BEFORE INSERT OR UPDATE
- **Function:** ensure_single_active_report()
- **Production Status:** MISSING
- **Latest Version:** EXISTS
- **Impact:** No enforcement of single active report per user
- **Risk:** MEDIUM
- **Migration:** 20240615_add_is_active_to_reports.sql

#### 13. feedback_updated_at
- **Source:** 015_analytics_and_feedback_infrastructure.sql:166-169
- **Table:** feedback
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** MISSING (table also missing)
- **Latest Version:** EXISTS
- **Impact:** N/A - table doesn't exist
- **Risk:** N/A
- **Migration:** 015_analytics_and_feedback_infrastructure.sql

#### 14. beta_users_updated_at
- **Source:** 015_analytics_and_feedback_infrastructure.sql:171-174
- **Table:** beta_users
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** MISSING (table also missing)
- **Latest Version:** EXISTS
- **Impact:** N/A - table doesn't exist
- **Risk:** N/A
- **Migration:** 015_analytics_and_feedback_infrastructure.sql

#### 15. feedback_priority_calculation
- **Source:** 016_report_quality_and_feedback_enhancements.sql:85-88
- **Table:** feedback
- **Timing:** BEFORE INSERT OR UPDATE
- **Function:** calculate_feedback_priority()
- **Production Status:** MISSING (table also missing)
- **Latest Version:** EXISTS
- **Impact:** N/A - table doesn't exist
- **Risk:** N/A
- **Migration:** 016_report_quality_and_feedback_enhancements.sql

#### 16. beta_users_onboarding_step_trigger
- **Source:** 20240620_beta_onboarding_pipeline.sql:59-62
- **Table:** beta_users
- **Timing:** BEFORE INSERT OR UPDATE
- **Function:** update_beta_onboarding_step()
- **Production Status:** MISSING (table also missing)
- **Latest Version:** EXISTS
- **Impact:** N/A - table doesn't exist
- **Risk:** N/A
- **Migration:** 20240620_beta_onboarding_pipeline.sql

### Conflicting Triggers (Recreated in Later Migrations)

#### 17. update_institutions_updated_at
- **Source:** 20240615_create_institutions_hierarchy.sql:71-72
- **Table:** institutions
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** MISSING (trigger doesn't exist in production)
- **Latest Version:** EXISTS
- **Conflict:** Migration attempts to recreate trigger on existing table
- **Impact:** Would fail if applied to production
- **Risk:** HIGH
- **Migration:** 20240615_create_institutions_hierarchy.sql (CONFLICTING)

#### 18. update_faculties_updated_at
- **Source:** 20240615_create_institutions_hierarchy.sql:74-75
- **Table:** faculties
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** MISSING (trigger doesn't exist in production)
- **Latest Version:** EXISTS
- **Conflict:** Migration attempts to recreate trigger on existing table
- **Impact:** Would fail if applied to production
- **Risk:** HIGH
- **Migration:** 20240615_create_institutions_hierarchy.sql (CONFLICTING)

#### 19. update_departments_updated_at
- **Source:** 20240615_create_institutions_hierarchy.sql:77-78
- **Table:** departments
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** MISSING (trigger doesn't exist in production)
- **Latest Version:** EXISTS
- **Conflict:** Migration attempts to recreate trigger on existing table
- **Impact:** Would fail if applied to production
- **Risk:** HIGH
- **Migration:** 20240615_create_institutions_hierarchy.sql (CONFLICTING)

#### 20. update_training_organizations_updated_at
- **Source:** 20240615_create_training_organizations.sql:46-47
- **Table:** training_organizations
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** CONFLICT - Already exists in production
- **Latest Version:** EXISTS
- **Conflict:** Migration attempts to recreate existing trigger
- **Impact:** Would fail if applied to production
- **Risk:** HIGH
- **Migration:** 20240615_create_training_organizations.sql (CONFLICTING)

#### 21. update_organization_departments_updated_at
- **Source:** 20240615_create_training_organizations.sql:49-50
- **Table:** organization_departments
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** MISSING (trigger doesn't exist in production)
- **Latest Version:** EXISTS
- **Conflict:** Migration attempts to recreate trigger on existing table
- **Impact:** Would fail if applied to production
- **Risk:** HIGH
- **Migration:** 20240615_create_training_organizations.sql (CONFLICTING)

#### 22. update_profiles_updated_at
- **Source:** 20240615_create_profiles.sql:53-54
- **Table:** profiles
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()
- **Production Status:** CONFLICT - Already exists in production
- **Latest Version:** EXISTS
- **Conflict:** Migration attempts to recreate existing trigger
- **Impact:** Would fail if applied to production
- **Risk:** HIGH
- **Migration:** 20240615_create_profiles.sql (CONFLICTING)

---

## CRITICAL ISSUE: handle_new_user() Function Version History

### Version 1 (Production - 006_functions_and_triggers.sql:38-76)
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
- **Status:** CORRECT
- **Columns:** id, full_name, avatar_url, role, created_at, updated_at
- **Matches Production Schema:** YES
- **Risk:** LOW

### Version 2 (Broken - 20240615_create_profiles.sql:58-109)
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
        institution_id,
        faculty_id,
        department_id,
        program,
        academic_session,
        training_organization_id,
        training_department_id,
        created_at,
        updated_at
    )
    values (
        new.id,
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        (new.raw_user_meta_data->>'institution_id')::uuid,
        (new.raw_user_meta_data->>'faculty_id')::uuid,
        (new.raw_user_meta_data->>'department_id')::uuid,
        new.raw_user_meta_data->>'program',
        new.raw_user_meta_data->>'academic_session',
        (new.raw_user_meta_data->>'training_organization_id')::uuid,
        (new.raw_user_meta_data->>'training_department_id')::uuid,
        now(),
        now()
    )
    on conflict (id) do nothing;
    return new;
end;
$$;
```
- **Status:** BROKEN
- **Columns:** id, full_name, institution_id, faculty_id, department_id, program, academic_session, training_organization_id, training_department_id, created_at, updated_at
- **Matches Production Schema:** NO - columns don't exist in production
- **Error:** `column "institution_id" of relation "profiles" does not exist`
- **Impact:** User signup would fail
- **Risk:** CRITICAL

### Version 3 (Fixed - 017_fix_profile_trigger.sql:13-49)
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
exception
    when others then
        raise warning 'Failed to create profile for user %: %', new.id, sqlerrm;
        return new;
end;
$$;
```
- **Status:** CORRECT
- **Columns:** id, full_name, avatar_url, role, created_at, updated_at
- **Matches Production Schema:** YES
- **Improvement:** Added exception handling to prevent signup failure
- **Risk:** LOW

---

## FUNCTION SECURITY ANALYSIS

### SECURITY DEFINER Functions (Production)
1. **is_admin()** - SECURITY DEFINER, search_path = public
   - Purpose: RLS policy check
   - Risk: LOW - properly scoped

2. **handle_new_user()** - SECURITY DEFINER, search_path = public
   - Purpose: Auto-create profile on signup
   - Risk: LOW - properly scoped, bypasses RLS for insert

3. **has_report_access()** - SECURITY DEFINER, search_path = public
   - Purpose: Check report access
   - Risk: LOW - properly scoped

4. **is_report_unlocked()** - SECURITY DEFINER, search_path = public
   - Purpose: Check payment unlock status
   - Risk: LOW - properly scoped

5. **build_report_context()** - SECURITY DEFINER, search_path = public
   - Purpose: Build AI generation context
   - Risk: LOW - properly scoped

6. **initialize_report_sections()** - SECURITY DEFINER, search_path = public
   - Purpose: Initialize report sections
   - Risk: LOW - properly scoped

7. **create_generation_job()** - SECURITY DEFINER, search_path = public
   - Purpose: Create AI generation job
   - Risk: LOW - properly scoped

8. **update_generation_job_status()** - SECURITY DEFINER, search_path = public
   - Purpose: Update AI generation job status
   - Risk: LOW - properly scoped

9. **get_generation_analytics()** - SECURITY DEFINER, search_path = public
   - Purpose: Get generation analytics
   - Risk: LOW - properly scoped

10. **track_onboarding_event()** - SECURITY DEFINER (missing in production)
    - Purpose: Track onboarding events
    - Risk: LOW - properly scoped

### Security Assessment
All SECURITY DEFINER functions properly set `search_path = public`, which prevents SQL injection attacks. No security vulnerabilities detected.

---

## TRIGGER PERFORMANCE ANALYSIS

### High-Frequency Triggers
1. **report_progress_after_insert/after_update/after_delete**
   - Table: report_sections
   - Frequency: HIGH - triggered on every section change
   - Function: refresh_report_progress()
   - Performance Impact: MEDIUM - calculates progress on every change
   - Optimization Opportunity: Consider debouncing or batch updates

2. **updated_at triggers** (7 triggers)
   - Tables: profiles, training_organizations, organization_knowledge, logbooks, logbook_entries, reports, report_sections
   - Frequency: HIGH - triggered on every update
   - Function: update_updated_at_column()
   - Performance Impact: LOW - simple timestamp update

### Low-Frequency Triggers
1. **on_auth_user_created**
   - Table: auth.users
   - Frequency: LOW - triggered only on signup
   - Function: handle_new_user()
   - Performance Impact: LOW

---

## DEPENDENCY CHAIN

### Function Dependencies
```
is_admin()
  └─ profiles table

update_updated_at_column()
  └─ No dependencies

handle_new_user()
  └─ profiles table

calculate_report_progress()
  └─ report_sections table

refresh_report_progress()
  └─ calculate_report_progress()
  └─ reports table

has_report_access()
  └─ report_access table

is_report_unlocked()
  └─ report_access table
  └─ payments table

build_report_context()
  ├─ reports table
  ├─ profiles table
  ├─ institutions table
  ├─ training_organizations table
  ├─ organization_knowledge table
  ├─ report_logbook_entries table
  ├─ logbook_entries table
  └─ report_sections table

initialize_report_sections()
  └─ report_sections table

create_generation_job()
  └─ report_generation_jobs table

update_generation_job_status()
  └─ report_generation_jobs table

get_generation_analytics()
  └─ report_generation_jobs table

ensure_single_active_report()
  └─ reports table

update_beta_onboarding_step()
  └─ beta_users table

track_onboarding_event()
  └─ beta_users table

calculate_feedback_priority()
  └─ feedback table
```

### Trigger Dependencies
```
on_auth_user_created
  └─ handle_new_user()

profiles_updated_at
  └─ update_updated_at_column()

training_organizations_updated_at
  └─ update_updated_at_column()

organization_knowledge_updated_at
  └─ update_updated_at_column()

logbooks_updated_at
  └─ update_updated_at_column()

logbook_entries_updated_at
  └─ update_updated_at_column()

reports_updated_at
  └─ update_updated_at_column()

report_sections_updated_at
  └─ update_updated_at_column()

report_progress_after_insert
  └─ refresh_report_progress()
  └─ calculate_report_progress()

report_progress_after_update
  └─ refresh_report_progress()
  └─ calculate_report_progress()

report_progress_after_delete
  └─ refresh_report_progress()
  └─ calculate_report_progress()

single_active_report_trigger
  └─ ensure_single_active_report()

feedback_updated_at
  └─ update_updated_at_column()

beta_users_updated_at
  └─ update_updated_at_column()

feedback_priority_calculation
  └─ calculate_feedback_priority()

beta_users_onboarding_step_trigger
  └─ update_beta_onboarding_step()
```

---

## END OF TRIGGER FORENSICS REPORT
