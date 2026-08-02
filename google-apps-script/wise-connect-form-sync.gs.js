/**
 * WISE Lab — Google Form -> Supabase sync.
 *
 * Setup (needs to be done ONCE by whoever has edit access to the Google
 * Form / its linked Sheet — this cannot be deployed remotely, it has to be
 * pasted into Google's own Apps Script editor by a human with access):
 *
 *   1. Open the Google Form (or its linked response Sheet).
 *   2. Extensions -> Apps Script.
 *   3. Delete anything in the default Code.gs, paste this entire file in.
 *   4. Click the clock icon (Triggers) in the left sidebar -> + Add Trigger.
 *        - Function: onFormSubmit
 *        - Event source: From form (if editing from the Form) or
 *          From spreadsheet -> On form submit (if editing from the Sheet)
 *        - Save. Google will prompt for authorization the first time —
 *          approve it (it only needs permission to read the form response
 *          and make outbound HTTP requests, nothing else).
 *   5. Test it: submit the live form once with test data, then check
 *      /admin/wise-connect or query Supabase directly to confirm the row
 *      landed. Delete the test row afterward.
 *
 * That's the entire setup — no server, no new infrastructure. Every new
 * form response fires this function automatically from then on.
 *
 * Backfilling the existing response(s) already in the Sheet (e.g. the
 * "Zaera" entry from before this was wired up): run backfillExistingRows()
 * manually once from the Apps Script editor (select it in the function
 * dropdown, click Run). It's idempotent-ish but not duplicate-safe — see
 * the comment on that function — so only run it once.
 */

// Public anon key — same one already embedded in the live site's JS bundle.
// Safe to be here; it's designed to be public and is constrained entirely
// by the Supabase RLS policies on the `submissions` table (public INSERT
// only, no SELECT/UPDATE/DELETE).
var SUPABASE_URL = 'https://khtrjbqhqgzxpomcwwmx.supabase.co';
var SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodHJqYnFocWd6eHBvbWN3d214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NzA3MjgsImV4cCI6MjEwMDM0NjcyOH0.EUHPac2hCR-Zff94cxqnWdSsp-AUC40sEygCuRpoujg'

/**
 * Fires automatically on every new form submission (once the trigger from
 * the setup steps above is wired up). `e.namedValues` is
 * { "Question title": ["answer"], ... } — every question on the form,
 * whatever it's titled, flows through into `values` as-is, so this doesn't
 * need updating if fields are added/renamed on the form later.
 */
function onFormSubmit(e) {
  var values = {}
  var namedValues = e.namedValues || {}
  for (var key in namedValues) {
    // Checkbox/multi-select questions come back as an array; join for a
    // single readable string. Everything else is already a 1-item array.
    values[key] = namedValues[key].join(', ')
  }

  postToSupabase(values, new Date())
}

/**
 * One-time manual run: sends every row already in the response Sheet
 * (including ones submitted before this script existed) to Supabase.
 * NOT duplicate-safe — if you run this twice, or run it after new rows
 * have already synced via onFormSubmit, those rows will be inserted
 * again. Run it exactly once, right after setup, then never again.
 */
function backfillExistingRows() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1')
  if (!sheet) {
    throw new Error('Could not find a sheet named "Form Responses 1" — check the actual tab name and update this function.')
  }
  var data = sheet.getDataRange().getValues()
  var headers = data[0]
  var timestampCol = headers.indexOf('Timestamp')

  for (var i = 1; i < data.length; i++) {
    var row = data[i]
    var values = {}
    for (var col = 0; col < headers.length; col++) {
      if (col === timestampCol) continue
      values[headers[col]] = String(row[col] ?? '')
    }
    var submittedAt = timestampCol >= 0 && row[timestampCol] ? new Date(row[timestampCol]) : new Date()
    postToSupabase(values, submittedAt)
    Utilities.sleep(250) // stay well under any rate limit
  }
}

function postToSupabase(values, submittedAt) {
  var payload = {
    track: 'founder',
    values: values,
    analytics: { source: 'google-form' },
    submitted_at: submittedAt.toISOString(),
    meta: { userAgent: 'google-apps-script', locale: 'en', source: 'google-form' },
  }

  var response = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/submissions', {
    method: 'post',
    contentType: 'application/json',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + SUPABASE_ANON_KEY,
      Prefer: 'return=minimal',
    },
    payload: JSON.stringify(payload),
    muteHttpExceptions: true,
  })

  var code = response.getResponseCode()
  if (code >= 300) {
    console.error('Supabase insert failed (' + code + '): ' + response.getContentText())
    throw new Error('Supabase insert failed with status ' + code)
  }
}
