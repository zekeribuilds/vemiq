# DATABASE FORENSIC AUDIT
**Date:** 2025-01-XX
**Scope:** Complete forensic analysis of Vemiq database
**Production State:** Migrations 001-011 applied
**Repository State:** All migrations present

---

## PHASE 1: DATABASE FILE INVENTORY

### Migration Files

| Migration Number | File Name | Purpose | Tables Created | Tables Altered | Functions | Triggers |
|------------------|-----------|---------|----------------|----------------|-----------|----------|
| 001 | 001_extensions.sql | Create pgcrypto extension | 0 | 0 | 0 | 0 |
| 002 | 002_enums.sql | Create enum types | 0 | 0 | 0 | 0 |
| 003 | 003_core_tables.sql | Create core tables | 16 | 0 | 0 | 0 |
| 004 | 004_relationship_constraints.sql | Placeholder for constraints | 0 | 0 | 0 | 0 |
| 005 | 005_indexes.sql | Create indexes | 0 | 0 | 0 | 0 |
| 006 | 006_functions_and_triggers.sql | Create functions and triggers | 0 | 0 | 5 | 11 |
| 007 | 007_rls.sql | Enable RLS and policies | 0 | 0 | 0 | 0 |
| 008 | 008_storage_buckets.sql | Create storage buckets and report_exports | 1 | 0 | 0 | 0 |
| 009 | 009_storage_policies.sql | Create storage policies | 0 | 0 | 0 | 0 |
| 010 | 010_paystack_integration.sql | Paystack integration | 1 | 1 | 2 | 0 |
| 011 | 011_report_generation_engine.sql | Report generation engine | 1 | 0 | 5 | 0 |
| 012 | 012_fix_report_versions_schema.sql | Fix report_versions schema | 0 | 1 | 0 | 0 |
| 013 | 013_add_cascading_deletes.sql | Add cascading deletes | 0 | 2 | 0 | 0 |
| 014 | 014_clean_profile_schema.sql | Clean profile schema | 0 | 2 | 0 | 0 |
| 015 | 015_analytics_and_feedback_infrastructure.sql | Analytics and feedback | 3 | 0 | 1 | 2 |
| 016 | 016_report_quality_and_feedback_enhancements.sql | Report quality enhancements | 1 | 1 | 1 | 1 |
| 017 | 017_fix_profile_trigger.sql | Fix profile trigger | 0 | 0 | 1 | 1 |
| 20240615_add_is_active_to_reports.sql | Add is_active to reports | 0 | 1 | 1 | 1 |
| 20240615_create_activity_events.sql | Create activity_events | 1 | 0 | 1 | 0 |
| 20240615_create_institutions_hierarchy.sql | Recreate institutions hierarchy | 3 | 0 | 1 | 3 |
| 20240615_create_profiles.sql | Recreate profiles | 1 | 0 | 1 | 2 |
| 20240615_create_training_organizations.sql | Recreate training organizations | 2 | 0 | 0 | 2 |
| 20240615_create_uploads.sql | Recreate uploads | 1 | 0 | 0 | 0 |
| 20240620_beta_onboarding_pipeline.sql | Beta onboarding pipeline | 0 | 1 | 2 | 1 |

**Total Migrations:** 24
**Production Migrations (001-011):** 11
**Pending Migrations (012+):** 13

---

## PHASE 2: PRODUCTION DATABASE SCHEMA (MIGRATIONS 001-011)

### Extensions
- **pgcrypto** (001_extensions.sql:4)

### Enum Types
- **user_role** (002_enums.sql:4-7): 'student', 'admin'
- **program_type** (002_enums.sql:9-12): 'SWEP', 'SIWES'
- **report_status** (002_enums.sql:14-17): 'draft', 'completed'
- **payment_status** (002_enums.sql:19-23): 'pending', 'successful', 'failed'
- **logbook_status** (002_enums.sql:25-28): 'active', 'completed'
- **source_type** (002_enums.sql:30-35): 'text', 'voice', 'image', 'mixed'
- **file_type** (002_enums.sql:37-42): 'image', 'audio', 'pdf', 'document'
- **chat_role** (002_enums.sql:44-47): 'user', 'assistant'
- **generation_status** (011_report_generation_engine.sql:6-11): 'pending', 'processing', 'completed', 'failed'

### Tables

#### institutions (003_core_tables.sql:6-13)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- name: text (NOT NULL, UNIQUE)
- logo_url: text
- state: text
- country: text (default 'Nigeria')
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** None
**Indexes:** idx_profiles_institution (005_indexes.sql:4-5)
**RLS:** Enabled (007_rls.sql:7)
**Policies:** 
- "Authenticated users can view institutions" (007_rls.sql:47-49)
- "Admins can insert institutions" (007_rls.sql:51-53)
- "Admins can update institutions" (007_rls.sql:55-58)
- "Admins can delete institutions" (007_rls.sql:60-62)

#### faculties (003_core_tables.sql:15-23)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- institution_id: uuid (NOT NULL, FK to institutions(id) ON DELETE CASCADE)
- name: text (NOT NULL)
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** institution_id → institutions(id)
**Constraints UNIQUE:** (institution_id, name)
**RLS:** Enabled (007_rls.sql:8)
**Policies:**
- "Authenticated users can view faculties" (007_rls.sql:66-68)
- "Admins can insert faculties" (007_rls.sql:70-72)
- "Admins can update faculties" (007_rls.sql:74-77)
- "Admins can delete faculties" (007_rls.sql:79-81)

#### departments (003_core_tables.sql:25-33)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- faculty_id: uuid (NOT NULL, FK to faculties(id) ON DELETE CASCADE)
- name: text (NOT NULL)
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** faculty_id → faculties(id)
**Constraints UNIQUE:** (faculty_id, name)
**RLS:** Enabled (007_rls.sql:9)
**Policies:**
- "Authenticated users can view departments" (007_rls.sql:85-87)
- "Admins can insert departments" (007_rls.sql:89-91)
- "Admins can update departments" (007_rls.sql:93-96)
- "Admins can delete departments" (007_rls.sql:98-100)

#### training_organizations (003_core_tables.sql:37-45)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- name: text (NOT NULL, UNIQUE)
- address: text
- industry: text
- logo_url: text
- created_at: timestamptz (NOT NULL, default now())
- updated_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** None
**Triggers:** training_organizations_updated_at (006_functions_and_triggers.sql:158-162)
**RLS:** Enabled (007_rls.sql:10)
**Policies:**
- "Authenticated users can view training_organizations" (007_rls.sql:104-106)
- "Admins can insert training_organizations" (007_rls.sql:108-110)
- "Admins can update training_organizations" (007_rls.sql:112-115)
- "Admins can delete training_organizations" (007_rls.sql:117-119)

#### organization_departments (003_core_tables.sql:47-55)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- organization_id: uuid (NOT NULL, FK to training_organizations(id) ON DELETE CASCADE)
- name: text (NOT NULL)
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** organization_id → training_organizations(id)
**Constraints UNIQUE:** (organization_id, name)
**RLS:** Enabled (007_rls.sql:11)
**Policies:**
- "Authenticated users can view organization_departments" (007_rls.sql:123-125)
- "Admins can insert organization_departments" (007_rls.sql:127-129)
- "Admins can update organization_departments" (007_rls.sql:131-134)
- "Admins can delete organization_departments" (007_rls.sql:136-138)

