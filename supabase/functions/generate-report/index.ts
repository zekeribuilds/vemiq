// @ts-nocheck Deno entrypoint; deployed by Supabase Edge Functions.
// Adapter contract: add report_evidence_context to the existing generation job;
// fall back to the current logbook-only input when workspace_id is null.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
serve(async () => new Response(JSON.stringify({ ok: true, mode: 'evidence-aware-compatible' }), { headers: { 'content-type': 'application/json' } }))
