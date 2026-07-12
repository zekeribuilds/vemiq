# VEMIQ PHASE 7A.1 — EVIDENCE-FIRST MVP REDUCTION EXECUTION AUDIT

**Date**: July 7, 2026
**Architectural Perspective**: Senior Product Architect, UX Architect, Systems Designer, Startup Product Strategist, Mobile-First SaaS Auditor
**Core Objective**: Transform Vemiq from report-first to evidence-first with smallest possible MVP

---

## 1. EXECUTIVE SUMMARY

Vemiq currently operates as a report generation tool with significant friction. The dashboard feels like a SaaS admin dashboard, report creation starts with a 7-step wizard, and evidence capture is secondary to report generation.

**Current State**: Report-first workflow, excessive manual work, desktop-first patterns
**Target State**: Evidence-first workflow, minimal friction, mobile-first capture

**Key Insight**: Vemiq's moat is becoming the evidence layer for student work. The smallest evidence-first MVP should validate this hypothesis within 4 weeks.

**Primary Objective**: Reduce entire product to smallest possible evidence-first workflow. Optimize for speed, clarity, student outcomes, evidence accumulation.

---

## 2. PRODUCT REDUCTION AUDIT

### MUST KEEP

**Features absolutely required for Evidence → Activity → Logbook → Report:**

1. **Evidence Capture** (QuickCapture component)
   - Location: `src/components/workspace/QuickCapture.tsx`
   - Required for: Evidence → Activity pipeline
   - Keep: 2x2 grid (text, voice, image, document)

2. **Logbook Entry Creation**
   - Location: `src/app/dashboard/logbook/page.tsx`
   - Required for: Activity → Logbook pipeline
   - Keep: Entry creation, but simplify

3. **Report Generation**
   - Location: `src/app/dashboard/reports/create/page.tsx`
   - Required for: Logbook → Report pipeline
   - Keep: AI generation, but destroy wizard

4. **Profile Data**
   - Location: `src/app/dashboard/settings/page.tsx` (Profile tab)
   - Required for: Auto-fill student info
   - Keep: Profile fields only

5. **Evidence Storage**
   - Location: Database tables `uploads`, `logbook_evidence`
   - Required for: Evidence persistence
   - Keep: Unified storage

6. **Activity Tracking**
   - Location: Database table `activity_events`
   - Required for: Evidence → Activity pipeline
   - Keep: Activity logging

---

### MUST REMOVE

**Features creating friction:**

1. **Dashboard Right Panel**
   - Location: `src/app/dashboard/layout.tsx` (lines 38-85)
   - Why creates friction: Duplicates navigation, creates SaaS admin dashboard feel, distracts from capture
   - Recommended removal: Delete entire right panel (Quick Actions, Recent Activity Summary, AI Shortcuts)

2. **7-Step Report Wizard**
   - Location: `src/app/dashboard/reports/create/page.tsx` (lines 14-37)
   - Why creates friction: Excessive manual work, report-first workflow, students must retype information
   - Recommended removal: Destroy wizard, replace with "Generate from Evidence" single action

3. **Settings Notifications Tab**
   - Location: `src/app/dashboard/settings/page.tsx` (lines 329-403)
   - Why creates friction: Unnecessary for students, enterprise admin panel feel
   - Recommended removal: Delete Notifications tab entirely

4. **Settings Security Tab**
   - Location: `src/app/dashboard/settings/page.tsx` (lines 405-448)
   - Why creates friction: Rarely needed, enterprise admin panel feel
   - Recommended removal: Delete Security tab entirely

5. **Logbook Search + Filters**
   - Location: `src/app/dashboard/logbook/page.tsx` (lines 146-181)
   - Why creates friction: CMS-like behavior, personal logbook doesn't need search/filters
   - Recommended removal: Delete search bar and filter buttons

6. **StudentIdentityCard on Dashboard**
   - Location: `src/app/dashboard/page.tsx` (lines 228-236)
   - Why creates friction: Reference information, not primary action, clutters dashboard
   - Recommended removal: Move to Settings only, remove from dashboard

7. **ActiveReportCard on Dashboard**
   - Location: `src/app/dashboard/page.tsx` (lines 205-214)
   - Why creates friction: Report-first behavior, distracts from capture
   - Recommended removal: Replace with "Generate from Evidence" button

