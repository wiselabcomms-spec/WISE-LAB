import { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { WiseMark } from '@/components/WiseLabLogo'
import { useAdminAuth } from '@/lib/auth/useAdminAuth'
import { useDocumentMeta } from '@/lib/useDocumentMeta'

export function AdminLoginPage() {
  const { t } = useTranslation()
  const { session, isAdmin, isNotAuthorized, signIn, signOut } = useAdminAuth()
  useDocumentMeta({ title: 'Admin sign in', path: '/admin/login', noIndex: true })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // When the user authenticates but has no admin_profiles row, syncSession
  // sets isNotAuthorized=true. We catch it here: show the error and sign out.
  useEffect(() => {
    if (isNotAuthorized) {
      setSubmitting(false)
      setError('This account is not authorized for admin access.')
      signOut()
    }
  }, [isNotAuthorized, signOut])

  // Wait for isAdmin too, not just session — AdminLayout requires both
  // before it'll show the dashboard (it bounces back here otherwise), and
  // isAdmin resolves slightly after session via a separate async
  // admin_profiles lookup. Navigating on session alone caused the two
  // pages to redirect at each other in that gap.
  if (session && isAdmin) return <Navigate to="/admin" replace />

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    if (error) {
      setSubmitting(false)
      setError(error)
    }
    // On success: keep submitting=true (spinner) while syncSession runs
    // asynchronously. The useEffect above handles isNotAuthorized case;
    // if isAdmin becomes true the Navigate below redirects automatically.
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-beige px-6">
      <Reveal className="w-full max-w-sm">
        <div className="rounded-3xl border border-plum/10 bg-white p-8 shadow-card">
          <div className="flex justify-center">
            <WiseMark className="h-12 w-auto" />
          </div>
          <h1 className="mt-6 text-center font-display text-2xl font-bold text-plum">
            {t('admin.login.title')}
          </h1>

            <form onSubmit={onSubmit} className="mt-8 space-y-5">
              <div className="space-y-2">
                <Label htmlFor="admin-email">{t('admin.login.email')}</Label>
                <Input
                  id="admin-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="admin-password">{t('admin.login.password')}</Label>
                <Input
                  id="admin-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
              {error && <p className="text-[13px] font-medium text-destructive">{error}</p>}
              <Button type="submit" className="w-full" disabled={submitting}>
                {submitting ? t('admin.login.signingIn') : t('admin.login.signIn')}
              </Button>
            </form>
        </div>
      </Reveal>
    </main>
  )
}
