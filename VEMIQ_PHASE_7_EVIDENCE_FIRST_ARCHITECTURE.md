# VEMIQ PHASE 7 — EVIDENCE-FIRST ARCHITECTURE REDESIGN

**Date**: July 7, 2026
**Architectural Perspective**: Product Architecture, Systems Design, Platform Strategy
**Core Principle**: Evidence is the source of truth. Everything else is derived.

---

## EXECUTIVE SUMMARY

Vemiq currently operates as a report generation tool (Report → Evidence). This architecture document redesigns Vemiq as an evidence operating system (Evidence → Timeline → Knowledge → Report).

**Current State**: Report-first workflow, 52/100 evidence infrastructure score
**Target State**: Evidence-first workflow, 75+/100 evidence infrastructure score
**Strategic Shift**: From "AI report writer" to "evidence layer for student work"

**Key Insight**: Vemiq's moat is not report generation. Vemiq's moat is becoming the evidence layer for student work.

---

## TASK 1 — VEMIQ OBJECT MODEL

### ENTITY HIERARCHY

#### PRIMARY ENTITIES (First-Class)

**Evidence**
- Definition: Raw captured data (text, voice, image, document)
- Source of truth: YES
- Can exist independently: YES
- Derived from: NOTHING (it is the source)
- Creates: Activities, Logbook entries, Report sections
- Lifecycle: Capture → Storage → Classification → Retrieval → Reuse → Archive

**Student**
- Definition: User entity with profile and training context
- Source of truth: YES
- Can exist independently: YES
- Derived from: NOTHING
- Creates: Evidence, Activities, Logbooks, Reports
- Lifecycle: Onboarding → Capture → Report → Export → Alumni

**Institution**
- Definition: Academic institution (university, polytechnic)
- Source of truth: YES
- Can exist independently: YES
- Derived from: NOTHING
- Creates: Training context for students
- Lifecycle: Static reference

**Organization**
- Definition: Training organization where student is placed
- Source of truth: YES
- Can exist independently: YES
- Derived from: NOTHING
- Creates: Training context, institutional knowledge
- Lifecycle: Static reference with knowledge accumulation

#### DERIVED ENTITIES (Second-Class)

**Activity**
- Definition: Structured representation of evidence with context
- Source of truth: NO
- Can exist independently: NO
- Derived from: Evidence + Student + Organization
- Creates: Logbook entries, Timeline events
- Lifecycle: Evidence → Activity → Logbook → Report

**Logbook**
- Definition: Container for activities over a training period
- Source of truth: NO
- Can exist independently: NO
- Derived from: Student + Organization + Activities
- Creates: Report sections, Weekly summaries
- Lifecycle: Activities → Logbook → Report → Export

**Report**
- Definition: Final deliverable generated from evidence
- Source of truth: NO
- Can exist independently: NO (should not)
- Derived from: Logbook + Evidence + Student + Organization
- Creates: Export (PDF)
- Lifecycle: Logbook → Report → Export

**Export**
- Definition: Formatted output (PDF, portfolio, timeline)
- Source of truth: NO
- Can exist independently: NO
- Derived from: Report or Evidence
- Creates: NOTHING (final output)
- Lifecycle: Report → Export

#### VIOLATIONS IDENTIFIED

**Current Violation**: Reports can exist without evidence
- **Problem**: Report sections can be created without linked logbook entries
- **Fix**: Enforce evidence requirement for report creation
- **Architecture Change**: Add evidence completeness check before report generation

**Current Violation**: Evidence is not the source of truth
- **Problem**: Workflow starts with report creation, not evidence capture
- **Fix**: Shift workflow to start with evidence capture
- **Architecture Change**: Make evidence capture the primary entry point

**Current Violation**: Activities are not derived from evidence
- **Problem**: Activity events are manually logged, not derived from evidence
- **Fix**: Auto-generate activities from evidence
- **Architecture Change**: Evidence → Activity pipeline

---

## TASK 2 — EVIDENCE LIFECYCLE

### EVIDENCE LIFECYCLE MAP

#### STAGE 1: CAPTURE

**Inputs**:
- Student intent (what to capture)
- Evidence type (text, voice, image, document)
- Context (date, location, activity)

