# Google Form ↔ Supabase two-way sync

`wise-connect-form-sync.gs.js` keeps the WISE Lab Google Form and the site's
own Supabase `submissions` table consistent with each other, in both
directions:

- **Google Form → Supabase** (`onFormSubmit`): every new Form response is
  posted into `submissions` so it shows up in the admin dashboard, tagged
  `track: 'founder'` with `meta.source: 'google-form'`.
- **Supabase → Google Sheet** (`syncSupabaseToSheet`): every submission in
  Supabase — native-site applications across all 4 tracks
  (Founder/Enterprise/Mentor/Partner) *and* Google-Form-sourced ones — is
  mirrored into a new "All Submissions (Synced)" tab in the same
  spreadsheet, deduped by Supabase row id so it's safe to re-run on a timer.

**This can't be deployed remotely** — it has to be pasted into the Google
Form/Sheet's own Apps Script editor by whoever has edit access to it. Full
setup steps (two triggers: one event-driven for `onFormSubmit`, one
time-driven every 15 minutes for `syncSupabaseToSheet`) are in the comment
at the top of the script file itself.

Reading Supabase (rather than just inserting into it) requires admin-level
access, so `syncSupabaseToSheet` logs in with the WISE Lab admin
email/password — see the SECURITY NOTE in the script file before giving
anyone else edit access to this Form/Sheet.
