import { AIContext } from './ai-context-builder';

export type AITool = 
  | 'generate_section'
  | 'regenerate_section'
  | 'rewrite_section'
  | 'expand_section'
  | 'shorten_section'
  | 'improve_grammar'
  | 'analyze_section'
  | 'use_logbook_data';

export interface AIToolRequest {
  tool: AITool;
  context: AIContext;
  userMessage?: string;
  additionalInstructions?: string;
}

export interface AIToolResponse {
  success: boolean;
  content?: string;
  error?: string;
  metadata?: {
    tokensUsed?: number;
    mode: string;
    sectionId?: string;
  };
}

/**
 * AI Tool: Generate Section
 * Generates new content for a section based on context
 */
export async function generateSection(request: AIToolRequest): Promise<AIToolResponse> {
  const { context, userMessage, additionalInstructions } = request;
  
  if (!context.currentSection) {
    return {
      success: false,
      error: 'Current section is required for generation',
    };
  }
  
  const prompt = buildGeneratePrompt(context, userMessage, additionalInstructions);
  
  // TODO: Implement actual AI API call
  // For now, return placeholder
  return {
    success: true,
    content: '[Generated content will appear here]',
    metadata: {
      mode: 'generate',
      sectionId: context.currentSection.id,
    },
  };
}

/**
 * AI Tool: Regenerate Section
 * Regenerates content for an existing section
 */
export async function regenerateSection(request: AIToolRequest): Promise<AIToolResponse> {
  const { context, userMessage, additionalInstructions } = request;
  
  if (!context.currentSection) {
    return {
      success: false,
      error: 'Current section is required for regeneration',
    };
  }
  
  const prompt = buildRegeneratePrompt(context, userMessage, additionalInstructions);
  
  // TODO: Implement actual AI API call
  return {
    success: true,
    content: '[Regenerated content will appear here]',
    metadata: {
      mode: 'regenerate',
      sectionId: context.currentSection.id,
    },
  };
}

/**
 * AI Tool: Rewrite Section
 * Rewrites existing content with specific instructions
 */
export async function rewriteSection(request: AIToolRequest): Promise<AIToolResponse> {
  const { context, userMessage, additionalInstructions } = request;
  
  if (!context.currentSection?.content) {
    return {
      success: false,
      error: 'Existing content is required for rewriting',
    };
  }
  
  const prompt = buildRewritePrompt(context, userMessage, additionalInstructions);
  
  // TODO: Implement actual AI API call
  return {
    success: true,
    content: '[Rewritten content will appear here]',
    metadata: {
      mode: 'rewrite',
      sectionId: context.currentSection.id,
    },
  };
}

/**
 * AI Tool: Expand Section
 * Expands existing content with more detail
 */
export async function expandSection(request: AIToolRequest): Promise<AIToolResponse> {
  const { context, additionalInstructions } = request;
  
  if (!context.currentSection?.content) {
    return {
      success: false,
      error: 'Existing content is required for expansion',
    };
  }
  
  const prompt = buildExpandPrompt(context, additionalInstructions);
  
  // TODO: Implement actual AI API call
  return {
    success: true,
    content: '[Expanded content will appear here]',
    metadata: {
      mode: 'expand',
      sectionId: context.currentSection.id,
    },
  };
}

/**
 * AI Tool: Shorten Section
 * Condenses existing content
 */
export async function shortenSection(request: AIToolRequest): Promise<AIToolResponse> {
  const { context, additionalInstructions } = request;
  
  if (!context.currentSection?.content) {
    return {
      success: false,
      error: 'Existing content is required for shortening',
    };
  }
  
  const prompt = buildShortenPrompt(context, additionalInstructions);
  
  // TODO: Implement actual AI API call
  return {
    success: true,
    content: '[Shortened content will appear here]',
    metadata: {
      mode: 'shorten',
      sectionId: context.currentSection.id,
    },
  };
}

/**
 * AI Tool: Improve Grammar
 * Improves grammar and clarity of existing content
 */
export async function improveGrammar(request: AIToolRequest): Promise<AIToolResponse> {
  const { context } = request;
  
  if (!context.currentSection?.content) {
    return {
      success: false,
      error: 'Existing content is required for grammar improvement',
    };
  }
  
  const prompt = buildGrammarPrompt(context);
  
  // TODO: Implement actual AI API call
  return {
    success: true,
    content: '[Grammar-improved content will appear here]',
    metadata: {
      mode: 'improve_grammar',
      sectionId: context.currentSection.id,
    },
  };
}

/**
 * AI Tool: Analyze Section
 * Analyzes section quality and provides suggestions
 */
export async function analyzeSection(request: AIToolRequest): Promise<AIToolResponse> {
  const { context } = request;
  
  if (!context.currentSection?.content) {
    return {
      success: false,
      error: 'Existing content is required for analysis',
    };
  }
  
  const prompt = buildAnalyzePrompt(context);
  
  // TODO: Implement actual AI API call
  return {
    success: true,
    content: '[Analysis will appear here]',
    metadata: {
      mode: 'analyze',
      sectionId: context.currentSection.id,
    },
  };
}

/**
 * AI Tool: Use Logbook Data
 * Incorporates logbook entries into section content
 */
