import { AI_PROMPTS } from './prompts';

interface GenerationOptions {
  model?: string;
  temperature?: number;
  maxTokens?: number;
}

export class AIService {
  private apiKey: string;
  private baseUrl: string;

  constructor(apiKey: string, baseUrl: string = 'https://api.openai.com/v1') {
    this.apiKey = apiKey;
    this.baseUrl = baseUrl;
  }

  async generateText(prompt: string, options: GenerationOptions = {}): Promise<string> {
    const {
      model = 'gpt-3.5-turbo',
      temperature = 0.7,
      maxTokens = 2000,
    } = options;

    try {
      const response = await fetch(`${this.baseUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
        },
        body: JSON.stringify({
          model,
          messages: [
            {
              role: 'system',
              content: 'You are an expert academic writing assistant for engineering students.',
            },
            {
              role: 'user',
              content: prompt,
            },
          ],
          temperature,
          max_tokens: maxTokens,
        }),
      });

      if (!response.ok) {
        throw new Error(`AI API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data.choices[0].message.content;
    } catch (error) {
      console.error('AI generation error:', error);
      throw error;
    }
  }

  async cleanLogs(logs: string): Promise<string> {
    const prompt = AI_PROMPTS.cleanLogs(logs);
    return this.generateText(prompt, { temperature: 0.3 });
  }

  async extractContext(logs: string): Promise<string> {
    const prompt = AI_PROMPTS.extractContext(logs);
    return this.generateText(prompt, { temperature: 0.3 });
  }

  async generateIntroduction(studentInfo: any, companyInfo: string): Promise<string> {
    const prompt = AI_PROMPTS.introduction(studentInfo, companyInfo);
    return this.generateText(prompt, { temperature: 0.7 });
  }

  async generateCompanyOverview(companyName: string, context: string): Promise<string> {
    const prompt = AI_PROMPTS.companyOverview(companyName, context);
    return this.generateText(prompt, { temperature: 0.7 });
  }

  async generateActivities(logs: string): Promise<string> {
    const prompt = AI_PROMPTS.activities(logs);
    return this.generateText(prompt, { temperature: 0.7 });
  }

  async generateChallenges(logs: string): Promise<string> {
    const prompt = AI_PROMPTS.challenges(logs);
    return this.generateText(prompt, { temperature: 0.7 });
  }

  async generateConclusion(studentInfo: any, duration: string): Promise<string> {
    const prompt = AI_PROMPTS.conclusion(studentInfo, duration);
    return this.generateText(prompt, { temperature: 0.7 });
  }

  async rewrite(content: string): Promise<string> {
    const prompt = AI_PROMPTS.rewrite(content);
    return this.generateText(prompt, { temperature: 0.5 });
  }

  async expand(content: string): Promise<string> {
    const prompt = AI_PROMPTS.expand(content);
    return this.generateText(prompt, { temperature: 0.7 });
  }

  async shorten(content: string): Promise<string> {
    const prompt = AI_PROMPTS.shorten(content);
    return this.generateText(prompt, { temperature: 0.5 });
  }

  async formalize(content: string): Promise<string> {
    const prompt = AI_PROMPTS.formalize(content);
    return this.generateText(prompt, { temperature: 0.3 });
  }

  async improveGrammar(content: string): Promise<string> {
    const prompt = AI_PROMPTS.improveGrammar(content);
    return this.generateText(prompt, { temperature: 0.3 });
  }
}

// Singleton instance
let aiServiceInstance: AIService | null = null;

export function getAIService(): AIService {
  if (!aiServiceInstance) {
    const apiKey = process.env.OPENAI_API_KEY || '';
    if (!apiKey) {
      throw new Error('OPENAI_API_KEY environment variable is not set');
    }
    aiServiceInstance = new AIService(apiKey);
  }
  return aiServiceInstance;
}
