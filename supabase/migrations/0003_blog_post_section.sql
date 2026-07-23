-- Tag each blog post to a homepage section so the live page can show a
-- "Latest from the Journal" preview strip inline within that section,
-- instead of only via a standalone /blog list.

alter table public.blog_posts add column if not exists section text;

do $$
begin
  if not exists (
    select 1 from pg_constraint where conname = 'blog_posts_section_check'
  ) then
    alter table public.blog_posts
      add constraint blog_posts_section_check
      check (section is null or section in (
        'wise-journey',
        'build-tracks',
        'enter-the-lab',
        'power-circle',
        'behind-the-wings',
        'become-a-mentor',
        'wise-connect'
      ));
  end if;
end $$;

create index if not exists blog_posts_section_idx on public.blog_posts (section);