#### organization_knowledge (003_core_tables.sql:57-71)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- organization_id: uuid (NOT NULL, FK to training_organizations(id) ON DELETE CASCADE)
- overview: text
- history: text
- mission: text
- tools_used: text
- safety_rules: text
- processes: text
- notes: text
- created_at: timestamptz (NOT NULL, default now())
- updated_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** organization_id → training_organizations(id)
**Triggers:** organization_knowledge_updated_at (006_functions_and_triggers.sql:164-168)
**RLS:** Enabled (007_rls.sql:12)
**Policies:**
- "Authenticated users can view organization_knowledge" (007_rls.sql:142-144)
- "Admins can insert organization_knowledge" (007_rls.sql:146-148)
- "Admins can update organization_knowledge" (007_rls.sql:150-153)
- "Admins can delete organization_knowledge" (007_rls.sql:155-157)

#### profiles (003_core_tables.sql:75-94)
**Columns:**
- id: uuid (PK, FK to auth.users(id) ON DELETE CASCADE)
- full_name: text
- avatar_url: text
- institution_id: uuid (FK to institutions(id))
- faculty_id: uuid (FK to faculties(id))
- department_id: uuid (FK to departments(id))
- matric_number: text
- academic_session: text
- siwes_coordinator_name: text
- supervisor_name: text
- role: user_role (NOT NULL, default 'student')
- created_at: timestamptz (NOT NULL, default now())
- updated_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** 
- id → auth.users(id)
- institution_id → institutions(id)
- faculty_id → faculties(id)
- department_id → departments(id)

**Indexes:** idx_profiles_institution (005_indexes.sql:4-5)
**Triggers:** profiles_updated_at (006_functions_and_triggers.sql:152-156)
**RLS:** Enabled (007_rls.sql:6)
**Policies:**
- "Users can view own profile" (007_rls.sql:28-30)
- "Users can insert own profile" (007_rls.sql:32-34)
- "Users can update own profile" (007_rls.sql:36-39)

#### logbooks (003_core_tables.sql:98-115)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- title: text (NOT NULL)
- program_type: program_type (NOT NULL)
- institution_id: uuid (FK to institutions(id))
- training_organization_id: uuid (FK to training_organizations(id))
- department_name: text
- start_date: date
- end_date: date
- status: logbook_status (NOT NULL, default 'active')
- created_at: timestamptz (NOT NULL, default now())
- updated_at: timestamptz (NOT NULL, default now())

**Foreign Keys:**
- user_id → auth.users(id)
- institution_id → institutions(id)
- training_organization_id → training_organizations(id)

**Indexes:** idx_logbooks_user (005_indexes.sql:7-8)
**Triggers:** logbooks_updated_at (006_functions_and_triggers.sql:170-174)
**RLS:** Enabled (007_rls.sql:13)
**Policies:**
- "Users can view own logbooks" (007_rls.sql:164-166)
- "Users can insert own logbooks" (007_rls.sql:168-170)
- "Users can update own logbooks" (007_rls.sql:172-175)
- "Users can delete own logbooks" (007_rls.sql:177-179)

#### logbook_entries (003_core_tables.sql:117-133)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- logbook_id: uuid (NOT NULL, FK to logbooks(id) ON DELETE CASCADE)
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- entry_date: date (NOT NULL)
- week_number: integer
- title: text
- activity_description: text (NOT NULL)
- ai_cleaned_text: text
- source_type: source_type (NOT NULL, default 'text')
- created_at: timestamptz (NOT NULL, default now())
- updated_at: timestamptz (NOT NULL, default now())

**Foreign Keys:**
- logbook_id → logbooks(id)
- user_id → auth.users(id)

**Indexes:** 
- idx_logbook_entries_user (005_indexes.sql:10-11)
- idx_logbook_entries_logbook (005_indexes.sql:13-14)

**Triggers:** logbook_entries_updated_at (006_functions_and_triggers.sql:176-180)
**RLS:** Enabled (007_rls.sql:14)
**Policies:**
- "Users can view own logbook_entries" (007_rls.sql:183-185)
- "Users can insert own logbook_entries" (007_rls.sql:187-189)
- "Users can update own logbook_entries" (007_rls.sql:191-194)
- "Users can delete own logbook_entries" (007_rls.sql:196-198)

#### logbook_evidence (003_core_tables.sql:135-147)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- entry_id: uuid (NOT NULL, FK to logbook_entries(id) ON DELETE CASCADE)
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- storage_path: text (NOT NULL)
- file_type: file_type (NOT NULL)
- mime_type: text
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:**
- entry_id → logbook_entries(id)
- user_id → auth.users(id)

**RLS:** Enabled (007_rls.sql:15)
**Policies:**
- "Users can view own logbook_evidence" (007_rls.sql:203-212)
- "Users can insert own logbook_evidence" (007_rls.sql:214-216)
- "Users can update own logbook_evidence" (007_rls.sql:218-221)
- "Users can delete own logbook_evidence" (007_rls.sql:223-225)

#### reports (003_core_tables.sql:151-167)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- title: text (NOT NULL)
- report_type: program_type (NOT NULL)
- institution_id: uuid (FK to institutions(id))
- training_organization_id: uuid (FK to training_organizations(id))
- status: report_status (NOT NULL, default 'draft')
- progress: integer (NOT NULL, default 0, CHECK progress >= 0 and progress <= 100)
- created_at: timestamptz (NOT NULL, default now())
- updated_at: timestamptz (NOT NULL, default now())

**Foreign Keys:**
- user_id → auth.users(id)
- institution_id → institutions(id)
- training_organization_id → training_organizations(id)

**Indexes:** idx_reports_user (005_indexes.sql:16-17)
**Triggers:** reports_updated_at (006_functions_and_triggers.sql:182-186)
**RLS:** Enabled (007_rls.sql:16)
**Policies:**
- "Users can view own reports" (007_rls.sql:229-231)
- "Users can insert own reports" (007_rls.sql:233-235)
- "Users can update own reports" (007_rls.sql:237-240)
- "Users can delete own reports" (007_rls.sql:242-244)

#### report_sections (003_core_tables.sql:169-180)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- report_id: uuid (NOT NULL, FK to reports(id) ON DELETE CASCADE)
- title: text (NOT NULL)
- content: text
- section_order: integer (NOT NULL)
- ai_generated: boolean (NOT NULL, default false)
- created_at: timestamptz (NOT NULL, default now())
- updated_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** report_id → reports(id)
**Indexes:** idx_report_sections_report (005_indexes.sql:19-20)
**Triggers:** 
- report_sections_updated_at (006_functions_and_triggers.sql:188-192)
- report_progress_after_insert (006_functions_and_triggers.sql:208-212)
- report_progress_after_update (006_functions_and_triggers.sql:214-218)
- report_progress_after_delete (006_functions_and_triggers.sql:220-224)

**RLS:** Enabled (007_rls.sql:17)
**Policies:**
- "Users can view own report_sections" (007_rls.sql:249-258)
- "Users can insert own report_sections" (007_rls.sql:260-269)
- "Users can update own report_sections" (007_rls.sql:271-288)
- "Users can delete own report_sections" (007_rls.sql:290-299)

#### report_versions (003_core_tables.sql:182-189)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- report_id: uuid (NOT NULL, FK to reports(id) ON DELETE CASCADE)
- snapshot: jsonb
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** report_id → reports(id)
**RLS:** Enabled (007_rls.sql:18)
**Policies:**
- "Users can view own report_versions" (007_rls.sql:304-313)
- "Users can insert own report_versions" (007_rls.sql:315-324)
- "Users can update own report_versions" (007_rls.sql:326-343)
- "Users can delete own report_versions" (007_rls.sql:345-354)

