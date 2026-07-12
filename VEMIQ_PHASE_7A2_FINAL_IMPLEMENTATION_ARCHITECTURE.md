# VEMIQ PHASE 7A.2 — FINAL IMPLEMENTATION ARCHITECTURE

**Date**: July 7, 2026
**Architecture Status**: Implementation-Ready
**Core Principle**: Evidence is the source of truth. Activities, Logbooks, Weekly Summaries, Reports and Exports are all derived from evidence.

---

## 1. FINAL ENTITY MODEL

### STUDENT

**Purpose**: User entity representing SIWES/SWEP student
**Ownership**: System (auth.users)
**Source of Truth Status**: PRIMARY
**Dependencies**: Institution, Faculty, Department
**Lifecycle**: Onboarding → Active → Alumni
**Creation Trigger**: User signup via auth.users
**Update Trigger**: Profile updates
**Deletion Rules**: Soft delete, retain evidence for compliance

### INSTITUTION

**Purpose**: Academic institution (university, polytechnic)
**Ownership**: System
**Source of Truth Status**: PRIMARY
**Dependencies**: None
**Lifecycle**: Static reference
**Creation Trigger**: System initialization
**Update Trigger**: Admin updates
**Deletion Rules**: Cascade delete if no students

### ORGANIZATION

**Purpose**: Training organization where student is placed
**Ownership**: System
**Source of Truth Status**: PRIMARY
**Dependencies**: None
**Lifecycle**: Static reference with knowledge accumulation
**Creation Trigger**: Admin creation or student selection
**Update Trigger**: Knowledge updates
**Deletion Rules**: Cascade delete if no students

### EVIDENCE

**Purpose**: Raw captured data (text, voice, image, document)
**Ownership**: Student
**Source of Truth Status**: PRIMARY
**Dependencies**: Student
**Lifecycle**: Capture → Storage → Classification → Retrieval → Reuse → Archive
**Creation Trigger**: Student capture action
**Update Trigger**: Classification updates, quality scoring
**Deletion Rules**: Soft delete, retain for 1 year after report export

### ACTIVITY

**Purpose**: Structured representation of evidence with context
**Ownership**: Student (derived from evidence)
**Source of Truth Status**: DERIVED
**Dependencies**: Evidence, Student, Organization
**Lifecycle**: Evidence → Activity → Logbook → Report
**Creation Trigger**: Evidence capture (auto-generated)
**Update Trigger**: Evidence updates, manual refinement
**Deletion Rules**: Cascade delete from evidence

### LOGBOOK

**Purpose**: Container for activities over a training period
**Ownership**: Student
**Source of Truth Status**: DERIVED
**Dependencies**: Student, Organization, Activities
**Lifecycle**: Activities → Logbook → Report → Export
**Creation Trigger**: First evidence capture (auto-created)
**Update Trigger**: Activity additions
**Deletion Rules**: Soft delete, retain for compliance

### WEEKLY SUMMARY

**Purpose**: Auto-generated summary of weekly activities
**Ownership**: Student (derived from logbook)
**Source of Truth Status**: DERIVED
**Dependencies**: Logbook, Activities, Evidence
**Lifecycle**: Activities → Weekly Summary → Report
**Creation Trigger**: Week completion (auto-generated)
**Update Trigger**: Activity updates
**Deletion Rules**: Cascade delete from logbook

### REPORT

**Purpose**: Final deliverable generated from evidence
**Ownership**: Student
**Source of Truth Status**: DERIVED
**Dependencies**: Evidence, Logbook, Weekly Summaries, Student, Organization
**Lifecycle**: Logbook → Report → Export
**Creation Trigger**: Student initiates "Generate from Evidence"
**Update Trigger**: Section refinements, evidence additions
**Deletion Rules**: Soft delete, retain for compliance

### EXPORT

**Purpose**: Formatted output (PDF, portfolio, timeline)
**Ownership**: Student
**Source of Truth Status**: DERIVED
**Dependencies**: Report or Evidence
**Lifecycle**: Report → Export
**Creation Trigger**: Student export action
**Update Trigger**: Regeneration
**Deletion Rules**: Hard delete after 30 days

### KNOWLEDGE

**Purpose**: Institutional knowledge base for report generation
**Ownership**: Organization
**Source of Truth Status**: PRIMARY
**Dependencies**: Organization
**Lifecycle**: Static reference with accumulation
**Creation Trigger**: Organization creation
**Update Trigger**: Admin updates, AI extraction
**Deletion Rules**: Cascade delete from organization

### TIMELINE EVENT

**Purpose**: Unified activity tracking for dashboard
**Ownership**: Student
**Source of Truth Status**: DERIVED
**Dependencies**: Evidence, Activity, Logbook, Report
**Lifecycle**: All actions → Timeline Event
**Creation Trigger**: Any evidence/activity/logbook/report action
**Update Trigger**: None (immutable)
**Deletion Rules**: Hard delete after 90 days

---

### ENTITY RELATIONSHIP DIAGRAM

```
Student (1) ----< (1) Institution
Student (1) ----< (1) Faculty
Student (1) ----< (1) Department
Student (1) ----< (1) Organization

Student (1) ----< (many) Evidence
Evidence (1) ----< (1) Activity
Activity (many) ----< (1) Logbook
Logbook (1) ----< (many) Weekly Summary
Weekly Summary (many) ----< (1) Report
Report (1) ----< (many) Export

Organization (1) ----< (many) Knowledge
Evidence (many) ----< (many) Report (via report_evidence)
Evidence (many) ----< (many) Activity (via activity_evidence)

Student (1) ----< (many) Timeline Event
Evidence (1) ----< (1) Timeline Event
Activity (1) ----< (1) Timeline Event
Logbook (1) ----< (1) Timeline Event
Report (1) ----< (1) Timeline Event
```

---

## 2. FINAL DATABASE ARCHITECTURE

### EXISTING TABLES TO KEEP

**profiles** - Keep, modify to add evidence-first fields
**institutions** - Keep as-is
**faculties** - Keep as-is
**departments** - Keep as-is
**training_organizations** - Keep as-is
**organization_departments** - Keep as-is
**organization_knowledge** - Keep as-is, expand usage
**uploads** - Keep, modify to add classification fields
**activity_events** - Keep, rename to timeline_events
**chat_messages** - Keep as-is
**payments** - Keep as-is

