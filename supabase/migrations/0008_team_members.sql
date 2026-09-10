-- WISE Lab — team members table
-- Powers the "Behind the Wings" section on the homepage.
-- Seed includes the six existing hardcoded members.
-- Run via `supabase db push` or the SQL editor once a project exists.

create table if not exists public.team_members (
  id            uuid        primary key default gen_random_uuid(),
  name          text        not null,
  role          text        not null default '',
  tagline       text        not null default '',
  bio           text        not null default '',
  image_url     text        not null default '',
  linkedin_url  text        not null default '',
  is_featured   boolean     not null default false,   -- renders in the large hero card
  sort_order    integer     not null default 0,        -- ascending = first
  is_visible    boolean     not null default true,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);

create index if not exists team_members_sort_idx on public.team_members (sort_order asc);
create unique index if not exists team_members_name_idx on public.team_members (name);

alter table public.team_members enable row level security;

-- Public: anyone can read visible members
drop policy if exists "team_members: public read visible" on public.team_members;
create policy "team_members: public read visible"
  on public.team_members for select
  to anon, authenticated
  using (is_visible = true);

-- Admins: read all (including hidden)
drop policy if exists "team_members: admin read all" on public.team_members;
create policy "team_members: admin read all"
  on public.team_members for select
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- Admins: full write access
drop policy if exists "team_members: admin write" on public.team_members;
create policy "team_members: admin write"
  on public.team_members for all
  to authenticated
  using (exists (select 1 from public.admin_profiles where id = auth.uid()))
  with check (exists (select 1 from public.admin_profiles where id = auth.uid()));

-- keep updated_at fresh
drop trigger if exists team_members_set_updated_at on public.team_members;
create trigger team_members_set_updated_at
  before update on public.team_members
  for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- Seed: existing six team members from BehindTheWings.tsx
-- ---------------------------------------------------------------------------
insert into public.team_members
  (name, role, tagline, bio, image_url, linkedin_url, is_featured, sort_order, is_visible)
values
  (
    'Muneaza Durrani',
    'Project Director',
    'A venture builder and ecosystem strategist focused on turning early-stage potential into growth-ready enterprises.',
    'Leads WISE Lab''s programme direction — setting the vision, standards, and day-to-day execution that help women entrepreneurs access mentorship, markets, capital readiness, and the right room to grow. She is the founding member of the team building the platform.',
    '/team/munneaza-durrani-resized.jpeg',
    'https://www.linkedin.com/in/muneaza-durrani-35a85810',
    true,
    0,
    true
  ),
  (
    'Kashmala Shahid',
    'Communications & Partnerships Manager',
    'A strategic communications and partnerships professional who turns messages into momentum and relationships into opportunity.',
    '',
    '/team/kashmala-shahid.png',
    'https://www.linkedin.com/in/kashmalaskhattak',
    false,
    1,
    true
  ),
  (
    'Fatima Shah',
    'Growth & Monitoring Specialist',
    'A public-policy and social-impact professional advancing inclusion through evidence, partnerships and purpose-led action.',
    '',
    '/team/fatima-shah.png',
    'https://www.linkedin.com/in/fatima-shah-56540687',
    false,
    2,
    true
  ),
  (
    'Iqra Shamshad',
    'Finance Manager',
    'A people-and-process professional building the organisational discipline that turns ambitious programmes into sustainable impact.',
    '',
    '/team/iqra-shamshad-resized.jpeg',
    'https://www.linkedin.com/in/iqra-shamshad-110645165',
    false,
    3,
    true
  ),
  (
    'Esha Mubashir',
    'Graphics Designer',
    'A visual designer building memorable brand experiences through clarity, composition and creative systems.',
    '',
    '/team/esha-mubashir-resized.jpeg',
    'https://www.linkedin.com/in/esha-mubashir-444023318',
    false,
    4,
    true
  ),
  (
    'Abeeha Widad',
    'Video Editor',
    'A young creative translating ideas into visual stories, digital conversations and audience engagement.',
    '',
    '/team/abeeha-widad.png',
    'https://www.linkedin.com/in/abeeha-widad-793020374',
    false,
    5,
    true
  )
on conflict (name) do nothing;
