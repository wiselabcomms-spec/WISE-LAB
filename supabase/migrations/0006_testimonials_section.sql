-- Adds "testimonials" as a valid blog_posts.section value, so founder
-- story / testimonial posts can be tagged to show on the new homepage
-- Founder Stories section the same way every other section already pulls
-- in its own "Latest from the Journal" posts (see 0003_blog_post_section.sql).

alter table public.blog_posts drop constraint if exists blog_posts_section_check;

alter table public.blog_posts
  add constraint blog_posts_section_check
  check (section is null or section in (
    'wise-journey',
    'build-tracks',
    'enter-the-lab',
    'power-circle',
    'behind-the-wings',
    'become-a-mentor',
    'wise-connect',
    'testimonials'
  ));