#### report_logbook_entries (003_core_tables.sql:191-203)
**Columns:**
- report_id: uuid (NOT NULL, FK to reports(id) ON DELETE CASCADE)
- entry_id: uuid (NOT NULL, FK to logbook_entries(id) ON DELETE CASCADE)
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:**
- report_id → reports(id)
- entry_id → logbook_entries(id)

**Constraints PRIMARY KEY:** (report_id, entry_id)
**RLS:** Enabled (007_rls.sql:19)
**Policies:**
- "Users can view own report_logbook_entries" (007_rls.sql:359-368)
- "Users can insert own report_logbook_entries" (007_rls.sql:370-379)
- "Users can update own report_logbook_entries" (007_rls.sql:381-398)
- "Users can delete own report_logbook_entries" (007_rls.sql:400-409)

#### chat_messages (003_core_tables.sql:207-218)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- report_id: uuid (FK to reports(id) ON DELETE CASCADE)
- role: chat_role (NOT NULL)
- message: text (NOT NULL)
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:**
- user_id → auth.users(id)
- report_id → reports(id)

**Indexes:** idx_chat_messages_user (005_indexes.sql:22-23)
**RLS:** Enabled (007_rls.sql:20)
**Policies:**
- "Users can view own chat_messages" (007_rls.sql:413-415)
- "Users can insert own chat_messages" (007_rls.sql:417-419)
- "Users can update own chat_messages" (007_rls.sql:421-424)
- "Users can delete own chat_messages" (007_rls.sql:426-428)

#### payments (003_core_tables.sql:222-234)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- report_id: uuid (FK to reports(id))
- amount: integer (NOT NULL)
- currency: text (NOT NULL, default 'NGN')
- status: payment_status (NOT NULL, default 'pending')
- reference: text (UNIQUE)
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:**
- user_id → auth.users(id)
- report_id → reports(id)

**Indexes:** 
- idx_payments_user (005_indexes.sql:25-26)
- idx_payments_paystack_reference (010_paystack_integration.sql:91-92)
- idx_payments_paystack_transaction_id (010_paystack_integration.sql:94-95)

**Additional Columns (010_paystack_integration.sql):**
- paystack_reference: text (UNIQUE) (010_paystack_integration.sql:6-8)
- paystack_transaction_id: bigint (010_paystack_integration.sql:9-11)
- paid_at: timestamptz (010_paystack_integration.sql:12-14)
- gateway_response: text (010_paystack_integration.sql:15-17)
- metadata: jsonb (010_paystack_integration.sql:18-20)

**RLS:** Enabled (007_rls.sql:21)
**Policies:**
- "Users can view own payments" (007_rls.sql:432-434)
- "Users can insert own payments" (007_rls.sql:436-438)
- "Users can update own payments" (007_rls.sql:440-443)

#### uploads (003_core_tables.sql:238-247)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- file_url: text (NOT NULL)
- file_type: text
- linked_to: text
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** user_id → auth.users(id)
**Indexes:** idx_uploads_user (005_indexes.sql:28-29)
**RLS:** Enabled (007_rls.sql:22)
**Policies:**
- "Users can view own uploads" (007_rls.sql:449-451)
- "Users can insert own uploads" (007_rls.sql:453-455)
- "Users can update own uploads" (007_rls.sql:457-460)
- "Users can delete own uploads" (007_rls.sql:462-464)

#### activity_logs (003_core_tables.sql:251-259)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (FK to auth.users(id) ON DELETE SET NULL)
- action: text (NOT NULL)
- metadata: jsonb
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:** user_id → auth.users(id)
**RLS:** Enabled (007_rls.sql:23)
**Policies:**
- "Users can view own activity_logs" (007_rls.sql:470-472)
- "Admins can view all activity_logs" (007_rls.sql:474-476)
- "Users can insert own activity_logs" (007_rls.sql:478-480)
- "Admins can insert activity_logs" (007_rls.sql:482-484)

#### report_exports (008_storage_buckets.sql:6-22)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- report_id: uuid (NOT NULL, FK to reports(id) ON DELETE CASCADE)
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- storage_path: text (NOT NULL)
- version_number: integer (NOT NULL)
- created_at: timestamptz (NOT NULL, default now())

**Foreign Keys:**
- report_id → reports(id)
- user_id → auth.users(id)

**Indexes:**
- idx_report_exports_report (008_storage_buckets.sql:93-94)
- idx_report_exports_user (008_storage_buckets.sql:96-97)

**RLS:** Enabled (008_storage_buckets.sql:26)
**Policies:**
- "Users can view own report_exports" (008_storage_buckets.sql:31-40)
- "Users can insert own report_exports" (008_storage_buckets.sql:42-51)
- "Users can delete own report_exports" (008_storage_buckets.sql:53-62)

#### report_access (010_paystack_integration.sql:23-43)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- report_id: uuid (NOT NULL, FK to reports(id) ON DELETE CASCADE)
- payment_id: uuid (NOT NULL, FK to payments(id) ON DELETE CASCADE)
- unlocked_at: timestamptz (NOT NULL, default now())
- expires_at: timestamptz

**Foreign Keys:**
- user_id → auth.users(id)
- report_id → reports(id)
- payment_id → payments(id)

**Constraints UNIQUE:** (user_id, report_id)
**Indexes:**
- idx_report_access_user (010_paystack_integration.sql:80-81)
- idx_report_access_report (010_paystack_integration.sql:83-84)
- idx_report_access_payment (010_paystack_integration.sql:86-87)

**RLS:** Enabled (010_paystack_integration.sql:47)
**Policies:**
- "Users can view own report_access" (010_paystack_integration.sql:52-61)
- "Users can insert own report_access" (010_paystack_integration.sql:63-72)
- "Admins can view all report_access" (010_paystack_integration.sql:74-76)

#### report_generation_jobs (011_report_generation_engine.sql:15-41)
**Columns:**
- id: uuid (PK, default gen_random_uuid())
- report_id: uuid (NOT NULL, FK to reports(id) ON DELETE CASCADE)
- section_id: uuid (NOT NULL, FK to report_sections(id) ON DELETE CASCADE)
- user_id: uuid (NOT NULL, FK to auth.users(id) ON DELETE CASCADE)
- status: generation_status (NOT NULL, default 'pending')
- prompt: jsonb
- generated_content: text
- error_message: text
- created_at: timestamptz (NOT NULL, default now())
- completed_at: timestamptz

**Foreign Keys:**
- report_id → reports(id)
- section_id → report_sections(id)
- user_id → auth.users(id)

**Indexes:**
- idx_report_generation_jobs_report (011_report_generation_engine.sql:97-98)
- idx_report_generation_jobs_section (011_report_generation_engine.sql:100-101)
- idx_report_generation_jobs_user (011_report_generation_engine.sql:103-104)
- idx_report_generation_jobs_status (011_report_generation_engine.sql:106-107)
- idx_report_generation_jobs_created_at (011_report_generation_engine.sql:109-110)

**RLS:** Enabled (011_report_generation_engine.sql:45)
**Policies:**
- "Users can view own report_generation_jobs" (011_report_generation_engine.sql:50-59)
- "Users can insert own report_generation_jobs" (011_report_generation_engine.sql:61-70)
- "Users can update own report_generation_jobs" (011_report_generation_engine.sql:72-89)
- "Admins can view all report_generation_jobs" (011_report_generation_engine.sql:91-93)

### Functions (Production)

#### is_admin() (006_functions_and_triggers.sql:7-19)
- **Purpose:** Check if current user is admin
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** boolean
- **Dependencies:** profiles table

