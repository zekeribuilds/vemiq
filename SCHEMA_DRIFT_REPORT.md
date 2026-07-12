# SCHEMA DRIFT REPORT
**Date:** 2025-01-XX
**Based on:** Comparison of PRODUCTION_SCHEMA_SNAPSHOT.md vs LATEST_SCHEMA_SNAPSHOT.md
**Purpose:** Identify schema differences between production and latest repository

---

## EXECUTIVE SUMMARY

**Total Missing Tables in Production:** 7
**Total Missing Columns in Production:** 12
**Total Table Conflicts:** 4
**Total Broken Migration Dependencies:** 2

**Overall Assessment:** CRITICAL schema drift. Production is missing 7 tables and 12 columns that the code expects. 4 migrations conflict with existing tables and cannot be applied as-is.

---

## MISSING TABLES IN PRODUCTION

### 1. activity_events
- **Source:** 20240615_create_activity_events.sql:5-16
- **Production Status:** DOES NOT EXIST
- **Latest Repository Status:** EXISTS
- **Impact:** Code expects activity_events table for unified activity tracking
- **Severity:** CRITICAL
- **Columns:** id, user_id, report_id, event_type, event_title, event_description, event_metadata, created_at
- **Foreign Keys:** user_id → auth.users(id), report_id → reports(id)
- **Indexes:** idx_activity_events_user_created_at, idx_activity_events_report_id, idx_activity_events_event_type
- **RLS Policies:** Users can view/insert own activity events

### 2. analytics_events
- **Source:** 015_analytics_and_feedback_infrastructure.sql:6-18
- **Production Status:** DOES NOT EXIST
- **Latest Repository Status:** EXISTS
- **Impact:** Code expects analytics_events table for analytics tracking
- **Severity:** CRITICAL
- **Columns:** id, user_id, event_type, event_category, event_name, properties, page, referrer, user_agent, ip_address, created_at
- **Foreign Keys:** user_id → auth.users(id)
- **Indexes:** idx_analytics_events_user, idx_analytics_events_type, idx_analytics_events_category, idx_analytics_events_created, idx_analytics_events_user_created
- **RLS Policies:** Users can view/insert own analytics events, admins can view all

### 3. beta_users
- **Source:** 015_analytics_and_feedback_infrastructure.sql:33-43
- **Production Status:** DOES NOT EXIST
- **Latest Repository Status:** EXISTS
- **Impact:** Code expects beta_users table for beta access management
- **Severity:** CRITICAL
- **Columns:** id, user_id, status, invited_at, approved_at, approved_by, notes, waitlist_joined_at, account_created_at, profile_completed_at, first_logbook_created_at, first_report_created_at, first_export_at, onboarding_step, conversion_rate, department, institution, referral_source, created_at, updated_at
- **Foreign Keys:** user_id → auth.users(id), approved_by → auth.users(id)
- **Indexes:** idx_beta_users_user, idx_beta_users_status, idx_beta_users_onboarding_step, idx_beta_users_conversion
- **RLS Policies:** Users can view own beta status, admins can view/update/insert

### 4. weekly_logs
- **Source:** Referenced in 013_add_cascading_deletes.sql:19-27
- **Production Status:** DOES NOT EXIST
- **Latest Repository Status:** REFERENCED BUT NOT CREATED
- **Impact:** Migration 013 references this table but it was never created. Code expects weekly_logs table.
- **Severity:** CRITICAL
- **Columns:** UNKNOWN (table never created in any migration)
- **Foreign Keys:** report_id → reports(id) (from FK reference)
- **Status:** BROKEN - Migration references non-existent table

### 5. report_metadata
- **Source:** Referenced in 014_clean_profile_schema.sql:22-29
- **Production Status:** DOES NOT EXIST
- **Latest Repository Status:** REFERENCED BUT NOT CREATED
- **Impact:** Migration 014 references this table but it was never created. Code expects report_metadata table.
- **Severity:** CRITICAL
- **Columns:** UNKNOWN (table never created in any migration, but ALTER TABLE adds: academic_session, coordinator_name, supervisor_name)
- **Foreign Keys:** UNKNOWN
- **Status:** BROKEN - Migration references non-existent table

### 6. feedback
- **Source:** 015_analytics_and_feedback_infrastructure.sql:21-30
- **Production Status:** DOES NOT EXIST
- **Latest Repository Status:** EXISTS
- **Impact:** Code expects feedback table for user feedback system
- **Severity:** CRITICAL
- **Columns:** id, user_id, type, message, page, status, impact_score, frequency_score, priority_score, priority_level, created_at, updated_at
- **Foreign Keys:** user_id → auth.users(id)
- **Indexes:** idx_feedback_user, idx_feedback_status, idx_feedback_type, idx_feedback_created, idx_feedback_priority, idx_feedback_priority_score
- **RLS Policies:** Users can view/insert own feedback, admins can view/update

