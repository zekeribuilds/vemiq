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

export function generateReportHTML(data: ReportData): string {
  const { title, reportType, studentInfo, reportStructure, sections } = data;

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>${title}</title>
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
      <p style="font-size: 14pt;">${studentInfo.fullName}</p>
      <p style="font-size: 12pt;">${studentInfo.matricNumber}</p>
    </div>
    
    <div style="margin-top: 40pt;">
      <p><strong>SUBMITTED TO</strong></p>
      <p>${studentInfo.university}</p>
      <p>${studentInfo.faculty}</p>
      <p>${studentInfo.department}</p>
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
      <strong>${studentInfo.fullName}</strong> with Matric Number
      <strong>${studentInfo.matricNumber}</strong> under my supervision.
    </p>
    
    <div class="certification">
      <div class="signature-line">
        <p>______________________</p>
        <p>Supervisor: ${studentInfo.supervisorName}</p>
      </div>
      
      <div class="signature-line">
        <p>______________________</p>
        <p>Coordinator: ${studentInfo.coordinatorName}</p>
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
      <strong>${studentInfo.supervisorName}</strong>, for his guidance and
      support throughout this industrial training program. I also thank the
      management and staff of <strong>${studentInfo.companyName}</strong> for
      the opportunity and mentorship provided during my ${studentInfo.duration}
      training period.
    </p>
    <p>
      My appreciation also goes to my course coordinator,
      <strong>${studentInfo.coordinatorName}</strong>, and the entire faculty
      of ${studentInfo.faculty}, ${studentInfo.university}, for their
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
      <strong>${studentInfo.companyName}</strong> over a period of
      <strong>${studentInfo.duration}</strong> from
      <strong>${studentInfo.startDate}</strong> to
      <strong>${studentInfo.endDate}</strong>. The training covered various
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
    ${sections.introduction}
  </div>
  ` : ''}

  ${sections.companyOverview ? `
  <!-- Chapter 2: Company Overview -->
  <div class="page">
    <h2>CHAPTER 2: COMPANY OVERVIEW</h2>
    ${sections.companyOverview}
  </div>
  ` : ''}

  ${sections.activities ? `
  <!-- Chapter 3: Activities Performed -->
  <div class="page">
    <h2>CHAPTER 3: ACTIVITIES PERFORMED</h2>
    ${sections.activities}
  </div>
  ` : ''}

  ${sections.challenges ? `
  <!-- Chapter 4: Challenges and Solutions -->
  <div class="page">
    <h2>CHAPTER 4: CHALLENGES AND SOLUTIONS</h2>
    ${sections.challenges}
  </div>
  ` : ''}

  ${sections.conclusion ? `
  <!-- Chapter 5: Conclusion -->
  <div class="page">
    <h2>CHAPTER 5: CONCLUSION AND RECOMMENDATIONS</h2>
    ${sections.conclusion}
  </div>
  ` : ''}
</body>
</html>
  `.trim();
}
