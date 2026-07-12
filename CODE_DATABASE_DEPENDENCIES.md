# CODE DATABASE DEPENDENCIES AUDIT
**Date:** 2025-01-XX
**Based on:** Source code analysis of src/ directory
**Purpose:** Identify all database table/column dependencies in codebase

---

## TABLE: profiles

### Referenced In:
- src/app/onboarding/page.tsx:42-45
- src/app/onboarding/page.tsx:99-110
- src/app/dashboard/profile/page.tsx:52-62
- src/lib/user-behavior.ts:43
- src/lib/user-behavior.ts:119-126
- src/lib/validation-scorecard.ts:43
- src/lib/validation/scorecard.ts:36
- src/app/admin/page.tsx:55

### Columns Expected:
- id
- full_name
- matric_number
- institution_id
- faculty_id
- department_id
- current_level (MISSING IN PRODUCTION)
- academic_session (EXISTS IN PRODUCTION, REMOVED IN LATEST)
- siwes_coordinator_name (EXISTS IN PRODUCTION, REMOVED IN LATEST)
- supervisor_name (EXISTS IN PRODUCTION, REMOVED IN LATEST)

### Production Exists:
YES

### Mismatch:
YES - current_level column missing in production, will be dropped by migration 014

### Risk:
CRITICAL - Onboarding and profile pages will fail without current_level column

---

## TABLE: analytics_events

### Referenced In:
- src/lib/user-behavior.ts:26
- src/lib/user-behavior.ts:82
- src/lib/user-behavior.ts:115
- src/lib/analytics.ts:58
- src/lib/payments/metrics.ts:116
- src/lib/payments/metrics.ts:139
- src/lib/payments/metrics.ts:162
- src/lib/payment-monitoring.ts:105
- src/lib/payment-monitoring.ts:131
- src/lib/payment-monitoring.ts:157
- src/lib/monitoring/failure-detection.ts:165
- src/lib/analytics/user-journey.ts:157
- src/lib/analytics/retention.ts:138
- src/lib/analytics/onboarding.ts:187
- src/lib/analytics/north-star.ts:126
- src/lib/analytics/funnel.ts:226
- src/app/admin/page.tsx:59
- src/app/admin/page.tsx:62

### Columns Expected:
- id
- user_id
- event_type
- event_category
- event_name
- properties
- page
- referrer
- user_agent
- ip_address
- created_at

### Production Exists:
NO - Table does not exist in production

### Mismatch:
YES - Table missing entirely

### Risk:
CRITICAL - Analytics tracking will fail across entire application

---

## TABLE: beta_users

### Referenced In:
- src/lib/beta-access.ts:46
- src/lib/beta-access.ts:69
- src/lib/beta-access.ts:95
- src/lib/beta-access.ts:105
- src/lib/beta-access.ts:183
- src/lib/beta-access.ts:228
- src/app/admin/page.tsx:56

### Columns Expected:
- id
- user_id
- status
- onboarding_step
- conversion_rate
- waitlist_joined_at
- account_created_at
- profile_completed_at
- first_logbook_created_at
- first_report_created_at
- first_export_at
- invited_at
- approved_at
- approved_by
- notes
- department
- institution
- referral_source
- created_at
- updated_at

### Production Exists:
NO - Table does not exist in production

### Mismatch:
YES - Table missing entirely

### Risk:
CRITICAL - Beta access control and onboarding will fail

---

## TABLE: weekly_logs

### Referenced In:
- src/lib/user-behavior.ts:47
- src/lib/user-behavior.ts:131
- src/lib/validation/scorecard.ts:88

### Columns Expected:
- id (assumed)
- report_id (assumed)
- user_id (assumed)
- week_number (assumed)
- ai_summary (referenced in validation/scorecard.ts:88)
- created_at (assumed)

### Production Exists:
NO - Table does not exist in production and was never created in any migration

### Mismatch:
YES - Table missing entirely, referenced by migration 013 but never created

### Risk:
CRITICAL - User behavior metrics and validation will fail

---

## TABLE: report_quality

### Referenced In:
- src/lib/report-quality.ts:35
- src/lib/report-quality.ts:66

### Columns Expected:
- id
- user_id
- report_version_id
- edit_level
- satisfaction_score
- feedback_text
- created_at

### Production Exists:
NO - Table does not exist in production

### Mismatch:
YES - Table missing entirely

### Risk:
HIGH - Report quality tracking will fail

---

## TABLE: feedback

### Referenced In:
- src/components/feedback/FeedbackButton.tsx:33

### Columns Expected:
- id
- user_id
- type
- message
- page
- status
- impact_score
- frequency_score
- priority_score
- priority_level
- created_at
- updated_at

### Production Exists:
NO - Table does not exist in production

### Mismatch:
YES - Table missing entirely

### Risk:
MEDIUM - Feedback submission will fail

---

## TABLE: activity_events

### Referenced In:
- src/app/admin/page.tsx:59
- src/app/admin/page.tsx:62
- src/lib/validation-scorecard.ts:75

### Columns Expected:
- id
- user_id
- report_id
- event_type
- event_title
- event_description
- event_metadata
- created_at

### Production Exists:
NO - Table does not exist in production

### Mismatch:
YES - Table missing entirely

### Risk:
HIGH - Activity timeline and admin dashboard will fail

---

## TABLE: logbooks

### Referenced In:
- src/app/onboarding/page.tsx:49
- src/lib/user-behavior.ts:128
- src/lib/validation-scorecard.ts:48
- src/lib/validation/scorecard.ts:40

