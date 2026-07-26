import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'
import { DEMO_ACCESS_CODE, DEMO_MODE } from '@/lib/demo/config'

/** Real Supabase sessions carry full session objects; a demo login is just the string 'demo'. */
type AdminSession = Session | 'demo'

interface AdminAuthValue {
  session: AdminSession | null
  loading: boolean
  /** true only if the signed-in user also has a row in `admin_profiles` (see 0001_init.sql RLS), or is a demo login. */
  isAdmin: boolean
  configured: boolean
  /** true when the current session is the hardcoded demo login, not a real Supabase account. */
  isDemo: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  /** Demo mode's single-field login — checks one access code, no email. */
  signInDemo: (code: string) => { error: string | null }
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)

/** Demo sessions live in sessionStorage (not localStorage) so they clear
 * themselves when the browser tab closes, but survive a page reload or a
 * direct URL navigation within the same tab — matching how a real Supabase
 * session behaves, so demo mode doesn't unexpectedly log someone out mid-demo. */
const DEMO_SESSION_KEY = 'wiselab:demoAdmin'

/**
 * Thin wrapper around Supabase auth for the admin portal. Admin accounts are
 * provisioned manually in the `admin_profiles` table (see
 * supabase/migrations) — there's no public sign-up flow, by design.
 *
 * Having a valid Supabase auth session is not the same as being an admin:
 * the `submissions`/`blog_posts` RLS policies gate SELECT on membership in
 * `admin_profiles`, so the client must check the same table to know whether
 * a signed-in user is actually authorized, rather than treating "has a
 * session" as "is an admin".
 */
export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [session, setSession] = useState<AdminSession | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const isDemo = session === 'demo'

  useEffect(() => {
    if (DEMO_MODE && sessionStorage.getItem(DEMO_SESSION_KEY) === 'true') {
      setSession('demo')
      setIsAdmin(true)
      setLoading(false)
      return
    }

    const supabase = getSupabase()
    if (!supabase) {
      setLoading(false)
      return
    }

    let alive = true

    const syncSession = async (s: Session | null) => {
      if (!alive) return
      setSession(s)
      if (!s) {
        setIsAdmin(false)
        return
      }
      const { data } = await supabase
        .from('admin_profiles')
        .select('id')
        .eq('id', s.user.id)
        .maybeSingle()
      if (alive) setIsAdmin(!!data)
    }

    supabase.auth.getSession().then(async ({ data }) => {
      await syncSession(data.session)
      if (alive) setLoading(false)
    })

    const { data: sub } = supabase.auth.onAuthStateChange((_event, s) => {
      // Supabase's own guidance: don't call other Supabase methods directly
      // inside this callback — it runs while the auth lock is held, and
      // syncSession's admin_profiles query internally calls getSession(),
      // which can stall waiting on that same lock. Deferring one tick clears it.
      setTimeout(() => {
        syncSession(s).catch(() => {
          if (alive) setIsAdmin(false)
        })
      }, 0)
    })

    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])

  const signInDemo = (code: string) => {
    if (code !== DEMO_ACCESS_CODE) return { error: 'Incorrect access code.' }
    sessionStorage.setItem(DEMO_SESSION_KEY, 'true')
    setSession('demo')
    setIsAdmin(true)
    return { error: null }
  }

  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: 'Backend is not configured yet.' }
    }

    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) return { error: signInError.message }

    const { data } = await supabase.auth.getSession()
    const user = data.session?.user
    if (!user) return { error: 'Sign-in failed. Please try again.' }

    const { data: profile } = await supabase
      .from('admin_profiles')
      .select('id')
      .eq('id', user.id)
      .maybeSingle()

    if (!profile) {
      await supabase.auth.signOut()
      return { error: 'This account is not authorized for admin access.' }
    }

    return { error: null }
  }

  const signOut = async () => {
    if (session === 'demo') {
      sessionStorage.removeItem(DEMO_SESSION_KEY)
      setSession(null)
      setIsAdmin(false)
      return
    }
    const supabase = getSupabase()
    if (!supabase) return
    await supabase.auth.signOut()
  }

  return (
    <AdminAuthContext.Provider
      value={{
        session,
        loading,
        isAdmin,
        // Always true now: demo mode auto-activates whenever Supabase isn't
        // configured, so there's always a way to sign in (demo or real).
        configured: true,
        isDemo,
        signIn,
        signInDemo,
        signOut,
      }}
    >
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const ctx = useContext(AdminAuthContext)
  if (!ctx) throw new Error('useAdminAuth must be used within AdminAuthProvider')
  return ctx
}