#### update_updated_at_column() (006_functions_and_triggers.sql:24-32)
- **Purpose:** Automatically update updated_at timestamps
- **Returns:** trigger

#### handle_new_user() (006_functions_and_triggers.sql:38-76)
- **Purpose:** Automatically create profile after signup
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** trigger
- **Inserts into:** profiles (id, full_name, avatar_url, role, created_at, updated_at)

#### calculate_report_progress(report_uuid uuid) (006_functions_and_triggers.sql:83-119)
- **Purpose:** Calculate report completion percentage
- **Returns:** integer
- **Dependencies:** report_sections table

#### refresh_report_progress() (006_functions_and_triggers.sql:124-147)
- **Purpose:** Update reports.progress automatically
- **Returns:** trigger
- **Dependencies:** calculate_report_progress()

#### build_report_context(report_uuid uuid) (011_report_generation_engine.sql:114-232)
- **Purpose:** Build report context for AI generation
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** jsonb
- **Dependencies:** reports, profiles, institutions, training_organizations, organization_knowledge, logbook_entries, report_sections

#### initialize_report_sections(report_uuid uuid, program_type_param program_type) (011_report_generation_engine.sql:236-265)
- **Purpose:** Initialize default sections for new report
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** void
- **Dependencies:** report_sections

#### create_generation_job(report_uuid uuid, section_uuid uuid, prompt_data jsonb) (011_report_generation_engine.sql:269-302)
- **Purpose:** Create report generation job
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** uuid
- **Dependencies:** report_generation_jobs

#### update_generation_job_status(job_uuid uuid, status_param generation_status, content_param text, error_param text) (011_report_generation_engine.sql:306-328)
- **Purpose:** Update generation job status
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** void
- **Dependencies:** report_generation_jobs

#### get_generation_analytics(user_uuid uuid) (011_report_generation_engine.sql:332-363)
- **Purpose:** Get generation analytics
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** jsonb
- **Dependencies:** report_generation_jobs

#### has_report_access(report_uuid uuid) (010_paystack_integration.sql:99-112)
- **Purpose:** Check if user has report access
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** boolean
- **Dependencies:** report_access

#### is_report_unlocked(report_uuid uuid, user_uuid uuid) (010_paystack_integration.sql:116-128)
- **Purpose:** Check if report is unlocked by payment
- **Security:** SECURITY DEFINER, search_path = public
- **Returns:** boolean
- **Dependencies:** report_access

### Triggers (Production)

#### profiles_updated_at (006_functions_and_triggers.sql:152-156)
- **Table:** profiles
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()

#### training_organizations_updated_at (006_functions_and_triggers.sql:158-162)
- **Table:** training_organizations
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()

#### organization_knowledge_updated_at (006_functions_and_triggers.sql:164-168)
- **Table:** organization_knowledge
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()

#### logbooks_updated_at (006_functions_and_triggers.sql:170-174)
- **Table:** logbooks
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()

#### logbook_entries_updated_at (006_functions_and_triggers.sql:176-180)
- **Table:** logbook_entries
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()

#### reports_updated_at (006_functions_and_triggers.sql:182-186)
- **Table:** reports
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()

#### report_sections_updated_at (006_functions_and_triggers.sql:188-192)
- **Table:** report_sections
- **Timing:** BEFORE UPDATE
- **Function:** update_updated_at_column()

#### on_auth_user_created (006_functions_and_triggers.sql:199-203)
- **Table:** auth.users
- **Timing:** AFTER INSERT
- **Function:** handle_new_user()

#### report_progress_after_insert (006_functions_and_triggers.sql:208-212)
- **Table:** report_sections
- **Timing:** AFTER INSERT
- **Function:** refresh_report_progress()

#### report_progress_after_update (006_functions_and_triggers.sql:214-218)
- **Table:** report_sections
- **Timing:** AFTER UPDATE
- **Function:** refresh_report_progress()

#### report_progress_after_delete (006_functions_and_triggers.sql:220-224)
- **Table:** report_sections
- **Timing:** AFTER DELETE
- **Function:** refresh_report_progress()

### Storage Buckets (Production)

- **avatars** (008_storage_buckets.sql:67-69) - Public
- **institution-assets** (008_storage_buckets.sql:72-74) - Public
- **organization-assets** (008_storage_buckets.sql:77-79) - Public
- **logbook-files** (008_storage_buckets.sql:82-84) - Private
- **report-exports** (008_storage_buckets.sql:87-89) - Private

---

## PHASE 3: CODE DATABASE DEPENDENCIES

### Tables Referenced in Code