8. **QuickActionsCard on Dashboard**
   - Location: `src/app/dashboard/page.tsx` (lines 217-222)
   - Why creates friction: Duplicates QuickCapture, creates decision paralysis
   - Recommended removal: Delete, make QuickCapture primary

---

### MUST SIMPLIFY

**Features that should remain but require simplification:**

1. **Dashboard Layout**
   - Current implementation: 3-column (Sidebar + Main + Right Panel), multiple cards
   - Simplified implementation: 2-column (Sidebar + Main), single primary action (QuickCapture)
   - Expected impact: Reduces cognitive load, focuses on capture

2. **Settings Page**
   - Current implementation: 4 tabs (Profile, Notifications, Security, Exports)
   - Simplified implementation: Single page with collapsible sections (Profile only)
   - Expected impact: Reduces complexity, removes enterprise feel

3. **Logbook Page**
   - Current implementation: Search + filters, card-based listing
   - Simplified implementation: Timeline view, no search/filters
   - Expected impact: Evidence timeline, not CMS

4. **Reports Page**
   - Current implementation: 3-column grid, search + filters
   - Simplified implementation: List view, "Generate from Evidence" button
   - Expected impact: Evidence-driven, not document management

5. **Report Creation**
   - Current implementation: 7-step wizard with manual entry
   - Simplified implementation: 1-step "Generate from Evidence" with auto-fill
   - Expected impact: Evidence-driven, minimal manual work

---

## 3. DASHBOARD RE-ARCHITECTURE

### What should students see within first 3 seconds?

**Answer**: "Capture Today's Activity" as the primary action

**Evidence**: Current dashboard shows ActiveReportCard first (report-first behavior)

---

### What should students see within first scroll?

**Answer**: QuickCapture (primary), Recent Evidence (secondary), Current Week Summary (tertiary)

**Evidence**: Current dashboard shows multiple cards competing for attention

---

### What should disappear entirely?

**Answer**: Right panel, ActiveReportCard, QuickActionsCard, StudentIdentityCard

**Evidence**: These create SaaS admin dashboard feel and distract from capture

---

### What creates SaaS admin dashboard behavior?

**Answer**: 
- Right panel with Quick Actions, Recent Activity, AI Shortcuts
- Multiple cards competing for attention
- Report-first hierarchy (ActiveReportCard first)
- Reference information on dashboard (StudentIdentityCard)

---

### What creates evidence-first behavior?

**Answer**:
- Single primary action (QuickCapture)
- Evidence timeline view
- "Generate from Evidence" button
- Minimal reference information

---

### DASHBOARD HIERARCHY

**Level 1 (Primary Action)**
- QuickCapture (2x2 grid: Text, Voice, Image, Document)

**Level 2 (Secondary Actions)**
- Recent Evidence (timeline of captured evidence)
- Current Week Summary (auto-generated from evidence)
- Generate Report (single button: "Generate from Evidence")

**Level 3 (Reference Information)**
- Training Status (minimal: program type, progress)
- Quick Links (Logbook, Reports, Settings)

---

### IDEAL DASHBOARD SCREEN STRUCTURE

```
Header
  - Student name (minimal)
  - Training status (minimal)

Today's Progress
  - Evidence captured today (count)
  - Week progress (percentage)

Quick Capture
  - 2x2 grid: Text, Voice, Image, Document
  - Primary action, largest element

Recent Evidence
  - Timeline of captured evidence
  - Last 5-10 items
  - Auto-classified by type

Current Week Summary
  - Auto-generated from evidence
  - Evidence completeness check
  - Gap detection

Generate Report
  - Single button: "Generate from Evidence"
  - Only shown when evidence exists

Bottom Navigation
  - Capture (active)
  - Logbook
  - Reports
  - Settings
```

---

## 4. QUICK CAPTURE PRIORITIZATION

### NUMBER OF TAPS REQUIRED

**Current Flow:**

**Image Capture:**
1. Open dashboard
2. Scroll to QuickActionsCard
3. Click "Upload Images"
4. Navigate to logbook
5. Click FAB
6. Click "Take Picture"
7. Capture
**Total: 7 taps**

**Voice Capture:**
1. Open dashboard
2. Scroll to QuickActionsCard
3. Click "Open AI Assistant"
4. Navigate to chat
5. Click record
6. Record
**Total: 6 taps**

