-- Newsletter subscribers — homepage "subscribe for updates" section.
-- Public can INSERT their own email (RLS mirrors the `submissions` table's
-- public-insert / admin-only-read pattern); no public SELECT/UPDATE/DELETE.

create table if not exists public.newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  subscribed_at timestamptz not null default now()
);

alter table public.newsletter_subscribers enable row level security;

create policy "newsletter_subscribers: public insert"
  on public.newsletter_subscribers for insert
  to anon, authenticated
  with check (true);

create policy "newsletter_subscribers: admin read"
  on public.newsletter_subscribers for select
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));
