import { NextResponse } from 'next/server'
import { createEvidence } from '@/lib/evidence/evidence-service'
import { requireAuth } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    // Verify authentication
    await requireAuth();
    const body = await request.json(); 
    return NextResponse.json(await createEvidence({ ...body, source_type: 'text' }), { status: 201 }) 
  }
  catch (error) {
    console.error('Text evidence creation error:', error);
    // Don't leak sensitive error details to client
    return NextResponse.json({ error: 'Unable to create text evidence' }, { status: 400 });
  }
}
