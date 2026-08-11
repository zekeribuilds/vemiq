-- Vemiq Master Intelligence Layers (additive migration)
-- Existing workspaces/evidence/intelligence tables are intentionally reused.

create table if not exists public.evidence_relationships (
  id uuid primary key default gen_random_uuid(), source_evidence_id uuid not null references public.evidence_items(id) on delete cascade,
  target_entity_id uuid not null references public.evidence_entities(id) on delete cascade,
  relationship_type text not null check (relationship_type in ('uses_machine','performed_activity','occurred_in_section','supervised_by','related_to_process','related_to_skill')),
  confidence_score numeric(5,2) check (confidence_score between 0 and 100), created_at timestamptz not null default now(),
  unique(source_evidence_id,target_entity_id,relationship_type)
);
create table if not exists public.evidence_tags (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references public.evidence_items(id) on delete cascade,
  tag_name text not null, tag_type text not null check (tag_type in ('equipment','machine','skill','activity','tool','safety','process','department')), created_at timestamptz not null default now(),
  unique(evidence_id,tag_name,tag_type)
);
create table if not exists public.equipment_catalog (
  id uuid primary key default gen_random_uuid(), name text not null unique, category text, description text,
  common_operations jsonb not null default '[]'::jsonb, safety_procedures jsonb not null default '[]'::jsonb, report_description text, created_at timestamptz not null default now()
);
create table if not exists public.equipment_components (
  id uuid primary key default gen_random_uuid(), equipment_id uuid not null references public.equipment_catalog(id) on delete cascade, component_name text not null, description text,
  unique(equipment_id,component_name)
);
create table if not exists public.equipment_activities (
  id uuid primary key default gen_random_uuid(), equipment_id uuid not null references public.equipment_catalog(id) on delete cascade, activity_name text not null, report_language text,
  unique(equipment_id,activity_name)
);
create table if not exists public.supervisors (
  id uuid primary key default gen_random_uuid(), full_name text not null, role_type text not null check (role_type in ('siwes_coordinator','industrial_supervisor','section_instructor')),
  organization_id uuid references public.training_organizations(id) on delete set null, institution_id uuid references public.institutions(id) on delete set null, created_at timestamptz not null default now()
);
create table if not exists public.workspace_supervisors (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, supervisor_id uuid not null references public.supervisors(id) on delete cascade,
  start_date date, end_date date, unique(workspace_id,supervisor_id,start_date)
);
create table if not exists public.evidence_supervisors (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references public.evidence_items(id) on delete cascade, supervisor_id uuid not null references public.supervisors(id) on delete cascade,
  unique(evidence_id,supervisor_id)
);
create table if not exists public.workspace_weeks (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, week_number integer not null check (week_number > 0),
  start_date date, end_date date, status text not null default 'missing' check (status in ('completed','partial','missing')), unique(workspace_id,week_number)
);
create table if not exists public.week_activity_summary (
  id uuid primary key default gen_random_uuid(), workspace_week_id uuid not null unique references public.workspace_weeks(id) on delete cascade,
  evidence_count integer not null default 0, image_count integer not null default 0, quality_score numeric(5,2), summary text
);
create table if not exists public.report_conversations (
  id uuid primary key default gen_random_uuid(), report_id uuid not null references public.reports(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade, created_at timestamptz not null default now()
);
create table if not exists public.report_messages (
  id uuid primary key default gen_random_uuid(), conversation_id uuid not null references public.report_conversations(id) on delete cascade, role text not null check (role in ('user','assistant','system')), message text not null, created_at timestamptz not null default now()
);
create table if not exists public.report_corrections (
  id uuid primary key default gen_random_uuid(), report_id uuid not null references public.reports(id) on delete cascade, evidence_id uuid references public.evidence_items(id) on delete set null,
  old_content text, new_content text not null, reason text, accepted boolean not null default false, created_at timestamptz not null default now()
);
create table if not exists public.institution_programs (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.institutions(id) on delete cascade, department_id uuid references public.departments(id) on delete cascade,
  program_type text not null check (program_type in ('SWEP','SIWES')), created_at timestamptz not null default now(), unique(institution_id,department_id,program_type)
);
create table if not exists public.report_template_versions (
  id uuid primary key default gen_random_uuid(), template_id uuid not null references public.institution_templates(id) on delete cascade, version_number integer not null check (version_number > 0), template_content jsonb not null, created_at timestamptz not null default now(), unique(template_id,version_number)
);
create table if not exists public.institution_requirements (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.institutions(id) on delete cascade, requirement_type text not null, requirement_data jsonb not null default '{}'::jsonb, unique(institution_id,requirement_type)
);
alter table public.evidence_images add column if not exists preferred_section text;
create table if not exists public.organization_equipment (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.training_organizations(id) on delete cascade, equipment_id uuid references public.equipment_catalog(id) on delete set null, name text not null, metadata jsonb not null default '{}'::jsonb, unique(organization_id,name)
);
create table if not exists public.organization_processes (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.training_organizations(id) on delete cascade, name text not null, description text, metadata jsonb not null default '{}'::jsonb, unique(organization_id,name)
);
create table if not exists public.organization_safety_rules (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.training_organizations(id) on delete cascade, rule_name text not null, rule_text text not null, unique(organization_id,rule_name)
);
create table if not exists public.organization_departments_extended (
  id uuid primary key default gen_random_uuid(), organization_id uuid not null references public.training_organizations(id) on delete cascade, name text not null, description text, metadata jsonb not null default '{}'::jsonb, unique(organization_id,name)
);
create table if not exists public.job_logs (
  id uuid primary key default gen_random_uuid(), intelligence_job_id uuid references public.intelligence_jobs(id) on delete cascade, job_type text not null, level text not null default 'info', message text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.processing_metrics (
  id uuid primary key default gen_random_uuid(), job_type text not null, job_id uuid, latency_ms integer, status text not null, metadata jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.system_events (
  id uuid primary key default gen_random_uuid(), user_id uuid references auth.users(id) on delete set null, workspace_id uuid references public.workspaces(id) on delete set null, event_type text not null, payload jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);

create index if not exists evidence_relationships_source_idx on public.evidence_relationships(source_evidence_id);
create index if not exists evidence_tags_evidence_idx on public.evidence_tags(evidence_id);
create index if not exists workspace_weeks_workspace_idx on public.workspace_weeks(workspace_id,week_number);
create index if not exists report_corrections_report_idx on public.report_corrections(report_id,created_at);
create index if not exists system_events_workspace_idx on public.system_events(workspace_id,created_at);

do $$ declare t text; begin foreach t in array array['evidence_relationships','evidence_tags','equipment_catalog','equipment_components','equipment_activities','supervisors','workspace_supervisors','evidence_supervisors','workspace_weeks','week_activity_summary','report_conversations','report_messages','report_corrections','institution_programs','report_template_versions','institution_requirements','organization_equipment','organization_processes','organization_safety_rules','organization_departments_extended','job_logs','processing_metrics','system_events'] loop execute format('alter table public.%I enable row level security',t); end loop; end $$;

create policy "evidence owners access graph" on public.evidence_relationships for all to authenticated using (exists(select 1 from public.evidence_items e where e.id=source_evidence_id and (e.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_items e where e.id=source_evidence_id and (e.user_id=(select auth.uid()) or public.is_admin())));
create policy "evidence owners access tags" on public.evidence_tags for all to authenticated using (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin())));
create policy "authenticated read equipment catalog" on public.equipment_catalog for select to authenticated using (true);
create policy "admins insert equipment catalog" on public.equipment_catalog for insert to authenticated with check (public.is_admin());
create policy "admins update equipment catalog" on public.equipment_catalog for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete equipment catalog" on public.equipment_catalog for delete to authenticated using (public.is_admin());
create policy "authenticated read equipment children" on public.equipment_components for select to authenticated using (true);
create policy "authenticated read equipment activities" on public.equipment_activities for select to authenticated using (true);
create policy "authenticated read supervisors" on public.supervisors for select to authenticated using (true);
create policy "workspace owners access supervisors" on public.workspace_supervisors for all to authenticated using (exists(select 1 from public.workspaces w where w.id=workspace_id and (w.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.workspaces w where w.id=workspace_id and (w.user_id=(select auth.uid()) or public.is_admin())));
create policy "evidence owners access supervisors" on public.evidence_supervisors for all to authenticated using (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_items e where e.id=evidence_id and (e.user_id=(select auth.uid()) or public.is_admin())));
create policy "workspace owners access weeks" on public.workspace_weeks for all to authenticated using (exists(select 1 from public.workspaces w where w.id=workspace_id and (w.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.workspaces w where w.id=workspace_id and (w.user_id=(select auth.uid()) or public.is_admin())));
create policy "workspace owners access week summaries" on public.week_activity_summary for all to authenticated using (exists(select 1 from public.workspace_weeks ww join public.workspaces w on w.id=ww.workspace_id where ww.id=workspace_week_id and (w.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.workspace_weeks ww join public.workspaces w on w.id=ww.workspace_id where ww.id=workspace_week_id and (w.user_id=(select auth.uid()) or public.is_admin())));
create policy "report owners access conversations" on public.report_conversations for all to authenticated using (user_id=(select auth.uid()) or public.is_admin()) with check (user_id=(select auth.uid()) or public.is_admin());
create policy "conversation owners access messages" on public.report_messages for all to authenticated using (exists(select 1 from public.report_conversations c where c.id=conversation_id and (c.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.report_conversations c where c.id=conversation_id and (c.user_id=(select auth.uid()) or public.is_admin())));
create policy "report owners access corrections" on public.report_corrections for all to authenticated using (exists(select 1 from public.reports r where r.id=report_id and (r.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.reports r where r.id=report_id and (r.user_id=(select auth.uid()) or public.is_admin())));
create policy "authenticated read institution programs" on public.institution_programs for select to authenticated using (true);
create policy "authenticated read template versions" on public.report_template_versions for select to authenticated using (true);
create policy "authenticated read institution requirements" on public.institution_requirements for select to authenticated using (true);
create policy "authenticated read organization intelligence" on public.organization_equipment for select to authenticated using (true);
create policy "authenticated read organization processes" on public.organization_processes for select to authenticated using (true);
create policy "authenticated read organization safety" on public.organization_safety_rules for select to authenticated using (true);
create policy "authenticated read organization departments" on public.organization_departments_extended for select to authenticated using (true);
create policy "job owners access logs" on public.job_logs for select to authenticated using (exists(select 1 from public.intelligence_jobs j where j.id=intelligence_job_id and (j.user_id=(select auth.uid()) or public.is_admin())) or public.is_admin());
create policy "job owners access metrics" on public.processing_metrics for select to authenticated using (public.is_admin());
create policy "workspace owners access system events" on public.system_events for select to authenticated using (user_id=(select auth.uid()) or public.is_admin());

create or replace function public.refresh_week_activity_summary(target_week uuid) returns void language sql security invoker set search_path=public,pg_catalog as $$
  insert into public.week_activity_summary(workspace_week_id,evidence_count,image_count,quality_score,summary)
  select target_week,count(e.id),count(*) filter (where em.media_type='image'),avg(coalesce(e.confidence_score,0)),concat('Evidence coverage for week ',ww.week_number)
  from public.workspace_weeks ww left join public.evidence_items e on e.workspace_id=ww.workspace_id and e.week_number=ww.week_number left join public.evidence_media em on em.evidence_id=e.id where ww.id=target_week group by ww.week_number
  on conflict(workspace_week_id) do update set evidence_count=excluded.evidence_count,image_count=excluded.image_count,quality_score=excluded.quality_score,summary=excluded.summary;
$$;

create or replace function public.accept_report_correction(correction_uuid uuid) returns void language plpgsql security invoker set search_path=public,pg_catalog as $$
declare c record;
begin
  select * into c from public.report_corrections where id=correction_uuid and accepted=false;
  if c.id is null then raise exception 'Correction not found'; end if;
  update public.report_corrections set accepted=true where id=correction_uuid;
  if c.evidence_id is not null then update public.evidence_items set metadata=metadata || jsonb_build_object('last_correction',c.reason,'corrected_at',now()) where id=c.evidence_id; end if;
end $$;
