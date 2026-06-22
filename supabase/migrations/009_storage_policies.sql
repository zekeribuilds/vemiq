-- Vemiq Database V1 - Storage Policies
-- Migration: 009_storage_policies.sql

-- BUCKET 1: avatars
-- Purpose: User profile photos
-- Rules: Anyone can view, authenticated users can upload/update/delete own avatar
-- Path: avatars/{user_id}/avatar.jpg

-- SELECT: Public read
create policy "Public can view avatars"
on storage.objects for select
using (bucket_id = 'avatars');

-- INSERT: Authenticated users can upload own avatar
create policy "Users can insert own avatar"
on storage.objects for insert
with check (
    bucket_id = 'avatars'
    and auth.role() = 'authenticated'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- UPDATE: Users can update own avatar
create policy "Users can update own avatar"
on storage.objects for update
using (
    bucket_id = 'avatars'
    and (split_part(name, '/', 1) = auth.uid()::text)
)
with check (
    bucket_id = 'avatars'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- DELETE: Users can delete own avatar
create policy "Users can delete own avatar"
on storage.objects for delete
using (
    bucket_id = 'avatars'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- BUCKET 2: institution-assets
-- Purpose: Institution logos
-- Rules: Public read, admin write only

-- SELECT: Public read
create policy "Public can view institution-assets"
on storage.objects for select
using (bucket_id = 'institution-assets');

-- INSERT: Admin only
create policy "Admins can insert institution-assets"
on storage.objects for insert
with check (
    bucket_id = 'institution-assets'
    and public.is_admin()
);

-- UPDATE: Admin only
create policy "Admins can update institution-assets"
on storage.objects for update
using (
    bucket_id = 'institution-assets'
    and public.is_admin()
)
with check (
    bucket_id = 'institution-assets'
    and public.is_admin()
);

-- DELETE: Admin only
create policy "Admins can delete institution-assets"
on storage.objects for delete
using (
    bucket_id = 'institution-assets'
    and public.is_admin()
);

-- BUCKET 3: organization-assets
-- Purpose: Company logos
-- Rules: Public read, admin write only

-- SELECT: Public read
create policy "Public can view organization-assets"
on storage.objects for select
using (bucket_id = 'organization-assets');

-- INSERT: Admin only
create policy "Admins can insert organization-assets"
on storage.objects for insert
with check (
    bucket_id = 'organization-assets'
    and public.is_admin()
);

-- UPDATE: Admin only
create policy "Admins can update organization-assets"
on storage.objects for update
using (
    bucket_id = 'organization-assets'
    and public.is_admin()
)
with check (
    bucket_id = 'organization-assets'
    and public.is_admin()
);

-- DELETE: Admin only
create policy "Admins can delete organization-assets"
on storage.objects for delete
using (
    bucket_id = 'organization-assets'
    and public.is_admin()
);

-- BUCKET 4: logbook-files
-- Purpose: Images, audio, evidence files
-- Path: logbook-files/{user-id}/{logbook-id}/{week}/{file}
-- Rules: Owner only

-- SELECT: Owner only
create policy "Users can view own logbook-files"
on storage.objects for select
using (
    bucket_id = 'logbook-files'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- INSERT: Owner only
create policy "Users can insert own logbook-files"
on storage.objects for insert
with check (
    bucket_id = 'logbook-files'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- UPDATE: Owner only
create policy "Users can update own logbook-files"
on storage.objects for update
using (
    bucket_id = 'logbook-files'
    and (split_part(name, '/', 1) = auth.uid()::text)
)
with check (
    bucket_id = 'logbook-files'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- DELETE: Owner only
create policy "Users can delete own logbook-files"
on storage.objects for delete
using (
    bucket_id = 'logbook-files'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- BUCKET 5: report-exports
-- Purpose: Generated PDFs
-- Path: report-exports/{user-id}/{report-id}/{version}.pdf
-- Rules: Owner only

-- SELECT: Owner only
create policy "Users can view own report-exports"
on storage.objects for select
using (
    bucket_id = 'report-exports'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- INSERT: Owner only
create policy "Users can insert own report-exports"
on storage.objects for insert
with check (
    bucket_id = 'report-exports'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- UPDATE: Owner only
create policy "Users can update own report-exports"
on storage.objects for update
using (
    bucket_id = 'report-exports'
    and (split_part(name, '/', 1) = auth.uid()::text)
)
with check (
    bucket_id = 'report-exports'
    and (split_part(name, '/', 1) = auth.uid()::text)
);

-- DELETE: Owner only
create policy "Users can delete own report-exports"
on storage.objects for delete
using (
    bucket_id = 'report-exports'
    and (split_part(name, '/', 1) = auth.uid()::text)
);
