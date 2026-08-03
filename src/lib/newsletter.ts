import { getSupabase } from '@/lib/supabase'

const LOCAL_QUEUE_KEY = 'wiselab:queued-newsletter-emails'

function queueLocally(email: string) {
  try {
    const existing = JSON.parse(localStorage.getItem(LOCAL_QUEUE_KEY) ?? '[]')
    existing.push({ email, subscribed_at: new Date().toISOString() })
    localStorage.setItem(LOCAL_QUEUE_KEY, JSON.stringify(existing))
  } catch {
    // localStorage unavailable — swallow, same as submitApplication's fallback.
  }
}

/** Thrown when the email is already subscribed, so the form can show a
 *  friendly "you're already on the list" message instead of a generic error. */
export class AlreadySubscribedError extends Error {}

export async function subscribeToNewsletter(email: string): Promise<void> {
  const supabase = getSupabase()

  if (!supabase) {
    queueLocally(email)
    return
  }

  const { error } = await supabase.from('newsletter_subscribers').insert({ email })

  if (error) {
    if (error.code === '23505') throw new AlreadySubscribedError()
    throw error
  }
}