export async function useLogbookData(request: AIToolRequest): Promise<AIToolResponse> {
  const { context, userMessage, additionalInstructions } = request;
  
  if (!context.linkedLogbookEntries || context.linkedLogbookEntries.length === 0) {
    return {
      success: false,
      error: 'Linked logbook entries are required',
    };
  }
  
  const prompt = buildLogbookPrompt(context, userMessage, additionalInstructions);
  
  // TODO: Implement actual AI API call
  return {
    success: true,
    content: '[Logbook-integrated content will appear here]',
    metadata: {
      mode: 'logbook',
      sectionId: context.currentSection?.id,
    },
  };
}

// Prompt Builders

function buildGeneratePrompt(context: AIContext, userMessage?: string, additionalInstructions?: string): string {
  const basePrompt = `You are writing ${context.currentSection?.title} for a ${context.report.report_type} report.

${formatContextAsPrompt(context, 'generate')}

Instructions:
- Write professionally and academically
- Use only the provided logbook entries as evidence
- Do not invent activities or information
- Follow academic report formatting standards
- Be specific and detailed`;

  if (userMessage) {
    return `${basePrompt}\n\nUser Request: ${userMessage}`;
  }
  
  if (additionalInstructions) {
    return `${basePrompt}\n\nAdditional Instructions: ${additionalInstructions}`;
  }
  
  return basePrompt;
}

function buildRegeneratePrompt(context: AIContext, userMessage?: string, additionalInstructions?: string): string {
  const basePrompt = `Regenerate the content for ${context.currentSection?.title}.

${formatContextAsPrompt(context, 'generate')}

Instructions:
- Maintain the same structure and key points
- Improve clarity and professionalism
- Use provided logbook entries
- Do not change the section's main purpose`;

  if (userMessage) {
    return `${basePrompt}\n\nUser Request: ${userMessage}`;
  }
  
  if (additionalInstructions) {
    return `${basePrompt}\n\nAdditional Instructions: ${additionalInstructions}`;
  }
  
  return basePrompt;
}

function buildRewritePrompt(context: AIContext, userMessage?: string, additionalInstructions?: string): string {
  const basePrompt = `Rewrite the following section content based on the user's request.

Current Content:
${context.currentSection?.content}

${formatContextAsPrompt(context, 'edit')}`;

  if (userMessage) {
    return `${basePrompt}\n\nUser Request: ${userMessage}`;
  }
  
  if (additionalInstructions) {
    return `${basePrompt}\n\nAdditional Instructions: ${additionalInstructions}`;
  }
  
  return basePrompt;
}

function buildExpandPrompt(context: AIContext, additionalInstructions?: string): string {
  const basePrompt = `Expand the following section with more detail and depth.

Current Content:
${context.currentSection?.content}

${formatContextAsPrompt(context, 'edit')}

Instructions:
- Add more specific details from logbook entries
- Elaborate on key points
- Maintain professional tone
- Use organization knowledge where relevant`;

  if (additionalInstructions) {
    return `${basePrompt}\n\nAdditional Instructions: ${additionalInstructions}`;
  }
  
  return basePrompt;
}

function buildShortenPrompt(context: AIContext, additionalInstructions?: string): string {
  const basePrompt = `Condense the following section while maintaining key information.

Current Content:
${context.currentSection?.content}

${formatContextAsPrompt(context, 'edit')}

Instructions:
- Remove redundancy
- Keep essential information
- Maintain clarity
- Preserve professional tone`;

  if (additionalInstructions) {
    return `${basePrompt}\n\nAdditional Instructions: ${additionalInstructions}`;
  }
  
  return basePrompt;
}

function buildGrammarPrompt(context: AIContext): string {
  return `Improve the grammar, spelling, and clarity of the following section.

Current Content:
${context.currentSection?.content}

${formatContextAsPrompt(context, 'edit')}

Instructions:
- Fix grammar and spelling errors
- Improve sentence structure
- Enhance clarity without changing meaning
- Maintain professional academic tone`;
}

function buildAnalyzePrompt(context: AIContext): string {
  return `Analyze the following section for quality and completeness.

Current Content:
${context.currentSection?.content}

${formatContextAsPrompt(context, 'analyze')}

Provide analysis on:
- Content quality and depth
- Grammar and clarity
- Use of evidence from logbook entries
- Missing information
- Suggestions for improvement
- Formatting issues`;
}

function buildLogbookPrompt(context: AIContext, userMessage?: string, additionalInstructions?: string): string {
  const basePrompt = `Incorporate the provided logbook entries into the section content.

${formatContextAsPrompt(context, 'generate')}

Instructions:
- Use specific activities from logbook entries
- Reference dates and weeks where appropriate
- Maintain chronological flow if relevant
- Do not invent activities not in logbook`;

  if (userMessage) {
    return `${basePrompt}\n\nUser Request: ${userMessage}`;
  }
  
  if (additionalInstructions) {
    return `${basePrompt}\n\nAdditional Instructions: ${additionalInstructions}`;
  }
  
  return basePrompt;
}

function formatContextAsPrompt(context: AIContext, mode: string): string {
  // Reuse the context builder utility
  const { formatContextAsPrompt } = require('./ai-context-builder');
  return formatContextAsPrompt(context, mode as any);
}