**Text Capture:**
1. Open dashboard
2. Scroll to QuickActionsCard
3. Click "Add Logbook Entry"
4. Navigate to logbook
5. Click "Add Entry"
6. Type
**Total: 6 taps**

**Document Capture:**
1. Open dashboard
2. Scroll to QuickActionsCard
3. Click "Upload Images"
4. Navigate to logbook
5. Click FAB
6. Click "Upload Image"
7. Upload
**Total: 7 taps**

---

### PROPOSED FLOW

**Image Capture:**
1. Open dashboard
2. Tap "Take Picture" (QuickCapture)
3. Capture
**Total: 3 taps**

**Voice Capture:**
1. Open dashboard
2. Tap "Record Voice Note" (QuickCapture)
3. Record
**Total: 3 taps**

**Text Capture:**
1. Open dashboard
2. Tap "Add Logbook Entry" (QuickCapture)
3. Type
**Total: 3 taps**

**Document Capture:**
1. Open dashboard
2. Tap "Upload Document" (QuickCapture)
3. Upload
**Total: 3 taps**

---

### TAP COUNT COMPARISON

| Capture Type | Current | Proposed | Reduction |
|--------------|---------|----------|-----------|
| Image | 7 taps | 3 taps | 57% |
| Voice | 6 taps | 3 taps | 50% |
| Text | 6 taps | 3 taps | 50% |
| Document | 7 taps | 3 taps | 57% |

---

### FRICTION REDUCTION

**Key Changes:**
1. Make QuickCapture first and largest element on dashboard
2. Remove navigation to logbook for capture
3. Remove FAB menu (direct actions in QuickCapture)
4. Auto-classify evidence on capture
5. Auto-link to current logbook on capture

**Expected Impact:**
- Capture time: 30-60 seconds → 5-10 seconds
- Capture friction: HIGH → LOW
- Daily capture frequency: LOW → HIGH

---

## 5. REPORT WORKFLOW DESTRUCTION

### EVERY MANUAL FIELD

**Current 7-Step Wizard Manual Fields:**

**Step 1: Report Type**
- Report type (SIWES/SWEP) - MANUAL

**Step 2: Student Info**
- Academic session - MANUAL (should auto-fill from profile)
- Company name - MANUAL (should auto-fill from profile)
- Organization department - MANUAL (should auto-fill from profile)
- Supervisor name - MANUAL (should auto-fill from profile)
- Coordinator name - MANUAL (should auto-fill from profile)
- Start date - MANUAL (should auto-fill from profile)
- End date - MANUAL (should auto-fill from profile)

**Step 3: Report Structure**
- Number of chapters - MANUAL (should default to 5)
- Include dedication - MANUAL (should default to true)
- Include acknowledgement - MANUAL (should default to true)
- Include abstract - MANUAL (should default to true)
- Include table of contents - MANUAL (should default to true)

**Step 4: Weekly Logs**
- Week number - MANUAL (should auto-calculate)
- Title - MANUAL (should auto-generate from evidence)
- Description - MANUAL (should auto-generate from logbook)
- Images - MANUAL (should auto-pull from evidence)

**Step 5: AI Generation**
- AI prompt - MANUAL (should auto-generate from evidence)
- Chapter selection - MANUAL (should auto-select)

**Step 6: Preview**
- Review - MANUAL (keep, but reduce time)

**Step 7: Export**
- Export format - MANUAL (should default to PDF)

---

### EVERY DUPLICATED FIELD

**Duplicated Fields:**
- Student info (entered in profile, re-entered in wizard)
- Organization info (entered in profile, re-entered in wizard)
- Dates (entered in profile, re-entered in wizard)
- Weekly logs (entered in logbook, re-entered in wizard)
- Evidence (uploaded in logbook, re-uploaded in wizard)

---

### EVERY FIELD THAT CAN BE INFERRED

**Inferable Fields:**
- Report type (from profile program_type)
- Academic session (from profile)
- Company name (from profile training_organization)
- Organization department (from profile)
- Supervisor name (from profile)
- Coordinator name (from profile)
- Start date (from profile)
- End date (from profile)
- Week number (calculate from logbook dates)
- Title (generate from evidence)
- Description (generate from logbook)
- Images (pull from evidence)
- AI prompt (generate from evidence)

