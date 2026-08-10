import { NextResponse } from 'next/server'
import { createEvidence } from '@/lib/evidence/evidence-service'
export async function POST(request: Request) {
  try { const body = await request.json(); return NextResponse.json(await createEvidence({ ...body, source_type: 'photo', metadata: { ...(body.metadata ?? {}), processing: 'image_understanding' } }), { status: 201 }) }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create photo evidence' }, { status: 400 }) }
}