### EXISTING TABLES TO MODIFY

**logbooks** - Add auto-creation trigger, add evidence_completeness field
**logbook_entries** - Rename to activities, add auto-generation fields
**logbook_evidence** - Keep, add relationship tracking
**reports** - Add evidence_completeness field, add auto-generation timestamp
**report_sections** - Add evidence_citation field, add auto-generation flag
**report_versions** - Keep as-is
**report_logbook_entries** - Rename to report_activities, keep junction

### EXISTING TABLES TO DELETE

**weekly_logs** - Delete (replaced by activities + weekly_summaries)
**activity_logs** - Delete (replaced by timeline_events)

### NEW TABLES REQUIRED

**activities** - Renamed from logbook_entries, auto-generated from evidence
**weekly_summaries** - Auto-generated from activities
**evidence_classifications** - Classification metadata for evidence
**evidence_relationships** - Evidence graph relationships
**evidence_citations** - Evidence citations in reports
**timeline_events** - Renamed from activity_events, unified tracking
**report_completeness** - Report completeness scoring
**evidence_quality_scores** - Evidence quality assessment

---

### FINAL DATABASE SCHEMA

```sql
-- PROFILES (modified)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  institution_id UUID REFERENCES institutions(id),
  faculty_id UUID REFERENCES faculties(id),
  department_id UUID REFERENCES departments(id),
  matric_number TEXT,
  academic_session TEXT,
  siwes_coordinator_name TEXT,
  supervisor_name TEXT,
  role user_role NOT NULL DEFAULT 'student',
  training_organization_id UUID REFERENCES training_organizations(id),
  training_start_date DATE,
  training_end_date DATE,
  current_level TEXT,
  evidence_first_onboarded BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVIDENCE (modified uploads)
CREATE TABLE evidence (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  file_url TEXT NOT NULL,
  file_type TEXT NOT NULL, -- 'text', 'voice', 'image', 'document'
  storage_path TEXT NOT NULL,
  file_name TEXT NOT NULL,
  mime_type TEXT,
  file_size BIGINT,
  metadata JSONB DEFAULT '{}',
  
  -- Classification fields
  classification_category TEXT, -- 'work', 'learning', 'observation'
  classification_confidence DECIMAL(3,2),
  auto_classified BOOLEAN DEFAULT TRUE,
  quality_score DECIMAL(3,2),
  quality_assessed_at TIMESTAMPTZ,
  
  -- Activity linkage
  activity_id UUID REFERENCES activities(id) ON DELETE SET NULL,
  week_number INTEGER,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_evidence_user_id ON evidence(user_id);
CREATE INDEX idx_evidence_file_type ON evidence(file_type);
CREATE INDEX idx_evidence_created_at ON evidence(created_at DESC);
CREATE INDEX idx_evidence_activity_id ON evidence(activity_id);
CREATE INDEX idx_evidence_week_number ON evidence(week_number);

-- ACTIVITIES (renamed from logbook_entries)
CREATE TABLE activities (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logbook_id UUID REFERENCES logbooks(id) ON DELETE CASCADE,
  
  -- Auto-generated fields
  title TEXT NOT NULL,
  activity_description TEXT NOT NULL,
  activity_type TEXT NOT NULL, -- 'work', 'learning', 'observation'
  auto_generated BOOLEAN DEFAULT TRUE,
  generated_from_evidence_id UUID REFERENCES evidence(id),
  
  -- Manual refinement fields
  manual_refinement TEXT,
  refined_at TIMESTAMPTZ,
  
  -- Context fields
  entry_date DATE NOT NULL,
  week_number INTEGER,
  organization_context TEXT,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_activities_user_id ON activities(user_id);
CREATE INDEX idx_activities_logbook_id ON activities(logbook_id);
CREATE INDEX idx_activities_entry_date ON activities(entry_date DESC);
CREATE INDEX idx_activities_week_number ON activities(week_number);

-- WEEKLY SUMMARIES (new)
CREATE TABLE weekly_summaries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  logbook_id UUID REFERENCES logbooks(id) ON DELETE CASCADE,
  
  week_number INTEGER NOT NULL,
  summary_text TEXT NOT NULL,
  activity_count INTEGER DEFAULT 0,
  evidence_count INTEGER DEFAULT 0,
  
  -- Auto-generation metadata
  auto_generated BOOLEAN DEFAULT TRUE,
  generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  regenerated_at TIMESTAMPTZ,
  
  -- Manual refinement
  manual_refinement TEXT,
  refined_at TIMESTAMPTZ,
  
  UNIQUE(user_id, logbook_id, week_number)
);

CREATE INDEX idx_weekly_summaries_user_id ON weekly_summaries(user_id);
CREATE INDEX idx_weekly_summaries_logbook_id ON weekly_summaries(logbook_id);
CREATE INDEX idx_weekly_summaries_week_number ON weekly_summaries(week_number);

-- LOGBOOKS (modified)
CREATE TABLE logbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  program_type program_type NOT NULL,
  institution_id UUID REFERENCES institutions(id),
  training_organization_id UUID REFERENCES training_organizations(id),
  department_name TEXT,
  start_date DATE,
  end_date DATE,
  status logbook_status NOT NULL DEFAULT 'active',
  
  -- Evidence completeness
  evidence_completeness DECIMAL(3,2) DEFAULT 0.00,
  total_weeks INTEGER,
  completed_weeks INTEGER,
  last_completeness_check TIMESTAMPTZ,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REPORTS (modified)
CREATE TABLE reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  report_type program_type NOT NULL,
  institution_id UUID REFERENCES institutions(id),
  training_organization_id UUID REFERENCES training_organizations(id),
  status report_status NOT NULL DEFAULT 'draft',
  progress INTEGER NOT NULL DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
  
  -- Evidence-driven fields
  evidence_completeness DECIMAL(3,2) DEFAULT 0.00,
  evidence_count INTEGER DEFAULT 0,
  auto_generated BOOLEAN DEFAULT TRUE,
  generated_from_evidence BOOLEAN DEFAULT TRUE,
  generation_started_at TIMESTAMPTZ,
  generation_completed_at TIMESTAMPTZ,
  
  -- Auto-fill fields
  student_info_auto_filled BOOLEAN DEFAULT FALSE,
  weekly_logs_auto_pulled BOOLEAN DEFAULT FALSE,
  evidence_auto_cited BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- REPORT SECTIONS (modified)
CREATE TABLE report_sections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  content TEXT,
  section_order INTEGER NOT NULL,
  ai_generated BOOLEAN NOT NULL DEFAULT false,
  
  -- Evidence citation
  evidence_citations JSONB DEFAULT '[]',
  weekly_summary_id UUID REFERENCES weekly_summaries(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- EVIDENCE RELATIONSHIPS (new)
CREATE TABLE evidence_relationships (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  source_evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  target_evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  relationship_type TEXT NOT NULL, -- 'related', 'similar', 'follows', 'references'
  confidence DECIMAL(3,2),
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(source_evidence_id, target_evidence_id, relationship_type)
);

CREATE INDEX idx_evidence_relationships_source ON evidence_relationships(source_evidence_id);
CREATE INDEX idx_evidence_relationships_target ON evidence_relationships(target_evidence_id);

-- EVIDENCE CITATIONS (new)
CREATE TABLE evidence_citations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_section_id UUID NOT NULL REFERENCES report_sections(id) ON DELETE CASCADE,
  evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  citation_context TEXT,
  citation_position INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(report_section_id, evidence_id)
);

CREATE INDEX idx_evidence_citations_section ON evidence_citations(report_section_id);
CREATE INDEX idx_evidence_citations_evidence ON evidence_citations(evidence_id);

-- TIMELINE EVENTS (renamed from activity_events)
CREATE TABLE timeline_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  report_id UUID REFERENCES reports(id) ON DELETE CASCADE,
  
  event_type TEXT NOT NULL,
  event_title TEXT NOT NULL,
  event_description TEXT,
  event_metadata JSONB DEFAULT '{}',
  
  -- Evidence linkage
  evidence_id UUID REFERENCES evidence(id),
  activity_id UUID REFERENCES activities(id),
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_timeline_events_user_id ON timeline_events(user_id, created_at DESC);
CREATE INDEX idx_timeline_events_report_id ON timeline_events(report_id);
CREATE INDEX idx_timeline_events_evidence_id ON timeline_events(evidence_id);

-- REPORT COMPLETENESS (new)
CREATE TABLE report_completeness (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  
  -- Completeness metrics
  evidence_completeness DECIMAL(3,2) DEFAULT 0.00,
  weekly_summary_completeness DECIMAL(3,2) DEFAULT 0.00,
  student_info_completeness DECIMAL(3,2) DEFAULT 0.00,
  overall_completeness DECIMAL(3,2) DEFAULT 0.00,
  
  -- Gap detection
  missing_weeks INTEGER[] DEFAULT '{}',
  missing_evidence_types TEXT[] DEFAULT '{}',
  weak_sections TEXT[] DEFAULT '{}',
  
  -- Validation
  validated_at TIMESTAMPTZ,
  validation_passed BOOLEAN DEFAULT FALSE,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  
  UNIQUE(report_id)
);

-- EVIDENCE QUALITY SCORES (new)
CREATE TABLE evidence_quality_scores (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id UUID NOT NULL REFERENCES evidence(id) ON DELETE CASCADE,
  
  -- Quality metrics
  clarity_score DECIMAL(3,2),
  relevance_score DECIMAL(3,2),
  completeness_score DECIMAL(3,2),
  overall_quality DECIMAL(3,2),
  
  -- Assessment metadata
  assessed_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  assessment_method TEXT, -- 'auto', 'manual', 'hybrid'
  
  UNIQUE(evidence_id)
);
```

