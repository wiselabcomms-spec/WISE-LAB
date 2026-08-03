/**
 * WISE Lab — Google Form <-> Supabase <-> Google Sheet, fully automatic
 * three-way sync. Once the triggers below are set up, nothing needs to be
 * clicked ever again — every direction runs on its own trigger.
 *
 * DIRECTION 1 — Google Form -> Supabase (onFormSubmit)
 * Fires the instant someone submits the live Form. Google already writes
 * the response into "Form Responses 1" automatically (that's just how
 * Forms work) — this additionally POSTs it to Supabase so it shows up on
 * the WISE Lab admin dashboard, and marks the row "synced" (see Direction
 * 3) so it's never pushed twice.
 *
 * DIRECTION 2 — Supabase -> Google Sheet (syncSupabaseToSheet, time-driven)
 * The native WISE Lab website has its OWN application form too (used by
 * most real applicants) — those submissions land straight in Supabase and
 * never touch this spreadsheet on their own. Every 15 minutes this pulls
 * EVERY row from Supabase (native-site across all 4 tracks —
 * Founder/Enterprise/Mentor/Partner — plus Google-Form-sourced ones) and
 * mirrors any new ones into a tab called "All Submissions (Synced)",
 * deduped by Supabase row id. (Native submissions aren't forced into the
 * Form Responses tab's 36 Founder-specific columns — other tracks'
 * data wouldn't fit those columns — so this uses its own track-agnostic
 * tab instead: a few common columns plus the full raw data as JSON.)
 *
 * DIRECTION 3 — Google Sheet -> Supabase (syncSheetToSupabase, time-driven)
 * Catches the one case Direction 1 can't: a row typed directly into "Form
 * Responses 1" by hand, bypassing the live Form entirely. Every 15 minutes
 * this scans that tab for rows without the "Synced to Supabase" checkbox
 * (added automatically as a new last column) and pushes just those.
 * Rows that came in through the real Form are already marked synced by
 * onFormSubmit, so this only ever touches genuinely new manual rows.
 *
 * Setup (needs to be done ONCE by whoever has edit access to the Google
 * Form / its linked Sheet — this cannot be deployed remotely, it has to be
 * pasted into Google's own Apps Script editor by a human with access):
 *
 *   1. Open the Google Form (or its linked response Sheet).
 *   2. Extensions -> Apps Script.
 *   3. Delete anything in the default Code.gs, paste this entire file in.
 *   4. Save (Ctrl+S / floppy-disk icon) — name the project if prompted.
 *   5. Function dropdown at the top -> select markExistingRowsAsSynced ->
 *      Run once. (One-time only: marks every row already in the sheet as
 *      already-synced so Direction 3 doesn't re-push rows that are
 *      already in Supabase the first time it runs. Skip this step only if
 *      "Form Responses 1" is completely empty.)
 *   6. Click the clock icon (Triggers) in the left sidebar -> + Add Trigger.
 *      Add THREE triggers:
 *        a) Function: onFormSubmit
 *           Event source: From spreadsheet -> On form submit
 *        b) Function: syncSupabaseToSheet
 *           Event source: Time-driven -> Minutes timer -> Every 15 minutes
 *        c) Function: syncSheetToSupabase
 *           Event source: Time-driven -> Minutes timer -> Every 15 minutes
 *      Save each — Google will prompt for authorization the first time;
 *      approve it (permissions needed: read/write this spreadsheet, make
 *      outbound HTTP requests — nothing else).
 *   7. Run syncSupabaseToSheet() once manually right after setup (function
 *      dropdown -> select it -> Run) to do the initial backfill instead of
 *      waiting up to 15 minutes for the first automatic run.
 *   8. Test onFormSubmit: submit the live form once with test data, check
 *      /admin/wise-connect or the dashboard to confirm the row landed,
 *      then delete the test row from Supabase (SQL editor).
 *
 * After setup: nothing needs to be run manually ever again. All three
 * directions run themselves on their triggers.
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
 * once. It's not duplicate-safe — only run it once. (If you've already
 * run this before setting up Direction 3, run markExistingRowsAsSynced()
 * afterward too, so those rows don't get pushed a second time.)
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

  // Mark this row synced immediately so syncSheetToSupabase's periodic
  // sweep (which catches rows typed directly into the sheet, bypassing the
  // Form) doesn't push this same row to Supabase a second time.
  if (e.range) markRowSynced(e.range.getSheet(), e.range.getRow())
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
    markRowSynced(sheet, i + 1)
    Utilities.sleep(250) // stay well under any rate limit
  }
}

var SYNCED_COLUMN_HEADER = 'Synced to Supabase'

/** Finds the "Synced to Supabase" tracking column on a sheet, adding it as
 *  a new last column the first time this runs. This column is how
 *  syncSheetToSupabase() tells "already pushed" rows apart from new ones —
 *  onFormSubmit marks a row synced the instant it inserts it, so the only
 *  rows this ever finds un-synced are ones typed directly into the sheet. */
