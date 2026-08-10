import { NextResponse } from 'next/server'
import { createEvidence } from '@/lib/evidence/evidence-service'
export async function POST(request: Request) {
  try { const body = await request.json(); return NextResponse.json(await createEvidence({ ...body, source_type: 'text' }), { status: 201 }) }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create text evidence' }, { status: 400 }) }
}