**Outputs**:
- Raw evidence file
- Evidence metadata (type, size, timestamp)
- Context tags (auto-inferred)

**Automation Opportunities**:
- Auto-capture date/time
- Auto-infer evidence type
- Auto-generate activity title from evidence
- Auto-link to current logbook
- Auto-categorize by type

**Student Effort**: 5-10 seconds

**Current Implementation**: PARTIAL
- Capture mechanisms exist
- Auto-inference missing
- Auto-linkage missing

---

#### STAGE 2: STORAGE

**Inputs**:
- Raw evidence file
- Evidence metadata
- Context tags

**Outputs**:
- Stored evidence in unified storage
- Indexed evidence record
- Evidence ID for reference

**Automation Opportunities**:
- Auto-index by type, date, student
- Auto-generate thumbnail for images
- Auto-transcribe voice to text
- Auto-extract text from documents
- Auto-duplicate detection

**Student Effort**: 0 seconds (fully automated)

**Current Implementation**: GOOD
- Unified storage exists
- Indexing exists
- Missing: auto-transcription, auto-extraction

---

#### STAGE 3: CLASSIFICATION

**Inputs**:
- Stored evidence
- Evidence metadata
- Student profile
- Organization knowledge

**Outputs**:
- Categorized evidence
- Activity type (work, learning, observation)
- Week number assignment
- Quality score

**Automation Opportunities**:
- Auto-classify by content analysis
- Auto-assign week number from logbook dates
- Auto-score evidence quality
- Auto-detect work patterns
- Auto-tag with organization context

**Student Effort**: 0 seconds (fully automated)

**Current Implementation**: MISSING
- No classification system
- No quality scoring
- No pattern recognition

---

#### STAGE 4: RETRIEVAL

**Inputs**:
- Student query (search, filter, browse)
- Evidence graph
- Timeline context

**Outputs**:
- Relevant evidence
- Evidence timeline
- Evidence relationships
- Evidence usage history

**Automation Opportunities**:
- Auto-suggest relevant evidence
- Auto-group by week/activity
- Auto-show evidence relationships
- Auto-highlight gaps
- Auto-generate evidence summary

**Student Effort**: 5-15 seconds

**Current Implementation**: PARTIAL
- Search exists
- Missing: evidence graph, relationships, suggestions

---

#### STAGE 5: REUSE

**Inputs**:
- Retrieved evidence
- New context (report section, logbook entry)
- Evidence relationships

**Outputs**:
- Evidence linked to new context
- Evidence usage tracked
- Evidence provenance updated

**Automation Opportunities**:
- Auto-suggest evidence for reports
- Auto-link evidence to logbook entries
- Auto-track evidence usage
- Auto-prevent duplicate usage
- Auto-show evidence history

**Student Effort**: 5-10 seconds

**Current Implementation**: MISSING
- No evidence reuse
- No usage tracking
- No provenance

---

#### STAGE 6: REPORT GENERATION

**Inputs**:
- Evidence archive
- Logbook entries
- Student profile
- Organization knowledge
- Report structure

**Outputs**:
- Report sections
- Weekly summaries
- Activity descriptions
- Evidence citations

**Automation Opportunities**:
- Auto-generate sections from evidence
- Auto-summarize weekly activities
- Auto-cite evidence in reports
- auto-validate evidence completeness
- Auto-detect missing evidence

**Student Effort**: 30-60 minutes (review and refinement)

**Current Implementation**: PARTIAL
- AI generation exists
- Missing: evidence-driven generation
- Missing: auto-citation
- Missing: completeness validation

---

#### STAGE 7: ARCHIVE

**Inputs**:
- Complete evidence archive
- Generated reports
- Student profile
- Timeline data

**Outputs**:
- Evidence portfolio
- Timeline export
- Evidence summary
- Long-term storage

**Automation Opportunities**:
- Auto-generate evidence portfolio
- Auto-export timeline
- Auto-create evidence summary
- Auto-archive for alumni access
- auto-generate insights report

**Student Effort**: 0 seconds (fully automated)

**Current Implementation**: MISSING
- No evidence archive
- No portfolio export
- No alumni access

---

## TASK 3 — STUDENT JOURNEY MAP

### EVIDENCE-FIRST STUDENT JOURNEY

#### DAY 1: Onboarding & First Capture

