interface ReportData {
  title: string;
  reportType: 'SWEP' | 'SIWES';
  studentInfo: {
    fullName: string;
    matricNumber: string;
    department: string;
    faculty: string;
    university: string;
    companyName: string;
    supervisorName: string;
    coordinatorName: string;
    duration: string;
    startDate: string;
    endDate: string;
  };
  reportStructure: {
    includeDedication: boolean;
    includeAcknowledgement: boolean;
    includeAbstract: boolean;
    includeTableOfContents: boolean;
  };
  sections: {
    introduction?: string;
    companyOverview?: string;
    activities?: string;
    challenges?: string;
    conclusion?: string;
  };
}

/**
 * Sanitizes HTML content to prevent XSS attacks in PDF generation.
 * Removes dangerous tags and attributes while preserving safe formatting.
 */
function sanitizeHTML(content: string): string {
  if (!content) return '';

  // Remove script tags and their content
  let sanitized = content.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');

  // Remove dangerous event handlers
  sanitized = sanitized.replace(/\s+on\w+="[^"]*"/gi, '');
  sanitized = sanitized.replace(/\s+on\w+='[^']*'/gi, '');

  // Remove javascript: protocol
  sanitized = sanitized.replace(/javascript:/gi, '');

  // Remove data: protocol (except for images)
  sanitized = sanitized.replace(/data:(?!image\/)/gi, '');

  // Remove iframe, object, embed tags
  sanitized = sanitized.replace(/<(iframe|object|embed|form|input|button)[^>]*>/gi, '');

  // Remove style tags that could contain malicious CSS
  sanitized = sanitized.replace(/<style\b[^<]*(?:(?!<\/style>)<[^<]*)*<\/style>/gi, '');

  return sanitized;
}

/**
 * Escapes HTML special characters to prevent XSS
 */
function escapeHTML(text: string): string {
  if (!text) return '';
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, (char) => map[char]);
}