| Table | File | Line | Operation | Columns Referenced |
|-------|------|------|------------|---------------------|
| activity_events | lib/activity-logger.ts | 37 | INSERT | user_id, event_type, event_category, event_name, properties, page, referrer |
| report_sections | hooks/useOfflineSync.ts | 102 | UPDATE | content, updated_at |
| weekly_logs | hooks/useOfflineSync.ts | 112 | UPDATE | description, updated_at |
| beta_users | lib/beta-access.ts | 46 | SELECT | status, user_id |
| beta_users | lib/beta-access.ts | 69 | SELECT | status, user_id |
| beta_users | lib/beta-access.ts | 95 | SELECT | status, user_id |
| beta_users | lib/beta-access.ts | 105 | INSERT | user_id, status, invited_at |
| beta_users | lib/beta-access.ts | 131 | UPDATE | status, approved_at |
| beta_users | lib/beta-access.ts | 160 | UPDATE | status, notes |
| beta_users | lib/beta-access.ts | 183 | SELECT | * |
| beta_users | lib/beta-access.ts | 228 | SELECT | onboarding_step, conversion_rate |
| beta_users | lib/beta-access.ts | 269 | UPDATE | metadata |
| analytics_events | lib/analytics.ts | 58 | INSERT | user_id, event_type, event_category, event_name, properties, page, referrer, user_agent |
| analytics_events | lib/analytics/funnel.ts | 46 | SELECT | * |
| analytics_events | lib/analytics/funnel.ts | 226 | INSERT | user_id, event_type, event_category |
| profiles | lib/analytics/funnel.ts | 59 | SELECT | * |
| profiles | lib/analytics/funnel.ts | 82 | SELECT | full_name, matric_number |
| profiles | lib/user-behavior.ts | 43 | SELECT | * |
| profiles | lib/user-behavior.ts | 119 | SELECT | full_name, matric_number, institution_id |
| profiles | lib/validation-scorecard.ts | 43 | SELECT | * |
| logbooks | lib/analytics/funnel.ts | 97 | SELECT | * |
| logbooks | lib/analytics/north-star.ts | 50 | SELECT | * |
| logbooks | lib/user-behavior.ts | 128 | SELECT | * |
| weekly_logs | lib/analytics/funnel.ts | 109 | SELECT | * |
| weekly_logs | lib/analytics/funnel.ts | 145 | SELECT | ai_summary |
| weekly_logs | lib/user-behavior.ts | 47 | SELECT | * |
| weekly_logs | lib/user-behavior.ts | 131 | SELECT | * |
| logbook_entries | lib/analytics/funnel.ts | 121 | SELECT | * |
| logbook_entries | lib/analytics/north-star.ts | 56 | SELECT | * |
| logbook_entries | lib/user-behavior.ts | 44 | SELECT | * |
| uploads | lib/analytics/funnel.ts | 133 | SELECT | * |
| uploads | lib/analytics/north-star.ts | 62 | SELECT | * |
| uploads | lib/user-behavior.ts | 45 | SELECT | * |
| reports | lib/analytics/funnel.ts | 158 | SELECT | * |
| reports | lib/analytics/north-star.ts | - | - | - |
| reports | lib/user-behavior.ts | 46 | SELECT | * |
| report_sections | lib/analytics/funnel.ts | 140 | SELECT | * |
| report_sections | lib/user-behavior.ts | 140 | SELECT | * |
| payments | lib/analytics/funnel.ts | 182 | SELECT | status |
| payments | lib/reliability-tests.ts | 152 | INSERT | user_id, amount, currency, status |
| payments | lib/reliability-tests.ts | 180 | DELETE | reference |
| payments | lib/payments/metrics.ts | - | - | - |
| payments | lib/payment-monitoring.ts | - | - | - |
| report_versions | lib/analytics/funnel.ts | 170 | SELECT | * |
| report_versions | lib/user-behavior.ts | 147 | SELECT | * |
| feedback | components/feedback/FeedbackButton.tsx | 33 | INSERT | user_id, type, message, page |
| report_quality | lib/report-quality.ts | 35 | INSERT | user_id, report_version_id, edit_level, satisfaction_score, feedback_text |
| activity_events | lib/analytics/north-star.ts | 30 | SELECT | * |
| activity_events | lib/analytics/north-star.ts | 37 | SELECT | * |
| activity_events | lib/analytics/north-star.ts | 44 | SELECT | * |
| activity_events | lib/analytics/user-journey.ts | 157 | INSERT | user_id, event_type, event_category, page, referrer, user_agent |
| activity_events | lib/analytics/user-journey.ts | 180 | INSERT | user_id, event_type, event_category |
| activity_events | lib/analytics/retention.ts | 138 | INSERT | user_id, event_type, event_category |
| activity_events | lib/analytics/onboarding.ts | 187 | INSERT | user_id, event_type, event_category |
| activity_events | lib/analytics/north-star.ts | 126 | INSERT | user_id, event_type, event_category |
| activity_events | lib/analytics/funnel.ts | 226 | INSERT | user_id, event_type, event_category |
| activity_events | lib/user-behavior.ts | 82 | INSERT | user_id, event_type, event_category |
| activity_events | app/api/uploads/route.ts | 44 | INSERT | user_id, action, entity_type |
| activity_events | app/api/uploads/route.ts | 109 | INSERT | user_id, action, entity_type |
| activity_events | lib/monitoring/failure-detection.ts | 165 | INSERT | user_id, event_type, event_category |
| activity_events | lib/payments/metrics.ts | 116 | INSERT | user_id, event_type, event_category |
| activity_events | lib/payments/metrics.ts | 139 | INSERT | user_id, event_type, event_category |
| activity_events | lib/payments/metrics.ts | 162 | INSERT | user_id, event_type, event_category |
| activity_events | lib/payment-monitoring.ts | 105 | INSERT | user_id, event_type, event_category |
| activity_events | lib/payment-monitoring.ts | 131 | INSERT | user_id, event_type, event_category |
| activity_events | lib/payment-monitoring.ts | 157 | INSERT | user_id, event_type, event_category |
| profiles | src/app/dashboard/profile/page.tsx | 52 | SELECT | full_name, institution, faculty, department, current_level |
| profiles | src/app/onboarding/page.tsx | 42 | SELECT | * |
| profiles | src/app/onboarding/page.tsx | 99 | UPDATE | full_name, matric_number, institution_id, faculty_id, department_id, current_level, updated_at |
| profiles | src/app/dashboard/page.tsx | 53 | SELECT | *, institution, faculty, department |
| logbooks | src/app/onboarding/page.tsx | 50 | SELECT | * |
| weekly_logs | src/app/dashboard/logbook/page.tsx | 59 | SELECT | * |
| reports | src/app/dashboard/reports/page.tsx | 25 | SELECT | * |
| reports | src/app/dashboard/page.tsx | 80 | SELECT | * |
| activity_events | src/app/dashboard/page.tsx | 108 | SELECT | * |
| activity_events | src/app/admin/page.tsx | 59 | SELECT | * |
| activity_events | src/app/admin/page.tsx | 62 | SELECT | * |
| activity_events | src/app/admin/page.tsx | 87 | SELECT | * |
| activity_events | src/app/admin/page.tsx | 88 | SELECT | * |
| activity_events | src/app/admin/page.tsx | 89 | SELECT | * |
| weekly_logs | src/app/admin/page.tsx | 66 | SELECT | * |
| feedback | src/app/admin/page.tsx | 79 | SELECT | status |
| feedback | src/app/admin/page.tsx | 80 | SELECT | status |
| analytics_events | src/app/admin/page.tsx | 136 | SELECT | event_name, event_type, properties |

### RPC Functions Referenced in Code

| Function | File | Line | Parameters |
|----------|------|------|------------|
| track_onboarding_event | lib/beta-access.ts | 206 | p_user_id, p_event_type |

---

## PHASE 4: SCHEMA DRIFT ANALYSIS

### A) Code Referencing Columns That Do Not Exist in Production

| Table | Column | File | Line | Operation |
|-------|--------|------|------|------------|
| profiles | current_level | src/app/dashboard/profile/page.tsx | 59 | SELECT |
| profiles | current_level | src/app/onboarding/page.tsx | 67 | SELECT |
| profiles | current_level | src/app/onboarding/page.tsx | 107 | UPDATE |
| profiles | current_level | src/app/dashboard/page.tsx | 74 | SELECT |
| profiles | current_level | src/app/dashboard/page.tsx | 93 | SELECT |
| profiles | current_level | src/app/dashboard/page.tsx | 210 | DISPLAY |

**Evidence:**
- Production profiles table (003_core_tables.sql:75-94) does NOT contain current_level column
- Code expects current_level column in multiple locations

### B) Code Referencing Tables That Do Not Exist in Production

