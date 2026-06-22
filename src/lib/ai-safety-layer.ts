/**
 * AI Safety Layer
 * Enforces strict rules to prevent AI from generating entire reports or unauthorized content
 */

export interface AISafetyCheck {
  valid: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Validates that AI generation request complies with safety rules
 */
export function validateAIGenerationRequest(
  sectionId: string | null,
  reportId: string | null,
  mode: 'generate' | 'edit' | 'analyze' | 'research' | 'logbook'
): AISafetyCheck {
  const errors: string[] = [];
  const warnings: string[] = [];

  // Rule 1: Never generate entire report
  if (!sectionId) {
    errors.push('Section ID is required. Entire report generation is not allowed.');
  }

  // Rule 2: Never generate multiple chapters
  if (mode === 'generate' && !sectionId) {
    errors.push('Cannot generate multiple chapters at once. Specify a single section.');
  }

  // Rule 3: Only current section
  if (reportId && !sectionId) {
    errors.push('Report ID provided without Section ID. Must specify which section to generate.');
  }

  // Rule 4: Use real data first
  // This is checked at the context level, but we warn here
  if (mode === 'generate') {
    warnings.push('Ensure logbook entries and organization knowledge are provided for context.');
  }

  // Rule 5: Avoid hallucinations
  warnings.push('AI will be instructed to use only provided data and not invent information.');

  // Rule 6: Prefer logbook evidence
  if (mode === 'generate' || mode === 'edit') {
    warnings.push('Logbook entries should be linked to provide evidence for content.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates user message for safety violations
 */
export function validateUserMessage(message: string): AISafetyCheck {
  const errors: string[] = [];
  const warnings: string[] = [];

  const lowerMessage = message.toLowerCase();

  // Block attempts to generate entire report
  if (lowerMessage.includes('generate entire report') ||
      lowerMessage.includes('write whole report') ||
      lowerMessage.includes('complete report') ||
      lowerMessage.includes('all chapters')) {
    errors.push('Cannot generate entire report. Please specify a single section.');
  }

  // Block attempts to generate multiple chapters
  if (lowerMessage.includes('all chapters') ||
      lowerMessage.includes('multiple chapters') ||
      lowerMessage.includes('every chapter')) {
    errors.push('Cannot generate multiple chapters at once. Please specify a single section.');
  }

  // Warn about potential hallucination requests
  if (lowerMessage.includes('make up') ||
      lowerMessage.includes('invent') ||
      lowerMessage.includes('create fictional') ||
      lowerMessage.includes('imagine')) {
    warnings.push('AI is instructed to use only real data from logbook entries and organization knowledge.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Validates draft content before acceptance
 */
export function validateDraftContent(content: string, sectionTitle: string): AISafetyCheck {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (!content || content.trim().length === 0) {
    errors.push('Draft content cannot be empty.');
  }

  if (content.length < 50) {
    warnings.push('Draft content is very short. Consider expanding with more detail.');
  }

  if (content.length > 10000) {
    warnings.push('Draft content is very long. Consider splitting into subsections.');
  }

  // Check for placeholder text
  if (content.includes('[Generated content will appear here]') ||
      content.includes('[TODO]') ||
      content.includes('[placeholder]')) {
    errors.push('Draft contains placeholder text. Generate actual content before accepting.');
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Enforces section-scoped operations
 */
export function enforceSectionScope(
  targetSectionId: string,
  currentSectionId: string
): AISafetyCheck {
  const errors: string[] = [];
  const warnings: string[] = [];

  if (targetSectionId !== currentSectionId) {
    errors.push(`Cannot modify section ${targetSectionId}. Current active section is ${currentSectionId}.`);
  }

  return {
    valid: errors.length === 0,
    errors,
    warnings,
  };
}

/**
 * Builds safety instructions to append to AI prompts
 */
export function buildSafetyInstructions(mode: 'generate' | 'edit' | 'analyze' | 'research' | 'logbook'): string {
  const baseInstructions = `
## SAFETY RULES - STRICTLY FOLLOW THESE:

1. NEVER generate an entire report. Only generate the requested section.
2. NEVER generate multiple chapters. Focus on the single section specified.
3. ONLY modify the current section. Do not reference or modify other sections.
4. USE ONLY the provided data from logbook entries and organization knowledge.
5. DO NOT invent, imagine, or create fictional information.
6. PRIORITIZE real evidence from logbook entries over assumptions.
7. If information is missing from provided context, state that it is missing rather than inventing it.
8. Maintain professional academic tone appropriate for ${mode === 'generate' ? 'report generation' : mode}.
`;

  const modeSpecificInstructions: Record<string, string> = {
    generate: `
9. Generate content based on the section title and provided context.
10. Use chronological order when describing activities from logbook entries.
11. Include specific details, dates, and technical terminology where appropriate.
`,
    edit: `
9. Modify only the existing content based on user instructions.
10. Preserve the original structure and key points unless explicitly asked to change.
11. Improve clarity, grammar, and professionalism.
`,
    analyze: `
9. Provide objective analysis of content quality.
10. Identify specific areas for improvement with examples.
11. Check consistency with provided logbook entries and organization knowledge.
`,
    research: `
9. Provide information based on organization knowledge.
10. Do not write content directly into the report.
11. Offer explanations and context for the user to incorporate.
`,
    logbook: `
9. Incorporate specific activities from logbook entries.
10. Reference dates, weeks, and entry details.
11. Maintain the chronological flow of activities.
`,
  };

  return baseInstructions + (modeSpecificInstructions[mode] || '');
}