---

## 3. EVIDENCE GRAPH ARCHITECTURE

### EVIDENCE CONNECTIONS

**Evidence → Activities**: One-to-many (one evidence can generate multiple activities)
**Evidence → Logbooks**: Many-to-many (evidence linked to multiple logbook entries)
**Evidence → Reports**: Many-to-many (evidence cited in multiple reports)
**Evidence → Exports**: Many-to-many (evidence included in multiple exports)
**Evidence → Organizations**: Many-to-one (evidence linked to organization context)
**Evidence → Students**: Many-to-one (evidence owned by student)

### GRAPH NODES

**Evidence Node**: Primary entity with file, metadata, classification
**Activity Node**: Derived from evidence, represents structured activity
**Logbook Node**: Container for activities
**Report Node**: Generated from evidence and activities
**Export Node**: Formatted output from evidence or report
**Student Node**: Owner of evidence
**Organization Node**: Context for evidence

### GRAPH EDGES

**evidence → activity**: "generates" edge
**evidence → logbook**: "linked_to" edge
**evidence → report**: "cited_in" edge
**evidence → export**: "included_in" edge
**evidence → organization**: "context_of" edge
**evidence → student**: "owned_by" edge
**activity → logbook**: "part_of" edge
**activity → weekly_summary**: "summarized_in" edge
**weekly_summary → report**: "included_in" edge

### GRAPH TRAVERSAL PATTERNS

**Evidence Provenance**: evidence → activity → logbook → report
**Evidence Reuse**: evidence → report1, evidence → report2
**Evidence Context**: evidence → organization → knowledge
**Evidence Timeline**: evidence → activity → timeline_event
**Evidence Quality**: evidence → quality_score → report_completeness

### PROVENANCE TRACKING

**Capture Provenance**: Timestamp, device, location, capture method
**Classification Provenance**: Classification method, confidence, classifier version
**Activity Provenance**: Generation method, evidence source, manual refinements
**Citation Provenance**: Citation context, position, auto/manual citation
**Export Provenance**: Export method, format, timestamp, recipient

---

### EVIDENCE RELATIONSHIP ENGINE

**Purpose**: Track relationships between evidence items
**Implementation**: evidence_relationships table
**Relationship Types**: related, similar, follows, references
**Trigger**: Evidence capture, classification, manual linking
**Algorithm**: Content similarity, temporal proximity, manual tagging

### EVIDENCE REUSE ENGINE

**Purpose**: Enable evidence reuse across reports and logbooks
**Implementation**: Many-to-many evidence relationships
**Trigger**: Report generation, logbook creation
**Algorithm**: Evidence graph traversal, relevance scoring
**Fallback**: Manual evidence selection if auto-reuse fails

