# AI Workspace Components

Context-aware AI workspace for Vemiq report generation.

## Architecture

```
User Input
    ↓
AI Safety Layer (Validation)
    ↓
Context Builder (Profile, Institution, Organization, Logbook)
    ↓
AI Tools (Generate, Regenerate, Rewrite, etc.)
    ↓
Draft Workflow (Accept, Edit, Discard, Regenerate)
    ↓
Report Update
```

## Components

### ChatWorkspace
Main AI workspace interface with chat interface and tool selection.

### AIToolbar
Tool selection interface with 8 AI modes:
- Generate
- Regenerate
- Rewrite
- Expand
- Shorten
- Improve Grammar
- Analyze
- Use Logbook Data

### DraftWorkflow
Draft review and approval workflow:
- Accept: Save to report_sections
- Edit: Modify before accepting
- Discard: Reject draft
- Regenerate: Create new version

### LogbookIntegration
Logbook entry selection and filtering:
- Select all/clear all
- Filter by week
- Filter by date range
- Visual selection indicators

## AI Safety Rules

1. Never generate entire report
2. Never generate multiple chapters
3. Only current section
4. Use real data first
5. Avoid hallucinations
6. Prefer logbook evidence

## Usage

```tsx
import { ChatWorkspace } from '@/components/ai-workspace';

<ChatWorkspace
  reportId={reportId}
  sectionId={sectionId}
  sectionTitle={sectionTitle}
  onSectionUpdate={(sectionId, content) => {
    // Update report_sections.content
  }}
/>
```

## Context Building

The AI always has complete context:
- Student profile
- Institution details
- Training organization
- Organization knowledge
- Linked logbook entries
- Current section content

## Success Criteria

✓ Context builder works
✓ Current section awareness
✓ Draft workflow works
✓ Logbook integration works
✓ Organization knowledge works
✓ Image support works
✓ Audio support works
✓ Smart suggestions work
✓ Entire-report generation impossible
✓ Preview sync remains intact
✓ Accepted drafts update report
