import { NextResponse } from 'next/server'
import { createReportCorrection } from '@/lib/intelligence/master-service'

export async function POST(request: Request) {
  try { return NextResponse.json(await createReportCorrection(await request.json()), { status: 201 }) }
  catch (error) { return NextResponse.json({ error: error instanceof Error ? error.message : 'Unable to save correction' }, { status: 400 }) }
}