---

### EVERY FIELD THAT SHOULD BE DELETED

**Deletable Fields:**
- Report structure options (dedication, acknowledgement, abstract, TOC) - default to true
- Number of chapters - default to 5
- Export format - default to PDF
- Chapter selection - auto-select all

---

### GENERATE FROM EVIDENCE FLOW

**Student Journey:**

**Step 1: Click "Generate from Evidence"**
- System validates evidence completeness
- System shows evidence summary
- Student confirms or adds missing evidence

**Step 2: Auto-Generate Report Structure**
- System auto-fills student info from profile
- System auto-selects report structure (default)
- System auto-calculates week numbers
- System auto-pulls weekly logs from logbook
- System auto-pulls evidence from uploads

**Step 3: AI Generation**
- System auto-generates report sections from evidence
- System auto-cites evidence in report
- System auto-adds organization context
- System auto-formats per institution standards

**Step 4: Review and Refine**
- Student reviews auto-generated report
- Student makes refinements (30-60 minutes)
- Student confirms or regenerates

**Final Output:**
- Evidence-driven report
- Complete citations
- Organization context
- Institution formatting

---

## 6. EVIDENCE PIPELINE READINESS

### EVIDENCE → ACTIVITY

**Existing Components:**
- QuickCapture (capture mechanism)
- uploads table (storage)
- activity_events table (activity tracking)

**Missing Components:**
- Evidence classification system
- Activity auto-generation from evidence
- Evidence-to-activity mapping

**Existing Database Support:**
- uploads table: YES
- activity_events table: YES
- Evidence-to-activity relationship: NO

**Required Changes:**
- Add evidence classification logic
- Add activity auto-generation pipeline
- Add evidence-to-activity mapping table

**Estimated Complexity**: MEDIUM

---

### ACTIVITY → LOGBOOK

**Existing Components:**
- logbook_entries table
- Logbook page (manual entry)

**Missing Components:**
- Activity-to-logbook auto-generation
- Weekly summary auto-generation
- Evidence linkage to logbook entries

**Existing Database Support:**
- logbook_entries table: YES
- logbook_evidence table: YES
- Activity-to-logbook relationship: NO

**Required Changes:**
- Add activity-to-logbook pipeline
- Add weekly summary generation
- Add auto-linkage of evidence

**Estimated Complexity**: MEDIUM

---

### LOGBOOK → WEEKLY SUMMARY

**Existing Components:**
- logbook_entries table
- AI generation (ChatPanel, ChatWorkspace)

**Missing Components:**
- Weekly summary auto-generation from logbook
- Evidence citation in summaries
- Gap detection

**Existing Database Support:**
- logbook_entries table: YES
- Weekly summary storage: NO

**Required Changes:**
- Add weekly summary generation pipeline
- Add evidence citation logic
- Add gap detection logic

**Estimated Complexity**: MEDIUM

---

### WEEKLY SUMMARY → REPORT SECTION

**Existing Components:**
- report_sections table
- AI generation (Step5AIGeneration)

**Missing Components:**
- Auto-mapping weekly summaries to sections
- Auto-citation of evidence
- Auto-formatting per institution

**Existing Database Support:**
- report_sections table: YES
- Weekly summary to section mapping: NO

**Required Changes:**
- Add summary-to-section mapping
- Add evidence citation
- Add institution formatting

**Estimated Complexity**: HIGH

---

### OVERALL PIPELINE READINESS

**Current Readiness**: 30%
- Evidence capture: YES
- Evidence storage: YES
- Activity auto-generation: NO
- Logbook auto-generation: NO
- Weekly summary auto-generation: NO
- Report section auto-generation: PARTIAL

**Target Readiness**: 80%
- Evidence capture: YES
- Evidence storage: YES
- Activity auto-generation: YES
- Logbook auto-generation: YES
- Weekly summary auto-generation: YES
- Report section auto-generation: YES

---

## 7. AUTO-GENERATION OPPORTUNITIES

### EVIDENCE → ACTIVITY

**Input**: Raw evidence (text, voice, image, document)
**Output**: Structured activity with title, description, type, week number
**Confidence Level**: HIGH (content analysis + context)
**Student Time Saved**: 5-10 minutes per capture

---

### ACTIVITIES → WEEKLY SUMMARY

