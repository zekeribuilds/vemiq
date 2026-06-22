import React from 'react';
import { ReportPage } from './ReportPage';
import { ReportCoverPage } from './ReportCoverPage';
import { ReportTableOfContents } from './ReportTableOfContents';
import { ReportChapter } from './ReportChapter';

export interface ReportSection {
  id: string;
  title: string;
  content: string;
  section_order: number;
}

export interface ReportData {
  id: string;
  title: string;
  report_type: 'SWEP' | 'SIWES';
  status: string;
  progress: number;
  user_profile: {
    full_name: string;
    matric_number: string;
    academic_session: string;
    siwes_coordinator_name: string;
    supervisor_name: string;
    institution?: {
      name: string;
      logo_url?: string;
      faculty?: string;
      department?: string;
    };
  };
  training_organization?: {
    name: string;
  };
  sections: ReportSection[];
}

interface ReportRendererProps {
  reportData: ReportData;
  className?: string;
}

export const ReportRenderer: React.FC<ReportRendererProps> = ({
  reportData,
  className = '',
}) => {
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

  // Generate table of contents
  const tocSections = sections.map((section, index) => ({
    id: section.id,
    title: section.title,
    page: 3 + index, // Cover (1) + TOC (2) + chapters start at 3
  }));

  // Parse section content into structured format
  const parseContent = (content: string) => {
    if (!content) return [];
    
    // Simple parsing - in production, use a proper markdown parser
    const lines = content.split('\n');
    const parsed: any[] = [];
    
    lines.forEach((line) => {
      if (line.startsWith('### ')) {
        parsed.push({ type: 'heading', level: 3, content: line.replace('### ', '') });
      } else if (line.startsWith('## ')) {
        parsed.push({ type: 'heading', level: 2, content: line.replace('## ', '') });
      } else if (line.startsWith('![')) {
        // Image markdown: ![caption](url)
        const match = line.match(/!\[(.*?)\]\((.*?)\)/);
        if (match) {
          parsed.push({ type: 'image', src: match[2], caption: match[1] });
        }
      } else if (line.startsWith('- ')) {
        // List item
        parsed.push({ type: 'list', items: [line.replace('- ', '')] });
      } else if (line.trim()) {
        parsed.push({ type: 'text', content: line });
      }
    });
    
    return parsed;
  };

  return (
    <div className={`bg-gray-100 min-h-screen py-8 ${className}`}>
      <div className="max-w-4xl mx-auto">
        {/* Cover Page */}
        <ReportCoverPage
          institutionLogo={user_profile.institution?.logo_url}
          institutionName={user_profile.institution?.name || 'Institution Name'}
          faculty={user_profile.institution?.faculty || 'Faculty'}
          department={user_profile.institution?.department || 'Department'}
          reportType={report_type}
          studentName={user_profile.full_name}
          matricNumber={user_profile.matric_number}
          organizationName={training_organization?.name || 'Organization Name'}
          coordinatorName={user_profile.siwes_coordinator_name}
          supervisorName={user_profile.supervisor_name}
          date={currentDate}
        />

        {/* Table of Contents */}
        <ReportTableOfContents sections={tocSections} />

        {/* Chapters */}
        {sections.map((section, index) => (
          <ReportChapter
            key={section.id}
            title={section.title}
            chapterNumber={index + 1}
            content={parseContent(section.content)}
            startPage={true}
          />
        ))}
      </div>
    </div>
  );
};
