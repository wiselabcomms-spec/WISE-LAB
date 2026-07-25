import { getSupabase } from '@/lib/supabase'
import type { SubmissionPayload } from './types'

const LOCAL_QUEUE_KEY = 'wiselab:queued-submissions'

function queueLocally(payload: SubmissionPayload) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) ?? '[]')
    existing.push(payload)
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(existing))
  } catch {
    // localStorage unavailable (private mode, SSR, etc.) — swallow, submission
    // still "succeeds" from the user's point of view since there's no backend
    // to fail against anyway.
  }
}

/**
 * Submits a validated application payload.
 *
 * When Supabase isn't configured (no live project provisioned yet — see
 * TODO_FOR_HUMAN.md), this queues the submission to localStorage and
 * resolves successfully so the form UX still completes end-to-end. Once a
 * project exists and VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY are set,
 * this writes straight to the `submissions` table (see
 * supabase/migrations/0001_init.sql).
 */
export async function submitApplication(payload: SubmissionPayload): Promise<void> {
  const supabase = getSupabase()

  if (!supabase) {
    queueLocally(payload)
    return
  }

  const { error } = await supabase.from('submissions').insert({
    track: payload.track,
    values: payload.values,
    analytics: payload.analytics,
    submitted_at: payload.submittedAt,
    meta: payload.meta,
  })

  if (error) throw error
}

interface WiseConnectInquiry extends Record<string, unknown> {
  name: string
  email: string
  inquiryType: string
  message: string
}

/**
 * WISE Connect's contact form isn't a schema-driven /apply/:track
 * application, so it doesn't go through `submitApplication`/`SubmissionPayload`
 * — but it reuses the same `submissions` table (track = 'wise-connect', see
 * supabase/migrations/0004_wise_connect_track.sql) and the same
 * configured-vs-not fallback behavior.
 */
export async function submitWiseConnectInquiry(inquiry: WiseConnectInquiry): Promise<void> {
  const payload = {
    track: 'wise-connect' as const,
    values: inquiry,
    analytics: { inquiryType: inquiry.inquiryType },
    submittedAt: new Date().toISOString(),
    meta: {
      userAgent: typeof navigator !== 'undefined' ? navigator.userAgent : '',
      locale: typeof navigator !== 'undefined' ? navigator.language : 'en',
    },
  }

  const supabase = getSupabase()

  if (!supabase) {
    queueLocally(payload)
    return
  }

  const { error } = await supabase.from('submissions').insert({
    track: payload.track,
    values: payload.values,
    analytics: payload.analytics,
    submitted_at: payload.submittedAt,
    meta: payload.meta,
  })

  if (error) throw error
}
