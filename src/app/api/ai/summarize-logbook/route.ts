import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekId, dailyEntries } = body;

    if (!weekId) {
      return NextResponse.json(
        { error: 'weekId is required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    // Fetch week data with related context
    const { data: weekData, error: weekError } = await supabase
      .from('weekly_logs')
      .select(`
        *,
        report:reports(
          *,
          report_metadata(*),
          institution:institutions(name),
          faculty:faculties(name),
          department:departments(name),
          organization:organizations(name)
        )
      `)
      .eq('id', weekId)
      .single();

    if (weekError) throw weekError;

    // Fetch uploads/attachments for this week
    const { data: uploadsData } = await supabase
      .from('uploads')
      .select('*')
      .eq('report_id', weekData.report_id)
      .order('uploaded_at', { ascending: false });

    // Build context for AI
    const context = {
      weekNumber: weekData.week_number,
      dailyEntries,
      report: {
        title: weekData.report?.title,
        type: weekData.report?.report_type,
        institution: weekData.report?.institution?.name,
        faculty: weekData.report?.faculty?.name,
        department: weekData.report?.department?.name,
        organization: weekData.report?.organization?.name,
        studentLevel: weekData.report?.report_metadata?.academic_level,
        academicSession: weekData.report?.report_metadata?.academic_session,
      },
      attachments: uploadsData?.map(u => ({
        fileName: u.file_name,
        fileType: u.file_type,
        uploadedAt: u.uploaded_at,
      })) || [],
    };

    // Call Vemiq AI system (external dependency)
    // Note: This is a placeholder - actual AI integration would call external Vemiq AI service
    const aiSummary = await generateAISummary(context);

    return NextResponse.json({
      success: true,
      summary: aiSummary,
      context,
    });
  } catch (error) {
    console.error('AI summary error:', error);
    return NextResponse.json(
      { error: 'Failed to generate summary' },
      { status: 500 }
    );
  }
}

// Placeholder for external Vemiq AI integration
async function generateAISummary(context: any): Promise<string> {
  // This would call the external Vemiq AI system
  // For now, return a grounded summary based on the provided context
  
  const entries = Object.entries(context.dailyEntries || {}).filter(([_, content]) => content);
  
  if (entries.length === 0) {
    return 'No activities recorded for this week yet.';
  }

  const daysWithEntries = entries.map(([day, _]) => day).join(', ');
  
  let summary = `Week ${context.weekNumber} Summary:\n\n`;
  summary += `Activities recorded on: ${daysWithEntries}\n\n`;
  
  if (context.report?.organization) {
    summary += `Training at ${context.report.organization}\n`;
  }
  
  summary += `\nKey activities:\n`;
  entries.forEach(([day, content]) => {
    const truncated = String(content).substring(0, 100);
    summary += `- ${day}: ${truncated}${String(content).length > 100 ? '...' : ''}\n`;
  });

  if (context.attachments && context.attachments.length > 0) {
    summary += `\nAttachments: ${context.attachments.length} file(s) attached\n`;
  }

  return summary;
}
