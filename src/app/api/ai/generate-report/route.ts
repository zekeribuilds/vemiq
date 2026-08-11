import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/aiService';
import { createClient as createSupabaseClient } from '@/lib/supabase/server';
import { requireAuth } from '@/lib/auth-helpers';

export async function POST(request: NextRequest) {
  try {
    // Verify authentication
    await requireAuth();
    
    const body = await request.json();
    const { studentInfo, reportType, reportStructure, weeklyLogs = [], workspaceId } = body;

    if (!studentInfo || !reportType) {
      return NextResponse.json(
        { error: 'Missing required data' },
        { status: 400 }
      );
    }

    const aiService = getAIService();

    // Clean logs
    const logsText = weeklyLogs.map((log: any) => 
      `Week ${log.week}: ${log.title} - ${log.description}`
    ).join('\n');

    let evidenceText = '';
    if (workspaceId) {
      const supabase = await createSupabaseClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
      const { data: workspace } = await supabase.from('workspaces').select('id').eq('id', workspaceId).eq('user_id', user.id).single();
      if (!workspace) return NextResponse.json({ error: 'Workspace not found' }, { status: 404 });
      const { data: evidence } = await supabase.from('report_evidence_context').select('*').eq('workspace_id', workspaceId).order('week_number');
      evidenceText = (evidence ?? []).map((item: any) =>
        `Week ${item.week_number ?? 'unspecified'}: ${item.title ?? ''} - ${item.description ?? item.activity_name ?? ''}. Verified: ${item.verification_status}. Insights: ${item.insight_summary ?? ''}`
      ).join('\n');
    }
    const sourceText = [logsText, evidenceText ? `Evidence source of truth:\n${evidenceText}` : ''].filter(Boolean).join('\n\n');

    const sections: any = {};

    // Generate each section
    if (reportStructure.includeDedication) {
      // Dedication is static
    }

    if (reportStructure.includeAcknowledgement) {
      // Acknowledgement is static
    }

    if (reportStructure.includeAbstract) {
      // Abstract is generated
    }

    // Generate chapters
    sections.introduction = await aiService.generateIntroduction(studentInfo, studentInfo.companyName);
    sections.companyOverview = await aiService.generateCompanyOverview(studentInfo.companyName, sourceText);
    sections.activities = await aiService.generateActivities(sourceText);
    sections.challenges = await aiService.generateChallenges(sourceText);
    sections.conclusion = await aiService.generateConclusion(studentInfo, studentInfo.duration);

    return NextResponse.json({ sections });
  } catch (error) {
    console.error('Report generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate report' },
      { status: 500 }
    );
  }
}
