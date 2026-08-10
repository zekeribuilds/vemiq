-- Live hardening applied to Vemiq production.
-- Auth leaked-password protection remains a project Auth setting and must be enabled in Dashboard.

do $$
declare f record;
begin
  for f in
    select n.nspname as schema_name, p.proname as function_name,
           pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public'
  loop
    execute format('alter function %I.%I(%s) set search_path = public, pg_catalog', f.schema_name, f.function_name, f.args);
  end loop;
  for f in
    select n.nspname as schema_name, p.proname as function_name,
           pg_get_function_identity_arguments(p.oid) as args
    from pg_proc p join pg_namespace n on n.oid=p.pronamespace
    where n.nspname='public' and p.prosecdef
  loop
    execute format('revoke execute on function %I.%I(%s) from public, anon, authenticated', f.schema_name, f.function_name, f.args);
  end loop;
end $$;

drop policy if exists "admins manage institution rules" on public.institution_templates;
drop policy if exists "admins manage institution report rules" on public.institution_report_rules;
drop policy if exists "admins manage department report rules" on public.department_report_rules;

create policy "admins insert institution templates" on public.institution_templates for insert to authenticated with check (public.is_admin());
create policy "admins update institution templates" on public.institution_templates for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete institution templates" on public.institution_templates for delete to authenticated using (public.is_admin());
create policy "admins insert institution report rules" on public.institution_report_rules for insert to authenticated with check (public.is_admin());
create policy "admins update institution report rules" on public.institution_report_rules for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete institution report rules" on public.institution_report_rules for delete to authenticated using (public.is_admin());
create policy "admins insert department report rules" on public.department_report_rules for insert to authenticated with check (public.is_admin());
create policy "admins update department report rules" on public.department_report_rules for update to authenticated using (public.is_admin()) with check (public.is_admin());
create policy "admins delete department report rules" on public.department_report_rules for delete to authenticated using (public.is_admin());

drop index if exists public.idx_evidence_media_evidence;
drop index if exists public.idx_transactions_user_workspace;

do $$
declare c record; idx_name text;
begin
  for c in
    select con.conrelid::regclass as table_name, con.conname, con.conkey,
           array_agg(att.attname order by u.ordinality) as columns
    from pg_constraint con
    cross join lateral unnest(con.conkey) with ordinality as u(attnum, ordinality)
    join pg_attribute att on att.attrelid=con.conrelid and att.attnum=u.attnum
    where con.contype='f' and con.connamespace='public'::regnamespace
    group by con.conrelid, con.conname, con.conkey
    having not exists (select 1 from pg_index i where i.indrelid=con.conrelid and i.indisvalid and i.indpred is null and i.indkey::smallint[] @> con.conkey)
  loop
    idx_name := left(regexp_replace(c.table_name::text || '_' || c.conname || '_idx','[^a-zA-Z0-9_]+','_','g'), 60);
    execute format('create index if not exists %I on %s (%s)', idx_name, c.table_name, array_to_string(c.columns, ', '));
  end loop;
end $$;