### 7. report_quality
- **Source:** 016_report_quality_and_feedback_enhancements.sql:19-27
- **Production Status:** DOES NOT EXIST
- **Latest Repository Status:** EXISTS
- **Impact:** Code expects report_quality table for report quality tracking
- **Severity:** CRITICAL
- **Columns:** id, user_id, report_version_id, edit_level, satisfaction_score, feedback_text, created_at
- **Foreign Keys:** user_id → auth.users(id), report_version_id → report_versions(id)
- **Indexes:** idx_report_quality_user, idx_report_quality_report, idx_report_quality_edit_level
- **RLS Policies:** Users can view/insert own report quality, admins can view all

---

## MISSING COLUMNS IN PRODUCTION

### reports table

#### is_active
- **Source:** 20240615_add_is_active_to_reports.sql:5
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** boolean DEFAULT false
- **Impact:** Code expects is_active flag for report selection
- **Severity:** HIGH
- **Migration:** 20240615_add_is_active_to_reports.sql

### report_versions table

#### user_id
- **Source:** 012_fix_report_versions_schema.sql:7
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** uuid REFERENCES auth.users(id) ON DELETE CASCADE
- **Impact:** Code expects user_id on report_versions
- **Severity:** HIGH
- **Migration:** 012_fix_report_versions_schema.sql

#### pdf_path
- **Source:** 012_fix_report_versions_schema.sql:12
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** text
- **Impact:** Code expects pdf_path for PDF export
- **Severity:** HIGH
- **Migration:** 012_fix_report_versions_schema.sql

#### page_count
- **Source:** 012_fix_report_versions_schema.sql:15
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** integer
- **Impact:** Code expects page_count for PDF export
- **Severity:** MEDIUM
- **Migration:** 012_fix_report_versions_schema.sql

#### amount_paid
- **Source:** 012_fix_report_versions_schema.sql:18
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** numeric
- **Impact:** Code expects amount_paid for payment tracking
- **Severity:** MEDIUM
- **Migration:** 012_fix_report_versions_schema.sql

#### currency
- **Source:** 012_fix_report_versions_schema.sql:21
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** text DEFAULT 'NGN'
- **Impact:** Code expects currency for payment tracking
- **Severity:** MEDIUM
- **Migration:** 012_fix_report_versions_schema.sql

#### payment_reference
- **Source:** 012_fix_report_versions_schema.sql:24
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** text
- **Impact:** Code expects payment_reference for payment tracking
- **Severity:** MEDIUM
- **Migration:** 012_fix_report_versions_schema.sql

#### payment_status
- **Source:** 012_fix_report_versions_schema.sql:27
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** text DEFAULT 'pending'
- **Impact:** Code expects payment_status for payment tracking
- **Severity:** MEDIUM
- **Migration:** 012_fix_report_versions_schema.sql

#### export_type
- **Source:** 012_fix_report_versions_schema.sql:30
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** text
- **Impact:** Code expects export_type for export tracking
- **Severity:** MEDIUM
- **Migration:** 012_fix_report_versions_schema.sql

### uploads table

#### report_id
- **Source:** 013_add_cascading_deletes.sql:11-15
- **Production Status:** MISSING
- **Latest Repository Status:** EXISTS
- **Type:** uuid REFERENCES reports(id) ON DELETE CASCADE
- **Impact:** Code expects report_id on uploads
- **Severity:** HIGH
- **Migration:** 013_add_cascading_deletes.sql
- **Note:** Migration 013 is BROKEN - references weekly_logs which doesn't exist

### profiles table

#### REMOVED in Latest (but exists in Production)
- **academic_session** - Exists in production (003_core_tables.sql:88), removed in 014_clean_profile_schema.sql:11
- **siwes_coordinator_name** - Exists in production (003_core_tables.sql:89), removed in 014_clean_profile_schema.sql:15
- **supervisor_name** - Exists in production (003_core_tables.sql:90), removed in 014_clean_profile_schema.sql:19
- **Impact:** Migration 014 will DROP these columns from production
- **Severity:** HIGH (DATA LOSS RISK)
- **Migration:** 014_clean_profile_schema.sql
- **Note:** Migration 014 is BROKEN - references report_metadata which doesn't exist

---

## TABLE CONFLICTS