**Current Journey**:
1. Sign up
2. Fill profile
3. Navigate to dashboard
4. See empty state
5. Navigate to reports
6. Create report
7. Fill wizard

**Evidence-First Journey**:
1. Sign up
2. Fill profile (institution, organization, dates)
3. See "Capture Today's Activity" as primary action
4. Capture first evidence (text/voice/image)
5. See evidence auto-classified and added to timeline
6. See evidence auto-linked to Week 1
7. See "Continue capturing" prompt

**Key Shift**: First action is capture, not report creation

**Outcome**: Student builds evidence from Day 1

---

#### WEEK 1: Evidence Accumulation

**Current Journey**:
1. Navigate to dashboard
2. See training status
3. Navigate to logbook
4. Create logbook entry manually
5. Upload evidence manually
6. Link evidence manually

**Evidence-First Journey**:
1. Open app → see "Capture" as primary action
2. Capture daily evidence (2-3 taps)
3. Evidence auto-classified and added to timeline
4. See Week 1 evidence accumulating
5. See auto-generated weekly summary
6. See evidence quality score
7. See gaps highlighted (missing days)

**Key Shift**: Daily capture is frictionless, weekly summary is automatic

**Outcome**: Student builds complete Week 1 evidence archive

---

#### WEEK 8: Evidence Review & Report Initiation

**Current Journey**:
1. Navigate to reports
2. Create report
3. Fill 7-step wizard
4. Manually enter weekly logs
5. Manually select evidence
6. Generate report
7. Review and export

**Evidence-First Journey**:
1. See "Generate Report from Evidence" action
2. System auto-validates evidence completeness
3. System auto-generates report structure
4. System auto-pulls weekly summaries from evidence
5. System auto-cites evidence in report
6. Student reviews and refines (30-60 minutes)
7. Export report

**Key Shift**: Report is generated from evidence, not manually created

**Outcome**: Report is evidence-driven, complete, and citable

---

#### REPORT SUBMISSION: Evidence Archive Export

**Current Journey**:
1. Export report PDF
2. Submit to institution
3. Done

**Evidence-First Journey**:
1. Export report PDF
2. Auto-generate evidence portfolio
3. Auto-export evidence timeline
4. Submit report to institution
5. Keep evidence archive for future reference
6. Access evidence archive as alumni

**Key Shift**: Student gets both report AND evidence archive

**Outcome**: Long-term value beyond report submission

---

#### AFTER SIWES ENDS: Alumni Value

**Current Journey**:
1. Account inactive
2. No value after report
3. Student churns

**Evidence-First Journey**:
1. Evidence archive accessible
2. Evidence portfolio for job applications
3. Evidence timeline for reference
4. Evidence insights for future work
5. Student retains value

**Key Shift**: Evidence has long-term value beyond SIWES

**Outcome**: Student retention, alumni engagement

---

## TASK 4 — EVIDENCE MOAT ANALYSIS

### WHY CHATGPT CANNOT CLONE VEMIQ

**ChatGPT Can Clone**:
- AI report generation
- Text rewriting
- Grammar improvement
- Section generation

**ChatGPT Cannot Clone**:
- Evidence graph across student journey
- Institutional knowledge integration
- Work pattern recognition
- Evidence quality assessment
- Evidence completeness tracking
- Evidence timeline
- Evidence archive
- Evidence portfolio

**Reason**: ChatGPT has no persistent evidence layer, no student context, no institutional knowledge, no longitudinal tracking.

---

### WHY CLAUDE CANNOT CLONE VEMIQ

**Claude Can Clone**:
- AI writing assistance
- Document analysis
- Text generation

**Claude Cannot Clone**:
- Evidence capture workflow
- Evidence storage infrastructure
- Evidence classification system
- Evidence retrieval system
- Evidence reuse system
- Evidence-driven report generation

**Reason**: Claude has no evidence infrastructure, no capture workflow, no storage system, no classification pipeline.

---

### WHY GENERIC AI REPORT GENERATORS CANNOT CLONE VEMIQ

**Generic AI Can Clone**:
- Report templates
- AI writing
- PDF generation

**Generic AI Cannot Clone**:
- Evidence-first workflow
- Evidence graph
- Institutional knowledge base
- Work pattern recognition
- Evidence quality scoring
- Evidence completeness validation
- Evidence archive export
- Evidence portfolio

