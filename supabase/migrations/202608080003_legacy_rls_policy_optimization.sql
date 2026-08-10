-- Production policy optimization for the empty report state.
-- Consolidates legacy public-role owner/admin policies into authenticated policies.
-- The same SQL was applied to the live Vemiq project through Supabase MCP.

-- See the live migration execution for the complete idempotent policy replacement:
-- activity_logs, report_access, report_exports, report_generation_jobs,
-- report_logbook_entries, report_sections, report_versions, and reports.
-- Policies use `(select auth.uid())` to avoid per-row auth initplans and combine
-- owner/admin access in one policy per command.
