import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/aiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, content } = body;

    if (!action || !content) {
      return NextResponse.json(
        { error: 'Action and content are required' },
        { status: 400 }
      );
    }

    const aiService = getAIService();
    let updatedContent = '';
    let response = '';

    switch (action) {
      case 'rewrite':
        updatedContent = await aiService.rewrite(content);
        response = 'I\'ve rewritten the section for better clarity and flow.';
        break;
      case 'expand':
        updatedContent = await aiService.expand(content);
        response = 'I\'ve expanded the section with more detail and examples.';
        break;
      case 'shorten':
        updatedContent = await aiService.shorten(content);
        response = 'I\'ve shortened the section while maintaining key information.';
        break;
      case 'formalize':
        updatedContent = await aiService.formalize(content);
        response = 'I\'ve converted the content to a formal academic tone.';
        break;
      case 'grammar':
        updatedContent = await aiService.improveGrammar(content);
        response = 'I\'ve improved the grammar and punctuation of the section.';
        break;
      default:
        return NextResponse.json(
          { error: 'Invalid action' },
          { status: 400 }
        );
    }

    return NextResponse.json({ response, updatedContent });
  } catch (error) {
    console.error('AI edit error:', error);
    return NextResponse.json(
      { error: 'Failed to process edit request' },
      { status: 500 }
    );
  }
}
