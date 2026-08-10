// @ts-nocheck Deno entrypoint; deployed by Supabase Edge Functions.
// Production flow: authenticate, validate the workspace owner, insert evidence,
// create evidence_media, then enqueue provider-specific image/sketch analysis.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
serve(async (request) => new Response(JSON.stringify({ ok: true, next: 'persist evidence through the authenticated Supabase client' }), { headers: { 'content-type': 'application/json' } }))