### 1. institutions
- **Production Schema (003):** name, logo_url, state, country, created_at
- **Latest Schema (20240615):** name, code, type, state, country, website, logo_url, is_active, created_at, updated_at
- **Conflict:** 20240615_create_institutions_hierarchy.sql attempts to recreate table
- **Additional Columns in Latest:** code, type, website, is_active, updated_at
- **Severity:** HIGH
- **Resolution:** SKIP migration or modify to ALTER existing table

### 2. faculties
- **Production Schema (003):** institution_id, name, created_at
- **Latest Schema (20240615):** institution_id, name, code, is_active, created_at, updated_at
- **Conflict:** 20240615_create_institutions_hierarchy.sql attempts to recreate table
- **Additional Columns in Latest:** code, is_active, updated_at
- **Severity:** HIGH
- **Resolution:** SKIP migration or modify to ALTER existing table

### 3. departments
- **Production Schema (003):** faculty_id, name, created_at
- **Latest Schema (20240615):** faculty_id, institution_id, name, code, is_active, created_at, updated_at
- **Conflict:** 20240615_create_institutions_hierarchy.sql attempts to recreate table
- **Additional Columns in Latest:** institution_id, code, is_active, updated_at
- **FK Change:** Latest adds institution_id FK, production only has faculty_id FK
- **Severity:** HIGH
- **Resolution:** SKIP migration or modify to ALTER existing table

### 4. training_organizations
- **Production Schema (003):** name, address, industry, logo_url, created_at, updated_at
- **Latest Schema (20240615):** name, type, industry, state, country, website, logo_url, is_active, created_at, updated_at
- **Conflict:** 20240615_create_training_organizations.sql attempts to recreate table
- **Additional Columns in Latest:** type, state, country, website, is_active
- **Removed in Latest:** address
- **Severity:** HIGH
- **Resolution:** SKIP migration or modify to ALTER existing table

### 5. organization_departments
- **Production Schema (003):** organization_id, name, created_at
- **Latest Schema (20240615):** organization_id, name, code, is_active, created_at, updated_at
- **Conflict:** 20240615_create_training_organizations.sql attempts to recreate table
- **Additional Columns in Latest:** code, is_active, updated_at
- **Severity:** HIGH
- **Resolution:** SKIP migration or modify to ALTER existing table

### 6. profiles
- **Production Schema (003):** id, full_name, avatar_url, institution_id, faculty_id, department_id, matric_number, academic_session, siwes_coordinator_name, supervisor_name, role, created_at, updated_at
- **Latest Schema (20240615):** id, institution_id, faculty_id, department_id, training_organization_id, training_department_id, program, academic_session, full_name, phone, profile_image_url, is_active, created_at, updated_at
- **Conflict:** 20240615_create_profiles.sql attempts to recreate table
- **Additional Columns in Latest:** training_organization_id, training_department_id, phone, profile_image_url, is_active
- **Removed in Latest:** matric_number, role, avatar_url
- **FK Change:** Latest adds training_organization_id and training_department_id FKs
- **Severity:** HIGH
- **Resolution:** SKIP migration or modify to ALTER existing table

### 7. uploads
- **Production Schema (003):** id, user_id, file_url, file_type, linked_to, created_at
- **Latest Schema (20240615):** id, user_id, report_id, file_type, storage_path, file_name, mime_type, file_size, metadata, created_at
- **Conflict:** 20240615_create_uploads.sql attempts to recreate table
- **Column Name Changes:** file_url → storage_path, linked_to → file_name
- **Additional Columns in Latest:** report_id, mime_type, file_size, metadata
- **Removed in Latest:** file_url, linked_to
- **Severity:** HIGH
- **Resolution:** SKIP migration or modify to ALTER existing table

---

## BROKEN MIGRATION DEPENDENCIES

### 1. 013_add_cascading_deletes.sql
- **Issue:** References weekly_logs table (line 19-27)
- **Problem:** weekly_logs table does not exist in production and is not created by any migration
- **Impact:** Migration will fail with "relation public.weekly_logs does not exist"
- **Severity:** CRITICAL
- **Resolution:** Create weekly_logs table manually before applying migration, or remove weekly_logs section from migration

### 2. 014_clean_profile_schema.sql
- **Issue:** References report_metadata table (line 22-29)
- **Problem:** report_metadata table does not exist in production and is not created by any migration
- **Impact:** Migration will fail with "relation public.report_metadata does not exist"
- **Severity:** CRITICAL
- **Resolution:** Create report_metadata table manually before applying migration, or remove report_metadata section from migration

---

## FUNCTION VERSION CONFLICTS

