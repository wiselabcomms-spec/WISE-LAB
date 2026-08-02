# Google Form → Supabase sync

`wise-connect-form-sync.gs.js` syncs the WISE Lab Google Form's responses into
the same `submissions` table the website's own forms write to, so they show
up in the admin dashboard.

**This can't be deployed remotely** — it has to be pasted into the Google
Form/Sheet's own Apps Script editor by whoever has edit access to it. Full
setup steps (about 5 minutes) are in the comment at the top of the script
file itself.

Submissions synced this way are tagged `track: 'founder'` (matching the
form's field set) with `meta.source: 'google-form'`, so they're
distinguishable from native-form submissions if that ever matters.
