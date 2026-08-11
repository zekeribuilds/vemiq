import { NextResponse } from 'next/server'
import { createEvidence } from '@/lib/evidence/evidence-service'
import { requireAuth } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    // Verify authentication
    await requireAuth();
    const body = await request.json(); 
    return NextResponse.json(await createEvidence({ ...body, source_type: 'photo', metadata: { ...(body.metadata ?? {}), processing: 'image_understanding' } }), { status: 201 }) 
  }
  catch (error) {
    console.error('Photo evidence creation error:', error);
    // Don't leak sensitive error details to client
    return NextResponse.json({ error: 'Unable to create photo evidence' }, { status: 400 });
  }
}