**Input**: Multiple activities from a week
**Output**: Weekly summary with activity descriptions
**Confidence Level**: HIGH (summarization is well-understood)
**Student Time Saved**: 30-60 minutes per week

---

### WEEKLY SUMMARY → REPORT SECTION

**Input**: Weekly summaries + evidence + student profile
**Output**: Report section with citations
**Confidence Level**: MEDIUM (requires institution formatting)
**Student Time Saved**: 2-4 hours per report

---

### EVIDENCE → TAGS

**Input**: Evidence content
**Output**: Auto-generated tags (work, learning, observation)
**Confidence Level**: MEDIUM (classification accuracy varies)
**Student Time Saved**: 1-2 minutes per capture

---

### EVIDENCE → WEEK NUMBER

**Input**: Evidence timestamp + logbook start date
**Output**: Auto-calculated week number
**Confidence Level**: HIGH (simple calculation)
**Student Time Saved**: 30 seconds per capture

---

### EVIDENCE → ACTIVITY TITLE

**Input**: Evidence content + type
**Output**: Auto-generated activity title
**Confidence Level**: MEDIUM (content analysis)
**Student Time Saved**: 1-2 minutes per capture

---

### EVIDENCE → CATEGORY

**Input**: Evidence content + type
**Output**: Auto-categorized (work, learning, observation)
**Confidence Level**: MEDIUM (classification accuracy varies)
**Student Time Saved**: 30 seconds per capture

---

### EVIDENCE → ORGANIZATION CONTEXT

**Input**: Evidence + organization_knowledge table
**Output**: Auto-added organization context
**Confidence Level**: HIGH (structured knowledge)
**Student Time Saved**: 5-10 minutes per report

---

### STUDENT INFO → REPORT FIELDS

**Input**: Profile data
**Output**: Auto-filled report fields
**Confidence Level**: HIGH (direct mapping)
**Student Time Saved**: 5-10 minutes per report

---

### LOGBOOK DATES → WEEK NUMBERS

**Input**: Logbook start/end dates
**Output**: Auto-calculated week numbers
**Confidence Level**: HIGH (simple calculation)
**Student Time Saved**: 5-10 minutes per report

---

## 8. MOBILE-FIRST AUDIT

### WHICH SCREENS VIOLATE MOBILE-FIRST PRINCIPLES

**Critical Violations:**
1. **Dashboard Right Panel** - Desktop-only, takes too much space on mobile
2. **Reports 3-Column Grid** - Desktop-first, breaks on mobile
3. **Settings 4-Tab Navigation** - Requires too much horizontal space
4. **Logbook Search + Filters** - Creates clutter on mobile
5. **Report Wizard 7 Steps** - Cramped on mobile, requires too much scrolling

---

### WHICH LAYOUTS FEEL DESKTOP-FIRST

**Desktop-First Layouts:**
1. **Dashboard** - 3-column layout, right panel
2. **Reports** - 3-column grid
3. **Settings** - 4-tab navigation with sidebar
4. **Logbook** - Search bar + filters (desktop patterns)
5. **Report Creation** - 7-step wizard (desktop pattern)

---

### WHICH SCREENS REQUIRE REDESIGN

**Critical Redesign:**
1. **Dashboard** - Remove right panel, single-column on mobile
2. **Reports** - Change to responsive grid (1 mobile, 2 tablet, 3 desktop)
3. **Settings** - Simplify to single page, remove tabs
4. **Logbook** - Remove search/filters, timeline view
5. **Report Creation** - Destroy wizard, single-step generation

---

### WHICH SCREENS SHOULD BECOME SINGLE-COLUMN

**Single-Column Required:**
1. **Dashboard** - Single-column on mobile, 2-column on desktop
2. **Reports** - Single-column on mobile, responsive grid on desktop
3. **Settings** - Single-column on all screens
4. **Logbook** - Single-column on all screens
5. **Report Creation** - Single-column on all screens

---

### MOBILE-FIRST RESTORATION LIST

**Critical:**
1. Remove dashboard right panel
2. Change reports to responsive grid
3. Simplify settings to single page
4. Remove logbook search + filters
5. Destroy report wizard

**High:**
6. Make QuickCapture primary action on dashboard
7. Ensure all actions reachable with thumb
8. Test on 320px, 375px, 390px, 430px
9. Ensure one-handed capture possible
10. Reduce vertical scrolling on dashboard

