import { useState } from 'react'
import { Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Reveal } from '@/components/Reveal'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { WiseMark } from '@/components/WiseLabLogo'
import { useAdminAuth } from '@/lib/auth/useAdminAuth'
import { DEMO_ACCESS_CODE, DEMO_MODE } from '@/lib/demo/config'
import { useDocumentMeta } from '@/lib/useDocumentMeta'

export function AdminLoginPage() {
  const { t } = useTranslation()
  const { session, isAdmin, signIn, signInDemo } = useAdminAuth()
  useDocumentMeta({ title: 'Admin sign in', path: '/admin/login', noIndex: true })
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  // Wait for isAdmin too, not just session — AdminLayout requires both
  // before it'll show the dashboard (it bounces back here otherwise), and
  // isAdmin resolves slightly after session via a separate async
  // admin_profiles lookup. Navigating on session alone caused the two
  // pages to redirect at each other in that gap.
  if (session && isAdmin) return <Navigate to="/admin" replace />

  const onSubmitDemo = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    if (email === 'demo@wiselab.org.pk' && password === 'WiseLabDemo2026!') {
      const { error } = signInDemo(DEMO_ACCESS_CODE)
      if (error) setError(error)
    } else {
      setError('Invalid login credentials')
    }
  }

  const onSubmitReal = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    const { error } = await signIn(email, password)
    setSubmitting(false)
    if (error) setError(error)
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

          {DEMO_MODE ? (
            <>
              <div className="mt-5 rounded-xl border border-amber-300 bg-amber-50 p-4 text-center text-[13px] text-amber-800">
                <p className="font-semibold uppercase tracking-wide">Demo mode</p>
                <p className="mt-1">
                  Email: <span className="font-semibold">demo@wiselab.org.pk</span><br/>
                  Password: <span className="font-semibold">WiseLabDemo2026!</span>
                </p>
              </div>
              <form onSubmit={onSubmitDemo} className="mt-8 space-y-5">
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
                <Button type="submit" className="w-full">
                  {t('admin.login.signIn')}
                </Button>
              </form>
            </>
          ) : (
            <form onSubmit={onSubmitReal} className="mt-8 space-y-5">
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
          )}
        </div>
      </Reveal>
    </main>
  )
}
