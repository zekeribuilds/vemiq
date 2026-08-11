import { NextResponse } from 'next/server'
import { createEvidence } from '@/lib/evidence/evidence-service'
import { requireAuth } from '@/lib/auth-helpers'

export async function POST(request: Request) {
  try {
    // Verify authentication
    await requireAuth();
    return NextResponse.json(await createEvidence(await request.json()), { status: 201 })
  }
  catch (error) {
    console.error('Evidence creation error:', error);
    // Don't leak sensitive error details to client
    return NextResponse.json({ error: 'Unable to create evidence' }, { status: 400 });
  }
}
