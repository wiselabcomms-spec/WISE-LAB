-- Create a public storage bucket for team member photos.
-- Run this in the Supabase SQL Editor.

insert into storage.buckets (id, name, public)
values ('team-images', 'team-images', true)
on conflict (id) do nothing;

-- Allow anyone to read (view) images (public bucket)
create policy "team-images: public read"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'team-images');

-- Allow admins to upload / delete
create policy "team-images: admin write"
  on storage.objects for insert
  to authenticated
  with check (
    bucket_id = 'team-images'
    and exists (select 1 from public.admin_profiles where id = auth.uid())
  );

create policy "team-images: admin delete"
  on storage.objects for delete
  to authenticated
  using (
    bucket_id = 'team-images'
    and exists (select 1 from public.admin_profiles where id = auth.uid())
  );