### EVIDENCE CITATION ENGINE

**Purpose**: Auto-cite evidence in reports
**Implementation**: evidence_citations table
**Trigger**: Report section generation
**Algorithm**: Evidence relevance to section, citation position
**Fallback**: Manual citation if auto-citation fails

### EVIDENCE COMPLETENESS ENGINE

**Purpose**: Validate evidence completeness for reports
**Implementation**: report_completeness table
**Trigger**: Report generation, evidence addition
**Algorithm**: Week coverage, evidence type distribution, quality scoring
**Threshold**: 80% completeness required for report generation

---

## 4. EVIDENCE PIPELINE SPECIFICATION

### EVIDENCE → ACTIVITY

**Inputs**: Raw evidence (file, metadata, timestamp)
**Outputs**: Structured activity (title, description, type, week number)
**Services**: ClassificationService, ActivityGenerationService, WeekCalculationService
**Events**: evidence.captured → activity.generated
**Database Writes**: activities table, timeline_events table
**Database Reads**: profiles table (for context), logbooks table (for week calculation)
**Failure States**: Classification failure, activity generation failure, week calculation failure
**Recovery States**: Manual activity creation, default classification, manual week assignment
**Automation %**: 100%
**Human Review %**: 0%

---

### ACTIVITY → LOGBOOK

**Inputs**: Activities (from evidence)
**Outputs**: Logbook entries with activity linkage
**Services**: LogbookAutoCreationService, ActivityLinkageService
**Events**: activity.generated → logbook.entry_created
**Database Writes**: logbooks table (if auto-created), activities table (logbook_id)
**Database Reads**: logbooks table (for existing logbook), profiles table
**Failure States**: Logbook creation failure, activity linkage failure
**Recovery States**: Manual logbook creation, manual activity linkage
**Automation %**: 90%
**Human Review %**: 10%

---

### LOGBOOK → WEEKLY SUMMARY

**Inputs**: Activities from a week
**Outputs**: Weekly summary with activity descriptions
**Services**: WeeklySummaryService, SummarizationService, EvidenceCitationService
**Events**: activity.generated → weekly_summary.generated
**Database Writes**: weekly_summaries table, timeline_events table
**Database Reads**: activities table, evidence table, profiles table
**Failure States**: Summarization failure, citation failure
**Recovery States**: Manual summary creation, manual citation
**Automation %**: 80%
**Human Review %**: 20%

---

### WEEKLY SUMMARY → REPORT

**Inputs**: Weekly summaries, evidence, student profile, organization knowledge
**Outputs**: Report sections with citations
**Services**: ReportGenerationService, SectionMappingService, CitationService, FormattingService
**Events**: weekly_summary.generated → report.section_generated
**Database Writes**: report_sections table, evidence_citations table, reports table
**Database Reads**: weekly_summaries table, evidence table, profiles table, organization_knowledge table
**Failure States**: Section generation failure, citation failure, formatting failure
**Recovery States**: Manual section creation, manual citation, manual formatting
**Automation %**: 70%
**Human Review %**: 30%

---

### REPORT → EXPORT

**Inputs**: Report sections, evidence, formatting rules
**Outputs**: Formatted export (PDF, portfolio, timeline)
**Services**: ExportService, PDFGenerationService, PortfolioGenerationService, TimelineGenerationService
**Events**: report.completed → export.generated
**Database Writes**: exports table, report_versions table
**Database Reads**: report_sections table, evidence table, reports table
**Failure States**: PDF generation failure, portfolio generation failure
**Recovery States**: Retry export, manual PDF creation
**Automation %**: 90%
**Human Review %**: 10%

---

## 5. FINAL DASHBOARD ARCHITECTURE

### MOBILE LAYOUT (320px - 430px)

**Component Hierarchy**:
1. Header (Student name, training status)
2. Today's Progress (Evidence count, week progress)
3. Quick Capture (2x2 grid, primary action)
4. Recent Evidence (Timeline, last 5 items)
5. Current Week Summary (Auto-generated, completeness check)
6. Generate Report (Single button, evidence-driven)
7. Bottom Navigation (Capture, Logbook, Reports, Settings)

**Order**: 1 → 2 → 3 → 4 → 5 → 6 → 7
**Priority**: QuickCapture (highest), Recent Evidence (high), Generate Report (medium)
**Visibility Rules**: 
- QuickCapture: Always visible
- Generate Report: Visible only when evidence_completeness > 50%
- Current Week Summary: Visible only when activities exist

**First 3 Seconds**: QuickCapture (primary action)
**First Scroll**: Today's Progress, Recent Evidence
**Second Scroll**: Current Week Summary, Generate Report

**Primary CTA**: QuickCapture (first action)
**Secondary CTA**: Generate Report (when evidence exists)
**Hidden Actions**: Settings (in bottom nav), Logbook (in bottom nav)

---

### TABLET LAYOUT (768px - 1024px)

**Component Hierarchy**:
1. Header (Student name, training status)
2. Two-column layout:
   - Left: QuickCapture (2x2 grid), Today's Progress
   - Right: Recent Evidence, Current Week Summary
3. Generate Report (Full-width button)
4. Bottom Navigation (Capture, Logbook, Reports, Settings)

**Order**: 1 → 2 → 3 → 4
**Priority**: QuickCapture (highest), Recent Evidence (high)
**Visibility Rules**: Same as mobile

**First 3 Seconds**: QuickCapture (left column)
**First Scroll**: Today's Progress, Recent Evidence (right column)
**Second Scroll**: Current Week Summary, Generate Report

**Primary CTA**: QuickCapture
**Secondary CTA**: Generate Report
**Hidden Actions**: Settings, Logbook (in bottom nav)

---

### DESKTOP LAYOUT (1024px+)

**Component Hierarchy**:
1. Sidebar (Navigation: Dashboard, Logbook, Reports, Settings)
2. Main Content:
   - Header (Student name, training status)
   - QuickCapture (2x2 grid, largest element)
   - Today's Progress
   - Recent Evidence (Timeline)
   - Current Week Summary
   - Generate Report

