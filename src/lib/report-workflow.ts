/**
 * Report Workflow Configuration
 * 
 * This file contains the unified report creation workflow configuration.
 * All report creation steps are defined here as a single source of truth.
 * This ensures consistency across all report-related components.
 */

export interface WorkflowStep {
  id: number;
  label: string;
  description?: string;
}

export const reportWorkflowSteps: WorkflowStep[] = [
  {
    id: 1,
    label: 'Report Type',
    description: 'Select report type (SIWES/SWEP)',
  },
  {
    id: 2,
    label: 'Student Info',
    description: 'Enter student and institution information',
  },
  {
    id: 3,
    label: 'Structure',
    description: 'Define report structure and chapters',
  },
  {
    id: 4,
    label: 'Weekly Logs',
    description: 'Add weekly logbook entries',
  },
  {
    id: 5,
    label: 'AI Generation',
    description: 'Generate report content with AI',
  },
  {
    id: 6,
    label: 'Preview',
    description: 'Preview and review generated report',
  },
  {
    id: 7,
    label: 'Export',
    description: 'Export report to PDF',
  },
];

export function getStepById(id: number): WorkflowStep | undefined {
  return reportWorkflowSteps.find(step => step.id === id);
}

export function getStepLabel(id: number): string {
  const step = getStepById(id);
  return step?.label || '';
}

export function getTotalSteps(): number {
  return reportWorkflowSteps.length;
}

// AI Generation sub-steps
export interface GenerationStep {
  id: string;
  name: string;
  status: 'pending' | 'in_progress' | 'completed' | 'error';
}

export const aiGenerationSteps: Omit<GenerationStep, 'status'>[] = [
  {
    id: 'cleaning_logs',
    name: 'Cleaning weekly logs',
  },
  {
    id: 'extracting_context',
    name: 'Extracting context',
  },
  {
    id: 'generating_introduction',
    name: 'Generating Introduction',
  },
  {
    id: 'generating_chapters',
    name: 'Generating chapters',
  },
  {
    id: 'finalizing',
    name: 'Finalizing report',
  },
];

export function getGenerationSteps(): GenerationStep[] {
  return aiGenerationSteps.map(step => ({ ...step, status: 'pending' }));
}