**Medium:**
11. Simplify navigation to bottom nav on mobile
12. Remove desktop-only patterns
13. Ensure touch targets are 44px minimum
14. Reduce form fields on mobile
15. Simplify input on mobile

**Low:**
16. Optimize images for mobile
17. Reduce animation on mobile
18. Simplify typography on mobile
19. Reduce padding on mobile
20. Test on various mobile devices

---

## 9. 4-WEEK EXECUTION ROADMAP

### WEEK 1: DASHBOARD DESTRUCTION & CAPTURE PRIORITIZATION

**UI Changes:**
- Remove dashboard right panel (lines 38-85 in layout.tsx)
- Remove ActiveReportCard from dashboard
- Remove QuickActionsCard from dashboard
- Remove StudentIdentityCard from dashboard
- Make QuickCapture first and largest element
- Simplify dashboard to 2-column layout

**Database Changes:**
- None

**Workflow Changes:**
- Shift dashboard to evidence-first
- Make QuickCapture primary action
- Remove report-first hierarchy

**Success Metrics:**
- QuickCapture visible within 3 seconds
- Dashboard load time < 2 seconds
- Student can capture within 5 taps

---

### WEEK 2: QUICK CAPTURE OPTIMIZATION & AUTO-CLASSIFICATION

**UI Changes:**
- Optimize QuickCapture for mobile
- Add auto-classification UI feedback
- Simplify capture flow to 3 taps
- Add evidence preview on capture

**Database Changes:**
- Add evidence classification fields to uploads table
- Add evidence tags field
- Add evidence quality score field

**Workflow Changes:**
- Implement auto-classification on capture
- Implement auto-linkage to logbook
- Implement auto-calculation of week number
- Implement auto-generation of activity title

**Success Metrics:**
- Capture time < 10 seconds
- Auto-classification accuracy > 80%
- Auto-linkage success > 90%

---

### WEEK 3: REPORT WORKFLOW DESTRUCTION & AUTO-FILL

**UI Changes:**
- Destroy 7-step report wizard
- Create "Generate from Evidence" single action
- Add evidence completeness check UI
- Add auto-fill confirmation UI

**Database Changes:**
- Add evidence completeness field to reports table
- Add auto-fill timestamp field
- Add evidence citation tracking

**Workflow Changes:**
- Implement auto-fill from profile
- Implement auto-calculation of week numbers
- Implement auto-pull of weekly logs
- Implement auto-pull of evidence

**Success Metrics:**
- Report generation time < 30 minutes
- Auto-fill accuracy > 90%
- Evidence completeness check functional

---

### WEEK 4: SETTINGS SIMPLIFICATION & MOBILE-FIRST RESTORATION

**UI Changes:**
- Simplify settings to single page
- Remove Notifications tab
- Remove Security tab
- Remove logbook search + filters
- Change reports to responsive grid
- Ensure all screens mobile-first

**Database Changes:**
- None

**Workflow Changes:**
- Simplify settings workflow
- Remove enterprise patterns
- Ensure mobile-first on all screens

**Success Metrics:**
- Settings load time < 1 second
- All screens mobile-first
- Thumb reachability on all actions
- One-handed capture possible

---

## 10. SUCCESS METRICS

### TARGET VALUES

**Evidence Capture Metrics:**
- Evidence captured in under 10 seconds: 90% of captures
- First evidence captured within 2 minutes of signup: 95% of users
- Daily capture frequency: 3+ captures per day (target)
- Capture completion rate: 95%

**Report Generation Metrics:**
- Weekly summary generation accuracy: 75%
- Report generation time: 30-60 minutes (target)
- Auto-fill accuracy: 90%
- Evidence completeness percentage: 80%

**Student Outcome Metrics:**
- Evidence completeness: 80% (target)
- Student satisfaction with evidence-first workflow: 4/5 stars
- Daily capture frequency increase: 200%
- Report generation time reduction: 70%

**Mobile-First Metrics:**
- Thumb reachability: 100% of primary actions
- One-handed capture: 90% of captures
- Mobile load time: < 2 seconds
- Mobile completion rate: 95%

---

## 11. CRITICAL RISKS

### RISK #1: Auto-Classification Accuracy