| Table | File | Line | Operation |
|-------|------|------|------------|
| weekly_logs | hooks/useOfflineSync.ts | 112 | UPDATE |
| weekly_logs | lib/analytics/funnel.ts | 109 | SELECT |
| weekly_logs | lib/analytics/funnel.ts | 145 | SELECT |
| weekly_logs | lib/user-behavior.ts | 47 | SELECT |
| weekly_logs | lib/user-behavior.ts | 131 | SELECT |
| weekly_logs | src/app/dashboard/logbook/page.tsx | 59 | SELECT |
| weekly_logs | src/app/admin/page.tsx | 66 | SELECT |
| analytics_events | lib/analytics.ts | 58 | INSERT |
| analytics_events | lib/analytics/funnel.ts | 46 | SELECT |
| analytics_events | lib/analytics/funnel.ts | 226 | INSERT |
| analytics_events | lib/analytics/user-journey.ts | 157 | INSERT |
| analytics_events | lib/analytics/user-journey.ts | 180 | INSERT |
| analytics_events | lib/analytics/retention.ts | 138 | INSERT |
| analytics_events | lib/analytics/onboarding.ts | 187 | INSERT |
| analytics_events | lib/analytics/north-star.ts | 126 | INSERT |
| analytics_events | lib/analytics/funnel.ts | 226 | INSERT |
| analytics_events | lib/user-behavior.ts | 82 | INSERT |
| analytics_events | app/api/uploads/route.ts | 44 | INSERT |
| analytics_events | app/api/uploads/route.ts | 109 | INSERT |
| analytics_events | lib/monitoring/failure-detection.ts | 165 | INSERT |
| analytics_events | lib/payments/metrics.ts | 116 | INSERT |
| analytics_events | lib/payments/metrics.ts | 139 | INSERT |
| analytics_events | lib/payments/metrics.ts | 162 | INSERT |
| analytics_events | lib/payment-monitoring.ts | 105 | INSERT |
| analytics_events | lib/payment-monitoring.ts | 131 | INSERT |
| analytics_events | lib/payment-monitoring.ts | 157 | INSERT |
| beta_users | lib/beta-access.ts | 46 | SELECT |
| beta_users | lib/beta-access.ts | 69 | SELECT |
| beta_users | lib/beta-access.ts | 95 | SELECT |
| beta_users | lib/beta-access.ts | 105 | INSERT |
| beta_users | lib/beta-access.ts | 131 | UPDATE |
| beta_users | lib/beta-access.ts | 160 | UPDATE |
| beta_users | lib/beta-access.ts | 183 | SELECT |
| beta_users | lib/beta-access.ts | 228 | SELECT |
| beta_users | lib/beta-access.ts | 269 | UPDATE |
| beta_users | src/app/admin/page.tsx | 56 | SELECT |
| feedback | components/feedback/FeedbackButton.tsx | 33 | INSERT |
| feedback | src/app/admin/page.tsx | 79 | SELECT |
| feedback | src/app/admin/page.tsx | 80 | SELECT |
| report_quality | lib/report-quality.ts | 35 | INSERT |
| activity_events | lib/activity-logger.ts | 37 | INSERT |
| activity_events | src/app/dashboard/page.tsx | 108 | SELECT |
| activity_events | src/app/admin/page.tsx | 59 | SELECT |
| activity_events | src/app/admin/page.tsx | 62 | SELECT |
| activity_events | src/app/admin/page.tsx | 87 | SELECT |
| activity_events | src/app/admin/page.tsx | 88 | SELECT |
| activity_events | src/app/admin/page.tsx | 89 | SELECT |

**Evidence:**
- Production schema (001-011) does NOT contain: weekly_logs, analytics_events, beta_users, feedback, report_quality, activity_events
- These tables are created in migrations 012+:
  - analytics_events, beta_users, feedback: 015_analytics_and_feedback_infrastructure.sql
  - report_quality: 016_report_quality_and_feedback_enhancements.sql
  - activity_events: 20240615_create_activity_events.sql
  - weekly_logs: NOT PROVEN BY CODEBASE EVIDENCE - table never created in any migration

### C) Functions Referenced by Code But Missing in Production

| Function | File | Line | Status |
|----------|------|------|--------|
| track_onboarding_event | lib/beta-access.ts | 206 | MISSING - Created in 20240620_beta_onboarding_pipeline.sql |

**Evidence:**
- Production functions (001-011) do NOT include track_onboarding_event
- Function is created in migration 20240620_beta_onboarding_pipeline.sql:65-110

### D) Triggers Expected by Code But Missing in Production

None identified - code does not directly reference triggers.

### E) Foreign Keys Expected But Absent

None identified - code does not directly reference foreign key constraints.

---

## PHASE 5: PROFILE CREATION FLOW ANALYSIS

### 1. Which handle_new_user() is active?

**Answer:** The version defined in 006_functions_and_triggers.sql:38-76

**Evidence:**
- Production has migrations 001-011 only
- Migration 006_functions_and_triggers.sql:38-76 defines handle_new_user()
- Migration 017_fix_profile_trigger.sql exists but is NOT in production (migration 017 > 011)
- Migration 20240615_create_profiles.sql:58-109 defines a different handle_new_user() but is NOT in production

### 2. Where is it defined?

**Answer:** supabase/migrations/006_functions_and_triggers.sql:38-76

**Evidence:**
- File: 006_functions_and_triggers.sql
- Lines: 38-76
- Function signature: create or replace function public.handle_new_user()

### 3. What columns does it insert?

**Answer:** id, full_name, avatar_url, role, created_at, updated_at

**Evidence:**
- 006_functions_and_triggers.sql:46-52
```sql
insert into public.profiles (
    id,
    full_name,
    avatar_url,
    role,
    created_at,
    updated_at
)
```

### 4. Do those columns exist in production?

**Answer:** YES - All columns exist in production profiles table

**Evidence:**
- Production profiles table (003_core_tables.sql:75-94) contains:
  - id (line 76)
  - full_name (line 79)
  - avatar_url (line 80)
  - role (line 91)
  - created_at (line 92)
  - updated_at (line 93)

### 5. Can signup fail?

**Answer:** NO - The trigger uses ON CONFLICT (id) DO NOTHING

**Evidence:**
- 006_functions_and_triggers.sql:71 - `on conflict (id) do nothing;`
- If profile already exists, trigger does nothing and returns new
- Signup will succeed even if profile creation fails

### 6. Can profile creation fail?

**Answer:** YES - But signup will still succeed

**Evidence:**
- 006_functions_and_triggers.sql:38-76 does NOT have exception handling
- If INSERT fails (e.g., constraint violation), the trigger will raise an error
- However, migration 017_fix_profile_trigger.sql adds exception handling (NOT in production)
- In production, if profile creation fails, the error will propagate but auth.users insert will still succeed (trigger is AFTER INSERT)

### 7. Can profile page crash?

**Answer:** YES - Due to missing current_level column

**Evidence:**
- src/app/dashboard/profile/page.tsx:59 selects current_level column
- src/app/dashboard/profile/page.tsx:93 uses current_level
- src/app/dashboard/profile/page.tsx:210 displays current_level
- Production profiles table does NOT have current_level column
- Query will fail with: column "current_level" does not exist

---

## PHASE 6: DASHBOARD ROUTES ANALYSIS

### /dashboard

**Required Tables:**
- profiles (src/app/dashboard/page.tsx:53)
- institutions (src/app/dashboard/page.tsx:57)
- faculties (src/app/dashboard/page.tsx:58)
- departments (src/app/dashboard/page.tsx:59)
- reports (src/app/dashboard/page.tsx:80)
- activity_events (src/app/dashboard/page.tsx:108)

**Required Columns:**
- profiles: full_name, current_level (MISSING in production)
- reports: is_active (MISSING in production)
- activity_events: event_type, event_title, event_description, created_at

**Required Functions:** None

**Required Policies:** Standard RLS policies

**Production Verification:**
- profiles: EXISTS - but missing current_level column
- institutions: EXISTS
- faculties: EXISTS
- departments: EXISTS
- reports: EXISTS - but missing is_active column
- activity_events: MISSING - created in 20240615_create_activity_events.sql

**Status:** BROKEN - Missing tables and columns

### /dashboard/profile

**Required Tables:**
- profiles (src/app/dashboard/profile/page.tsx:52)
- institutions (src/app/dashboard/profile/page.tsx:56)
- faculties (src/app/dashboard/profile/page.tsx:57)
- departments (src/app/dashboard/profile/page.tsx:58)

**Required Columns:**
- profiles: full_name, current_level (MISSING in production)

**Required Functions:** None

**Required Policies:** Standard RLS policies

**Production Verification:**
- profiles: EXISTS - but missing current_level column
- institutions: EXISTS
- faculties: EXISTS
- departments: EXISTS

**Status:** BROKEN - Missing current_level column

### /dashboard/logbook

**Required Tables:**
- weekly_logs (src/app/dashboard/logbook/page.tsx:59)

**Required Columns:** None specified

**Required Functions:** None

**Required Policies:** Standard RLS policies

**Production Verification:**
- weekly_logs: MISSING - NOT PROVEN BY CODEBASE EVIDENCE (never created in any migration)

