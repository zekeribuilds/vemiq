-- Vemiq Intelligence Layer: additive, idempotent, evidence-first.

create table if not exists public.evidence_entities (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references public.evidence_items(id) on delete cascade,
  entity_type text not null check (entity_type in ('equipment','machine','tool','software','skill','activity','process','material','safety_procedure','location')),
  entity_name text not null, confidence_score numeric(5,2) check (confidence_score between 0 and 100), created_at timestamptz not null default now(),
  unique(evidence_id, entity_type, entity_name)
);
create table if not exists public.evidence_insights (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null unique references public.evidence_items(id) on delete cascade,
  summary text, skills_detected jsonb not null default '[]'::jsonb, equipment_detected jsonb not null default '[]'::jsonb,
  learning_outcomes jsonb not null default '[]'::jsonb, technical_topics jsonb not null default '[]'::jsonb, generated_at timestamptz not null default now()
);
create table if not exists public.voice_transcripts (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null unique references public.evidence_items(id) on delete cascade,
  raw_transcript text, clean_transcript text, semantic_transcript text, processing_status text not null default 'pending' check (processing_status in ('pending','processing','completed','failed')),
  created_at timestamptz not null default now()
);
create table if not exists public.clarification_sessions (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references public.evidence_items(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending','active','completed','cancelled')), questions jsonb not null default '[]'::jsonb, answers jsonb not null default '[]'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.logbook_scan_pages (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  storage_path text not null, page_number integer not null check (page_number > 0), ocr_text text, detected_week integer, detected_instructor text, confidence_score numeric(5,2), created_at timestamptz not null default now()
);
create table if not exists public.intelligence_jobs (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, workspace_id uuid references public.workspaces(id) on delete cascade,
  evidence_id uuid references public.evidence_items(id) on delete cascade, job_type text not null check (job_type in ('understand_evidence','voice_transcription','image_understanding','sketch_understanding','logbook_ocr','documentation_health','clarification')),
  payload jsonb not null default '{}'::jsonb, status text not null default 'pending' check (status in ('pending','processing','completed','failed')), attempts integer not null default 0, error_message text, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

alter table public.evidence_items add column if not exists metadata jsonb not null default '{}'::jsonb;
alter table public.evidence_images add column if not exists preferred_chapter text;
alter table public.evidence_images add column if not exists placement_priority integer not null default 0;
alter table public.evidence_images add column if not exists figure_title text;
alter table public.evidence_images add column if not exists figure_description text;

create index if not exists evidence_entities_evidence_idx on public.evidence_entities(evidence_id);
create index if not exists intelligence_jobs_pending_idx on public.intelligence_jobs(status, created_at) where status='pending';
create index if not exists logbook_scan_pages_workspace_idx on public.logbook_scan_pages(workspace_id, page_number);

do $$ declare t text; begin foreach t in array array['evidence_entities','evidence_insights','voice_transcripts','clarification_sessions','logbook_scan_pages','intelligence_jobs'] loop execute format('alter table public.%I enable row level security',t); end loop; end $$;

create policy "evidence owners access entities" on public.evidence_entities for all to authenticated using (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin())));
create policy "evidence owners access insights" on public.evidence_insights for all to authenticated using (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin())));
create policy "evidence owners access transcripts" on public.voice_transcripts for all to authenticated using (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin())));
create policy "evidence owners access clarifications" on public.clarification_sessions for all to authenticated using (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin())));
create policy "workspace owners access scan pages" on public.logbook_scan_pages for all to authenticated using (user_id=(select auth.uid()) or public.is_admin()) with check (user_id=(select auth.uid()) or public.is_admin());
create policy "job owners access intelligence jobs" on public.intelligence_jobs for select to authenticated using (user_id=(select auth.uid()) or public.is_admin());

create or replace function public.enqueue_evidence_intelligence() returns trigger language plpgsql security invoker set search_path=public,pg_catalog as $$
begin
  insert into public.intelligence_jobs(user_id,workspace_id,evidence_id,job_type,payload)
  values (new.user_id,new.workspace_id,new.id,'understand_evidence',jsonb_build_object('source_type',new.source_type));
  if new.source_type='voice' then insert into public.intelligence_jobs(user_id,workspace_id,evidence_id,job_type) values(new.user_id,new.workspace_id,new.id,'voice_transcription'); end if;
  if new.confidence_score is not null and new.confidence_score < 60 then insert into public.intelligence_jobs(user_id,workspace_id,evidence_id,job_type) values(new.user_id,new.workspace_id,new.id,'clarification'); end if;
  perform public.refresh_documentation_health(new.workspace_id);
  return new;
end $$;
drop trigger if exists evidence_intelligence_after_insert on public.evidence_items;
create trigger evidence_intelligence_after_insert after insert on public.evidence_items for each row execute function public.enqueue_evidence_intelligence();
create or replace function public.enqueue_health_after_evidence_change() returns trigger language plpgsql security invoker set search_path=public,pg_catalog as $$
begin insert into public.intelligence_jobs(user_id,workspace_id,job_type) values(coalesce(new.user_id,old.user_id),coalesce(new.workspace_id,old.workspace_id),'documentation_health'); return coalesce(new,old); end $$;
drop trigger if exists evidence_health_after_update on public.evidence_items;
create trigger evidence_health_after_update after update or delete on public.evidence_items for each row execute function public.enqueue_health_after_evidence_change();

drop view if exists public.report_evidence_context;
create view public.report_evidence_context with (security_invoker=true) as
select r.id report_id, r.workspace_id, ei.id evidence_id, ei.title, ei.activity_name, ei.description, ei.week_number, ei.section_name, ei.verification_status, ei.metadata,
       em.storage_path, em.media_type, ei.confidence_score, ei.evidence_date, ins.summary insight_summary, ins.skills_detected, ins.equipment_detected, ins.learning_outcomes, ins.technical_topics,
       img.preferred_chapter, img.placement_priority, img.figure_title, img.figure_description
from public.reports r join public.evidence_items ei on ei.workspace_id=r.workspace_id left join public.evidence_media em on em.evidence_id=ei.id left join public.evidence_images img on img.evidence_media_id=em.id left join public.evidence_insights ins on ins.evidence_id=ei.id;