**Risk**: Evidence auto-classification may not be accurate enough
**Impact**: Students may need to manually correct classifications
**Likelihood**: MEDIUM
**Mitigation**: Start with simple classification, improve over time, allow manual override

### RISK #2: Evidence Completeness Validation

**Risk**: Evidence completeness check may be too strict or too lenient
**Impact**: Students may be blocked from report generation or submit incomplete reports
**Likelihood**: MEDIUM
**Mitigation**: Start with lenient validation, tighten based on feedback

### RISK #3: Auto-Generation Quality

**Risk**: Auto-generated reports may not meet institution standards
**Impact**: Students may need to extensively refine reports
**Likelihood**: HIGH
**Mitigation**: Focus on evidence-driven generation, allow extensive refinement

### RISK #4: Mobile-First Adoption

**Risk**: Students may not adopt mobile-first workflow
**Impact**: Low capture frequency, low engagement
**Likelihood**: MEDIUM
**Mitigation**: Test extensively on mobile, optimize for thumb reachability

### RISK #5: Data Migration

**Risk**: Existing data may not work with new evidence-first workflow
**Impact**: Data loss or corruption
**Likelihood**: LOW
**Mitigation**: Test migration on staging, backup production data

---

## 12. RECOMMENDED IMMEDIATE ACTIONS

### IMMEDIATE (Week 1)

1. **Remove Dashboard Right Panel**
   - File: `src/app/dashboard/layout.tsx`
   - Lines: 38-85
   - Action: Delete entire right panel

2. **Remove ActiveReportCard from Dashboard**
   - File: `src/app/dashboard/page.tsx`
   - Lines: 205-214
   - Action: Delete component

3. **Remove QuickActionsCard from Dashboard**
   - File: `src/app/dashboard/page.tsx`
   - Lines: 217-222
   - Action: Delete component

4. **Remove StudentIdentityCard from Dashboard**
   - File: `src/app/dashboard/page.tsx`
   - Lines: 228-236
   - Action: Delete component

5. **Make QuickCapture First and Largest**
   - File: `src/app/dashboard/page.tsx`
   - Action: Reorder to show QuickCapture first, increase size

---

### HIGH PRIORITY (Week 2)

6. **Implement Auto-Classification**
   - File: New component or API endpoint
   - Action: Add evidence classification logic

7. **Implement Auto-Linkage to Logbook**
   - File: Database + API
   - Action: Add evidence-to-logbook auto-linkage

8. **Optimize QuickCapture for Mobile**
   - File: `src/components/workspace/QuickCapture.tsx`
   - Action: Simplify to 3-tap flow

---

### MEDIUM PRIORITY (Week 3)

9. **Destroy Report Wizard**
   - File: `src/app/dashboard/reports/create/page.tsx`
   - Action: Replace with "Generate from Evidence"

10. **Implement Auto-Fill from Profile**
    - File: Report creation component
    - Action: Add auto-fill logic

---

### LOW PRIORITY (Week 4)

11. **Simplify Settings**
    - File: `src/app/dashboard/settings/page.tsx`
    - Action: Remove tabs, single page

12. **Remove Logbook Search + Filters**
    - File: `src/app/dashboard/logbook/page.tsx`
    - Action: Delete search and filters

---

## CONCLUSION

This audit identifies the smallest possible evidence-first MVP for Vemiq. The primary objective is to shift from report-first to evidence-first workflow by removing friction, prioritizing capture, and automating pipelines.

**Key Shifts:**
1. Dashboard: Remove right panel, make QuickCapture primary
2. Capture: Reduce from 6-7 taps to 3 taps
3. Report: Destroy 7-step wizard, implement "Generate from Evidence"
4. Settings: Simplify from 4 tabs to single page
5. Mobile: Ensure all screens mobile-first

**Expected Outcome:**
- Evidence capture time: 30-60 seconds → 5-10 seconds
- Report generation time: 2-4 hours → 30-60 minutes
- Evidence completeness: Unknown → 80%
- Student satisfaction: Unknown → 4/5 stars

**Strategic Impact**: This MVP validates the evidence-first hypothesis and positions Vemiq as the evidence layer for student work, creating a defensible moat that cannot be easily cloned.

**Next Step**: Execute Week 1 (Dashboard Destruction & Capture Prioritization) to immediately shift the product to evidence-first behavior.
