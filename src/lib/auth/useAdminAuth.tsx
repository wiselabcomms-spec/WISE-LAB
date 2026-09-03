import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'
import type { Session } from '@supabase/supabase-js'
import { getSupabase } from '@/lib/supabase'
/** Real Supabase sessions carry full session objects. */
type AdminSession = Session

interface AdminAuthValue {
  session: AdminSession | null
  loading: boolean
  /** true only if the signed-in user also has a row in `admin_profiles` (see 0001_init.sql RLS), or is a demo login. */
  isAdmin: boolean
  /** The role of the current admin ('admin' | 'editor' | 'super_admin' | null) */
  role: string | null
  configured: boolean
  /** true when a user successfully authenticated but has no admin_profiles row */
  isNotAuthorized: boolean
  signIn: (email: string, password: string) => Promise<{ error: string | null }>
  signOut: () => Promise<void>
}

const AdminAuthContext = createContext<AdminAuthValue | null>(null)


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
  const [role, setRole] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [isNotAuthorized, setIsNotAuthorized] = useState(false)

  useEffect(() => {
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
        setIsNotAuthorized(false)
        setRole(null)
        return
      }
      const { data } = await supabase
        .from('admin_profiles')
        .select('id, role')
        .eq('id', s.user.id)
        .maybeSingle()
      if (alive) {
        const authorized = !!data
        setIsAdmin(authorized)
        setRole(data?.role ?? null)
        // If the user authenticated successfully but has no admin_profiles row,
        // flag them so the login page can show the right error and sign them out.
        if (!authorized) setIsNotAuthorized(true)
      }
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
          if (alive) {
            setIsAdmin(false)
            setRole(null)
          }
        })
      }, 0)
    })

    return () => {
      alive = false
      sub.subscription.unsubscribe()
    }
  }, [])


  const signIn = async (email: string, password: string) => {
    const supabase = getSupabase()
    if (!supabase) {
      return { error: 'Backend is not configured yet.' }
    }

    setIsNotAuthorized(false)
    const { error: signInError } = await supabase.auth.signInWithPassword({ email, password })
    if (signInError) return { error: signInError.message }

    // Authorization is checked asynchronously by syncSession (triggered via
    // onAuthStateChange). The login page watches `isNotAuthorized` to show
    // the error if the user has no admin_profiles row.
    return { error: null }
  }

  const signOut = async () => {
    setIsNotAuthorized(false)
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
        role,
        configured: !!getSupabase(),
        isNotAuthorized,
        signIn,
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