**Order**: 1 → 2
**Priority**: QuickCapture (highest)
**Visibility Rules**: Same as mobile/tablet

**First 3 Seconds**: QuickCapture (largest element)
**First Scroll**: Today's Progress, Recent Evidence
**Second Scroll**: Current Week Summary, Generate Report

**Primary CTA**: QuickCapture
**Secondary CTA**: Generate Report
**Hidden Actions**: None (all visible in sidebar)

---

## 6. QUICK CAPTURE SYSTEM

### TEXT CAPTURE

**Capture Flow**: Tap "Add Logbook Entry" → Type text → Submit
**Tap Count**: 3 taps
**Backend Flow**: POST /api/capture/text → ClassificationService → ActivityGenerationService → Database
**Storage Flow**: evidence table (text type) → activities table → timeline_events table
**Classification Flow**: Auto-classify as 'work'/'learning'/'observation' → confidence score
**Activity Generation Flow**: Auto-generate activity title from text → auto-calculate week number → auto-link to logbook

### IMAGE CAPTURE

**Capture Flow**: Tap "Take Picture" → Camera → Capture → Submit
**Tap Count**: 3 taps
**Backend Flow**: POST /api/capture/image → Storage → ClassificationService → ActivityGenerationService → Database
**Storage Flow**: Upload to Supabase Storage → evidence table (image type) → activities table
**Classification Flow**: Image analysis → classify as 'work'/'learning'/'observation' → confidence score
**Activity Generation Flow**: Auto-generate activity title from image context → auto-calculate week number

### VOICE CAPTURE

**Capture Flow**: Tap "Record Voice Note" → Record → Stop → Submit
**Tap Count**: 3 taps
**Backend Flow**: POST /api/capture/voice → Storage → TranscriptionService → ClassificationService → ActivityGenerationService → Database
**Storage Flow**: Upload to Supabase Storage → evidence table (voice type) → transcription text → activities table
**Classification Flow**: Transcribe voice → classify transcription → confidence score
**Activity Generation Flow**: Auto-generate activity title from transcription → auto-calculate week number

### DOCUMENT CAPTURE

**Capture Flow**: Tap "Upload Document" → File picker → Upload → Submit
**Tap Count**: 3 taps
**Backend Flow**: POST /api/capture/document → Storage → ExtractionService → ClassificationService → ActivityGenerationService → Database
**Storage Flow**: Upload to Supabase Storage → evidence table (document type) → extracted text → activities table
**Classification Flow**: Extract text from document → classify text → confidence score
**Activity Generation Flow**: Auto-generate activity title from document content → auto-calculate week number

---

### AUTO CLASSIFICATION ENGINE

**Classification Categories**:
- work: Evidence related to work activities
- learning: Evidence related to learning activities
- observation: Evidence related to observation activities

**Confidence Scores**:
- 0.90-1.00: High confidence (auto-accept)
- 0.70-0.89: Medium confidence (auto-accept with flag)
- 0.50-0.69: Low confidence (manual review required)
- < 0.50: Very low confidence (manual classification required)

**Fallback Behavior**:
- If confidence < 0.50: Default to 'work', flag for manual review
- If classification fails: Default to 'work', flag for manual review
- If service unavailable: Default to 'work', queue for reclassification

---

## 7. REPORT GENERATION SYSTEM

### GENERATE FROM EVIDENCE ENGINE

**Step 1: Validation**
- Check evidence_completeness > 80%
- Check student_info_completeness > 90%
- Check weekly_summary_completeness > 70%
- If validation fails: Show gaps, block generation, allow manual override

**Step 2: Generation**
- Auto-fill student info from profiles table
- Auto-pull weekly logs from weekly_summaries table
- Auto-pull evidence from evidence table
- Auto-generate report sections from weekly_summaries
- Auto-cite evidence in report_sections
- Auto-format per institution standards

**Step 3: Review**
- Show auto-generated report
- Highlight evidence citations
- Show completeness score
- Allow manual refinements (30-60 minutes)

**Step 4: Export**
- Generate PDF from report_sections
- Create export record in exports table
- Create version in report_versions table
- Download PDF

**Data Sources**:
- **Profile**: student_info_auto_filled from profiles table
- **Evidence**: evidence_count, evidence_completeness from evidence table
- **Logbook**: weekly_logs_auto_pulled from weekly_summaries table
- **Organization Knowledge**: organization_context from organization_knowledge table

---

### REPORT COMPLETENESS SCORING

**Evidence Completeness**: (evidence_count / required_evidence_count) * 100
**Weekly Summary Completeness**: (completed_weeks / total_weeks) * 100
**Student Info Completeness**: (filled_profile_fields / total_profile_fields) * 100
**Overall Completeness**: (evidence_completeness * 0.4) + (weekly_summary_completeness * 0.3) + (student_info_completeness * 0.3)

**Threshold**: 80% overall completeness required for report generation

---

### EVIDENCE CITATION RULES

**Citation Trigger**: Report section generation
**Citation Method**: Auto-cite evidence relevant to section
**Citation Format**: [Evidence ID: Type - Date]
**Citation Position**: Inline in section content
**Citation Context**: Store in evidence_citations table
**Fallback**: Manual citation if auto-citation fails

---

### MISSING EVIDENCE DETECTION

**Detection Method**: Compare required evidence types vs actual evidence types
**Required Evidence Types**: text, image, document (at least one per week)
**Detection Trigger**: Report generation, evidence addition
**Detection Output**: missing_evidence_types array in report_completeness table
**Display**: Show gaps in validation step, allow manual override

---

## 8. AUTOMATION ARCHITECTURE

### CRON JOBS

**Evidence Classification Job**
- Schedule: Every 5 minutes
- Input: Unclassified evidence
- Process: ClassificationService
- Output: Classified evidence
- Retry Strategy: Exponential backoff, max 3 retries
- Failure Handling: Flag for manual classification

**Weekly Summary Generation Job**
- Schedule: Daily at 23:59
- Input: Activities from completed week
- Process: WeeklySummaryService
- Output: Weekly summaries
- Retry Strategy: Exponential backoff, max 3 retries
- Failure Handling: Flag for manual summary creation

**Evidence Quality Scoring Job**
- Schedule: Every hour
- Input: New evidence
- Process: QualityScoringService
- Output: Quality scores
- Retry Strategy: Exponential backoff, max 3 retries
- Failure Handling: Default score, flag for manual review

