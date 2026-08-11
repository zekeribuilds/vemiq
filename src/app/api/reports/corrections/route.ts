import { NextResponse } from 'next/server'
import { createReportCorrection } from '@/lib/intelligence/master-service'
import { requireAuth } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    // Verify authentication
    await requireAuth();
    return NextResponse.json(await createReportCorrection(await request.json()), { status: 201 }) 
  }
  catch (error) {
    console.error('Report correction error:', error);
    // Don't leak sensitive error details to client
    return NextResponse.json({ error: 'Unable to save correction' }, { status: 400 });
  }
}