### Columns Expected:
- id
- user_id
- title
- program_type
- institution_id
- training_organization_id
- department_name
- start_date
- end_date
- status
- created_at
- updated_at

### Production Exists:
YES

### Mismatch:
NO

### Risk:
LOW

---

## TABLE: logbook_entries

### Referenced In:
- src/lib/user-behavior.ts:44
- src/lib/user-behavior.ts:134
- src/lib/validation-scorecard.ts:53

### Columns Expected:
- id
- logbook_id
- user_id
- entry_date
- week_number
- title
- activity_description
- ai_cleaned_text
- source_type
- created_at
- updated_at

### Production Exists:
YES

### Mismatch:
NO

### Risk:
LOW

---

## TABLE: uploads

### Referenced In:
- src/lib/user-behavior.ts:45
- src/lib/validation-scorecard.ts:58
- src/lib/validation/scorecard.ts:76
- src/lib/validation/scorecard.ts:80

### Columns Expected:
- id
- user_id
- report_id (MISSING IN PRODUCTION)
- file_type
- storage_path (DIFFERENT NAME IN PRODUCTION: file_url)
- file_name (DIFFERENT NAME IN PRODUCTION: linked_to)
- mime_type
- file_size
- metadata
- created_at

### Production Exists:
YES

### Mismatch:
YES - Column names differ, report_id missing

### Risk:
HIGH - Upload tracking will fail, file references may break

---

## TABLE: reports

### Referenced In:
- src/lib/user-behavior.ts:46
- src/lib/user-behavior.ts:137
- src/lib/validation/scorecard.ts:63

### Columns Expected:
- id
- user_id
- title
- report_type
- institution_id
- training_organization_id
- status
- progress
- is_active (MISSING IN PRODUCTION)
- created_at
- updated_at

### Production Exists:
YES

### Mismatch:
YES - is_active column missing in production

### Risk:
MEDIUM - Report selection logic may fail

---

## TABLE: report_versions

### Referenced In:
- src/lib/user-behavior.ts:147
- src/lib/report-quality.ts:61
- src/lib/validation/scorecard.ts:56
- src/lib/validation/scorecard.ts:60

### Columns Expected:
- id
- report_id
- snapshot
- user_id (MISSING IN PRODUCTION)
- pdf_path (MISSING IN PRODUCTION)
- page_count (MISSING IN PRODUCTION)
- amount_paid (MISSING IN PRODUCTION)
- currency (MISSING IN PRODUCTION)
- payment_reference (MISSING IN PRODUCTION)
- payment_status (MISSING IN PRODUCTION)
- export_type (MISSING IN PRODUCTION)
- created_at

### Production Exists:
YES

### Mismatch:
YES - 8 columns missing in production

### Risk:
HIGH - PDF export and payment tracking will fail

---

## TABLE: payments

### Referenced In:
- src/lib/user-behavior.ts:143
- src/lib/reliability-tests.ts:152
- src/lib/reliability-tests.ts:168
- src/lib/reliability-tests.ts:180
- src/lib/payments/metrics.ts:28
- src/lib/validation/scorecard.ts:60
- src/lib/validation/scorecard.ts:62

### Columns Expected:
- id
- user_id
- report_id
- amount
- currency
- status
- reference
- paystack_reference
- paystack_transaction_id
- paid_at
- gateway_response
- metadata
- created_at

### Production Exists:
YES

### Mismatch:
NO

### Risk:
LOW

---

## TABLE: report_sections

### Referenced In:
- src/lib/user-behavior.ts:140

### Columns Expected:
- id
- report_id
- title
- content
- section_order
- ai_generated
- created_at
- updated_at

### Production Exists:
YES

### Mismatch:
NO

### Risk:
LOW

---

## RPC CALLS

### track_onboarding_event
- **Referenced In:** src/lib/beta-access.ts:206
- **Function:** public.track_onboarding_event(p_user_id uuid, p_event_type text)
- **Production Exists:** NO - Created in migration 20240620_beta_onboarding_pipeline.sql
- **Risk:** CRITICAL - Onboarding event tracking will fail

---

## STORAGE BUCKETS

### avatars
- **Referenced In:** src/app/dashboard/profile/page.tsx (avatar upload UI)
- **Production Exists:** YES
- **Risk:** LOW

### logbook-files
- **Referenced In:** src/lib/storage.ts (implied)
- **Production Exists:** YES
- **Risk:** LOW

### report-exports
- **Referenced In:** src/lib/pdf/pdfService.ts (implied)
- **Production Exists:** YES
- **Risk:** LOW

---

## SUMMARY TABLE

| Table | Production Exists | Code Expects | Mismatch | Risk |
|-------|------------------|--------------|----------|------|
| profiles | YES | current_level column | YES | CRITICAL |
| analytics_events | NO | Full table | YES | CRITICAL |
| beta_users | NO | Full table | YES | CRITICAL |
| weekly_logs | NO | Full table | YES | CRITICAL |
| report_quality | NO | Full table | YES | HIGH |
| feedback | NO | Full table | YES | MEDIUM |
| activity_events | NO | Full table | YES | HIGH |
| logbooks | YES | All columns | NO | LOW |
| logbook_entries | YES | All columns | NO | LOW |
| uploads | YES | Different column names | YES | HIGH |
| reports | YES | is_active column | YES | MEDIUM |
| report_versions | YES | 8 missing columns | YES | HIGH |
| payments | YES | All columns | NO | LOW |
| report_sections | YES | All columns | NO | LOW |

---

## END OF CODE DATABASE DEPENDENCIES AUDIT