---

### QUEUE JOBS

**Evidence Processing Queue**
- Trigger: Evidence capture
- Input: Raw evidence
- Process: Classification → Activity Generation → Timeline Event
- Output: Processed evidence
- Retry Strategy: Exponential backoff, max 5 retries
- Failure Handling: Dead letter queue, manual processing

**Report Generation Queue**
- Trigger: Student initiates "Generate from Evidence"
- Input: Report request
- Process: Validation → Generation → Review → Export
- Output: Generated report
- Retry Strategy: Linear backoff, max 3 retries
- Failure Handling: Flag for manual report creation

---

### TRIGGERS

**Evidence Capture Trigger**
- Event: evidence.captured
- Action: Queue evidence processing job
- Database: Insert into evidence table, timeline_events table

**Activity Generation Trigger**
- Event: evidence.processed
- Action: Generate activity from evidence
- Database: Insert into activities table

**Weekly Summary Trigger**
- Event: week.completed
- Action: Generate weekly summary
- Database: Insert into weekly_summaries table

---

### WEBHOOKS

**Report Export Webhook**
- Event: report.exported
- Payload: Report ID, Export URL, Timestamp
- Recipient: External systems (if configured)
- Retry Strategy: Exponential backoff, max 3 retries
- Failure Handling: Log failure, manual retry

---

### REALTIME EVENTS

**Evidence Capture Realtime**
- Channel: user_{user_id}:evidence
- Event: evidence.captured
- Payload: Evidence ID, Type, Timestamp
- Purpose: Real-time dashboard update

**Activity Generation Realtime**
- Channel: user_{user_id}:activities
- Event: activity.generated
- Payload: Activity ID, Title, Week Number
- Purpose: Real-time logbook update

**Report Generation Realtime**
- Channel: user_{user_id}:reports
- Event: report.generated
- Payload: Report ID, Status, Completeness
- Purpose: Real-time report status update

---

## 9. API ARCHITECTURE

### CAPTURE APIS

**POST /api/capture/text**
- Input: { text: string, metadata: object }
- Output: { evidence_id: uuid, activity_id: uuid, classification: object }
- Auth: Required
- Rate Limit: 10 requests per minute

**POST /api/capture/image**
- Input: FormData (file, metadata)
- Output: { evidence_id: uuid, activity_id: uuid, classification: object }
- Auth: Required
- Rate Limit: 5 requests per minute

**POST /api/capture/voice**
- Input: FormData (file, metadata)
- Output: { evidence_id: uuid, activity_id: uuid, transcription: string, classification: object }
- Auth: Required
- Rate Limit: 5 requests per minute

**POST /api/capture/document**
- Input: FormData (file, metadata)
- Output: { evidence_id: uuid, activity_id: uuid, extracted_text: string, classification: object }
- Auth: Required
- Rate Limit: 5 requests per minute

---

### EVIDENCE APIS

**GET /api/evidence**
- Input: { user_id: uuid, filters: object }
- Output: { evidence: array, total: number }
- Auth: Required
- Rate Limit: 30 requests per minute

**GET /api/evidence/:id**
- Input: { id: uuid }
- Output: { evidence: object, relationships: array, citations: array }
- Auth: Required
- Rate Limit: 60 requests per minute

**DELETE /api/evidence/:id**
- Input: { id: uuid }
- Output: { soft_deleted: boolean }
- Auth: Required
- Rate Limit: 10 requests per minute

---

### ACTIVITY APIS

**GET /api/activities**
- Input: { user_id: uuid, week_number: integer }
- Output: { activities: array, total: number }
- Auth: Required
- Rate Limit: 30 requests per minute

**GET /api/activities/:id**
- Input: { id: uuid }
- Output: { activity: object, evidence: array, weekly_summary: object }
- Auth: Required
- Rate Limit: 60 requests per minute

**PUT /api/activities/:id**
- Input: { id: uuid, manual_refinement: string }
- Output: { updated: boolean }
- Auth: Required
- Rate Limit: 10 requests per minute

---

### LOGBOOK APIS

**GET /api/logbook**
- Input: { user_id: uuid }
- Output: { logbook: object, activities: array, completeness: object }
- Auth: Required
- Rate Limit: 30 requests per minute

**GET /api/logbook/weekly-summary/:week**
- Input: { user_id: uuid, week: integer }
- Output: { weekly_summary: object, activities: array, evidence: array }
- Auth: Required
- Rate Limit: 30 requests per minute

**POST /api/logbook/regenerate-summary/:week**
- Input: { user_id: uuid, week: integer }
- Output: { regenerated: boolean, weekly_summary: object }
- Auth: Required
- Rate Limit: 5 requests per minute

---

### REPORT APIS

**POST /api/reports/generate-from-evidence**
- Input: { user_id: uuid, logbook_id: uuid }
- Output: { report_id: uuid, status: string, completeness: object }
- Auth: Required
- Rate Limit: 1 request per minute

**GET /api/reports/:id/completeness**
- Input: { id: uuid }
- Output: { completeness: object, gaps: array, validation_passed: boolean }
- Auth: Required
- Rate Limit: 30 requests per minute

**GET /api/reports/:id/sections**
- Input: { id: uuid }
- Output: { sections: array, citations: array }
- Auth: Required
- Rate Limit: 30 requests per minute

**PUT /api/reports/:id/sections/:section_id**
- Input: { id: uuid, section_id: uuid, content: string }
- Output: { updated: boolean }
- Auth: Required
- Rate Limit: 10 requests per minute

---

### EXPORT APIS

**POST /api/reports/:id/export**
- Input: { id: uuid, format: 'pdf' | 'portfolio' | 'timeline' }
- Output: { export_id: uuid, download_url: string, status: string }
- Auth: Required
- Rate Limit: 1 request per minute

**GET /api/exports/:id**
- Input: { id: uuid }
- Output: { export: object, download_url: string }
- Auth: Required
- Rate Limit: 30 requests per minute

---

## 10. MVP CUTLINE

### MUST SHIP

