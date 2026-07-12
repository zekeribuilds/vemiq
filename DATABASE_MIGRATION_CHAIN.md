# DATABASE MIGRATION CHAIN
**Date:** 2025-01-XX
**Based on:** All SQL files in supabase/migrations/
**Purpose:** Complete migration dependency analysis

---

## MIGRATION TABLE

| Migration | Creates | Alters | Drops | Dependencies | Status |
| --------- | ------- | ------ | ----- | ------------ | ------ |
| 001_extensions.sql | pgcrypto extension | None | None | None | PRODUCTION |
| 002_enums.sql | user_role, program_type, report_status, payment_status, logbook_status, source_type, file_type, chat_role enums | None | None | 001 | PRODUCTION |
| 003_core_tables.sql | institutions, faculties, departments, training_organizations, organization_departments, organization_knowledge, profiles, logbooks, logbook_entries, logbook_evidence, reports, report_sections, report_versions, report_logbook_entries, chat_messages, payments, uploads, activity_logs tables | None | None | 001, 002 | PRODUCTION |
| 004_relationship_constraints.sql | None (reserved) | None | None | 003 | PRODUCTION |
| 005_indexes.sql | idx_profiles_institution, idx_logbooks_user, idx_logbook_entries_user, idx_logbook_entries_logbook, idx_reports_user, idx_report_sections_report, idx_chat_messages_user, idx_payments_user, idx_uploads_user indexes | None | None | 003 | PRODUCTION |
| 006_functions_and_triggers.sql | is_admin(), update_updated_at_column(), handle_new_user(), calculate_report_progress(), refresh_report_progress() functions; profiles_updated_at, training_organizations_updated_at, organization_knowledge_updated_at, logbooks_updated_at, logbook_entries_updated_at, reports_updated_at, report_sections_updated_at, on_auth_user_created, report_progress_after_insert, report_progress_after_update, report_progress_after_delete triggers | None | on_auth_user_created trigger (line 196) | 003 | PRODUCTION |
| 007_rls.sql | RLS policies for all tables | Enables RLS on all tables | None | 003, 006 | PRODUCTION |
| 008_storage_buckets.sql | report_exports table; avatars, institution-assets, organization-assets, logbook-files, report-exports storage buckets | Enables RLS on report_exports | None | 003 | PRODUCTION |
| 009_storage_policies.sql | Storage policies for all buckets | None | None | 008 | PRODUCTION |
| 010_paystack_integration.sql | report_access table; has_report_access(), is_report_unlocked() functions | payments table (adds paystack_reference, paystack_transaction_id, paid_at, gateway_response, metadata columns) | None | 003 | PRODUCTION |
| 011_report_generation_engine.sql | generation_status enum; report_generation_jobs table; build_report_context(), initialize_report_sections(), create_generation_job(), update_generation_job_status(), get_generation_analytics() functions | None | None | 003, 006 | PRODUCTION |
| 012_fix_report_versions_schema.sql | idx_report_versions_user, idx_report_versions_payment_reference indexes; report_versions_payment_reference_unique constraint | report_versions table (adds user_id, pdf_path, page_count, amount_paid, currency, payment_reference, payment_status, export_type columns) | None | 003 | PENDING |
| 013_add_cascading_deletes.sql | uploads_report_id_fkey, weekly_logs_report_id_fkey foreign key constraints | uploads table (adds report_id FK, sets user_id and report_id NOT NULL); weekly_logs table (adds report_id FK) | uploads_report_id_fkey, weekly_logs_report_id_fkey constraints (to recreate) | 003, weekly_logs table (MISSING) | PENDING - BROKEN |
| 014_clean_profile_schema.sql | None | profiles table (drops subscription_plan, academic_session, siwes_coordinator_name, supervisor_name columns); report_metadata table (adds academic_session, coordinator_name, supervisor_name columns) | None | 003, report_metadata table (MISSING) | PENDING - BROKEN |
| 015_analytics_and_feedback_infrastructure.sql | analytics_events, feedback, beta_users tables; update_updated_at_column() function (recreated); feedback_updated_at, beta_users_updated_at triggers | None | None | 003, 006 | PENDING |
| 016_report_quality_and_feedback_enhancements.sql | report_quality table; calculate_feedback_priority() function; feedback_priority_calculation trigger; idx_feedback_priority, idx_feedback_priority_score, idx_report_quality_user, idx_report_quality_report, idx_report_quality_edit_level indexes | feedback table (adds impact_score, frequency_score, priority_score, priority_level columns) | None | 003, 015 | PENDING |
| 017_fix_profile_trigger.sql | handle_new_user() function (recreated); on_auth_user_created trigger (recreated) | None | on_auth_user_created trigger, handle_new_user() function (to recreate) | 003 | PENDING |
| 20240615_add_is_active_to_reports.sql | ensure_single_active_report() function; single_active_report_trigger trigger | reports table (adds is_active column) | single_active_report_trigger trigger (to recreate) | 003 | PENDING |
| 20240615_create_activity_events.sql | activity_events table; log_activity_event() function; idx_activity_events_user_created_at, idx_activity_events_report_id, idx_activity_events_event_type indexes | None | None | 003 | PENDING |
| 20240615_create_institutions_hierarchy.sql | institutions, faculties, departments tables (recreated); update_updated_at_column() function (recreated); update_institutions_updated_at, update_faculties_updated_at, update_departments_updated_at triggers | None | None | None | PENDING - CONFLICT |
| 20240615_create_profiles.sql | profiles table (recreated); handle_new_user() function (recreated); on_auth_user_created trigger (recreated); update_profiles_updated_at trigger | None | on_auth_user_created trigger, handle_new_user() function (to recreate) | 20240615_create_institutions_hierarchy, 20240615_create_training_organizations | PENDING - CONFLICT |
| 20240615_create_training_organizations.sql | training_organizations, organization_departments tables (recreated); update_updated_at_column() function (recreated); update_training_organizations_updated_at, update_organization_departments_updated_at triggers | None | None | None | PENDING - CONFLICT |
| 20240615_create_uploads.sql | uploads table (recreated); idx_uploads_user_id, idx_uploads_report_id, idx_uploads_file_type, idx_uploads_created_at indexes | None | None | 003 | PENDING - CONFLICT |
| 20240620_beta_onboarding_pipeline.sql | update_beta_onboarding_step() function; beta_users_onboarding_step_trigger trigger; track_onboarding_event() function; idx_beta_users_onboarding_step, idx_beta_users_conversion indexes | beta_users table (adds waitlist_joined_at, account_created_at, profile_completed_at, first_logbook_created_at, first_report_created_at, first_export_at, onboarding_step, conversion_rate, department, institution, referral_source columns) | beta_users_onboarding_step_trigger trigger (to recreate) | 003, 015 | PENDING |

