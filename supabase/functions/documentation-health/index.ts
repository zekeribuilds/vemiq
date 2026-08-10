// @ts-nocheck Deno entrypoint; deployed by Supabase Edge Functions.
// Invoke refresh_documentation_health(workspace_id) after evidence mutations.
import { serve } from 'https://deno.land/std@0.224.0/http/server.ts'
serve(async () => new Response(JSON.stringify({ ok: true, next: 'call refresh_documentation_health' }), { headers: { 'content-type': 'application/json' } }))