**Evidence Capture System**
- QuickCapture component (2x2 grid)
- Text capture (3 taps)
- Image capture (3 taps)
- Voice capture (3 taps)
- Document capture (3 taps)
- Auto-classification engine
- Activity auto-generation
- Week number auto-calculation

**Dashboard Architecture**
- Evidence-first dashboard
- QuickCapture as primary action
- Recent Evidence timeline
- Current Week Summary
- Generate Report button
- Mobile-first layout
- 2-column desktop layout (no right panel)

**Report Generation System**
- Generate from Evidence engine
- Validation step (completeness check)
- Auto-fill from profile
- Auto-pull weekly logs
- Auto-cite evidence
- Review step
- Export step (PDF)

**Database Architecture**
- Evidence table (modified uploads)
- Activities table (renamed logbook_entries)
- Weekly Summaries table (new)
- Evidence Relationships table (new)
- Evidence Citations table (new)
- Report Completeness table (new)
- Timeline Events table (renamed activity_events)

**API Layer**
- Capture APIs (text, image, voice, document)
- Evidence APIs (list, get, delete)
- Activity APIs (list, get, update)
- Logbook APIs (get, weekly summary, regenerate)
- Report APIs (generate, completeness, sections, update)
- Export APIs (generate, get)

**Automation**
- Evidence classification queue
- Activity generation trigger
- Weekly summary generation job
- Evidence quality scoring job
- Realtime events (evidence, activities, reports)

---

### SHOULD SHIP

**Evidence Graph**
- Evidence relationship engine
- Evidence reuse engine
- Evidence citation engine
- Evidence completeness engine

**Quick Capture Enhancements**
- Evidence preview on capture
- Classification confidence display
- Manual classification override
- Evidence quality feedback

**Report Generation Enhancements**
- Missing evidence detection
- Gap visualization
- Institution formatting
- Organization knowledge integration



**Dashboard Enhancements**
- Evidence completeness visualization
- Gap highlighting
- Progress indicators
- Activity timeline

**Mobile Enhancements**
- Thumb reachability optimization
- One-handed capture mode
- Offline capture (queue sync)
- Push notifications for gaps

---

### LATER PHASE

**Evidence Intelligence**
- Work pattern recognition
- Evidence quality assessment
- Advanced classification
- Image analysis
- Voice transcription improvements

**Evidence Archive**
- Evidence portfolio export
- Timeline export
- Alumni access
- Long-term storage

**Advanced Automation**
- Auto-report generation scheduling
- Evidence auto-categorization
- Weekly summary auto-refinement
- Report auto-submission

**Institution Integration**
- Institution-specific formatting
- Direct submission to institutions
- Institution feedback loop
- Compliance checking

---

## 11. IMPLEMENTATION ORDER

### WEEK 1

**Database Tasks**
- Modify uploads table → evidence table (add classification fields)
- Rename logbook_entries → activities table (add auto-generation fields)
- Create weekly_summaries table
- Create evidence_relationships table
- Create evidence_citations table
- Create report_completeness table
- Rename activity_events → timeline_events table
- Delete weekly_logs table
- Delete activity_logs table
- Add indexes to all new tables
- Create foreign key constraints

**Backend Tasks**
- Implement ClassificationService
- Implement ActivityGenerationService
- Implement WeekCalculationService
- Implement evidence processing queue
- Implement activity generation trigger
- Implement timeline event trigger
- Create capture APIs (text, image, voice, document)

**Frontend Tasks**
- Remove dashboard right panel
- Remove ActiveReportCard
- Remove QuickActionsCard
- Remove StudentIdentityCard
- Make QuickCapture first and largest element
- Simplify dashboard to 2-column layout
- Implement QuickCapture 3-tap flow
- Add evidence preview on capture

**AI Tasks**
- Implement text classification model
- Implement image classification model
- Implement activity title generation
- Implement confidence scoring

**Testing Tasks**
- Test evidence capture flow
- Test classification accuracy
- Test activity generation
- Test dashboard hierarchy
- Test mobile layout

**Deployment Tasks**
- Deploy database migrations
- Deploy backend services
- Deploy frontend changes
- Monitor classification accuracy
- Monitor capture success rate

---

### WEEK 2

**Database Tasks**
- Modify reports table (add evidence_completeness fields)
- Modify report_sections table (add evidence_citation field)
- Create evidence_quality_scores table
- Add triggers for auto-generation
- Add RLS policies for new tables

**Backend Tasks**
- Implement WeeklySummaryService
- Implement SummarizationService
- Implement EvidenceCitationService
- Implement weekly summary generation job
- Implement evidence quality scoring job
- Implement evidence APIs (list, get, delete)
- Implement activity APIs (list, get, update)

**Frontend Tasks**
- Implement Recent Evidence timeline
- Implement Current Week Summary
- Add evidence completeness visualization
- Add classification confidence display
- Add manual classification override
- Optimize for mobile (320px, 375px, 390px, 430px)

**AI Tasks**
- Implement weekly summary generation
- Implement evidence citation algorithm
- Implement evidence quality scoring
- Implement gap detection

**Testing Tasks**
- Test weekly summary generation
- Test evidence citation
- Test quality scoring
- Test mobile responsiveness
- Test timeline view

**Deployment Tasks**
- Deploy database migrations
- Deploy backend services
- Deploy frontend changes
- Monitor summary generation accuracy
- Monitor mobile performance

---

### WEEK 3

**Database Tasks**
- Add report_completeness table
- Add evidence relationship tracking
- Add evidence provenance tracking
- Add missing evidence detection fields
- Optimize indexes for performance

**Backend Tasks**
- Implement ReportGenerationService
- Implement SectionMappingService
- Implement FormattingService
- Implement ReportCompletenessService
- Implement MissingEvidenceDetectionService
- Implement report generation queue
- Implement logbook APIs (get, weekly summary, regenerate)
- Implement report APIs (generate, completeness, sections)

**Frontend Tasks**
- Destroy 7-step report wizard
- Implement "Generate from Evidence" button
- Implement validation step UI
- Implement generation step UI
- Implement review step UI
- Implement export step UI
- Add gap visualization
- Add missing evidence detection UI

**AI Tasks**
- Implement report section generation
- Implement evidence-driven generation
- Implement institution formatting
- Implement completeness validation

**Testing Tasks**
- Test report generation flow
- Test validation step
- Test generation step
- Test review step
- Test export step
- Test completeness scoring

