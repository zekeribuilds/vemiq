# Vemiq Evidence Infrastructure Migration

## Compatibility

This migration is additive. Existing `logbooks`, `logbook_entries`, `reports`, `report_sections`, `payments`, uploads, report jobs, and export flows remain intact. `logbooks.workspace_id` and `reports.workspace_id` are nullable bridge columns so old records continue to work while new flows become workspace-aware.

## Backfill strategy

1. Create workspaces for new activity containers.
2. For legacy records, create one workspace per logbook and set `logbooks.workspace_id`; link reports manually or through a reviewed user/institution/organization match before making the bridge non-null.
3. Convert logbook entries and uploaded media into `evidence_items` only after deduplication; retain the original rows as the compatibility source of truth.
4. Recompute `documentation_health` after each workspace batch.

## Target pipeline

`workspace -> evidence_items/evidence_media -> documentation_health -> existing logbook generator -> existing report generator`, with `report_evidence_context` supplying evidence, images, sketches, and verification metadata alongside existing logbook data and institution rules.

## Edge Functions required

- `evidence-ingest`: validate upload metadata, create evidence, and enqueue image/sketch extraction.
- `documentation-health`: invoke `refresh_documentation_health` after evidence mutations.
- `evidence-recovery`: persist interview data and proposed reconstructed evidence for review.
- `generate-report`: extend the existing job input with workspace evidence context; keep the current fallback path when no workspace is linked.
- `storage-cleanup`: remove orphaned media only after retention checks.

## Risks and controls

- Incorrect legacy matching: keep bridge columns nullable and require reviewed backfills.
- RLS regressions: test owner, cross-user, and admin access for every new table and bucket.
- Duplicate evidence: retain source IDs in the application backfill job and make imports idempotent.
- Report drift: feed evidence as additional context and preserve the current report generator fallback.
- Health score interpretation: treat scores as guidance, not proof of correctness; expose verification status.

## Rollout

Deploy migration, regenerate TypeScript types from the live schema, ship workspace/evidence writes behind a feature flag, run sampled backfills, enable health dashboard, then switch report jobs to evidence context after compatibility tests pass.
