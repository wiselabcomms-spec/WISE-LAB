import { useEffect, useState, useCallback } from 'react'
import { getSupabase } from '@/lib/supabase'
import { useAdminAuth } from './useAdminAuth'

export interface AdminProfile {
  id: string
  full_name: string
  role: string
  email: string | null
  created_at: string
}

interface SuperAdminValue {
  isSuperAdmin: boolean
  admins: AdminProfile[]
  loading: boolean
  error: string | null
  createAdmin: (
    email: string,
    password: string,
    fullName: string,
    role: 'admin' | 'editor'
  ) => Promise<{ error: string | null }>
  deleteAdmin: (id: string) => Promise<{ error: string | null }>
  updatePassword: (id: string, newPassword: string) => Promise<{ error: string | null }>
  refresh: () => Promise<void>
}

const FUNCTION_URL_PATH = '/functions/v1/manage-admins'

/**
 * Hook for super-admin operations (manage other admin accounts).
 * Only meaningful when the current user has role === 'super_admin'.
 * Uses a Supabase Edge Function for privileged auth.admin.* calls
 * (service role key never touches the browser).
 */
export function useSuperAdmin(): SuperAdminValue {
  const { role, session } = useAdminAuth()
  const isSuperAdmin = role === 'super_admin'

  const [admins, setAdmins] = useState<AdminProfile[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // ── Fetch all admin profiles with their auth email ──────────────────────────
  const fetchAdmins = useCallback(async () => {
    if (!isSuperAdmin) return
    const supabase = getSupabase()
    if (!supabase) return

    setLoading(true)
    setError(null)

    try {
      // Use a SECURITY DEFINER RPC function to list all admins.
      // Direct table query is blocked by recursive RLS on admin_profiles;
      // the function bypasses RLS safely and only returns data to super_admins.
      const { data: profiles, error: profilesError } = await supabase
        .rpc('get_all_admin_profiles')

      if (profilesError) {
        setError(profilesError.message)
        return
      }

      const enriched: AdminProfile[] = (profiles ?? []).map((p: {
        id: string; full_name: string; role: string; created_at: string
      }) => ({
        id: p.id,
        full_name: p.full_name,
        role: p.role,
        email: null,
        created_at: p.created_at,
      }))

      // Fetch emails via edge function (if deployed)
      const accessToken = session
          ? (session as { access_token: string }).access_token
          : null

      if (accessToken) {
        const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
        try {
          const res = await fetch(`${supabaseUrl}/functions/v1/manage-admins`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${accessToken}`,
            },
            body: JSON.stringify({ action: 'list_admins', payload: {} }),
          })
          if (res.ok) {
            const { users } = await res.json()
            const emailMap: Record<string, string> = {}
            if (Array.isArray(users)) {
              for (const u of users) emailMap[u.id] = u.email
            }
            for (const admin of enriched) admin.email = emailMap[admin.id] ?? null
          }
        } catch {
          // Edge function not deployed yet — emails will show as null
        }
      }

      setAdmins(enriched)
    } finally {
      setLoading(false)
    }
  }, [isSuperAdmin, session])

  useEffect(() => {
    fetchAdmins()
  }, [fetchAdmins])

  // ── Realtime subscription — refresh on any admin_profiles change ─────────────
  useEffect(() => {
    if (!isSuperAdmin) return
    const supabase = getSupabase()
    if (!supabase) return

    const channel = supabase
      .channel('admin_profiles_changes')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'admin_profiles' },
        () => {
          fetchAdmins()
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [isSuperAdmin, fetchAdmins])

  // ── Edge Function caller ──────────────────────────────────────────────────────
  const callEdgeFunction = useCallback(
    async (action: string, payload: Record<string, unknown>) => {
      const accessToken = session
          ? (session as { access_token: string }).access_token
          : null

      if (!accessToken) return { error: 'Not authenticated' }

      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string

      try {
        const res = await fetch(`${supabaseUrl}${FUNCTION_URL_PATH}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({ action, payload }),
        })

        const json = await res.json()
        if (!res.ok) return { error: json.error ?? 'Unknown error' }
        return { error: null }
      } catch (err) {
        return { error: err instanceof Error ? err.message : 'Network error' }
      }
    },
    [session]
  )

  const createAdmin = useCallback(
    async (
      email: string,
      password: string,
      fullName: string,
      role: 'admin' | 'editor'
    ) => {
      const result = await callEdgeFunction('create_admin', {
        email,
        password,
        full_name: fullName,
        role,
      })
      if (!result.error) await fetchAdmins()
      return result
    },
    [callEdgeFunction, fetchAdmins]
  )

  const deleteAdmin = useCallback(
    async (id: string) => {
      const result = await callEdgeFunction('delete_admin', { id })
      if (!result.error) await fetchAdmins()
      return result
    },
    [callEdgeFunction, fetchAdmins]
  )

  const updatePassword = useCallback(
    async (id: string, newPassword: string) => {
      return callEdgeFunction('update_password', { id, new_password: newPassword })
    },
    [callEdgeFunction]
  )

  return {
    isSuperAdmin,
    admins,
    loading,
    error,
    createAdmin,
    deleteAdmin,
    updatePassword,
    refresh: fetchAdmins,
  }
}