**Reason**: Generic AI tools are report-first, not evidence-first. They have no evidence infrastructure, no longitudinal tracking, no institutional context.

---

### VEMIQ'S TRUE MOAT

**Unique Datasets**:
1. Evidence graph across student journeys
2. Institutional knowledge base (organization_knowledge table)
3. Work patterns from thousands of students
4. Evidence quality benchmarks
5. Evidence completeness standards

**Unique Workflows**:
1. Evidence-first capture workflow
2. Evidence → Activity → Logbook → Report pipeline
3. Evidence classification and scoring
4. Evidence reuse and provenance
5. Evidence archive and portfolio

**Unique Intelligence**:
1. Work pattern recognition
2. Evidence quality assessment
3. Evidence completeness detection
4. Weekly summary generation from evidence
5. Gap detection in evidence timeline

**Unique Infrastructure**:
1. Unified evidence storage
2. Evidence graph and relationships
3. Evidence provenance tracking
4. Evidence usage tracking
5. Evidence timeline and archive

---

### MOAT STRENGTHENING ROADMAP

**Phase 1**: Build Evidence Graph
- Track evidence relationships
- Track evidence provenance
- Track evidence usage
- **Moat Impact**: HIGH

**Phase 2**: Implement Evidence Intelligence
- Work pattern recognition
- Evidence quality scoring
- Evidence completeness detection
- **Moat Impact**: HIGH

**Phase 3**: Leverage Institutional Knowledge
- Use organization_knowledge for reports
- Build institutional knowledge base
- Create organization-specific insights
- **Moat Impact**: MEDIUM

**Phase 4**: Create Evidence Archive
- Evidence portfolio export
- Evidence timeline export
- Evidence summary generation
- **Moat Impact**: MEDIUM

---

## TASK 5 — AUTOMATION PIPELINE MAP

### PIPELINE 1: EVIDENCE → ACTIVITY

**Current State**: Manual activity logging
**Target State**: Auto-generated activities from evidence

**Inputs**:
- Raw evidence (text, voice, image, document)
- Evidence metadata (type, timestamp)
- Student profile
- Organization context

**Automation Steps**:
1. Analyze evidence content
2. Infer activity type (work, learning, observation)
3. Generate activity title
4. Extract activity description
5. Assign to week number
6. Link to organization context

**Manual Work**: 0%
**Automated Work**: 100%

**Data Required**:
- Evidence content
- Student profile
- Organization knowledge
- Logbook dates

**Expected Student Effort**: 0 seconds

**Implementation Priority**: HIGH

---

### PIPELINE 2: ACTIVITY → LOGBOOK

**Current State**: Manual logbook entry creation
**Target State**: Auto-generated logbook entries from activities

**Inputs**:
- Activities (from evidence)
- Logbook container
- Week number
- Student profile

**Automation Steps**:
1. Group activities by week
2. Generate weekly summary
3. Create logbook entry
4. Link evidence to entry
5. Score entry quality
6. Detect gaps

**Manual Work**: 10% (review and refinement)
**Automated Work**: 90%

**Data Required**:
- Activities
- Logbook dates
- Evidence

**Expected Student Effort**: 5-10 minutes per week (review)

**Implementation Priority**: HIGH

---

### PIPELINE 3: LOGBOOK → WEEKLY SUMMARY

**Current State**: Manual weekly log entry in report wizard
**Target State**: Auto-generated weekly summaries from logbook

**Inputs**:
- Logbook entries
- Evidence linked to entries
- Week number
- Organization context

**Automation Steps**:
1. Extract activities from logbook entries
2. Summarize activities
3. Cite evidence
4. Add organization context
5. Format for report
6. Validate completeness

**Manual Work**: 20% (review and refinement)
**Automated Work**: 80%

**Data Required**:
- Logbook entries
- Evidence
- Organization knowledge

**Expected Student Effort**: 5-10 minutes per week (review)

**Implementation Priority**: HIGH

---

### PIPELINE 4: WEEKLY SUMMARY → REPORT SECTION

**Current State**: Manual report section creation
**Target State**: Auto-generated report sections from weekly summaries

**Inputs**:
- Weekly summaries
- Report structure
- Student profile
- Organization knowledge

