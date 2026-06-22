# Report Renderer Components

Live preview engine for Vemiq academic reports.

## Architecture

```
Database (report_sections)
    ↓
Report Renderer Components
    ↓
A4 HTML Pages
    ↓
Live Preview (React)
    ↓
PDF Export (Puppeteer/Playwright)
```

## Components

### ReportRenderer
Main component that orchestrates the entire report rendering.

### ReportPage
A4 page component (210mm × 297mm) with proper margins and styling.

### ReportCoverPage
Renders the report cover page with institution logo, student details, and metadata.

### ReportTableOfContents
Auto-generates table of contents from report sections.

### ReportChapter
Renders individual chapters with proper formatting and page breaks.

### ReportImage
Handles image rendering with captions and proper sizing.

## Usage

```tsx
import { ReportRenderer } from '@/components/report-renderer';

<ReportRenderer reportData={reportData} />
```

## Styling

- Font: Times New Roman (academic standard)
- Font size: 12px
- Line spacing: 1.5
- Alignment: Justified
- Margins: 1 inch (25.4mm)
- Page size: A4 (210mm × 297mm)

## PDF Export

Use `renderReportHTML()` utility to generate HTML for PDF export.

```ts
import { renderReportHTML } from '@/lib/report-renderer-utils';

const html = renderReportHTML(reportData);
// Pass to Puppeteer/Playwright for PDF generation
```

## Real-time Updates

Components are designed to work with:
- Supabase Realtime subscriptions
- React Query invalidation

Preview updates automatically when `report_sections.content` changes.

## Key Features

- ✓ A4 preview renders correctly
- ✓ Cover page generated automatically
- ✓ Institution logo injected
- ✓ TOC generated automatically
- ✓ Chapters start on new pages
- ✓ Images render correctly
- ✓ Real-time updates
- ✓ Mobile preview works
- ✓ Desktop split-view works
- ✓ Preview matches PDF output
- ✓ Preview is read-only
- ✓ Drafts separate from final content
