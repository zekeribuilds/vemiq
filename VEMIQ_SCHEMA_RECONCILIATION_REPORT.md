# VEMIQ SCHEMA RECONCILIATION AUDIT REPORT
**Generated:** 2026-07-28
**Project ID:** zarrheqpverayovnzynv
**Status:** CRITICAL DRIFT DETECTED

---

## EXECUTIVE SUMMARY

**Production Readiness Score:**
- Before: 2/10
- After: 2/10 (pending remediation)

**Critical Issues:** 8
**High Issues:** 12
**Medium Issues:** 5

**Production Verdict:** REJECT

The codebase has severe schema drift between database migrations and TypeScript types. Multiple tables exist in type definitions but not in the database, and vice versa. This will cause runtime errors and data inconsistency.

---

## PHASE 1: DATABASE INVENTORY

### Tables in Database (from migrations)

**Core Tables:**
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

**Analytics & Feedback:**
- report_exports
- report_access
- report_generation_jobs
- analytics_events
- feedback
- beta_users
- report_quality

### Enums
- user_role (student, admin)
- program_type (SWEP, SIWES)
- report_status (draft, completed)
- payment_status (pending, successful, failed)
- logbook_status (active, completed)
- source_type (text, voice, image, mixed)
- file_type (image, audio, pdf, document)
- chat_role (user, assistant)
- generation_status (pending, processing, completed, failed)

---

## PHASE 2: TYPE INVENTORY

### Tables in TypeScript Types (src/types/database.ts)

**Tables with type definitions:**
- profiles
- institutions
- faculties
- departments
- training_organizations
- organization_departments
- organization_submissions ⚠️
- organization_knowledge
- reports
- report_metadata ⚠️
- report_sections
- report_subsections ⚠️
- weekly_logs ⚠️
- weekly_log_images ⚠️
- chat_threads ⚠️
- chat_messages
- uploads
- report_versions
- payments
- user_settings ⚠️
- audit_logs ⚠️

⚠️ = Table exists in types but NOT in database migrations

---

## PHASE 3: DRIFT DETECTION

### CRITICAL DRIFT

#### 1. Tables in Types but NOT in Database

**weekly_logs**
- Location: src/types/database.ts:413-446
- Impact: HIGH - Used in multiple code files
- References found: 28 matches across 11 files
- Fix: Create migration or remove from types

**weekly_log_images**
- Location: src/types/database.ts:447-468
- Impact: HIGH - Referenced in code
- Fix: Create migration or remove from types

**organization_submissions**
- Location: src/types/database.ts:210-234
- Impact: MEDIUM
- Fix: Create migration or remove from types

**report_metadata**
- Location: src/types/database.ts:307-349
- Impact: CRITICAL - Referenced in migration 014
- Migration 014 attempts to add columns to this table but table doesn't exist
- Fix: Create migration for report_metadata table first

**report_subsections**
- Location: src/types/database.ts:385-412
- Impact: MEDIUM
- Fix: Create migration or remove from types

**chat_threads**
- Location: src/types/database.ts:469-487
- Impact: MEDIUM
- Fix: Create migration or remove from types

**user_settings**
- Location: src/types/database.ts:600-627
- Impact: MEDIUM
- Fix: Create migration or remove from types

**audit_logs**
- Location: src/types/database.ts:628-655
- Impact: MEDIUM - Different from activity_logs
- Fix: Create migration or remove from types

#### 2. Tables in Database but NOT in Types

**logbooks**
- Location: Migration 003_core_tables.sql:98-115
- Impact: CRITICAL - Used extensively in codebase
- References found: 88 matches across 21 files
- Fix: Add to TypeScript types

**logbook_entries**
- Location: Migration 003_core_tables.sql:117-133
- Impact: CRITICAL - Used extensively in codebase
- References found: 80 matches across 19 files
- Fix: Add to TypeScript types

**logbook_evidence**
- Location: Migration 003_core_tables.sql:135-147
- Impact: HIGH - Used in codebase
- References found: 14 matches across 3 files
- Fix: Add to TypeScript types

**report_exports**
- Location: Migration 008_storage_buckets.sql:6-22
- Impact: HIGH
- Fix: Add to TypeScript types

**report_access**
- Location: Migration 010_paystack_integration.sql:23-43
- Impact: HIGH
- Fix: Add to TypeScript types

**report_generation_jobs**
- Location: Migration 011_report_generation_engine.sql:15-41
- Impact: HIGH
- Fix: Add to TypeScript types

**analytics_events**
- Location: Migration 015_analytics_and_feedback_infrastructure.sql:6-18
- Impact: MEDIUM
- Fix: Add to TypeScript types

**feedback**
- Location: Migration 015_analytics_and_feedback_infrastructure.sql:21-30
- Impact: MEDIUM
- Fix: Add to TypeScript types

**beta_users**
- Location: Migration 015_analytics_and_feedback_infrastructure.sql:33-43
- Impact: MEDIUM
- Fix: Add to TypeScript types

