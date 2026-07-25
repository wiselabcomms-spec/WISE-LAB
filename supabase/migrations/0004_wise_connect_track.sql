-- ---------------------------------------------------------------------------
-- Allow the WISE Connect contact form to persist as a submissions row.
-- Previously wise-connect inquiries weren't stored anywhere — the public
-- form only set local React state. This widens the existing `track` check
-- constraint so those inquiries flow through the same submissions table,
-- RLS policies, and notify trigger as the other four tracks.
-- ---------------------------------------------------------------------------
alter table public.submissions
  drop constraint if exists submissions_track_check;

alter table public.submissions
  add constraint submissions_track_check
  check (track in ('founder', 'enterprise', 'mentor', 'partner', 'wise-connect'));
