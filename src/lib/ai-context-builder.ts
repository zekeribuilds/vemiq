import { ReportData, ReportSection } from '@/components/report-renderer';

export interface AIContext {
  userProfile: {
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
  report: {
    id: string;
    title: string;
    report_type: 'SWEP' | 'SIWES';
    status: string;
    progress: number;
  };
  currentSection?: {
    id: string;
    title: string;
    content: string;
    section_order: number;
  };
  trainingOrganization?: {
    name: string;
    address?: string;
    industry?: string;
  };
  organizationKnowledge?: {
    overview?: string;
    history?: string;
    mission?: string;
    tools_used?: string;
    safety_rules?: string;
    processes?: string;
    notes?: string;
  };
  linkedLogbookEntries?: Array<{
    id: string;
    entry_date: string;
    week_number?: number;
    title?: string;
    activity_description: string;
    ai_cleaned_text?: string;
    source_type: 'text' | 'voice' | 'image' | 'mixed';
  }>;
}

/**
 * Builds comprehensive AI context for report generation
 * This ensures AI always has complete context before generating content
 */
export async function buildAIContext(
  reportId: string,
  sectionId?: string,
  selectedLogbookEntryIds?: string[]
): Promise<AIContext> {
  // In production, this would fetch from Supabase
  // For now, this is a placeholder implementation
  
  const context: AIContext = {
    userProfile: {
      full_name: '',
      matric_number: '',
      academic_session: '',
      siwes_coordinator_name: '',
      supervisor_name: '',
    },
    report: {
      id: reportId,
      title: '',
      report_type: 'SIWES',
      status: 'draft',
      progress: 0,
    },
  };

  // TODO: Implement actual Supabase queries
  // 1. Fetch report details
  // 2. Fetch user profile
  // 3. Fetch current section if sectionId provided
  // 4. Fetch training organization
  // 5. Fetch organization knowledge
  // 6. Fetch linked logbook entries
  
  return context;
}

/**
 * Validates that AI context is complete before generation
 */
export function validateAIContext(context: AIContext): { valid: boolean; errors: string[] } {
  const errors: string[] = [];
  
  if (!context.userProfile.full_name) {
    errors.push('User profile name is required');
  }
  
  if (!context.userProfile.matric_number) {
    errors.push('Matric number is required');
  }
  
  if (!context.report.title) {
    errors.push('Report title is required');
  }
  
  if (!context.currentSection?.id) {
    errors.push('Current section ID is required for generation');
  }
  
  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Formats AI context into a structured prompt
 */
export function formatContextAsPrompt(context: AIContext, mode: 'generate' | 'edit' | 'analyze' | 'research' | 'logbook'): string {
  const sections: string[] = [];
  
  // Student Information
  sections.push(`## Student Information`);
  sections.push(`Name: ${context.userProfile.full_name}`);
  sections.push(`Matric Number: ${context.userProfile.matric_number}`);
  sections.push(`Academic Session: ${context.userProfile.academic_session}`);
  sections.push(`SIWES Coordinator: ${context.userProfile.siwes_coordinator_name}`);
  sections.push(`Supervisor: ${context.userProfile.supervisor_name}`);
  
  if (context.userProfile.institution) {
    sections.push(`\n## Institution`);
    sections.push(`Name: ${context.userProfile.institution.name}`);
    if (context.userProfile.institution.faculty) {
      sections.push(`Faculty: ${context.userProfile.institution.faculty}`);
    }
    if (context.userProfile.institution.department) {
      sections.push(`Department: ${context.userProfile.institution.department}`);
    }
  }
  
  // Report Information
  sections.push(`\n## Report`);
  sections.push(`Title: ${context.report.title}`);
  sections.push(`Type: ${context.report.report_type}`);
  sections.push(`Status: ${context.report.status}`);
  
  // Current Section
  if (context.currentSection) {
    sections.push(`\n## Current Section`);
    sections.push(`Title: ${context.currentSection.title}`);
    sections.push(`Order: ${context.currentSection.section_order}`);
    if (context.currentSection.content) {
      sections.push(`Existing Content:\n${context.currentSection.content}`);
    }
  }
  
  // Training Organization
  if (context.trainingOrganization) {
    sections.push(`\n## Training Organization`);
    sections.push(`Name: ${context.trainingOrganization.name}`);
    if (context.trainingOrganization.address) {
      sections.push(`Address: ${context.trainingOrganization.address}`);
    }
    if (context.trainingOrganization.industry) {
      sections.push(`Industry: ${context.trainingOrganization.industry}`);
    }
  }
  
  // Organization Knowledge
  if (context.organizationKnowledge) {
    sections.push(`\n## Organization Knowledge`);
    if (context.organizationKnowledge.overview) {
      sections.push(`Overview: ${context.organizationKnowledge.overview}`);
    }
    if (context.organizationKnowledge.history) {
      sections.push(`History: ${context.organizationKnowledge.history}`);
    }
    if (context.organizationKnowledge.mission) {
      sections.push(`Mission: ${context.organizationKnowledge.mission}`);
    }
    if (context.organizationKnowledge.tools_used) {
      sections.push(`Tools Used: ${context.organizationKnowledge.tools_used}`);
    }
    if (context.organizationKnowledge.safety_rules) {
      sections.push(`Safety Rules: ${context.organizationKnowledge.safety_rules}`);
    }
    if (context.organizationKnowledge.processes) {
      sections.push(`Processes: ${context.organizationKnowledge.processes}`);
    }
  }
  
  // Linked Logbook Entries
  if (context.linkedLogbookEntries && context.linkedLogbookEntries.length > 0) {
    sections.push(`\n## Linked Logbook Entries`);
    context.linkedLogbookEntries.forEach((entry, index) => {
      sections.push(`\n### Entry ${index + 1}`);
      sections.push(`Date: ${entry.entry_date}`);
      if (entry.week_number) {
        sections.push(`Week: ${entry.week_number}`);
      }
      if (entry.title) {
        sections.push(`Title: ${entry.title}`);
      }
      sections.push(`Activity: ${entry.activity_description}`);
      if (entry.ai_cleaned_text) {
        sections.push(`Cleaned Text: ${entry.ai_cleaned_text}`);
      }
      sections.push(`Source: ${entry.source_type}`);
    });
  }
  
  return sections.join('\n');
}