**Automation Steps**:
1. Map weekly summaries to report sections
2. Generate section content
3. Add citations
4. Add student context
5. Add organization context
6. Format per institution standards

**Manual Work**: 30% (review and refinement)
**Automated Work**: 70%

**Data Required**:
- Weekly summaries
- Report structure
- Student profile
- Organization knowledge

**Expected Student Effort**: 30-60 minutes total (review)

**Implementation Priority**: HIGH

---

### PIPELINE 5: REPORT SECTION → FINAL REPORT

**Current State**: Manual report assembly
**Target State**: Auto-assembled report from sections

**Inputs**:
- Report sections
- Report structure
- Student profile
- Institution standards

**Automation Steps**:
1. Assemble sections in order
2. Add front matter (title page, abstract, etc.)
3. Add back matter (references, appendices)
4. Format per institution standards
5. Validate completeness
6. Generate PDF

**Manual Work**: 10% (final review)
**Automated Work**: 90%

**Data Required**:
- Report sections
- Report structure
- Institution standards

**Expected Student Effort**: 10-15 minutes (final review)

**Implementation Priority**: MEDIUM

---

## TASK 6 — MINIMUM EVIDENCE-FIRST MVP

### MVP SCOPE

**Goal**: Validate evidence-first behavior with minimal implementation

**What Can Be Removed**:
- 7-step report wizard → Reduce to 1-step "Generate from Evidence"
- Manual student info entry → Auto-fill from profile
- Manual weekly log entry → Auto-generate from evidence
- Manual evidence linkage → Auto-link evidence to activities
- Settings tabs → Simplify to single page
- Right panel → Remove entirely
- Search + filters → Remove from logbook

**What Can Be Simplified**:
- Dashboard → Single action: "Capture Today's Activity"
- Reports → List view with "Generate from Evidence" button
- Logbook → Timeline view of evidence
- Settings → Profile only

**What Can Be Automated**:
- Evidence capture → Auto-classify and auto-link
- Evidence → Activity → Auto-generate activities
- Activity → Logbook → Auto-create logbook entries
- Logbook → Report → Auto-generate weekly summaries
- Report → Export → Auto-assemble and export

**Fastest Path to Validation**:
1. Implement evidence capture as primary action
2. Implement auto-classification of evidence
3. Implement auto-generation of activities from evidence
4. Implement auto-generation of logbook entries from activities
5. Implement auto-generation of weekly summaries from logbook
6. Implement "Generate from Evidence" button

**MVP Success Metrics**:
- Students capture evidence within 10 seconds
- Students generate reports from evidence in 30 minutes
- Evidence completeness > 80%
- Student satisfaction with evidence-first workflow

**MVP Timeline**: 4-6 weeks

---

## TASK 7 — PHASED EXECUTION PLAN

### PHASE 7A — ARCHITECTURE (Weeks 1-2)

**Goal**: Redesign data model and workflow to evidence-first

**Deliverables**:
- Evidence-first data model schema
- Evidence lifecycle documentation
- Automation pipeline specifications
- Student journey map

**Success Metrics**:
- Data model approved
- Workflow documented
- Pipelines specified
- Journey mapped

**Risk**: LOW (architecture only, no code)

**Effort**: HIGH (strategic thinking)

---

### PHASE 7B — CAPTURE LAYER (Weeks 3-4)

**Goal**: Implement evidence capture as primary action

**Deliverables**:
- Quick Capture as dashboard primary action
- Evidence capture UI (text, voice, image, document)
- Auto-classification of evidence
- Auto-linkage to logbook

**Success Metrics**:
- Capture time < 10 seconds
- Auto-classification accuracy > 80%
- Auto-linkage success > 90%

**Risk**: MEDIUM (UI changes)

**Effort**: HIGH (capture + classification)

---

### PHASE 7C — EVIDENCE PIPELINE (Weeks 5-8)

**Goal**: Implement evidence → activity → logbook pipeline

**Deliverables**:
- Evidence → Activity automation
- Activity → Logbook automation
- Logbook → Weekly Summary automation
- Evidence timeline view
- Evidence quality scoring

**Success Metrics**:
- Auto-generation accuracy > 75%
- Quality scoring accuracy > 70%
- Timeline view functional

