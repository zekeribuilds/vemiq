import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/aiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { message, sectionContent, sectionId } = body;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    
    const prompt = `You are an AI assistant helping edit a section of an academic report. 
    Current section content: ${sectionContent}
    User request: ${message}
    
    Provide a helpful response. If the user asks to edit the content, provide the updated content in a format that can be easily extracted.`;

    const response = await aiService.generateText(prompt, {
      temperature: 0.7,
      maxTokens: 1000,
    });

    return NextResponse.json({ response });
  } catch (error) {
    console.error('AI chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process AI request' },
      { status: 500 }
    );
  }
}