export function generateReportHTML(data: ReportData): string {
  const { title, reportType, studentInfo, reportStructure, sections } = data;

  // Sanitize all user-provided content
  const safeTitle = escapeHTML(title);
  const safeFullName = escapeHTML(studentInfo.fullName);
  const safeMatricNumber = escapeHTML(studentInfo.matricNumber);
  const safeDepartment = escapeHTML(studentInfo.department);
  const safeFaculty = escapeHTML(studentInfo.faculty);
  const safeUniversity = escapeHTML(studentInfo.university);
  const safeCompanyName = escapeHTML(studentInfo.companyName);
  const safeSupervisorName = escapeHTML(studentInfo.supervisorName);
  const safeCoordinatorName = escapeHTML(studentInfo.coordinatorName);
  const safeDuration = escapeHTML(studentInfo.duration);
  const safeStartDate = escapeHTML(studentInfo.startDate);
  const safeEndDate = escapeHTML(studentInfo.endDate);

  // Sanitize HTML content (preserve safe formatting)
  const safeIntroduction = sanitizeHTML(sections.introduction || '');
  const safeCompanyOverview = sanitizeHTML(sections.companyOverview || '');
  const safeActivities = sanitizeHTML(sections.activities || '');
  const safeChallenges = sanitizeHTML(sections.challenges || '');
  const safeConclusion = sanitizeHTML(sections.conclusion || '');

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${safeTitle}</title>
  <style>
    @page {
      size: A4;
      margin: 25mm;
    }
    
    body {
      font-family: 'Times New Roman', serif;
      font-size: 12pt;
      line-height: 1.5;
      color: #000;
      margin: 0;
      padding: 0;
    }
    
    .page {
      page-break-after: always;
      min-height: 247mm;
      padding: 20mm;
    }
    
    .page:last-child {
      page-break-after: avoid;
    }
    
    h1 {
      font-size: 24pt;
      font-weight: bold;
      text-align: center;
      margin-bottom: 20pt;
    }
    
    h2 {
      font-size: 18pt;
      font-weight: bold;
      margin-top: 20pt;
      margin-bottom: 12pt;
    }
    
    h3 {
      font-size: 14pt;
      font-weight: bold;
      margin-top: 16pt;
      margin-bottom: 10pt;
    }
    
    p {
      margin-bottom: 12pt;
      text-align: justify;
    }
    
    .title-page {
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      min-height: 247mm;
    }
    
    .certification {
      margin-top: 50pt;
    }
    
    .signature-line {
      margin-top: 30pt;
      border-top: 1px solid #000;
      padding-top: 10pt;
    }
    
    .toc {
      margin-top: 20pt;
    }
    
    .toc-item {
      margin-bottom: 10pt;
      display: flex;
      justify-content: space-between;
    }
    
    .toc-dots {
      flex: 1;
      border-bottom: 1px dotted #000;
      margin: 0 10pt;
    }
  </style>
</head>
<body>
  <!-- Title Page -->
  <div class="page title-page">
    <h1>${reportType} REPORT</h1>
    <h2>ON</h2>
    <h1>INDUSTRIAL TRAINING</h1>

    <div style="margin-top: 40pt;">
      <p><strong>BY</strong></p>
      <p style="font-size: 14pt;">${safeFullName}</p>
      <p style="font-size: 12pt;">${safeMatricNumber}</p>
    </div>

    <div style="margin-top: 40pt;">
      <p><strong>SUBMITTED TO</strong></p>
      <p>${safeUniversity}</p>
      <p>${safeFaculty}</p>
      <p>${safeDepartment}</p>
    </div>
    
    <div style="margin-top: 40pt;">
      <p><strong>IN PARTIAL FULFILLMENT OF</strong></p>
      <p>THE REQUIREMENTS FOR THE AWARD OF</p>
      <p>BACHELOR OF ENGINEERING (B.Eng)</p>
    </div>
  </div>

  <!-- Certification -->
  <div class="page">
    <h2>CERTIFICATION</h2>
    <p>
      This is to certify that this ${reportType} report titled
      &quot;INDUSTRIAL TRAINING REPORT&quot; was carried out by
      <strong>${safeFullName}</strong> with Matric Number
      <strong>${safeMatricNumber}</strong> under my supervision.
    </p>

    <div class="certification">
      <div class="signature-line">
        <p>______________________</p>
        <p>Supervisor: ${safeSupervisorName}</p>
      </div>

      <div class="signature-line">
        <p>______________________</p>
        <p>Coordinator: ${safeCoordinatorName}</p>
      </div>
      
      <div class="signature-line">
        <p>______________________</p>
        <p>Date: ${new Date().toLocaleDateString()}</p>
      </div>
    </div>
  </div>

  ${reportStructure.includeDedication ? `
  <!-- Dedication -->
  <div class="page">
    <h2>DEDICATION</h2>
    <p>
      This report is dedicated to my parents, guardians, and all who have
      supported me throughout my academic journey and industrial training program.
    </p>
  </div>
  ` : ''}

  ${reportStructure.includeAcknowledgement ? `
  <!-- Acknowledgement -->
  <div class="page">
    <h2>ACKNOWLEDGEMENT</h2>
    <p>
      I wish to express my sincere gratitude to my supervisor,
      <strong>${safeSupervisorName}</strong>, for his guidance and
      support throughout this industrial training program. I also thank the
      management and staff of <strong>${safeCompanyName}</strong> for
      the opportunity and mentorship provided during my ${safeDuration}
      training period.
    </p>
    <p>
      My appreciation also goes to my course coordinator,
      <strong>${safeCoordinatorName}</strong>, and the entire faculty
      of ${safeFaculty}, ${safeUniversity}, for their
      academic guidance and support.
    </p>
  </div>
  ` : ''}

  ${reportStructure.includeAbstract ? `
  <!-- Abstract -->
  <div class="page">
    <h2>ABSTRACT</h2>
    <p>
      This report details my industrial training experience at
      <strong>${safeCompanyName}</strong> over a period of
      <strong>${safeDuration}</strong> from
      <strong>${safeStartDate}</strong> to
      <strong>${safeEndDate}</strong>. The training covered various
      aspects of practical engineering applications, including hands-on
      experience with industrial equipment, project management, and teamwork.
    </p>
    <p>
      The objectives of the training were to gain practical experience in
      engineering, understand industrial processes, and apply theoretical
      knowledge to real-world situations. The report presents the activities
      performed, challenges encountered, solutions implemented, and lessons
      learned during the training period.
    </p>
  </div>
  ` : ''}

  ${reportStructure.includeTableOfContents ? `
  <!-- Table of Contents -->
  <div class="page">
    <h2>TABLE OF CONTENTS</h2>
    <div class="toc">
      <div class="toc-item">
        <span>Certification</span>
        <span class="toc-dots"></span>
        <span>ii</span>
      </div>
      ${reportStructure.includeDedication ? `
      <div class="toc-item">
        <span>Dedication</span>
        <span class="toc-dots"></span>
        <span>iii</span>
      </div>
      ` : ''}
      ${reportStructure.includeAcknowledgement ? `
      <div class="toc-item">
        <span>Acknowledgement</span>
        <span class="toc-dots"></span>
        <span>iv</span>
      </div>
      ` : ''}
      ${reportStructure.includeAbstract ? `
      <div class="toc-item">
        <span>Abstract</span>
        <span class="toc-dots"></span>
        <span>v</span>
      </div>
      ` : ''}
      <div class="toc-item">
        <span>Chapter 1: Introduction</span>
        <span class="toc-dots"></span>
        <span>1</span>
      </div>
      <div class="toc-item">
        <span>Chapter 2: Company Overview</span>
        <span class="toc-dots"></span>
        <span>${reportStructure.includeDedication ? 2 : 1}</span>
      </div>
      <div class="toc-item">
        <span>Chapter 3: Activities Performed</span>
        <span class="toc-dots"></span>
        <span>${reportStructure.includeDedication ? 3 : 2}</span>
      </div>
      <div class="toc-item">
        <span>Chapter 4: Challenges and Solutions</span>
        <span class="toc-dots"></span>
        <span>${reportStructure.includeDedication ? 4 : 3}</span>
      </div>
      <div class="toc-item">
        <span>Chapter 5: Conclusion and Recommendations</span>
        <span class="toc-dots"></span>
        <span>${reportStructure.includeDedication ? 5 : 4}</span>
      </div>
    </div>
  </div>
  ` : ''}

  ${sections.introduction ? `
  <!-- Chapter 1: Introduction -->
  <div class="page">
    <h2>CHAPTER 1: INTRODUCTION</h2>
    ${safeIntroduction}
  </div>
  ` : ''}

  ${sections.companyOverview ? `
  <!-- Chapter 2: Company Overview -->
  <div class="page">
    <h2>CHAPTER 2: COMPANY OVERVIEW</h2>
    ${safeCompanyOverview}
  </div>
  ` : ''}

  ${sections.activities ? `
  <!-- Chapter 3: Activities Performed -->
  <div class="page">
    <h2>CHAPTER 3: ACTIVITIES PERFORMED</h2>
    ${safeActivities}
  </div>
  ` : ''}

  ${sections.challenges ? `
  <!-- Chapter 4: Challenges and Solutions -->
  <div class="page">
    <h2>CHAPTER 4: CHALLENGES AND SOLUTIONS</h2>
    ${safeChallenges}
  </div>
  ` : ''}

  ${sections.conclusion ? `
  <!-- Chapter 5: Conclusion -->
  <div class="page">
    <h2>CHAPTER 5: CONCLUSION AND RECOMMENDATIONS</h2>
    ${safeConclusion}
  </div>
  ` : ''}
</body>
</html>
  `.trim();
}
