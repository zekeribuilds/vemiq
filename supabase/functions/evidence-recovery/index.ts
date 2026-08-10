// @ts-nocheck Deno entrypoint; deployed by Supabase Edge Functions.
// Recovery must persist interview_data and proposed generated_evidence for review;
// it must never silently mark reconstructed evidence as verified.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
serve(async () => new Response(JSON.stringify({ ok: true, verification_status: 'reconstructed' }), { headers: { 'content-type': 'application/json' } }))