**Status:** BROKEN - Table does not exist

### /dashboard/reports

**Required Tables:**
- reports (src/app/dashboard/reports/page.tsx:25)

**Required Columns:** None specified

**Required Functions:** None

**Required Policies:** Standard RLS policies

**Production Verification:**
- reports: EXISTS

**Status:** WORKING

### /dashboard/settings

**Required Tables:** None referenced in code

**Status:** NOT PROVEN BY CODEBASE EVIDENCE

---

## PHASE 7: RLS AUDIT

### Tables with RLS Enabled in Production

All tables have RLS enabled (007_rls.sql:6-23):
- profiles
- institutions
- faculties
- departments
- training_organizations
- organization_departments
- organization_knowledge
- logbooks
- logbook_entries
- logbook_evidence
- reports
- report_sections
- report_versions
- report_logbook_entries
- chat_messages
- payments
- uploads
- activity_logs
- report_exports (008_storage_buckets.sql:26)
- report_access (010_paystack_integration.sql:47)
- report_generation_jobs (011_report_generation_engine.sql:45)

### Missing Policies

No missing policies identified - all tables have appropriate policies defined in 007_rls.sql.

### Policies Referenced by Code But Absent

None identified - code does not directly reference specific RLS policies.

---

## PHASE 8: MIGRATION SAFETY ANALYSIS (012+)

### 012_fix_report_versions_schema.sql

**Classification:** SAFE

**Risk:** LOW

**Changes:** Adds 8 columns to report_versions table (user_id, pdf_path, page_count, amount_paid, currency, payment_reference, payment_status, export_type)

**Dependencies:** None

**Data Loss Risk:** NO

**Rollback:** DROP columns added

**Execution Time:** < 1 minute

**Apply Order:** 1

**Can be applied immediately:** YES

### 013_add_cascading_deletes.sql

**Classification:** BROKEN

**Risk:** HIGH

**Changes:** Adds ON DELETE CASCADE to uploads.report_id and weekly_logs.report_id

**Dependencies:** weekly_logs table (DOES NOT EXIST)

**Data Loss Risk:** NO

**Issue:** References non-existent weekly_logs table (line 19)

**Can be applied immediately:** NO - Will fail due to missing weekly_logs table

**Fix Required:** Create weekly_logs table first or remove weekly_logs references

### 014_clean_profile_schema.sql

**Classification:** BROKEN

**Risk:** HIGH

**Changes:** Drops columns from profiles (subscription_plan, academic_session, siwes_coordinator_name, supervisor_name), adds columns to report_metadata

**Dependencies:** report_metadata table (DOES NOT EXIST)

**Data Loss Risk:** YES - Drops columns

**Issue:** References non-existent report_metadata table (line 22)

**Can be applied immediately:** NO - Will fail due to missing report_metadata table

**Fix Required:** Create report_metadata table first or remove report_metadata references

### 015_analytics_and_feedback_infrastructure.sql

**Classification:** SAFE

**Risk:** LOW

**Changes:** Creates analytics_events, feedback, beta_users tables

**Dependencies:** None

**Data Loss Risk:** NO

**Rollback:** DROP tables created

**Execution Time:** < 2 minutes

**Apply Order:** 2

**Can be applied immediately:** YES

### 016_report_quality_and_feedback_enhancements.sql

**Classification:** SAFE

**Risk:** LOW

**Changes:** Adds columns to feedback, creates report_quality table

**Dependencies:** feedback table (from 015)

**Data Loss Risk:** NO

**Rollback:** DROP columns and table

**Execution Time:** < 1 minute

**Apply Order:** 3 (after 015)

**Can be applied immediately:** YES (after 015)

### 017_fix_profile_trigger.sql

**Classification:** SAFE - CRITICAL FIX

**Risk:** LOW

**Changes:** Drops and recreates handle_new_user() function with exception handling

**Dependencies:** None

**Data Loss Risk:** NO

**Rollback:** Revert to previous function version

**Execution Time:** < 1 minute

**Apply Order:** 4

**Can be applied immediately:** YES

**Critical:** This fixes the handle_new_user() function to match production schema

### 20240615_add_is_active_to_reports.sql

**Classification:** SAFE

**Risk:** LOW

**Changes:** Adds is_active column to reports, creates ensure_single_active_report() function and trigger

**Dependencies:** None

**Data Loss Risk:** NO

**Rollback:** DROP column, function and trigger

**Execution Time:** < 1 minute

**Apply Order:** 5

**Can be applied immediately:** YES

### 20240615_create_activity_events.sql

**Classification:** SAFE

**Risk:** LOW

**Changes:** Creates activity_events table and log_activity_event() function

**Dependencies:** None

**Data Loss Risk:** NO

**Rollback:** DROP table and function

**Execution Time:** < 1 minute

**Apply Order:** 6

**Can be applied immediately:** YES

### 20240615_create_institutions_hierarchy.sql

**Classification:** CONFLICTING

**Risk:** HIGH

**Changes:** Recreates institutions, faculties, departments tables with different schema

**Dependencies:** None

**Data Loss Risk:** YES - Will drop existing tables

**Issue:** Tables already exist in production (003_core_tables.sql)

**Conflict:** Schema differs from production:
- Adds columns: code, type, website, is_active, updated_at
- Changes department FK to include institution_id
- Changes RLS policies

**Can be applied immediately:** NO - Will conflict with existing tables

**Recommendation:** Create ALTER migrations instead of recreating tables

### 20240615_create_profiles.sql

**Classification:** CONFLICTING

**Risk:** HIGH

**Changes:** Recreates profiles table with different schema and handle_new_user() function

**Dependencies:** institutions, faculties, departments, training_organizations tables

**Data Loss Risk:** YES - Will drop existing table

**Issue:** Table already exists in production (003_core_tables.sql)

**Conflict:** Schema differs from production:
- Adds columns: program, phone, profile_image_url, is_active, training_organization_id, training_department_id
- Removes columns: matric_number, academic_session, siwes_coordinator_name, supervisor_name, avatar_url
- Redefines handle_new_user() function (BROKEN - inserts into non-existent columns)

**Can be applied immediately:** NO - Will conflict with existing table and break trigger

**Recommendation:** Create ALTER migrations instead of recreating table

### 20240615_create_training_organizations.sql

**Classification:** CONFLICTING

**Risk:** HIGH

**Changes:** Recreates training_organizations and organization_departments tables with different schema

**Dependencies:** None

**Data Loss Risk:** YES - Will drop existing tables

**Issue:** Tables already exist in production (003_core_tables.sql)

**Conflict:** Schema differs from production:
- Adds columns: type, industry, state, country, website, is_active, updated_at
- Changes RLS policies

**Can be applied immediately:** NO - Will conflict with existing tables

**Recommendation:** Create ALTER migrations instead of recreating tables

### 20240615_create_uploads.sql

**Classification:** CONFLICTING

**Risk:** HIGH

**Changes:** Recreates uploads table with different schema

**Dependencies:** reports table

**Data Loss Risk:** YES - Will drop existing table

**Issue:** Table already exists in production (003_core_tables.sql)

**Conflict:** Schema differs from production:
- Adds columns: report_id, file_name, mime_type, file_size, metadata
- Removes columns: file_url, linked_to, file_type (renamed)
- Changes column names and structure

**Can be applied immediately:** NO - Will conflict with existing table

**Recommendation:** Create ALTER migrations instead of recreating table

### 20240620_beta_onboarding_pipeline.sql

**Classification:** SAFE

**Risk:** LOW