**report_quality**
- Location: Migration 016_report_quality_and_feedback_enhancements.sql:19-27
- Impact: MEDIUM
- Fix: Add to TypeScript types

#### 3. Column Drift in Existing Tables

**profiles table:**
- Migration 014 removes: subscription_plan, academic_session, siwes_coordinator_name, supervisor_name
- Types still have: subscription_plan (line 24), academic_session (line 20)
- Types missing: role (exists in migration, not in types)
- Types have extra: email (line 15), phone_number (line 19), academic_level (line 20), onboarding_completed (line 25)
- Impact: CRITICAL

**reports table:**
- Migration uses: progress (integer)
- Types use: progress_percentage (line 275)
- Migration has: is_active (added in 20240615_add_is_active_to_reports.sql)
- Types missing: is_active
- Impact: HIGH

**uploads table:**
- Migration 013 adds: report_id (NOT NULL)
- Types have: report_id as nullable (line 514)
- Migration 013 adds: user_id (NOT NULL)
- Types have: user_id as nullable (line 513)
- Types have extra: file_name, file_url, uploaded_at
- Migration has: file_url, linked_to, created_at
- Impact: CRITICAL

#### 4. Migration 014 Schema Error

**Issue:** Migration 014_clean_profile_schema.sql attempts to add columns to report_metadata table that doesn't exist

```sql
-- Line 22-29 of migration 014
alter table public.report_metadata
add column if not exists academic_session text;

alter table public.report_metadata
add column if not exists coordinator_name text;

alter table public.report_metadata
add column if not exists supervisor_name text;
```

**Impact:** Migration will fail or do nothing
**Fix:** Create report_metadata table before running this migration

---

## PHASE 4: CODEBASE REFERENCE AUDIT

### Critical Database References Found

**logbooks table:**
- Used in: 21 files
- Key files: dashboard/logbook pages, analytics libraries, admin page
- Status: MISSING FROM TYPES

**logbook_entries table:**
- Used in: 19 files
- Key files: dashboard/logbook pages, AI services, analytics
- Status: MISSING FROM TYPES

**weekly_logs table:**
- Used in: 11 files
- Key files: analytics libraries, admin page, validation
- Status: MISSING FROM DATABASE

**activity_logs table:**
- Used in: 8 files
- Key files: API routes, activity logger, analytics
- Status: EXISTS IN DATABASE

**report_metadata table:**
- Referenced in: migration 014
- Status: MISSING FROM DATABASE

### API Routes Audit

**src/app/api/upload/route.ts:**
- Line 82-87: Inserts into uploads table with columns: user_id, file_url, file_type, linked_to
- Migration 003_core_tables.sql has: user_id, file_url, file_type, linked_to, created_at
- Migration 013 adds: report_id (NOT NULL)
- Issue: API doesn't include report_id (now required)
- Impact: CRITICAL - Will fail on insert

**src/app/api/ai/chat/route.ts:**
- No database queries - safe

**src/app/api/ai/generate-report/route.ts:**
- No database queries - safe

---

## PHASE 5: SERVICE AUDIT

### Critical Issues

**lib/user-behavior.ts:**
- Line 44: Queries logbook_entries (exists in DB, missing from types)
- Line 47: Queries weekly_logs (missing from DB, exists in types)
- Impact: HIGH

**lib/validation-scorecard.ts:**
- Line 48: Queries logbooks (exists in DB, missing from types)
- Impact: HIGH

