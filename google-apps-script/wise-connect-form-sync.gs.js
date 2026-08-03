/**
 * WISE Lab — Google Form <-> Supabase two-way sync.
 *
 * Two independent things live in this file:
 *
 * DIRECTION 1 — Google Form -> Supabase (onFormSubmit)
 * Every Form submission already lands in this spreadsheet's "Form
 * Responses 1" tab automatically (that's just how Google Forms works, no
 * script needed for that part). onFormSubmit() additionally POSTs it to
 * Supabase so it shows up in the WISE Lab admin dashboard too.
 *
 * DIRECTION 2 — Supabase -> Google Sheet (syncSupabaseToSheet)
 * The native WISE Lab website has its OWN application form too (used by
 * most real applicants) — those submissions land straight in Supabase and
 * never touch this spreadsheet. syncSupabaseToSheet() pulls EVERY
 * submission from Supabase (both Google-Form-sourced and native-site-
 * sourced, across all 4 tracks — Founder/Enterprise/Mentor/Partner, which
 * all have different fields) and mirrors it into a new tab called
 * "All Submissions (Synced)" in THIS spreadsheet, so the Sheet becomes a
 * complete view of everything, not just Google Form responses.
 * (Native submissions aren't forced into the Form Responses tab's 36
 * Founder-specific columns — Enterprise/Mentor/Partner data wouldn't fit
 * those columns at all. The new tab uses a track-agnostic layout: a few
 * common columns plus the full raw data as JSON in the last column.)
 *
 * Setup (needs to be done ONCE by whoever has edit access to the Google
 * Form / its linked Sheet — this cannot be deployed remotely, it has to be
 * pasted into Google's own Apps Script editor by a human with access):
 *
 *   1. Open the Google Form (or its linked response Sheet).
 *   2. Extensions -> Apps Script.
 *   3. Delete anything in the default Code.gs, paste this entire file in.
 *   4. Save (Ctrl+S / floppy-disk icon) — name the project if prompted.
 *   5. Click the clock icon (Triggers) in the left sidebar -> + Add Trigger.
 *      Add TWO triggers:
 *        a) Function: onFormSubmit
 *           Event source: From spreadsheet -> On form submit
 *        b) Function: syncSupabaseToSheet
 *           Event source: Time-driven -> Minutes timer -> Every 15 minutes
 *           (or whatever interval you're comfortable with — this is what
 *           keeps native-site submissions flowing into the Sheet
 *           automatically, ongoing, with no manual action needed)
 *      Save each — Google will prompt for authorization the first time;
 *      approve it (permissions needed: read/write this spreadsheet, make
 *      outbound HTTP requests — nothing else).
 *   6. Run syncSupabaseToSheet() once manually right after setup (select
 *      it in the function dropdown at the top, click Run) to do the
 *      initial backfill of everything already in Supabase, rather than
 *      waiting up to 15 minutes for the first automatic run.
 *   7. Test onFormSubmit: submit the live form once with test data, check
 *      /admin/wise-connect or the dashboard to confirm the row landed,
 *      then delete the test row from Supabase (SQL editor).
 *
 * SECURITY NOTE: syncSupabaseToSheet needs to READ from Supabase (not just
 * insert), which requires admin-level access — the anon key alone can't
 * do this (by design, so random visitors can't read other applicants'
 * data). This script logs in as the actual WISE Lab admin account
 * (email+password below) to get read access, the same way the website's
 * own admin dashboard does. That means this script now contains a real
 * login credential, not just the public anon key. If this Apps Script
 * project is ever shared with someone who shouldn't have admin access to
 * the live dashboard, they'd effectively have it via this script too —
 * worth keeping that in mind before granting anyone else edit access to
 * this Form/Sheet.
 *
 * Backfilling the existing Form response(s) from before onFormSubmit
 * existed (e.g. the "Zaera" entry): run backfillExistingRows() manually
 * once. It's not duplicate-safe — only run it once.
 */

// Public anon key — same one already embedded in the live site's JS bundle.
// Safe to be here; it's designed to be public and is constrained entirely
// by the Supabase RLS policies on the `submissions` table (public INSERT
// only, no SELECT/UPDATE/DELETE).
var SUPABASE_URL = 'https://khtrjbqhqgzxpomcwwmx.supabase.co';
var SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtodHJqYnFocWd6eHBvbWN3d214Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODQ3NzA3MjgsImV4cCI6MjEwMDM0NjcyOH0.EUHPac2hCR-Zff94cxqnWdSsp-AUC40sEygCuRpoujg'

// Admin login — needed only for syncSupabaseToSheet() to READ existing
// submissions (the anon key above can only INSERT, never SELECT, by RLS
// design). See the SECURITY NOTE at the top of this file before sharing
// edit access to this Apps Script project with anyone else.
var ADMIN_EMAIL = 'hello@wiselab.org.pk'
var ADMIN_PASSWORD = 'WiseLabAdmin2026!'
var SYNC_SHEET_NAME = 'All Submissions (Synced)'

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