**Risk**: HIGH (complex automation)

**Effort**: VERY HIGH (multiple pipelines)

---

### PHASE 7D — INTELLIGENCE LAYER (Weeks 9-12)

**Goal**: Implement evidence intelligence

**Deliverables**:
- Work pattern recognition
- Evidence completeness detection
- Gap detection in timeline
- Evidence insights
- Institutional knowledge integration

**Success Metrics**:
- Pattern recognition accuracy > 70%
- Completeness detection accuracy > 80%
- Gap detection accuracy > 75%

**Risk**: VERY HIGH (AI/ML complexity)

**Effort**: VERY HIGH (intelligence systems)

---

### PHASE 7E — ARCHIVE & PORTFOLIO LAYER (Weeks 13-14)

**Goal**: Implement evidence archive and portfolio

**Deliverables**:
- Evidence portfolio export
- Evidence timeline export
- Evidence summary generation
- Alumni access to evidence
- Long-term storage

**Success Metrics**:
- Portfolio export functional
- Timeline export functional
- Alumni access functional

**Risk**: MEDIUM (export systems)

**Effort**: MEDIUM (export + storage)

---

## CRITICAL VIOLATIONS IDENTIFIED

### VIOLATION #1: Reports Can Exist Without Evidence

**Current State**: Report sections can be created without linked evidence
**Violation**: Evidence should be required for report creation
**Fix**: Add evidence completeness check before report generation
**Priority**: CRITICAL

### VIOLATION #2: Workflow Starts With Report Creation

**Current State**: Primary action is "Create Report"
**Violation**: Primary action should be "Capture Evidence"
**Fix**: Shift dashboard to evidence-first, make capture primary action
**Priority**: CRITICAL

### VIOLATION #3: Activities Are Not Derived From Evidence

**Current State**: Activity events are manually logged
**Violation**: Activities should be auto-generated from evidence
**Fix**: Implement evidence → activity pipeline
**Priority**: HIGH

### VIOLATION #4: Evidence Has No Long-Term Value

**Current State**: Evidence is only used for report generation
**Violation**: Evidence should have long-term value (archive, portfolio)
**Fix**: Implement evidence archive and portfolio export
**Priority**: HIGH

### VIOLATION #5: No Evidence Graph

**Current State**: Evidence has no relationships or provenance
**Violation**: Evidence should have graph, relationships, provenance
**Fix**: Implement evidence graph and tracking
**Priority**: HIGH

---

## STRATEGIC POSITIONING

### CURRENT POSITION

**What Vemiq Is Today**:
- AI report generator
- Report-first workflow
- Generic SaaS dashboard
- Commodity AI writing

**Competitive Position**: WEAK
- Easy to clone
- No unique moat
- Commodity features

### TARGET POSITION

**What Vemiq Should Become**:
- Evidence operating system
- Evidence-first workflow
- Evidence infrastructure
- Unique evidence moat

**Competitive Position**: STRONG
- Hard to clone (evidence graph)
- Unique moat (institutional knowledge)
- Defensible infrastructure

### POSITIONING SHIFT

**From**: Feature (AI report writer)
**To**: Platform (evidence infrastructure)

**From**: Short-term value (report generation)
**To**: Long-term value (evidence archive)

**From**: Commodity (AI writing)
**To**: Unique (evidence graph + institutional knowledge)

---

## CONCLUSION

This architecture redesign shifts Vemiq from a report generation tool to an evidence operating system. The core principle is that evidence is the source of truth, and everything else (activities, logbooks, reports, exports) is derived from evidence.

**Key Shifts**:
1. Report-first → Evidence-first workflow
2. Manual → Automated pipelines
3. Short-term → Long-term value
4. Commodity → Unique moat
5. Feature → Platform

**Expected Outcome**:
- Evidence Infrastructure Score: 75+/100
- Student capture time: < 10 seconds
- Report generation time: 30-60 minutes
- Evidence completeness: > 80%
- Student retention: Increased (long-term value)

**Strategic Impact**: This shift positions Vemiq as the evidence layer for student work, creating a defensible moat that cannot be easily cloned by ChatGPT, Claude, or generic AI report generators.

**Next Step**: Execute Phase 7A (Architecture) to finalize data model and workflow specifications before implementation.
