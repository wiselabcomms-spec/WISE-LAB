
/**
 * Demo mode — lets someone click through the admin portal (login,
 * dashboard, submissions, blog) with realistic fake data before a real
 * Supabase project is provisioned, so the platform can be demoed to
 * stakeholders without waiting on infra.
 *
 * Active automatically whenever Supabase isn't configured (no
 * VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY set) — no extra env var or
 * Vercel dashboard step needed. This also means it switches itself off
 * the moment real Supabase credentials are added later: at that point
 * `isSupabaseConfigured` becomes true and the real auth/data path takes
 * over automatically. `VITE_DEMO_MODE=true` can still force it on even
 * with Supabase configured, for testing.
 *
 * Every admin page shows a visible "Demo mode" banner whenever this is
 * on, and the login form only accepts one simple access code — this is
 * intentionally a stand-in for real auth, not a real login, so it must
 * never be mistaken for one once real submissions exist.
 */
export const DEMO_MODE = true // FORCED ON FOR PREVIEW

export const DEMO_ACCESS_CODE = 'wiselab2026'
