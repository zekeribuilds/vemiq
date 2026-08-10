import { NextResponse } from 'next/server'
import { createEvidence } from '@/lib/evidence/evidence-service'

export async function POST(request: Request) {
  try { return NextResponse.json(await createEvidence(await request.json()), { status: 201 }) }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to create evidence' }, { status: 400 }) }
}