function getSyncedColumnIndex(sheet) {
  var lastCol = sheet.getLastColumn()
  var headers = sheet.getRange(1, 1, 1, lastCol).getValues()[0]
  var idx = headers.indexOf(SYNCED_COLUMN_HEADER)
  if (idx === -1) {
    sheet.getRange(1, lastCol + 1).setValue(SYNCED_COLUMN_HEADER)
    idx = lastCol // 0-based index of the newly added column
  }
  return idx
}

function markRowSynced(sheet, rowNumber) {
  var syncedCol = getSyncedColumnIndex(sheet)
  sheet.getRange(rowNumber, syncedCol + 1).setValue(true)
}

/**
 * One-time setup function: marks every row currently in "Form Responses 1"
 * as already synced, WITHOUT pushing them to Supabase.
 *
 * Needed once, right after adding syncSheetToSupabase's trigger, because
 * every row already in the sheet at that point either came in through the
 * live Form (already pushed by onFormSubmit) or was already sent via
 * backfillExistingRows — none of them should be pushed again. Run this
 * once, then syncSheetToSupabase will only ever see genuinely new rows
 * from then on.
 */
function markExistingRowsAsSynced() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1')
  if (!sheet) {
    throw new Error('Could not find a sheet named "Form Responses 1".')
  }
  var lastRow = sheet.getLastRow()
  if (lastRow < 2) return
  var syncedCol = getSyncedColumnIndex(sheet)
  var values = []
  for (var i = 0; i < lastRow - 1; i++) values.push([true])
  sheet.getRange(2, syncedCol + 1, lastRow - 1, 1).setValues(values)
  console.log('markExistingRowsAsSynced: marked ' + (lastRow - 1) + ' row(s) as already synced.')
}

/**
 * DIRECTION 3: Sheet -> Supabase (the missing piece — a genuinely new row
 * typed straight into "Form Responses 1", bypassing the live Google Form).
 * Runs on the same kind of time-driven trigger as syncSupabaseToSheet, so
 * it's fully automatic — nothing to click, ever, once the trigger is set.
 * Safe to re-run constantly: only rows without the "Synced to Supabase"
 * checkbox get pushed, and every push immediately sets that checkbox.
 */
function syncSheetToSupabase() {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Form Responses 1')
  if (!sheet) {
    throw new Error('Could not find a sheet named "Form Responses 1".')
  }
  var data = sheet.getDataRange().getValues()
  var headers = data[0]
  var timestampCol = headers.indexOf('Timestamp')
  var syncedCol = getSyncedColumnIndex(sheet)

  var pushed = 0
  for (var i = 1; i < data.length; i++) {
    var row = data[i]
    if (row[syncedCol]) continue
    // A fully blank row (e.g. trailing empty rows in the sheet) has no
    // timestamp and nothing worth sending — skip without marking it, in
    // case a real submission lands there later.
    if (timestampCol >= 0 && !row[timestampCol]) continue

    var values = {}
    for (var col = 0; col < headers.length; col++) {
      if (col === timestampCol || col === syncedCol) continue
      values[headers[col]] = String(row[col] ?? '')
    }
    var submittedAt = timestampCol >= 0 && row[timestampCol] ? new Date(row[timestampCol]) : new Date()
    postToSupabase(values, submittedAt)
    markRowSynced(sheet, i + 1)
    pushed++
    Utilities.sleep(200)
  }
  console.log('syncSheetToSupabase: pushed ' + pushed + ' new row(s) to Supabase.')
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