---

## PRODUCTION MIGRATIONS (001-011)

These migrations have been applied to production:

- 001_extensions.sql
- 002_enums.sql
- 003_core_tables.sql
- 004_relationship_constraints.sql
- 005_indexes.sql
- 006_functions_and_triggers.sql
- 007_rls.sql
- 008_storage_buckets.sql
- 009_storage_policies.sql
- 010_paystack_integration.sql
- 011_report_generation_engine.sql

---

## PENDING MIGRATIONS (012-017, 20240615, 20240620)

These migrations exist in the repository but have NOT been applied to production:

### Safe Migrations (7)
- 012_fix_report_versions_schema.sql
- 015_analytics_and_feedback_infrastructure.sql
- 016_report_quality_and_feedback_enhancements.sql
- 017_fix_profile_trigger.sql
- 20240615_add_is_active_to_reports.sql
- 20240615_create_activity_events.sql
- 20240620_beta_onboarding_pipeline.sql

### Broken Migrations (2)
- 013_add_cascading_deletes.sql - References weekly_logs table (doesn't exist)
- 014_clean_profile_schema.sql - References report_metadata table (doesn't exist)

### Conflicting Migrations (4)
- 20240615_create_institutions_hierarchy.sql - Recreates institutions, faculties, departments (already exist)
- 20240615_create_profiles.sql - Recreates profiles table (already exists)
- 20240615_create_training_organizations.sql - Recreates training_organizations, organization_departments (already exist)
- 20240615_create_uploads.sql - Recreates uploads table (already exists)

---

## CRITICAL DEPENDENCY ISSUES

### Missing Tables Referenced by Migrations

1. **weekly_logs** - Referenced by 013_add_cascading_deletes.sql (line 19)
   - Does not exist in production
   - Does not exist in any migration
   - Code expects this table
   - Must be created manually

2. **report_metadata** - Referenced by 014_clean_profile_schema.sql (line 22)
   - Does not exist in production
   - Does not exist in any migration
   - Code expects this table
   - Must be created manually

---

## FUNCTION VERSION CONFLICTS

### update_updated_at_column()

- **Version 1:** 006_functions_and_triggers.sql (line 24-32)
- **Version 2:** 015_analytics_and_feedback_infrastructure.sql (line 155-163) - Recreated
- **Version 3:** 20240615_create_institutions_hierarchy.sql (line 63-69) - Recreated
- **Production Version:** Version 1 (from 006)
- **Latest Version:** Version 3 (from 20240615_create_institutions_hierarchy)
- **Impact:** Function is recreated multiple times, but logic is identical

### handle_new_user()

- **Version 1:** 006_functions_and_triggers.sql (line 38-76)
- **Version 2:** 20240615_create_profiles.sql (line 58-109) - Different schema
- **Version 3:** 017_fix_profile_trigger.sql (line 13-49) - Fixes schema mismatch
- **Production Version:** Version 1 (from 006)
- **Latest Version:** Version 3 (from 017)
- **Impact:** Version 2 is broken (references non-existent columns), Version 3 fixes this

---

## END OF DATABASE MIGRATION CHAIN
