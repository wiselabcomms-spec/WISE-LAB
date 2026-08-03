# Google Form ↔ Supabase ↔ Google Sheet — fully automatic three-way sync

`wise-connect-form-sync.gs.js` keeps the WISE Lab Google Form, the site's
Supabase `submissions` table, and the Google Sheet all consistent with each
other. Once set up, nothing needs to be clicked ever again — every
direction runs on its own trigger:

- **Google Form → Supabase** (`onFormSubmit`, event-driven): every new Form
  response is posted into `submissions` immediately, so it shows up in the
  admin dashboard, tagged `track: 'founder'` with `meta.source: 'google-form'`.
- **Supabase → Google Sheet** (`syncSupabaseToSheet`, every 15 min): every
  submission in Supabase — native-site applications across all 4 tracks
  (Founder/Enterprise/Mentor/Partner) *and* Google-Form-sourced ones — is
  mirrored into an "All Submissions (Synced)" tab, deduped by Supabase row id.
- **Google Sheet → Supabase** (`syncSheetToSupabase`, every 15 min): catches
  rows typed directly into "Form Responses 1" by hand (bypassing the live
  Form). Uses a "Synced to Supabase" tracking column so real Form
  submissions (already pushed by `onFormSubmit`) are never pushed twice.

**This can't be deployed remotely** — it has to be pasted into the Google
Form/Sheet's own Apps Script editor by whoever has edit access to it. Full
setup steps (one one-time run of `markExistingRowsAsSynced`, then three
triggers) are in the comment at the top of the script file itself.

Reading Supabase (rather than just inserting into it) requires admin-level
access, so `syncSupabaseToSheet` logs in with the WISE Lab admin
email/password — see the SECURITY NOTE in the script file before giving
anyone else edit access to this Form/Sheet.
