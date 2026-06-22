import { NextRequest, NextResponse } from 'next/server';
import { getPDFService } from '@/lib/pdf/pdfService';
import { generateReportHTML } from '@/lib/pdf/reportTemplate';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { reportData } = body;

    if (!reportData) {
      return NextResponse.json(
        { error: 'Report data is required' },
        { status: 400 }
      );
    }

    const html = generateReportHTML(reportData);
    const pdfService = getPDFService();
    const pdfBuffer = await pdfService.generatePDF(html);

    return new NextResponse(pdfBuffer as any, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${reportData.title.replace(/\s+/g, '_')}.pdf"`,
      },
    });
  } catch (error) {
    console.error('PDF generation error:', error);
    return NextResponse.json(
      { error: 'Failed to generate PDF' },
      { status: 500 }
    );
  }
}
