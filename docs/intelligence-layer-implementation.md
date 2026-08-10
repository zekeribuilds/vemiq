# Intelligence Layer Implementation

The live Vemiq project now has additive evidence-understanding tables for entities, insights, voice transcripts, clarification sessions, OCR pages, and intelligence jobs. Evidence inserts enqueue understanding work and low-confidence clarification work; evidence changes enqueue health recalculation. A PostgreSQL cron job refreshes all workspace health records every 15 minutes.

`intelligence-worker` is deployed as an authenticated Supabase Edge Function. It claims pending jobs, writes deterministic baseline entities/insights, persists transcript fields supplied by an STT provider, creates clarification questions, and refreshes health. Provider adapters can enrich the same contracts later without schema changes.

The Next.js API exposes authenticated `POST /api/evidence`, `/api/evidence/text`, `/api/evidence/voice`, and `/api/evidence/photo`. All routes verify the session and workspace ownership through the server Supabase client.

The existing report context view now includes evidence metadata and insight fields, plus image placement metadata. Existing report/logbook tables and generation jobs remain unchanged.

## Deliberate boundaries

- Actual Whisper/OCR/model calls require provider credentials and are isolated behind the job payload/function contract.
- No unsupported evidence is promoted into report content; the report context exposes source evidence and verification metadata.
- Existing storage buckets and RLS remain in place; new intelligence tables inherit evidence/workspace ownership.

## Verification

- Migration applied to production successfully.
- Edge Function deployed with JWT verification enabled.
- Cron schedule `vemiq-documentation-health` created at 15-minute intervals.
- TypeScript application typecheck should be run after generated database types are synchronized.
