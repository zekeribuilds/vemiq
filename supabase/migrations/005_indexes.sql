-- Vemiq Database V1 - Indexes
-- Migration: 005_indexes.sql

create index idx_profiles_institution
on public.profiles(institution_id);

create index idx_logbooks_user
on public.logbooks(user_id);

create index idx_logbook_entries_user
on public.logbook_entries(user_id);

create index idx_logbook_entries_logbook
on public.logbook_entries(logbook_id);

create index idx_reports_user
on public.reports(user_id);

create index idx_report_sections_report
on public.report_sections(report_id);

create index idx_chat_messages_user
on public.chat_messages(user_id);

create index idx_payments_user
on public.payments(user_id);

create index idx_uploads_user
on public.uploads(user_id);