### update_updated_at_column()
- **Production Version:** 006_functions_and_triggers.sql:24-32
- **Latest Version:** 20240615_create_institutions_hierarchy.sql:63-69
- **Difference:** Latest version uses TIMEZONE('utc'::text, NOW()) instead of NOW()
- **Impact:** Minor - timestamp format difference
- **Severity:** LOW
- **Resolution:** Apply latest version for UTC consistency

### handle_new_user()
- **Production Version:** 006_functions_and_triggers.sql:38-76
- **Latest Version:** 017_fix_profile_trigger.sql:13-49
- **Intermediate Version:** 20240615_create_profiles.sql:58-109 (BROKEN)
- **Difference:** 
  - Production inserts: id, full_name, avatar_url, role, created_at, updated_at
  - 20240615 attempts to insert: id, full_name, institution_id, faculty_id, department_id, program, academic_session, training_organization_id (BROKEN - references non-existent columns)
  - 017 fixes to match production schema
- **Impact:** 20240615 version is broken, 017 fixes it
- **Severity:** HIGH
- **Resolution:** Apply 017_fix_profile_trigger.sql to fix broken trigger

---

## INDEX DRIFT

### Missing Indexes in Production

#### report_versions
- **idx_report_versions_user** - Missing (012_fix_report_versions_schema.sql:33)
- **idx_report_versions_payment_reference** - Missing (012_fix_report_versions_schema.sql:37)

#### uploads
- **idx_uploads_report_id** - Missing (would be added by 013 if not broken)

### Additional Indexes in Latest (Conflicting Migrations)

#### institutions
- **idx_faculties_institution_id** - Would be added by 20240615 (CONFLICTING)

#### departments
- **idx_departments_institution_id** - Would be added by 20240615 (CONFLICTING)
- **idx_departments_faculty_id** - Would be added by 20240615 (CONFLICTING)

#### organization_departments
- **idx_organization_departments_organization_id** - Would be added by 20240615 (CONFLICTING)

#### profiles
- **idx_profiles_institution_id** - Would be added by 20240615 (CONFLICTING)
- **idx_profiles_faculty_id** - Would be added by 20240615 (CONFLICTING)
- **idx_profiles_department_id** - Would be added by 20240615 (CONFLICTING)
- **idx_profiles_training_organization_id** - Would be added by 20240615 (CONFLICTING)

#### uploads
- **idx_uploads_user_id** - Would be added by 20240615 (CONFLICTING)
- **idx_uploads_report_id** - Would be added by 20240615 (CONFLICTING)
- **idx_uploads_file_type** - Would be added by 20240615 (CONFLICTING)
- **idx_uploads_created_at** - Would be added by 20240615 (CONFLICTING)

---

## TRIGGER DRIFT

### Missing Triggers in Production

#### reports
- **single_active_report_trigger** - Missing (20240615_add_is_active_to_reports.sql:32)
- **Function:** ensure_single_active_report()
- **Impact:** No enforcement of single active report per user
- **Severity:** MEDIUM
- **Migration:** 20240615_add_is_active_to_reports.sql

### Additional Triggers in Latest (Conflicting Migrations)

#### institutions
- **update_institutions_updated_at** - Would be added by 20240615 (CONFLICTING)

#### faculties
- **update_faculties_updated_at** - Would be added by 20240615 (CONFLICTING)

#### departments
- **update_departments_updated_at** - Would be added by 20240615 (CONFLICTING)

#### training_organizations
- **update_training_organizations_updated_at** - Would be added by 20240615 (CONFLICTING)

#### organization_departments
- **update_organization_departments_updated_at** - Would be added by 20240615 (CONFLICTING)

#### profiles
- **update_profiles_updated_at** - Would be added by 20240615 (CONFLICTING)

---

## CONSTRAINT DRIFT

### Missing Constraints in Production

#### report_versions
- **report_versions_payment_reference_unique** - Missing (012_fix_report_versions_schema.sql:42)

#### uploads
- **uploads_report_id_fkey** - Missing (would be added by 013 if not broken)
- **NOT NULL on user_id** - Missing (would be added by 013 if not broken)
- **NOT NULL on report_id** - Missing (would be added by 013 if not broken)

---

## SUMMARY TABLE

| Category | Production | Latest | Status |
|----------|-----------|--------|--------|
| Tables | 18 | 25 | +7 missing in production |
| Columns | 120+ | 140+ | +12 missing in production |
| Indexes | 9 | 20+ | +11 missing in production |
| Triggers | 11 | 17+ | +6 missing in production |
| Functions | 10 | 10+ | Same count, version conflicts |
| RLS Policies | 50+ | 60+ | +10 missing in production |

---

## END OF SCHEMA DRIFT REPORT
