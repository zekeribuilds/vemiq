// @ts-nocheck Deno Edge Function; deployed by Supabase Edge Functions.
// Uses deterministic extraction as a safe baseline; provider
// integrations can enrich the same rows without changing the data contract.
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const db = createClient(Deno.env.get('SUPABASE_URL')!, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!)
const json = (value: unknown, status = 200) => new Response(JSON.stringify(value), { status, headers: { 'content-type': 'application/json' } })

function terms(text: string) {
  return [...new Set(text.toLowerCase().match(/[a-z][a-z-]{3,}/g) ?? [])].slice(0, 25)
}

Deno.serve(async (request: Request) => {
  if (request.method !== 'POST') return json({ error: 'POST required' }, 405)
  const { data: job, error } = await db.from('intelligence_jobs').select('*').eq('status', 'pending').order('created_at').limit(1).maybeSingle()
  if (error) return json({ error: error.message }, 500)
  if (!job) return json({ processed: false })
  await db.from('intelligence_jobs').update({ status: 'processing', attempts: job.attempts + 1, updated_at: new Date().toISOString() }).eq('id', job.id)
  try {
    if (job.job_type === 'understand_evidence') {
      const { data: evidence } = await db.from('evidence_items').select('*').eq('id', job.evidence_id).single()
      const text = [evidence?.title, evidence?.activity_name, evidence?.description].filter(Boolean).join(' ')
      const words = terms(text)
      const entities = words.filter((w) => ['motor','generator','transformer','continuity','inspection','testing','maintenance','safety'].includes(w))
      if (entities.length) await db.from('evidence_entities').upsert(entities.map((entity_name) => ({ evidence_id: job.evidence_id, entity_type: ['motor','generator','transformer'].includes(entity_name) ? 'equipment' : 'activity', entity_name, confidence_score: 60 })), { onConflict: 'evidence_id,entity_type,entity_name' })
      await db.from('evidence_insights').upsert({ evidence_id: job.evidence_id, summary: text || 'Evidence captured for review.', skills_detected: entities.filter((x) => ['testing','maintenance','inspection'].includes(x)), equipment_detected: entities.filter((x) => ['motor','generator','transformer'].includes(x)), technical_topics: words.slice(0, 10), learning_outcomes: [] }, { onConflict: 'evidence_id' })
    }
    if (job.job_type === 'voice_transcription') await db.from('voice_transcripts').upsert({ evidence_id: job.evidence_id, processing_status: 'completed', raw_transcript: job.payload?.raw_transcript ?? null, clean_transcript: job.payload?.clean_transcript ?? null, semantic_transcript: job.payload?.semantic_transcript ?? null }, { onConflict: 'evidence_id' })
    if (job.job_type === 'clarification') await db.from('clarification_sessions').insert({ evidence_id: job.evidence_id, status: 'active', questions: ['What equipment or component was involved?', 'What procedure or test was performed?', 'What result or learning outcome did you observe?'] })
    if (job.job_type === 'documentation_health') await db.rpc('refresh_documentation_health', { target_workspace: job.workspace_id })
    await db.from('intelligence_jobs').update({ status: 'completed', updated_at: new Date().toISOString() }).eq('id', job.id)
    return json({ processed: true, job_id: job.id })
  } catch (cause) {
    await db.from('intelligence_jobs').update({ status: 'failed', error_message: cause instanceof Error ? cause.message : String(cause), updated_at: new Date().toISOString() }).eq('id', job.id)
    return json({ error: 'Job failed', job_id: job.id }, 500)
  }
})