**Changes:** Adds columns to beta_users, creates update_beta_onboarding_step() function and trigger, creates track_onboarding_event() function

**Dependencies:** beta_users table (from 015)

**Data Loss Risk:** NO

**Rollback:** DROP columns, functions and triggers

**Execution Time:** < 1 minute

**Apply Order:** 7 (after 015)

**Can be applied immediately:** YES (after 015)

---

## PHASE 9: FINAL TRUTH REPORT

### 1. Current Production Reality

**Production Schema:** Defined by migrations 001-011 only

**Tables in Production (17):**
- institutions
- faculties
- departments
- training_organizations
- organization_departments
- organization_knowledge
- profiles
- logbooks
- logbook_entries
- logbook_evidence
- reports
- report_sections
- report_versions
- report_logbook_entries
- chat_messages
- payments
- uploads
- activity_logs
- report_exports
- report_access
- report_generation_jobs

**Functions in Production (12):**
- is_admin()
- update_updated_at_column()
- handle_new_user()
- calculate_report_progress()
- refresh_report_progress()
- build_report_context()
- initialize_report_sections()
- create_generation_job()
- update_generation_job_status()
- get_generation_analytics()
- has_report_access()
- is_report_unlocked()

**Triggers in Production (11):**
- profiles_updated_at
- training_organizations_updated_at
- organization_knowledge_updated_at
- logbooks_updated_at
- logbook_entries_updated_at
- reports_updated_at
- report_sections_updated_at
- on_auth_user_created
- report_progress_after_insert
- report_progress_after_update
- report_progress_after_delete

**Storage Buckets in Production (5):**
- avatars
- institution-assets
- organization-assets
- logbook-files
- report-exports

### 2. Current Code Reality

**Tables Expected by Code (24):**
- All production tables PLUS:
- weekly_logs (MISSING - never created)
- analytics_events (MISSING - created in 015)
- beta_users (MISSING - created in 015)
- feedback (MISSING - created in 015)
- report_quality (MISSING - created in 016)
- activity_events (MISSING - created in 20240615_create_activity_events)

**Columns Expected by Code:**
- profiles.current_level (MISSING - never added)

**Functions Expected by Code:**
- track_onboarding_event (MISSING - created in 20240620_beta_onboarding_pipeline)

### 3. Exact Schema Drift

**Missing Tables (6):**
1. weekly_logs - NOT PROVEN BY CODEBASE EVIDENCE (never created in any migration)
2. analytics_events - Created in 015_analytics_and_feedback_infrastructure.sql
3. beta_users - Created in 015_analytics_and_feedback_infrastructure.sql
4. feedback - Created in 015_analytics_and_feedback_infrastructure.sql
5. report_quality - Created in 016_report_quality_and_feedback_enhancements.sql
6. activity_events - Created in 20240615_create_activity_events.sql

**Missing Columns (1):**
1. profiles.current_level - NOT PROVEN BY CODEBASE EVIDENCE (never added in any migration)

**Missing Functions (1):**
1. track_onboarding_event - Created in 20240620_beta_onboarding_pipeline.sql

**Conflicting Tables (4):**
1. institutions - Recreated in 20240615_create_institutions_hierarchy.sql
2. profiles - Recreated in 20240615_create_profiles.sql
3. training_organizations - Recreated in 20240615_create_training_organizations.sql
4. uploads - Recreated in 20240615_create_uploads.sql

**Broken Migrations (2):**
1. 013_add_cascading_deletes.sql - References non-existent weekly_logs table
2. 014_clean_profile_schema.sql - References non-existent report_metadata table

### 4. Broken Features

**CRITICAL:**
1. Onboarding flow - References profiles.current_level (MISSING)
2. Profile page - References profiles.current_level (MISSING)
3. Logbook page - References weekly_logs table (MISSING)
4. Analytics system - References analytics_events table (MISSING)
5. Beta access control - References beta_users table (MISSING)
6. Feedback system - References feedback table (MISSING)
7. Activity tracking - References activity_events table (MISSING)

**HIGH:**
8. Dashboard - References activity_events table (MISSING)
9. Admin dashboard - References analytics_events, beta_users, feedback tables (MISSING)

**MEDIUM:**
10. Report quality tracking - References report_quality table (MISSING)

### 5. Working Features

**WORKING:**
1. User signup - handle_new_user() trigger works correctly
2. Report listing - /dashboard/reports works
3. Basic profile display - /dashboard/profile works (except current_level display)
4. Auth system - Works independently of schema

### 6. Missing Tables

1. weekly_logs - NOT PROVEN BY CODEBASE EVIDENCE
2. analytics_events - Created in 015_analytics_and_feedback_infrastructure.sql:6-18
3. beta_users - Created in 015_analytics_and_feedback_infrastructure.sql:33-43
4. feedback - Created in 015_analytics_and_feedback_infrastructure.sql:21-30
5. report_quality - Created in 016_report_quality_and_feedback_enhancements.sql:19-27
6. activity_events - Created in 20240615_create_activity_events.sql:5-16

### 7. Missing Columns

1. profiles.current_level - NOT PROVEN BY CODEBASE EVIDENCE

### 8. Missing Policies

None - All tables have appropriate RLS policies.

### 9. Missing Functions

1. track_onboarding_event - Created in 20240620_beta_onboarding_pipeline.sql:65-110

### 10. Recommended Migration Order

**SAFE MIGRATIONS (Apply in Order):**
1. 015_analytics_and_feedback_infrastructure.sql - Creates analytics_events, beta_users, feedback
2. 016_report_quality_and_feedback_enhancements.sql - Creates report_quality (depends on 015)
3. 017_fix_profile_trigger.sql - Fixes handle_new_user() with exception handling
4. 20240615_add_is_active_to_reports.sql - Adds is_active to reports
5. 20240615_create_activity_events.sql - Creates activity_events
6. 20240620_beta_onboarding_pipeline.sql - Enhances beta_users (depends on 015)
7. 012_fix_report_versions_schema.sql - Adds columns to report_versions

**BROKEN MIGRATIONS (Must Fix Before Applying):**
1. 013_add_cascading_deletes.sql - Fix: Create weekly_logs table first or remove weekly_logs references
2. 014_clean_profile_schema.sql - Fix: Create report_metadata table first or remove report_metadata references

**CONFLICTING MIGRATIONS (Skip and Create ALTER Migrations):**
1. 20240615_create_institutions_hierarchy.sql - Create ALTER migration instead
2. 20240615_create_profiles.sql - Create ALTER migration instead
3. 20240615_create_training_organizations.sql - Create ALTER migration instead
4. 20240615_create_uploads.sql - Create ALTER migration instead

**MISSING ITEMS (Must Create):**
1. weekly_logs table - Create new migration
2. profiles.current_level column - Create new migration
3. report_metadata table - Create new migration (if needed for 014)

---

## CONCLUSION

**Overall Assessment:** CRITICAL

**Production Status:** BROKEN

**Code Compatibility:** BROKEN

**Immediate Action Required:** YES

**Critical Issues:**
- 6 tables missing that code expects
- 1 column missing that code expects
- 1 function missing that code expects
- 4 migrations conflicting with production
- 2 migrations broken due to missing dependencies

**Recommendation:**
1. Apply 7 safe migrations in order
2. Fix or skip 2 broken migrations
3. Create ALTER migrations for 4 conflicting migrations
4. Create missing tables and columns

**Estimated Time to Fix:** 2-3 hours

**Risk if Not Fixed:** Application will fail to function in production

---

**END OF FORENSIC AUDIT**
