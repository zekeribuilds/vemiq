import { NextRequest, NextResponse } from 'next/server';
import { getAIService } from '@/lib/ai/aiService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentInfo, reportType, reportStructure, weeklyLogs } = body;

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
    sections.companyOverview = await aiService.generateCompanyOverview(studentInfo.companyName, logsText);
    sections.activities = await aiService.generateActivities(logsText);
    sections.challenges = await aiService.generateChallenges(logsText);
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