**lib/analytics/*.ts:**
- Multiple files query logbooks, logbook_entries, weekly_logs
- Mixed state of table existence
- Impact: HIGH

---

## PHASE 6: FRONTEND AUDIT

### Component Issues

**app/dashboard/logbook/[id]/page.tsx:**
- Queries logbooks table (exists in DB, missing from types)
- Impact: Type errors will occur

**app/dashboard/logbook/create/page.tsx:**
- Inserts into logbooks table (exists in DB, missing from types)
- Impact: Type errors will occur

**app/onboarding/page.tsx:**
- Line 50: Queries logbooks table
- Impact: Type errors will occur

**components/dashboard/Topbar.tsx:**
- Line 24: Queries profiles table
- Uses columns that may not exist (email, phone_number, academic_level)
- Impact: Runtime errors possible

---

## PHASE 7: REMEDIATION PLAN

### Priority 1: Critical - Block Production

1. **Create missing database tables:**
   - Create migration for report_metadata table
   - Create migration for weekly_logs table OR remove from code
   - Create migration for weekly_log_images table OR remove from code

2. **Fix uploads table schema:**
   - Update API routes to include report_id
   - Update TypeScript types to match migration 013

3. **Fix profiles table schema:**
   - Update TypeScript types to match migration 014
   - Remove non-existent columns from types
   - Add missing role column

4. **Fix reports table schema:**
   - Update TypeScript types to use progress instead of progress_percentage
   - Add is_active column to types

### Priority 2: High - Block Development

5. **Add missing tables to TypeScript types:**
   - logbooks
   - logbook_entries
   - logbook_evidence
   - report_exports
   - report_access
   - report_generation_jobs
   - analytics_events
   - feedback
   - beta_users
   - report_quality

6. **Remove or create tables:**
   - organization_submissions
   - report_subsections
   - chat_threads
   - user_settings
   - audit_logs

### Priority 3: Medium - Technical Debt

7. **Regenerate Supabase types:**
   - Run: npx supabase gen types typescript --project-id zarrheqpverayovnzynv
   - Replace manual types with generated types

8. **Fix migration dependencies:**
   - Ensure migration 014 runs after report_metadata table creation
   - Fix migration 013 to check if weekly_logs exists before adding constraint

---

## PHASE 8: AUTO REMEDIATION STATUS

**Status:** NOT STARTED
**Reason:** Critical schema issues require manual decision on:
- Whether to create weekly_logs table or remove from code
- Whether to create other missing tables or remove from code
- Migration dependency order fixes

---

## PHASE 9: TYPE GENERATION STATUS

**Status:** PENDING
**Command to run:**
```bash
npx supabase gen types typescript --project-id zarrheqpverayovnzynv > src/types/database.generated.ts
```

---

## PHASE 10: BUILD VERIFICATION STATUS

**Status:** NOT STARTED
**Expected errors:** Multiple TypeScript type errors due to schema drift

---

## PHASE 11: FINAL VERDICT

### Production Readiness: REJECT

**Blocking Issues:**
1. Migration 014 will fail (references non-existent table)
2. Upload API will fail (missing required column)
3. Type errors throughout codebase
4. Data inconsistency between DB and types

### Required Actions Before Production:

1. Decide on weekly_logs table fate (create or remove)
2. Create report_metadata table migration
3. Fix all schema drift
4. Regenerate types from database
5. Regenerate types from database
6. Fix all API routes to match schema
7. Run full build verification
8. Test all database operations

### Estimated Remediation Time: 4-6 hours

---

## APPENDIX: COMPLETE TABLE COMPARISON

| Table | In DB | In Types | Status | Action |
|-------|-------|---------|--------|--------|
| institutions | ✅ | ✅ | OK | None |
| faculties | ✅ | ✅ | OK | None |
| departments | ✅ | ✅ | OK | None |
| training_organizations | ✅ | ✅ | OK | None |
| organization_departments | ✅ | ✅ | OK | None |
| organization_knowledge | ✅ | ✅ | OK | None |
| profiles | ✅ | ✅ | ⚠️ DRIFT | Fix columns |
| logbooks | ✅ | ❌ | ⚠️ MISSING | Add to types |
| logbook_entries | ✅ | ❌ | ⚠️ MISSING | Add to types |
| logbook_evidence | ✅ | ❌ | ⚠️ MISSING | Add to types |
| reports | ✅ | ✅ | ⚠️ DRIFT | Fix columns |
| report_sections | ✅ | ✅ | OK | None |
| report_versions | ✅ | ✅ | ⚠️ DRIFT | Fix columns |
| report_logbook_entries | ✅ | ❌ | ⚠️ MISSING | Add to types |
| chat_messages | ✅ | ✅ | OK | None |
| payments | ✅ | ✅ | ⚠️ DRIFT | Fix columns |
| uploads | ✅ | ✅ | ⚠️ DRIFT | Fix columns |
| activity_logs | ✅ | ❌ | ⚠️ MISSING | Add to types |
| report_exports | ✅ | ❌ | ⚠️ MISSING | Add to types |
| report_access | ✅ | ❌ | ⚠️ MISSING | Add to types |
| report_generation_jobs | ✅ | ❌ | ⚠️ MISSING | Add to types |
| analytics_events | ✅ | ❌ | ⚠️ MISSING | Add to types |
| feedback | ✅ | ❌ | ⚠️ MISSING | Add to types |
| beta_users | ✅ | ❌ | ⚠️ MISSING | Add to types |
| report_quality | ✅ | ❌ | ⚠️ MISSING | Add to types |
| weekly_logs | ❌ | ✅ | ⚠️ PHANTOM | Create or remove |
| weekly_log_images | ❌ | ✅ | ⚠️ PHANTOM | Create or remove |
| organization_submissions | ❌ | ✅ | ⚠️ PHANTOM | Create or remove |
| report_metadata | ❌ | ✅ | ⚠️ PHANTOM | Create or remove |
| report_subsections | ❌ | ✅ | ⚠️ PHANTOM | Create or remove |
| chat_threads | ❌ | ✅ | ⚠️ PHANTOM | Create or remove |
| user_settings | ❌ | ✅ | ⚠️ PHANTOM | Create or remove |
| audit_logs | ❌ | ✅ | ⚠️ PHANTOM | Create or remove |

**Legend:**
- ✅ = Exists
- ❌ = Does not exist
- ⚠️ DRIFT = Exists in both but schema differs
- ⚠️ MISSING = Exists in DB but not in types
- ⚠️ PHANTOM = Exists in types but not in DB