**Deployment Tasks**
- Deploy database migrations
- Deploy backend services
- Deploy frontend changes
- Monitor report generation success rate
- Monitor generation time

---

### WEEK 4

**Database Tasks**
- Performance optimization
- Index tuning
- Query optimization
- Data migration (existing data)
- Backup and recovery testing

**Backend Tasks**
- Implement export APIs (generate, get)
- Implement PDFGenerationService
- Implement PortfolioGenerationService
- Implement TimelineGenerationService
- Implement realtime events (evidence, activities, reports)
- Implement webhook system
- Implement retry strategies
- Implement failure handling

**Frontend Tasks**
- Simplify settings to single page
- Remove Notifications tab
- Remove Security tab
- Remove logbook search + filters
- Change reports to responsive grid
- Ensure all screens mobile-first
- Add thumb reachability optimization
- Add one-handed capture mode
- Add offline capture queue

**AI Tasks**
- Implement evidence relationship engine
- Implement evidence reuse engine
- Implement advanced classification
- Implement work pattern recognition (basic)

**Testing Tasks**
- End-to-end testing
- Performance testing
- Mobile testing (all sizes)
- Load testing
- Security testing
- User acceptance testing

**Deployment Tasks**
- Deploy all changes
- Monitor all systems
- Performance tuning
- Bug fixes
- Documentation
- Training materials

---

## 12. ARCHITECTURE RISKS

### TOP 20 ARCHITECTURE RISKS

**Risk 1: Classification Accuracy**
- Severity: HIGH
- Probability: MEDIUM
- Mitigation: Start with simple classification, improve over time, allow manual override
- Owner: AI Engineer

**Risk 2: Evidence Completeness Validation**
- Severity: HIGH
- Probability: MEDIUM
- Mitigation: Start with lenient validation, tighten based on feedback, allow manual override
- Owner: Backend Engineer

**Risk 3: Auto-Generation Quality**
- Severity: HIGH
- Probability: HIGH
- Mitigation: Focus on evidence-driven generation, allow extensive refinement, iterate quickly
- Owner: AI Engineer

**Risk 4: Mobile-First Adoption**
- Severity: MEDIUM
- Probability: MEDIUM
- Mitigation: Test extensively on mobile, optimize for thumb reachability, gather user feedback
- Owner: Mobile Engineer

**Risk 5: Data Migration**
- Severity: HIGH
- Probability: LOW
- Mitigation: Test migration on staging, backup production data, rollback plan
- Owner: Database Engineer

**Risk 6: Performance Degradation**
- Severity: MEDIUM
- Probability: MEDIUM
- Mitigation: Index optimization, query optimization, caching, load testing
- Owner: Backend Engineer

**Risk 7: Queue Processing Failures**
- Severity: MEDIUM
- Probability: MEDIUM
- Mitigation: Retry strategies, dead letter queue, monitoring, alerting
- Owner: Backend Engineer

**Risk 8: Realtime Event Latency**
- Severity: LOW
- Probability: MEDIUM
- Mitigation: Optimize event payload, use efficient pub/sub, monitor latency
- Owner: Backend Engineer

**Risk 9: Evidence Storage Costs**
- Severity: MEDIUM
- Probability: MEDIUM
- Mitigation: Implement retention policies, compress old evidence, use CDN
- Owner: Infrastructure Engineer

**Risk 10: Report Generation Time**
- Severity: MEDIUM
- Probability: MEDIUM
- Mitigation: Optimize AI generation, use caching, parallel processing, progress indicators
- Owner: AI Engineer

**Risk 11: Student Data Privacy**
- Severity: HIGH
- Probability: LOW
- Mitigation: Implement RLS, encrypt sensitive data, audit logs, compliance checks
- Owner: Security Engineer

**Risk 12: API Rate Limiting**
- Severity: LOW
- Probability: MEDIUM
- Mitigation: Implement rate limiting, caching, efficient queries, monitoring
- Owner: Backend Engineer

**Risk 13: Database Schema Changes**
- Severity: HIGH
- Probability: LOW
- Mitigation: Use migrations, test on staging, rollback plan, backward compatibility
- Owner: Database Engineer

**Risk 14: Evidence Graph Complexity**
- Severity: MEDIUM
- Probability: MEDIUM
- Mitigation: Start with simple relationships, iterate gradually, monitor performance
- Owner: Backend Engineer

**Risk 15: User Adoption**
- Severity: HIGH
- Probability: MEDIUM
- Mitigation: User testing, feedback loops, onboarding improvements, support documentation
- Owner: Product Manager

**Risk 16: Third-Party Service Dependencies**
- Severity: MEDIUM
- Probability: LOW
- Mitigation: Implement fallbacks, caching, monitoring, service level agreements
- Owner: Infrastructure Engineer

**Risk 17: Concurrent Evidence Capture**
- Severity: LOW
- Probability: MEDIUM
- Mitigation: Implement optimistic locking, queue processing, conflict resolution
- Owner: Backend Engineer

**Risk 18: Evidence Quality Scoring**
- Severity: MEDIUM
- Probability: MEDIUM
- Mitigation: Start with simple scoring, improve over time, allow manual override
- Owner: AI Engineer

**Risk 19: Report Export Failures**
- Severity: MEDIUM
- Probability: LOW
- Mitigation: Retry strategies, alternative export methods, error logging, user notification
- Owner: Backend Engineer

**Risk 20: Timeline Event Volume**
- Severity: LOW
- Probability: MEDIUM
- Mitigation: Implement retention policies, partitioning, archiving, monitoring
- Owner: Database Engineer

---

## CONCLUSION

This architecture specification defines the complete evidence-first implementation for Vemiq. All decisions are final and implementation-ready. The architecture shifts Vemiq from report-first to evidence-first, with evidence as the source of truth and all other entities derived from evidence.

**Core Principle**: Evidence is the source of truth. Activities, Logbooks, Weekly Summaries, Reports and Exports are all derived from evidence.

**Implementation Timeline**: 4 weeks
**Success Criteria**: Evidence capture < 10 seconds, Report generation < 60 minutes, Evidence completeness > 80%

**Next Step**: Begin Week 1 implementation starting with database migrations and evidence capture system.
