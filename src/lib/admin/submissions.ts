import { getSupabase } from '@/lib/supabase'
import { DEMO_MODE } from '@/lib/demo/config'
import { getDemoSubmissions } from '@/lib/demo/store'
import type { SubmissionPayload, SubmissionTrack } from '@/lib/forms/types'

export interface StoredSubmission extends SubmissionPayload {
  id: string
}

interface DbRow {
  id: string
  track: SubmissionTrack
  values: Record<string, unknown>
  analytics: Record<string, string | boolean>
  submitted_at: string
  meta: { userAgent: string; locale: string }
}

function fromRow(row: DbRow): StoredSubmission {
  return {
    id: row.id,
    track: row.track,
    values: row.values,
    analytics: row.analytics,
    submittedAt: row.submitted_at,
    meta: row.meta,
  }
}

/** Admin-only: all submissions, newest first. Relies on RLS to gate access. */
export async function listSubmissions(): Promise<StoredSubmission[]> {
  if (DEMO_MODE) return getDemoSubmissions()

  const supabase = getSupabase()
  if (!supabase) return []

  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('submitted_at', { ascending: false })

  if (error || !data) return []
  return (data as DbRow[]).map(fromRow)
}

/** Simple counts-by-dimension aggregation for the admin dashboard's charts. */
export function aggregateByDimension(
  submissions: StoredSubmission[],
  dimension: string
): Record<string, number> {
  const counts: Record<string, number> = {}
  for (const s of submissions) {
    const val = s.analytics[dimension]
    if (val === undefined) continue
    const key = String(val)
    counts[key] = (counts[key] ?? 0) + 1
  }
  return counts
}
