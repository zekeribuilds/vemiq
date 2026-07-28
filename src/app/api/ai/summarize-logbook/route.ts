import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { weekId, logbookId, dailyEntries } = body;

    if (!weekId || !logbookId) {
      return NextResponse.json(
        { error: 'weekId and logbookId are required' },
        { status: 400 }
      );
    }

    const supabase = await createClient();
    const weekNumber = Number(weekId);

    const { data: logbookData, error: logbookError } = await supabase
      .from('logbooks')
      .select(`
        *,
        institution:institutions(name),
        training_organization:training_organizations(name)
      `)
      .eq('id', logbookId)
      .single();

    if (logbookError) throw logbookError;

    const { data: entriesData, error: entriesError } = await supabase
      .from('logbook_entries')
      .select('*')
      .eq('logbook_id', logbookId)
      .eq('week_number', weekNumber)
      .order('entry_date', { ascending: true });

    if (entriesError) throw entriesError;

    // Fetch uploads/attachments for this week
    const { data: uploadsData } = await supabase
      .from('uploads')
      .select('*')
      .eq('linked_to', `${logbookId}:week:${weekId}`)
      .order('created_at', { ascending: false });

    // Build context for AI
    const context = {
      weekNumber,
      dailyEntries: dailyEntries || Object.fromEntries(
        (entriesData || []).map((entry: any) => [entry.title || entry.entry_date, entry.activity_description])
      ),
      logbook: {
        title: logbookData.title,
        type: logbookData.program_type,
        institution: logbookData.institution?.name,
        organization: logbookData.training_organization?.name,
      },
      attachments: uploadsData?.map(u => ({
        fileName: u.file_url.split('/').pop(),
        fileType: u.file_type,
        uploadedAt: u.created_at,
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
  
  if (context.logbook?.organization) {
    summary += `Training at ${context.logbook.organization}\n`;
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
