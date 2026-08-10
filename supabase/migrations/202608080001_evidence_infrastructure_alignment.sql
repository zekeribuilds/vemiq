-- Vemiq Evidence Infrastructure alignment (additive migration)
-- Preserves legacy logbook/report/payment tables and adds workspace/evidence primitives.

create table if not exists public.workspaces (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade,
  name text not null, workspace_type text not null check (workspace_type in ('siwes','swep','project','internship','research','career')),
  institution_id uuid references public.institutions(id), training_organization_id uuid references public.training_organizations(id),
  start_date date, end_date date, status text not null default 'active' check (status in ('active','completed','archived')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.evidence_items (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, title text not null, activity_name text,
  description text, source_type text not null default 'text' check (source_type in ('voice','photo','text','logbook_scan','document','recovery')),
  evidence_date date, week_number integer check (week_number is null or week_number > 0), section_name text, supervisor_name text,
  confidence_score numeric(5,2) check (confidence_score between 0 and 100), verification_status text not null default 'pending' check (verification_status in ('verified','reconstructed','pending')),
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists public.evidence_media (
  id uuid primary key default gen_random_uuid(), evidence_id uuid not null references public.evidence_items(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade, storage_path text not null, media_type text not null check (media_type in ('image','audio','video','document','sketch','logbook_page')),
  mime_type text, file_size bigint check (file_size is null or file_size >= 0), created_at timestamptz not null default now()
);
create table if not exists public.evidence_images (
  id uuid primary key default gen_random_uuid(), evidence_media_id uuid not null unique references public.evidence_media(id) on delete cascade,
  equipment_name text, equipment_category text, activity_name text, week_number integer, caption text, confidence_score numeric(5,2), created_at timestamptz not null default now()
);
create table if not exists public.evidence_sketches (
  id uuid primary key default gen_random_uuid(), evidence_media_id uuid not null unique references public.evidence_media(id) on delete cascade,
  description text, equipment_name text, linked_activity text, created_at timestamptz not null default now()
);
create table if not exists public.documentation_health (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null unique references public.workspaces(id) on delete cascade,
  evidence_score numeric(5,2), week_coverage_score numeric(5,2), image_coverage_score numeric(5,2), quality_score numeric(5,2), missing_weeks integer not null default 0,
  health_status text not null default 'attention' check (health_status in ('excellent','good','attention','poor')), updated_at timestamptz not null default now()
);
create table if not exists public.documentation_passes (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  payment_id uuid references public.payments(id), status text not null default 'pending' check (status in ('pending','active','expired','cancelled')), activated_at timestamptz, created_at timestamptz not null default now()
);
create table if not exists public.recovery_sessions (
  id uuid primary key default gen_random_uuid(), workspace_id uuid not null references public.workspaces(id) on delete cascade, user_id uuid not null references auth.users(id) on delete cascade,
  missing_week integer not null check (missing_week > 0), interview_data jsonb not null default '{}'::jsonb, generated_evidence jsonb, created_at timestamptz not null default now()
);
create table if not exists public.institution_templates (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.institutions(id) on delete cascade, template_name text not null, report_type text not null, template_config jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.institution_report_rules (
  id uuid primary key default gen_random_uuid(), institution_id uuid not null references public.institutions(id) on delete cascade, rules jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.department_report_rules (
  id uuid primary key default gen_random_uuid(), department_id uuid not null references public.departments(id) on delete cascade, rules jsonb not null default '{}'::jsonb, created_at timestamptz not null default now()
);
create table if not exists public.transactions (
  id uuid primary key default gen_random_uuid(), user_id uuid not null references auth.users(id) on delete cascade, workspace_id uuid references public.workspaces(id) on delete set null,
  payment_id uuid references public.payments(id) on delete set null, transaction_type text not null check (transaction_type in ('documentation_pass','report_payment','refund','credit')),
  amount numeric(12,2) not null, status text not null, created_at timestamptz not null default now()
);

alter table public.organization_knowledge add column if not exists equipment_catalog jsonb not null default '{}'::jsonb;
alter table public.organization_knowledge add column if not exists department_catalog jsonb not null default '{}'::jsonb;
alter table public.organization_knowledge add column if not exists safety_procedures jsonb not null default '{}'::jsonb;
alter table public.organization_knowledge add column if not exists workflows jsonb not null default '{}'::jsonb;
alter table public.organization_knowledge add column if not exists technical_processes jsonb not null default '{}'::jsonb;
alter table public.logbooks add column if not exists workspace_id uuid references public.workspaces(id) on delete set null;
alter table public.reports add column if not exists workspace_id uuid references public.workspaces(id) on delete set null;

create index if not exists idx_workspaces_user on public.workspaces(user_id);
create index if not exists idx_evidence_workspace_week on public.evidence_items(workspace_id, week_number);
create index if not exists idx_evidence_media_evidence on public.evidence_media(evidence_id);
create index if not exists idx_transactions_user_workspace on public.transactions(user_id, workspace_id);

create or replace function public.refresh_documentation_health(target_workspace uuid)
returns void language plpgsql security invoker set search_path = public as $$
declare total_weeks integer; covered_weeks integer; evidence_count integer; image_count integer;
begin
  select greatest(coalesce(((end_date - start_date) / 7) + 1, 0), 0) into total_weeks from public.workspaces where id = target_workspace;
  select count(distinct week_number), count(*) into covered_weeks, evidence_count from public.evidence_items where workspace_id = target_workspace;
  select count(*) into image_count from public.evidence_media em join public.evidence_items ei on ei.id = em.evidence_id where ei.workspace_id = target_workspace and em.media_type = 'image';
  insert into public.documentation_health(workspace_id,evidence_score,week_coverage_score,image_coverage_score,quality_score,missing_weeks,health_status)
  values (target_workspace, least(evidence_count * 10,100), case when total_weeks=0 then 0 else least(covered_weeks::numeric/total_weeks*100,100) end, least(image_count*10,100), least((evidence_count*10 + case when total_weeks=0 then 0 else covered_weeks::numeric/total_weeks*100 end + image_count*10)/3,100), greatest(total_weeks-covered_weeks,0), case when total_weeks > 0 and covered_weeks >= total_weeks and evidence_count >= 10 then 'excellent' when evidence_count >= 5 then 'good' when evidence_count > 0 then 'attention' else 'poor' end)
  on conflict (workspace_id) do update set evidence_score=excluded.evidence_score, week_coverage_score=excluded.week_coverage_score, image_coverage_score=excluded.image_coverage_score, quality_score=excluded.quality_score, missing_weeks=excluded.missing_weeks, health_status=excluded.health_status, updated_at=now();
end; $$;

create or replace view public.report_evidence_context with (security_invoker=true) as
select r.id report_id, r.workspace_id, ei.id evidence_id, ei.title, ei.activity_name, ei.description, ei.week_number, ei.section_name, ei.verification_status,
       em.storage_path, em.media_type, ei.confidence_score, ei.evidence_date
from public.reports r join public.evidence_items ei on ei.workspace_id=r.workspace_id left join public.evidence_media em on em.evidence_id=ei.id;

do $$ declare t text; begin foreach t in array array['workspaces','evidence_items','evidence_media','evidence_images','evidence_sketches','documentation_health','documentation_passes','recovery_sessions','institution_templates','institution_report_rules','department_report_rules','transactions'] loop execute format('alter table public.%I enable row level security',t); end loop; end $$;

create policy "workspace owners access workspaces" on public.workspaces for all to authenticated using (user_id=(select auth.uid()) or public.is_admin()) with check (user_id=(select auth.uid()) or public.is_admin());
create policy "workspace owners access evidence" on public.evidence_items for all to authenticated using (user_id=(select auth.uid()) or public.is_admin()) with check (user_id=(select auth.uid()) or public.is_admin());
create policy "workspace owners access media" on public.evidence_media for all to authenticated using (user_id=(select auth.uid()) or public.is_admin()) with check (user_id=(select auth.uid()) or public.is_admin());
create policy "evidence owners access intelligence" on public.evidence_images for all to authenticated using (exists(select 1 from public.evidence_media m where m.id=evidence_media_id and (m.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_media m where m.id=evidence_media_id and (m.user_id=(select auth.uid()) or public.is_admin())));
create policy "evidence owners access sketches" on public.evidence_sketches for all to authenticated using (exists(select 1 from public.evidence_media m where m.id=evidence_media_id and (m.user_id=(select auth.uid()) or public.is_admin()))) with check (exists(select 1 from public.evidence_media m where m.id=evidence_media_id and (m.user_id=(select auth.uid()) or public.is_admin())));
create policy "workspace owners access health" on public.documentation_health for select to authenticated using (exists(select 1 from public.workspaces w where w.id=workspace_id and (w.user_id=(select auth.uid()) or public.is_admin())));
create policy "workspace owners access passes" on public.documentation_passes for all to authenticated using (user_id=(select auth.uid()) or public.is_admin()) with check (user_id=(select auth.uid()) or public.is_admin());
create policy "workspace owners access recovery" on public.recovery_sessions for all to authenticated using (user_id=(select auth.uid()) or public.is_admin()) with check (user_id=(select auth.uid()) or public.is_admin());
create policy "admins manage institution rules" on public.institution_templates for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated read institution templates" on public.institution_templates for select to authenticated using (true);
create policy "admins manage institution report rules" on public.institution_report_rules for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated read institution report rules" on public.institution_report_rules for select to authenticated using (true);
create policy "admins manage department report rules" on public.department_report_rules for all to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "authenticated read department report rules" on public.department_report_rules for select to authenticated using (true);
create policy "transaction owners access transactions" on public.transactions for select to authenticated using (user_id=(select auth.uid()) or public.is_admin());

insert into storage.buckets(id,name,public) values ('evidence-media','evidence-media',false),('logbook-scans','logbook-scans',false),('profile-assets','profile-assets',false) on conflict (id) do nothing;
create policy "users manage own evidence media objects" on storage.objects for all to authenticated using (bucket_id='evidence-media' and (storage.foldername(name))[1]=(select auth.uid()::text)) with check (bucket_id='evidence-media' and (storage.foldername(name))[1]=(select auth.uid()::text));
create policy "users manage own logbook scans" on storage.objects for all to authenticated using (bucket_id='logbook-scans' and (storage.foldername(name))[1]=(select auth.uid()::text)) with check (bucket_id='logbook-scans' and (storage.foldername(name))[1]=(select auth.uid()::text));
create policy "users manage own profile assets" on storage.objects for all to authenticated using (bucket_id='profile-assets' and (storage.foldername(name))[1]=(select auth.uid()::text)) with check (bucket_id='profile-assets' and (storage.foldername(name))[1]=(select auth.uid()::text));

