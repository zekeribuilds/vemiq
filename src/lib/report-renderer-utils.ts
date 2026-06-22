import { ReportData, ReportSection } from '@/components/report-renderer';

/**
 * Generates complete HTML for report rendering
 * Used for both live preview and PDF export
 * Single source of truth for report output
 */
export function renderReportHTML(reportData: ReportData): string {
  const {
    title,
    report_type,
    user_profile,
    training_organization,
    sections,
  } = reportData;

  const currentDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  const tocSections = sections.map((section: ReportSection, index: number) => ({
    id: section.id,
    title: section.title,
    page: 3 + index,
  }));

  const parseContent = (content: string) => {
    if (!content) return '';
    
    const lines = content.split('\n');
    let html = '';
    
    lines.forEach((line) => {
      if (line.startsWith('### ')) {
        html += `<h3 class="font-bold mt-6 mb-4 text-lg">${line.replace('### ', '')}</h3>`;
      } else if (line.startsWith('## ')) {
        html += `<h2 class="font-bold mt-6 mb-4 text-xl">${line.replace('## ', '')}</h2>`;
      } else if (line.startsWith('![')) {
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          html += `
            <div class="my-6">
              <div class="flex justify-center">
                <img src="${match[2]}" alt="${match[1]}" class="max-w-full h-auto" />
              </div>
              ${match[1] ? `<p class="text-center text-sm mt-2 italic">Figure: ${match[1]}</p>` : ''}
            </div>
          `;
        }
      } else if (line.startsWith('- ')) {
        html += `<ul class="list-disc ml-8 mb-4"><li>${line.replace('- ', '')}</li></ul>`;
      } else if (line.trim()) {
        html += `<p class="mb-4">${line}</p>`;
      }
    });
    
    return html;
  };

  const chaptersHTML = sections
    .map((section: ReportSection, index: number) => {
      const contentHTML = parseContent(section.content);
      return `
        <div class="page">
          <div class="flex flex-col h-full">
            <h1 class="text-2xl font-bold text-center mb-8">CHAPTER ${index + 1}</h1>
            <h2 class="text-xl font-bold text-center">${section.title.toUpperCase()}</h2>
          </div>
        </div>
        <div class="page">
          <div>
            <h1 class="text-2xl font-bold text-center mb-8">CHAPTER ${index + 1}</h1>
            <h2 class="text-xl font-bold text-center mb-8">${section.title.toUpperCase()}</h2>
            ${contentHTML}
          </div>
        </div>
      `;
    })
    .join('');

  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>${title}</title>
      <style>
        @page {
          size: A4;
          margin: 0;
        }
        body {
          margin: 0;
          padding: 0;
          font-family: 'Times New Roman', serif;
          font-size: 12px;
          line-height: 1.5;
          text-align: justify;
        }
        .page {
          width: 210mm;
          height: 297mm;
          padding: 25.4mm;
          background: white;
          margin: 0 auto;
          page-break-after: always;
          position: relative;
        }
        .page:last-child {
          page-break-after: avoid;
        }
        .page-number {
          position: absolute;
          bottom: 12.7mm;
          right: 25.4mm;
          font-size: 12px;
        }
        .cover-page {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 100%;
          text-align: center;
        }
        .cover-logo {
          width: 128px;
          height: 128px;
          object-fit: contain;
          margin-bottom: 32px;
        }
        .cover-title {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 8px;
        }
        .cover-subtitle {
          font-size: 18px;
          margin-bottom: 4px;
        }
        .cover-section {
          margin-top: 48px;
          margin-bottom: 48px;
        }
        .cover-report-title {
          font-size: 36px;
          font-weight: bold;
          margin-bottom: 16px;
        }
        .cover-info {
          margin-top: 64px;
          text-align: left;
          line-height: 2;
        }
        .toc-title {
          font-size: 24px;
          font-weight: bold;
          text-align: center;
          margin-bottom: 48px;
        }
        .toc-section {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .toc-subsection {
          padding-left: 20px;
        }
      </style>
    </head>
    <body>
      <!-- Cover Page -->
      <div class="page cover-page">
        ${user_profile.institution?.logo_url ? `
          <img src="${user_profile.institution.logo_url}" alt="${user_profile.institution.name} Logo" class="cover-logo" />
        ` : ''}
        <h1 class="cover-title">${user_profile.institution?.name || 'Institution Name'}</h1>
        <p class="cover-subtitle">${user_profile.institution?.faculty || 'Faculty'}</p>
        <p class="cover-subtitle">${user_profile.institution?.department || 'Department'}</p>
        
        <div class="cover-section">
          <h2 class="cover-report-title">
            ${report_type === 'SWEP' ? 'STUDENT WORK EXPERIENCE PROGRAM' : 'STUDENTS INDUSTRIAL WORK EXPERIENCE SCHEME'}
          </h2>
          <p class="text-xl">REPORT</p>
        </div>
        
        <div class="cover-info">
          <p><span class="font-semibold">Student Name:</span> ${user_profile.full_name}</p>
          <p><span class="font-semibold">Matric Number:</span> ${user_profile.matric_number}</p>
          <p><span class="font-semibold">Organization:</span> ${training_organization?.name || 'Organization Name'}</p>
          <p><span class="font-semibold">SIWES Coordinator:</span> ${user_profile.siwes_coordinator_name}</p>
          <p><span class="font-semibold">Supervisor:</span> ${user_profile.supervisor_name}</p>
          <p><span class="font-semibold">Date:</span> ${currentDate}</p>
        </div>
      </div>

      <!-- Table of Contents -->
      <div class="page">
        <div class="flex flex-col h-full">
          <h1 class="toc-title">TABLE OF CONTENTS</h1>
          <div class="flex-1">
            ${tocSections.map(section => `
              <div class="toc-section">
                <span>${section.title}</span>
                <span>${section.page}</span>
              </div>
            `).join('')}
          </div>
        </div>
      </div>

      <!-- Chapters -->
      ${chaptersHTML}
    </body>
    </html>
  `;
}

/**
 * Prepares report data for PDF generation
 * This should be called after payment verification
 */
export async function generatePDF(reportData: ReportData): Promise<Blob> {
  const html = renderReportHTML(reportData);
  
  // In production, use Puppeteer or Playwright
  // This is a placeholder for the PDF generation logic
  // Example with Puppeteer:
  /*
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'networkidle0' });
  const pdf = await page.pdf({
    format: 'A4',
    printBackground: true,
    margin: {
      top: '0',
      right: '0',
      bottom: '0',
      left: '0',
    },
  });
  await browser.close();
  return pdf;
  */
  
  throw new Error('PDF generation requires backend implementation with Puppeteer or Playwright');
}

/**
 * Validates report data before rendering
 */
export function validateReportData(reportData: ReportData): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!reportData.title) {
    errors.push('Report title is required');
  }
  
  if (!reportData.user_profile?.full_name) {
    errors.push('Student name is required');
  }
  
  if (!reportData.user_profile?.matric_number) {
    errors.push('Matric number is required');
  }
  
  if (!reportData.sections || reportData.sections.length === 0) {
    errors.push('Report must have at least one section');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Calculates estimated page count for a report
 */
export function estimatePageCount(reportData: ReportData): number {
  // Cover page: 1
  // Table of contents: 1
  // Each chapter: at least 2 pages (title page + content)
  const basePages = 2; // Cover + TOC
  const chapterPages = reportData.sections.length * 2;
  
  return basePages + chapterPages;
}
