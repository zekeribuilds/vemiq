'use client';

import { DocumentsIcon, BriefcaseIcon, ClockIcon, CheckIcon } from '@/design-system';
import Link from 'next/link';
import PageContainer from '@/components/layout/PageContainer';

export default function TemplatesPage() {
  const templates = [
    {
      id: 1,
      name: 'Standard SIWES Report',
      type: 'SIWES',
      description: 'Complete SIWES report template with all standard sections',
      chapters: 5,
      sections: ['Title', 'Certification', 'Dedication', 'Acknowledgement', 'Abstract', 'TOC', '5 Chapters'],
      icon: DocumentsIcon,
    },
    {
      id: 2,
      name: 'SWEP Report',
      type: 'SWEP',
      description: 'Short-term industrial work experience program template',
      chapters: 3,
      sections: ['Title', 'Certification', 'Acknowledgement', 'Abstract', 'TOC', '3 Chapters'],
      icon: BriefcaseIcon,
    },
    {
      id: 3,
      name: 'Extended SIWES Report',
      type: 'SIWES',
      description: 'Comprehensive template with additional sections',
      chapters: 6,
      sections: ['Title', 'Certification', 'Dedication', 'Acknowledgement', 'Abstract', 'TOC', '6 Chapters'],
      icon: ClockIcon,
    },
  ];

  return (
    <PageContainer>
      <div className="mb-8 animate-fade-in">
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium mb-4">
          <span>Templates</span>
        </div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Templates</h1>
        <p className="text-muted-foreground">Choose a template to start your report quickly</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((template, index) => (
          <div
            key={template.id}
            className="card-hover p-6 cursor-pointer animate-scale-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start justify-between mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-primary to-accent rounded-3xl flex items-center justify-center shadow-lg">
                <template.icon className="text-white" size={28} />
              </div>
              <span className="badge-primary">
                {template.type}
              </span>
            </div>

            <h3 className="text-xl font-semibold text-foreground mb-2 group-hover:text-primary dark:group-hover:text-white transition-colors">{template.name}</h3>
            <p className="text-muted-foreground text-sm mb-4">{template.description}</p>

            <div className="space-y-2 mb-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckIcon className="text-success" size={14} />
                </div>
                <span>{template.chapters} chapters</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <div className="w-6 h-6 bg-success/10 rounded-full flex items-center justify-center">
                  <CheckIcon className="text-success" size={14} />
                </div>
                <span>{template.sections.length} sections</span>
              </div>
            </div>

            <Link
              href="/dashboard/reports/create"
              className="btn-primary block w-full text-center"
            >
              Use Template
            </Link>
          </div>
        ))}
      </div>

      <div className="mt-8 card p-6 animate-fade-in-up">
        <h3 className="text-xl font-semibold text-foreground mb-4">Create Custom Template</h3>
        <p className="text-muted-foreground mb-4">
          Don't see a template that fits your needs? Create a custom report from scratch.
        </p>
        <Link
          href="/dashboard/reports/create"
          className="btn-ghost inline-flex items-center"
        >
          Create Custom Report
        </Link>
      </div>
    </PageContainer>
  );
}