/**
 * DIRECTION 2: Supabase -> Google Sheet.
 *
 * Pulls every row from the `submissions` table (native-site submissions
 * across all 4 tracks, plus the Google-Form-sourced ones this same script
 * already inserted) and appends any not already present into the
 * "All Submissions (Synced)" tab, deduped by Supabase's own row `id` so
 * re-running this (whether manually or on the 15-minute trigger) never
 * creates duplicate rows.
 *
 * Safe to run as often as you like — each run only appends rows whose id
 * isn't already in the sheet.
 */
function syncSupabaseToSheet() {
  var token = getAdminAccessToken()
  var submissions = fetchAllSubmissions(token)
  var sheet = getOrCreateSyncSheet()
  var existingIds = getExistingSyncedIds(sheet)

  var appended = 0
  for (var i = 0; i < submissions.length; i++) {
    var submission = submissions[i]
    if (existingIds[submission.id]) continue
    appendSubmissionRow(sheet, submission)
    appended++
  }

  console.log('syncSupabaseToSheet: ' + appended + ' new row(s) appended, ' + submissions.length + ' total in Supabase.')
}

/** Logs in as the WISE Lab admin to get a token that can SELECT from
 *  `submissions` — the anon key alone is INSERT-only by RLS design. */
function getAdminAccessToken() {
  var response = UrlFetchApp.fetch(SUPABASE_URL + '/auth/v1/token?grant_type=password', {
    method: 'post',
    contentType: 'application/json',
    headers: { apikey: SUPABASE_ANON_KEY },
    payload: JSON.stringify({ email: ADMIN_EMAIL, password: ADMIN_PASSWORD }),
    muteHttpExceptions: true,
  })

  var code = response.getResponseCode()
  if (code >= 300) {
    throw new Error('Admin login failed (' + code + '): ' + response.getContentText())
  }
  return JSON.parse(response.getContentText()).access_token
}

function fetchAllSubmissions(token) {
  var response = UrlFetchApp.fetch(SUPABASE_URL + '/rest/v1/submissions?select=*&order=submitted_at.asc', {
    method: 'get',
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: 'Bearer ' + token,
    },
    muteHttpExceptions: true,
  })

  var code = response.getResponseCode()
  if (code >= 300) {
    throw new Error('Fetching submissions failed (' + code + '): ' + response.getContentText())
  }
  return JSON.parse(response.getContentText())
}

function getOrCreateSyncSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet()
  var sheet = ss.getSheetByName(SYNC_SHEET_NAME)
  if (!sheet) {
    sheet = ss.insertSheet(SYNC_SHEET_NAME)
    sheet.appendRow(['Supabase ID', 'Submitted At', 'Track', 'Name / Startup', 'Email', 'Phone', 'City', 'Source', 'Full Data (JSON)'])
    sheet.setFrozenRows(1)
  }
  return sheet
}

function getExistingSyncedIds(sheet) {
  var lastRow = sheet.getLastRow()
  if (lastRow < 2) return {}
  var idColumn = sheet.getRange(2, 1, lastRow - 1, 1).getValues()
  var ids = {}
  for (var i = 0; i < idColumn.length; i++) {
    if (idColumn[i][0]) ids[idColumn[i][0]] = true
  }
  return ids
}

/** The 4 tracks (founder/enterprise/mentor/partner + wise-connect) each use
 *  different field keys for "name" and "email" (native form field names vs.
 *  the Google Form's question-title-as-key format) — try the known
 *  candidates in order and fall back to blank rather than guessing wrong. */
function firstMatch(values, keys) {
  for (var i = 0; i < keys.length; i++) {
    if (values[keys[i]]) return values[keys[i]]
  }
  return ''
}

function appendSubmissionRow(sheet, submission) {
  var values = submission.values || {}
  var name = firstMatch(values, [
    'primaryFounderName',
    'primaryContactName',
    'fullName',
    'contactName',
    'businessName',
    'organizationName',
    'startupName',
    'Point of Contact (Primary Founder):',
    'Startup Name:',
  ])
  var email = firstMatch(values, ['email', 'Email', 'Email:', 'Email Address'])
  var phone = firstMatch(values, ['contactNumber', 'phone', 'Contact Number:'])
  var city = firstMatch(values, ['cityProvince', 'city', 'City / Province:'])
  var source = (submission.meta && submission.meta.source) || 'native-site-form'

  sheet.appendRow([
    submission.id,
    submission.submitted_at,
    submission.track,
    name,
    email,
    phone,
    city,
    source,
    JSON.stringify(values),
  ])
}
