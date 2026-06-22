/**
 * Chat Prompt Configuration
 * 
 * This file contains the suggested prompts for the Vemiq AI assistant.
 * Prompts are defined here as configuration rather than hardcoded in components.
 * This allows for easy A/B testing and prompt optimization without code changes.
 */

export interface ChatPrompt {
  id: string;
  label: string;
  category: 'report' | 'logbook' | 'analysis' | 'general';
  description?: string;
}

export const suggestedPrompts: ChatPrompt[] = [
  {
    id: 'generate-chapter',
    label: 'Generate Chapter 3',
    category: 'report',
    description: 'Generate the next chapter of your report using AI',
  },
  {
    id: 'import-logbook',
    label: 'Import from Logbook',
    category: 'logbook',
    description: 'Import your weekly logbook entries into the report',
  },
  {
    id: 'analyze-images',
    label: 'Analyze Uploaded Images',
    category: 'analysis',
    description: 'Analyze images you have uploaded for your report',
  },
  {
    id: 'summarize-activities',
    label: 'Summarize Weekly Activities',
    category: 'logbook',
    description: 'Get a summary of your weekly activities',
  },
];

export function getPromptsByCategory(category: ChatPrompt['category']): ChatPrompt[] {
  return suggestedPrompts.filter(prompt => prompt.category === category);
}

export function getPromptById(id: string): ChatPrompt | undefined {
  return suggestedPrompts.find(prompt => prompt.id === id);
}
