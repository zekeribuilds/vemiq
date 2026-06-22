import React from 'react';
import { ReportPage } from './ReportPage';

interface TOCSection {
  id: string;
  title: string;
  page: number;
  subsections?: TOCSection[];
}

interface ReportTableOfContentsProps {
  sections: TOCSection[];
}

export const ReportTableOfContents: React.FC<ReportTableOfContentsProps> = ({
  sections,
}) => {
  const renderSection = (section: TOCSection, depth: number = 0) => {
    const paddingLeft = depth * 20;
    
    return (
      <div key={section.id} style={{ paddingLeft: `${paddingLeft}px` }}>
        <div className="flex justify-between mb-2">
          <span>{section.title}</span>
          <span>{section.page}</span>
        </div>
        {section.subsections && section.subsections.length > 0 && (
          <div>
            {section.subsections.map((subsection) => renderSection(subsection, depth + 1))}
          </div>
        )}
      </div>
    );
  };

  return (
    <ReportPage>
      <div className="flex flex-col h-full">
        <h1 className="text-2xl font-bold text-center mb-12">TABLE OF CONTENTS</h1>
        
        <div className="flex-1">
          {sections.map((section) => renderSection(section))}
        </div>
      </div>
    </ReportPage>
  );
};
